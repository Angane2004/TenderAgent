// Currency formatting utilities for INR (Indian Rupees)

const USD_TO_INR_RATE = 83

/**
 * Convert USD to INR
 */
export function usdToInr(usdAmount: number): number {
    return usdAmount * USD_TO_INR_RATE
}

/**
 * Format number as INR currency with ₹ symbol
 * Uses Indian numbering system (lakhs, crores)
 */
export function formatINR(amount: number, options?: {
    compact?: boolean
    decimals?: number
}): string {
    const { compact = false, decimals = 0 } = options || {}

    if (compact) {
        // Use compact notation for large numbers
        if (amount >= 10000000) { // 1 crore
            return `₹${(amount / 10000000).toFixed(2)} Cr`
        } else if (amount >= 100000) { // 1 lakh
            return `₹${(amount / 100000).toFixed(2)} L`
        } else if (amount >= 1000) { // 1 thousand
            return `₹${(amount / 1000).toFixed(2)} K`
        }
    }

    // Format with Indian numbering system
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })

    return formatter.format(amount)
}

/**
 * Format USD amount as INR
 */
export function formatUSDAsINR(usdAmount: number, options?: {
    compact?: boolean
    decimals?: number
}): string {
    const inrAmount = usdToInr(usdAmount)
    return formatINR(inrAmount, options)
}

/**
 * Parse INR string to number (removes ₹ symbol and commas)
 */
export function parseINR(inrString: string): number {
    return parseFloat(inrString.replace(/[₹,]/g, ''))
}
