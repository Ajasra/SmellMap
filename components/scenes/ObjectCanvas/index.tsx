import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { StatueModel } from "../../map/statue";
import { SculptureInteractive } from "../../map/sculptureInt";

export function TopRightCanvas() {
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
      <SculptureInteractive />
    </Canvas>
  );
}
