"use client";

import { useState } from "react";
import { getColorHex } from "@/lib/colors";
import { FeedbackForm } from "./FeedbackForm";
import { ChevronDown, ChevronUp, Shirt, Footprints, Wind, Gem, Scissors, CheckCircle } from "lucide-react";
import Image from "next/image";

const CATEGORY_ICON: Record<string, typeof Shirt> = {
    TOP: Shirt, BOTTOM: Scissors, SHOES: Footprints, OUTER: Wind, ACCESSORY: Gem,
};

interface DisplayItem {
    id: string;
    name: string;
    category: string;
    color: string;
    imageUrl?: string | null;
}

interface OutfitCardProps {
    outfit: {
        id: string;
        explanation: string;
        mood: string;
        occasion: string;
        weatherSummary: string;
        items: unknown[];
        feedback?: { rating: number; liked: boolean; note: string | null }[];
    };
    showFeedback?: boolean;
    onFeedbackSubmitted?: () => void;
    onMarkWorn?: (outfitId: string) => void;
    compareMode?: boolean;
    selected?: boolean;
    onSelect?: () => void;
}

function normalizeItems(rawItems: unknown[]): DisplayItem[] {
    return rawItems.map((item: unknown) => {
        const obj = item as Record<string, unknown>;
        if (obj.clothingItem && typeof obj.clothingItem === "object") {
            const ci = obj.clothingItem as Record<string, unknown>;
            return { id: ci.id as string, name: ci.name as string, category: ci.category as string, color: ci.color as string, imageUrl: ci.imageUrl as string | null };
        }
        return { id: obj.id as string, name: obj.name as string, category: obj.category as string, color: obj.color as string, imageUrl: obj.imageUrl as string | null };
    });
}

function parseExplanation(explanation: string): { label: string; detail: string }[] {
    const parts = explanation.split(". ").filter(Boolean);
    return parts.map((p) => {
        const clean = p.replace(/\.$/, "");
        if (clean.includes("Season")) return { label: "Season", detail: clean };
        if (clean.includes("weather")) return { label: "Weather", detail: clean };
        if (clean.includes("olor")) return { label: "Color Harmony", detail: clean };
        if (clean.includes("mood")) return { label: "Mood Match", detail: clean };
        if (clean.includes("for ")) return { label: "Occasion", detail: clean };
        if (clean.includes("fresh") || clean.includes("worn")) return { label: "Wear Balance", detail: clean };
        if (clean.includes("layer")) return { label: "Layering", detail: clean };
        return { label: "Insight", detail: clean };
    });
}

export function OutfitCard({ outfit, showFeedback = false, onFeedbackSubmitted, onMarkWorn, compareMode, selected, onSelect }: OutfitCardProps) {
    const items = normalizeItems(outfit.items);
    const existingFeedback = outfit.feedback && outfit.feedback.length > 0 ? outfit.feedback[0] : null;
    const [showWhy, setShowWhy] = useState(false);
    const reasons = parseExplanation(outfit.explanation);

    return (
        <div className={`card animate-slide-up overflow-hidden ${compareMode && selected ? "ring-2 ring-brand-500" : ""}`}>
            {/* Item images row */}
            <div className="flex">
                {items.map((item, idx) => {
                    const Icon = CATEGORY_ICON[item.category] || Shirt;
                    return (
                        <div key={item.id || idx} className="relative flex-1 h-24 bg-neutral-50 border-r border-neutral-100 last:border-r-0">
                            {item.imageUrl ? (
                                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="25vw" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Icon size={22} strokeWidth={1} className="text-neutral-300" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="p-4">
                {/* Context badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                    <span className="badge badge-brand">{outfit.mood}</span>
                    <span className="badge badge-neutral">{outfit.occasion}</span>
                    <span className="badge badge-neutral">{outfit.weatherSummary}</span>
                </div>

                {/* Item names */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {items.map((item, idx) => (
                        <div key={item.id || idx} className="flex items-center gap-1 px-1.5 py-0.5 text-2xs text-neutral-600 bg-neutral-50 border border-neutral-100" style={{ borderRadius: "var(--radius-sm)" }}>
                            <span className="font-medium">{item.name}</span>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getColorHex(item.color) }} />
                        </div>
                    ))}
                </div>

                {/* Why This Outfit — Explainability */}
                <button
                    onClick={() => setShowWhy(!showWhy)}
                    className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-700 transition-colors mb-2"
                >
                    {showWhy ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    Why this outfit?
                </button>

                {showWhy && (
                    <div className="space-y-1.5 mb-3 pl-1 animate-slide-up">
                        {reasons.map((r, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                                <span className="text-2xs font-semibold text-neutral-400 uppercase tracking-wide w-20 flex-shrink-0 pt-0.5">
                                    {r.label}
                                </span>
                                <span className="text-neutral-600">{r.detail}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                    {onMarkWorn && (
                        <button onClick={() => onMarkWorn(outfit.id)} className="btn-ghost text-xs gap-1">
                            <CheckCircle size={13} /> Mark as worn
                        </button>
                    )}
                    {compareMode && onSelect && (
                        <button onClick={onSelect} className={`btn-ghost text-xs ${selected ? "text-brand-600" : ""}`}>
                            {selected ? "Selected" : "Select to compare"}
                        </button>
                    )}
                </div>

                {/* Feedback */}
                {showFeedback && (
                    <FeedbackForm
                        outfitId={outfit.id}
                        onSubmitted={onFeedbackSubmitted || (() => { })}
                        existingFeedback={existingFeedback}
                    />
                )}
            </div>
        </div>
    );
}
