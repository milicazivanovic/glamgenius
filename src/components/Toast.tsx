"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

const ICONS: Record<ToastType, typeof CheckCircle2> = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
};

const COLORS: Record<ToastType, string> = {
    success: "#16a34a",
    error: "#dc2626",
    info: "#525252",
};

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => { } });

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = "success") => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((t) => {
                    const Icon = ICONS[t.type];
                    return (
                        <div
                            key={t.id}
                            className="flex items-center gap-2 px-4 py-3 text-sm font-medium animate-slide-up"
                            style={{
                                background: "#171717",
                                color: "#fafafa",
                                borderRadius: "var(--radius-md)",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                                minWidth: 280,
                            }}
                        >
                            <Icon size={16} color={COLORS[t.type]} />
                            <span className="flex-1">{t.message}</span>
                            <button onClick={() => removeToast(t.id)} className="text-neutral-400 hover:text-white">
                                <X size={14} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}
