"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AgentCardProps {
    title: string
    description?: string
    status?: 'idle' | 'processing' | 'completed' | 'error'
    children: React.ReactNode
    className?: string
}

export function AgentCard({ title, description, status = 'idle', children, className }: AgentCardProps) {
    const statusColors = {
        idle: 'bg-gray-500',
        processing: 'bg-blue-500 animate-pulse',
        completed: 'bg-green-500',
        error: 'bg-red-500'
    }

    const statusLabels = {
        idle: 'Idle',
        processing: 'Processing',
        completed: 'Completed',
        error: 'Error'
    }

    return (
        <Card className={cn("border-2 hover:shadow-lg transition-shadow", className)}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-xl">{title}</CardTitle>
                        {description && <CardDescription className="mt-1">{description}</CardDescription>}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", statusColors[status])} />
                        <span className="text-xs font-medium text-muted-foreground">{statusLabels[status]}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}
