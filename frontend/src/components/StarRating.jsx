import { Star } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const StarRating = ({ value = 0, onChange, size = 16, className }) => {
    const [hover, setHover] = useState(0);
    const interactive = typeof onChange === "function";
    const display = interactive ? (hover || value) : value;

    return (
        <div className={cn("inline-flex items-center", className)} role={interactive ? "radiogroup" : undefined}>
            {[1, 2, 3, 4, 5].map((star) => {
                
                const fill = Math.max(0, Math.min(1, display - (star - 1)));
                return (
                    <button
                        key={star}
                        type="button"
                        disabled={!interactive}
                        onClick={interactive ? () => onChange(star) : undefined}
                        onMouseEnter={interactive ? () => setHover(star) : undefined}
                        onMouseLeave={interactive ? () => setHover(0) : undefined}
                        aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        className={cn(
                            "relative leading-none",
                            interactive && "cursor-pointer transition-transform hover:scale-110 px-0.5"
                        )}
                    >
                        {}
                        <Star size={size} className="text-muted-foreground/30" />
                        {}
                        <span
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${fill * 100}%` }}
                        >
                            <Star size={size} className="text-amber-400 fill-amber-400" />
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
