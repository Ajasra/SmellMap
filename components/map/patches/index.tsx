import * as THREE from "three";
import { useAppContext } from "../../context/AppContext";
import React, { useEffect, useRef, useState } from "react";
import { RadiantFieldGeo } from "../../objects/RadiantFieldGeo";
import { randInt } from "three/src/math/MathUtils";
import { extend } from "@react-three/fiber";
import {
  MeshLine,
  MeshLineMaterial,
  MeshLineGeometry,
} from "@lume/three-meshline";
extend({ MeshLine, MeshLineGeometry, MeshLineMaterial });

const pathPlayTime = 10;

export function Patches({ mapScale }: { mapScale: number }) {
  const [activePatch, setActivePatch] = useState(null);
  const [hoveredObject, setHoveredObject] = useState(null);
  const lineRef = useRef<THREE.Mesh>(null);
  const [color, setColor] = useState(new THREE.Color(0x000000));
  const [linePoints, setLinePoints] = useState([]);

  const [nextPath, setNextPath] = useState(0);

  const { state, dispatch } = useAppContext();
  const { MP, pathData, chapterId, pathes, pathId, isPlaying } = state;

  useEffect(() => {
    let actPath = pathes.find((path) => path.id === pathId);
    if (actPath) {
      setActivePatch(actPath);
    }
  }, [pathData, pathes, pathId]);

  useEffect(() => {
    console.log(pathData.pathData);
    // if (lineRef.current && pathData.pathData.length > 0) {
    if (pathData.pathData.length > 0) {
      let pt = [];
      const points = pathData.pathData.map(
        (point) =>
          new THREE.Vector3(point.x * mapScale, 0.9, -point.y * mapScale),
      );
      points.forEach((point) => {
        pt.push(point.x, point.y, point.z);
      });
      setLinePoints(pt);
    }
  }, [pathData.pathData, mapScale, pathId]);

  useEffect(() => {
    if (activePatch) {
      setColor(new THREE.Color(activePatch.color));
    }
  }, [activePatch]);

  function updateChapterId(chapterId: number) {
    dispatch({ type: "SET_CHAPTER_ID", payload: chapterId });
    dispatch({ type: "SET_IS_PLAYING", payload: true });
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPlaying) {
        if (nextPath === 0) {
          nextPathPlay();
        } else {
          setNextPath((prev) => prev - 1);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, nextPath]);

  function nextPathPlay() {
    const nextPathIndex = randInt(1, pathes.length);
    setNextPath(pathPlayTime);
    dispatch({ type: "SET_PATH_ID", payload: nextPathIndex });
  }

  // @ts-ignore
  return (
    <>
      {activePatch &&
        activePatch.points &&
        pathData.pointsData.length > 0 &&
        pathData.pointsData.map((patch, index) => {
          const isHighlighted = index === chapterId - 1;
          const isHovered = index === hoveredObject;
          return (
            <group
              key={patch.x + patch.y + patch.z}
              position={[patch.x * mapScale, 1, -patch.y * mapScale]}
              scale={0.3}
            >
              <mesh
                onClick={() => updateChapterId(index + 1)}
                scale={isHovered ? 1.5 : 1}
                onPointerOver={() => setHoveredObject(index)}
                onPointerOut={() => setHoveredObject(null)}
              >
                <coneGeometry attach="geometry" args={[0.3, 0.3, 3]} />
                <meshStandardMaterial
                  attach="material"
                  color={isHovered ? activePatch.colorArrow : activePatch.color}
                />
              </mesh>
              {isHighlighted && isPlaying ? (
                <RadiantFieldGeo position={[0, -0.5, 0]} color={color} />
              ) : (
                <></>
              )}
            </group>
          );
        })}
      {activePatch && pathData.pathData.length > 0 && (
        <meshLine>
          <meshLineGeometry attach="geometry" points={linePoints} />
          <meshLineMaterial attach="material" lineWidth={0.1} color={color} />
        </meshLine>
      )}
    </>
  );
}
