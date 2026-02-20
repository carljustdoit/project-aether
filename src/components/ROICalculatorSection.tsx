"use client";

import { useState } from "react";
import { SectionBackground } from "./SectionBackground";

type TerrainType = "FLAT" | "MOUNTAIN" | "WATER";

export function ROICalculatorSection() {
    const [weight, setWeight] = useState(100);
    const [distance, setDistance] = useState(500);
    const [terrain, setTerrain] = useState<TerrainType>("MOUNTAIN");

    const calcAether = () => ({ cost: weight * distance * 2, co2: weight * distance * 0.01, feasible: true });
    const calcTruck = () => ({ cost: weight * distance * 0.5, co2: weight * distance * 0.15, feasible: terrain === "FLAT" });
    const calcHeli = () => ({ cost: weight * distance * 20, co2: weight * distance * 1.5, feasible: true });

    const fmt$ = (v: number) => v > 1e6 ? `$${(v / 1e6).toFixed(1)}M` : v > 1e3 ? `$${Math.round(v / 1e3)}k` : `$${Math.round(v)}`;
    const fmtCO2 = (v: number) => v > 1000 ? `${(v / 1000).toFixed(1)}T CO₂` : `${Math.round(v)}kg CO₂`;

    const a = calcAether(), t = calcTruck(), h = calcHeli();

    return (
        <section id="calculator" className="w-full py-32 px-6 relative">
            <SectionBackground
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=60&auto=format"
                alt="Aerial mountain landscape"
                opacity={3}
                overlay="both"
                position="center 60%"
            />
            <div className="absolute inset-0 blueprint-grid" />
            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <div className="mb-20">
                    <span className="text-[11px] tracking-[0.4em] text-amber font-bold uppercase font-mono">ANALYSIS</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mt-4 mb-6">
                        True Cost of <span className="text-amber">Delivery</span>
                    </h2>
                    <p className="text-cold-steel font-mono tracking-wide max-w-2xl leading-relaxed">
                        Calculate the financial and environmental impact of heavy lift operations across different terrains.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Controls */}
                    <div className="border border-border-subtle p-8 bg-deep-slate/30">
                        <h3 className="text-lg font-black uppercase mb-8 border-b border-border-subtle pb-4 tracking-wider">Mission Parameters</h3>

                        <div className="mb-8">
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-cold-steel mb-4 font-bold">Geography</label>
                            <div className="flex flex-col gap-2">
                                {(["FLAT", "MOUNTAIN", "WATER"] as TerrainType[]).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTerrain(t)}
                                        className={`py-3 px-4 border text-xs uppercase tracking-widest transition-all ${terrain === t ? "bg-amber text-deep-space border-amber font-bold" : "border-border-subtle text-cold-steel hover:border-amber/50"}`}
                                    >
                                        {t === "FLAT" ? "Developed / Flat" : t === "MOUNTAIN" ? "Mountainous / No Roads" : "Open Water"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-cold-steel mb-4 font-bold">
                                <span>Payload Weight</span>
                                <span className="text-amber">{weight} Tons</span>
                            </label>
                            <input type="range" min="10" max="500" step="10" value={weight}
                                onChange={e => setWeight(Number(e.target.value))}
                                className="w-full accent-amber"
                            />
                        </div>

                        <div>
                            <label className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-cold-steel mb-4 font-bold">
                                <span>Distance</span>
                                <span className="text-amber">{distance} KM</span>
                            </label>
                            <input type="range" min="50" max="5000" step="50" value={distance}
                                onChange={e => setDistance(Number(e.target.value))}
                                className="w-full accent-amber"
                            />
                        </div>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-2 flex flex-col gap-4">

                        {/* Aether */}
                        <div className="border border-amber p-6 bg-amber/5 flex flex-col md:flex-row items-center gap-6 group relative overflow-hidden">
                            <div className="flex-1 w-full">
                                <div className="text-sm font-bold text-amber tracking-widest uppercase mb-1">Project Aether</div>
                                <div className="text-xs text-cold-steel font-mono">Sky Carrier + Drone Deployment</div>
                            </div>
                            <div className="flex-1 w-full flex justify-between md:justify-end gap-12">
                                <div>
                                    <div className="text-3xl font-black font-sans text-amber">{fmt$(a.cost)}</div>
                                    <div className="text-[10px] text-cold-steel uppercase tracking-widest">Est. Cost</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black font-sans text-green-400">{fmtCO2(a.co2)}</div>
                                    <div className="text-[10px] text-cold-steel uppercase tracking-widest">Emissions</div>
                                </div>
                            </div>
                        </div>

                        {/* Trucking */}
                        <div className={`border border-border-subtle p-6 bg-deep-slate/20 flex flex-col md:flex-row items-center gap-6 ${!t.feasible ? 'opacity-40' : ''}`}>
                            <div className="flex-1 w-full">
                                <div className="text-sm font-bold text-titanium tracking-widest uppercase mb-1">Heavy Trucking</div>
                                <div className="text-xs text-cold-steel font-mono">{!t.feasible ? "Requires paved road network" : "Standard logistical fleet"}</div>
                            </div>
                            <div className="flex-1 w-full flex justify-between md:justify-end gap-12">
                                {!t.feasible ? (
                                    <div className="text-red-400 font-bold uppercase tracking-widest text-sm w-full text-right">INFRASTRUCTURE BLOCKED</div>
                                ) : (<>
                                    <div>
                                        <div className="text-2xl font-black font-sans text-titanium">{fmt$(t.cost)}</div>
                                        <div className="text-[10px] text-cold-steel uppercase tracking-widest">Est. Cost</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black font-sans text-red-400">{fmtCO2(t.co2)}</div>
                                        <div className="text-[10px] text-cold-steel uppercase tracking-widest">Emissions</div>
                                    </div>
                                </>)}
                            </div>
                        </div>

                        {/* Helicopter */}
                        <div className="border border-border-subtle p-6 bg-deep-slate/20 flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-1 w-full">
                                <div className="text-sm font-bold text-titanium tracking-widest uppercase mb-1">Heavy-Lift Helicopter</div>
                                <div className="text-xs text-cold-steel font-mono">{weight > 20 ? "Multiple sequential sorties" : "Single sortie"}</div>
                            </div>
                            <div className="flex-1 w-full flex justify-between md:justify-end gap-12">
                                <div>
                                    <div className="text-2xl font-black font-sans text-red-400">{fmt$(h.cost)}</div>
                                    <div className="text-[10px] text-cold-steel uppercase tracking-widest">Est. Cost</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black font-sans text-red-400">{fmtCO2(h.co2)}</div>
                                    <div className="text-[10px] text-cold-steel uppercase tracking-widest">Emissions</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
