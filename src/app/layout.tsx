import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ToastProvider } from "@/components/Toast";
import { StylistChat } from "@/components/StylistChat";

export const metadata: Metadata = {
    title: "GlamGenius — AI-Powered Outfit Recommendations",
    description:
        "Personalized outfit recommendations powered by your wardrobe, mood, and style preferences.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen">
                <ToastProvider>
                    <Navbar />
                    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </main>
                    <StylistChat />
                </ToastProvider>
            </body>
        </html>
    );
}
