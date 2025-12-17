/**
 * RFP Matching Service
 * Centralized service for matching RFPs to user profiles
 */

export interface UserProfile {
    companyName: string
    industry?: string
    companySize?: string
    tenderPreferences: string[]
}

export interface RFPMatchResult {
    score: number
    reasons: string[]
    isMatch: boolean
}

/**
 * Map user industries to RFP categories
 */
export const INDUSTRY_TO_CATEGORIES: Record<string, string[]> = {
    "Electrical Infrastructure": ["Electrical", "Power Distribution", "Renewable Energy", "Energy"],
    "Civil Construction": ["Infrastructure", "Construction", "Road/Bridge", "Building"],
    "Renewable Energy": ["Renewable Energy", "Solar", "Wind", "Energy", "Electrical"],
    "IT & Software Services": ["IT", "Software", "Technology", "Digital"],
    "Industrial Machinery": ["Manufacturing", "Machinery", "Equipment", "Industrial"],
    "Consultancy Services": ["Consultancy", "Advisory", "Professional Services"],
    "Logistics & Supply Chain": ["Logistics", "Transport", "Supply Chain", "Warehousing"],
    "Healthcare & Medical": ["Healthcare", "Medical", "Hospital", "Pharmaceutical"],
    "Manufacturing": ["Manufacturing", "Production", "Industrial", "Equipment"],
    "Telecommunications": ["Telecom", "Communication", "Network", "IT"],
    "Oil & Gas": ["Oil & Gas", "Energy", "Petroleum", "Exploration"],
    "Mining & Minerals": ["Mining", "Minerals", "Extraction", "Resources"],
    "Water & Wastewater": ["Water", "Wastewater", "Treatment", "Infrastructure"],
    "Transportation": ["Transport", "Transportation", "Logistics", "Infrastructure"],
    "Defense & Aerospace": ["Defense", "Aerospace", "Security", "Military"],
    "Agriculture & Farming": ["Agriculture", "Farming", "Agri", "Food"],
    "Education & Training": ["Education", "Training", "Academic", "Learning"],
    "Financial Services": ["Finance", "Banking", "Insurance", "Financial"],
    "Real Estate & Property": ["Real Estate", "Property", "Construction", "Building"],
    "Hospitality & Tourism": ["Hospitality", "Tourism", "Hotel", "Travel"],
    "Retail & E-commerce": ["Retail", "E-commerce", "Shopping", "Consumer"],
    "Media & Entertainment": ["Media", "Entertainment", "Broadcasting", "Content"],
    "Environmental Services": ["Environment", "Green", "Sustainability", "Eco"],
    "Security Services": ["Security", "Safety", "Protection", "Surveillance"],
    "Paint & Coatings": ["Paint", "Coatings", "Paint & Coatings", "Painting", "Decorative", "Industrial Coating"]
}

/**
 * Map company sizes to estimated value ranges (in INR)
 */
export const COMPANY_SIZE_TO_VALUE_RANGE: Record<string, { min: number; max: number }> = {
    "1-10 employees": { min: 100000, max: 5000000 },
    "11-50 employees": { min: 500000, max: 20000000 },
    "51-200 employees": { min: 2000000, max: 50000000 },
    "201-500 employees": { min: 5000000, max: 100000000 },
    "501-1000 employees": { min: 10000000, max: 200000000 },
    "1000+ employees": { min: 20000000, max: 1000000000 }
}

/**
 * Check if RFP matches user's industry
 */
export function matchesIndustry(rfp: any, industry?: string): boolean {
    if (!industry) return false

    const categories = INDUSTRY_TO_CATEGORIES[industry] || []
    const rfpTitle = rfp.title?.toLowerCase() || ''
    const rfpSummary = rfp.summary?.toLowerCase() || ''
    const rfpIssuedBy = rfp.issuedBy?.toLowerCase() || ''

    return categories.some(category => {
        const cat = category.toLowerCase()
        return rfpTitle.includes(cat) ||
            rfpSummary.includes(cat) ||
            rfpIssuedBy.includes(cat)
    })
}

/**
 * Check if RFP matches user's tender preferences
 */
export function matchesPreferences(rfp: any, preferences: string[]): boolean {
    if (!preferences || preferences.length === 0) return false

    const rfpTitle = rfp.title?.toLowerCase() || ''
    const rfpSummary = rfp.summary?.toLowerCase() || ''

    return preferences.some(pref => {
        const preference = pref.toLowerCase()
        return rfpTitle.includes(preference) ||
            rfpSummary.includes(preference)
    })
}

