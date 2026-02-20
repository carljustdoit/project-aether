import { BlueprintDiagram } from "./BlueprintDiagram";
import { SectionBackground } from "./SectionBackground";

export function HowItWorksSection() {
    const steps = [
        { num: "01", title: "LOAD CARGO", desc: "Heavy infrastructure payload — wind turbine blades, transformer units, bridge segments — is secured into a modular cradle system at the staging facility." },
        { num: "02", title: "SKY CARRIER LIFTS", desc: "The hydrogen-helium hybrid lift system achieves buoyancy. The Sky Carrier ascends effortlessly — 200+ tons rising on physics alone. No runway, no fuel burn for lift." },
        { num: "03", title: "CRUISE", desc: "Energy-efficient propulsion drives the carrier across continents. Solar-electric hybrid motors maintain course while the Orchestration Platform plots real-time weather-optimal routes." },
        { num: "04", title: "HOVER ABOVE DESTINATION", desc: "Arriving at the deployment zone, the Sky Carrier enters precision hover. Dynamic ballast control maintains position within ±0.5m — even in 40-knot crosswinds." },
        { num: "05", title: "DRONE MODULES DETACH", desc: "8-12 autonomous Deployment Modules release from the carrier's belly. Each unit carries stabilization thrusters and force-feedback winches for centimeter-level control." },
        { num: "06", title: "PRECISION PLACEMENT", desc: "The drone swarm descends in coordinated formation, lowering the payload onto prepared foundations. Sub-centimeter accuracy via LIDAR terrain mapping and real-time AI adjustments." },
        { num: "07", title: "REDOCK & DEPART", desc: "Drones autonomously return to the carrier. The Sky Carrier re-balances ballast and departs for the next mission. Total ground-contact footprint: zero." },
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
                        Seven precision-engineered phases from origin to placement. Zero ground infrastructure required.
                    </p>
                </div>

                {/* Interactive Blueprint Diagram */}
                <div className="w-full mb-24">
                    <BlueprintDiagram />
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[28px] top-0 bottom-0 w-[1px] bg-border-subtle hidden md:block" />

                    <div className="space-y-0">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex gap-8 group py-8 border-b border-border-subtle/50 last:border-b-0">
                                {/* Number */}
                                <div className="flex-shrink-0 relative">
                                    <div className="w-14 h-14 border border-amber/30 flex items-center justify-center bg-deep-space group-hover:bg-amber/10 group-hover:border-amber transition-all">
                                        <span className="text-amber font-black text-lg font-sans">{step.num}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1">
                                    <h3 className="text-xl font-black tracking-wider mb-3 group-hover:text-amber transition-colors">{step.title}</h3>
                                    <p className="text-cold-steel font-mono text-sm leading-[1.8] tracking-wide max-w-2xl">
                                        {step.desc}
                                    </p>
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
