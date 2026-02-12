import { ClothingItemData, GeneratedOutfit, tagsToArray, Season, Mood, Occasion } from "./types";
import { colorsClash } from "./colors";
import { VIBE_TAG_MAP, COMFORT_TAGS, STATEMENT_TAGS } from "./vibes";
import { VIBES } from "./vibes";

const NEGATIVE_VIBE_LIST: string[] = [...VIBES.negative];

const OPPOSITE_SEASONS: Record<string, string[]> = {
    SUMMER: ["WINTER"], WINTER: ["SUMMER"], SPRING: ["WINTER"], FALL: ["SUMMER"], ALL: [],
};

const WEATHER_SEASON_MAP: Record<string, Season[]> = {
    hot: ["SUMMER", "ALL"], warm: ["SPRING", "SUMMER", "ALL"], mild: ["SPRING", "FALL", "ALL"],
    cool: ["FALL", "SPRING", "ALL"], cold: ["WINTER", "FALL", "ALL"], rainy: ["FALL", "SPRING", "ALL"],
};

const MOOD_TAGS: Record<string, string[]> = {
    happy: ["casual", "everyday", "sporty", "weekend"],
    confident: ["formal", "elegant", "classic", "office"],
    relaxed: ["casual", "cozy", "basic", "everyday"],
    energetic: ["sporty", "casual", "everyday", "weekend"],
    romantic: ["elegant", "feminine", "evening"],
    minimal: ["basic", "versatile", "everyday"],
};

const OCCASION_TAGS: Record<string, string[]> = {
    work: ["office", "formal", "classic", "smart-casual"],
    casual: ["casual", "everyday", "basic", "weekend"],
    "date-night": ["elegant", "evening", "feminine", "formal"],
    party: ["evening", "elegant", "formal"],
    sport: ["sporty", "casual", "everyday"],
    travel: ["versatile", "casual", "everyday", "layering"],
    formal: ["formal", "classic", "elegant", "office"],
};

function inferSeasons(weather: string): Season[] {
    const w = weather.toLowerCase();
    for (const [key, seasons] of Object.entries(WEATHER_SEASON_MAP)) {
        if (w.includes(key)) return seasons;
    }
    return ["ALL"];
}

function seasonsCompatible(a: Season, b: Season): boolean {
    if (a === "ALL" || b === "ALL") return true;
    return !OPPOSITE_SEASONS[a]?.includes(b);
}

interface GenParams {
    mood: Mood;
    occasion: Occasion;
    weather: string;
    vibes?: string[];
}

