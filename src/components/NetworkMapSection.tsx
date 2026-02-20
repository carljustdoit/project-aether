"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import { SectionBackground } from "./SectionBackground";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

/* ─── Airship 3D model ─── */
function createAirshipModel() {
    const group = new THREE.Group();

    // Hull - semi-transparent with amber wireframe
    const hullGeometry = new THREE.CapsuleGeometry(1, 4, 16, 32);
    hullGeometry.rotateZ(Math.PI / 2);
    const hullMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a2230,
        roughness: 0.4,
        metalness: 0.2,
        transparent: true,
        opacity: 0.6,
    });
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    hull.scale.set(1.5, 0.8, 0.8);
    group.add(hull);

    // Hull wireframe overlay
    const wireGeo = new THREE.CapsuleGeometry(1.01, 4, 8, 16);
    wireGeo.rotateZ(Math.PI / 2);
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0xd4a853,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
    });
    const wireHull = new THREE.Mesh(wireGeo, wireMat);
    wireHull.scale.set(1.5, 0.8, 0.8);
    group.add(wireHull);

    // Hull glow
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0xd4a853,
        transparent: true,
        opacity: 0.15,
    });
    const glowGeo = new THREE.CapsuleGeometry(1.15, 4, 8, 16);
    glowGeo.rotateZ(Math.PI / 2);
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.scale.set(1.5, 0.8, 0.8);
    group.add(glow);

    // Gondola
    const gondolaGeometry = new THREE.BoxGeometry(2, 0.35, 0.5);
    const gondolaMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a2230,
        roughness: 0.3,
        metalness: 0.4,
        emissive: 0xd4a853,
        emissiveIntensity: 0.15,
    });
    const gondola = new THREE.Mesh(gondolaGeometry, gondolaMaterial);
    gondola.position.set(0, -0.85, 0);
    group.add(gondola);

    // Tail fins (solid with color)
    const finGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.08);
    const finMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4a853,
        transparent: true,
        opacity: 0.5,
        roughness: 0.3,
    });

    const positions = [
        { x: -2.5, y: 0.6, z: 0, rx: 0, ry: 0, rz: -Math.PI / 8 },
        { x: -2.5, y: -0.6, z: 0, rx: 0, ry: 0, rz: Math.PI / 8 },
        { x: -2.5, y: 0, z: 0.6, rx: Math.PI / 2, ry: -Math.PI / 8, rz: 0 },
        { x: -2.5, y: 0, z: -0.6, rx: Math.PI / 2, ry: Math.PI / 8, rz: 0 },
    ];

    positions.forEach(p => {
        const fin = new THREE.Mesh(finGeometry, finMaterial);
        fin.position.set(p.x, p.y, p.z);
        fin.rotation.set(p.rx, p.ry, p.rz);
        group.add(fin);
    });

    // Point light at gondola
    const light = new THREE.PointLight(0xd4a853, 2, 5);
    light.position.set(0, -0.5, 0);
    group.add(light);

    group.scale.set(0.5, 0.5, 0.5);
    return group;
}

/* ─── Key difficult routes ─── */
interface RouteData {
    id: string;
    label: string;
    desc: string;
    payload: string;
    difficulty: string;
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    color: string;
}

