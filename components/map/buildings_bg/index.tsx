import { useEffect, useState, useRef, useMemo } from "react";
import { extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Papa from "papaparse";
import { Noise } from "noisejs";
import { useGLTF } from "@react-three/drei";

interface DataStructure {
  tx: number;
  ty: number;
  tz: number;
  r: number;
  g: number;
  b: number;
  a: number;
  scale: number;
  shape: number;
}

const particleSize = 1 / 5;
const animSpeed = 0.003;
const particleColor = "#d5d6d6";
const animDistance = 1;
const dataFile = "/data/buildings.csv";
const noise = new Noise(Math.random());

function loadCSVData() {
  return fetch(dataFile)
    .then((response) => response.text())
    .then((csv) => {
      return new Promise<DataStructure[]>((resolve, reject) => {
        Papa.parse<DataStructure>(csv, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            resolve(results.data);
          },
        });
      });
    });
}

export function MapBuildingsBg({
  mapScale,
  MP,
}: {
  mapScale: number;
  MP: THREE.Vector3;
}) {
  const [origData, setOrigData] = useState<DataStructure[]>([]);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  // const { nodes: nodes, materials: materials } = useGLTF(
  //   "/models/building.glb",
  // );
  const { scene } = useThree();
  const [envMap, setEnvMap] = useState<THREE.Texture | null>(null);



  useEffect(() => {
    loadCSVData().then((data) => {
      setOrigData(data);
    });

    const loader = new THREE.TextureLoader();
    loader.load('public/textures/env.jpg', (texture) => {
      const envMap = new THREE.WebGLCubeRenderTarget(texture.image.height).fromEquirectangularTexture(scene.renderer, texture);
      setEnvMap(envMap.texture);
      scene.environment = envMap.texture;
    });

  }, [scene]);

  useFrame(() => {
    if (!meshRef.current) return;

    origData.forEach((data, index) => {
      const tx = data.tx;
      const ty = data.ty;
      const tz = data.tz;
      const s = data.scale;
      const objectPosition = new THREE.Vector3(
        tx * mapScale,
        tz * mapScale,
        -ty * mapScale,
      );
      const distance = MP.distanceTo(objectPosition);

      let scale = s;
      if (distance < animDistance) {
        scale = s - (1 - distance / animDistance) * s;
      }

      scale = scale * particleSize;

      dummy.position.set(
        tx * mapScale,
        tz * mapScale + (scale * s) / 2 + 0.1,
        -ty * mapScale,
      );
      dummy.scale.set(scale, scale * s, scale);
      // dummy.rotation.set(0, Math.PI / 4, 0);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(index, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, origData.length]}>
      <boxGeometry  />
      <meshPhongMaterial color={particleColor} flatShading={true} shininess={100} reflectivity={1} envMap={envMap} />
    </instancedMesh>
  );
}
