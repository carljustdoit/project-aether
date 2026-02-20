"use client";

import { Canvas } from "@react-three/fiber";
import { Cloud, Environment, OrbitControls, Sky } from "@react-three/drei";
import { Carrier } from "./Carrier";
import { Globe } from "./Globe";
import { SceneController } from "./SceneController";
import { Suspense } from "react";

export default function HeroCanvas() {
    return (
        <div className="fixed top-0 left-0 w-full h-screen z-0 bg-gradient-to-b from-blue-50 to-white">
            <Canvas
                shadows
                camera={{ position: [0, 0, 10], fov: 35 }}
                gl={{ antialias: true }}
            >
                <Suspense fallback={null}>
                    <SceneController />
                    {/* V2: Daylight Environment */}
                    <ambientLight intensity={0.8} />
                    <directionalLight
                        position={[10, 10, 5]}
                        intensity={1.5}
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />

                    <Sky sunPosition={[100, 20, 100]} turbidity={0.5} rayleigh={0.5} />
                    <Cloud opacity={0.5} speed={0.4} segments={20} position={[0, -2, -5]} />
                    <Cloud opacity={0.3} speed={0.2} segments={20} position={[0, 5, -10]} />

                    <Carrier position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={0.5} />

                    {/* V2: Globe - Initially hidden/scaled down, controlled by SceneController */}
                    <group name="globeGroup" position={[0, -20, 0]} scale={0}>
                        <Globe />
                    </group>

                    <Environment preset="city" />
                    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                </Suspense>
            </Canvas>
        </div>
    );
}
