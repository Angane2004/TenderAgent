"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ButtonProps } from "@/components/ui/button"

export interface LoadingButtonProps extends ButtonProps {
    loading?: boolean
    loadingText?: string
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
    ({ className, children, loading, loadingText, disabled, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                className={cn("relative", className)}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-md">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {loadingText && <span className="ml-2">{loadingText}</span>}
                    </div>
                )}
                <span className={cn(loading && "opacity-0")}>
                    {children}
                </span>
            </Button>
        )
    }
)

LoadingButton.displayName = "LoadingButton"

export { LoadingButton }
