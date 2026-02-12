import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInputSchema } from "@/lib/schemas";
import { tagsToArray } from "@/lib/types";
import { generateOutfits } from "@/lib/outfitRules";
import type { ClothingItemData } from "@/lib/types";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate core fields
        const parsed = generateInputSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { mood, occasion, weather } = parsed.data;

        // Extract vibes (optional, array of strings from localStorage)
        const vibes: string[] = Array.isArray(body.vibes)
            ? body.vibes.filter((v: unknown) => typeof v === "string").slice(0, 30)
            : [];

        const items = await prisma.clothingItem.findMany();
        const mapped: ClothingItemData[] = items.map((item: { id: string; name: string; category: string; color: string; season: string; tags: string; imageUrl: string | null; timesWorn: number; lastWorn: Date | null; createdAt: Date; updatedAt: Date }) => ({
            ...item,
            category: item.category as ClothingItemData["category"],
            season: item.season as ClothingItemData["season"],
            tags: tagsToArray(item.tags),
            lastWorn: item.lastWorn?.toISOString() ?? null,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        }));

        const outfits = generateOutfits(mapped, { mood, occasion, weather, vibes });

        if (outfits.length === 0) {
            return NextResponse.json(
                { error: "Not enough items to generate outfits. Need at least 1 top, 1 bottom, and 1 pair of shoes." },
                { status: 400 }
            );
        }

        // Save generated outfits to DB
        const saved = [];
        for (const outfit of outfits) {
            const created = await prisma.outfit.create({
                data: {
                    explanation: outfit.explanation,
                    mood,
                    occasion,
                    weatherSummary: weather,
                    items: {
                        create: outfit.items.map((i) => ({ clothingItemId: i.id })),
                    },
                },
                include: {
                    items: { include: { clothingItem: true } },
                    feedback: true,
                },
            });

            // Increment timesWorn for each item
            for (const item of outfit.items) {
                await prisma.clothingItem.update({
                    where: { id: item.id },
                    data: { timesWorn: { increment: 1 }, lastWorn: new Date() },
                });
            }

            saved.push({
                ...created,
                createdAt: created.createdAt.toISOString(),
                items: created.items.map((oi: { id: string; clothingItem: { id: string; name: string; category: string; color: string; season: string; tags: string; imageUrl: string | null; timesWorn: number; lastWorn: Date | null; createdAt: Date; updatedAt: Date } }) => ({
                    id: oi.id,
                    clothingItem: {
                        ...oi.clothingItem,
                        tags: tagsToArray(oi.clothingItem.tags),
                        lastWorn: oi.clothingItem.lastWorn?.toISOString() ?? null,
                        createdAt: oi.clothingItem.createdAt.toISOString(),
                        updatedAt: oi.clothingItem.updatedAt.toISOString(),
                    },
                })),
                feedback: [],
            });
        }

        return NextResponse.json(saved, { status: 201 });
    } catch (error) {
        console.error("POST /api/generate error:", error);
        return NextResponse.json({ error: "Failed to generate outfits" }, { status: 500 });
    }
}
