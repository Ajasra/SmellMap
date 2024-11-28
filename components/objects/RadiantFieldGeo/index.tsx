import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

const animSpeed = 1.5;

class DisplacementMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uPosition: { value: new THREE.Vector3(0, 0, 0) },
        uColor: { value: new THREE.Color(1, 1, 1) },
        uPower: { value: new THREE.Vector3(0.1, 0.1, 0.1) }
      },
      vertexShader: `
        uniform float uTime;
        uniform vec3 uPosition;
        uniform vec3 uPower;
        void main() {
          vec3 pos = position;
          vec3 uPos = position + uPosition;
          pos.x += sin(uPos.y * 10.0 + uTime) * uPower.x;
          pos.y += sin(uPos.x * 10.0 + uTime) * uPower.y;
          pos.z += sin(pos.z * 10.0 + uTime) * uPower.z;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        void main() {
          gl_FragColor = vec4(uColor, 1.0);
        }
      `,
    });
  }
}

extend({ DisplacementMaterial });

export function RadiantFieldGeo({ position, color }: { position: [number, number, number], color: THREE.Color }) {
  const meshRefs = useRef<THREE.LineSegments[]>([]);
  const originalRadii = [0.2, 0.4, 0.7, 0.9, 1.2];
  const [radii, setRadii] = useState(originalRadii);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime() * animSpeed;
    setRadii(originalRadii.map((radius, index) => radius + Math.sin(elapsedTime + index) * 0.1));

    meshRefs.current.forEach((mesh, index) => {
      if (mesh) {
        const material = mesh.material as any;
        material.uniforms.uTime.value = elapsedTime;
        material.uniforms.uColor.value = color;
        material.uniforms.uPosition.value = new THREE.Vector3(position[0], position[1], position[2]);
        material.uniforms.uPower.value = new THREE.Vector3(0.04, 0.04, 0.1);
      }
    });
  });

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      {radii.map((radius, index) => (
        <lineSegments key={index} ref={(el) => (meshRefs.current[index] = el!)}>
          <edgesGeometry args={[new THREE.CircleGeometry(radius, 64)]} />
          <displacementMaterial />
        </lineSegments>
      ))}
    </group>
  );
}