function scoreOutfit(items: ClothingItemData[], params: GenParams): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];
    const goodSeasons = inferSeasons(params.weather);
    const allItemTags = items.flatMap((i) => i.tags);
    const vibes = params.vibes || [];
    const hasNegativeVibes = vibes.some((v) => NEGATIVE_VIBE_LIST.includes(v));
    const hasStatementOverride = vibes.some((v) => v === "bold" || v === "glamorous" || v === "confident");

    // Season compatibility
    const seasons = items.map((i) => i.season);
    let seasonOk = true;
    for (let i = 0; i < seasons.length; i++) {
        for (let j = i + 1; j < seasons.length; j++) {
            if (!seasonsCompatible(seasons[i], seasons[j])) seasonOk = false;
        }
    }
    if (seasonOk) { score += 3; reasons.push("Season-compatible pieces"); }
    else { score -= 5; reasons.push("Season mismatch detected"); }

    // Weather match
    const weatherMatches = items.filter((i) => goodSeasons.includes(i.season)).length;
    if (weatherMatches === items.length) { score += 3; reasons.push(`Suitable for ${params.weather} weather`); }
    else if (weatherMatches > 0) { score += 1; }

    // Color clash
    const tops = items.filter((i) => i.category === "TOP");
    const bottoms = items.filter((i) => i.category === "BOTTOM");
    let hasClash = false;
    for (const top of tops) {
        for (const bottom of bottoms) {
            if (colorsClash(top.color, bottom.color)) hasClash = true;
        }
    }
    if (!hasClash) { score += 2; reasons.push("Colors harmonize well"); }
    else { score -= 3; }

    // Mood tag match
    const moodTags = MOOD_TAGS[params.mood] || [];
    const moodMatches = moodTags.filter((t) => allItemTags.includes(t)).length;
    if (moodMatches > 0) { score += moodMatches; reasons.push(`Matches your ${params.mood} mood`); }

    // Occasion tag match
    const occasionTags = OCCASION_TAGS[params.occasion] || [];
    const occasionMatches = occasionTags.filter((t) => allItemTags.includes(t)).length;
    if (occasionMatches > 0) { score += occasionMatches; reasons.push(`Great for ${params.occasion}`); }

    // --- VIBES SCORING ---
    if (vibes.length > 0) {
        // Collect all tags vibes prefer
        const vibePrefTags: string[] = [];
        for (const v of vibes) {
            const tags = VIBE_TAG_MAP[v];
            if (tags) vibePrefTags.push(...tags);
        }
        const uniqueVibeTags = [...new Set(vibePrefTags)];
        const vibeMatches = uniqueVibeTags.filter((t) => allItemTags.includes(t)).length;
        if (vibeMatches > 0) {
            score += vibeMatches;
            reasons.push(`Matches your selected vibes`);
        }

        // Negative vibes — boost comfort, reduce statement
        if (hasNegativeVibes) {
            const activeNegVibe = vibes.find((v) => NEGATIVE_VIBE_LIST.includes(v)) || "low-energy";
            const comfortCount = COMFORT_TAGS.filter((t) => allItemTags.includes(t)).length;
            if (comfortCount > 0) {
                score += comfortCount * 2;
                reasons.push(`Chosen to match a ${activeNegVibe} day: comfort + low-effort pieces`);
            }

            // Penalize statement tags unless user explicitly selected bold/glamorous
            if (!hasStatementOverride) {
                const statementCount = STATEMENT_TAGS.filter((t) => allItemTags.includes(t)).length;
                if (statementCount > 0) {
                    score -= statementCount;
                    reasons.push(`Reducing statement pieces for a ${activeNegVibe} day`);
                }
            }
        }
    }

    // TimesWorn penalty — prefer less-worn items
    const totalWorn = items.reduce((sum, i) => sum + i.timesWorn, 0);
    const avgWorn = totalWorn / items.length;
    if (avgWorn <= 3) { score += 2; reasons.push("Features fresh pieces from your wardrobe"); }
    else if (avgWorn > 7) { score -= 1; }

    // Outer layer bonus
    if (items.some((i) => i.category === "OUTER")) {
        score += 1; reasons.push("Includes layering piece");
    }

    return { score, reasons };
}

export function generateOutfits(rawItems: ClothingItemData[], params: GenParams): GeneratedOutfit[] {
    const items = rawItems.map((item) => ({
        ...item,
        tags: typeof item.tags === "string" ? tagsToArray(item.tags as unknown as string) : item.tags,
    }));

    const tops = items.filter((i) => i.category === "TOP");
    const bottoms = items.filter((i) => i.category === "BOTTOM");
    const shoes = items.filter((i) => i.category === "SHOES");
    const outers = items.filter((i) => i.category === "OUTER");

    if (tops.length === 0 || bottoms.length === 0 || shoes.length === 0) return [];

    const candidates: { items: ClothingItemData[]; score: number; reasons: string[] }[] = [];

    for (const top of tops) {
        for (const bottom of bottoms) {
            for (const shoe of shoes) {
                const base = [top, bottom, shoe];
                const r = scoreOutfit(base, params);
                candidates.push({ items: base, score: r.score, reasons: r.reasons });

                for (const outer of outers) {
                    const withOuter = [top, bottom, shoe, outer];
                    const r2 = scoreOutfit(withOuter, params);
                    candidates.push({ items: withOuter, score: r2.score, reasons: r2.reasons });
                }
            }
        }
    }

    candidates.sort((a, b) => b.score - a.score);

    const seen = new Set<string>();
    const results: GeneratedOutfit[] = [];

    for (const c of candidates) {
        if (results.length >= 3) break;
        const key = c.items.map((i) => i.id).sort().join(",");
        if (seen.has(key)) continue;
        seen.add(key);

        results.push({
            items: c.items,
            explanation: c.reasons.join(". ") + ".",
        });
    }

    return results;
}
