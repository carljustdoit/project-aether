"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

/* ─── Color constants (light-theme-friendly) ─── */
const AMBER = new THREE.Color(0xc48a20);
const AMBER_DIM = new THREE.Color(0xc48a20).multiplyScalar(0.4);
const AMBER_BRIGHT = new THREE.Color(0xe5a830);
const HULL_COLOR = new THREE.Color(0x2a3a50);
const GAS_CELL_COLOR = new THREE.Color(0xc48a20);
const STEEL = new THREE.Color(0x6b7280);

const ThreeLine = "line" as any;

/* ─── Hull solid envelope ─── */
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
                opacity={0.25}
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
            <lineBasicMaterial color={AMBER_DIM} transparent opacity={0.35} />
        </lineSegments>
    );
}

/* ─── Panel seam lines ─── */
function PanelSeams() {
    const lines = useMemo(() => {
        const result: THREE.BufferGeometry[] = [];
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
            if (points.length > 2) result.push(new THREE.BufferGeometry().setFromPoints(points));
            const backPoints = points.map(p => new THREE.Vector3(p.x, p.y, -p.z));
            if (backPoints.length > 2) result.push(new THREE.BufferGeometry().setFromPoints(backPoints));
        }
        return result;
    }, []);

    return (
        <group>
            {lines.map((geo, i) => (
                <ThreeLine key={i} geometry={geo}>
                    <lineBasicMaterial color={AMBER_DIM} transparent opacity={0.15} />
                </ThreeLine>
            ))}
        </group>
    );
}

/* ─── Structural ribs ─── */
function StructuralRibs() {
    const ribs = useMemo(() => {
        const positions: number[] = [-2.8, -2.2, -1.5, -0.8, 0, 0.8, 1.5, 2.2, 2.8];
        return positions.map((x) => ({ x, r: Math.sqrt(Math.max(0, 1 - (x / 3.2) ** 2)) }));
    }, []);

    return (
        <group>
            {ribs.map((rib, i) => (
                <group key={i}>
                    <mesh position={[rib.x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                        <ringGeometry args={[rib.r * 0.95, rib.r, 32]} />
                        <meshBasicMaterial color={AMBER_DIM} transparent opacity={0.15} side={THREE.DoubleSide} />
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
                    <lineBasicMaterial color={AMBER_DIM} transparent opacity={0.1} />
                </ThreeLine>
            ))}
        </group>
    );
}

/* ─── Internal gas cells ─── */
function GasCells() {
    const cells = useMemo(() => {
        const positions: number[] = [-2.0, -1.0, 0, 1.0, 2.0];
        return positions.map((x) => ({ x, r: Math.sqrt(Math.max(0, 1 - (x / 3.2) ** 2)) * 0.55 }));
    }, []);

    const matRef = useRef<THREE.MeshBasicMaterial[]>([]);

    useFrame(({ clock }) => {
        matRef.current.forEach((mat, i) => {
            if (mat) mat.opacity = 0.04 + Math.sin(clock.elapsedTime * 0.8 + i * 1.2) * 0.02;
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

/* ─── Gondola ─── */
function Gondola() {
    const boxGeo = useMemo(() => {
        return new THREE.EdgesGeometry(new THREE.BoxGeometry(0.9, 0.3, 0.4, 4, 2, 2), 1);
    }, []);

    const strutGeo = useMemo(() => {
        return new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0.42, 0),
        ]);
    }, []);

    return (
        <group position={[0.3, -1.08, 0]}>
            <mesh>
                <boxGeometry args={[0.9, 0.3, 0.4]} />
                <meshPhysicalMaterial color={HULL_COLOR} transparent opacity={0.5} roughness={0.5} metalness={0.3} />
            </mesh>
            <lineSegments geometry={boxGeo}>
                <lineBasicMaterial color={AMBER} transparent opacity={0.6} />
            </lineSegments>
            <mesh position={[0, 0.02, 0]}>
                <boxGeometry args={[0.7, 0.04, 0.42]} />
                <meshBasicMaterial color={AMBER_BRIGHT} transparent opacity={0.15} />
            </mesh>
            {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
                <ThreeLine key={i} geometry={strutGeo} position={[x, 0.15, 0]}>
                    <lineBasicMaterial color={AMBER_DIM} transparent opacity={0.4} />
                </ThreeLine>
            ))}
            <pointLight color={AMBER} intensity={0.5} distance={2.5} position={[0, -0.1, 0]} />
        </group>
    );
}

/* ─── Cargo bay ─── */
function CargoBay() {
    const bayGeo = useMemo(() => {
        return new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2, 0.15, 0.5, 3, 1, 2), 1);
    }, []);

    return (
        <group position={[-0.3, -0.85, 0]}>
            <lineSegments geometry={bayGeo}>
                <lineBasicMaterial color={AMBER} transparent opacity={0.4} />
            </lineSegments>
            <mesh>
                <boxGeometry args={[1.2, 0.15, 0.5]} />
                <meshPhysicalMaterial color={HULL_COLOR} transparent opacity={0.25} roughness={0.7} metalness={0.1} />
            </mesh>
            {[-0.4, -0.15, 0.1, 0.35].map((x, i) => (
                <mesh key={i} position={[x, -0.08, 0]}>
                    <boxGeometry args={[0.12, 0.02, 0.12]} />
                    <meshBasicMaterial color={AMBER} transparent opacity={0.3} />
                </mesh>
            ))}
        </group>
    );
}

