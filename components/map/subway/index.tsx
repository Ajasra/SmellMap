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
}

const particleSize = .2;
const particleColor = '#ea9c4e';
const animSpeed = 0.005;
const animPower = 0.004;
const animScale = 200;

const dataFile = '/data/subway/2.csv';

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

export function SubwayPath({mapScale}: { mapScale: number }) {
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

            dummy.position.set(tx * mapScale, tz * mapScale + 2, -ty * mapScale);
            let scale = noise.perlin3(tx * animScale, ty * animScale, tz * animScale + time * animSpeed) * 0.5 + 0.5;
            scale = particleSize;
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();

            meshRef.current.setMatrixAt(index, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    console.log(origData);

    return (
        <instancedMesh ref={meshRef} args={[null, null, origData.length]}>
            <sphereGeometry args={[1, 3, 2]} />
            <meshStandardMaterial
                color={particleColor}
                flatShading={true}
                // transparent={true}
                // opacity={0.8}
            />
        </instancedMesh>
    );
}