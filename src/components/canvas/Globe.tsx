"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Html } from "@react-three/drei";
import * as THREE from "three";

export function Globe(props: any) {
    const globeRef = useRef<THREE.Mesh>(null);
    const atmosphereRef = useRef<THREE.Mesh>(null);

    // Create simple dots to represent network nodes
    const nodes = useMemo(() => {
        return Array.from({ length: 20 }).map(() => ({
            lat: (Math.random() - 0.5) * 160,
            long: (Math.random() - 0.5) * 360,
            size: Math.random() * 0.5 + 0.2
        }));
    }, []);

    useFrame((state, delta) => {
        if (globeRef.current) {
            globeRef.current.rotation.y += delta * 0.05;
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y += delta * 0.06;
        }
    });

    // Convert lat/long to vector3
    const getPos = (lat: number, long: number, radius: number) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (long + 180) * (Math.PI / 180);
        return new THREE.Vector3(
            -(radius * Math.sin(phi) * Math.cos(theta)),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );
    };

    return (
        <group {...props}>
            {/* Earth Sphere */}
            <Sphere ref={globeRef} args={[2, 64, 64]}>
                <meshStandardMaterial
                    color="#2563eb" // Blue-600
                    emissive="#1e3a8a"
                    emissiveIntensity={0.2}
                    roughness={0.7}
                    metalness={0.1}
                />
                {/* Simple continental approximations could be added with texture, 
            but using a solid color + "data points" fits the UI style */}
            </Sphere>

            {/* Atmosphere Glow */}
            <Sphere ref={atmosphereRef} args={[2.2, 64, 64]}>
                <meshPhysicalMaterial
                    color="#93c5fd" // Blue-300
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </Sphere>

            {/* Network Nodes */}
            <group rotation={[0, 0, 0]}> {/* Rotate with earth if child, or separate? separate allows easier tracking */}
                {nodes.map((node, i) => {
                    const pos = getPos(node.lat, node.long, 2.05); // Slightly above surface
                    return (
                        <mesh key={i} position={pos}>
                            <sphereGeometry args={[0.04, 16, 16]} />
                            <meshBasicMaterial color="#F59E0B" />
                            <Html distanceFactor={10}>
                                <div className="w-2 h-2 bg-amber-500 rounded-full opacity-50 animate-ping" />
                            </Html>
                        </mesh>
                    )
                })}
            </group>
        </group>
    );
}