/* ─── Tail fins ─── */
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
                    <mesh geometry={finGeo}>
                        <meshPhysicalMaterial color={HULL_COLOR} transparent opacity={0.35} roughness={0.5} metalness={0.2} side={THREE.DoubleSide} />
                    </mesh>
                    <lineSegments geometry={finEdge}>
                        <lineBasicMaterial color={AMBER} transparent opacity={0.5} />
                    </lineSegments>
                </group>
            ))}
        </group>
    );
}

/* ─── Solar panels ─── */
function SolarPanels() {
    const panels = useMemo(() => {
        const result: { x: number; y: number }[] = [];
        for (let i = -3; i <= 3; i++) {
            const x = i * 0.65;
            const rMax = Math.sqrt(Math.max(0, 1 - (x / 3.2) ** 2));
            result.push({ x, y: rMax * 0.98 });
        }
        return result;
    }, []);

    return (
        <group>
            {panels.map((p, i) => (
                <group key={i} position={[p.x, p.y, 0]}>
                    <mesh rotation={[0.3, 0, 0]}>
                        <planeGeometry args={[0.5, 0.35]} />
                        <meshBasicMaterial color={new THREE.Color(0x2a3a55)} transparent opacity={0.4} side={THREE.DoubleSide} />
                    </mesh>
                    <mesh rotation={[0.3, 0, 0]}>
                        <planeGeometry args={[0.5, 0.35]} />
                        <meshBasicMaterial color={AMBER_DIM} transparent opacity={0.15} side={THREE.DoubleSide} wireframe />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

/* ─── Propeller nacelles ─── */
function PropellerNacelles() {
    const nacelleGeo = useMemo(() => {
        const cyl = new THREE.CylinderGeometry(0.12, 0.08, 0.5, 8);
        cyl.rotateZ(Math.PI / 2);
        return cyl;
    }, []);
    const nacelleEdge = useMemo(() => new THREE.EdgesGeometry(nacelleGeo, 1), [nacelleGeo]);

    const pylonGeo = useMemo(() => {
        return new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0.35, 0),
        ]);
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
                    <ThreeLine geometry={pylonGeo}>
                        <lineBasicMaterial color={AMBER_DIM} transparent opacity={0.4} />
                    </ThreeLine>
                    <mesh geometry={nacelleGeo}>
                        <meshPhysicalMaterial color={HULL_COLOR} transparent opacity={0.4} roughness={0.4} metalness={0.3} />
                    </mesh>
                    <lineSegments geometry={nacelleEdge}>
                        <lineBasicMaterial color={AMBER} transparent opacity={0.4} />
                    </lineSegments>
                    <PropellerDisc />
                    <pointLight color={AMBER} intensity={0.15} distance={1} position={[0.3, 0, 0]} />
                </group>
            ))}
        </group>
    );
}