const CRITICAL_ROUTES: RouteData[] = [
    {
        id: "amazon",
        label: "AMAZON BASIN",
        desc: "Wind turbines to remote power stations deep in the rainforest — no roads, no clearings.",
        payload: "214T",
        difficulty: "EXTREME",
        startLat: 0,
        startLng: -55,
        endLat: -3.5,
        endLng: -63,
        color: "#F5C542",
    },
    {
        id: "himalayas",
        label: "NEPAL HIGHLANDS",
        desc: "Transformer units to mountain villages above 4,000m — helicopter max altitude exceeded.",
        payload: "92T",
        difficulty: "EXTREME",
        startLat: 28.6,
        startLng: 77.2,
        endLat: 28.0,
        endLng: 86.9,
        color: "#F5C542",
    },
    {
        id: "borneo",
        label: "BORNEO INTERIOR",
        desc: "Bridge segments across dense tropical jungle — no navigable waterways, no road access.",
        payload: "165T",
        difficulty: "HIGH",
        startLat: 1.5,
        startLng: 110.3,
        endLat: 2.0,
        endLng: 114.0,
        color: "#D4A853",
    },
    {
        id: "congo",
        label: "CONGO BASIN",
        desc: "Solar array infrastructure to equatorial Africa — 800km from nearest paved road.",
        payload: "138T",
        difficulty: "EXTREME",
        startLat: -4.3,
        startLng: 15.3,
        endLat: 0.5,
        endLng: 25.0,
        color: "#F5C542",
    },
    {
        id: "andes",
        label: "ANDEAN PASSES",
        desc: "Mining equipment across 5,000m mountain passes — road convoys take 3 weeks.",
        payload: "200T",
        difficulty: "EXTREME",
        startLat: -12.0,
        startLng: -77.0,
        endLat: -16.5,
        endLng: -68.0,
        color: "#F5C542",
    },
    {
        id: "arctic",
        label: "YUKON TERRITORY",
        desc: "Pipeline modules to Arctic extraction sites — ground frozen 8 months, roads closed.",
        payload: "180T",
        difficulty: "HIGH",
        startLat: 60.7,
        startLng: -135.0,
        endLat: 64.0,
        endLng: -139.0,
        color: "#D4A853",
    },
    {
        id: "pacific",
        label: "PACIFIC ISLANDS",
        desc: "Desalination plants to remote atolls — no port, no runway, open water crossing.",
        payload: "75T",
        difficulty: "HIGH",
        startLat: -17.8,
        startLng: 177.9,
        endLat: -8.5,
        endLng: 179.2,
        color: "#D4A853",
    },
    {
        id: "siberia",
        label: "SIBERIAN CORRIDOR",
        desc: "Communication towers across permafrost tundra — 1,200km from nearest rail station.",
        payload: "110T",
        difficulty: "HIGH",
        startLat: 56.0,
        startLng: 93.0,
        endLat: 62.0,
        endLng: 114.0,
        color: "#D4A853",
    },
];

/* ─── Generate arc data for routes ─── */
function generateArcsData() {
    return CRITICAL_ROUTES.map(route => ({
        startLat: route.startLat,
        startLng: route.startLng,
        endLat: route.endLat,
        endLng: route.endLng,
        color: route.color,
        label: route.label,
        id: route.id,
    }));
}

/* ─── Generate ring data at endpoints ─── */
function generateRingsData() {
    const rings: { lat: number; lng: number; color: string }[] = [];
    CRITICAL_ROUTES.forEach(route => {
        rings.push({ lat: route.startLat, lng: route.startLng, color: route.color });
        rings.push({ lat: route.endLat, lng: route.endLng, color: route.color });
    });
    return rings;
}

/* ─── Generate point labels for destinations ─── */
function generateLabelsData() {
    return CRITICAL_ROUTES.map(route => ({
        lat: route.endLat,
        lng: route.endLng,
        label: route.label,
        size: 0.6,
        color: route.color,
    }));
}


