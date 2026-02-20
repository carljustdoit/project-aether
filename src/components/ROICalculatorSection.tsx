"use client";

import { useState } from "react";
import { SectionBackground } from "./SectionBackground";

type TerrainType = "FLAT" | "MOUNTAIN" | "WATER";

/**
 * Realistic cost model:
 *
 * TRUCKING:
 * - Max ~25 tons per truck → need ceil(weight/25) trucks
 * - Base rate: ~$3-5/km per truck on flat roads
 * - For oversized/heavy loads: permit costs, escort vehicles, road closures
 * - Mountainous: 3-5x multiplier (switchbacks, slower speeds, road construction)
 * - Water: infeasible without bridge/ferry
 * - Time: ~500km/day (flat), ~150km/day (mountain), multiple trucks in convoy
 *
 * HELICOPTER (Mi-26 class, max ~20 tons per sortie):
 * - $15,000-25,000/flight hour, ~200km/h cruise
 * - Need ceil(weight/20) sorties for heavy loads
 * - Turnaround between sorties: ~4 hours
 * - Each sortie: distance * 2 (return trip) / 200 km/h
 *
 * AETHER (Sky Carrier):
 * - Single trip, 200+ ton capacity
 * - Base operating cost: competitive for the cargo it carries
 * - Speed: ~100 km/h cruise
 * - Time: distance / 100 + 8 hours (load/deploy)
 * - No infrastructure setup needed
 */

function calcAether(weight: number, distance: number, terrain: TerrainType) {
    // Base cost: $800/ton at 500km, scales with distance but not terrain
    const baseCost = weight * 800;
    const distanceCost = (distance / 500) * weight * 400;
    const cost = baseCost + distanceCost;

    // CO₂: near-zero (solar-electric + buoyant lift), small amount from station-keeping
    const co2 = weight * distance * 0.003;

    // Time: ~100 km/h cruise + 8h load/deploy
    const flightHours = distance / 100;
    const totalHours = flightHours + 8;
    const days = totalHours / 24;

    return { cost, co2, days, feasible: true, note: "Single sortie, any terrain" };
}

function calcTruck(weight: number, distance: number, terrain: TerrainType) {
    if (terrain !== "FLAT") {
        return { cost: 0, co2: 0, days: 0, feasible: false, note: terrain === "MOUNTAIN" ? "No road access — requires road construction ($2.3M/mile)" : "No route — requires bridge or ferry infrastructure" };
    }

    // Number of trucks needed (25 tons max per heavy haul truck)
    const numTrucks = Math.ceil(weight / 25);
    // Base rate per truck per km (including fuel, driver, wear)
    const ratePerTruckKm = 4.5;
    // Oversized load surcharge: permits, escorts, pilot cars
    const oversizeSurcharge = weight > 40 ? numTrucks * 8000 : 0;
    // Multi-truck coordination surcharge
    const coordinationCost = numTrucks > 2 ? (numTrucks - 2) * 5000 : 0;

    const cost = (numTrucks * distance * ratePerTruckKm) + oversizeSurcharge + coordinationCost;

    // CO₂: ~0.1 kg per ton-km for heavy trucking
    const co2 = weight * distance * 0.1;

    // Time: ~500km/day per convoy, but scheduling and permitting adds days
    const transitDays = distance / 500;
    const logisticsDays = numTrucks > 3 ? 5 : 2; // Multi-convoy scheduling
    const permitDays = weight > 50 ? 7 : 2; // Heavy load permits
    const days = transitDays + logisticsDays + permitDays;

    return { cost, co2, days, feasible: true, note: `${numTrucks} truck${numTrucks > 1 ? "s" : ""} required` };
}

function calcHeli(weight: number, distance: number, terrain: TerrainType) {
    // Mi-26 type: max ~20 tons, $22,000/flight hour, 200 km/h
    const maxLift = 20; // tons per sortie
    const numSorties = Math.ceil(weight / maxLift);
    const flightHoursPerSortie = (distance * 2) / 200; // round trip
    const costPerHour = 22000;
    const cost = numSorties * flightHoursPerSortie * costPerHour;

    // CO₂: helicopters burn ~1,000 kg/hr of jet fuel → ~3.15 tons CO₂/hr
    const co2 = numSorties * flightHoursPerSortie * 3150;

    // Time: each sortie + turnaround time
    const hoursPerSortie = flightHoursPerSortie + 4; // 4h refuel/reload
    const totalHours = numSorties * hoursPerSortie;
    const days = totalHours / 24;

    return { cost, co2, days, feasible: true, note: `${numSorties} sortie${numSorties > 1 ? "s" : ""} at ${maxLift}T max` };
}

function fmtDollars(v: number) {
    if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `$${Math.round(v / 1e3)}k`;
    return `$${Math.round(v)}`;
}

