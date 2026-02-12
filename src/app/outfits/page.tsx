"use client";

import { useState, useEffect } from "react";
import { OutfitData } from "@/lib/types";
import { OutfitCard } from "@/components/OutfitCard";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonOutfitCard } from "@/components/Skeleton";
import { LayoutGrid, GitCompare, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/Toast";

export default function OutfitsPage() {
    const [outfits, setOutfits] = useState<OutfitData[]>([]);
    const [loading, setLoading] = useState(true);
    const [compareMode, setCompareMode] = useState(false);
    const [compareSelection, setCompareSelection] = useState<string[]>([]);
    const { toast } = useToast();

    const fetchOutfits = () => {
        fetch("/api/outfits")
            .then((r) => r.json())
            .then((data) => setOutfits(data))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchOutfits(); }, []);

    const handleMarkWorn = async (outfitId: string) => {
        const outfit = outfits.find((o) => o.id === outfitId);
        if (!outfit) return;

        const itemIds = outfit.items.map((i) => {
            const obj = i as Record<string, unknown>;
            if (obj.clothingItem && typeof obj.clothingItem === "object") {
                return (obj.clothingItem as Record<string, unknown>).id as string;
            }
            return obj.id as string;
        });

        try {
            await Promise.all(
                itemIds.map((id) =>
                    fetch(`/api/wardrobe/${id}/wear`, { method: "POST" })
                )
            );
            toast("Outfit marked as worn — wear stats updated");
        } catch {
            toast("Failed to update wear stats", "error");
        }
    };

    const toggleCompareSelect = (id: string) => {
        setCompareSelection((prev) => {
            if (prev.includes(id)) return prev.filter((x) => x !== id);
            if (prev.length >= 2) return [prev[1], id];
            return [...prev, id];
        });
    };

    const comparedOutfits = outfits.filter((o) => compareSelection.includes(o.id));

    // Split into today's and past
    const today = new Date().toDateString();
    const todayOutfits = outfits.filter((o) => new Date(o.createdAt).toDateString() === today);
    const pastOutfits = outfits.filter((o) => new Date(o.createdAt).toDateString() !== today);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-950">Outfits</h1>
                    <p className="text-sm text-neutral-500 mt-0.5">{outfits.length} generated outfits</p>
                </div>
                <div className="flex gap-2">
                    {outfits.length >= 2 && (
                        <button
                            onClick={() => { setCompareMode(!compareMode); setCompareSelection([]); }}
                            className={`btn-ghost text-xs gap-1 ${compareMode ? "text-brand-600" : ""}`}
                        >
                            <GitCompare size={14} /> {compareMode ? "Exit Compare" : "Compare"}
                        </button>
                    )}
                </div>
            </div>

            {/* Compare View */}
            {compareMode && comparedOutfits.length === 2 && (
                <div className="p-4 border border-brand-200 bg-brand-50" style={{ borderRadius: "var(--radius-lg)" }}>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-1.5">
                        <GitCompare size={14} /> Outfit Comparison
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {comparedOutfits.map((outfit) => (
                            <OutfitCard key={outfit.id} outfit={outfit} showFeedback={false} />
                        ))}
                    </div>
                </div>
            )}

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => <SkeletonOutfitCard key={i} />)}
                </div>
            )}

            {!loading && outfits.length === 0 && (
                <EmptyState
                    icon={LayoutGrid}
                    title="No outfits generated yet"
                    description="Generate your first set of personalized outfit recommendations."
                    action={
                        <Link href="/generate" className="btn-primary gap-1">
                            <Sparkles size={14} /> Generate Outfits <ArrowRight size={14} />
                        </Link>
                    }
                />
            )}

            {/* Today's outfits */}
            {todayOutfits.length > 0 && (
                <section>
                    <h2 className="text-sm font-semibold text-neutral-700 mb-3 uppercase tracking-wide">Today</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {todayOutfits.map((outfit) => (
                            <OutfitCard
                                key={outfit.id}
                                outfit={outfit}
                                showFeedback
                                onFeedbackSubmitted={fetchOutfits}
                                onMarkWorn={handleMarkWorn}
                                compareMode={compareMode}
                                selected={compareSelection.includes(outfit.id)}
                                onSelect={() => toggleCompareSelect(outfit.id)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Past outfits */}
            {pastOutfits.length > 0 && (
                <section>
                    <h2 className="text-sm font-semibold text-neutral-700 mb-3 uppercase tracking-wide">Previous</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pastOutfits.map((outfit) => (
                            <OutfitCard
                                key={outfit.id}
                                outfit={outfit}
                                showFeedback
                                onFeedbackSubmitted={fetchOutfits}
                                onMarkWorn={handleMarkWorn}
                                compareMode={compareMode}
                                selected={compareSelection.includes(outfit.id)}
                                onSelect={() => toggleCompareSelect(outfit.id)}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
