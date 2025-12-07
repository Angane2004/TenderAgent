import { RFP } from '@/types'

// Get all submitted RFPs (for admin)
export async function getAllSubmittedRFPs(): Promise<Array<RFP & { userId: string, userName: string, userEmail: string }>> {
    // Always return empty array - Firebase disabled
    return []
}

// Save user profile
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveUserProfile(userId: string, profile: any) {
    // Always use localStorage
    if (typeof window !== 'undefined') {
        localStorage.setItem(`profile_${userId}`, JSON.stringify(profile))
    }
    return true
}

// Get user profile
export async function getUserProfile(userId: string) {
    // Always use localStorage
    if (typeof window !== 'undefined') {
        const profile = localStorage.getItem(`profile_${userId}`)
        return profile ? JSON.parse(profile) : null
    }
    return null
}

// Save user settings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveUserSettings(userId: string, settings: any) {
    // Always use localStorage
    if (typeof window !== 'undefined') {
        localStorage.setItem(`settings_${userId}`, JSON.stringify({
            ...settings,
            updatedAt: new Date().toISOString()
        }))
    }
    return true
}

// Get user settings
export async function getUserSettings(userId: string) {
    // Always use localStorage - Firebase completely disabled
    if (typeof window !== 'undefined') {
        const settings = localStorage.getItem(`settings_${userId}`)
        return settings ? JSON.parse(settings) : null
    }
    return null
}
