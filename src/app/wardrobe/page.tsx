"use client";

import { useState, useEffect } from "react";
import { ClothingItemData, CATEGORIES, CATEGORY_LABELS, Category } from "@/lib/types";
import { ClothingItemCard } from "@/components/ClothingItemCard";
import { ClothingItemModal } from "@/components/ClothingItemModal";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonCard } from "@/components/Skeleton";
import { ShoppingBag, Plus, BarChart3, Shirt, Footprints, Wind, Gem, Scissors } from "lucide-react";
import { useToast } from "@/components/Toast";

const CATEGORY_ICON_MAP: Record<string, typeof Shirt> = {
    TOP: Shirt, BOTTOM: Scissors, SHOES: Footprints, OUTER: Wind, ACCESSORY: Gem,
};

export default function WardrobePage() {
    const [items, setItems] = useState<ClothingItemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState<Category | "ALL">("ALL");
    const [modal, setModal] = useState<{ open: boolean; item?: ClothingItemData | null }>({ open: false });
    const { toast } = useToast();

    const fetchItems = () => {
        fetch("/api/wardrobe")
            .then((r) => r.json())
            .then((data) => {
                const parsed = data.map((item: ClothingItemData & { tags: string | string[] }) => ({
                    ...item,
                    tags: typeof item.tags === "string" ? item.tags.split(",").filter(Boolean) : item.tags,
                }));
                setItems(parsed);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchItems(); }, []);

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/wardrobe/${id}`, { method: "DELETE" });
            toast("Item removed");
            fetchItems();
        } catch {
            toast("Failed to delete", "error");
        }
    };

    const handleSave = () => {
        setModal({ open: false });
        toast(modal.item ? "Item updated" : "Item added");
        fetchItems();
    };

    const filtered = filterCategory === "ALL" ? items : items.filter((i) => i.category === filterCategory);

    // Analytics
    const totalItems = items.length;
    const totalWorn = items.reduce((s, i) => s + i.timesWorn, 0);
    const avgWorn = totalItems > 0 ? (totalWorn / totalItems).toFixed(1) : "0";
    const leastWorn = items.length > 0 ? [...items].sort((a, b) => a.timesWorn - b.timesWorn)[0] : null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-950">Wardrobe</h1>
                    <p className="text-sm text-neutral-500 mt-0.5">{totalItems} items in your wardrobe</p>
                </div>
                <button onClick={() => setModal({ open: true, item: null })} className="btn-primary gap-1">
                    <Plus size={15} /> Add Item
                </button>
            </div>

            {/* Analytics Mini Panel */}
            {totalItems > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 border border-neutral-200 bg-white" style={{ borderRadius: "var(--radius-lg)" }}>
                        <p className="text-2xs text-neutral-400 uppercase tracking-wider">Total Items</p>
                        <p className="text-lg font-bold text-neutral-900">{totalItems}</p>
                    </div>
                    <div className="p-3 border border-neutral-200 bg-white" style={{ borderRadius: "var(--radius-lg)" }}>
                        <p className="text-2xs text-neutral-400 uppercase tracking-wider">Total Wears</p>
                        <p className="text-lg font-bold text-neutral-900">{totalWorn}</p>
                    </div>
                    <div className="p-3 border border-neutral-200 bg-white" style={{ borderRadius: "var(--radius-lg)" }}>
                        <p className="text-2xs text-neutral-400 uppercase tracking-wider">Avg Wears</p>
                        <p className="text-lg font-bold text-neutral-900">{avgWorn}</p>
                    </div>
                    <div className="p-3 border border-neutral-200 bg-white" style={{ borderRadius: "var(--radius-lg)" }}>
                        <p className="text-2xs text-neutral-400 uppercase tracking-wider">Least Worn</p>
                        <p className="text-sm font-semibold text-neutral-900 truncate">{leastWorn?.name || "—"}</p>
                    </div>
                </div>
            )}

            {/* Category Filter */}
            {totalItems > 0 && (
                <div className="flex gap-1 overflow-x-auto pb-1">
                    <button
                        onClick={() => setFilterCategory("ALL")}
                        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium border transition-all whitespace-nowrap ${filterCategory === "ALL"
                                ? "bg-neutral-900 text-white border-neutral-900"
                                : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                            }`}
                        style={{ borderRadius: "var(--radius-md)" }}
                    >
                        <BarChart3 size={12} /> All ({totalItems})
                    </button>
                    {CATEGORIES.map((cat) => {
                        const Icon = CATEGORY_ICON_MAP[cat] || Shirt;
                        const count = items.filter((i) => i.category === cat).length;
                        if (count === 0) return null;
                        return (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium border transition-all whitespace-nowrap ${filterCategory === cat
                                        ? "bg-neutral-900 text-white border-neutral-900"
                                        : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                                    }`}
                                style={{ borderRadius: "var(--radius-md)" }}
                            >
                                <Icon size={12} /> {CATEGORY_LABELS[cat]} ({count})
                            </button>
                        );
                    })}
                </div>
            )}

            {loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {!loading && totalItems === 0 && (
                <EmptyState
                    icon={ShoppingBag}
                    title="Your wardrobe is empty"
                    description="Add your first clothing item to start generating outfits."
                    action={
                        <button onClick={() => setModal({ open: true, item: null })} className="btn-primary gap-1">
                            <Plus size={14} /> Add Your First Item
                        </button>
                    }
                />
            )}

            {!loading && filtered.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filtered.map((item) => (
                        <ClothingItemCard
                            key={item.id}
                            item={item}
                            onEdit={(item) => setModal({ open: true, item })}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {modal.open && (
                <ClothingItemModal
                    item={modal.item}
                    onSave={handleSave}
                    onClose={() => setModal({ open: false })}
                />
            )}
        </div>
    );
}
