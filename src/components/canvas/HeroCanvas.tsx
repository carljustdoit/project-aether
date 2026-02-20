"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Stars } from "@react-three/drei";
import { Carrier } from "./Carrier";
import { SceneController } from "./SceneController";
import { Suspense } from "react";

export default function HeroCanvas() {
    return (
        <div className="fixed top-0 left-0 w-full h-screen z-0">
            <Canvas
                shadows
                camera={{ position: [0, 0, 10], fov: 35 }}
                gl={{ antialias: true }}
            >
                <Suspense fallback={null}>
                    <SceneController />
                    <color attach="background" args={["#050505"]} />

                    <ambientLight intensity={0.2} />
                    <spotLight
                        position={[10, 10, 10]}
                        angle={0.15}
                        penumbra={1}
                        intensity={1}
                        castShadow
                    />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8E9AAF" />

                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    <Carrier position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={0.5} />

                    <Environment preset="city" />
                    {/* Controls - can be disabled or limited for production interaction */}
                    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                </Suspense>
            </Canvas>
        </div>
    );
}
