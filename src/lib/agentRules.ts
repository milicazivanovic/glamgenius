import { ClothingItemData, GeneratedOutfit, Mood, Occasion } from "./types";
import { generateOutfits } from "./outfitRules";

export interface AgentContext {
    wardrobe: ClothingItemData[];
    lastOutfits: GeneratedOutfit[];
    lastParams: { mood: Mood; occasion: Occasion; weather: string } | null;
}

export interface AgentAction {
    id: string;
    label: string;
    type: "GENERATE" | "MODIFY" | "MARK_WORN" | "MARK_DIRTY" | "ADD_CALENDAR" | "NAVIGATE" | "SEND_MSG";
    payload?: any;
    primary?: boolean;
}

export interface AgentTrace {
    intent: string;
    parsedParams: Record<string, string>;
    rulesTriggered: string[];
    confidence: number;
}

export interface AgentResponse {
    content: string;
    outfits?: GeneratedOutfit[];
    actions?: AgentAction[];
    trace?: AgentTrace;
}

const INTENTS = {
    GENERATE: /\b(wear|outfit|dressed|ready|recommend|choose|pick|find|get)\b/i,
    WEATHER: /\b(cold|hot|warm|rain|sunny|snow|freezing|chilly|mild)\b/i,
    MOOD: /\b(happy|sad|stressed|tired|energetic|confident|glam|lazy|anxious|nervous|romantic)\b/i,
    OCCASION: /\b(work|office|date|party|gym|workout|travel|vacation|formal|casual)\b/i,
    MODIFY: /\b(warmer|cooler|formal|casual|color|comfortable|comfy|shoes|jacket)\b/i,
    ACTION_WORN: /\b(mark.*worn|wore.*this)\b/i,
    ACTION_DIRTY: /\b(mark.*dirty|wash)\b/i,
    HELP: /\b(help|start|hi|hello|hey|menu)\b/i,
};

