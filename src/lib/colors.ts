const NEUTRAL_COLORS = new Set([
    "black",
    "white",
    "gray",
    "grey",
    "beige",
    "cream",
    "ivory",
    "navy",
    "tan",
    "khaki",
    "charcoal",
    "taupe",
]);

export function isNeutral(color: string): boolean {
    return NEUTRAL_COLORS.has(color.toLowerCase().trim());
}

export function colorsClash(colorA: string, colorB: string): boolean {
    const a = colorA.toLowerCase().trim();
    const b = colorB.toLowerCase().trim();
    if (isNeutral(a) || isNeutral(b)) return false;
    return a === b;
}

// Map common color names to CSS colors for display
const COLOR_MAP: Record<string, string> = {
    black: "#1a1a1a",
    white: "#f5f5f5",
    gray: "#9ca3af",
    grey: "#9ca3af",
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    orange: "#f97316",
    purple: "#a855f7",
    pink: "#ec4899",
    brown: "#92400e",
    beige: "#d4a574",
    cream: "#fffdd0",
    navy: "#1e3a5f",
    tan: "#d2b48c",
    khaki: "#c3b091",
    charcoal: "#36454f",
    taupe: "#483c32",
    ivory: "#fffff0",
    teal: "#14b8a6",
    coral: "#ff7f50",
    lavender: "#e6e6fa",
    maroon: "#800000",
    olive: "#808000",
    burgundy: "#722f37",
    gold: "#ffd700",
    silver: "#c0c0c0",
    mint: "#98fb98",
};

export function getColorHex(color: string): string {
    return COLOR_MAP[color.toLowerCase().trim()] || "#9ca3af";
}
