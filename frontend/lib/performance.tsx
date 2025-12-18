// Performance monitoring utility for tracking FPS
export class PerformanceMonitor {
    private frameTimes: number[] = []
    private lastTime: number = performance.now()
    private frameCount: number = 0

    constructor() {
        if (typeof window === 'undefined') return
        this.startMonitoring()
    }

    private startMonitoring() {
        const updateFPS = () => {
            const currentTime = performance.now()
            const delta = currentTime - this.lastTime
            this.lastTime = currentTime

            // Keep last 60 frame times
            this.frameTimes.push(delta)
            if (this.frameTimes.length > 60) {
                this.frameTimes.shift()
            }

            this.frameCount++
            requestAnimationFrame(updateFPS)
        }

        requestAnimationFrame(updateFPS)
    }

    public getCurrentFPS(): number {
        if (this.frameTimes.length === 0) return 0
        const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
        return Math.round(1000 / avgFrameTime)
    }

    public getAverageFrameTime(): number {
        if (this.frameTimes.length === 0) return 0
        return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
    }

    public isPerformanceLow(): boolean {
        return this.getCurrentFPS() < 60
    }
}

// Singleton instance
export const performanceMonitor = typeof window !== 'undefined' ? new PerformanceMonitor() : null

// Hook for React components
export function useFPSMonitor() {
    if (typeof window === 'undefined') return { fps: 0, isLow: false }

    const [fps, setFps] = React.useState(0)
    const [isLow, setIsLow] = React.useState(false)

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (performanceMonitor) {
                setFps(performanceMonitor.getCurrentFPS())
                setIsLow(performanceMonitor.isPerformanceLow())
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return { fps, isLow }
}

// Development-only FPS counter component
export function FPSCounter() {
    const { fps, isLow } = useFPSMonitor()

    if (process.env.NODE_ENV !== 'development') return null

    return (
        <div
            className="fixed bottom-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg font-mono text-xs z-50"
            style={{ backdropFilter: 'blur(10px)' }}
        >
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLow ? 'bg-red-500' : 'bg-green-500'}`} />
                <span>{fps} FPS</span>
            </div>
        </div>
    )
}

import React from 'react'
