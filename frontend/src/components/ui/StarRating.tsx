import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
    rating: number
    maxRating?: number
    size?: number
    readOnly?: boolean
    onChange?: (rating: number) => void
    className?: string
}

export function StarRating({
    rating,
    maxRating = 5,
    size = 14,
    readOnly = false,
    onChange,
    className,
}: StarRatingProps) {
    return (
        <div className={cn("flex items-center", className)}>
            {Array.from({ length: maxRating }).map((_, i) => (
                <Star
                    key={i}
                    size={size}
                    className={cn(
                        "transition-all",
                        i < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-transparent text-muted-foreground/30",
                        !readOnly && "cursor-pointer hover:scale-110",
                        !readOnly && i < rating && "hover:fill-yellow-500"
                    )}
                    onClick={() => !readOnly && onChange?.(i + 1)}
                />
            ))}
        </div>
    )
}
