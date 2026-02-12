import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { feedbackSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = feedbackSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const outfit = await prisma.outfit.findUnique({
            where: { id: parsed.data.outfitId },
        });

        if (!outfit) {
            return NextResponse.json({ error: "Outfit not found" }, { status: 404 });
        }

        const feedback = await prisma.outfitFeedback.create({
            data: {
                outfitId: parsed.data.outfitId,
                rating: parsed.data.rating,
                liked: parsed.data.liked,
                note: parsed.data.note ?? null,
            },
        });

        return NextResponse.json(
            { ...feedback, createdAt: feedback.createdAt.toISOString() },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/feedback error:", error);
        return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
    }
}
