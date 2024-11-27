import { useGLTF } from "@react-three/drei";
import { useRef } from "react";

const scale = 0.8;

export function StatueModel() {
  const { scene } = useGLTF("/models/statue.glb");
  const ref = useRef();

  return (
    <primitive
      object={scene}
      ref={ref}
      scale={scale} // Adjust the scale values as needed
      position={[0, -3, 0]} // Adjust the position values as needed
    />
  );
}
