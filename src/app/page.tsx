"use client";

import Link from "next/link";
import { Sparkles, LayoutGrid, ShoppingBag, Calendar, ArrowRight, Cpu, Heart, BarChart3 } from "lucide-react";

const FEATURES = [
    {
        icon: Sparkles,
        title: "AI-Powered Generation",
        description: "Get 3 personalized outfits based on mood, occasion, and weather context.",
        href: "/generate",
    },
    {
        icon: LayoutGrid,
        title: "Outfit History",
        description: "Review past recommendations, rate outfits, and refine future suggestions.",
        href: "/outfits",
    },
    {
        icon: ShoppingBag,
        title: "Wardrobe Manager",
        description: "Full inventory of your clothing with category, season, and wear tracking.",
        href: "/wardrobe",
    },
    {
        icon: Calendar,
        title: "Calendar Planner",
        description: "Schedule outfits for upcoming days and plan your week ahead.",
        href: "/calendar",
    },
];

const SIGNALS = [
    { icon: Cpu, label: "Rule-Based Engine", detail: "Scoring algorithm with 6 weighted factors" },
    { icon: Heart, label: "Feedback Loop", detail: "Ratings inform future outfit generation" },
    { icon: BarChart3, label: "Wear Analytics", detail: "Frequency tracking prevents over-rotation" },
];

export default function HomePage() {
    return (
        <div className="space-y-16">
            {/* Hero */}
            <section className="relative overflow-hidden py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                {/* Gradient bg shapes */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #ff2d73 0%, transparent 70%)" }} />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #ff2d73 0%, transparent 70%)" }} />
                </div>

                <div className="max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 text-2xs font-medium uppercase tracking-wider text-neutral-500 border border-neutral-200 mb-6" style={{ borderRadius: "var(--radius-md)" }}>
                        AI-Powered Style Engine
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 mb-4" style={{ lineHeight: 1.1 }}>
                        Your wardrobe,<br />
                        <span style={{ color: "#ff2d73" }}>intelligently styled.</span>
                    </h1>
                    <p className="text-base text-neutral-500 max-w-lg mx-auto mb-8 leading-relaxed">
                        GlamGenius generates personalized outfit recommendations using your wardrobe inventory,
                        mood context, and wear frequency analysis. Three outfits, every time.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <Link href="/generate" className="btn-primary text-sm px-6 py-2.5 gap-2">
                            Generate Outfits <ArrowRight size={16} />
                        </Link>
                        <Link href="/about" className="btn-secondary text-sm px-6 py-2.5">
                            How It Works
                        </Link>
                    </div>
                </div>
            </section>

            {/* Technical Signals */}
            <section>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {SIGNALS.map(({ icon: Icon, label, detail }) => (
                        <div key={label} className="flex items-start gap-3 p-4 border border-neutral-200 bg-white" style={{ borderRadius: "var(--radius-lg)" }}>
                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                                <Icon size={16} className="text-neutral-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-neutral-900">{label}</p>
                                <p className="text-xs text-neutral-500 mt-0.5">{detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Feature Cards */}
            <section>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FEATURES.map(({ icon: Icon, title, description, href }) => (
                        <Link
                            key={href}
                            href={href}
                            className="group card p-4 flex items-start gap-3 hover:shadow-md transition-all"
                        >
                            <div className="w-9 h-9 rounded-md bg-neutral-50 border border-neutral-100 flex items-center justify-center flex-shrink-0 group-hover:border-neutral-200 transition-colors">
                                <Icon size={18} strokeWidth={1.5} className="text-neutral-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-brand-600 transition-colors">{title}</h3>
                                <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
                            </div>
                            <ArrowRight size={14} className="text-neutral-300 group-hover:text-neutral-500 mt-1 transition-colors" />
                        </Link>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center text-xs text-neutral-400 pb-8">
                Built with Next.js · TypeScript · Tailwind CSS · Prisma · SQLite
            </footer>
        </div>
    );
}
