import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tagsToArray } from "@/lib/types";

export async function GET() {
    try {
        const items = await prisma.clothingItem.findMany({
            orderBy: { updatedAt: "desc" },
        });

        const formatted = items.map((item) => ({
            ...item,
            category: item.category as "TOP" | "BOTTOM" | "SHOES" | "OUTER" | "ACCESSORY",
            season: item.season as "SPRING" | "SUMMER" | "FALL" | "WINTER" | "ALL",
            tags: tagsToArray(item.tags),
            lastWorn: item.lastWorn?.toISOString() ?? null,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("GET /api/wardrobe error:", error);
        return NextResponse.json({ error: "Failed to fetch wardrobe" }, { status: 500 });
    }
}
