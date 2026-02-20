import { SectionBackground } from "./SectionBackground";

export function TerrainComparisonSection() {
    const systems = [
        { name: "Heavy Trucking", road: "Yes", runway: "No", energy: "High", setup: "Slow", highlight: false },
        { name: "Heavy-Lift Helicopter", road: "No", runway: "No", energy: "Very High", setup: "Medium", highlight: false },
        { name: "Cargo Aircraft", road: "Yes", runway: "Yes", energy: "Medium", setup: "Slow", highlight: false },
        { name: "Project Aether", road: "No", runway: "No", energy: "Low", setup: "Fast", highlight: true },
    ];

    return (
        <section className="w-full py-32 px-6 relative">
            <SectionBackground
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=60&auto=format"
                alt="Earth from space"
                opacity={2}
                overlay="both"
            />
            <div className="max-w-5xl mx-auto relative z-10">

                <div className="mb-16">
                    <span className="text-[11px] tracking-[0.4em] text-amber font-bold uppercase font-mono">COMPETITIVE ANALYSIS</span>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter mt-4 mb-6">
                        Terrain <span className="text-amber">Comparison</span>
                    </h2>
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto border border-border-subtle">
                    <table className="w-full font-mono text-sm">
                        <thead>
                            <tr className="border-b border-border-subtle bg-deep-slate/30">
                                <th className="text-left py-4 px-6 text-[10px] tracking-[0.3em] text-cold-steel uppercase font-bold">System</th>
                                <th className="text-center py-4 px-4 text-[10px] tracking-[0.3em] text-cold-steel uppercase font-bold">Road Required</th>
                                <th className="text-center py-4 px-4 text-[10px] tracking-[0.3em] text-cold-steel uppercase font-bold">Runway Required</th>
                                <th className="text-center py-4 px-4 text-[10px] tracking-[0.3em] text-cold-steel uppercase font-bold">Energy / Ton</th>
                                <th className="text-center py-4 px-4 text-[10px] tracking-[0.3em] text-cold-steel uppercase font-bold">Setup Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {systems.map((sys, idx) => (
                                <tr
                                    key={idx}
                                    className={`border-b border-border-subtle/50 last:border-b-0 ${sys.highlight
                                        ? "bg-amber/5 border-l-2 border-l-amber"
                                        : "hover:bg-deep-slate/20"
                                        } transition-colors`}
                                >
                                    <td className={`py-5 px-6 font-bold tracking-wider uppercase text-sm ${sys.highlight ? "text-amber" : "text-titanium"}`}>
                                        {sys.name}
                                    </td>
                                    <td className="text-center py-5 px-4">
                                        <span className={sys.road === "No" && sys.highlight ? "text-green-400 font-bold" : sys.road === "Yes" ? "text-red-400" : "text-green-400"}>
                                            {sys.road}
                                        </span>
                                    </td>
                                    <td className="text-center py-5 px-4">
                                        <span className={sys.runway === "No" && sys.highlight ? "text-green-400 font-bold" : sys.runway === "Yes" ? "text-red-400" : "text-green-400"}>
                                            {sys.runway}
                                        </span>
                                    </td>
                                    <td className="text-center py-5 px-4">
                                        <span className={`font-bold ${sys.energy === "Low" ? "text-green-400" :
                                            sys.energy === "Medium" ? "text-amber" :
                                                sys.energy === "High" ? "text-red-400" : "text-red-500"
                                            }`}>
                                            {sys.energy}
                                        </span>
                                    </td>
                                    <td className="text-center py-5 px-4">
                                        <span className={`font-bold ${sys.setup === "Fast" ? "text-green-400" :
                                            sys.setup === "Medium" ? "text-amber" : "text-red-400"
                                            }`}>
                                            {sys.setup}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
