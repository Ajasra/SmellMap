import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import {Modal, Image, Text, MantineProvider, Flex} from '@mantine/core';
import {RadiantField} from "../../RadiantField";

interface InteractiveObject {
    id: number;
    title: string;
    description: string;
    link: string;
    x: number;
    y: number;
    model: string;
}

export function MapInteractive({ mapScale, setActiveId, activeId }: { mapScale: number, setActiveId: (id: number) => void, activeId: number | null }) {
    const [interactiveObjects, setInteractiveObjects] = useState<InteractiveObject[]>([]);
    const [clickedObjects, setClickedObjects] = useState<{ [key: number]: boolean }>({});
    const [selectedObject, setSelectedObject] = useState<InteractiveObject | null>(null);
    const [modalOpened, setModalOpened] = useState(false);

    const [screenWidth, setScreenWidth] = useState(0);
    const [screenHeight, setScreenHeight] = useState(0);

    useEffect(() => {
        setScreenWidth(window.innerWidth);
        setScreenHeight(window.innerHeight);
    }, []);


    useEffect(() => {
        fetch('/data/interactive.json')
            .then(response => response.json())
            .then(data => setInteractiveObjects(data));
    }, []);

    useFrame(() => {
        interactiveObjects.forEach((obj) => {
            const mesh = meshRefs.current[obj.id];
            if (mesh) {
                mesh.rotation.y += 0.01;
            }
        });
    });

    const meshRefs = useRef<{ [key: number]: THREE.Mesh }>({});

    const handleObjectClick = (obj: InteractiveObject) => {
        setClickedObjects((prev) => ({ ...prev, [obj.id]: !prev[obj.id] }));
        setSelectedObject(obj);
        setModalOpened(true);
        setActiveId(obj.id);
    };

    return (
        <>
            {interactiveObjects.map((obj) => (
                <>
                    <mesh
                        key={obj.id}
                        ref={(el) => {
                            if (el) meshRefs.current[obj.id] = el;
                        }}
                        position={[obj.x * mapScale, 1.1, -obj.y * mapScale]}
                        scale={.3}
                        onClick={() => handleObjectClick(obj)}
                    >
                        <boxGeometry attach="geometry" args={[1, 1, 1]}/>
                        <meshStandardMaterial attach="material" color={clickedObjects[obj.id] ? 'hotpink' : 'orange'}/>
                    </mesh>
                    <RadiantField position={[obj.x * mapScale, 1.1, -obj.y * mapScale]}/>
                </>

            ))}

            {selectedObject && (
                <Html position={[selectedObject.x * mapScale, 1, -selectedObject.y * mapScale]}>
                    <MantineProvider>
                        <Modal
                            opened={modalOpened}
                            onClose={() => setModalOpened(false)}
                            title={selectedObject.title}
                            styles={{
                                modal: {
                                    width: screenWidth * 0.8,
                                    height: screenHeight * 0.8,
                                // display: 'flex',
                                // flexDirection: 'column',
                                // justifyContent: 'center',
                                alignItems: 'center',
                            },
                            body: {
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
                        }}
                    >
                        <Flex direction='column'>
                            <Text>{selectedObject.description}</Text>
                            {selectedObject.model === 'image' ? (
                                <Image src={selectedObject.link} alt={selectedObject.title} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                            ) : (
                                <video controls style={{ maxWidth: '100%', maxHeight: '100%' }}>
                                    <source src={selectedObject.link} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </Flex>

                    </Modal>
                    </MantineProvider>
                </Html>
            )}
        </>
    );
}