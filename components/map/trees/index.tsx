import { useEffect, useState, useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Papa from "papaparse";
import { Noise } from "noisejs";

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

const particleSize = 1 / 20;
const particleColor = "rgba(120, 255, 100, 1)";
const animSpeed = 0.003;
const animPower = 0.004;
const animScale = 50;
const animDistance = 1;

const dataFile = "/data/trees.csv";

const noise = new Noise(Math.random());

function loadCSVData() {
  return fetch(dataFile)
    .then((response) => response.text())
    .then((csv) => {
      return new Promise<DataStructure[]>((resolve, reject) => {
        Papa.parse<DataStructure>(csv, {
          header: true,
          dynamicTyping: true,
          complete: (results: Papa.ParseResult<DataStructure>) => {
            resolve(results.data);
          },
        });
      });
    });
}

function splitData(data: DataStructure[]): [DataStructure[], DataStructure[]] {
  const shuffledData = data.sort(() => 0.5 - Math.random());
  const splitIndex = Math.floor(data.length * 0.4);
  const firstSet = shuffledData.slice(0, splitIndex);
  const secondSet = shuffledData.slice(splitIndex);
  return [firstSet, secondSet];
}

export function MapTrees({
  mapScale,
  MP,
}: {
  mapScale: number;
  MP: THREE.Vector3;
}) {
  const [origData, setOrigData] = useState<DataStructure[]>([]);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { nodes: nodes, materials: materials } = useGLTF("/models/tree.glb");

  useEffect(() => {
    loadCSVData().then((data) => {
      setOrigData(data);
    });
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const time = performance.now() * animSpeed;

    origData.forEach((data, index) => {
      const tx = data.tx;
      const ty = data.ty;
      const tz = data.tz;

      const objectPosition = new THREE.Vector3(
        tx * mapScale,
        tz * mapScale,
        -ty * mapScale,
      );
      const distance = MP.distanceTo(objectPosition);

      let scale =
        noise.perlin3(tx * mapScale, ty * mapScale, tz * mapScale) * 0.5 + 0.5;
      scale = Math.abs(scale);

      if (distance < animDistance) {
        scale = scale - (1 - distance / animDistance) * scale;
      }

      scale = scale * particleSize;

      dummy.position.set(tx * mapScale, tz * mapScale, -ty * mapScale);
      dummy.scale.set(scale, scale, scale);
      let randomRotation =
        noise.simplex2(tx * mapScale, ty * mapScale) * Math.PI;
      dummy.rotation.set(0, randomRotation, 0);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(index, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[nodes.Tree.geometry, materials.Tree, origData.length]}
      />
    </>
  );
}
