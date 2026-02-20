"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SectionBackground } from "./SectionBackground";

const STATS = [
    { value: "$2.3M", label: "Average cost to build 1 mile of road in mountainous terrain" },
    { value: "4.2B", label: "People live beyond reliable road networks worldwide" },
    { value: "72%", label: "Of renewable energy projects delayed by transport logistics" },
    { value: "$44B", label: "Annual cost of infrastructure delivery bottlenecks globally" },
];

const PAIN_POINTS = [
    {
        title: "WIND TURBINES STUCK AT PORTS",
        body: "A single turbine blade is 300 feet long. Moving one requires road closures, specialized trailers, and months of permitting. Many wind farm sites are simply unreachable.",
        // Turbine blades at port / transport
        image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&q=80&auto=format",
        imageAlt: "Wind turbine blades stuck during overland transport",
    },
    {
        title: "ROADS CUT INTO MOUNTAINS",
        body: "To deliver a single transformer to a remote village, entire mountainsides are dynamited. The access road costs more than the equipment it carries.",
        // Mountain road construction / switchback
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80&auto=format",
        imageAlt: "Narrow mountain road carved into steep terrain",
    },
    {
        title: "HELICOPTERS ARE LIMITED",
        body: "The world's largest heavy-lift helicopter can carry only 20 tons. A single wind turbine nacelle weighs 80+. Most infrastructure simply can't fly.",
        // Helicopter heavy lift
        image: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&q=80&auto=format",
        imageAlt: "Heavy-lift helicopter struggling with payload over mountains",
    },
    {
        title: "DISASTER ZONES CUT OFF",
        body: "When earthquakes destroy roads and floods wash out bridges, millions are stranded. Heavy equipment can't reach them for weeks or months.",
        // Disaster / flood / destroyed infrastructure
        image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80&auto=format",
        imageAlt: "Flood-damaged roads cutting off communities",
    },
];

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <span className="text-4xl md:text-5xl font-black font-sans text-amber">{target}</span>
            <span className="text-amber text-2xl">{suffix}</span>
        </div>
    );
}

export function ProblemSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    return (
        <section ref={sectionRef} id="the-problem" className="w-full relative bg-deep-space overflow-hidden">

            {/* ─── Dark headline block ─── */}
            <div className="w-full py-32 px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-[#0a0e14] to-deep-space" />
                <SectionBackground
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=60&auto=format"
                    alt="Industrial port cranes"
                    opacity={3}
                    overlay="both"
                />
                <div className="absolute inset-0 blueprint-grid opacity-50" />

                <div className="max-w-5xl mx-auto relative z-10">

                    {/* Overline */}
                    <div className="mb-8 flex items-center gap-4">
                        <div className="w-3 h-3 bg-red-500 rotate-45" />
                        <span className="text-[11px] tracking-[0.4em] text-red-400 font-bold uppercase font-mono">THE PROBLEM</span>
                    </div>

                    {/* Main Headline */}
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] mb-8">
                        The world builds<br />
                        infrastructure<br />
                        <span className="text-amber">the hard way.</span>
                    </h2>

                    {/* Supporting body */}
                    <div className="max-w-2xl space-y-4 mb-16">
                        <p className="text-lg text-cold-steel font-mono leading-relaxed tracking-wide">
                            Roads cost <strong className="text-titanium">millions per mile</strong>.{" "}
                            Helicopters are <strong className="text-titanium">expensive and limited</strong>.{" "}
                            Remote regions remain <strong className="text-titanium">locked out</strong>.
                        </p>
                    </div>

                    {/* Stats bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 border border-border-subtle">
                        {STATS.map((stat, i) => (
                            <div key={i} className={`p-6 md:p-8 border-border-subtle ${i < STATS.length - 1 ? "sm:border-r" : ""} ${i < 3 ? "border-b" : ""} ${i < 2 ? "md:border-b-0" : "sm:border-b-0"}`}>
                                <AnimatedCounter target={stat.value} />
                                <p className="text-[10px] text-cold-steel font-mono tracking-widest uppercase mt-3 leading-relaxed font-bold">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Pain point cards with hover-reveal images ─── */}
            <div className="w-full py-24 px-6 relative">
                <div className="absolute inset-0 bg-[#080c10]" />
                <div className="max-w-7xl mx-auto relative z-10">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {PAIN_POINTS.map((point, i) => (
                            <div
                                key={i}
                                className="border border-border-subtle group relative overflow-hidden min-h-[320px] cursor-pointer"
                            >
                                {/* Background image — hidden by default, revealed on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                                    <Image
                                        src={point.image}
                                        alt={point.imageAlt}
                                        fill
                                        className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        unoptimized
                                    />
                                    {/* Dark overlay so text remains readable */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#080c10] via-[#080c10]/80 to-[#080c10]/40" />
                                    {/* Red-tinted overlay for dramatic effect */}
                                    <div className="absolute inset-0 bg-red-900/15 mix-blend-multiply" />
                                </div>

                                {/* Default hover glow (visible when no image loads) */}
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-0 transition-opacity" />

                                {/* Content */}
                                <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                                    <div className="flex items-start justify-between mb-6">
                                        {/* Number badge — scales up on hover */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 border border-red-500/30 group-hover:border-red-400/60 flex items-center justify-center transition-colors">
                                                <span className="text-red-500/60 group-hover:text-red-400 font-bold text-xs font-mono transition-colors">
                                                    0{i + 1}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-red-500/10 group-hover:text-red-500/20 font-black text-7xl font-sans leading-none transition-colors">
                                            0{i + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black tracking-wider mb-4 group-hover:text-red-400 transition-colors">
                                        {point.title}
                                    </h3>
                                    <p className="text-cold-steel font-mono text-sm leading-[1.8] tracking-wide group-hover:text-cold-steel/90 transition-colors">
                                        {point.body}
                                    </p>

                                    {/* Bottom accent line — animates width on hover */}
                                    <div className="mt-6 h-[2px] bg-red-500/20 group-hover:bg-red-400/50 w-0 group-hover:w-full transition-all duration-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Transition / Pivot statement ─── */}
            <div className="w-full py-32 px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-[#080c10] via-deep-space to-deep-space" />
                <SectionBackground
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=60&auto=format"
                    alt="Remote mountain landscape"
                    opacity={3}
                    overlay="both"
                    position="center 40%"
                />
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <p className="text-3xl md:text-5xl font-black tracking-tighter text-cold-steel leading-tight mb-6">
                        The problem isn&apos;t engineering.
                    </p>
                    <p className="text-3xl md:text-5xl font-black tracking-tighter text-amber leading-tight">
                        It&apos;s access.
                    </p>

                    {/* Divider */}
                    <div className="flex justify-center mt-12 mb-12">
                        <div className="w-[1px] h-20 bg-gradient-to-b from-amber/60 to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    );
}
