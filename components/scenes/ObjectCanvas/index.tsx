import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {StatueModel} from "../../map/statue";
import {SculptureInteraxctive} from "../../map/sculptureInteractive";
import * as THREE from 'three';

const backgroundCol = "#eeeeee";

export function TopRightCanvas({ setActiveId, activeId, cameraRef, mapScale }: { setActiveId: (id: number) => void, activeId: number | null, cameraRef: React.RefObject<THREE.PerspectiveCamera>, mapScale: number }) {

    return (
        <Canvas
            camera={{ position: [0, 2, 7] }}
            style={{
                width: "40vw",
                height: "30vh",
                position: "absolute",
                top: 0,
                right: 0,
                pointerEvents: "auto",
            }}
            gl={{ alpha: true }}
        >
            <ambientLight intensity={0.8} />
            <directionalLight position={[2, 2, 2]} intensity={2} />
            <OrbitControls maxPolarAngle={Math.PI / 2 - Math.PI / 12} />
            <StatueModel />
            <SculptureInteraxctive setActiveId={setActiveId} activeId={activeId} cameraRef={cameraRef} mapScale={mapScale} />
        </Canvas>
    );
}