import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus, Sphere, MeshDistortMaterial, Environment, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useSBMIStore } from '../../store/useSBMIStore';

const RotatingTorus: React.FC<{ color: string }> = ({ color }) => {
    const torusRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (torusRef.current) {
            // Slow rotation
            torusRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            torusRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <Torus ref={torusRef} args={[2.8, 0.6, 32, 100]} rotation={[Math.PI / 2, 0, 0]}>
            {/* 
        We want a material that looks like glass/wireframe or sophisticated. 
        MeshDistortMaterial gives a liquid feel.
      */}
            <MeshDistortMaterial
                color={color}
                envMapIntensity={1}
                clearcoat={1}
                clearcoatRoughness={0}
                metalness={0.1}
                distort={0.3}
                speed={1.5}
                transmission={0.5} // glass-like (if using MeshPhysicalMaterial, but Distort is fun)
                opacity={0.8}
                transparent
            />
        </Torus>
    );
};

const IndicatorSphere: React.FC<{ bmi: number }> = ({ bmi }) => {
    // Map BMI roughly to position on ring (simplified)
    // 18.5 -> -1, 30 -> 1. Range 12 units map to 2 units? No, let's just create a floaty orb.

    const sphereRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (sphereRef.current) {
            const t = state.clock.getElapsedTime();
            sphereRef.current.position.y = Math.sin(t) * 0.2;
        }
    });

    return (
        <Sphere ref={sphereRef} args={[0.3, 32, 32]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} toneMapped={false} />
        </Sphere>
    );
}


export const SBMITorus: React.FC = () => {
    const { result } = useSBMIStore();
    const color = result?.sbmiColor || '#4b5563'; // Default grey

    return (
        <div className="w-full h-[300px] sm:h-[400px]">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Environment preset="city" />
                <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />

                <group>
                    <RotatingTorus color={color} />
                    <IndicatorSphere bmi={result?.bmi || 20} />
                </group>
            </Canvas>
        </div>
    );
};
