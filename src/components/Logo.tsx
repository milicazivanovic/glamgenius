export function Logo({ size = "default" }: { size?: "sm" | "default" }) {
    const h = size === "sm" ? 20 : 24;
    return (
        <div className="flex items-center gap-2">
            <svg width={h} height={h} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.5 8.5L21 9.5L16.5 14L17.5 21L12 17.5L6.5 21L7.5 14L3 9.5L9.5 8.5L12 2Z"
                    fill="#ff2d73" stroke="#ff2d73" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M12 6L13.2 9.2L16.5 9.7L14.1 12L14.7 15.3L12 13.7L9.3 15.3L9.9 12L7.5 9.7L10.8 9.2L12 6Z"
                    fill="white" fillOpacity="0.3" />
            </svg>
            <span className={`font-semibold tracking-tight ${size === "sm" ? "text-sm" : "text-base"}`}>
                GlamGenius
            </span>
        </div>
    );
}
