"use client";

import { useEffect, useRef, useState } from "react";
import { SectionBackground } from "./SectionBackground";

export function InnovationSection() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="the-innovation" className="w-full relative bg-deep-space overflow-hidden">

            {/* ─── One-liner mission statement ─── */}
            <div ref={ref} className="w-full py-24 md:py-32 px-6 relative">
                <div className="absolute inset-0 blueprint-grid" />

                {/* Glowing accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-amber to-transparent" />

                <div className={`max-w-5xl mx-auto relative z-10 transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="mb-8 flex items-center gap-4">
                        <div className="w-3 h-3 bg-amber rotate-45" />
                        <span className="text-[11px] tracking-[0.4em] text-amber font-bold uppercase font-mono">OUR ANSWER</span>
                    </div>

                    <blockquote className="text-lg md:text-xl lg:text-2xl font-medium tracking-wide leading-[1.6] mb-8 text-cold-steel font-mono">
                        We are building a <span className="text-titanium">buoyant long-range sky carrier</span> paired with{" "}
                        <span className="text-titanium">autonomous heavy-lift drone modules</span> to deliver large-scale
                        infrastructure anywhere on Earth — without roads, runways, or helicopters.
                    </blockquote>

                    <div className="flex items-center gap-3 mt-8">
                        <div className="w-12 h-[2px] bg-amber" />
                        <span className="text-amber font-mono text-sm tracking-widest font-bold">BUOYANCY, NOT THRUST.</span>
                    </div>
                </div>
            </div>

            {/* ─── Three subsystems ─── */}
            <div className="w-full py-24 px-6 relative">
                <SectionBackground
                    src="https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1200&q=60&auto=format"
                    alt="Aerospace engineering"
                    opacity={3}
                    overlay="both"
                />
                <div className="absolute inset-0 blueprint-grid" />
                <div className="max-w-7xl mx-auto relative z-10">

                    <div className="mb-16">
                        <span className="text-[11px] tracking-[0.4em] text-amber font-bold uppercase font-mono">THE SYSTEM</span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mt-4 mb-6 leading-tight">
                            Three Integrated<br />
                            <span className="text-amber">Subsystems</span>
                        </h2>
                        <p className="text-cold-steel font-mono tracking-wide max-w-2xl leading-relaxed">
                            Working in concert to deliver infrastructure where roads, runways, and ports don&apos;t exist.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                        {/* A. The Sky Carrier */}
                        <div className="border border-border-subtle p-10 group hover:bg-deep-slate/50 transition-all">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="text-amber font-bold text-sm tracking-widest">A.</span>
                                <h3 className="text-2xl font-black tracking-tight">THE SKY CARRIER</h3>
                            </div>
                            <p className="text-cold-steel font-mono text-sm leading-[1.8] mb-10">
                                The buoyant long-range mothership. Hydrogen-helium hybrid lift in a composite
                                envelope that never needs to touch the ground.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "200+ ton payload capacity",
                                    "Zero-fuel buoyant lift",
                                    "Intercontinental range",
                                    "No landing infrastructure required",
                                ].map((spec, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-amber rotate-45 flex-shrink-0" />
                                        <span className="text-amber text-xs tracking-widest uppercase font-bold">{spec}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* B. Drone Deployment Modules */}
                        <div className="border border-border-subtle p-10 group hover:bg-deep-slate/50 transition-all border-t-0 lg:border-t lg:border-l-0 lg:border-r-0">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="text-amber font-bold text-sm tracking-widest">B.</span>
                                <h3 className="text-2xl font-black tracking-tight">DRONE MODULES</h3>
                            </div>
                            <p className="text-cold-steel font-mono text-sm leading-[1.8] mb-10">
                                Autonomous heavy-lift systems that detach from the carrier, descend with payload,
                                place with sub-centimeter precision, and return.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "8-12 synchronized lift units",
                                    "Force-feedback winches",
                                    "Terrain-adaptive landing",
                                    "Autonomous return & redock",
                                ].map((spec, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-amber rotate-45 flex-shrink-0" />
                                        <span className="text-amber text-xs tracking-widest uppercase font-bold">{spec}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* C. Orchestration */}
                        <div className="border border-border-subtle p-10 group hover:bg-deep-slate/50 transition-all border-t-0 lg:border-t">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="text-amber font-bold text-sm tracking-widest">C.</span>
                                <h3 className="text-2xl font-black tracking-tight">ORCHESTRATION AI</h3>
                            </div>
                            <p className="text-cold-steel font-mono text-sm leading-[1.8] mb-10">
                                The mission brain that coordinates every operation — from weather-optimal routing
                                to centimeter-level payload placement.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Real-time weather modeling",
                                    "AI route optimization",
                                    "Fleet management at scale",
                                    "Precision deployment algorithms",
                                ].map((spec, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-amber rotate-45 flex-shrink-0" />
                                        <span className="text-amber text-xs tracking-widest uppercase font-bold">{spec}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Evolution narrative ─── */}
            <div className="w-full py-24 px-6 relative">
                <SectionBackground
                    src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&q=60&auto=format"
                    alt="Vintage airship"
                    opacity={4}
                    overlay="both"
                    position="center 20%"
                />
                <div className="absolute inset-0 blueprint-grid" />
                <div className="max-w-4xl mx-auto relative z-10">

                    <div className="mb-20">
                        <span className="text-[11px] tracking-[0.4em] text-amber font-bold uppercase font-mono">100 YEARS OF EVOLUTION</span>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mt-4 mb-8 leading-tight">
                            The Airship Never<br />
                            <span className="text-amber">Disappeared.</span> It Evolved.
                        </h2>
                    </div>

                    <div className="space-y-16 text-lg text-cold-steel font-mono leading-[1.9] tracking-wide">
                        <div className="flex gap-8 items-start">
                            <div className="text-amber font-bold text-4xl font-sans mt-1 opacity-30 w-24 flex-shrink-0 text-right">1930s</div>
                            <div>
                                <p>
                                    Airships filled with <strong className="text-titanium">pure hydrogen</strong> carried passengers across oceans.
                                    They were massive — 800 feet of structured buoyancy. But hydrogen was volatile, and
                                    <strong className="text-titanium"> landing required hundreds of ground crew</strong> and
                                    purpose-built mooring masts that cost millions.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-8 items-start">
                            <div className="text-amber font-bold text-4xl font-sans mt-1 opacity-30 w-24 flex-shrink-0 text-right">Today</div>
                            <div>
                                <p>
                                    We&apos;ve solved both problems. <strong className="text-titanium">Renewable hydrogen combined with helium</strong> in
                                    a composite-reinforced envelope creates a stable, non-flammable lifting gas at a fraction
                                    of the cost. Advanced <strong className="text-titanium">carbon-fiber composite structures</strong> replace
                                    aluminum and fabric with materials 10x stronger at half the weight.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-8 items-start">
                            <div className="text-amber font-bold text-4xl font-sans mt-1 opacity-60 w-24 flex-shrink-0 text-right">Future</div>
                            <div>
                                <p>
                                    And the biggest breakthrough? <strong className="text-amber">The carrier never needs to land.</strong> It
                                    hovers as a mothership at altitude while <strong className="text-titanium">autonomous drone modules</strong> descend
                                    to load and unload extra-heavy cargo with sub-centimeter precision. No runway.
                                    No port. No roads. Just physics.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
