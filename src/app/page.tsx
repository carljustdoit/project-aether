import HeroCanvas from "@/components/canvas/HeroCanvas";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-black text-white selection:bg-accent selection:text-black">
      <HeroCanvas />

      {/* Overlay Content */}
      <div className="relative z-10 w-full pointer-events-none">

        {/* SECTION 1: HERO */}
        <section className="h-screen w-full flex flex-col items-center justify-center pointer-events-auto" data-scroll-section>
          <div className="text-center space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mix-blend-difference">
              PROJECT AETHER
            </h1>
            <p className="text-xl text-secondary max-w-2xl mx-auto font-mono">
              The Aerial Infrastructure Network
            </p>
          </div>
        </section>

        {/* SECTION 2: THE CONFLICT */}
        <section className="h-screen w-full flex items-center justify-end px-20 pointer-events-auto relative overflow-hidden" data-scroll-section>
          {/* Background/Parallax Images */}
          <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[400px] h-[300px] opacity-60 z-[-1] transform -rotate-6">
            <img src="/assets/construction_road.png" alt="Construction Road" className="w-full h-full object-cover grayscale contrast-125 rounded-sm" />
          </div>
          <div className="absolute bottom-10 left-1/4 w-[350px] h-[250px] opacity-60 z-[-1] transform rotate-3">
            <img src="/assets/turbine_transport.png" alt="Turbine Transport" className="w-full h-full object-cover grayscale contrast-125 rounded-sm" />
          </div>

          <div className="p-10 border-l border-white/20 bg-black/50 backdrop-blur-md max-w-lg z-10">
            <h2 className="text-4xl font-bold mb-4 text-accent">The Terrain Tax</h2>
            <p className="text-secondary mb-4">
              The world builds infrastructure the hard way. Roads cost millions per mile.
              Geography dictates progress. We are removing the bottleneck.
            </p>
            <div className="text-sm font-mono text-gray-500">
               // COST_PER_MILE: $5M+ <br />
               // TIME_TO_BUILD: 24 MONTHS
            </div>
          </div>
        </section>

        {/* SECTION 3: THE SYSTEM */}
        <section className="h-screen w-full flex items-center justify-start px-20 pointer-events-auto" data-scroll-section>
          <div className="p-10 border-r border-white/20 bg-black/50 backdrop-blur-md max-w-lg">
            <h2 className="text-4xl font-bold mb-4 text-accent">Hybrid Architecture</h2>
            <p className="text-secondary mb-4">
              Hydrogen-Helium hull for free lift. Autonomous heavy-lift drones for precision.
              The first logistics system that ignores gravity.
            </p>
            <ul className="text-sm font-mono text-gray-500 space-y-2">
              <li>[+] BUOYANT_LIFT: 90%</li>
              <li>[+] ENERGY_COST: NEAR_ZERO</li>
            </ul>
          </div>
        </section>

        {/* SECTION 4: THE DROP */}
        <section className="h-screen w-full flex items-center justify-center pointer-events-auto" data-scroll-section>
          <div className="text-center max-w-2xl">
            <h2 className="text-5xl font-bold mb-6">Precision Delivered</h2>
            <p className="text-xl text-secondary">
              "Floating is free. Precision is engineered."
            </p>
          </div>
        </section>

        {/* SECTION 5: ECONOMICS */}
        <section className="h-screen w-full flex items-center justify-center pointer-events-auto" data-scroll-section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-10">
            <div className="p-8 border border-white/10 bg-surface rounded-sm">
              <div className="text-4xl font-bold text-accent mb-2">80%</div>
              <div className="text-secondary">Lower Energy Cost</div>
            </div>
            <div className="p-8 border border-white/10 bg-surface rounded-sm">
              <div className="text-4xl font-bold text-accent mb-2">$0</div>
              <div className="text-secondary">Infrastructure CapEx</div>
            </div>
            <div className="p-8 border border-white/10 bg-surface rounded-sm">
              <div className="text-4xl font-bold text-accent mb-2">100t</div>
              <div className="text-secondary">Payload Capacity</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
