import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clothingItemSchema } from "@/lib/schemas";
import { tagsToString, tagsToArray } from "@/lib/types";

function serializeItem(item: { id: string; name: string; category: string; color: string; season: string; tags: string; imageUrl: string | null; timesWorn: number; lastWorn: Date | null; createdAt: Date; updatedAt: Date }) {
    return {
        ...item,
        tags: tagsToArray(item.tags),
        lastWorn: item.lastWorn?.toISOString() ?? null,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
    };
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const parsed = clothingItemSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
        }

        const existing = await prisma.clothingItem.findUnique({ where: { id: params.id } });
        if (!existing) return NextResponse.json({ error: "Item not found" }, { status: 404 });

        const { tags, ...rest } = parsed.data;
        const item = await prisma.clothingItem.update({
            where: { id: params.id },
            data: { ...rest, imageUrl: rest.imageUrl ?? null, tags: tagsToString(tags) },
        });

        return NextResponse.json(serializeItem(item));
    } catch (error) {
        console.error("PUT /api/wardrobe/[id] error:", error);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const existing = await prisma.clothingItem.findUnique({ where: { id: params.id } });
        if (!existing) return NextResponse.json({ error: "Item not found" }, { status: 404 });
        await prisma.clothingItem.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/wardrobe/[id] error:", error);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}
