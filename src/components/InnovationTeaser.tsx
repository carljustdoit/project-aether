"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SectionBackground } from "./SectionBackground";
import { useLang } from "@/i18n/LangContext";
import { translations } from "@/i18n/translations";

export function InnovationTeaser() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const { t } = useLang();

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
            <div ref={ref} className="w-full py-24 md:py-32 px-6 relative">
                <SectionBackground
                    src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200&q=60&auto=format"
                    alt="Dramatic sky"
                    opacity={3}
                    overlay="both"
                    position="center 30%"
                />
                <div className="absolute inset-0 blueprint-grid" />

                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-amber to-transparent" />

                <div className={`max-w-5xl mx-auto relative z-10 transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="mb-8 flex items-center gap-4">
                        <div className="w-3 h-3 bg-amber rotate-45" />
                        <span className="text-[11px] tracking-[0.4em] text-amber font-bold uppercase font-mono">{t(translations.innovationTeaser.overline)}</span>
                    </div>

                    <blockquote className="text-lg md:text-xl lg:text-2xl font-medium tracking-wide leading-[1.6] mb-8 text-cold-steel font-mono">
                        {t(translations.innovationTeaser.body.pre)}<span className="text-titanium">{t(translations.innovationTeaser.body.skyCarrier)}</span>{t(translations.innovationTeaser.body.mid)}
                        <span className="text-titanium">{t(translations.innovationTeaser.body.drones)}</span>{t(translations.innovationTeaser.body.suf)}
                    </blockquote>

                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-[2px] bg-amber" />
                        <span className="text-amber font-mono text-sm tracking-widest font-bold">{t(translations.innovationTeaser.tagline)}</span>
                    </div>

                    <Link
                        href="/innovation"
                        className="inline-flex items-center gap-4 px-8 py-4 border border-border-subtle text-cold-steel hover:text-amber hover:border-amber transition-all font-mono text-xs tracking-[0.2em] group"
                    >
                        <span>{t(translations.innovationTeaser.cta)}</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