function PropellerDisc() {
    const ref = useRef<THREE.Group>(null!);
    useFrame((_, delta) => {
        if (ref.current) ref.current.rotation.z += delta * 8;
    });

    return (
        <group ref={ref} position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            {[0, Math.PI / 3, -Math.PI / 3].map((rot, i) => (
                <mesh key={i} rotation={[0, 0, rot]}>
                    <planeGeometry args={[0.03, 0.35]} />
                    <meshBasicMaterial color={AMBER} transparent opacity={0.3} side={THREE.DoubleSide} />
                </mesh>
            ))}
            <mesh>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshBasicMaterial color={AMBER} transparent opacity={0.5} />
            </mesh>
            <mesh>
                <ringGeometry args={[0.16, 0.18, 24]} />
                <meshBasicMaterial color={AMBER_DIM} transparent opacity={0.1} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}

/* ─── Drone modules ─── */
function DroneModules() {
    const refs = useRef<THREE.Group[]>([]);
    const drones = useMemo(() => {
        return [-0.7, -0.45, -0.15, 0.05].map((x) => ({ x }));
    }, []);

    useFrame(({ clock }) => {
        refs.current.forEach((ref, i) => {
            if (ref) {
                ref.position.y = -1.1 + Math.sin(clock.elapsedTime * 1.5 + i * 0.8) * 0.04;
            }
        });
    });

    return (
        <group>
            {drones.map((d, i) => (
                <group
                    key={i}
                    ref={(el: THREE.Group | null) => { if (el) refs.current[i] = el; }}
                    position={[d.x, -1.1, 0]}
                >
                    {/* Drone body */}
                    <mesh>
                        <boxGeometry args={[0.14, 0.06, 0.1]} />
                        <meshPhysicalMaterial color={HULL_COLOR} transparent opacity={0.5} roughness={0.4} metalness={0.3} />
                    </mesh>
                    <mesh>
                        <boxGeometry args={[0.14, 0.06, 0.1]} />
                        <meshBasicMaterial color={AMBER} transparent opacity={0.3} wireframe />
                    </mesh>
                    {/* Rotor arms */}
                    {[-0.1, 0.1].map((xOff, j) => (
                        <mesh key={j} position={[xOff, 0.04, 0]}>
                            <cylinderGeometry args={[0.06, 0.06, 0.003, 16]} />
                            <meshBasicMaterial color={AMBER} transparent opacity={0.15} side={THREE.DoubleSide} />
                        </mesh>
                    ))}
                    {/* Cable */}
                    <ThreeLine
                        geometry={new THREE.BufferGeometry().setFromPoints([
                            new THREE.Vector3(0, 0.04, 0),
                            new THREE.Vector3(0, 0.22, 0),
                        ])}
                    >
                        <lineBasicMaterial color={AMBER_DIM} transparent opacity={0.3} />
                    </ThreeLine>
                </group>
            ))}
        </group>
    );
}

/* ─── Dimension lines ─── */
function DimensionLines() {
    const matRef = useRef<THREE.LineBasicMaterial>(null!);

    useFrame(({ clock }) => {
        if (matRef.current) {
            matRef.current.opacity = 0.2 + Math.sin(clock.elapsedTime * 1.5) * 0.08;
        }
    });

    const geos = useMemo(() => {
        return [
            [new THREE.Vector3(-3.3, 1.4, 0), new THREE.Vector3(3.3, 1.4, 0)],
            [new THREE.Vector3(-3.3, 1.3, 0), new THREE.Vector3(-3.3, 1.5, 0)],
            [new THREE.Vector3(3.3, 1.3, 0), new THREE.Vector3(3.3, 1.5, 0)],
            [new THREE.Vector3(3.8, -1.1, 0), new THREE.Vector3(3.8, 1.1, 0)],
            [new THREE.Vector3(3.7, -1.1, 0), new THREE.Vector3(3.9, -1.1, 0)],
            [new THREE.Vector3(3.7, 1.1, 0), new THREE.Vector3(3.9, 1.1, 0)],
        ].map(pts => new THREE.BufferGeometry().setFromPoints(pts));
    }, []);

    const mat = <lineBasicMaterial ref={matRef} color={STEEL} transparent opacity={0.25} />;

    return (
        <group>
            {geos.map((geo, i) => (
                <ThreeLine key={i} geometry={geo}>{mat}</ThreeLine>
            ))}
        </group>
    );
}

/* ─── Floating particles ─── */
function AtmosphereParticles() {
    const count = 200;
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
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial color={AMBER} size={0.015} transparent opacity={0.3} sizeAttenuation />
        </points>
    );
}

