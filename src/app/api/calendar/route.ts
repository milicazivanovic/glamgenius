import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { plannedOutfitSchema } from "@/lib/schemas";
import { tagsToArray } from "@/lib/types";

function serializeOutfit(p: any) {
    return {
        ...p,
        createdAt: p.createdAt.toISOString(),
        outfit: {
            ...p.outfit,
            createdAt: p.outfit.createdAt.toISOString(),
            items: p.outfit.items.map((oi: any) => ({
                id: oi.id,
                clothingItem: {
                    ...oi.clothingItem,
                    tags: tagsToArray(oi.clothingItem.tags),
                    lastWorn: oi.clothingItem.lastWorn?.toISOString() ?? null,
                    createdAt: oi.clothingItem.createdAt.toISOString(),
                    updatedAt: oi.clothingItem.updatedAt.toISOString(),
                },
            })),
            feedback: (p.outfit.feedback || []).map((f: any) => ({
                ...f, createdAt: f.createdAt.toISOString(),
            })),
        },
    };
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const month = searchParams.get("month");

        const where: Record<string, unknown> = {};
        if (month) where.date = { startsWith: month };

        const planned = await prisma.plannedOutfit.findMany({
            where,
            include: {
                outfit: {
                    include: {
                        items: { include: { clothingItem: true } },
                        feedback: true,
                    },
                },
            },
            orderBy: { date: "asc" },
        });

        return NextResponse.json(planned.map(serializeOutfit));
    } catch (error) {
        console.error("GET /api/calendar error:", error);
        return NextResponse.json({ error: "Failed to fetch planned outfits" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = plannedOutfitSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
        }

        const outfit = await prisma.outfit.findUnique({ where: { id: parsed.data.outfitId } });
        if (!outfit) return NextResponse.json({ error: "Outfit not found" }, { status: 404 });

        const planned = await prisma.plannedOutfit.upsert({
            where: { date: parsed.data.date },
            update: { outfitId: parsed.data.outfitId },
            create: { date: parsed.data.date, outfitId: parsed.data.outfitId },
            include: {
                outfit: {
                    include: {
                        items: { include: { clothingItem: true } },
                        feedback: true,
                    },
                },
            },
        });

        return NextResponse.json(serializeOutfit(planned), { status: 201 });
    } catch (error) {
        console.error("POST /api/calendar error:", error);
        return NextResponse.json({ error: "Failed to plan outfit" }, { status: 500 });
    }
}
