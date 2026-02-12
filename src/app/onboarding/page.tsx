"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VIBES, VibeCategory, VIBE_LABELS, saveVibes } from "@/lib/vibes";
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";

const CATEGORY_ORDER: VibeCategory[] = ["positive", "neutral", "negative"];

const CATEGORY_COLORS: Record<VibeCategory, { bg: string; border: string; text: string; selectedBg: string; selectedBorder: string; selectedText: string }> = {
    positive: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", selectedBg: "bg-emerald-600", selectedBorder: "border-emerald-600", selectedText: "text-white" },
    neutral: { bg: "bg-neutral-50", border: "border-neutral-200", text: "text-neutral-700", selectedBg: "bg-neutral-800", selectedBorder: "border-neutral-800", selectedText: "text-white" },
    negative: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", selectedBg: "bg-violet-600", selectedBorder: "border-violet-600", selectedText: "text-white" },
};

export default function OnboardingPage() {
    const router = useRouter();
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [error, setError] = useState<string | null>(null);

    const toggle = (vibe: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(vibe)) next.delete(vibe);
            else next.add(vibe);
            return next;
        });
        setError(null);
    };

    const handleContinue = () => {
        if (selected.size < 2) {
            setError(`Pick at least 2 vibes (${selected.size}/2)`);
            return;
        }
        saveVibes(Array.from(selected));
        router.push("/generate");
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 text-2xs font-medium uppercase tracking-wider text-neutral-500 border border-neutral-200 mb-4" style={{ borderRadius: "var(--radius-md)" }}>
                    <Sparkles size={12} /> Personalization
                </div>
                <h1 className="text-3xl font-bold text-neutral-950 mb-2" style={{ lineHeight: 1.15 }}>
                    What vibes describe you?
                </h1>
                <p className="text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
                    Pick at least 2 vibes that resonate with you. This helps us recommend outfits
                    that match not just your style — but how you feel.
                </p>
            </div>

            {/* Vibe Bubbles by Category */}
            <div className="space-y-8">
                {CATEGORY_ORDER.map((cat) => {
                    const colors = CATEGORY_COLORS[cat];
                    return (
                        <div key={cat}>
                            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                                {VIBE_LABELS[cat]}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {VIBES[cat].map((vibe) => {
                                    const isSelected = selected.has(vibe);
                                    return (
                                        <button
                                            key={vibe}
                                            onClick={() => toggle(vibe)}
                                            className={`
                                                px-4 py-2 text-sm font-medium border transition-all
                                                hover:scale-[1.03] active:scale-[0.97]
                                                ${isSelected
                                                    ? `${colors.selectedBg} ${colors.selectedBorder} ${colors.selectedText}`
                                                    : `${colors.bg} ${colors.border} ${colors.text} hover:shadow-sm`
                                                }
                                            `}
                                            style={{ borderRadius: "999px" }}
                                        >
                                            {isSelected && <CheckCircle size={13} className="inline mr-1 -mt-0.5" />}
                                            {vibe}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-10 space-y-3">
                {error && (
                    <div className="text-center text-sm font-medium text-red-500">{error}</div>
                )}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">
                        {selected.size} selected {selected.size < 2 && `(need ${2 - selected.size} more)`}
                    </span>
                    <button
                        onClick={handleContinue}
                        className="btn-primary gap-1.5 px-6 py-2.5"
                    >
                        Continue <ArrowRight size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}
