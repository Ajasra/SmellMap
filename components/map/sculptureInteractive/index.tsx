import { useEffect, useState } from 'react';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

interface InteractiveItem {
    id: number;
    title: string;
    description: string;
    link: string;
    x: number;
    y: number;
    model: string;
    sculpture: {
        x: number;
        y: number;
        z: number;
    };
}

export function SculptureInteraxctive({ setActiveId, activeId, cameraRef, mapScale }: { setActiveId: (id: number) => void, activeId: number | null, cameraRef: React.RefObject<THREE.PerspectiveCamera>, mapScale: number }) {
    const [interactiveData, setInteractiveData] = useState<InteractiveItem[]>([]);
    const [actId, setActId] = useState<number | null>(null);

    useEffect(() => {
        fetch('/data/interactive.json')
            .then(response => response.json())
            .then(data => setInteractiveData(data))
            .catch(error => console.error('Error loading interactive data:', error));
    }, []);

    useEffect(() => {
        if (actId !== activeId) {
            setActId(activeId);
        }

        if (activeId !== null && cameraRef.current) {
            const activeItem = interactiveData.find(item => item.id === activeId);
            // alert(activeItem.x);
            if (activeItem) {
                const x = activeItem.x
                const z = activeItem.y;
                const y = 1;
                const targetPosition = new THREE.Vector3(
                    x * 10 - 5,
                    y ,
                    z * 10 - 5
                );

                // alert(activeId + " " + targetPosition.x + " " + targetPosition.y + " " + targetPosition.z);
                //
                // const currentPosition = cameraRef.current.position.clone();
                // const newPosition = new THREE.Vector3();
                // newPosition.lerpVectors(currentPosition, targetPosition, 0.1);
                //
                // cameraRef.current.position.copy(newPosition);
                // cameraRef.current.lookAt(targetPosition);
            }
        }
    }, [activeId, interactiveData, cameraRef, mapScale]);

    const handleBoxClick = (id: number) => {
        setActId(id);
        setActiveId(id);
    };

    return (
        <>
            {interactiveData.map(item => (
                <Box
                    key={item.id}
                    args={[1, 1, 1]}
                    position={[item.sculpture.x, item.sculpture.y, item.sculpture.z]}
                    onClick={() => handleBoxClick(item.id)}
                >
                    <meshStandardMaterial wireframe color={actId === item.id ? 'blue' : 'red'} />
                </Box>
            ))}
        </>
    );
}