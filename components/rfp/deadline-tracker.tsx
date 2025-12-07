"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { getDaysUntil } from "@/lib/utils"

interface DeadlineTrackerProps {
    deadline: string
    title: string
}

export function DeadlineTracker({ deadline, title }: DeadlineTrackerProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime()
            const target = new Date(deadline).getTime()
            const difference = target - now

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                })
            }
        }

        calculateTimeLeft()
        const interval = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(interval)
    }, [deadline])

    const daysUntil = getDaysUntil(deadline)
    const isUrgent = daysUntil <= 7
    const isWarning = daysUntil <= 30 && daysUntil > 7

    return (
        <Card className={`border-2 ${isUrgent ? 'border-red-500 bg-red-50' : isWarning ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}`}>
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Clock className={`h-5 w-5 ${isUrgent ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-green-600'}`} />
                    <h4 className="font-semibold text-sm">{title}</h4>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${isUrgent ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-green-600'}`}>
                            {timeLeft.days}
                        </div>
                        <div className="text-xs text-muted-foreground">Days</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${isUrgent ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-green-600'}`}>
                            {timeLeft.hours}
                        </div>
                        <div className="text-xs text-muted-foreground">Hours</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${isUrgent ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-green-600'}`}>
                            {timeLeft.minutes}
                        </div>
                        <div className="text-xs text-muted-foreground">Mins</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${isUrgent ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-green-600'}`}>
                            {timeLeft.seconds}
                        </div>
                        <div className="text-xs text-muted-foreground">Secs</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
