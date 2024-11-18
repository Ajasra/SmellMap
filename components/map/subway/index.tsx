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
}

const particleSize = .03;
const animSpeed = 0.005;
const animScale = 200;

const dataFile = '/data/subway.csv';

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

function groupDataByColor(data: DataStructure[]) {
    const groups: DataStructure[][] = [];
    let currentGroup: DataStructure[] = [];

    data.forEach((item, index) => {
        if (index === 0 || (item.r === data[index - 1].r && item.g === data[index - 1].g && item.b === data[index - 1].b)) {
            currentGroup.push(item);
        } else {
            groups.push(currentGroup);
            currentGroup = [];
            currentGroup.push(item);
        }
    });

    return groups;
}

function extractColors(data: DataStructure[][]) {
    const colors: string[] = [];

    data.forEach((item, index  ) => {
        let r = (item[0].r * 255).toFixed(0);
        let g = (item[0].g * 255).toFixed(0);
        let b = (item[0].b * 255).toFixed(0);
        colors.push(`rgb(${r}, ${g}, ${b})`);
    });

    return colors;

}

function SubwayLine({ data, mapScale, color }: { data: DataStructure[], mapScale: number, color: string }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const [progress, setProgress] = useState(0);

    useFrame(() => {
        if (!meshRef.current) return;

        const time = performance.now() * animSpeed;

        setProgress(((time) % data.length));
        data.forEach((item, index) => {
            const tx = item.tx;
            const ty = item.ty;
            const tz = item.tz;

            dummy.position.set(tx * mapScale, tz * mapScale / 2 + 1, -ty * mapScale);
            let scale = noise.perlin3(tx * animScale, ty * animScale, tz * animScale + time * animSpeed) * 0.5 + 0.5;
            scale = particleSize ;
            // if(index > progress) {
            //     scale = scale * 3;
            // }
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();

            meshRef.current.setMatrixAt(index, dummy.matrix);
        });

    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, data.length]}>
            <sphereGeometry args={[1, 3, 2]} />
            <meshStandardMaterial
                flatShading={true}
                color={color}
            />
        </instancedMesh>
    );
}


export function SubwayPath({ mapScale }: { mapScale: number }) {
    const [groupedData, setGroupedData] = useState<DataStructure[][]>([]);
    const [colorMap, setColorMap] = useState<string[]>([]);

    useEffect(() => {
        loadCSVData().then((data) => {
            const grouped = groupDataByColor(data);
            setGroupedData(grouped);

            const colors = extractColors(grouped);
            setColorMap(colors);
        });
    }, []);

   return (
    <>
        {groupedData.map((group, index) => {
            if (group.length > 0) {
                return (
                    <SubwayLine key={index} data={group} mapScale={mapScale} color={colorMap[index]} />
                );
            }
            return null;
        })}
    </>
);
}