"use client";

import { useState, useEffect } from "react";
import { CATEGORIES, SEASONS, Category, Season, ClothingItemData, CATEGORY_LABELS, SEASON_LABELS } from "@/lib/types";
import { X } from "lucide-react";

interface ClothingItemModalProps {
    item?: ClothingItemData | null;
    onSave: () => void;
    onClose: () => void;
}

export function ClothingItemModal({ item, onSave, onClose }: ClothingItemModalProps) {
    const [name, setName] = useState(item?.name ?? "");
    const [category, setCategory] = useState<Category>(item?.category ?? "TOP");
    const [color, setColor] = useState(item?.color ?? "");
    const [season, setSeason] = useState<Season>(item?.season ?? "ALL");
    const [tags, setTags] = useState(item?.tags?.join(", ") ?? "");
    const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !color.trim()) { setError("Name and color are required."); return; }

        setSaving(true);
        setError(null);

        const body = {
            name: name.trim(),
            category,
            color: color.trim().toLowerCase(),
            season,
            tags: tags.trim(),
            imageUrl: imageUrl.trim() || null,
        };

        try {
            const url = item ? `/api/wardrobe/${item.id}` : "/api/wardrobe";
            const res = await fetch(url, {
                method: item ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save");
            }
            onSave();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                    <h2 className="text-sm font-semibold">{item ? "Edit Item" : "Add Item"}</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {error && (
                        <div className="p-2.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200" style={{ borderRadius: "var(--radius-md)" }}>
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="White Cotton T-Shirt" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1">Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="select-field">
                                {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1">Season</label>
                            <select value={season} onChange={(e) => setSeason(e.target.value as Season)} className="select-field">
                                {SEASONS.map((s) => <option key={s} value={s}>{SEASON_LABELS[s]}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Color</label>
                        <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="input-field" placeholder="black, white, navy..." />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Tags (comma-separated)</label>
                        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="input-field" placeholder="casual, everyday, versatile" />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Image URL (optional)</label>
                        <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input-field" placeholder="/items/my-item.png or https://..." />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" disabled={saving} className="btn-primary flex-1">
                            {saving ? <><span className="spinner" /> Saving...</> : (item ? "Update" : "Add Item")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
