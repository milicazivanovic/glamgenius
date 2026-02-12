import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    _request: NextRequest,
    { params }: { params: { date: string } }
) {
    try {
        const existing = await prisma.plannedOutfit.findUnique({
            where: { date: params.date },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "No planned outfit for this date" },
                { status: 404 }
            );
        }

        await prisma.plannedOutfit.delete({ where: { date: params.date } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/calendar/[date] error:", error);
        return NextResponse.json(
            { error: "Failed to remove planned outfit" },
            { status: 500 }
        );
    }
}
