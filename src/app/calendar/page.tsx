"use client";

import { useState, useEffect } from "react";
import { PlannedOutfitData, OutfitData } from "@/lib/types";
import { OutfitPicker } from "@/components/OutfitPicker";
import { Calendar as CalendarIcon, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/Toast";

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
    const [planned, setPlanned] = useState<PlannedOutfitData[]>([]);
    const [showPicker, setShowPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
    const { toast } = useToast();

    const fetchPlanned = () => {
        fetch("/api/calendar")
            .then((r) => r.json())
            .then((data) => setPlanned(data));
    };

    useEffect(() => { fetchPlanned(); }, []);

    const handleSelectOutfit = async (outfit: OutfitData) => {
        if (!selectedDate) return;
        setShowPicker(false);

        try {
            const res = await fetch("/api/calendar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: selectedDate, outfitId: outfit.id }),
            });
            if (!res.ok) throw new Error();
            toast("Outfit scheduled");
            fetchPlanned();
        } catch {
            toast("Failed to schedule", "error");
        }
    };

    const handleRemove = async (date: string) => {
        try {
            await fetch(`/api/calendar/${date}`, { method: "DELETE" });
            toast("Schedule removed");
            fetchPlanned();
        } catch {
            toast("Failed to remove", "error");
        }
    };

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
        else setCurrentMonth((m) => m - 1);
    };

    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
        else setCurrentMonth((m) => m + 1);
    };

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfWeek(currentYear, currentMonth);
    const todayStr = new Date().toISOString().split("T")[0];

    const getPlannedForDay = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return planned.find((p) => p.date === dateStr);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-neutral-950">Calendar</h1>
                <p className="text-sm text-neutral-500 mt-0.5">Plan your outfits for upcoming days.</p>
            </div>

            <div className="card-flat overflow-hidden">
                {/* Month Navigation */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                    <button onClick={prevMonth} className="btn-ghost p-1">
                        <ChevronLeft size={18} />
                    </button>
                    <h2 className="text-sm font-semibold">{MONTH_NAMES[currentMonth]} {currentYear}</h2>
                    <button onClick={nextMonth} className="btn-ghost p-1">
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* Day Labels */}
                <div className="grid grid-cols-7 border-b border-neutral-100">
                    {DAY_LABELS.map((d) => (
                        <div key={d} className="text-center text-2xs font-medium text-neutral-400 uppercase tracking-wider py-2">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7">
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-24 border-b border-r border-neutral-50" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const isToday = dateStr === todayStr;
                        const plannedOutfit = getPlannedForDay(day);

                        return (
                            <div
                                key={day}
                                className={`h-24 border-b border-r border-neutral-50 p-1.5 cursor-pointer hover:bg-neutral-50 transition-colors ${isToday ? "bg-brand-50/30" : ""
                                    }`}
                                onClick={() => {
                                    if (!plannedOutfit) {
                                        setSelectedDate(dateStr);
                                        setShowPicker(true);
                                    }
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-medium ${isToday ? "text-brand-600" : "text-neutral-600"}`}>
                                        {day}
                                    </span>
                                    {plannedOutfit && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRemove(dateStr); }}
                                            className="text-neutral-300 hover:text-red-400"
                                        >
                                            <Trash2 size={10} />
                                        </button>
                                    )}
                                </div>
                                {plannedOutfit && (
                                    <div className="mt-1">
                                        <div className="bg-neutral-900 text-white text-2xs px-1.5 py-0.5 font-medium truncate" style={{ borderRadius: "var(--radius-sm)" }}>
                                            {plannedOutfit.outfit.mood} · {plannedOutfit.outfit.occasion}
                                        </div>
                                    </div>
                                )}
                                {!plannedOutfit && (
                                    <div className="flex items-center justify-center h-10 opacity-0 group-hover:opacity-100">
                                        <Plus size={12} className="text-neutral-300" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {showPicker && (
                <OutfitPicker
                    onSelect={handleSelectOutfit}
                    onClose={() => setShowPicker(false)}
                />
            )}
        </div>
    );
}