function fmtCO2(v: number) {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}T`;
    return `${Math.round(v)}kg`;
}

function fmtTime(days: number) {
    if (days < 1) return `${Math.round(days * 24)}h`;
    if (days < 2) return `${Math.round(days * 24)}h`;
    return `${Math.round(days)}d`;
}

export function ROICalculatorSection() {
    const [weight, setWeight] = useState(150);
    const [distance, setDistance] = useState(500);
    const [terrain, setTerrain] = useState<TerrainType>("MOUNTAIN");

    const a = calcAether(weight, distance, terrain);
    const t = calcTruck(weight, distance, terrain);
    const h = calcHeli(weight, distance, terrain);

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
                    <span className="text-[11px] tracking-[0.4em] text-amber font-bold uppercase font-mono">ECONOMICS</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mt-4 mb-6">
                        The Math Changes <span className="text-amber">Everything</span>
                    </h2>
                    <p className="text-cold-steel font-mono tracking-wide max-w-2xl leading-relaxed">
                        When you remove roads, runways, and ports from the equation, the economics of heavy-lift delivery transform entirely.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Controls */}
                    <div className="border border-border-subtle p-8 bg-deep-slate/30">
                        <h3 className="text-lg font-black uppercase mb-8 border-b border-border-subtle pb-4 tracking-wider">Mission Parameters</h3>

                        <div className="mb-8">
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-cold-steel mb-4 font-bold">Geography</label>
                            <div className="flex flex-col gap-2">
                                {(["FLAT", "MOUNTAIN", "WATER"] as TerrainType[]).map(terr => (
                                    <button
                                        key={terr}
                                        onClick={() => setTerrain(terr)}
                                        className={`py-3 px-4 border text-xs uppercase tracking-widest transition-all ${terrain === terr ? "bg-amber text-deep-space border-amber font-bold" : "border-border-subtle text-cold-steel hover:border-amber/50"}`}
                                    >
                                        {terr === "FLAT" ? "Developed / Flat" : terr === "MOUNTAIN" ? "Mountainous / No Roads" : "Open Water"}
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
                            <div className="flex justify-between text-[9px] text-cold-steel/60 mt-1 font-mono">
                                <span>10T</span>
                                <span>500T</span>
                            </div>
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
                            <div className="flex justify-between text-[9px] text-cold-steel/60 mt-1 font-mono">
                                <span>50km</span>
                                <span>5,000km</span>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-2 flex flex-col gap-4">

                        {/* Aether */}
                        <div className="border border-amber p-6 bg-amber/5 relative overflow-hidden">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-amber tracking-widest uppercase mb-1">Project Aether</div>
                                    <div className="text-xs text-cold-steel font-mono">{a.note}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <div className="text-2xl md:text-3xl font-black font-sans text-amber">{fmtDollars(a.cost)}</div>
                                    <div className="text-[10px] text-cold-steel uppercase tracking-widest">Est. Cost</div>
                                </div>
                                <div>
                                    <div className="text-2xl md:text-3xl font-black font-sans text-green-400">{fmtTime(a.days)}</div>
                                    <div className="text-[10px] text-cold-steel uppercase tracking-widest">Delivery</div>
                                </div>
                                <div>
                                    <div className="text-2xl md:text-3xl font-black font-sans text-green-400">{fmtCO2(a.co2)}</div>
                                    <div className="text-[10px] text-cold-steel uppercase tracking-widest">CO₂</div>
                                </div>
                            </div>
                        </div>

                        {/* Trucking */}
                        <div className={`border border-border-subtle p-6 bg-deep-slate/20 ${!t.feasible ? 'opacity-40' : ''}`}>
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-titanium tracking-widest uppercase mb-1">Heavy Trucking</div>
                                    <div className="text-xs text-cold-steel font-mono">{t.note}</div>
                                </div>
                            </div>
                            {!t.feasible ? (
                                <div className="text-red-400 font-bold uppercase tracking-widest text-sm py-2">INFRASTRUCTURE BLOCKED</div>
                            ) : (
                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <div className="text-xl md:text-2xl font-black font-sans text-titanium">{fmtDollars(t.cost)}</div>
                                        <div className="text-[10px] text-cold-steel uppercase tracking-widest">Est. Cost</div>
                                    </div>
                                    <div>
                                        <div className="text-xl md:text-2xl font-black font-sans text-red-400">{fmtTime(t.days)}</div>
                                        <div className="text-[10px] text-cold-steel uppercase tracking-widest">Delivery</div>
                                    </div>
                                    <div>
                                        <div className="text-xl md:text-2xl font-black font-sans text-red-400">{fmtCO2(t.co2)}</div>
                                        <div className="text-[10px] text-cold-steel uppercase tracking-widest">CO₂</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Helicopter */}
                        <div className="border border-border-subtle p-6 bg-deep-slate/20">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-titanium tracking-widest uppercase mb-1">Heavy-Lift Helicopter</div>
                                    <div className="text-xs text-cold-steel font-mono">{h.note}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <div className="text-xl md:text-2xl font-black font-sans text-red-400">{fmtDollars(h.cost)}</div>
                                    <div className="text-[10px] text-cold-steel uppercase tracking-widest">Est. Cost</div>
                                </div>
                                <div>
                                    <div className="text-xl md:text-2xl font-black font-sans text-red-400">{fmtTime(h.days)}</div>
                                    <div className="text-[10px] text-cold-steel uppercase tracking-widest">Delivery</div>
                                </div>
                                <div>
                                    <div className="text-xl md:text-2xl font-black font-sans text-red-400">{fmtCO2(h.co2)}</div>
                                    <div className="text-[10px] text-cold-steel uppercase tracking-widest">CO₂</div>
                                </div>
                            </div>
                        </div>

                        {/* Insight callout */}
                        <div className="mt-4 p-4 border border-amber/20 bg-amber/5">
                            <p className="text-xs text-cold-steel font-mono leading-relaxed tracking-wide">
                                <span className="text-amber font-bold">KEY INSIGHT:</span>{" "}
                                {terrain === "FLAT"
                                    ? `At ${weight}T, trucking requires ${Math.ceil(weight / 25)} separate vehicles with permits and escort. Aether delivers in a single sortie — ${fmtTime(a.days)} vs ${fmtTime(t.days)} for trucks.`
                                    : terrain === "MOUNTAIN"
                                        ? `Mountainous terrain eliminates trucking entirely. Helicopter would need ${Math.ceil(weight / 20)} sequential sorties at $22k/flight-hour. Aether handles all ${weight}T in one trip.`
                                        : `Open water crossings eliminate all ground transport. Aether crosses oceans at cruise altitude — no cargo ships, no port infrastructure, no customs delays.`
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
