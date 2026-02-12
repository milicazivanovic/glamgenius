import { Cpu, Heart, BarChart3, Sparkles, ArrowRight, GitBranch, Layers, RefreshCw } from "lucide-react";
import Link from "next/link";

const SCORING_FACTORS = [
    { label: "Season Compatibility", weight: "+3 / −5", description: "Checks all items are from compatible seasons. Penalizes conflicts like summer + winter." },
    { label: "Weather Match", weight: "+3 / +1", description: "Maps weather input to appropriate seasons. Full bonus when all items match." },
    { label: "Color Harmony", weight: "+2 / −3", description: "Detects color clashes between top and bottom. Uses predefined clash table (e.g. red+orange, navy+black)." },
    { label: "Mood Match", weight: "+N", description: "Counts tag overlaps with mood-associated tags (e.g. 'happy' → casual, sporty, weekend)." },
    { label: "Occasion Match", weight: "+N", description: "Counts tag overlaps with occasion-associated tags (e.g. 'work' → office, formal, classic)." },
    { label: "Wear Frequency", weight: "+2 / −1", description: "Bonus for under-worn items (avg ≤ 3). Penalty for over-worn items (avg > 7)." },
];

const PIPELINE_STEPS = [
    { icon: Layers, title: "Combinatorial Generation", description: "Enumerate all top × bottom × shoe combinations. Optionally add outerwear layer." },
    { icon: Cpu, title: "Multi-Factor Scoring", description: "Score each combination across 6 weighted factors. Higher score = better recommendation." },
    { icon: GitBranch, title: "Deduplication & Ranking", description: "Sort by score, deduplicate by item set, select top 3 unique outfits." },
    { icon: Heart, title: "Feedback Collection", description: "User rates outfits 1-5 and indicates wear-again preference. Stored for analysis." },
    { icon: RefreshCw, title: "Wear Tracking Update", description: "'Mark as worn' updates item frequency. Future scoring adapts to prevent over-rotation." },
];

export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-12">
            {/* Header */}
            <section>
                <h1 className="text-2xl font-bold text-neutral-950 mb-2">How GlamGenius Works</h1>
                <p className="text-sm text-neutral-500 leading-relaxed">
                    GlamGenius is a human-centered AI outfit recommendation engine. It uses a rule-based scoring
                    algorithm to generate personalized outfit combinations from your wardrobe, considering mood,
                    occasion, weather, color harmony, and wear frequency.
                </p>
            </section>

            {/* Algorithm Pipeline */}
            <section>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recommendation Pipeline</h2>
                <div className="space-y-3">
                    {PIPELINE_STEPS.map(({ icon: Icon, title, description }, i) => (
                        <div key={title} className="flex gap-3 p-3 border border-neutral-200 bg-white" style={{ borderRadius: "var(--radius-lg)" }}>
                            <div className="w-8 h-8 rounded-md bg-neutral-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-neutral-400">{i + 1}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <Icon size={14} className="text-neutral-500" />
                                    <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
                                </div>
                                <p className="text-xs text-neutral-500">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Scoring Factors */}
            <section>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Scoring Factors</h2>
                <div className="overflow-hidden border border-neutral-200" style={{ borderRadius: "var(--radius-lg)" }}>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-200">
                                <th className="text-left text-xs font-semibold text-neutral-700 px-4 py-2.5 uppercase tracking-wide">Factor</th>
                                <th className="text-left text-xs font-semibold text-neutral-700 px-4 py-2.5 uppercase tracking-wide">Weight</th>
                                <th className="text-left text-xs font-semibold text-neutral-700 px-4 py-2.5 uppercase tracking-wide">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SCORING_FACTORS.map(({ label, weight, description }) => (
                                <tr key={label} className="border-b border-neutral-100 last:border-0">
                                    <td className="px-4 py-2.5 font-medium text-neutral-900">{label}</td>
                                    <td className="px-4 py-2.5">
                                        <code className="text-xs bg-neutral-100 px-1.5 py-0.5" style={{ borderRadius: "var(--radius-sm)" }}>{weight}</code>
                                    </td>
                                    <td className="px-4 py-2.5 text-neutral-500 text-xs">{description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Human-Centered AI */}
            <section>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Human-Centered AI Design</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 border border-neutral-200 bg-white" style={{ borderRadius: "var(--radius-lg)" }}>
                        <Sparkles size={18} className="text-brand-500 mb-2" />
                        <h3 className="text-sm font-semibold text-neutral-900 mb-1">Explainability</h3>
                        <p className="text-xs text-neutral-500">Every outfit includes a "Why this outfit?" panel showing which scoring factors contributed.</p>
                    </div>
                    <div className="p-4 border border-neutral-200 bg-white" style={{ borderRadius: "var(--radius-lg)" }}>
                        <Heart size={18} className="text-brand-500 mb-2" />
                        <h3 className="text-sm font-semibold text-neutral-900 mb-1">Feedback Loop</h3>
                        <p className="text-xs text-neutral-500">Star ratings and wear-again signals create a labeled dataset for future learning upgrades.</p>
                    </div>
                    <div className="p-4 border border-neutral-200 bg-white" style={{ borderRadius: "var(--radius-lg)" }}>
                        <BarChart3 size={18} className="text-brand-500 mb-2" />
                        <h3 className="text-sm font-semibold text-neutral-900 mb-1">Wear Balance</h3>
                        <p className="text-xs text-neutral-500">Frequency tracking ensures all wardrobe items get rotation, preventing over-reliance on favorites.</p>
                    </div>
                </div>
            </section>



            <div className="text-center pb-8">
                <Link href="/generate" className="btn-primary gap-1">
                    <Sparkles size={14} /> Try It Now <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
}
