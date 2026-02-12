"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Sparkles, Shirt, Bug } from "lucide-react";
import { AgentContext, processUserMessage, AgentAction, AgentTrace } from "@/lib/agentRules";
import { GeneratedOutfit, ClothingItemData, Mood, Occasion } from "@/lib/types";
import { useRouter } from "next/navigation";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    outfits?: GeneratedOutfit[];
    actions?: AgentAction[];
    trace?: AgentTrace;
}

export function StylistChat() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [debug, setDebug] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hi! I'm your AI style assistant. I can generate outfits, adjust them to your needs, or help manage your wardrobe.",
            actions: [
                { id: "start_today", label: "Get me ready", type: "SEND_MSG", payload: "Get me ready", primary: true },
                { id: "start_date", label: "Plan Date Night", type: "SEND_MSG", payload: "Plan a date night" },
            ]
        },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Agent Context
    const [wardrobe, setWardrobe] = useState<ClothingItemData[]>([]);
    const [context, setContext] = useState<AgentContext>({
        wardrobe: [],
        lastOutfits: [],
        lastParams: null,
    });

    // Fetch wardrobe on open
    useEffect(() => {
        if (open && wardrobe.length === 0) {
            fetch("/api/wardrobe")
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setWardrobe(data);
                        setContext((prev) => ({ ...prev, wardrobe: data }));
                    }
                })
                .catch((err) => console.error("Failed to fetch wardrobe", err));
        }
    }, [open, wardrobe.length]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, typing, open, debug]);

    const handleKeyboardShortcut = useCallback((e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
            e.preventDefault();
            setOpen((prev) => !prev);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyboardShortcut);
        return () => window.removeEventListener("keydown", handleKeyboardShortcut);
    }, [handleKeyboardShortcut]);

    const handleAction = async (action: AgentAction) => {
        if (action.type === "NAVIGATE") {
            router.push(action.payload);
            setOpen(false);
        } else if (action.type === "SEND_MSG") {
            sendMessage(action.payload);
        } else if (action.type === "MARK_WORN") {
            const assistantMsg: Message = {
                id: Date.now().toString(),
                role: "assistant",
                content: "Done! I've marked those items as worn. This helps me verify your wear statistics.",
            };
            setMessages((prev) => [...prev, assistantMsg]);
        }
    };

    const sendMessage = (textOverride?: string) => {
        const text = textOverride || input.trim();
        if (!text) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setTyping(true);

        setTimeout(() => {
            const response = processUserMessage(text, context);

            setContext((prev) => ({
                ...prev,
                lastOutfits: response.outfits ? response.outfits : prev.lastOutfits,
                lastParams: response.outfits
                    ? { mood: "happy" as Mood, occasion: "casual" as Occasion, weather: "mild" }
                    : prev.lastParams
            }));

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response.content,
                outfits: response.outfits,
                actions: response.actions,
                trace: response.trace
            };

            setMessages((prev) => [...prev, aiMsg]);
            setTyping(false);
        }, 800);
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                style={{ background: "#171717", color: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
                title="AI Stylist (Ctrl+K)"
            >
                <MessageCircle size={20} />
            </button>
        );
    }

    return (
        <div className="chat-panel flex flex-col">
            <div className="flex items-center justify-between px-4 h-14 border-b border-neutral-200 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-brand-500" />
                    <span className="text-sm font-semibold">AI Stylist</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setDebug(!debug)}
                        className={`p-1.5 rounded transition-colors ${debug ? "bg-red-50 text-red-600" : "text-neutral-400 hover:text-neutral-700"}`}
                        title="Toggle Agent Debug Mode"
                    >
                        <Bug size={16} />
                    </button>
                    <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        <div
                            className="max-w-[85%] px-3 py-2 text-sm leading-relaxed"
                            style={{
                                borderRadius: "var(--radius-lg)",
                                background: msg.role === "user" ? "#171717" : "#f5f5f5",
                                color: msg.role === "user" ? "#fafafa" : "#171717",
                            }}
                        >
                            {msg.content}
                        </div>

                        {/* Debug Trace Panel */}
                        {debug && msg.trace && (
                            <div className="mt-2 w-full max-w-[90%] text-xs font-mono bg-neutral-900 text-green-400 p-2 rounded-md overflow-x-auto">
                                <p className="font-bold text-neutral-500 mb-1">AGENT TRACE</p>
                                <div className="space-y-1">
                                    <p><span className="text-neutral-400">Intent:</span> {msg.trace.intent} <span className="text-neutral-600">({msg.trace.confidence})</span></p>
                                    <p><span className="text-neutral-400">Params:</span> {JSON.stringify(msg.trace.parsedParams)}</p>
                                    <div className="border-t border-neutral-800 mt-1 pt-1">
                                        <p className="text-neutral-400">Rules Triggered:</p>
                                        <ul className="list-disc pl-3 text-neutral-300">
                                            {msg.trace.rulesTriggered.map((rule, idx) => (
                                                <li key={idx}>{rule}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {msg.outfits && msg.outfits.length > 0 && (
                            <div className="mt-2 w-full flex gap-2 overflow-x-auto pb-2 noscrollbar">
                                {msg.outfits.map((outfit, i) => (
                                    <div key={i} className="flex-shrink-0 w-32 p-2 bg-white border border-neutral-100 rounded-md shadow-sm">
                                        <div className="flex -space-x-2 mb-2 overflow-hidden px-1 pt-1">
                                            {outfit.items.slice(0, 3).map((item) => (
                                                <div key={item.id} className="relative w-8 h-8 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center overflow-hidden">
                                                    {item.imageUrl ? (
                                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Shirt size={12} className="text-neutral-400" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-2xs text-neutral-500 line-clamp-2 px-1 pb-1 leading-tight">{outfit.explanation}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {msg.actions && msg.actions.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {msg.actions.map((action) => (
                                    <button
                                        key={action.id}
                                        onClick={() => handleAction(action)}
                                        className={`px-3 py-1 text-xs font-medium border transition-colors ${action.primary
                                                ? "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800"
                                                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                                            }`}
                                        style={{ borderRadius: "999px" }}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {typing && (
                    <div className="flex justify-start">
                        <div className="px-3 py-2 bg-neutral-50 rounded-lg">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse delay-75" />
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse delay-150" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="px-4 py-3 border-t border-neutral-200 flex-shrink-0 bg-white">
                <div className="flex items-center gap-2">
                    <input
                        className="input-field flex-1 text-sm h-9"
                        placeholder="Ask for an outfit..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim()}
                        className="btn-primary px-3 h-9"
                    >
                        <Send size={14} />
                    </button>
                </div>
                <div className="mt-2 text-center">
                    <p className="text-2xs text-neutral-400">Style assistant, not medical advice.</p>
                </div>
            </div>
        </div>
    );
}
