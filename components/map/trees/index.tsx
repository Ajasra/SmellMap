import { useEffect, useState, useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
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

const particleSize = [.05, .05, .05];
const particleColor = 'rgba(120, 255, 100, 1)';
const animSpeed = 0.003;
const animPower = 0.004;
const animScale = 50;

const dataFile = '/data/trees.csv';

const noise = new Noise(Math.random());

function loadCSVData() {
    return fetch(dataFile)
        .then(response => response.text())
        .then(csv => {
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

export function MapTrees({ mapScale }: { mapScale: number }) {
    const [origData, setOrigData] = useState<DataStructure[]>([]);
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const { nodes, materials } = useGLTF('/models/tree.glb');

    console.log(nodes, materials);

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
            dummy.position.set(tx * mapScale, tz * mapScale + particleSize[2] / 2, -ty * mapScale);
            let scale = noise.perlin3(tx * mapScale, ty * mapScale, tz * mapScale) *.7 + 0.5;
            dummy.scale.set(
                particleSize[0] * scale, particleSize[1] * scale, particleSize[2] * scale);
            let randomRotation = noise.simplex2(tx*mapScale, ty*mapScale) * Math.PI;
            dummy.rotation.set(0, randomRotation, 0);
            dummy.updateMatrix();

            meshRef.current!.setMatrixAt(index, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });


    return (
        <instancedMesh ref={meshRef} args={[nodes.Tree.geometry, materials.Tree, origData.length]} />
    );

}