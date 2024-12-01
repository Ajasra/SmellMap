"use client";

// @ts-ignore
import css from "/components/Scenes/MapScene/MapScene.module.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useEffect, useState } from "react";
import { MapRiver } from "../../map/elements/water";
import { MapTrees } from "../../map/elements/trees";
import { MapBuildingsBg } from "../../map/elements/buildings_bg";
import { MapInteractive } from "../../map/interactive";
import { RoadMap } from "../../map/road_map";
import { MouseSphere } from "../../objects/mouse";

import * as THREE from "three";
import { TopRightCanvas } from "../ObjectCanvas";
import { MapLake } from "../../map/elements/Lake";
import { useAppContext } from "../../context/AppContext";
import { Vector3 } from "three";
import { Patches } from "../../map/patches";
import InstructionModal from "../../UI/Instruction";

const scale = 30;
const offset = new Vector3(-scale / 2, 0, scale / 2);

export function MapScene() {
  const [MP, setMP] = useState(new THREE.Vector3());

  const { state, dispatch } = useAppContext();
  const { isLoaded } = state;
  const [showInstruction, setShowInstruction] = useState(true);

  useEffect(() => {
    dispatch({ type: "SET_IS_LOADED", payload: false });
    dispatch({ type: "SET_CHAPTER_ID", payload: 0 });
  }, []);

  const handleCanvasCreated = () => {
    dispatch({ type: "SET_IS_LOADED", payload: true });
  };

  const handleCloseInstruction = () => {
    setShowInstruction(false);
  };

  return (
    <div className={css.container}>
      {!isLoaded && <div className="loader">Loading...</div>}
      {showInstruction && <InstructionModal onClose={handleCloseInstruction} />}

      <Canvas
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        gl={{ alpha: true }}
        onCreated={handleCanvasCreated}
      >
        <PerspectiveCamera makeDefault position={[0, 12, 10]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <OrbitControls maxPolarAngle={Math.PI / 2 - Math.PI / 12} />
        <RoadMap mapScale={scale} />
        <group position={offset}>
          <MapRiver mapScale={scale} />
          <MapLake mapScale={scale} />
          <MapTrees mapScale={scale} />
          <MapBuildingsBg mapScale={scale} />
          <MapInteractive mapScale={scale} />
          <MouseSphere mapScale={scale} />
          {/*<SubwayPath mapScale={scale} />*/}
          <Patches mapScale={scale} />
        </group>
      </Canvas>
      <TopRightCanvas />
    </div>
  );
}
