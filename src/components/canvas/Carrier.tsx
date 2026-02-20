"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

export function Carrier(props: any) {
    const meshRef = useRef<Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.05; // Slow rotation
        }
    });

    return (
        <group {...props} dispose={null}>
            {/* Main Hull */}
            <mesh ref={meshRef} name="hull" castShadow receiveShadow>
                {/* Hull Body */}
                <capsuleGeometry args={[1, 8, 4, 32]} />
                <meshStandardMaterial
                    color="#f8fafc" // Slate-50 (White/Silver)
                    roughness={0.2}
                    metalness={0.8}
                    envMapIntensity={2}
                />

                {/* Cockpit / Gondola */}
                <mesh position={[0.8, 2, 0]} rotation={[0, 0, 0]}>
                    <boxGeometry args={[0.5, 1.5, 0.6]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
                </mesh>

                {/* Engines */}
                <group position={[0, 0, 0]}>
                    <mesh position={[0.8, -1, 1.2]} rotation={[0, 0, 0]}>
                        <cylinderGeometry args={[0.2, 0.2, 0.8]} />
                        <meshStandardMaterial color="#334155" />
                    </mesh>
                    <mesh position={[0.8, -1, -1.2]} rotation={[0, 0, 0]}>
                        <cylinderGeometry args={[0.2, 0.2, 0.8]} />
                        <meshStandardMaterial color="#334155" />
                    </mesh>
                </group>

                {/* Tail Fins */}
                <group position={[0, -3.5, 0]}>
                    <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 4, 0, 0]}>
                        <boxGeometry args={[0.1, 1.5, 1.5]} />
                        <meshStandardMaterial color="#cbd5e1" />
                    </mesh>
                    <mesh position={[0, 0, -1.2]} rotation={[-Math.PI / 4, 0, 0]}>
                        <boxGeometry args={[0.1, 1.5, 1.5]} />
                        <meshStandardMaterial color="#cbd5e1" />
                    </mesh>
                    <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <boxGeometry args={[0.1, 1.5, 1.5]} />
                        <meshStandardMaterial color="#cbd5e1" />
                    </mesh>
                    <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <boxGeometry args={[0.1, 1.5, 1.5]} />
                        <meshStandardMaterial color="#cbd5e1" />
                    </mesh>
                </group>
            </mesh>

            {/* Drone Bay - Retained for animation logic */}
            <group name="droneBay" position={[0, 0, 0]}>
                {/* Hidden mechanism, the drone will drop from here */}
                <mesh name="drone" position={[0, -0.5, 0]} scale={0.5}>
                    <boxGeometry args={[0.8, 0.5, 0.8]} />
                    <meshStandardMaterial color="#1e293b" />
                    <mesh position={[0, -0.25, 0]}>
                        <cylinderGeometry args={[0.1, 0.1, 0.5]} />
                        <meshBasicMaterial color="#ef4444" /> {/* Red warning light */}
                    </mesh>
                </mesh>
            </group>

            {/* Glow accents */}
            <mesh position={[0, 3, 0]} name="glowRing">
                <ringGeometry args={[1.05, 1.1, 32]} />
                <meshBasicMaterial color="#FFB347" toneMapped={false} />
            </mesh>
        </group>
    );
}
