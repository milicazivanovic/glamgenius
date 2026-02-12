export const VIBES = {
    positive: [
        "happy", "confident", "energetic", "excited", "romantic",
        "playful", "bold", "glamorous", "adventurous", "grateful",
    ],
    neutral: [
        "relaxed", "minimal", "focused", "calm", "balanced",
        "practical", "professional", "independent", "reflective", "curious",
    ],
    negative: [
        "stressed", "anxious", "sad", "tired", "overwhelmed",
        "frustrated", "lonely", "insecure", "unmotivated", "gloomy",
    ],
} as const;

export type VibeCategory = keyof typeof VIBES;
export type Vibe = (typeof VIBES)[VibeCategory][number];

export const ALL_VIBES: Vibe[] = [
    ...VIBES.positive, ...VIBES.neutral, ...VIBES.negative,
];

export const NEGATIVE_VIBES = new Set<string>(VIBES.negative);

export const VIBE_LABELS: Record<VibeCategory, string> = {
    positive: "Positive",
    neutral: "Neutral",
    negative: "Negative",
};

/** Tags to prefer when user selects negative vibes */
export const COMFORT_TAGS = ["casual", "cozy", "basic", "everyday", "versatile", "minimal", "comfortable"];

/** Tags to demote when user has negative vibes (unless they also picked bold/glamorous) */
export const STATEMENT_TAGS = ["elegant", "evening", "formal", "feminine", "bold"];

/** Map vibes → tags that outfit scoring should prefer */
export const VIBE_TAG_MAP: Record<string, string[]> = {
    // Positive
    happy: ["casual", "everyday", "sporty", "weekend", "playful"],
    confident: ["formal", "elegant", "classic", "office", "bold"],
    energetic: ["sporty", "casual", "everyday", "weekend"],
    excited: ["bold", "evening", "playful", "weekend"],
    romantic: ["elegant", "feminine", "evening"],
    playful: ["casual", "playful", "weekend", "sporty"],
    bold: ["bold", "elegant", "evening", "formal"],
    glamorous: ["elegant", "evening", "formal", "feminine"],
    adventurous: ["casual", "sporty", "versatile", "layering"],
    grateful: ["casual", "cozy", "everyday"],
    // Neutral
    relaxed: ["casual", "cozy", "basic", "everyday"],
    minimal: ["basic", "versatile", "everyday", "minimal"],
    focused: ["office", "smart-casual", "classic"],
    calm: ["cozy", "basic", "casual", "everyday"],
    balanced: ["versatile", "casual", "smart-casual"],
    practical: ["versatile", "everyday", "basic"],
    professional: ["office", "formal", "classic", "smart-casual"],
    independent: ["versatile", "casual", "everyday"],
    reflective: ["cozy", "basic", "casual"],
    curious: ["casual", "versatile", "everyday"],
    // Negative — all map to comfort-oriented tags
    stressed: ["cozy", "casual", "basic", "comfortable", "everyday"],
    anxious: ["cozy", "basic", "casual", "comfortable", "minimal"],
    sad: ["cozy", "comfortable", "casual", "basic", "everyday"],
    tired: ["casual", "cozy", "comfortable", "basic", "everyday"],
    overwhelmed: ["basic", "minimal", "casual", "comfortable", "cozy"],
    frustrated: ["casual", "comfortable", "basic", "cozy"],
    lonely: ["cozy", "comfortable", "casual", "basic"],
    insecure: ["basic", "casual", "everyday", "comfortable", "versatile"],
    unmotivated: ["casual", "cozy", "basic", "comfortable"],
    gloomy: ["cozy", "casual", "comfortable", "basic", "everyday"],
};

const STORAGE_KEY = "glamgenius_vibes";

export function saveVibes(vibes: string[]): void {
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(vibes));
    }
}

export function loadVibes(): string[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

export function hasCompletedOnboarding(): boolean {
    return loadVibes().length >= 2;
}
