export function Skeleton({ className = "", width, height }: { className?: string; width?: string; height?: string }) {
    return (
        <div
            className={`skeleton ${className}`}
            style={{ width: width || "100%", height: height || "16px" }}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="card p-4 space-y-3">
            <Skeleton height="140px" />
            <Skeleton width="60%" height="14px" />
            <Skeleton width="40%" height="12px" />
            <div className="flex gap-2">
                <Skeleton width="50px" height="20px" />
                <Skeleton width="50px" height="20px" />
            </div>
        </div>
    );
}

export function SkeletonOutfitCard() {
    return (
        <div className="card overflow-hidden">
            <div className="flex">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex-1 h-24">
                        <Skeleton height="100%" className="rounded-none" />
                    </div>
                ))}
            </div>
            <div className="p-4 space-y-3">
                <div className="flex gap-2">
                    <Skeleton width="60px" height="18px" />
                    <Skeleton width="60px" height="18px" />
                </div>
                <Skeleton height="12px" />
                <Skeleton width="80%" height="12px" />
            </div>
        </div>
    );
}
