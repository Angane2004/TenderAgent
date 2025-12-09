"use client"

import { useState, useEffect } from "react"
import { Bell, X, Check, CheckCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    formatNotificationTime,
    getUnreadCount,
    type Notification
} from "@/lib/notification-storage"
import { motion, AnimatePresence } from "framer-motion"

export function NotificationPopup() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    const loadNotifications = () => {
        const notifs = getNotifications()
        setNotifications(notifs)
        setUnreadCount(getUnreadCount())
    }

    useEffect(() => {
        loadNotifications()

        const handleNotificationsUpdated = () => {
            loadNotifications()
        }

        window.addEventListener('notificationsUpdated', handleNotificationsUpdated)
        return () => {
            window.removeEventListener('notificationsUpdated', handleNotificationsUpdated)
        }
    }, [])

    const handleMarkAsRead = (notificationId: string) => {
        markAsRead(notificationId)
        loadNotifications()
    }

    const handleMarkAllAsRead = () => {
        markAllAsRead()
        loadNotifications()
    }

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all notifications?')) {
            clearAllNotifications()
            loadNotifications()
        }
    }

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'submission':
                return '✅'
            case 'rfp_scanned':
                return '🔍'
            case 'deadline_warning':
                return '⚠️'
            default:
                return '📬'
        }
    }

    const getNotificationColor = (type: Notification['type']) => {
        switch (type) {
            case 'submission':
                return 'bg-green-50 border-green-200'
            case 'rfp_scanned':
                return 'bg-blue-50 border-blue-200'
            case 'deadline_warning':
                return 'bg-orange-50 border-orange-200'
            default:
                return 'bg-gray-50 border-gray-200'
        }
    }

    return (
        <div className="relative">
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                )}
            </button>

            {/* Notification Popup */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Popup Card */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-12 z-50 w-96 max-h-[500px] overflow-hidden"
                        >
                            <Card className="border-2 border-black shadow-2xl">
                                {/* Header */}
                                <div className="p-4 border-b-2 border-black bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-lg">Notifications</h3>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {notifications.length > 0 && (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleMarkAllAsRead}
                                                variant="outline"
                                                size="sm"
                                                className="text-xs h-7"
                                            >
                                                <CheckCheck className="h-3 w-3 mr-1" />
                                                Mark all read
                                            </Button>
                                            <Button
                                                onClick={handleClearAll}
                                                variant="outline"
                                                size="sm"
                                                className="text-xs h-7"
                                            >
                                                <X className="h-3 w-3 mr-1" />
                                                Clear all
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Notification List */}
                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">
                                            <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                            <p className="font-medium">No notifications</p>
                                            <p className="text-sm">You're all caught up!</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-200">
                                            {notifications.map((notification) => (
                                                <motion.div
                                                    key={notification.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${notification.unread ? 'bg-blue-50/30' : ''
                                                        }`}
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl ${getNotificationColor(notification.type)}`}>
                                                            {getNotificationIcon(notification.type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <p className={`font-semibold text-sm ${notification.unread ? 'text-black' : 'text-gray-600'
                                                                    }`}>
                                                                    {notification.title}
                                                                </p>
                                                                {notification.unread && (
                                                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-2">
                                                                {formatNotificationTime(notification.timestamp)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
