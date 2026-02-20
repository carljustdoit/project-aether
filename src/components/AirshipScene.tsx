"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Color constants ─── */
const AMBER = new THREE.Color(0xd4a853);
const AMBER_DIM = new THREE.Color(0xd4a853).multiplyScalar(0.3);
const AMBER_BRIGHT = new THREE.Color(0xf5c542);
const STEEL = new THREE.Color(0x7a8594).multiplyScalar(0.5);
const HULL_COLOR = new THREE.Color(0x1a2230);
const GAS_CELL_COLOR = new THREE.Color(0xd4a853);

// Alias "line" to avoid conflict with SVG <line> tag in TypeScript/JSX
const ThreeLine = "line" as any;

/* ─── Mouse tracker ─── */
function useMousePosition() {
    const mouse = useRef({ x: 0, y: 0 });
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("mousemove", handler);
        return () => window.removeEventListener("mousemove", handler);
    }, []);
    return mouse;
}

/* ─── Hull solid envelope (semi-transparent) ─── */
function HullEnvelope() {
    const geo = useMemo(() => {
        const shape = new THREE.SphereGeometry(1, 64, 32);
        shape.scale(3.2, 1, 1);
        return shape;
    }, []);

    return (
        <mesh geometry={geo}>
            <meshPhysicalMaterial
                color={HULL_COLOR}
                transparent
                opacity={0.35}
                roughness={0.6}
                metalness={0.2}
                side={THREE.DoubleSide}
                depthWrite={false}
            />
        </mesh>
    );
}

/* ─── Hull wireframe overlay ─── */
function HullWireframe() {
    const geo = useMemo(() => {
        const shape = new THREE.SphereGeometry(1, 48, 24);
        shape.scale(3.2, 1, 1);
        return new THREE.EdgesGeometry(shape, 15);
    }, []);

    return (
        <lineSegments geometry={geo}>
            <lineBasicMaterial color={AMBER_DIM} transparent opacity={0.4} />
        </lineSegments>
    );
}

/* ─── Panel seam lines (horizontal bands across hull) ─── */
function PanelSeams() {
    const lines = useMemo(() => {
        const result: THREE.BufferGeometry[] = [];
        // Horizontal panel seams at different heights
        const seams = [-0.7, -0.35, 0, 0.35, 0.7];
        for (const yNorm of seams) {
            const points: THREE.Vector3[] = [];
            for (let t = -1; t <= 1; t += 0.01) {
                const x = t * 3.2;
                const rMax = Math.sqrt(Math.max(0, 1 - t * t));
                if (Math.abs(yNorm) > rMax) continue;
                const z = Math.sqrt(Math.max(0, rMax * rMax - yNorm * yNorm));
                points.push(new THREE.Vector3(x, yNorm, z));
            }
            if (points.length > 2) {
                result.push(new THREE.BufferGeometry().setFromPoints(points));
            }
            // Back side
            const backPoints = points.map(p => new THREE.Vector3(p.x, p.y, -p.z));
            if (backPoints.length > 2) {
                result.push(new THREE.BufferGeometry().setFromPoints(backPoints));
            }
        }
        return result;
    }, []);

    return (
        <group>
            {lines.map((geo, i) => (
                <ThreeLine key={i} geometry={geo}>
                    <lineBasicMaterial color={AMBER_DIM} transparent opacity={0.2} />
                </ThreeLine>
            ))}
        </group>
    );
}

