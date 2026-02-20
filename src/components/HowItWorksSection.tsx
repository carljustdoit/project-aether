"use client";

import { BlueprintDiagram } from "./BlueprintDiagram";
import { SectionBackground } from "./SectionBackground";
import { useLang } from "@/i18n/LangContext";
import { translations } from "@/i18n/translations";

export function HowItWorksSection() {
    const { t } = useLang();

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
                    <span className="text-[11px] tracking-[0.4em] text-amber font-bold uppercase font-mono">{t(translations.howItWorks.overline)}</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mt-4 mb-6">
                        {t(translations.howItWorks.headline)} <span className="text-amber">{t(translations.howItWorks.headlineAccent)}</span>
                    </h2>
                    <p className="text-cold-steel font-mono tracking-wide max-w-2xl leading-relaxed">
                        {t(translations.howItWorks.sub)}
                    </p>
                </div>

                {/* Interactive Blueprint Diagram */}
                <div className="w-full mb-24">
                    <BlueprintDiagram />
                </div>

                {/* Combined 4-Phase Steps */}
                <div className="relative">
                    <div className="absolute left-[28px] top-0 bottom-0 w-[1px] bg-border-subtle hidden md:block" />

                    <div className="space-y-0">
                        {translations.howItWorks.steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row gap-6 md:gap-8 group py-10 border-b border-border-subtle/50 last:border-b-0">
                                <div className="flex-shrink-0 relative">
                                    <div className="w-14 h-14 border border-amber/30 flex items-center justify-center bg-deep-space group-hover:bg-amber/10 group-hover:border-amber transition-all">
                                        <span className="text-amber font-black text-lg font-sans">0{idx + 1}</span>
                                    </div>
                                </div>

                                <div className="flex-1 pt-0 md:pt-1">
                                    <h3 className="text-xl font-black tracking-wider mb-3 group-hover:text-amber transition-colors">{t(step.title)}</h3>
                                    <p className="text-cold-steel font-mono text-sm leading-[1.8] tracking-wide max-w-2xl mb-4">
                                        {t(step.desc)}
                                    </p>
                                    <div className="text-[10px] text-amber font-bold tracking-widest uppercase">
                                        {t(step.spec)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tagline */}
                <div className="mt-20 text-center">
                    <p className="text-2xl md:text-3xl font-black tracking-tighter text-cold-steel">
                        {t(translations.howItWorks.tagline1)}<span className="text-amber">{t(translations.howItWorks.taglineAccent)}</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
