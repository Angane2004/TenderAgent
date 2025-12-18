// Local storage management for notifications

export interface Notification {
    id: string
    type: 'submission' | 'rfp_scanned' | 'deadline_warning' | 'general'
    title: string
    message: string
    timestamp: number
    unread: boolean
    metadata?: {
        rfpId?: string
        rfpTitle?: string
        submissionDetails?: any
    }
}

const NOTIFICATIONS_KEY = 'tenderai_notifications'
const MAX_NOTIFICATIONS = 50

/**
 * Get all notifications for current user
 */
export function getNotifications(): Notification[] {
    if (typeof window === 'undefined') return []

    try {
        const data = localStorage.getItem(NOTIFICATIONS_KEY)
        return data ? JSON.parse(data) : []
    } catch (error) {
        console.error('Error reading notifications:', error)
        return []
    }
}

/**
 * Add a new notification
 */
export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'unread'>): Notification {
    const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        unread: true,
    }

    const notifications = getNotifications()
    notifications.unshift(newNotification)

    // Keep only the most recent notifications
    const trimmedNotifications = notifications.slice(0, MAX_NOTIFICATIONS)

    saveNotifications(trimmedNotifications)

    // Dispatch event to notify listeners
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('notificationsUpdated', {
            detail: { notification: newNotification }
        }))
    }

    return newNotification
}

/**
 * Mark notification as read
 */
export function markAsRead(notificationId: string): void {
    const notifications = getNotifications()
    const notification = notifications.find(n => n.id === notificationId)

    if (notification) {
        notification.unread = false
        saveNotifications(notifications)

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('notificationsUpdated'))
        }
    }
}

/**
 * Mark all notifications as read
 */
export function markAllAsRead(): void {
    const notifications = getNotifications()
    notifications.forEach(n => n.unread = false)
    saveNotifications(notifications)

    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('notificationsUpdated'))
    }
}

/**
 * Get unread notification count
 */
export function getUnreadCount(): number {
    return getNotifications().filter(n => n.unread).length
}

/**
 * Delete a notification
 */
export function deleteNotification(notificationId: string): void {
    const notifications = getNotifications().filter(n => n.id !== notificationId)
    saveNotifications(notifications)

    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('notificationsUpdated'))
    }
}

/**
 * Clear all notifications
 */
export function clearAllNotifications(): void {
    saveNotifications([])

    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('notificationsUpdated'))
    }
}

/**
 * Save notifications to localStorage
 */
function saveNotifications(notifications: Notification[]): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications))
    } catch (error) {
        console.error('Error saving notifications:', error)
    }
}

/**
 * Format notification time (e.g., "5 min ago", "2 hours ago")
 */
export function formatNotificationTime(timestamp: number): string {
    const now = Date.now()
    const diff = now - timestamp

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`

    return new Date(timestamp).toLocaleDateString()
}
