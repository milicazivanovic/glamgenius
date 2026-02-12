import { z } from "zod";
import { CATEGORIES, SEASONS, MOODS, OCCASIONS } from "./types";

export const clothingItemSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    category: z.enum(CATEGORIES, { errorMap: () => ({ message: "Invalid category" }) }),
    color: z.string().min(1, "Color is required").max(50, "Color too long"),
    season: z.enum(SEASONS, { errorMap: () => ({ message: "Invalid season" }) }),
    tags: z.array(z.string().max(30)).max(10, "Too many tags").default([]),
    imageUrl: z.string().url("Invalid URL").nullable().optional(),
});

export type ClothingItemInput = z.infer<typeof clothingItemSchema>;

export const generateInputSchema = z.object({
    mood: z.enum(MOODS, { errorMap: () => ({ message: "Invalid mood" }) }),
    occasion: z.enum(OCCASIONS, { errorMap: () => ({ message: "Invalid occasion" }) }),
    weather: z.string().min(1, "Weather is required").max(100, "Weather too long"),
});

export type GenerateInput = z.infer<typeof generateInputSchema>;

export const feedbackSchema = z.object({
    outfitId: z.string().min(1, "Outfit ID is required"),
    rating: z.number().int().min(1).max(5),
    liked: z.boolean(),
    note: z.string().max(500).nullable().optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

export const plannedOutfitSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
    outfitId: z.string().min(1, "Outfit ID is required"),
});

export type PlannedOutfitInput = z.infer<typeof plannedOutfitSchema>;