/* ─── Structural ribs (cross-section rings) ─── */
function StructuralRibs() {
    const ribs = useMemo(() => {
        const positions: number[] = [-2.8, -2.2, -1.5, -0.8, 0, 0.8, 1.5, 2.2, 2.8];
        return positions.map((x) => {
            const r = Math.sqrt(Math.max(0, 1 - (x / 3.2) ** 2));
            return { x, r };
        });
    }, []);

    return (
        <group>
            {ribs.map((rib, i) => (
                <group key={i}>
                    <mesh position={[rib.x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                        <ringGeometry args={[rib.r * 0.95, rib.r, 32]} />
                        <meshBasicMaterial color={AMBER_DIM} transparent opacity={0.2} side={THREE.DoubleSide} />
                    </mesh>
                    {/* Inner structural ring */}
                    <mesh position={[rib.x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                        <ringGeometry args={[rib.r * 0.7, rib.r * 0.72, 32]} />
                        <meshBasicMaterial color={AMBER_DIM} transparent opacity={0.1} side={THREE.DoubleSide} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

/* ─── Longitudinal stringers ─── */
function Stringers() {
    const lines = useMemo(() => {
        const result: THREE.BufferGeometry[] = [];
        const count = 16;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const points: THREE.Vector3[] = [];
            for (let t = -1; t <= 1; t += 0.02) {
                const x = t * 3.2;
                const r = Math.sqrt(Math.max(0, 1 - t * t));
                const y = r * Math.cos(angle);
                const z = r * Math.sin(angle);
                points.push(new THREE.Vector3(x, y, z));
            }
            result.push(new THREE.BufferGeometry().setFromPoints(points));
        }
        return result;
    }, []);

    return (
        <group>
            {lines.map((geo, i) => (
                <ThreeLine key={i} geometry={geo}>
                    <lineBasicMaterial color={AMBER_DIM} transparent opacity={0.12} />
                </ThreeLine>
            ))}
        </group>
    );
}

/* ─── Internal gas cells (glowing volumes) ─── */
function GasCells() {
    const cells = useMemo(() => {
        const positions: number[] = [-2.0, -1.0, 0, 1.0, 2.0];
        return positions.map((x) => {
            const rMax = Math.sqrt(Math.max(0, 1 - (x / 3.2) ** 2));
            return { x, r: rMax * 0.55 };
        });
    }, []);

    const matRef = useRef<THREE.MeshBasicMaterial[]>([]);

    useFrame(({ clock }) => {
        matRef.current.forEach((mat, i) => {
            if (mat) {
                mat.opacity = 0.04 + Math.sin(clock.elapsedTime * 0.8 + i * 1.2) * 0.02;
            }
        });
    });

    return (
        <group>
            {cells.map((cell, i) => (
                <mesh key={i} position={[cell.x, 0, 0]}>
                    <sphereGeometry args={[cell.r, 16, 12]} />
                    <meshBasicMaterial
                        ref={(el: THREE.MeshBasicMaterial | null) => { if (el) matRef.current[i] = el; }}
                        color={GAS_CELL_COLOR}
                        transparent
                        opacity={0.05}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
}

/* ─── Gondola (command pod) — more detailed ─── */
function Gondola() {
    const boxGeo = useMemo(() => {
        const box = new THREE.BoxGeometry(0.9, 0.3, 0.4, 4, 2, 2);
        return new THREE.EdgesGeometry(box, 1);
    }, []);

    const strutGeo = useMemo(() => {
        const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.42, 0)];
        return new THREE.BufferGeometry().setFromPoints(points);
    }, []);

    // Window band geometry (horizontal strip)
    const windowGeo = useMemo(() => {
        const box = new THREE.BoxGeometry(0.7, 0.06, 0.42);
        return box;
    }, []);

    return (
        <group position={[0.3, -1.08, 0]}>
            {/* Solid body */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.9, 0.3, 0.4]} />
                <meshPhysicalMaterial
                    color={HULL_COLOR}
                    transparent
                    opacity={0.6}
                    roughness={0.5}
                    metalness={0.3}
                />
            </mesh>
            {/* Wireframe edges */}
            <lineSegments geometry={boxGeo}>
                <lineBasicMaterial color={AMBER} transparent opacity={0.7} />
            </lineSegments>
            {/* Window band glow */}
            <mesh position={[0, 0.02, 0]}>
                <boxGeometry args={[0.7, 0.04, 0.42]} />
                <meshBasicMaterial color={AMBER_BRIGHT} transparent opacity={0.15} />
            </mesh>
            {/* Struts */}
            {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
                <ThreeLine key={i} geometry={strutGeo} position={[x, 0.15, 0]}>
                    <lineBasicMaterial color={AMBER_DIM} transparent opacity={0.4} />
                </ThreeLine>
            ))}
            {/* Gondola glow */}
            <pointLight color={AMBER} intensity={0.5} distance={2.5} position={[0, -0.1, 0]} />
        </group>
    );
}

/* ─── Cargo bay (open bay under hull) ─── */
function CargoBay() {
    const bayGeo = useMemo(() => {
        const box = new THREE.BoxGeometry(1.2, 0.15, 0.5, 3, 1, 2);
        return new THREE.EdgesGeometry(box, 1);
    }, []);

    return (
        <group position={[-0.3, -0.85, 0]}>
            <lineSegments geometry={bayGeo}>
                <lineBasicMaterial color={AMBER} transparent opacity={0.4} />
            </lineSegments>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.2, 0.15, 0.5]} />
                <meshPhysicalMaterial
                    color={HULL_COLOR}
                    transparent
                    opacity={0.3}
                    roughness={0.7}
                    metalness={0.1}
                />
            </mesh>
            {/* Drone dock indicators */}
            {[-0.4, -0.15, 0.1, 0.35].map((x, i) => (
                <mesh key={i} position={[x, -0.08, 0]}>
                    <boxGeometry args={[0.12, 0.02, 0.12]} />
                    <meshBasicMaterial color={AMBER} transparent opacity={0.3} />
                </mesh>
            ))}
        </group>
    );
}

/* ─── Tail fins (solid + wireframe) ─── */
function TailFins() {
    const finShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(-0.9, 0.55);
        shape.lineTo(-1.1, 0.15);
        shape.lineTo(-0.3, -0.05);
        shape.lineTo(0, 0);
        return shape;
    }, []);

    const finGeo = useMemo(() => new THREE.ShapeGeometry(finShape), [finShape]);
    const finEdge = useMemo(() => new THREE.EdgesGeometry(finGeo, 1), [finGeo]);

    const rotations: [number, number, number][] = [
        [0, 0, 0],
        [0, 0, Math.PI],
        [Math.PI / 2, 0, 0],
        [-Math.PI / 2, 0, 0],
    ];

    return (
        <group position={[-3.0, 0, 0]}>
            {rotations.map((rot, i) => (
                <group key={i} rotation={rot}>
                    {/* Solid fin */}
                    <mesh geometry={finGeo}>
                        <meshPhysicalMaterial
                            color={HULL_COLOR}
                            transparent
                            opacity={0.4}
                            roughness={0.5}
                            metalness={0.2}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                    {/* Wireframe fin */}
                    <lineSegments geometry={finEdge}>
                        <lineBasicMaterial color={AMBER} transparent opacity={0.6} />
                    </lineSegments>
                </group>
            ))}
        </group>
    );
}

/* ─── Solar panel array (top of hull) ─── */
function SolarPanels() {
    const panels = useMemo(() => {
        const result: { x: number, y: number, z: number, w: number, h: number }[] = [];
        for (let i = -3; i <= 3; i++) {
            const x = i * 0.65;
            const rMax = Math.sqrt(Math.max(0, 1 - (x / 3.2) ** 2));
            const y = rMax * 0.98; // Sit on top surface
            result.push({ x, y, z: 0, w: 0.5, h: 0.35 });
        }
        return result;
    }, []);

    return (
        <group>
            {panels.map((p, i) => (
                <group key={i} position={[p.x, p.y, p.z]}>
                    <mesh rotation={[0.3, 0, 0]}>
                        <planeGeometry args={[p.w, p.h]} />
                        <meshBasicMaterial
                            color={new THREE.Color(0x1a2a45)}
                            transparent
                            opacity={0.5}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                    <mesh rotation={[0.3, 0, 0]}>
                        <planeGeometry args={[p.w, p.h]} />
                        <meshBasicMaterial
                            color={AMBER_DIM}
                            transparent
                            opacity={0.15}
                            side={THREE.DoubleSide}
                            wireframe
                        />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

/* ─── Propeller Nacelles (with solid body) ─── */
function PropellerNacelles() {
    const nacelleGeo = useMemo(() => {
        const cyl = new THREE.CylinderGeometry(0.12, 0.08, 0.5, 8);
        cyl.rotateZ(Math.PI / 2);
        return cyl;
    }, []);
    const nacelleEdge = useMemo(() => new THREE.EdgesGeometry(nacelleGeo, 1), [nacelleGeo]);

    const pylonGeo = useMemo(() => {
        const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.35, 0)];
        return new THREE.BufferGeometry().setFromPoints(points);
    }, []);

    const positions: [number, number, number][] = [
        [1.5, -0.72, 0.82],
        [1.5, -0.72, -0.82],
        [-1.5, -0.52, 0.72],
        [-1.5, -0.52, -0.72],
    ];

    return (
        <group>
            {positions.map((pos, i) => (
                <group key={i} position={pos}>
                    {/* Pylon */}
                    <ThreeLine geometry={pylonGeo}>
                        <lineBasicMaterial color={AMBER_DIM} transparent opacity={0.4} />
                    </ThreeLine>
                    {/* Solid nacelle */}
                    <mesh geometry={nacelleGeo}>
                        <meshPhysicalMaterial
                            color={HULL_COLOR}
                            transparent
                            opacity={0.5}
                            roughness={0.4}
                            metalness={0.3}
                        />
                    </mesh>
                    {/* Wireframe nacelle */}
                    <lineSegments geometry={nacelleEdge}>
                        <lineBasicMaterial color={AMBER} transparent opacity={0.5} />
                    </lineSegments>
                    {/* Propeller disc */}
                    <PropellerDisc />
                    {/* Nacelle glow */}
                    <pointLight color={AMBER} intensity={0.15} distance={1} position={[0.3, 0, 0]} />
                </group>
            ))}
        </group>
    );
}

function PropellerDisc() {
    const ref = useRef<THREE.Group>(null!);
    useFrame((_, delta) => {
        // Spin around local Z axis — which, after the parent's [0,0,π/2] rotation,
        // aligns with the nacelle's thrust axis (X in world space). This creates
        // the correct propeller-like rotation around the engine shaft.
        if (ref.current) ref.current.rotation.z += delta * 8;
    });

    return (
        <group ref={ref} position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            {/* Blade 1 */}
            <mesh rotation={[0, 0, 0]}>
                <planeGeometry args={[0.03, 0.35]} />
                <meshBasicMaterial color={AMBER} transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
            {/* Blade 2 */}
            <mesh rotation={[0, 0, Math.PI / 3]}>
                <planeGeometry args={[0.03, 0.35]} />
                <meshBasicMaterial color={AMBER} transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
            {/* Blade 3 */}
            <mesh rotation={[0, 0, -Math.PI / 3]}>
                <planeGeometry args={[0.03, 0.35]} />
                <meshBasicMaterial color={AMBER} transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
            {/* Hub */}
            <mesh>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshBasicMaterial color={AMBER} transparent opacity={0.5} />
            </mesh>
            {/* Prop wash ring */}
            <mesh>
                <ringGeometry args={[0.16, 0.18, 24]} />
                <meshBasicMaterial color={AMBER_DIM} transparent opacity={0.1} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}

/* ─── Dimension lines (animated) ─── */
function DimensionLines() {
    const matRef = useRef<THREE.LineBasicMaterial>(null!);

    useFrame(({ clock }) => {
        if (matRef.current) {
            matRef.current.opacity = 0.25 + Math.sin(clock.elapsedTime * 1.5) * 0.1;
        }
    });

    const lengthLine = useMemo(() => {
        const pts = [new THREE.Vector3(-3.3, 1.4, 0), new THREE.Vector3(3.3, 1.4, 0)];
        return new THREE.BufferGeometry().setFromPoints(pts);
    }, []);
    const serif1 = useMemo(() => {
        const pts = [new THREE.Vector3(-3.3, 1.3, 0), new THREE.Vector3(-3.3, 1.5, 0)];
        return new THREE.BufferGeometry().setFromPoints(pts);
    }, []);
    const serif2 = useMemo(() => {
        const pts = [new THREE.Vector3(3.3, 1.3, 0), new THREE.Vector3(3.3, 1.5, 0)];
        return new THREE.BufferGeometry().setFromPoints(pts);
    }, []);
    const heightLine = useMemo(() => {
        const pts = [new THREE.Vector3(3.8, -1.1, 0), new THREE.Vector3(3.8, 1.1, 0)];
        return new THREE.BufferGeometry().setFromPoints(pts);
    }, []);
    const hSerif1 = useMemo(() => {
        const pts = [new THREE.Vector3(3.7, -1.1, 0), new THREE.Vector3(3.9, -1.1, 0)];
        return new THREE.BufferGeometry().setFromPoints(pts);
    }, []);
    const hSerif2 = useMemo(() => {
        const pts = [new THREE.Vector3(3.7, 1.1, 0), new THREE.Vector3(3.9, 1.1, 0)];
        return new THREE.BufferGeometry().setFromPoints(pts);
    }, []);

    const mat = <lineBasicMaterial ref={matRef} color={STEEL} transparent opacity={0.3} />;

    return (
        <group>
            {[lengthLine, serif1, serif2, heightLine, hSerif1, hSerif2].map((geo, i) => (
                <ThreeLine key={i} geometry={geo}>{mat}</ThreeLine>
            ))}
        </group>
    );
}

/* ─── Floating particles ─── */
function AtmosphereParticles() {
    const count = 300;
    const ref = useRef<THREE.Points>(null!);

    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 14;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 7;
        }
        return arr;
    }, []);

    const sizes = useMemo(() => {
        const arr = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            arr[i] = 0.01 + Math.random() * 0.02;
        }
        return arr;
    }, []);

    useFrame(({ clock }) => {
        if (!ref.current) return;
        const arr = ref.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
            arr[i * 3 + 1] += Math.sin(clock.elapsedTime * 0.4 + i) * 0.0008;
            arr[i * 3] += 0.0008;
            if (arr[i * 3] > 7) arr[i * 3] = -7;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial color={AMBER} size={0.015} transparent opacity={0.35} sizeAttenuation />
        </points>
    );
}

/* ─── Scanning beam effect ─── */
function ScanBeam() {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame(({ clock }) => {
        if (!ref.current) return;
        const t = (clock.elapsedTime * 0.25) % 1;
        ref.current.position.x = -3.5 + t * 7;
        (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.04 + Math.sin(t * Math.PI) * 0.03;
    });

    return (
        <mesh ref={ref}>
            <planeGeometry args={[0.03, 3.5]} />
            <meshBasicMaterial color={AMBER_BRIGHT} transparent opacity={0.06} side={THREE.DoubleSide} />
        </mesh>
    );
}

/* ─── Hull glow rim ─── */
function HullGlow() {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame(({ clock }) => {
        if (!ref.current) {
            return;
        }
        (ref.current.material as THREE.MeshBasicMaterial).opacity =
            0.03 + Math.sin(clock.elapsedTime * 0.6) * 0.015;
    });

    const geo = useMemo(() => {
        const shape = new THREE.SphereGeometry(1.02, 32, 16);
        shape.scale(3.2, 1, 1);
        return shape;
    }, []);

    return (
        <mesh ref={ref} geometry={geo}>
            <meshBasicMaterial
                color={AMBER}
                transparent
                opacity={0.04}
                side={THREE.BackSide}
                depthWrite={false}
            />
        </mesh>
    );
}

/* ─── Main scene composition ─── */
function AirshipModel() {
    const groupRef = useRef<THREE.Group>(null!);
    const mouse = useMousePosition();
    const smoothMouse = useRef({ x: 0, y: 0 });

    useFrame(({ clock }) => {
        if (!groupRef.current) return;

        smoothMouse.current.x += (mouse.current.x * 0.15 - smoothMouse.current.x) * 0.03;
        smoothMouse.current.y += (mouse.current.y * 0.1 - smoothMouse.current.y) * 0.03;

        const bob = Math.sin(clock.elapsedTime * 0.5) * 0.05;

        groupRef.current.rotation.y = smoothMouse.current.x + Math.PI * 0.05;
        groupRef.current.rotation.x = smoothMouse.current.y + bob * 0.3;
        groupRef.current.position.y = bob;
    });

    return (
        <group ref={groupRef} scale={1.1}>
            <HullEnvelope />
            <HullWireframe />
            <HullGlow />
            <PanelSeams />
            <StructuralRibs />
            <Stringers />
            <GasCells />
            <SolarPanels />
            <Gondola />
            <CargoBay />
            <TailFins />
            <PropellerNacelles />
            <DimensionLines />
            <ScanBeam />
            <AtmosphereParticles />
        </group>
    );
}

/* ─── Exported component ─── */
export function AirshipScene() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="absolute inset-0 z-0" />;

    return (
        <div className="absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0.3, 5.5], fov: 48 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.15} />
                <directionalLight position={[5, 3, 5]} intensity={0.4} color={0xffeedd} />
                <directionalLight position={[-3, -1, -3]} intensity={0.15} color={0x8090b0} />
                <AirshipModel />
            </Canvas>
        </div>
    );
}
