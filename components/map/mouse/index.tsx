import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function MouseSphere({ mapScale, setMP }: { mapScale: number, setMP: (pos: THREE.Vector3) => void }) {
    const [mousePosition, setMousePosition] = useState(new THREE.Vector2());
    const sphereRef = useRef<THREE.Mesh>(null);
    const [mousePos, setMousePos] = useState(new THREE.Vector3());

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition(new THREE.Vector2(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            ));
        };

        const handleTouchMove = (event: TouchEvent) => {
            if (event.touches.length > 0) {
                const touch = event.touches[0];
                setMousePosition(new THREE.Vector2(
                    (touch.clientX / window.innerWidth) * 2 - 1,
                    -(touch.clientY / window.innerHeight) * 2 + 1
                ));
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    useEffect(() => {
        // setMP(mousePos);
    }, [mousePos]);

    useFrame(({ camera }) => {
        if (!sphereRef.current) return;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mousePosition, camera);

        const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1);
        const intersection = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersection);
        let mP = new THREE.Vector3().copy(intersection);
        mP.x += mapScale / 2;
        mP.z -= mapScale / 2;
        mP.y = 1;
        setMousePos(mP);

        sphereRef.current.position.set(mP.x, mP.y, mP.z);
    });

    return (
        <mesh ref={sphereRef} position={[0, 1, 0]}>
            <sphereGeometry args={[0.1, 3, 2]} />
            <meshStandardMaterial color="#713e83" flatShading={true} />
        </mesh>
    );
}