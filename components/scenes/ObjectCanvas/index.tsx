import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { StatueModel } from "../../objects/statue";
import { SculptureInteractive } from "../../objects/sculptureInt";

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
      <OrbitControls enableZoom={false} enablePan={false} />
      <StatueModel />
      <SculptureInteractive />
    </Canvas>
  );
}
