"use client";
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function ProceduralLeaf() {
  const meshRef = useRef();
  const materialRef = useRef();

  // Procedural Leaf Shape using THREE.Shape
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Top tip
    shape.moveTo(0, 3);
    // Right curve
    shape.quadraticCurveTo(2, 0, 0, -3);
    // Left curve
    shape.quadraticCurveTo(-2, 0, 0, 3);

    const extrudeSettings = {
      depth: 0.1,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Constant slow rotation
    meshRef.current.rotation.y += 0.003;
    
    // Slight idle bob
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;

    // Mouse parallax tracking
    const targetX = (state.pointer.x * Math.PI) / 10;
    const targetY = (state.pointer.y * Math.PI) / 10;

    meshRef.current.rotation.x += 0.05 * (targetY - meshRef.current.rotation.x);
    // Add base rotation to Y tracking
    meshRef.current.rotation.y += 0.05 * (targetX);
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Color transition on scroll
    // Starts deep green #3A7D1E and shifts to sick yellow-brown #8B6914
    const colorObj = {
      r: new THREE.Color("#3A7D1E").r,
      g: new THREE.Color("#3A7D1E").g,
      b: new THREE.Color("#3A7D1E").b,
    };

    const targetColor = new THREE.Color("#8B6914");

    gsap.to(colorObj, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
      onUpdate: () => {
        if (materialRef.current) {
          materialRef.current.color.setRGB(colorObj.r, colorObj.g, colorObj.b);
        }
      }
    });

  }, []);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
      <mesh ref={meshRef} geometry={geometry} scale={1.2}>
        <meshStandardMaterial
          ref={materialRef}
          color="#3A7D1E"
          roughness={0.7}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
        {/* Vein lines for extra organic feel */}
        <lineSegments>
          <edgesGeometry args={[geometry, 15]} />
          <lineBasicMaterial color="#2D5A1B" opacity={0.3} transparent />
        </lineSegments>
      </mesh>
    </Float>
  );
}

export default function LeafCanvas() {
  return (
    <div className="w-full h-full relative z-10 hidden md:block">
      <Canvas style={{ background: 'transparent' }} camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} color="#E8F5E0" />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#7CB518" />
        
        <React.Suspense fallback={null}>
          <ProceduralLeaf />
          <Environment preset="forest" />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
