import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import * as THREE from "three";

interface Path {
  position: THREE.Vector3;
  id: number;
  title: string;
  description: string;
  modelFile: string;
  points: number;
  color: string;
  colorArrow: string;
}

interface InteractiveObject {
  id: number;
  title: string;
  description: string;
  link: string;
  x: number;
  y: number;
  model: string;
}

interface AppState {
  MP: THREE.Vector3;
  menu: string;
  pathId: number;
  chapterId: number;
  lastActive: Date;
  volume: number;
  isLoaded: boolean;
  isDebug: boolean;
  isPlaying: boolean;
  pathes: Path[];
  interactiveObjects: InteractiveObject[];
  pathData: { pathData: []; pointsData: [] };
}

type Action =
  | { type: "SET_MP"; payload: THREE.Vector3 }
  | { type: "SET_MENU"; payload: string }
  | { type: "SET_PATH_ID"; payload: number }
  | { type: "SET_CHAPTER_ID"; payload: number }
  | { type: "SET_LAST_ACTIVE"; payload: Date }
  | { type: "SET_PATHES"; payload: Path[] }
  | { type: "SET_VOLUME"; payload: number }
  | { type: "SET_IS_LOADED"; payload: boolean }
  | { type: "SET_INTERACTIVE"; payload: InteractiveObject[] }
  | { type: "SET_PATH_DATA"; payload: { pathData: []; pointsData: [] } }
  | { type: "SET_IS_PLAYING"; payload: boolean };

const initialState: AppState = {
  MP: new THREE.Vector3(),
  menu: "path",
  pathId: 1,
  chapterId: 0,
  lastActive: new Date(),
  pathes: [],
  volume: 0.5,
  isLoaded: false,
  isDebug: false,
  interactiveObjects: [],
  pathData: { pathData: [], pointsData: [] },
  isPlaying: false,
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_MP":
      return { ...state, MP: action.payload };
    case "SET_MENU":
      return { ...state, menu: action.payload };
    case "SET_PATH_ID":
      return { ...state, pathId: action.payload };
    case "SET_CHAPTER_ID":
      return { ...state, chapterId: action.payload };
    case "SET_LAST_ACTIVE":
      return { ...state, lastActive: action.payload };
    case "SET_PATHES":
      return { ...state, pathes: action.payload };
    case "SET_VOLUME":
      return { ...state, volume: action.payload };
    case "SET_IS_LOADED":
      return { ...state, isLoaded: action.payload };
    case "SET_INTERACTIVE":
      return { ...state, interactiveObjects: action.payload };
    case "SET_PATH_DATA":
      return { ...state, pathData: action.payload };
    case "SET_IS_PLAYING":
      return { ...state, isPlaying: action.payload };
    default:
      return state;
  }
};

interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadPathes = async () => {
      if (state.pathes.length === 0) {
        const response = await fetch("/pathes/pathes.json");
        const data: Path[] = await response.json();
        dispatch({ type: "SET_PATHES", payload: data });
      }
    };
    loadPathes();
  }, [state.pathes.length]);

  useEffect(() => {
    const loadInteractiveObjects = async () => {
      if (state.interactiveObjects.length === 0) {
        const response = await fetch("/data/interactive.json");
        const data: InteractiveObject[] = await response.json();
        dispatch({ type: "SET_INTERACTIVE", payload: data });
      }
    };
    loadInteractiveObjects();
  }, [state.interactiveObjects.length]);

  useEffect(() => {
    return () => {
      dispatch({ type: "SET_PATHES", payload: [] });
      dispatch({ type: "SET_INTERACTIVE", payload: [] });
    };
  }, []);

  useEffect(() => {
    const loadPathData = async () => {
      const processCSV = (text: string) => {
        return text
          .replace(/\r/g, "") // Remove \r characters
          .split("\n")
          .slice(1) // Ignore the first row (titles)
          .map((row) => row.split(","))
          .filter(
            (row) => row.length > 1 && row.some((cell) => cell.trim() !== ""),
          ) // Remove empty rows
          .map((row) => ({
            x: parseFloat(row[0]),
            y: parseFloat(row[1]),
            z: parseFloat(row[2]),
          }));
      };

      let pathData = [];
      let pointsData = [];

      try {
        const pathResponse = await fetch(`/pathes/${state.pathId}/path.csv`);
        if (!pathResponse.ok) throw new Error("Path file not found");
        const pathText = await pathResponse.text();
        pathData = processCSV(pathText);
      } catch {
        pathData = [];
      }

      try {
        const pointsResponse = await fetch(
          `/pathes/${state.pathId}/points.csv`,
        );
        if (!pointsResponse.ok) throw new Error("Points file not found");
        const pointsText = await pointsResponse.text();
        pointsData = processCSV(pointsText);
      } catch {
        pointsData = [];
      }

      dispatch({ type: "SET_PATH_DATA", payload: { pathData, pointsData } });
    };

    loadPathData();
    dispatch({ type: "SET_CHAPTER_ID", payload: 0 });
    dispatch({ type: "SET_IS_PLAYING", payload: false });
  }, [state.pathId]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
