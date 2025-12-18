"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const animatedButtonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
    {
        variants: {
            variant: {
                default:
                    "bg-black text-white shadow hover:bg-gray-800 active:scale-95",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-95",
                outline:
                    "border-2 border-black bg-white shadow-sm hover:bg-black hover:text-white active:scale-95",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:scale-95",
                ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface AnimatedButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof animatedButtonVariants> {
    asChild?: boolean
    loading?: boolean
    success?: boolean
    error?: boolean
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
    ({ className, variant, size, asChild = false, loading, success, error, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        const [isClicked, setIsClicked] = React.useState(false)

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!loading && !disabled) {
                setIsClicked(true)
                setTimeout(() => setIsClicked(false), 600)
                props.onClick?.(e)
            }
        }

        return (
            <Comp
                className={cn(animatedButtonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                onClick={handleClick}
                {...props}
            >
                {/* Shimmer effect on click */}
                {isClicked && !loading && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                        style={{
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 0.6s ease-out'
                        }}
                    />
                )}

                {/* Ripple effect */}
                {isClicked && !loading && (
                    <span
                        className="absolute inset-0 rounded-md opacity-0"
                        style={{
                            animation: 'ripple 0.6s ease-out',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                        }}
                    />
                )}

                {/* Loading spinner - Enhanced visibility */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-inherit">
                        <div className="relative">
                            {/* Outer ring */}
                            <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            {/* Pulsing background */}
                            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
                        </div>
                    </div>
                )}

                {/* Success checkmark animation */}
                {success && !loading && (
                    <svg
                        className="h-4 w-4 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ animation: 'scaleIn 0.3s ease-out' }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                )}

                {/* Error icon animation */}
                {error && !loading && (
                    <svg
                        className="h-4 w-4 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ animation: 'scaleIn 0.3s ease-out' }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}

                {/* Button content */}
                <span className={cn(
                    "relative z-10 transition-opacity duration-200",
                    loading && "opacity-0"
                )}>
                    {children}
                </span>
            </Comp>
        )
    }
)
AnimatedButton.displayName = "AnimatedButton"

export { AnimatedButton, animatedButtonVariants }
