"use client";

import { ClothingItemData, CATEGORY_LABELS, SEASON_LABELS, Category, Season } from "@/lib/types";
import { getColorHex } from "@/lib/colors";
import { Shirt, Footprints, Wind, Gem, Scissors, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

const CATEGORY_ICON: Record<string, typeof Shirt> = {
    TOP: Shirt, BOTTOM: Scissors, SHOES: Footprints, OUTER: Wind, ACCESSORY: Gem,
};

interface ClothingItemCardProps {
    item: ClothingItemData;
    onEdit: (item: ClothingItemData) => void;
    onDelete: (id: string) => void;
}

export function ClothingItemCard({ item, onEdit, onDelete }: ClothingItemCardProps) {
    const Icon = CATEGORY_ICON[item.category] || Shirt;

    return (
        <div className="card group overflow-hidden transition-all hover:shadow-md">
            {item.imageUrl ? (
                <div className="relative w-full h-40 bg-neutral-50">
                    <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
            ) : (
                <div className="w-full h-40 bg-neutral-50 flex items-center justify-center">
                    <Icon size={40} strokeWidth={1} className="text-neutral-300" />
                </div>
            )}

            <div className="p-3">
                <div className="flex items-start justify-between mb-1.5">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-neutral-900 truncate">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-2xs text-neutral-500 uppercase tracking-wide">
                                {CATEGORY_LABELS[item.category as Category]}
                            </span>
                            <span className="text-neutral-300">·</span>
                            <span className="text-2xs text-neutral-500">
                                {SEASON_LABELS[item.season as Season]}
                            </span>
                        </div>
                    </div>
                    <div
                        className="w-4 h-4 rounded-full border border-neutral-200 flex-shrink-0 ml-2"
                        style={{ backgroundColor: getColorHex(item.color) }}
                        title={item.color}
                    />
                </div>

                {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="tag">{tag}</span>
                        ))}
                    </div>
                )}

                <div className="text-2xs text-neutral-400 mt-2">
                    Worn {item.timesWorn}×{item.lastWorn && ` · Last ${new Date(item.lastWorn).toLocaleDateString()}`}
                </div>

                <div className="flex gap-1.5 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(item)} className="btn-ghost text-xs flex-1 gap-1">
                        <Pencil size={12} /> Edit
                    </button>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="btn-ghost text-xs flex-1 gap-1 text-red-500 hover:text-red-600"
                    >
                        <Trash2 size={12} /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
