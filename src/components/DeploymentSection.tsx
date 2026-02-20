import { SectionBackground } from "./SectionBackground";

export function DeploymentSection() {
    return (
        <section className="w-full py-32 px-6 relative">
            <SectionBackground
                src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=60&auto=format"
                alt="Aerial view of remote terrain"
                opacity={3}
                overlay="both"
                position="center 40%"
            />
            <div className="absolute inset-0 blueprint-grid" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <div className="mb-24">
                    <span className="text-[11px] tracking-[0.4em] text-amber font-bold uppercase font-mono">OPERATIONAL SEQUENCE</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mt-4 mb-6">
                        Four-Phase <span className="text-amber">Deployment</span>
                    </h2>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
                    {[
                        { phase: "1", title: "CRUISE", desc: "Intercontinental buoyancy transport. Zero-fuel horizontal movement via hybrid lift.", spec: "H2/He hybrid @ 98% efficiency" },
                        { phase: "2", title: "HOVER", desc: "Precision GPS positioning above deployment zone. Mothership maintains absolute stillness.", spec: "Dynamic ballast ±0.5m tolerance" },
                        { phase: "3", title: "DEPLOY", desc: "Aerial crane array descends with payload. Synchronized 8-12 rotor lift units.", spec: "200+ ton / 500m vertical range" },
                        { phase: "4", title: "DELIVERY", desc: "Precision ground placement via force-feedback winches. Cranes return to mothership.", spec: "Sub-centimeter accuracy" },
                    ].map((item, idx) => (
                        <div key={idx} className="border border-border-subtle p-8 group hover:bg-deep-slate/30 transition-all">
                            <div className="flex justify-between items-start mb-10">
                                <h3 className="text-xl text-amber font-black tracking-widest">{item.title}</h3>
                                <div className="w-10 h-10 border border-amber flex items-center justify-center text-amber font-black group-hover:bg-amber group-hover:text-deep-space transition-all">
                                    {item.phase}
                                </div>
                            </div>
                            <p className="text-cold-steel font-mono text-sm leading-[1.8] mb-10">
                                {item.desc}
                            </p>
                            <div className="pt-4 border-t border-border-subtle/50 text-[10px] text-amber font-bold tracking-widest uppercase leading-relaxed">
                                {item.spec}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
