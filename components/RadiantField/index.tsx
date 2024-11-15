import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

// Create a custom shader material
const RippleMaterial = shaderMaterial(
  {
    uTime: 0,
    uSpeed: 0.5,
      uLineWidth: 0.002,
      uColor: new THREE.Color(1, 1, 1),
      uPosition: new THREE.Vector3(0, 0, 0),
  },
    // Vertex shader
    `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uPosition;

  // Simplex noise function
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    vec4 j = p - 49.0 * floor(p * (1.0 / 49.0));
    vec4 x_ = floor(j * (1.0 / 7.0));
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * C.x + D.xxxx;
    vec4 y = y_ * C.x + D.xxxx;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    vUv = uv;
    vec3 pos = position + uPosition;
    // pos.z += snoise(vec3(pos.xy * 2.0, uTime * 0.1)) * 0.1;
    pos.x += snoise(vec3(pos.xy / 1.5, uTime * 0.1)) * 0.1;
    pos.y += snoise(vec3(pos.xy / 1.5, uTime * 0.1)) * 0.1;
    pos.z += snoise(vec3(pos.xy / 1.5, uTime * 0.1)) * 0.05;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  // Fragment shader
  `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uLineWidth;
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform vec3 uPosition;


  void main() {
    vec2 p = vUv - 0.5;
    float radius = length(p);
    float ripple = abs(sin((radius - uTime * uSpeed) * 30.0));
    ripple = smoothstep(uLineWidth, uLineWidth + 0.05, ripple);
    ripple = 1.0 - ripple;
    gl_FragColor = vec4(uColor,ripple*.7);
  }
  `
);

extend({ RippleMaterial });

export function RadiantField({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI/2, 0, 0]}>
      <planeGeometry args={[5, 5, 64, 64]} />
      <rippleMaterial uSpeed={0.05} transparent uColor={new THREE.Color(1, 1, 0)}  />
    </mesh>
  );
}