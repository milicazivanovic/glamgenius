"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                        <AlertTriangle size={24} className="text-red-500" />
                    </div>
                    <h2 className="text-lg font-semibold mb-1">Something went wrong</h2>
                    <p className="text-sm text-neutral-500 mb-4 max-w-md">
                        {this.state.error?.message || "An unexpected error occurred."}
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="btn-secondary"
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
