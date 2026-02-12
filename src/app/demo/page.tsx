/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Briefcase, Heart, Plane, RefreshCw, Database } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DemoPage() {
    const router = useRouter();

    const handleReset = () => {
        localStorage.removeItem("glamgenius-vibes");
        window.location.reload();
    };

    return (
        <div className="max-w-4xl mx-auto py-8 space-y-12">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-brand-50 text-brand-700 border border-brand-100 rounded-full">
                    <Sparkles size={12} /> Recruiter Fast Track
                </div>
                <h1 className="text-3xl font-bold text-neutral-950">GlamGenius Interactive Demo</h1>
                <p className="text-neutral-600 max-w-lg mx-auto">
                    Experience the full Agent flow without setup. We've pre-seeded the database with a sample wardrobe (12 items) and configured mood presets.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Wardrobe Context */}
                <div className="p-6 border border-neutral-200 bg-white rounded-xl space-y-4 h-full">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-neutral-100 rounded-lg">
                            <Database size={20} className="text-neutral-600" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-neutral-900">Sample Wardrobe</h2>
                            <p className="text-xs text-neutral-500">12 items loaded in database</p>
                        </div>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-4 text-xs font-mono text-neutral-600 space-y-1">
                        <div className="flex justify-between"><span>TOP:</span> <span>White Tee, Red Blouse, Gray Sweater</span></div>
                        <div className="flex justify-between"><span>BTM:</span> <span>Black Jeans, Beige Chinos, Shorts</span></div>
                        <div className="flex justify-between"><span>SHO:</span> <span>Sneakers, Boots, Loafers</span></div>
                        <div className="flex justify-between"><span>OUT:</span> <span>Navy Blazer, Denim Jacket</span></div>
                    </div>
                    <p className="text-xs text-neutral-400">
                        The agent uses this data to generate outfits. You can view full details in the <Link href="/wardrobe" className="underline hover:text-neutral-900">Wardrobe</Link> tab.
                    </p>
                </div>

                {/* One-Click Flows */}
                <div className="space-y-4">
                    <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
                        <Sparkles size={18} className="text-brand-500" />
                        Try a Preset Flow
                    </h2>

                    <Link
                        href="/generate?occasion=work&weather=cool%20and%20cloudy&vibes=confident,minimal"
                        className="flex items-center gap-4 p-4 border border-neutral-200 bg-white rounded-xl hover:border-brand-200 hover:shadow-md transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                            <Briefcase size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-neutral-900">Work Presentation</h3>
                            <p className="text-xs text-neutral-500">Confident + Minimal • Cool Weather</p>
                        </div>
                        <ArrowRight size={16} className="text-neutral-300 group-hover:text-blue-600 transition-colors" />
                    </Link>

                    <Link
                        href="/generate?occasion=date-night&weather=mild%20evening&vibes=romantic,relaxed"
                        className="flex items-center gap-4 p-4 border border-neutral-200 bg-white rounded-xl hover:border-pink-200 hover:shadow-md transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-100 transition-colors">
                            <Heart size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-neutral-900">First Date</h3>
                            <p className="text-xs text-neutral-500">Romantic + Relaxed • Mild Weather</p>
                        </div>
                        <ArrowRight size={16} className="text-neutral-300 group-hover:text-pink-600 transition-colors" />
                    </Link>

                    <Link
                        href="/generate?occasion=travel&weather=hot&vibes=energetic,happy"
                        className="flex items-center gap-4 p-4 border border-neutral-200 bg-white rounded-xl hover:border-amber-200 hover:shadow-md transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
                            <Plane size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-neutral-900">Summer Travel</h3>
                            <p className="text-xs text-neutral-500">Energetic + Happy • Hot Weather</p>
                        </div>
                        <ArrowRight size={16} className="text-neutral-300 group-hover:text-amber-600 transition-colors" />
                    </Link>
                </div>
            </div>

            <div className="border-t border-neutral-200 pt-8 mt-8">
                <div className="bg-neutral-900 text-white rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 max-w-md">
                        <h3 className="text-lg font-bold">Test the AI Agent</h3>
                        <p className="text-sm text-neutral-400">
                            Open the command palette (Ctrl+K) or click the chat bubble (bottom right).
                            Toggle the 🐞 icon to see real-time reasoning.
                        </p>
                        <ul className="text-sm text-neutral-300 list-disc list-inside mt-2 space-y-1">
                            <li>"I need an outfit for a rainy office day"</li>
                            <li>"Make it warmer" (Modifier)</li>
                            <li>"Mark as worn" (Action)</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                    <RefreshCw size={12} /> Reset Local Storage (Vibes)
                </button>
            </div>
        </div>
    );
}
