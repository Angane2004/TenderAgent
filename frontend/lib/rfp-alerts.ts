// Real-time RFP alert generator
import { addNotification } from './notification-storage'
import { DUMMY_RFPS } from '@/data/dummy-rfps'

const NEW_RFP_ALERTS_KEY = 'tenderai_new_rfp_alerts_enabled'
let rfpAlertInterval: NodeJS.Timeout | null = null

/**
 * Check if RFP alerts are enabled
 */
export function areRFPAlertsEnabled(): boolean {
    if (typeof window === 'undefined') return false
    try {
        const enabled = localStorage.getItem(NEW_RFP_ALERTS_KEY)
        return enabled === 'true'
    } catch {
        return false
    }
}

/**
 * Enable or disable RFP alerts
 */
export function setRFPAlertsEnabled(enabled: boolean): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(NEW_RFP_ALERTS_KEY, enabled ? 'true' : 'false')

        if (enabled) {
            startRFPAlerts()
        } else {
            stopRFPAlerts()
        }
    } catch (error) {
        console.error('Error setting RFP alerts:', error)
    }
}

/**
 * Generate a random RFP notification
 */
function generateRandomRFPNotification() {
    // Pick a random RFP from the dummy data
    const randomRFP = DUMMY_RFPS[Math.floor(Math.random() * DUMMY_RFPS.length)]

    // Add notification
    addNotification({
        type: 'rfp_scanned',
        title: 'New RFP Scanned',
        message: `New tender opportunity: ${randomRFP.title}`,
        metadata: {
            rfpId: randomRFP.id,
            rfpTitle: randomRFP.title
        }
    })
}

/**
 * Start generating random RFP notifications
 * Generates a notification every 30-90 seconds
 */
export function startRFPAlerts(): void {
    if (rfpAlertInterval) return // Already running

    const generateNextNotification = () => {
        generateRandomRFPNotification()

        // Schedule next notification between 30-90 seconds
        const nextInterval = 30000 + Math.random() * 60000 // 30-90 seconds
        rfpAlertInterval = setTimeout(generateNextNotification, nextInterval)
    }

    // Start first notification after 10 seconds
    rfpAlertInterval = setTimeout(generateNextNotification, 10000)
}

/**
 * Stop generating RFP notifications
 */
export function stopRFPAlerts(): void {
    if (rfpAlertInterval) {
        clearTimeout(rfpAlertInterval)
        rfpAlertInterval = null
    }
}

/**
 * Initialize RFP alerts based on saved settings
 */
export function initializeRFPAlerts(): void {
    if (areRFPAlertsEnabled()) {
        startRFPAlerts()
    }
}