export function NetworkMapSection() {
    const globeEl = useRef<any>(null);
    const [airships, setAirships] = useState<any[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
    const animRef = useRef<number>(0);

    const arcsData = useRef(generateArcsData());
    const ringsData = useRef(generateRingsData());
    const labelsData = useRef(generateLabelsData());

    useEffect(() => {
        setIsMounted(true);

        // Create airships that fly along the critical routes at low altitude
        const initialAirships = CRITICAL_ROUTES.slice(0, 5).map((route, i) => ({
            id: i + 1,
            lat: route.startLat,
            lng: route.startLng,
            alt: 0.02 + Math.random() * 0.015, // Very low altitude — realistic
            route: {
                latStart: route.startLat,
                lngStart: route.startLng,
                latEnd: route.endLat,
                lngEnd: route.endLng,
            },
            progress: (i * 0.2) % 1, // Stagger progress
            prevLat: route.startLat,
            prevLng: route.startLng,
        }));
        setAirships(initialAirships);

        const animate = () => {
            setAirships(prev => prev.map(ship => {
                let p = ship.progress + 0.0008;
                if (p > 1) p = 0;

                const newLat = ship.route.latStart + (ship.route.latEnd - ship.route.latStart) * p;
                const newLng = ship.route.lngStart + (ship.route.lngEnd - ship.route.lngStart) * p;

                return {
                    ...ship,
                    prevLat: ship.lat,
                    prevLng: ship.lng,
                    lat: newLat,
                    lng: newLng,
                    progress: p,
                };
            }));
            if (globeEl.current) {
                const c = globeEl.current.controls();
                c.autoRotate = true;
                c.autoRotateSpeed = 0.3;
            }
            animRef.current = requestAnimationFrame(animate);
        };
        animRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animRef.current);
    }, []);

    const handleRouteClick = useCallback((route: RouteData) => {
        setSelectedRoute(prev => prev?.id === route.id ? null : route);
        if (globeEl.current) {
            // Point of view to the route midpoint
            const midLat = (route.startLat + route.endLat) / 2;
            const midLng = (route.startLng + route.endLng) / 2;
            globeEl.current.pointOfView({ lat: midLat, lng: midLng, altitude: 1.8 }, 1000);
        }
    }, []);

    if (!isMounted) return (
        <div className="w-full h-[600px] bg-deep-slate/30 animate-pulse flex items-center justify-center">
            <p className="text-amber font-mono text-sm tracking-widest">INITIALIZING NETWORK...</p>
        </div>
    );

    return (
        <section className="w-full py-32 px-6 relative">
            <SectionBackground
                src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=60&auto=format"
                alt="Deep space nebula"
                opacity={2}
                overlay="both"
            />
            <div className="absolute inset-0 blueprint-grid" />

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">

                <div className="text-center mb-16 w-full">
                    <span className="text-[11px] tracking-[0.4em] text-amber font-bold uppercase font-mono">GLOBAL OPERATIONS</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mt-4 mb-6">
                        Bridging the <span className="text-amber">Final Mile</span>
                    </h2>
                    <p className="text-cold-steel font-mono tracking-wide max-w-2xl mx-auto leading-relaxed">
                        Sky Carriers bypass terrestrial bottlenecks to deliver vital infrastructure on the world&apos;s most challenging routes.
                    </p>
                </div>

                <div className="w-full flex flex-col lg:flex-row gap-0">

                    {/* Route sidebar */}
                    <div className="w-full lg:w-72 flex-shrink-0 border border-border-subtle bg-deep-space/80 backdrop-blur-sm overflow-auto max-h-[700px]">
                        <div className="px-4 py-3 border-b border-border-subtle">
                            <span className="text-[10px] text-amber font-bold tracking-[0.3em] uppercase font-mono">CRITICAL CORRIDORS</span>
                        </div>
                        {CRITICAL_ROUTES.map((route) => (
                            <button
                                key={route.id}
                                onClick={() => handleRouteClick(route)}
                                className={`w-full text-left px-4 py-3 border-b border-border-subtle/50 transition-all hover:bg-deep-slate/50 group ${selectedRoute?.id === route.id ? "bg-deep-slate/60 border-l-2 border-l-amber" : ""
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold tracking-wider text-titanium group-hover:text-amber transition-colors">{route.label}</span>
                                    <span className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 ${route.difficulty === "EXTREME"
                                        ? "bg-red-500/15 text-red-400"
                                        : "bg-amber/15 text-amber"
                                        }`}>{route.difficulty}</span>
                                </div>
                                <p className="text-[10px] text-cold-steel font-mono leading-relaxed line-clamp-2">{route.desc}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <div className="w-1.5 h-1.5 bg-amber rotate-45" />
                                    <span className="text-[10px] text-amber font-bold tracking-wider">{route.payload} PAYLOAD</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Globe */}
                    <div className="flex-1 h-[500px] md:h-[700px] relative overflow-hidden border border-border-subtle border-l-0">

                        {/* Active sortie overlay */}
                        <div className="absolute right-4 top-4 z-20 bg-deep-space/90 backdrop-blur p-3 hidden md:flex flex-col gap-2 font-mono border border-border-subtle">
                            <div className="text-[9px] text-amber font-bold tracking-[0.2em] uppercase">FLEET STATUS</div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-[10px] text-titanium tracking-wider">5 CARRIERS ACTIVE</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-amber rounded-full" />
                                <span className="text-[10px] text-cold-steel tracking-wider">8 ROUTES MONITORED</span>
                            </div>
                        </div>

                        <Globe
                            ref={globeEl}
                            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                            backgroundColor="rgba(0,0,0,0)"

                            /* ─── Arc routes ─── */
                            arcsData={arcsData.current}
                            arcColor={(d: any) => d.color}
                            arcDashLength={0.4}
                            arcDashGap={0.15}
                            arcDashAnimateTime={3000}
                            arcStroke={0.6}
                            arcAltitudeAutoScale={0.3}

                            /* ─── Ring pulses at endpoints ─── */
                            ringsData={ringsData.current}
                            ringColor={(d: any) => (t: number) => `rgba(212,168,83,${1 - t})`}
                            ringMaxRadius={3}
                            ringPropagationSpeed={2}
                            ringRepeatPeriod={1200}

                            /* ─── Airship objects ─── */
                            customLayerData={airships}
                            customThreeObject={() => createAirshipModel()}
                            customThreeObjectUpdate={(obj: any, d: any) => {
                                if (!globeEl.current) return;
                                const coords = globeEl.current.getCoords(d.lat, d.lng, d.alt);
                                Object.assign(obj.position, coords);

                                // Orient airship along its trajectory
                                const prevCoords = globeEl.current.getCoords(d.prevLat, d.prevLng, d.alt);
                                const direction = new THREE.Vector3(
                                    coords.x - prevCoords.x,
                                    coords.y - prevCoords.y,
                                    coords.z - prevCoords.z
                                );

                                if (direction.length() > 0.0001) {
                                    direction.normalize();
                                    // Create a quaternion that aligns the object with the direction
                                    const up = new THREE.Vector3(coords.x, coords.y, coords.z).normalize();
                                    const right = new THREE.Vector3().crossVectors(direction, up).normalize();
                                    const adjustedUp = new THREE.Vector3().crossVectors(right, direction).normalize();

                                    const matrix = new THREE.Matrix4().makeBasis(direction, adjustedUp, right);
                                    obj.quaternion.setFromRotationMatrix(matrix);
                                }
                            }}

                            /* ─── Labels at destinations ─── */
                            labelsData={labelsData.current}
                            labelLat={(d: any) => d.lat}
                            labelLng={(d: any) => d.lng}
                            labelText={(d: any) => d.label}
                            labelSize={(d: any) => d.size}
                            labelColor={(d: any) => d.color}
                            labelDotRadius={0.3}
                            labelAltitude={0.01}
                            labelResolution={2}

                            atmosphereColor="#D4A853"
                            atmosphereAltitude={0.1}
                        />
                    </div>
                </div>

                {/* Selected route detail panel */}
                {selectedRoute && (
                    <div className="w-full mt-0 border border-border-subtle border-t-0 bg-deep-space/80 backdrop-blur-sm p-6 flex flex-col md:flex-row items-start gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 bg-amber rotate-45" />
                                <span className="text-amber text-xs font-bold tracking-[0.3em] font-mono">{selectedRoute.label}</span>
                                <span className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 ml-2 ${selectedRoute.difficulty === "EXTREME"
                                    ? "bg-red-500/15 text-red-400"
                                    : "bg-amber/15 text-amber"
                                    }`}>{selectedRoute.difficulty}</span>
                            </div>
                            <p className="text-cold-steel text-sm font-mono leading-relaxed tracking-wide">{selectedRoute.desc}</p>
                        </div>
                        <div className="flex gap-8 flex-shrink-0">
                            <div>
                                <div className="text-[10px] text-cold-steel tracking-widest font-mono mb-1">PAYLOAD</div>
                                <div className="text-2xl font-black text-amber">{selectedRoute.payload}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-cold-steel tracking-widest font-mono mb-1">TERRAIN</div>
                                <div className="text-sm font-bold text-titanium tracking-wider">{selectedRoute.difficulty}</div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}
