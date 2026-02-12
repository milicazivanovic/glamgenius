import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tagsToArray } from "@/lib/types";

export async function GET() {
    try {
        const outfits = await prisma.outfit.findMany({
            include: {
                items: { include: { clothingItem: true } },
                feedback: true,
            },
            orderBy: { createdAt: "desc" },
            take: 20,
        });

        const parsed = outfits.map((outfit) => ({
            ...outfit,
            createdAt: outfit.createdAt.toISOString(),
            items: outfit.items.map((oi) => ({
                id: oi.id,
                clothingItem: {
                    ...oi.clothingItem,
                    tags: tagsToArray(oi.clothingItem.tags),
                    lastWorn: oi.clothingItem.lastWorn?.toISOString() ?? null,
                    createdAt: oi.clothingItem.createdAt.toISOString(),
                    updatedAt: oi.clothingItem.updatedAt.toISOString(),
                },
            })),
            feedback: outfit.feedback.map((f) => ({
                ...f,
                createdAt: f.createdAt.toISOString(),
            })),
        }));

        return NextResponse.json(parsed);
    } catch (error) {
        console.error("GET /api/outfits error:", error);
        return NextResponse.json({ error: "Failed to fetch outfits" }, { status: 500 });
    }
}
