import * as THREE from "three";
import { useAppContext } from "../../context/AppContext";
import { useEffect, useRef, useState } from "react";
import { RadiantFieldGeo } from "../../objects/RadiantFieldGeo";
import { MeshLine } from "three.meshline";
import "../../objects/MeshLine/index.ts";

export function Patches({ mapScale }: { mapScale: number }) {
  const { state, dispatch } = useAppContext();
  const [activePatch, setActivePatch] = useState(null);
  const [hoveredObject, setHoveredObject] = useState(null);
  const { MP, pathData, chapterId, pathes, pathId } = state;
  const lineRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    let actPath = pathes.find((path) => path.id === pathId);
    if (actPath) {
      setActivePatch(actPath);
    }
  }, [pathData, pathes, pathId]);

  useEffect(() => {
    if (lineRef.current && pathData.pathData.length > 0) {
      const points = pathData.pathData.map(
        (point) =>
          new THREE.Vector3(point.x * mapScale, 1.1, -point.y * mapScale),
      );
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(100),
      );
      const line = new MeshLine();
      line.setGeometry(geometry);
      lineRef.current.geometry = line.geometry;
    }
  }, [pathData.pathData, mapScale]);

  function updateChapterId(chapterId: number) {
    dispatch({ type: "SET_CHAPTER_ID", payload: chapterId });
  }

  return (
    <>
      {activePatch &&
        activePatch.points &&
        pathData.pointsData.length > 0 &&
        pathData.pointsData.map((patch, index) => {
          const isHighlighted = index === activePatch.points - chapterId;
          const isHovered = index === hoveredObject;
          return (
            <group
              key={patch.x + patch.y + patch.z}
              position={[patch.x * mapScale, 1.2, -patch.y * mapScale]}
              scale={.3}
            >
              <mesh
                  onClick={() => updateChapterId(activePatch.points - index)}
                  scale={isHovered ? 1.5: 1}
                  onPointerOver={() => setHoveredObject(index)}
                  onPointerOut={() => setHoveredObject(null)}

              >
                <coneGeometry attach="geometry" args={[0.5, 0.5, 3]} />
                <meshStandardMaterial
                  attach="material"
                  color={isHovered ? activePatch.colorArrow: activePatch.color}
                />
              </mesh>
              {isHighlighted && (
                <RadiantFieldGeo
                  position={[0, 0, 0]}
                  color={new THREE.Color(activePatch.color)}
                />
              )}
            </group>
          );
        })}
      {activePatch && pathData.pathData.length > 0 && (
        <mesh ref={lineRef}>
          <meshLineMaterial
            attach="material"
            color={new THREE.Color(activePatch.color)}
            lineWidth={0.03}
          />
        </mesh>
      )}
    </>
  );
}
