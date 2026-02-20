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
                <capsuleGeometry args={[1, 8, 4, 16]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.2}
                    metalness={0.8}
                />

                {/* Drone Bay - Child of Hull for now, but better as sibling for independent animation if rigged? 
            Actually, if it's attached to the hull, it moves with it. 
            For the "Drop", we might want to detach it or move it relative to hull.
            Let's keep it simple: The "drone" is inside the bay. 
        */}
            </mesh>

            {/* Drone Bay Indicators / Mechanisms */}
            <group name="droneBay" position={[0, -2, 0]}>
                <mesh castShadow>
                    <boxGeometry args={[1.2, 2, 1.2]} />
                    <meshStandardMaterial
                        color="#0a0b0d"
                        roughness={0.5}
                        metalness={0.5}
                    />
                </mesh>
                {/* The Drone itself, initially hidden or inside */}
                <mesh name="drone" position={[0, 0, 0]}>
                    <boxGeometry args={[0.8, 0.5, 0.8]} />
                    <meshStandardMaterial color="#333" />
                    <mesh position={[0, -0.25, 0]}>
                        <cylinderGeometry args={[0.1, 0.1, 0.5]} />
                        <meshBasicMaterial color="#FFB347" />
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
