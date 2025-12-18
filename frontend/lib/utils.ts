import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

export function getDaysUntil(date: Date | string): number {
    const target = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diff = target.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function calculateMatchPercentage(rfpSpecs: Record<string, string | number>, productSpecs: Record<string, string | number>): number {
    // Simple matching algorithm
    let matches = 0
    let total = 0

    const keys = ['voltage', 'size', 'conductor', 'insulation', 'armoring']

    keys.forEach(key => {
        if (rfpSpecs[key] && productSpecs[key]) {
            total++
            if (String(rfpSpecs[key]).toLowerCase() === String(productSpecs[key]).toLowerCase()) {
                matches++
            }
        }
    })

    return total > 0 ? Math.round((matches / total) * 100) : 0
}