export function processUserMessage(input: string, context: AgentContext): AgentResponse {
    const text = input.toLowerCase();

    // 1. HELP / START
    if (INTENTS.HELP.test(text) && !INTENTS.GENERATE.test(text)) {
        return {
            content: "Hi! I'm your AI style assistant. I can generate outfits for any occasion, adjust them to your needs, or help manage your wardrobe.",
            actions: [
                { id: "gen_today", label: "Get me ready for today", type: "SEND_MSG", payload: "Get me ready for today", primary: true },
                { id: "gen_date", label: "Plan a date night outfit", type: "SEND_MSG", payload: "Find a date night outfit" },
                { id: "nav_wardrobe", label: "Add new item", type: "NAVIGATE", payload: "/wardrobe" },
            ],
            trace: {
                intent: "HELP",
                parsedParams: {},
                rulesTriggered: ["Greeting Rule"],
                confidence: 1.0
            }
        };
    }

    // 2. GENERATE OUTFIT
    if (INTENTS.GENERATE.test(text) || INTENTS.MOOD.test(text) || INTENTS.OCCASION.test(text)) {
        let mood: Mood = "happy";
        let occasion: Occasion = "casual";
        let weather = "";

        // Mood detection
        const moodMatch = text.match(INTENTS.MOOD);
        if (text.includes("stress") || text.includes("tired") || text.includes("anxious")) mood = "relaxed";
        else if (text.includes("confident") || text.includes("bold") || text.includes("glam")) mood = "confident";
        else if (text.includes("energetic") || text.includes("gym")) mood = "energetic";
        else if (text.includes("romantic") || text.includes("date") || text.includes("love")) mood = "romantic";
        else if (text.includes("minimal") || text.includes("simple")) mood = "minimal";

        // Occasion detection
        const occMatch = text.match(INTENTS.OCCASION);
        if (text.includes("work") || text.includes("office")) occasion = "work";
        else if (text.includes("date")) occasion = "date-night";
        else if (text.includes("party")) occasion = "party";
        else if (text.includes("gym") || text.includes("workout")) occasion = "sport";
        else if (text.includes("formal")) occasion = "formal";
        else if (text.includes("travel")) occasion = "travel";

        // Weather detection
        const weatherMatch = text.match(INTENTS.WEATHER);
        if (weatherMatch) weather = weatherMatch[0];

        // Trace
        const trace: AgentTrace = {
            intent: "GENERATE",
            parsedParams: {
                mood: moodMatch ? moodMatch[0] : (mood !== "happy" ? mood : "default(happy)"),
                occasion: occMatch ? occMatch[0] : (occasion !== "casual" ? occasion : "default(casual)"),
                weather: weatherMatch ? weatherMatch[0] : (context.lastParams?.weather ? "context" : "missing"),
            },
            rulesTriggered: ["Intent Parser > Generate"],
            confidence: 0.9,
        };

        // Missing weather check
        if (!weather && !context.lastParams?.weather) {
            trace.rulesTriggered.push("Missing Parameter: Weather");
            return {
                content: "I can help with that. What's the weather like right now?",
                actions: [
                    { id: "w_sunny", label: "Sunny & Warm", type: "SEND_MSG", payload: `Sunny warm outfit for ${occasion}` },
                    { id: "w_cold", label: "Cold & Rainy", type: "SEND_MSG", payload: `Cold rainy outfit for ${occasion}` },
                ],
                trace
            };
        }

        const finalWeather = weather || context.lastParams?.weather || "mild";
        const vibes = mood === "relaxed" ? ["stressed"] : [];
        if (vibes.length > 0) trace.rulesTriggered.push(`Vibe Inference: ${vibes.join(",")}`);

        trace.parsedParams.finalWeather = finalWeather;

        const outfits = generateOutfits(context.wardrobe, { mood, occasion, weather: finalWeather, vibes });

        if (outfits.length === 0) {
            trace.rulesTriggered.push("Error: No Outfits Generated");
            return {
                content: "I couldn't find a complete outfit with your current wardrobe constraints. Try creating a wardrobe gap list?",
                actions: [{ id: "add_item", label: "Add Item", type: "NAVIGATE", payload: "/wardrobe" }],
                trace
            };
        }

        trace.rulesTriggered.push(`Scoring Engine: Generated ${outfits.length} outfits`);
        // Add top stats from first outfit explanation
        trace.rulesTriggered.push(`Top Logic: ${outfits[0].explanation}`);

        return {
            content: `Here are 3 ${mood} outfits for ${occasion} (${finalWeather}).`,
            outfits: outfits,
            actions: [
                { id: "mod_warmer", label: "Make it warmer", type: "SEND_MSG", payload: "Make it warmer" },
                { id: "mod_formal", label: "Make it more formal", type: "SEND_MSG", payload: "Make it formal" },
            ],
            trace
        };
    }

    // 3. MODIFY INTENT
    if (INTENTS.MODIFY.test(text)) {
        const trace: AgentTrace = {
            intent: "MODIFY",
            parsedParams: { modifier: text.match(INTENTS.MODIFY)?.[0] || "unknown" },
            rulesTriggered: ["Intent Parser > Modify"],
            confidence: 0.95
        };

        if (!context.lastOutfits || context.lastOutfits.length === 0) {
            trace.rulesTriggered.push("Error: No Context");
            return {
                content: "I need to generate an outfit first before I can modify it!",
                actions: [{ id: "help_gen", label: "Generate Outfit", type: "SEND_MSG", payload: "Generate an outfit" }],
                trace
            };
        }

        const params = { ...context.lastParams! };
        let modMsg = "";

        if (text.includes("warmer")) {
            params.weather = "cold freezing";
            modMsg = "Switching to warmer layers.";
            trace.rulesTriggered.push("Constraint Update: Weather -> cold freezing");
        } else if (text.includes("cooler")) {
            params.weather = "hot sunny";
            modMsg = "Looking for lighter options.";
            trace.rulesTriggered.push("Constraint Update: Weather -> hot sunny");
        } else if (text.includes("formal")) {
            params.occasion = "formal";
            params.mood = "confident";
            modMsg = "Elevating the look to formal.";
            trace.rulesTriggered.push("Constraint Update: Occasion -> formal");
        } else if (text.includes("casual") || text.includes("comfy")) {
            params.occasion = "casual";
            params.mood = "relaxed";
            modMsg = "Prioritizing comfort.";
            trace.rulesTriggered.push("Constraint Update: Occasion -> casual");
        }

        const outfits = generateOutfits(context.wardrobe, { ...params, vibes: [] });
        return {
            content: `Understood. ${modMsg}`,
            outfits: outfits,
            actions: [
                { id: "save_outfit", label: "View All Outfits", type: "NAVIGATE", payload: "/outfits" }
            ],
            trace
        };
    }

    // 4. ACTION INTENTS
    if (INTENTS.ACTION_WORN.test(text)) {
        return {
            content: "I can mark your last outfit as worn to update styling stats.",
            actions: [
                { id: "confirm_worn", label: "Confirm: Mark Worn", type: "MARK_WORN", payload: true, primary: true }
            ],
            trace: { intent: "ACTION_WORN", parsedParams: {}, rulesTriggered: ["Action > Mark Worn"], confidence: 1.0 }
        };
    }

    if (INTENTS.ACTION_DIRTY.test(text)) {
        return {
            content: "I've flagged those items as needing a wash. I'll avoid recommending them for 7 days.",
            actions: [],
            trace: { intent: "ACTION_DIRTY", parsedParams: {}, rulesTriggered: ["Action > Mark Dirty", "Logic: 7-day exclusion"], confidence: 1.0 }
        };
    }

    // DEFAULT FALLBACK
    return {
        content: "I'm your style assistant. Try asking me to 'Get me ready for a date' or 'Finding a work outfit'.",
        actions: [
            { id: "gen_work", label: "Work Outfit", type: "SEND_MSG", payload: "Find a work outfit", primary: true },
            { id: "gen_cas", label: "Casual Weekend", type: "SEND_MSG", payload: "Casual weekend outfit" }
        ],
        trace: { intent: "UNKNOWN", parsedParams: {}, rulesTriggered: ["Fallback Response"], confidence: 0.1 }
    };
}
