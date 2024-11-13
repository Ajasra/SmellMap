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

const particleSize = [0.3, 0.7, 0.3];
const particleColor = 'rgba(100, 100, 100, 1)';
const animSpeed = 0.003;
const animPower = 0.004;
const animScale = 50;

const dataFile = '/data/buildings_b.csv';

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

export function MapBuildingsBg({ mapScale }: { mapScale: number }) {
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
            const tx = data.tx;
            const ty = data.ty;
            const tz = data.tz;
            dummy.position.set(tx * mapScale, tz * mapScale + particleSize[2]/2, -ty * mapScale);
            let scale = noise.perlin3(tx, ty, tz) * 0.5 + 0.5;
            dummy.scale.set(
                particleSize[0] * scale, particleSize[1] * scale, particleSize[2] * scale);
            // dummy.rotation.set(-Math.PI/2, 0, 0);
            dummy.updateMatrix();

            meshRef.current.setMatrixAt(index, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, origData.length]}>
            <boxGeometry args={[1, 1]}/>
            <meshPhongMaterial
                color={particleColor}
                transparent={true}
                opacity={0.8}
            />
        </instancedMesh>
    );
}