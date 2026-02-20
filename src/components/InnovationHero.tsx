import Image from "next/image";

export function InnovationHero() {
    return (
        <section className="relative w-full h-screen flex items-end justify-start overflow-hidden">
            {/* Full-bleed background image */}
            <div className="absolute inset-0">
                <Image
                    src="/assets/airship_hero.png"
                    alt="Aether Sky Carrier deploying drone modules over mountain terrain"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                />
            </div>

            {/* Gradient overlays for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-deep-space via-deep-space/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-deep-space/60 to-transparent" />

            {/* Blueprint grid (extremely subtle) */}
            <div className="absolute inset-0 blueprint-grid opacity-15" />

            {/* Content - bottom-left aligned like SpaceX */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-20 md:pb-28">
                <div className="max-w-3xl">
                    <div className="mb-6 flex items-center gap-4">
                        <div className="w-3 h-3 bg-amber rotate-45" />
                        <span className="text-[11px] tracking-[0.4em] text-amber font-bold uppercase font-mono">THE INNOVATION</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter uppercase leading-[0.9] mb-8">
                        The Sky<br />
                        <span className="text-amber">Carrier.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-cold-steel font-mono tracking-wide leading-relaxed max-w-xl">
                        A buoyant mothership and autonomous drone fleet — delivering 200+ tons anywhere on Earth without roads, runways, or ports.
                    </p>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 right-6 md:right-12 flex flex-col items-center gap-3">
                    <span className="text-[10px] tracking-[0.3em] text-cold-steel uppercase font-mono">SCROLL TO EXPLORE</span>
                    <div className="w-[1px] h-16 bg-gradient-to-b from-amber/50 to-transparent" />
                </div>
            </div>
        </section>
    );
}
