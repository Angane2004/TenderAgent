// Local storage management for analytics data

export interface AnalyticsData {
    totalSubmissions: number
    totalRevenue: number // in INR
    avgResponseTime: number // in days
    successRate: number // percentage
    submissionsByMonth: { month: string; count: number }[]
    revenueByMonth: { month: string; amount: number }[]
    lastUpdated: number
}

const ANALYTICS_KEY = 'tenderai_analytics'

/**
 * Get analytics data from localStorage
 */
export function getAnalytics(): AnalyticsData {
    if (typeof window === 'undefined') {
        return getDefaultAnalytics()
    }

    try {
        const data = localStorage.getItem(ANALYTICS_KEY)
        return data ? JSON.parse(data) : getDefaultAnalytics()
    } catch (error) {
        console.error('Error reading analytics:', error)
        return getDefaultAnalytics()
    }
}

/**
 * Save analytics data to localStorage
 */
export function saveAnalytics(analytics: AnalyticsData): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics))
        // Dispatch event to notify listeners
        window.dispatchEvent(new Event('analyticsUpdated'))
    } catch (error) {
        console.error('Error saving analytics:', error)
    }
}

/**
 * Update analytics when a new RFP is submitted
 */
export function recordSubmission(rfpValue: number, submissionDate: Date): void {
    const analytics = getAnalytics()

    analytics.totalSubmissions += 1
    analytics.totalRevenue += rfpValue

    // Update monthly data
    const monthKey = submissionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })

    // Update submissions by month
    const submissionMonth = analytics.submissionsByMonth.find(m => m.month === monthKey)
    if (submissionMonth) {
        submissionMonth.count += 1
    } else {
        analytics.submissionsByMonth.push({ month: monthKey, count: 1 })
    }

    // Update revenue by month
    const revenueMonth = analytics.revenueByMonth.find(m => m.month === monthKey)
    if (revenueMonth) {
        revenueMonth.amount += rfpValue
    } else {
        analytics.revenueByMonth.push({ month: monthKey, amount: rfpValue })
    }

    analytics.lastUpdated = Date.now()
    saveAnalytics(analytics)
}

/**
 * Calculate and update success rate
 */
export function updateSuccessRate(totalRfps: number, successfulRfps: number): void {
    const analytics = getAnalytics()
    analytics.successRate = totalRfps > 0 ? (successfulRfps / totalRfps) * 100 : 0
    analytics.lastUpdated = Date.now()
    saveAnalytics(analytics)
}

/**
 * Update average response time
 */
export function updateAvgResponseTime(avgDays: number): void {
    const analytics = getAnalytics()
    analytics.avgResponseTime = avgDays
    analytics.lastUpdated = Date.now()
    saveAnalytics(analytics)
}

/**
 * Reset analytics to default state
 */
export function resetAnalytics(): void {
    saveAnalytics(getDefaultAnalytics())
}

/**
 * Get default analytics data
 */
function getDefaultAnalytics(): AnalyticsData {
    return {
        totalSubmissions: 0,
        totalRevenue: 0,
        avgResponseTime: 0,
        successRate: 0,
        submissionsByMonth: [],
        revenueByMonth: [],
        lastUpdated: Date.now()
    }
}
