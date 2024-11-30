import * as THREE from "three";
import { useAppContext } from "../../context/AppContext";
import React, { useEffect, useState } from "react";
import { RadiantFieldGeo } from "../../objects/RadiantFieldGeo";
import { randInt } from "three/src/math/MathUtils";
import { extend, useFrame } from "@react-three/fiber";
import {
  MeshLine,
  MeshLineMaterial,
  MeshLineGeometry,
} from "@lume/three-meshline";
extend({ MeshLine, MeshLineGeometry, MeshLineMaterial });
import { Text } from "@react-three/drei";

const pathPlayTime = 5;
const animSpeed = 0.3;

export function Patches({ mapScale }: { mapScale: number }) {
  const [activePatch, setActivePatch] = useState(null);
  const [hoveredObject, setHoveredObject] = useState(null);
  const [color, setColor] = useState(new THREE.Color(0x000000));
  const [linePoints, setLinePoints] = useState([]);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [length, setLength] = useState(0);
  const [progress, setProgress] = useState(0);
  const [wait, setWait] = useState(pathPlayTime);

  const [curState, setCurState] = useState(0);

  const [nextPath, setNextPath] = useState(0);

  const { state, dispatch } = useAppContext();
  const { MP, pathData, chapterId, pathes, pathId, isPlaying, isDebug } = state;

  useEffect(() => {
    let actPath = pathes.find((path) => path.id === pathId);
    if (actPath) {
      setActivePatch(actPath);
    }
  }, [pathData, pathes, pathId]);

  useEffect(() => {
    if (pathData.pathData.length > 0) {
      let pt = [];
      const points = pathData.pathData.map(
        (point) =>
          new THREE.Vector3(point.x * mapScale, 0.9, -point.y * mapScale),
      );

      let length = 0;
      for (let i = 0; i < points.length - 1; i++) {
        length += points[i].distanceTo(points[i + 1]);
      }
      setLength(length);

      points.forEach((point) => {
        pt.push(point.x, point.y, point.z);
      });
      setLinePoints(pt);
      setProgress(0);
      setCurState(1);
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
      if (nextPath < 0) {
        if (!isPlaying && curState === 5) {
          nextPathPlay();
          setNextPath((prev) => prev - 1);
        }
        if (!isPlaying && curState === 4) {
          setCurState(5);
        }
      }
      setNextPath((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, nextPath, curState]);

  function nextPathPlay() {
    const nextPathIndex = randInt(1, pathes.length);
    // const nextPathIndex = pathId + 1;
    setNextPath(10);
    dispatch({ type: "SET_PATH_ID", payload: nextPathIndex });
  }

  useFrame((state, delta) => {
    let points = [];
    switch (curState) {
      case 1:
        if (progress < length) {
          if (linePoints.length === 0) return;

          let pr = Math.min(length, progress + delta * animSpeed * length);
          setProgress(pr);

          let currentLength = 0;
          let currentPoints = [linePoints[0], linePoints[1], linePoints[2]];

          for (let i = 0; i < linePoints.length - 1; i += 3) {
            const start = new THREE.Vector3(
              linePoints[i],
              linePoints[i + 1],
              linePoints[i + 2],
            );
            const end = new THREE.Vector3(
              linePoints[i + 3],
              linePoints[i + 4],
              linePoints[i + 5],
            );
            const segmentLength = start.distanceTo(end);

            if (currentLength + segmentLength >= progress) {
              const remainingLength = progress - currentLength;
              const direction = end.clone().sub(start).normalize();
              const newEnd = start
                .clone()
                .add(direction.multiplyScalar(remainingLength));
              currentPoints.push(newEnd.x, newEnd.y, newEnd.z);
              // currentPoints.push(start.x, start.y, start.z);
              break;
            } else {
              currentPoints.push(end.x, end.y, end.z);
              currentLength += segmentLength;
            }
          }

          points = currentPoints;
        } else {
          if (length > 0) {
            setCurState(2);
            setWait(pathPlayTime);
          }
        }
        break;
      case 2:
        if (!isPlaying) {
          if (wait > 0) {
            const waitTime = wait - delta;
            setWait(waitTime);
          } else {
            setCurState(3);
          }
        }
        break;
      case 3:
        if (!isPlaying) {
          if (progress > 0) {
            let pr = Math.max(0, progress - delta * animSpeed * length * 2);
            setProgress(pr);

            let currentLength = 0;
            let currentPoints = [linePoints[0], linePoints[1], linePoints[2]];

            for (let i = 0; i < linePoints.length - 1; i += 3) {
              const start = new THREE.Vector3(
                linePoints[i],
                linePoints[i + 1],
                linePoints[i + 2],
              );
              const end = new THREE.Vector3(
                linePoints[i + 3],
                linePoints[i + 4],
                linePoints[i + 5],
              );
              const segmentLength = start.distanceTo(end);

              if (currentLength + segmentLength >= progress) {
                const remainingLength = progress - currentLength;
                const direction = end.clone().sub(start).normalize();
                const newEnd = start
                  .clone()
                  .add(direction.multiplyScalar(remainingLength));
                currentPoints.push(newEnd.x, newEnd.y, newEnd.z);
                break;
              } else {
                currentPoints.push(end.x, end.y, end.z);
                currentLength += segmentLength;
              }
            }

            points = currentPoints;
          } else {
            setCurState(4);
          }
        }
        break;
      default:
        break;
    }

    setCurrentPoints(points);
  });

  const getCurrentLinePoints = () => {
    let currentLength = 0;
    let currentPoints = [linePoints[0]];

    for (let i = 0; i < linePoints.length - 1; i += 3) {
      const start = new THREE.Vector3(
        linePoints[i],
        linePoints[i + 1],
        linePoints[i + 2],
      );
      const end = new THREE.Vector3(
        linePoints[i + 3],
        linePoints[i + 4],
        linePoints[i + 5],
      );
      const segmentLength = start.distanceTo(end);

      if (currentLength + segmentLength > length * progress) {
        const remainingLength = length * progress - currentLength;
        const direction = end.clone().sub(start).normalize();
        const newEnd = start
          .clone()
          .add(direction.multiplyScalar(remainingLength));
        currentPoints.push(newEnd.x, newEnd.y, newEnd.z);
        break;
      } else {
        currentPoints.push(end.x, end.y, end.z);
        currentLength += segmentLength;
      }
    }

    return currentPoints;
  };

  // @ts-ignore
  return (
    <>
      {activePatch &&
        (curState === 2 || curState === 3) &&
        activePatch.points &&
        pathData.pointsData.length > 0 &&
        pathData.pointsData.map((patch, index) => {
          const isHighlighted = index === chapterId - 1;
          const isHovered = index === hoveredObject;
          return (
            <group
              key={patch.x + patch.y + patch.z}
              position={[patch.x * mapScale, 1.3, -patch.y * mapScale]}
              scale={0.4}
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
              {isDebug && (
                <Text
                  position={[0, 0.8, 0]}
                  fontSize={1}
                  color={color}
                  anchorX="center"
                  anchorY="middle"
                >
                  {index + 1}
                </Text>
              )}
              {isHighlighted && isPlaying ? (
                <RadiantFieldGeo position={[0, -0.5, 0]} color={color} />
              ) : (
                <></>
              )}
            </group>
          );
        })}
      {activePatch && curState !== 4 && pathData.pathData.length > 0 && (
        <meshLine
        // onClick={() => updateChapterId(1)}
        >
          <meshLineGeometry attach="geometry" points={currentPoints} />
          <meshLineMaterial attach="material" lineWidth={0.1} color={color} />
        </meshLine>
      )}
    </>
  );
}
