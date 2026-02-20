"use client";

import { useState } from "react";
import { SectionBackground } from "./SectionBackground";
import { useLang } from "@/i18n/LangContext";
import { translations } from "@/i18n/translations";

type TerrainType = "FLAT" | "MOUNTAIN" | "WATER";

function calcAether(weight: number, distance: number, _terrain: TerrainType) {
    const baseCost = weight * 800;
    const distanceCost = (distance / 500) * weight * 400;
    const cost = baseCost + distanceCost;
    const co2 = weight * distance * 0.003;
    const loadHours = 1.5 + (weight / 50) * 2;
    const cruiseSpeed = 110 - (weight / 500) * 20;
    const cruiseHours = distance / cruiseSpeed;
    const deployHours = 1 + (weight / 50) * 1;
    const totalHours = loadHours + cruiseHours + deployHours;
    const days = totalHours / 24;
    return { cost, co2, days, feasible: true };
}

function calcTruck(weight: number, distance: number, terrain: TerrainType) {
    if (terrain !== "FLAT") {
        return { cost: 0, co2: 0, days: 0, feasible: false, terrain };
    }
    const numTrucks = Math.ceil(weight / 25);
    const ratePerTruckKm = 4.5;
    const oversizeSurcharge = weight > 40 ? numTrucks * 8000 : 0;
    const coordinationCost = numTrucks > 2 ? (numTrucks - 2) * 5000 : 0;
    const cost = (numTrucks * distance * ratePerTruckKm) + oversizeSurcharge + coordinationCost;
    const co2 = weight * distance * 0.1;
    const loadHours = numTrucks * 2;
    const transitDays = distance / 500;
    const unloadHours = numTrucks * 1.5;
    const permitDays = weight > 100 ? 7 : weight > 50 ? 5 : weight > 25 ? 2 : 0;
    const coordDays = numTrucks > 3 ? Math.ceil((numTrucks - 3) * 0.5) : 0;
    const days = permitDays + (loadHours / 24) + transitDays + (unloadHours / 24) + coordDays;
    return { cost, co2, days, feasible: true, numTrucks, terrain };
}

function calcHeli(weight: number, distance: number, _terrain: TerrainType) {
    const maxLift = 20;
    const numSorties = Math.ceil(weight / maxLift);
    const flightHoursPerSortie = (distance * 2) / 200;
    const costPerHour = 22000;
    const cost = numSorties * flightHoursPerSortie * costPerHour;
    const co2 = numSorties * flightHoursPerSortie * 3150;
    const firstSortieHours = 1 + (distance / 200) + 1;
    const subsequentSortieHours = (distance / 200) + 3 + (distance / 200) + 1;
    const totalHours = numSorties === 1 ? firstSortieHours : firstSortieHours + (numSorties - 1) * subsequentSortieHours;
    const days = totalHours / 24;
    return { cost, co2, days, feasible: true, numSorties, maxLift };
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
    const totalHours = Math.round(days * 24);
    if (totalHours < 24) return `${totalHours}h`;
    const d = Math.floor(totalHours / 24);
    const h = totalHours % 24;
    if (h === 0) return `${d}d`;
    return `${d}d ${h}h`;
}

