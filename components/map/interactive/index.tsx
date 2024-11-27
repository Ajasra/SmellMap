import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { RadiantFieldGeo } from "../../RadiantFieldGeo";
import ModalWindow from "./modalWindow";
import { useAppContext } from "../../context/AppContext";

export function MapInteractive({ mapScale }: { mapScale: number }) {
  const { state, dispatch } = useAppContext();
  const { interactiveObjects, pathId } = state;

  const [selectedObject, setSelectedObject] = useState(null);
  const [clickedObjects, setClickedObjects] = useState<{
    [key: number]: boolean;
  }>({});
  const [modalOpened, setModalOpened] = useState(false);

  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    setScreenHeight(window.innerHeight);
  }, []);

  useFrame(() => {
    interactiveObjects.forEach((obj) => {
      const mesh = meshRefs.current[obj.id];
      if (mesh) {
        mesh.rotation.y += 0.01;
      }
    });
  });

  const meshRefs = useRef<{ [key: number]: THREE.Mesh }>({});

  const handleObjectClick = (objectId) => {
    const obj = interactiveObjects.find((o) => o.id === objectId);
    if (!obj) return;
    setClickedObjects((prev) => ({ ...prev, [obj.id]: !prev[obj.id] }));
    setSelectedObject(obj);
    setModalOpened(true);
  };

  return (
    <>
      {interactiveObjects.map((obj) => (
        <group key={obj.id}>
          <mesh
            ref={(el) => {
              if (el) meshRefs.current[obj.id] = el;
            }}
            position={[obj.x * mapScale, 1.1, -obj.y * mapScale]}
            scale={0.3}
            onClick={() => handleObjectClick(obj.id)}
          >
            <boxGeometry attach="geometry" args={[1, 1, 1]} />
            <meshStandardMaterial
              attach="material"
              color={clickedObjects[obj.id] ? "hotpink" : "orange"}
            />
          </mesh>
          <RadiantFieldGeo
            position={[obj.x * mapScale, 1.1, -obj.y * mapScale]}
            color={new THREE.Color(1, 1, 0)}
          />
        </group>
      ))}

      {selectedObject && (
        <Html
          position={[
            selectedObject.x * mapScale,
            1,
            -selectedObject.y * mapScale,
          ]}
        >
          <ModalWindow
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            title={selectedObject.title}
            description={selectedObject.description}
            link={selectedObject.link}
            model={selectedObject.model}
            screenWidth={screenWidth}
            screenHeight={screenHeight}
          />
        </Html>
      )}
    </>
  );
}
