"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function TelemetryMatrix() {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".stat-card", {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            });

            // Number counter animation could be here
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-24 bg-white text-slate-800">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold mb-12 text-slate-900 font-sans tracking-tight">
                    The New Economics of Flight
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Stat 1 */}
                    <div className="stat-card p-8 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
                        <div className="font-mono text-sm text-slate-500 mb-2">LIFT_EFFICIENCY</div>
                        <div className="text-6xl font-bold text-blue-600 mb-2">90<span className="text-2xl">%</span></div>
                        <div className="text-xl font-semibold mb-4">Buoyancy Assisted</div>
                        <p className="text-slate-600 leading-relaxed">
                            By using hydrogen for lift, we only spend energy on propulsion. Gravity is no longer an adversary.
                        </p>
                    </div>

                    {/* Stat 2 */}
                    <div className="stat-card p-8 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
                        <div className="font-mono text-sm text-slate-500 mb-2">INFRA_COST</div>
                        <div className="text-6xl font-bold text-emerald-600 mb-2">$0</div>
                        <div className="text-xl font-semibold mb-4">Per Mile Built</div>
                        <p className="text-slate-600 leading-relaxed">
                            Roads cost $5M/mile. Runways cost $500M. The sky is free infrastructure, available instantly.
                        </p>
                    </div>

                    {/* Stat 3 */}
                    <div className="stat-card p-8 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
                        <div className="font-mono text-sm text-slate-500 mb-2">CARBON_IMPACT</div>
                        <div className="text-6xl font-bold text-amber-500 mb-2">-85<span className="text-2xl">%</span></div>
                        <div className="text-xl font-semibold mb-4">CO2 vs Heavy Lift</div>
                        <p className="text-slate-600 leading-relaxed">
                            Replacing diesel trucking and heavy cargo planes with float-and-fly hybrid logistics.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
