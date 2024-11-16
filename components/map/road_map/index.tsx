import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export function RoadMap( {mapScale }: { mapScale: number }) {
    const texture = useLoader(THREE.TextureLoader, '/maps/roads.jpg');
    const heightMap = useLoader(THREE.TextureLoader, '/maps/height.jpg');
    const alphaMap = useLoader(THREE.TextureLoader, '/maps/roads-alpha.png');

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .3, 0]}>
            <planeGeometry args={[mapScale, mapScale, 1024, 1024]} />
            <meshStandardMaterial
                map={alphaMap}
                alphaMap={alphaMap}
                displacementMap={heightMap}
                displacementScale={mapScale /30}
                transparent={true}
                side={THREE.DoubleSide}
                alphaTest={0.1}
                depthTest={true}
                depthWrite={true}
            />
        </mesh>
    );
}