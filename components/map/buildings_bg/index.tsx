import { useEffect, useState, useRef, useMemo } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
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
const animSpeed = 0.003;

const animDistance = 1;

const dataFile = '/data/buildings.csv';

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

export function MapBuildingsBg({ mapScale, MP }: { mapScale: number, MP: THREE.Vector3 }) {
    const [origData, setOrigData] = useState<DataStructure[]>([]);
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const texture = useLoader(THREE.TextureLoader, '/textures/concrete.jpg');

    useEffect(() => {
        loadCSVData().then((data) => {
            setOrigData(data);
        });

    }, []);

    useFrame(() => {
        if (!meshRef.current) return;

        origData.forEach((data, index) => {
            const tx = data.tx;
            const ty = data.ty;
            const tz = data.tz;
            const s = data.scale;
            const objectPosition = new THREE.Vector3(tx * mapScale, tz * mapScale, -ty * mapScale);
            const distance = MP.distanceTo(objectPosition);

            let scale = s;
            if (distance < animDistance) {
                scale = s - (1 - distance / animDistance) * s;
            }

            dummy.position.set(tx * mapScale, (tz * mapScale) + (particleSize[1] * scale / 2), -ty * mapScale);
            dummy.scale.set(
                particleSize[0] * scale, particleSize[1] * scale, particleSize[2] * scale);
            dummy.updateMatrix();

            meshRef.current.setMatrixAt(index, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <instancedMesh ref={meshRef} args={[null, null, origData.length]}>
                <boxGeometry args={[1, 1, 1]}/>
                <meshPhongMaterial
                    map={texture}
                    transparent={true}
                    opacity={0.8}
                />
            </instancedMesh>
        </>
    );
}