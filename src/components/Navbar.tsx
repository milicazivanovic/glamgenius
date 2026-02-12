"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Sparkles, ShoppingBag, Calendar, LayoutGrid, Info } from "lucide-react";

const NAV_ITEMS = [
    { href: "/generate", label: "Generate", icon: Sparkles },
    { href: "/outfits", label: "Outfits", icon: LayoutGrid },
    { href: "/wardrobe", label: "Wardrobe", icon: ShoppingBag },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/about", label: "About", icon: Info },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-40" style={{ background: "#0a0a0a", borderBottom: "1px solid #262626" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    <Link href="/" className="text-white">
                        <Logo />
                    </Link>
                    <div className="flex items-center gap-1">
                        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                            const active = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors relative ${active
                                            ? "text-white"
                                            : "text-neutral-400 hover:text-neutral-200"
                                        }`}
                                >
                                    <Icon size={15} strokeWidth={active ? 2 : 1.5} />
                                    <span className="hidden sm:inline">{label}</span>
                                    {active && (
                                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-500 rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
