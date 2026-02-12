import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                <Icon size={24} className="text-neutral-400" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900 mb-1">{title}</h3>
            <p className="text-sm text-neutral-500 max-w-sm mb-6">{description}</p>
            {action}
        </div>
    );
}
