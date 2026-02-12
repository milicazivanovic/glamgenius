"use client";

import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";

interface FeedbackFormProps {
    outfitId: string;
    onSubmitted: () => void;
    existingFeedback?: { rating: number; liked: boolean; note: string | null } | null;
}

export function FeedbackForm({ outfitId, onSubmitted, existingFeedback }: FeedbackFormProps) {
    const [rating, setRating] = useState(existingFeedback?.rating ?? 0);
    const [liked, setLiked] = useState(existingFeedback?.liked ?? true);
    const [note, setNote] = useState(existingFeedback?.note ?? "");
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(!!existingFeedback);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSaving(true);
        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ outfitId, rating, liked, note: note || null }),
            });
            if (!res.ok) throw new Error("Failed");
            setDone(true);
            onSubmitted();
        } catch {
            // silently fail
        } finally {
            setSaving(false);
        }
    };

    if (done) {
        return (
            <div className="flex items-center gap-2 text-sm font-medium mt-3" style={{ color: "#16a34a" }}>
                <ThumbsUp size={14} /> Feedback saved — {rating}/5 {liked ? "would wear again" : "would skip"}
            </div>
        );
    }

    return (
        <div className="mt-3 pt-3 border-t border-neutral-100 space-y-3">
            {/* Star rating */}
            <div className="flex items-center gap-1">
                <span className="text-xs text-neutral-500 mr-2">Rate this outfit</span>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-colors"
                    >
                        <Star
                            size={18}
                            fill={star <= rating ? "#ff2d73" : "none"}
                            stroke={star <= rating ? "#ff2d73" : "#d4d4d4"}
                            strokeWidth={1.5}
                        />
                    </button>
                ))}
            </div>

            {/* Like/Dislike */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 mr-1">Would wear again?</span>
                <button
                    onClick={() => setLiked(true)}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium border transition-all ${liked
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "border-neutral-200 text-neutral-400"
                        }`}
                    style={{ borderRadius: "var(--radius-md)" }}
                >
                    <ThumbsUp size={12} /> Yes
                </button>
                <button
                    onClick={() => setLiked(false)}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium border transition-all ${!liked
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "border-neutral-200 text-neutral-400"
                        }`}
                    style={{ borderRadius: "var(--radius-md)" }}
                >
                    <ThumbsDown size={12} /> No
                </button>
            </div>

            {/* Note */}
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note..."
                className="input-field text-xs h-14 resize-none"
            />

            <button
                onClick={handleSubmit}
                disabled={rating === 0 || saving}
                className="btn-primary text-xs w-full"
            >
                {saving ? (
                    <><span className="spinner" /> Saving...</>
                ) : (
                    "Submit Feedback"
                )}
            </button>
        </div>
    );
}
