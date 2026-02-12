"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MOODS, OCCASIONS, MOOD_LABELS, OCCASION_LABELS, Mood, Occasion } from "@/lib/types";
import { loadVibes, NEGATIVE_VIBES, VIBE_TAG_MAP, saveVibes } from "@/lib/vibes";
import { Sparkles, Smile, Briefcase, CloudSun, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

function GenerateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [occasion, setOccasion] = useState<Occasion>("casual");
    const [weather, setWeather] = useState("");
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Aesthetics
    const [savedVibes, setSavedVibes] = useState<string[]>([]);
    const [todayVibes, setTodayVibes] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Load vibes
        const vibes = loadVibes();
        setSavedVibes(vibes);

        // Check params
        const paramVibes = searchParams.get("vibes");
        const paramOccasion = searchParams.get("occasion");
        const paramWeather = searchParams.get("weather");

        if (paramVibes) {
            const parsed = paramVibes.split(",");
            setTodayVibes(new Set(parsed));
            // Also override saved vibes temporarily for display? 
            // Better to add them to saved if missing? 
            // For demo simplicty, just set todayVibes.
            // If the user's saved vibes don't include them, the UI will look weird (buttons missing).
            // So we should merge them into savedVibes for display.
            setSavedVibes(prev => Array.from(new Set([...prev, ...parsed])));
        } else {
            setTodayVibes(new Set(vibes));
        }

        if (paramOccasion && OCCASION_LABELS[paramOccasion as Occasion]) {
            setOccasion(paramOccasion as Occasion);
        }

        if (paramWeather) {
            setWeather(paramWeather);
        }
    }, [searchParams]);

    const toggleVibe = (vibe: string) => {
        setTodayVibes((prev) => {
            const next = new Set(prev);
            if (next.has(vibe)) next.delete(vibe);
            else next.add(vibe);
            return next;
        });
    };

    const activeVibes = Array.from(todayVibes);
    const hasNegative = activeVibes.some((v) => NEGATIVE_VIBES.has(v));

    const deriveMood = (): Mood => {
        if (hasNegative) return "relaxed";
        if (activeVibes.some(v => ["confident", "bold", "glamorous"].includes(v))) return "confident";
        if (activeVibes.some(v => ["romantic", "evening"].includes(v))) return "romantic";
        if (activeVibes.some(v => ["energetic", "excited", "playful"].includes(v))) return "energetic";
        if (activeVibes.some(v => ["minimal", "focused", "practical"].includes(v))) return "minimal";
        if (activeVibes.some(v => ["relaxed", "calm", "balanced"].includes(v))) return "relaxed";
        return "happy";
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!weather.trim()) { setError("Please enter the current weather"); return; }

        setGenerating(true);
        setError(null);

        const mood = deriveMood();

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mood, occasion, weather: weather.trim(), vibes: activeVibes }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to generate");
            }

            router.push("/outfits");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-neutral-950 mb-1">Generate Outfits</h1>
                <p className="text-sm text-neutral-500">
                    Select your occasion and weather to receive 3 personalized outfit recommendations.
                </p>
            </div>

            <form onSubmit={handleGenerate} className="card-flat p-5 space-y-6">
                {error && (
                    <div className="p-2.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200" style={{ borderRadius: "var(--radius-md)" }}>
                        {error}
                    </div>
                )}

                {/* Today's Vibes */}
                <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-neutral-800 mb-2">
                        <Heart size={15} /> Your vibes today
                    </label>
                    <p className="text-xs text-neutral-400 mb-3">
                        Toggle off any vibes that don&apos;t apply right now.
                        {hasNegative && (
                            <span className="ml-1 text-violet-500 font-medium">
                                We&apos;ll prioritize comfort for negative vibes.
                            </span>
                        )}
                    </p>
                    {savedVibes.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {savedVibes.map((vibe) => {
                                const isActive = todayVibes.has(vibe);
                                const isNeg = NEGATIVE_VIBES.has(vibe);
                                return (
                                    <button
                                        key={vibe}
                                        type="button"
                                        onClick={() => toggleVibe(vibe)}
                                        className={`px-3 py-1.5 text-xs font-medium border transition-all ${isActive
                                            ? isNeg
                                                ? "bg-violet-600 text-white border-violet-600"
                                                : "bg-neutral-900 text-white border-neutral-900"
                                            : "border-neutral-200 text-neutral-400 line-through"
                                            }`}
                                        style={{ borderRadius: "999px" }}
                                    >
                                        {vibe}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-3 border border-dashed border-neutral-200 text-center" style={{ borderRadius: "var(--radius-lg)" }}>
                            <p className="text-xs text-neutral-500 mb-2">No vibes saved yet.</p>
                            <Link href="/onboarding" className="btn-ghost text-xs gap-1 inline-flex">
                                <Heart size={12} /> Set Up Vibes <ArrowRight size={12} />
                            </Link>
                        </div>
                    )}

                    {savedVibes.length > 0 && (
                        <div className="mt-2">
                            <Link href="/onboarding" className="text-2xs text-neutral-400 hover:text-neutral-600 underline">
                                Edit saved vibes
                            </Link>
                        </div>
                    )}
                </div>

                {/* Occasion */}
                <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-neutral-800 mb-3">
                        <Briefcase size={15} /> Occasion
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {OCCASIONS.map((o) => (
                            <button
                                key={o}
                                type="button"
                                onClick={() => setOccasion(o)}
                                className={`px-3 py-2 text-sm font-medium border transition-all ${occasion === o
                                    ? "bg-neutral-900 text-white border-neutral-900"
                                    : "border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                                    }`}
                                style={{ borderRadius: "var(--radius-md)" }}
                            >
                                {OCCASION_LABELS[o]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Weather */}
                <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-neutral-800 mb-2">
                        <CloudSun size={15} /> Current weather
                    </label>
                    <input
                        type="text"
                        value={weather}
                        onChange={(e) => setWeather(e.target.value)}
                        className="input-field"
                        placeholder="e.g. warm and sunny, cold and rainy, mild..."
                    />
                </div>

                <button type="submit" disabled={generating} className="btn-primary w-full py-2.5">
                    {generating ? (
                        <><span className="spinner" /> Generating...</>
                    ) : (
                        <><Sparkles size={15} /> Generate 3 Outfits</>
                    )}
                </button>
            </form>
        </div>
    );
}

export default function GeneratePage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-neutral-500">Loading generator...</div>}>
            <GenerateContent />
        </Suspense>
    );
}
