"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const links = [
        { href: "/#the-problem", label: "THE PROBLEM" },
        { href: "/innovation", label: "THE INNOVATION" },
        { href: "/how-it-works", label: "HOW IT WORKS" },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-deep-space/90 backdrop-blur-md border-b border-border-subtle px-6 py-4 font-mono">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Brand */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-amber rotate-45 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-deep-space rotate-[-45deg]" />
                        </div>
                        <span className="font-bold tracking-[0.2em] text-titanium text-xs md:text-sm">PROJECT AETHER</span>
                    </Link>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-[11px] tracking-[0.25em] transition-colors font-bold ${pathname === link.href
                                ? "text-amber"
                                : "text-cold-steel hover:text-titanium"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="flex items-center gap-2 text-cold-steel border border-border-subtle px-4 py-2">
                        <div className="w-2 h-2 bg-amber rotate-45 animate-pulse" />
                        <span className="text-[10px] tracking-[0.2em]">ONLINE</span>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex md:hidden flex-col gap-1.5 p-2"
                >
                    <div className={`w-6 h-[2px] bg-amber transition-transform ${isMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
                    <div className={`w-6 h-[2px] bg-amber transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`} />
                    <div className={`w-6 h-[2px] bg-amber transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-deep-space/95 backdrop-blur-xl border-b border-border-subtle overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col p-6 gap-6">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`text-xs tracking-[0.3em] font-bold ${pathname === link.href ? "text-amber" : "text-cold-steel"}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex items-center gap-2 text-cold-steel pt-4 border-t border-border-subtle/30">
                        <div className="w-2 h-2 bg-amber rotate-45 animate-pulse" />
                        <span className="text-[10px] tracking-[0.3em]">FLEET ONLINE</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
