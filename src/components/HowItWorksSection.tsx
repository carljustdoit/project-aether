import { BlueprintDiagram } from "./BlueprintDiagram";
import { SectionBackground } from "./SectionBackground";

export function HowItWorksSection() {
    const steps = [
        {
            num: "01",
            title: "LOAD & LIFT",
            desc: "Heavy infrastructure payload is secured into a modular cradle at the staging facility. The hydrogen-helium hybrid lift system achieves buoyancy — 200+ tons rising on physics alone. No runway, no fuel burn for lift.",
            spec: "H₂/He HYBRID LIFT · ZERO-FUEL ASCENT",
        },
        {
            num: "02",
            title: "CRUISE",
            desc: "Solar-electric hybrid motors drive the carrier across continents while the Orchestration AI plots real-time weather-optimal routes. Intercontinental range with near-zero emissions.",
            spec: "SOLAR-ELECTRIC · INTERCONTINENTAL RANGE",
        },
        {
            num: "03",
            title: "HOVER & DEPLOY",
            desc: "At the deployment zone, the Sky Carrier enters precision hover. Dynamic ballast holds position within ±0.5m. 8-12 autonomous drone modules detach, descending in coordinated formation with the payload.",
            spec: "DYNAMIC BALLAST · ±0.5M TOLERANCE",
        },
        {
            num: "04",
            title: "PLACE & DEPART",
            desc: "The drone swarm lowers cargo onto prepared foundations with sub-centimeter accuracy via LIDAR terrain mapping. Drones autonomously redock. The carrier departs. Total ground-contact footprint: zero.",
            spec: "SUB-CM ACCURACY · ZERO GROUND FOOTPRINT",
        },
    ];

    return (
        <section id="how-it-works" className="w-full py-32 px-6 relative">
            <SectionBackground
                src="https://images.unsplash.com/photo-1540575467063-178a50da2fd8?w=1200&q=60&auto=format"
                alt="Engineering hangar"
                opacity={3}
                overlay="both"
            />
            <div className="absolute inset-0 blueprint-grid" />
            <div className="max-w-6xl mx-auto relative z-10">

                {/* Header */}
                <div className="mb-20">
                    <span className="text-[11px] tracking-[0.4em] text-amber font-bold uppercase font-mono">OPERATIONAL SEQUENCE</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mt-4 mb-6">
                        How It <span className="text-amber">Works</span>
                    </h2>
                    <p className="text-cold-steel font-mono tracking-wide max-w-2xl leading-relaxed">
                        Four precision-engineered phases from origin to placement. Zero ground infrastructure required.
                    </p>
                </div>

                {/* Interactive Blueprint Diagram */}
                <div className="w-full mb-24">
                    <BlueprintDiagram />
                </div>

                {/* Combined 4-Phase Steps */}
                <div className="relative">
                    {/* Vertical connector line */}
                    <div className="absolute left-[28px] top-0 bottom-0 w-[1px] bg-border-subtle hidden md:block" />

                    <div className="space-y-0">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row gap-6 md:gap-8 group py-10 border-b border-border-subtle/50 last:border-b-0">
                                {/* Number */}
                                <div className="flex-shrink-0 relative">
                                    <div className="w-14 h-14 border border-amber/30 flex items-center justify-center bg-deep-space group-hover:bg-amber/10 group-hover:border-amber transition-all">
                                        <span className="text-amber font-black text-lg font-sans">{step.num}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-0 md:pt-1">
                                    <h3 className="text-xl font-black tracking-wider mb-3 group-hover:text-amber transition-colors">{step.title}</h3>
                                    <p className="text-cold-steel font-mono text-sm leading-[1.8] tracking-wide max-w-2xl mb-4">
                                        {step.desc}
                                    </p>
                                    <div className="text-[10px] text-amber font-bold tracking-widest uppercase">
                                        {step.spec}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tagline */}
                <div className="mt-20 text-center">
                    <p className="text-2xl md:text-3xl font-black tracking-tighter text-cold-steel">
                        Floating is free. <span className="text-amber">Precision is engineered.</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
