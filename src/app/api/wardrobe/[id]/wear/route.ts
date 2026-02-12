import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const item = await prisma.clothingItem.findUnique({ where: { id: params.id } });
        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        const updated = await prisma.clothingItem.update({
            where: { id: params.id },
            data: {
                timesWorn: item.timesWorn + 1,
                lastWorn: new Date(),
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Wear update failed:", error);
        return NextResponse.json({ error: "Failed to update wear count" }, { status: 500 });
    }
}
