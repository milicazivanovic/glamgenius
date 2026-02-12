import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: "#fff0f6",
                    100: "#ffe0ed",
                    200: "#ffc2db",
                    300: "#ff94bc",
                    400: "#ff5c95",
                    500: "#ff2d73",
                    600: "#e01160",
                    700: "#c20852",
                    800: "#a00a45",
                    900: "#810d3c",
                },
                neutral: {
                    50: "#fafafa",
                    100: "#f5f5f5",
                    150: "#ededed",
                    200: "#e5e5e5",
                    300: "#d4d4d4",
                    400: "#a3a3a3",
                    500: "#737373",
                    600: "#525252",
                    700: "#404040",
                    800: "#262626",
                    850: "#1a1a1a",
                    900: "#171717",
                    950: "#0a0a0a",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
            },
            fontSize: {
                "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
            },
            borderRadius: {
                DEFAULT: "6px",
            },
            animation: {
                "fade-in": "fadeIn 0.2s ease-out",
                "slide-up": "slideUp 0.25s ease-out",
                "slide-right": "slideRight 0.3s ease-out",
                "scale-in": "scaleIn 0.15s ease-out",
                "shimmer": "shimmer 1.5s infinite",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(8px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideRight: {
                    "0%": { opacity: "0", transform: "translateX(100%)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                scaleIn: {
                    "0%": { opacity: "0", transform: "scale(0.96)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
