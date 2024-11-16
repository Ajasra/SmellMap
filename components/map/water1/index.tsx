import { useEffect, useState, useRef, useMemo } from 'react';
import { InstancedMesh } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Papa from 'papaparse';
import { Noise } from 'noisejs';

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

const particleSize = [0.05, 0.05, 0.05];
const particleColor = '#b8f0ed';
const animSpeed = 0.005;
const animPower = 0.004;
const animScale = 200;

const dataFile = '/data/lake.csv';

const noise = new Noise(Math.random());

function loadCSVData() {
  return fetch(dataFile)
    .then(response => response.text())
    .then(csv => {
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

export function MapLake({mapScale}: { mapScale: number }) {
  const [origData, setOrigData] = useState<DataStructure[]>([]);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    loadCSVData().then((data) => {
      setOrigData(data);
    });
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const time = performance.now() * animSpeed;
    origData.forEach((data, index) => {
      const tx = data.tx + (Math.sin(time + data.tx * animScale) * animPower + Math.sin(time * 0.5 + data.ty * animScale/10) * animPower * .1) / 8;
      const ty = data.ty + Math.sin(time + data.ty * animScale) * animPower * 0.5 + Math.sin(time * 0.5 + data.tz * animScale/10) * animPower * .1 ;
      const tz = data.tz + (Math.sin(time + data.tz * animScale) * animPower + Math.sin(time * 0.5 + data.tx * animScale/10) * animPower * .1) / 8 + noise.perlin3(data.tx * animScale/4, data.ty * animScale/4 + time * animSpeed, data.tz * animScale/4) * 0.05;

      dummy.position.set(tx * mapScale, tz * mapScale * .3, -ty * mapScale);
      let scale = noise.perlin3(tx * animScale, ty * animScale, tz * animScale + time * animSpeed) * 0.5 + 0.5;
      dummy.scale.set(particleSize[0] * scale, particleSize[1] * scale, particleSize[2] * scale);

      dummy.updateMatrix();

      meshRef.current.setMatrixAt(index, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, origData.length]}>
      <sphereGeometry args={[1, 5, 5]} />
      <meshStandardMaterial
          color={particleColor}
          transparent={true}
          opacity={0.8}
      />
    </instancedMesh>
  );
}