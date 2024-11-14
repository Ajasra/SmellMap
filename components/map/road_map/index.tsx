import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export function RoadMap( {mapScale }: { mapScale: number }) {
    const texture = useLoader(THREE.TextureLoader, '/maps/roads.png');
    const heightMap = useLoader(THREE.TextureLoader, '/maps/height.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[mapScale, mapScale, 512, 512]} />
            <meshStandardMaterial
                map={texture}
                alphaMap={texture}
                displacementMap={heightMap}
                displacementScale={0.1 * mapScale}
                transparent={true}
                // side={THREE.DoubleSide}
            />
        </mesh>
    );
}