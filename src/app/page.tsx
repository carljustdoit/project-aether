import HeroCanvas from "@/components/canvas/HeroCanvas";
import { TelemetryMatrix } from "@/components/dom/TelemetryMatrix";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-transparent selection:bg-emerald-200 selection:text-emerald-900 text-slate-800">
      <HeroCanvas />

      {/* Overlay Content */}
      <div className="relative z-10 w-full pointer-events-none">

        {/* SECTION 1: HERO - High-Tech Naturalism */}
        <section className="h-screen w-full flex flex-col items-center justify-center pointer-events-auto" data-scroll-section>
          <div className="text-center space-y-6">
            <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-slate-900 opacity-90">
              PROJECT AETHER
            </h1>
            <p className="text-2xl md:text-3xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
              Global Utility in Harmony with Nature.
            </p>
          </div>
        </section>

        {/* SECTION 2: THE CONFLICT (Updating copy/style to V2) */}
        <section className="h-screen w-full flex items-center justify-end px-6 md:px-20 pointer-events-auto relative overflow-hidden" data-scroll-section>
          {/* Background/Parallax Images */}
          <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[500px] h-[400px] opacity-80 z-[-1] transform -rotate-3 rounded-2xl overflow-hidden shadow-2xl">
            <img src="/assets/construction_road.png" alt="Traditional Infrastructure" className="w-full h-full object-cover grayscale opacity-50 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
          </div>

          <div className="p-12 bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl max-w-lg z-10">
            <div className="text-emerald-600 font-mono text-sm mb-4 tracking-widest uppercase">The Bottleneck</div>
            <h2 className="text-4xl font-bold mb-6 text-slate-900">Earth has Limits.<br />The Sky Does Not.</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Traditional infrastructure scars the landscape. We spend trillions paving over nature to reach resources. Aether removes the road equation entirely.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm font-mono text-slate-500 border-t border-slate-200 pt-6">
              <div>
                <span className="block text-slate-900 font-bold">COST / MILE</span>
                $10,000,000+
              </div>
              <div>
                <span className="block text-slate-900 font-bold">ECO IMPACT</span>
                High (Deforestation)
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: TELEMETRY MATRIX (New V2 Component) */}
        <div className="pointer-events-auto bg-white relative z-20">
          <TelemetryMatrix />
        </div>

        {/* SECTION 4: THE DROP / VERTICAL LOGISTICS */}
        <section className="h-screen w-full flex items-center justify-center pointer-events-auto bg-gradient-to-b from-white to-blue-50" data-scroll-section>
          <div className="text-center max-w-4xl px-6">
            <div className="text-amber-500 font-mono text-sm mb-4 tracking-widest uppercase">Precision Delivery</div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-slate-900">Vertical Logistics.</h2>
            <p className="text-2xl text-slate-600 font-light">
              From the stratosphere to the last meter. <br />
              <strong className="font-semibold text-slate-900">No runway required.</strong>
            </p>
          </div>
        </section>

        {/* SECTION 5: GLOBAL IMPACT / GLOBE PLACEHOLDER */}
        <section className="h-screen w-full flex items-center justify-center pointer-events-auto bg-blue-50" data-scroll-section>
          <div className="absolute top-20 left-0 w-full text-center z-10 px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Next-Generation Global Heavy Infra Transportation Network</h2>
            <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">Real-time Operations</p>
          </div>
        </section>
      </div>
    </main>
  );
}
