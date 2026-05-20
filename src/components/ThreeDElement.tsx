"use client";

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Ye ek simple 3D shape hai. Baad me yahan Pet ka model ayega.
function AbstractShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Har frame par isko ghumane ke liye
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.5, 64, 64]}>
      {/* MeshDistortMaterial ek premium jelly jaisa effect deta hai */}
      <MeshDistortMaterial 
        color="#F43F5E" // Primary color (Rose)
        attach="material" 
        distort={0.4} // Kitna shape bigdega
        speed={2}     // Kitni tezi se hilega
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

export function ThreeDElement() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 4] }}>
        {/* Lights */}
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} intensity={2} />
        <pointLight position={[-2, -2, -2]} intensity={1} color="#fbbf24" />
        
        {/* The 3D Object */}
        <AbstractShape />
        
        {/* Controls taaki user mouse se ghuma sake */}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}