/**
 * Check if RFP's estimated value matches company size
 */
export function matchesCompanySize(rfp: any, companySize?: string): boolean {
    if (!companySize || !rfp.estimatedValue) return true // No penalty if no data

    const range = COMPANY_SIZE_TO_VALUE_RANGE[companySize]
    if (!range) return true

    const value = rfp.estimatedValue

    // Accept values within range or up to 50% above max
    return value >= range.min && value <= range.max * 1.5
}

/**
 * Check if deadline is reasonable (not expired, not too far out)
 */
export function hasReasonableDeadline(rfp: any): boolean {
    if (!rfp.deadline) return true

    const deadline = new Date(rfp.deadline)
    const now = new Date()
    const daysUntilDeadline = Math.floor(
        (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )

    // Deadline should be 7-180 days away
    return daysUntilDeadline >= 7 && daysUntilDeadline <= 180
}

/**
 * Calculate comprehensive fit score for an RFP based on user profile
 */
export function calculateFitScore(rfp: any, profile: UserProfile): RFPMatchResult {
    let score = 50 // Base score
    const reasons: string[] = []

    // Industry match (+30 points)
    if (matchesIndustry(rfp, profile.industry)) {
        score += 30
        reasons.push(`Matches your industry: ${profile.industry}`)
    }

    // Preference match (+20 points)
    const matchingPrefs = profile.tenderPreferences.filter(pref => {
        const prefLower = pref.toLowerCase()
        const titleLower = rfp.title?.toLowerCase() || ''
        const summaryLower = rfp.summary?.toLowerCase() || ''
        return titleLower.includes(prefLower) || summaryLower.includes(prefLower)
    })

    if (matchingPrefs.length > 0) {
        score += 20
        reasons.push(`Matches preferences: ${matchingPrefs.slice(0, 2).join(', ')}`)
    }

    // Company size compatibility (+10 points)
    if (matchesCompanySize(rfp, profile.companySize)) {
        score += 10
        if (profile.companySize) {
            reasons.push('Suitable for your company size')
        }
    } else if (profile.companySize) {
        score -= 10 // Penalty for size mismatch
        reasons.push('May not match company size capacity')
    }

    // Deadline urgency (+10 points for good timing)
    if (hasReasonableDeadline(rfp)) {
        score += 10
        reasons.push('Good deadline timing')
    }

    // Additional scoring based on existing fitScore
    if (rfp.fitScore) {
        // Use existing fit score but cap its influence
        score += Math.min(10, (rfp.fitScore - 50) / 5)
    }

    const finalScore = Math.max(0, Math.min(100, score))

    return {
        score: finalScore,
        reasons,
        isMatch: finalScore >= 70 // Consider 70+ as a good match
    }
}

/**
 * Filter and sort RFPs by relevance to user profile
 */
export function filterRFPsByProfile(rfps: any[], profile: UserProfile, matchedOnly: boolean = false): any[] {
    const scoredRFPs = rfps.map(rfp => {
        const matchResult = calculateFitScore(rfp, profile)
        return {
            ...rfp,
            fitScore: matchResult.score,
            matchReasons: matchResult.reasons,
            isMatch: matchResult.isMatch
        }
    })

    // Filter if matchedOnly is true
    const filteredRFPs = matchedOnly
        ? scoredRFPs.filter(rfp => rfp.isMatch)
        : scoredRFPs

    // Sort by fit score (highest first)
    return filteredRFPs.sort((a, b) => b.fitScore - a.fitScore)
}

/**
 * Get project types relevant to user profile
 */
export function getRelevantProjectTypes(profile: UserProfile, allProjectTypes: any[]): any[] {
    const relevantCategories = new Set<string>()

    // Add categories from industry
    if (profile.industry) {
        const industryCategories = INDUSTRY_TO_CATEGORIES[profile.industry] || []
        industryCategories.forEach(cat => relevantCategories.add(cat.toLowerCase()))
    }

    // Add categories from preferences
    profile.tenderPreferences.forEach(pref => {
        relevantCategories.add(pref.toLowerCase())
    })

    // Filter project types
    const filtered = allProjectTypes.filter(project => {
        const category = project.category?.toLowerCase() || ''
        const title = project.title?.toLowerCase() || ''

        return Array.from(relevantCategories).some(relevantCat =>
            category.includes(relevantCat) ||
            title.includes(relevantCat) ||
            relevantCat.includes(category)
        )
    })

    // If we have relevant projects, return them; otherwise return all
    return filtered.length > 0 ? filtered : allProjectTypes
}
