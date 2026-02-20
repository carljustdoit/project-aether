"use client";

import { AirshipScene } from "./AirshipScene";
import { useLang } from "@/i18n/LangContext";
import { translations } from "@/i18n/translations";

export function HeroSection() {
    const { t } = useLang();

    return (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            {/* Interactive 3D Airship Background */}
            <AirshipScene />

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 z-5 bg-gradient-to-b from-deep-space/80 via-deep-space/40 to-deep-space" />

            {/* Blueprint grid */}
            <div className="absolute inset-0 z-6 blueprint-grid" />

            {/* Content */}
            <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl">

                {/* Overline */}
                <div className="mb-10 flex items-center gap-4">
                    <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-amber" />
                    <span className="text-[11px] tracking-[0.4em] text-amber font-bold uppercase">{t(translations.hero.overline)}</span>
                    <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-amber" />
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl md:text-7xl lg:text-[7rem] font-black mb-8 tracking-tighter uppercase leading-[0.9]">
                    {t(translations.hero.headline1)}<br />
                    {t(translations.hero.headline2)} <span className="text-amber">{t(translations.hero.headlineAccent)}</span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl text-cold-steel mb-6 max-w-3xl font-mono tracking-wide leading-relaxed">
                    {t(translations.hero.sub)}
                </p>

                <p className="text-amber font-mono tracking-widest text-sm mb-16 font-bold">
                    {t(translations.hero.tagline)}
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-center gap-8">
                    <a
                        href="/innovation"
                        className="px-12 py-5 border-2 border-amber text-amber font-bold tracking-[0.2em] text-sm hover:bg-amber hover:text-deep-space transition-all uppercase group flex items-center gap-4"
                    >
                        <span>{t(translations.hero.cta)}</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                    <span className="flex items-center gap-2 text-cold-steel text-xs tracking-widest">
                        <div className="w-2 h-2 bg-amber rotate-45" />
                        {t(translations.hero.badge)}
                    </span>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-[-120px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                    <span className="text-[10px] tracking-[0.3em] text-cold-steel uppercase">{t(translations.hero.status)}</span>
                    <div className="w-[1px] h-16 bg-gradient-to-b from-amber/50 to-transparent" />
                </div>
            </div>
        </section>
    );
}