export function ROICalculatorSection() {
    const [weight, setWeight] = useState(150);
    const [distance, setDistance] = useState(500);
    const [terrain, setTerrain] = useState<TerrainType>("MOUNTAIN");
    const { t, lang } = useLang();

    const a = calcAether(weight, distance, terrain);
    const tr = calcTruck(weight, distance, terrain);
    const h = calcHeli(weight, distance, terrain);

    const terrainLabels: Record<TerrainType, { en: string; zh: string }> = {
        FLAT: translations.economics.flat,
        MOUNTAIN: translations.economics.mountain,
        WATER: translations.economics.water,
    };

    // Build note for truck
    const truckNote = !tr.feasible
        ? (terrain === "MOUNTAIN" ? t(translations.economics.noRoadAccess) : t(translations.economics.noWaterRoute))
        : `${(tr as { numTrucks: number }).numTrucks} ${(tr as { numTrucks: number }).numTrucks > 1 ? t(translations.economics.trucksRequired) : t(translations.economics.truckRequired)}`;

    // Build note for heli
    const heliNote = `${(h as { numSorties: number }).numSorties} ${(h as { numSorties: number }).numSorties > 1 ? t(translations.economics.sortiesAt) : t(translations.economics.sortieAt)} ${(h as { maxLift: number }).maxLift}T ${t(translations.economics.max)}`;

    // Build insight
    let insight = "";
    if (terrain === "FLAT") {
        insight = t(translations.economics.insightFlat)
            .replace("{weight}", String(weight))
            .replace("{trucks}", String(Math.ceil(weight / 25)))
            .replace("{aetherTime}", fmtTime(a.days))
            .replace("{truckTime}", fmtTime(tr.days));
    } else if (terrain === "MOUNTAIN") {
        insight = t(translations.economics.insightMountain)
            .replace("{sorties}", String(Math.ceil(weight / 20)))
            .replace("{weight}", String(weight));
    } else {
        insight = t(translations.economics.insightWater);
    }

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
                    <span className="text-[11px] tracking-[0.4em] text-amber font-bold uppercase font-mono">{t(translations.economics.overline)}</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mt-4 mb-6">
                        {t(translations.economics.headline)} <span className="text-amber">{t(translations.economics.headlineAccent)}</span>
                    </h2>
                    <p className="text-cold-steel font-mono tracking-wide max-w-2xl leading-relaxed">
                        {t(translations.economics.sub)}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Controls */}
                    <div className="border border-border-subtle p-8 bg-deep-slate/30">
                        <h3 className="text-lg font-black uppercase mb-8 border-b border-border-subtle pb-4 tracking-wider">{t(translations.economics.missionParams)}</h3>

                        <div className="mb-8">
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-cold-steel mb-4 font-bold">{t(translations.economics.geography)}</label>
                            <div className="flex flex-col gap-2">
                                {(["FLAT", "MOUNTAIN", "WATER"] as TerrainType[]).map(terr => (
                                    <button
                                        key={terr}
                                        onClick={() => setTerrain(terr)}
                                        className={`py-3 px-4 border text-xs uppercase tracking-widest transition-all ${terrain === terr ? "bg-amber text-deep-space border-amber font-bold" : "border-border-subtle text-cold-steel hover:border-amber/50"}`}
                                    >
                                        {t(terrainLabels[terr])}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-cold-steel mb-4 font-bold">
                                <span>{t(translations.economics.payloadWeight)}</span>
                                <span className="text-amber">{weight} {t(translations.economics.tons)}</span>
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
                                <span>{t(translations.economics.distance)}</span>
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
                                    <div className="text-sm font-bold text-amber tracking-widest uppercase mb-1">{t(translations.economics.projectAether)}</div>
                                    <div className="text-xs text-cold-steel font-mono">{t(translations.economics.singleSortie)}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <div className="text-2xl md:text-3xl font-black font-sans text-amber">{fmtDollars(a.cost)}</div>
                                    <div className="text-[10px] text-cold-steel uppercase tracking-widest">{t(translations.economics.estCost)}</div>
                                </div>
                                <div>
                                    <div className="text-2xl md:text-3xl font-black font-sans text-green-600">{fmtTime(a.days)}</div>
                                    <div className="text-[10px] text-cold-steel uppercase tracking-widest">{t(translations.economics.delivery)}</div>
                                </div>
                                <div>
                                    <div className="text-2xl md:text-3xl font-black font-sans text-green-600">{fmtCO2(a.co2)}</div>
                                    <div className="text-[10px] text-cold-steel uppercase tracking-widest">{t(translations.economics.co2)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Trucking */}
                        <div className={`border border-border-subtle p-6 bg-deep-slate/20 ${!tr.feasible ? 'opacity-40' : ''}`}>
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-titanium tracking-widest uppercase mb-1">{t(translations.economics.heavyTrucking)}</div>
                                    <div className="text-xs text-cold-steel font-mono">{truckNote}</div>
                                </div>
                            </div>
                            {!tr.feasible ? (
                                <div className="text-red-500 font-bold uppercase tracking-widest text-sm py-2">{t(translations.economics.infraBlocked)}</div>
                            ) : (
                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <div className="text-xl md:text-2xl font-black font-sans text-titanium">{fmtDollars(tr.cost)}</div>
                                        <div className="text-[10px] text-cold-steel uppercase tracking-widest">{t(translations.economics.estCost)}</div>
                                    </div>
                                    <div>
                                        <div className="text-xl md:text-2xl font-black font-sans text-red-500">{fmtTime(tr.days)}</div>
                                        <div className="text-[10px] text-cold-steel uppercase tracking-widest">{t(translations.economics.delivery)}</div>
                                    </div>
                                    <div>
                                        <div className="text-xl md:text-2xl font-black font-sans text-red-500">{fmtCO2(tr.co2)}</div>
                                        <div className="text-[10px] text-cold-steel uppercase tracking-widest">{t(translations.economics.co2)}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Helicopter */}
                        <div className="border border-border-subtle p-6 bg-deep-slate/20">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-titanium tracking-widest uppercase mb-1">{t(translations.economics.heavyLiftHeli)}</div>
                                    <div className="text-xs text-cold-steel font-mono">{heliNote}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <div className="text-xl md:text-2xl font-black font-sans text-red-500">{fmtDollars(h.cost)}</div>
                                    <div className="text-[10px] text-cold-steel uppercase tracking-widest">{t(translations.economics.estCost)}</div>
                                </div>
                                <div>
                                    <div className="text-xl md:text-2xl font-black font-sans text-red-500">{fmtTime(h.days)}</div>
                                    <div className="text-[10px] text-cold-steel uppercase tracking-widest">{t(translations.economics.delivery)}</div>
                                </div>
                                <div>
                                    <div className="text-xl md:text-2xl font-black font-sans text-red-500">{fmtCO2(h.co2)}</div>
                                    <div className="text-[10px] text-cold-steel uppercase tracking-widest">{t(translations.economics.co2)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Insight callout */}
                        <div className="mt-4 p-4 border border-amber/20 bg-amber/5">
                            <p className="text-xs text-cold-steel font-mono leading-relaxed tracking-wide">
                                <span className="text-amber font-bold">{t(translations.economics.keyInsight)}</span>{" "}
                                {insight}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
