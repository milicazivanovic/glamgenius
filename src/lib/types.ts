export const CATEGORIES = ["TOP", "BOTTOM", "SHOES", "OUTER", "ACCESSORY"] as const;
export type Category = (typeof CATEGORIES)[number];

export const SEASONS = ["SPRING", "SUMMER", "FALL", "WINTER", "ALL"] as const;
export type Season = (typeof SEASONS)[number];

export const MOODS = ["happy", "confident", "relaxed", "energetic", "romantic", "minimal"] as const;
export type Mood = (typeof MOODS)[number];

export const OCCASIONS = ["work", "casual", "date-night", "party", "sport", "travel", "formal"] as const;
export type Occasion = (typeof OCCASIONS)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
    TOP: "Top", BOTTOM: "Bottom", SHOES: "Shoes", OUTER: "Outerwear", ACCESSORY: "Accessory",
};

export const SEASON_LABELS: Record<Season, string> = {
    SPRING: "Spring", SUMMER: "Summer", FALL: "Fall", WINTER: "Winter", ALL: "All Seasons",
};

export const MOOD_LABELS: Record<Mood, string> = {
    happy: "Happy", confident: "Confident", relaxed: "Relaxed",
    energetic: "Energetic", romantic: "Romantic", minimal: "Minimal",
};

export const OCCASION_LABELS: Record<Occasion, string> = {
    work: "Work", casual: "Casual", "date-night": "Date Night",
    party: "Party", sport: "Sport", travel: "Travel", formal: "Formal",
};

export interface ClothingItemData {
    id: string;
    name: string;
    category: Category;
    color: string;
    season: Season;
    tags: string[];
    imageUrl: string | null;
    timesWorn: number;
    lastWorn: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface OutfitData {
    id: string;
    explanation: string;
    mood: string;
    occasion: string;
    weatherSummary: string;
    createdAt: string;
    items: { id: string; clothingItem: ClothingItemData }[];
    feedback?: OutfitFeedbackData[];
}

export interface OutfitFeedbackData {
    id: string;
    outfitId: string;
    rating: number;
    liked: boolean;
    note: string | null;
    createdAt: string;
}

export interface GeneratedOutfit {
    items: ClothingItemData[];
    explanation: string;
}

export interface PlannedOutfitData {
    id: string;
    date: string;
    outfitId: string;
    createdAt: string;
    outfit: OutfitData;
}

export function tagsToArray(tags: string): string[] {
    if (!tags || tags.trim() === "") return [];
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

export function tagsToString(tags: string[]): string {
    return tags.filter(Boolean).join(",");
}
