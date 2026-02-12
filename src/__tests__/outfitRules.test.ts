import { describe, it, expect } from "vitest";
import { colorsClash } from "../lib/colors";
import { generateOutfits } from "../lib/outfitRules";
import { ClothingItemData } from "../lib/types";

function makeItem(overrides: Partial<ClothingItemData> & { name: string; category: string }): ClothingItemData {
    return {
        id: Math.random().toString(36).slice(2),
        name: overrides.name,
        category: overrides.category as ClothingItemData["category"],
        color: overrides.color || "black",
        season: (overrides.season || "ALL") as ClothingItemData["season"],
        tags: overrides.tags || [],
        imageUrl: null,
        timesWorn: overrides.timesWorn ?? 0,
        lastWorn: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

describe("colorsClash", () => {
    it("should detect two identical non-neutral colors as a clash", () => {
        expect(colorsClash("red", "red")).toBe(true);
    });

    it("should not flag neutral colors as clashing", () => {
        // navy is classified as neutral in the implementation
        expect(colorsClash("navy", "black")).toBe(false);
    });

    it("should not flag different non-neutral colors", () => {
        // The implementation only flags identical non-neutral colors
        expect(colorsClash("red", "orange")).toBe(false);
    });

    it("should not flag black + white (both neutral)", () => {
        expect(colorsClash("black", "white")).toBe(false);
    });

    it("should not flag navy + white (navy is neutral)", () => {
        expect(colorsClash("navy", "white")).toBe(false);
    });

    it("should be symmetric", () => {
        expect(colorsClash("red", "blue")).toBe(colorsClash("blue", "red"));
    });
});

describe("generateOutfits", () => {
    const baseItems: ClothingItemData[] = [
        makeItem({ name: "White Tee", category: "TOP", color: "white", season: "ALL", tags: ["casual"] }),
        makeItem({ name: "Navy Tee", category: "TOP", color: "navy", season: "FALL", tags: ["casual"] }),
        makeItem({ name: "Black Jeans", category: "BOTTOM", color: "black", season: "ALL", tags: ["casual"] }),
        makeItem({ name: "Beige Chinos", category: "BOTTOM", color: "beige", season: "SPRING", tags: ["smart-casual"] }),
        makeItem({ name: "Sneakers", category: "SHOES", color: "white", season: "ALL", tags: ["casual"] }),
        makeItem({ name: "Boots", category: "SHOES", color: "black", season: "FALL", tags: ["formal"] }),
    ];

    it("should return exactly 3 outfits when enough items exist", () => {
        const result = generateOutfits(baseItems, { mood: "happy", occasion: "casual", weather: "warm" });
        expect(result).toHaveLength(3);
    });

    it("should return 0 outfits when a required category is missing", () => {
        const noShoes = baseItems.filter((i) => i.category !== "SHOES");
        const result = generateOutfits(noShoes, { mood: "happy", occasion: "casual", weather: "warm" });
        expect(result).toHaveLength(0);
    });

    it("should return 0 outfits when no tops exist", () => {
        const noTops = baseItems.filter((i) => i.category !== "TOP");
        const result = generateOutfits(noTops, { mood: "happy", occasion: "casual", weather: "warm" });
        expect(result).toHaveLength(0);
    });

    it("should return 0 outfits when no bottoms exist", () => {
        const noBottoms = baseItems.filter((i) => i.category !== "BOTTOM");
        const result = generateOutfits(noBottoms, { mood: "happy", occasion: "casual", weather: "warm" });
        expect(result).toHaveLength(0);
    });

    it("each outfit should contain at least a top, bottom, and shoes", () => {
        const result = generateOutfits(baseItems, { mood: "happy", occasion: "casual", weather: "warm" });
        for (const outfit of result) {
            const categories = outfit.items.map((i) => i.category);
            expect(categories).toContain("TOP");
            expect(categories).toContain("BOTTOM");
            expect(categories).toContain("SHOES");
        }
    });

    it("should produce unique outfits (no duplicate item sets)", () => {
        const result = generateOutfits(baseItems, { mood: "happy", occasion: "casual", weather: "warm" });
        const keys = result.map((r) => r.items.map((i) => i.id).sort().join(","));
        const uniqueKeys = new Set(keys);
        expect(uniqueKeys.size).toBe(keys.length);
    });

    it("should include an explanation for each outfit", () => {
        const result = generateOutfits(baseItems, { mood: "happy", occasion: "casual", weather: "warm" });
        for (const outfit of result) {
            expect(outfit.explanation).toBeTruthy();
            expect(outfit.explanation.length).toBeGreaterThan(5);
        }
    });

    it("should prefer season-compatible items", () => {
        const items = [
            makeItem({ name: "Summer Top", category: "TOP", color: "white", season: "SUMMER" }),
            makeItem({ name: "Winter Top", category: "TOP", color: "gray", season: "WINTER" }),
            makeItem({ name: "Shorts", category: "BOTTOM", color: "khaki", season: "SUMMER" }),
            makeItem({ name: "Sneakers", category: "SHOES", color: "white", season: "ALL" }),
        ];
        const result = generateOutfits(items, { mood: "happy", occasion: "casual", weather: "hot" });
        // First outfit should prefer the summer top over winter top for hot weather
        if (result.length > 0) {
            const firstOutfitSeasons = result[0].items.map((i) => i.season);
            expect(firstOutfitSeasons).not.toContain("WINTER");
        }
    });
});