/* ─── Scan beam ─── */
function ScanBeam() {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame(({ clock }) => {
        if (!ref.current) return;
        const t = (clock.elapsedTime * 0.25) % 1;
        ref.current.position.x = -3.5 + t * 7;
        (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.03 + Math.sin(t * Math.PI) * 0.02;
    });

    return (
        <mesh ref={ref}>
            <planeGeometry args={[0.03, 3.5]} />
            <meshBasicMaterial color={AMBER_BRIGHT} transparent opacity={0.04} side={THREE.DoubleSide} />
        </mesh>
    );
}

/* ─── Hull glow rim ─── */
function HullGlow() {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame(({ clock }) => {
        if (!ref.current) return;
        (ref.current.material as THREE.MeshBasicMaterial).opacity =
            0.025 + Math.sin(clock.elapsedTime * 0.6) * 0.012;
    });

    const geo = useMemo(() => {
        const shape = new THREE.SphereGeometry(1.02, 32, 16);
        shape.scale(3.2, 1, 1);
        return shape;
    }, []);

    return (
        <mesh ref={ref} geometry={geo}>
            <meshBasicMaterial color={AMBER} transparent opacity={0.03} side={THREE.BackSide} depthWrite={false} />
        </mesh>
    );
}

/* ─── 3D Annotation labels (HTML overlays, hidden on mobile) ─── */
function AnnotationLabels() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const annotations = [
        { label: "LENGTH", value: "260 M", pos: [0, 1.7, 0] as [number, number, number] },
        { label: "MAX PAYLOAD", value: "200 METRIC TONS", pos: [-1.8, -1.4, 0.8] as [number, number, number] },
        { label: "CRUISE ALTITUDE", value: "3,000 - 6,000 M", pos: [-2.5, 0.8, 0.5] as [number, number, number] },
        { label: "BUOYANCY GAS", value: "H₂/He HYBRID", pos: [1.5, 0.8, 0.5] as [number, number, number] },
        { label: "PROPULSION", value: "SOLAR-ELECTRIC HYBRID", pos: [2.2, -0.5, 1.0] as [number, number, number] },
        { label: "DRONE MODULES", value: "8-12 AUTONOMOUS UNITS", pos: [-0.3, -1.5, 0.5] as [number, number, number] },
    ];

    if (isMobile) return null;

    return (
        <group>
            {annotations.map((ann, i) => (
                <Html
                    key={i}
                    position={ann.pos}
                    center
                    distanceFactor={8}
                    style={{
                        pointerEvents: "none",
                        whiteSpace: "nowrap",
                    }}
                >
                    <div className="flex flex-col items-center gap-0.5 opacity-70">
                        <span
                            className="font-mono font-bold tracking-[0.2em] uppercase"
                            style={{ fontSize: "8px", color: "#6b7280" }}
                        >
                            {ann.label}
                        </span>
                        <span
                            className="font-mono font-bold tracking-[0.15em]"
                            style={{ fontSize: "10px", color: "#c48a20" }}
                        >
                            {ann.value}
                        </span>
                    </div>
                </Html>
            ))}
        </group>
    );
}

/* ─── Main airship model composition ─── */
function BlueprintAirship() {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const bob = Math.sin(clock.elapsedTime * 0.5) * 0.03;
        groupRef.current.position.y = bob;
    });

    return (
        <group ref={groupRef} scale={1.0}>
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
            <DroneModules />
            <DimensionLines />
            <ScanBeam />
            <AtmosphereParticles />
            <AnnotationLabels />
        </group>
    );
}

/* ─── Exported component ─── */
export function BlueprintDiagram() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className="w-full aspect-[4/3] md:aspect-[16/9] bg-deep-slate/20 border border-border-subtle flex items-center justify-center">
                <p className="text-amber font-mono text-sm tracking-widest animate-pulse">LOADING BLUEPRINT...</p>
            </div>
        );
    }

    return (
        <div className="w-full relative border border-border-subtle overflow-hidden aspect-[4/3] md:aspect-[16/9]">
            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-amber/30 z-10 pointer-events-none" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-amber/30 z-10 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-amber/30 z-10 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-amber/30 z-10 pointer-events-none" />

            {/* Title strip */}
            <div className="absolute top-3 left-8 z-10 pointer-events-none">
                <span className="text-[10px] md:text-[11px] tracking-[0.3em] text-cold-steel/60 font-mono font-bold">
                    PROJECT AETHER — SKY CARRIER V.5
                </span>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-3 left-8 z-10 pointer-events-none hidden md:block">
                <span className="text-[9px] tracking-[0.2em] text-cold-steel/40 font-mono">
                    SCALE: 1:2000 &nbsp;|&nbsp; REV: 5.2.1 &nbsp;|&nbsp; CLASSIFICATION: UNRESTRICTED
                </span>
            </div>
            <div className="absolute bottom-3 right-8 z-10 pointer-events-none hidden md:block">
                <span className="text-[9px] tracking-[0.2em] text-cold-steel/40 font-mono">
                    DRAG TO ROTATE · SCROLL TO ZOOM
                </span>
            </div>

            {/* Mobile hint */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none md:hidden">
                <span className="text-[9px] tracking-[0.2em] text-cold-steel/40 font-mono">
                    DRAG TO ROTATE · PINCH TO ZOOM
                </span>
            </div>

            <Canvas
                camera={{ position: [0, 0.5, 6], fov: 42 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.25} />
                <directionalLight position={[5, 3, 5]} intensity={0.5} color={0xffeedd} />
                <directionalLight position={[-3, -1, -3]} intensity={0.2} color={0x8090b0} />

                <BlueprintAirship />

                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={3.5}
                    maxDistance={12}
                    autoRotate
                    autoRotateSpeed={0.3}
                    maxPolarAngle={Math.PI * 0.75}
                    minPolarAngle={Math.PI * 0.25}
                />
            </Canvas>
        </div>
    );
}
