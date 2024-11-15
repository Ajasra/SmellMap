import { useEffect, useState, useRef, useMemo } from "react";
// @ts-ignore
import { InstancedMesh, useGLTF } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
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

const particleSize = [0.1, 0.1, 0.1];
const particleColor = "rgba(250, 200, 100, 1)";
const animSpeed = 0.003;
const animPower = 0.004;
const animScale = 50;

const dataFile = "/data/grass.csv";

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

export function MapGrass({ mapScale }: { mapScale: number }) {
  const [origData, setOrigData] = useState<DataStructure[]>([]);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { nodes: nodes, materials: materials } = useGLTF("/models/plant.glb");

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
      dummy.position.set(tx * mapScale, tz * mapScale, -ty * mapScale);
      let scale =
        noise.perlin3(tx * mapScale, ty * mapScale, tz * mapScale) * 0.5 + 0.5;
      scale = scale * 2;
      dummy.scale.set(
        particleSize[0] * scale,
        particleSize[1] * scale,
        particleSize[2] * scale,
      );
      let randomRotation =
        noise.simplex2(tx * mapScale, ty * mapScale) * Math.PI;
      dummy.rotation.set(0, randomRotation, 0);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(index, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[nodes.model.geometry, materials.mat, origData.length]}
      />
    </>
  );
}
