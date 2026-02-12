"use client";

import { useState, useEffect } from "react";
import { OutfitData } from "@/lib/types";
import { X, LayoutGrid } from "lucide-react";

interface OutfitPickerProps {
    onSelect: (outfit: OutfitData) => void;
    onClose: () => void;
}

export function OutfitPicker({ onSelect, onClose }: OutfitPickerProps) {
    const [outfits, setOutfits] = useState<OutfitData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/outfits")
            .then((r) => r.json())
            .then((data) => setOutfits(data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                    <div className="flex items-center gap-2">
                        <LayoutGrid size={16} />
                        <h2 className="text-sm font-semibold">Select an Outfit</h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                    {loading && <p className="text-sm text-neutral-500 text-center py-8">Loading outfits...</p>}
                    {!loading && outfits.length === 0 && (
                        <p className="text-sm text-neutral-500 text-center py-8">No outfits generated yet.</p>
                    )}
                    {outfits.map((outfit) => (
                        <button
                            key={outfit.id}
                            onClick={() => onSelect(outfit)}
                            className="w-full text-left px-3 py-2.5 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
                            style={{ borderRadius: "var(--radius-md)" }}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="badge badge-brand">{outfit.mood}</span>
                                <span className="badge badge-neutral">{outfit.occasion}</span>
                            </div>
                            <p className="text-xs text-neutral-500 truncate">
                                {outfit.items.map((i) => i.clothingItem?.name || "Item").join(", ")}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
