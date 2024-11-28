import { useEffect, useState } from "react";
import { Box } from "@react-three/drei";
import { useAppContext } from "../../context/AppContext";

const activeColor = "#ccff22"

export function SculptureInteractive() {
  const [actId, setActId] = useState<number | null>(null);

  const { state, dispatch } = useAppContext();
  const { pathes, pathId } = state;

  useEffect(() => {
    setActId(pathId);
  }, [pathId]);

  const handleBoxClick = (id: number) => {
    dispatch({ type: "SET_PATH_ID", payload: id });
  };

  return (
    <>
      {pathes.map((path) => (
        <Box
          key={path.id}
          args={[1, 1, 1]}
          position={[path.position.x, path.position.y, path.position.z]}
          onClick={() => handleBoxClick(path.id)}
        >
          <meshStandardMaterial
            wireframe
            color={actId === path.id ? activeColor : path.color}
          />
        </Box>
      ))}
    </>
  );
}
