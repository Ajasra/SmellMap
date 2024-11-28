import { useEffect, useState, useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Papa from "papaparse";
import { Noise } from "noisejs";
import { useAppContext } from "../../../context/AppContext";
import { pow2 } from "three/examples/jsm/nodes/math/MathNode";

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

const particleSize = 1 / 3;
const particleColor = "#bbc4b4";
const animSpeed = 0.003;
const animPower = 0.004;
const animScale = 50;
const animDistance = 1.5;

const dataFile = "/data/trees.csv";

const noise = new Noise(Math.random());

function mapValuePow(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  pow: number,
) {
  return (
    Math.pow((value - inMin) / (inMax - inMin), pow) * (outMax - outMin) +
    outMin
  );
}

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

export function MapTrees({ mapScale }: { mapScale: number }) {
  const [origData, setOrigData] = useState<DataStructure[]>([]);
  const meshRefT = useRef<THREE.InstancedMesh>(null);
  // const meshRefL = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { nodes: nodes, materials: materials } = useGLTF("/models/platano.glb");

  const { state, dispatch } = useAppContext();
  const { MP } = state;

  useEffect(() => {
    loadCSVData().then((data) => {
      setOrigData(data);
    });
  }, []);

  useFrame(() => {
    // if (!meshRefT.current || !meshRefL.current) return;

    if (!meshRefT.current) return;
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
        scale = scale * mapValuePow(distance, 0, animDistance, 0.05, 1.2, 2);
      } else if (distance < animDistance * 1.5) {
        scale =
          scale *
          mapValuePow(distance, animDistance, animDistance * 1.5, 1.2, 1, 2);
      }

      scale = scale * particleSize;
      if (index < 2600) scale = scale / 5;

      dummy.position.set(
        tx * mapScale,
        tz * mapScale + scale / 2 + 0.1,
        -ty * mapScale,
      );
      dummy.scale.set(scale, scale, scale);
      let randomRotation =
        noise.simplex2(tx * mapScale, ty * mapScale) * Math.PI;
      dummy.rotation.set(0, randomRotation, 0);
      dummy.updateMatrix();

      meshRefT.current!.setMatrixAt(index, dummy.matrix);
      // meshRefL.current!.setMatrixAt(index, dummy.matrix);
    });

    meshRefT.current.instanceMatrix.needsUpdate = true;
    // meshRefL.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={meshRefT} args={[null, null, origData.length]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial
          color={particleColor}
          flatShading={true}
          // transparent={true}
          // opacity={0.8}
        />
      </instancedMesh>
      {/*<instancedMesh*/}
      {/*    ref={meshRefT}*/}
      {/*    args={[nodes.Tree.geometry, materials.Mat, origData.length]}*/}
      {/*/>*/}
      {/*<instancedMesh*/}
      {/*    ref={meshRefL}*/}
      {/*    args={[nodes.Leafs.geometry, materials.Leafs, origData.length]}*/}
      {/*/>*/}
    </group>
  );
}
