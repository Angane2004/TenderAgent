"use client"

import { Bell, Search, Building2, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { useUser } from "@/contexts/user-context"
import { NotificationModal } from "@/components/layout/notification-modal"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    formatNotificationTime,
    deleteNotification,
    type Notification
} from "@/lib/notification-storage"

interface HeaderProps {
    onSearch?: (query: string) => void
}

export function Header({ onSearch }: HeaderProps = {}) {
    const [notificationOpen, setNotificationOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editFormData, setEditFormData] = useState({
        companyName: "",
        industry: "",
        companySize: "",
        tenderPreferences: [] as string[]
    })
    const router = useRouter()
    const { profile, updateProfile } = useUser()
    const pathname = usePathname()
    const [showAllPreferences, setShowAllPreferences] = useState(false)
    const notificationRef = useRef<HTMLDivElement>(null)
    const companyInfoRef = useRef<HTMLDivElement>(null)

    // Notification modal state
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

    // Real-time notifications
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    // Load notifications on mount and listen for updates
    useEffect(() => {
        const loadNotifications = () => {
            setNotifications(getNotifications())
            setUnreadCount(getUnreadCount())
        }

        loadNotifications()

        // Listen for notification updates
        const handleNotificationsUpdate = () => {
            loadNotifications()
        }

        window.addEventListener('notificationsUpdated', handleNotificationsUpdate)

        return () => {
            window.removeEventListener('notificationsUpdated', handleNotificationsUpdate)
        }
    }, [])

    // Close notification panel when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setNotificationOpen(false)
            }
            if (companyInfoRef.current && !companyInfoRef.current.contains(event.target as Node)) {
                if (isEditMode) return // Don't close if editing
                setTooltipOpen(false)
            }
        }

        if (notificationOpen || tooltipOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [notificationOpen, tooltipOpen, isEditMode])

    // Don't show header on onboarding page
    if (pathname === '/onboarding') return null

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchQuery(query)
        onSearch?.(query)
    }

    const handleNotificationClick = (notification: Notification) => {
        if (notification.unread) {
            markAsRead(notification.id)
        }

        // If it's a submission notification, show modal
        if (notification.type === 'submission' && notification.metadata?.submissionDetails) {
            setSelectedNotification(notification)
            setModalOpen(true)
            setNotificationOpen(false)
        }
        // Otherwise navigate to RFP
        else if (notification.metadata?.rfpId) {
            router.push(`/rfp/${notification.metadata.rfpId}/details`)
            setNotificationOpen(false)
        }
    }

    const handleMarkAllAsRead = () => {
        markAllAsRead()
    }

    const handleDeleteNotification = (e: React.MouseEvent, notificationId: string) => {
        e.stopPropagation()
        deleteNotification(notificationId)
    }

    const industries = [
        "Electrical Infrastructure", "Civil Construction", "Renewable Energy",
        "IT & Software Services", "Industrial Machinery", "Consultancy Services",
        "Logistics & Supply Chain", "Healthcare & Medical", "Manufacturing",
        "Telecommunications", "Oil & Gas", "Mining & Minerals",
        "Water & Wastewater", "Transportation", "Defense & Aerospace",
        "Agriculture & Farming", "Education & Training", "Financial Services",
        "Real Estate & Property", "Hospitality & Tourism", "Retail & E-commerce",
        "Media & Entertainment", "Environmental Services", "Security Services",
        "Paint & Coatings"
    ]

    const companySizes = [
        "1-10 employees", "11-50 employees", "51-200 employees",
        "201-500 employees", "501-1000 employees", "1000+ employees"
    ]

    const tenderCategories = [
        "Electrical Infrastructure", "Civil Construction", "Renewable Energy",
        "IT & Software Services", "Industrial Machinery", "Consultancy Services",
        "Logistics & Supply Chain", "Healthcare & Medical", "Manufacturing Equipment",
        "Telecommunications", "Oil & Gas Equipment", "Mining Equipment",
        "Water Treatment", "Transportation & Vehicles", "Defense Equipment",
        "Agricultural Equipment", "Educational Supplies", "Office Supplies",
        "Security Systems", "Environmental Solutions", "Paint & Coatings"
    ]

    const handleEditClick = () => {
        if (profile) {
            setEditFormData({
                companyName: profile.companyName || "",
                industry: profile.industry || "",
                companySize: profile.companySize || "",
                tenderPreferences: profile.tenderPreferences || []
            })
            setIsEditMode(true)
        }
    }

    const handleCancelEdit = () => {
        setIsEditMode(false)
        setShowAllPreferences(false)
        setTooltipOpen(false)
    }

    const handlePreferenceToggle = (category: string) => {
        setEditFormData(prev => {
            if (prev.tenderPreferences.includes(category)) {
                return { ...prev, tenderPreferences: prev.tenderPreferences.filter(c => c !== category) }
            } else {
                return { ...prev, tenderPreferences: [...prev.tenderPreferences, category] }
            }
        })
    }

    const handleSaveEdit = async () => {
        try {
            await updateProfile({
                companyName: editFormData.companyName,
                industry: editFormData.industry,
                companySize: editFormData.companySize,
                tenderPreferences: editFormData.tenderPreferences
            })
            setIsEditMode(false)
            setShowAllPreferences(false)
            setTooltipOpen(false)
        } catch (error) {
            console.error('Error updating profile:', error)
        }
    }

    return (
        <>
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Search RFPs..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-12 left-12">
                    {/* Company Info Display */}
                    {profile?.companyName && profile?.isOnboarded && (
                        <motion.div
                            ref={companyInfoRef}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="relative group"
                        >
                            {/* Main Company Card - Click to open */}
                            <div
                                className="hidden md:flex items-center gap-2 px-2 py-1.5 bg-gradient-to-r from-gray-50 to-white border border-gray-300 rounded-md hover:shadow-md hover:border-black transition-all duration-300 cursor-pointer max-w-[140px]"
                                onClick={() => setTooltipOpen(!tooltipOpen)}
                            >
                                <div className="w-7 h-7 bg-black rounded flex items-center justify-center flex-shrink-0">
                                    <Building2 className="w-4 h-4 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-900 truncate leading-tight">
                                        {profile.companyName}
                                    </p>
                                    {profile.industry && (
                                        <p className="text-[10px] text-gray-600 truncate leading-tight">
                                            {profile.industry.split(' ')[0]}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Tooltip - Click-based */}
                            {tooltipOpen && (
                                <div
                                    className="absolute top-full right-0 mt-4 w-96 bg-white border-2 border-black rounded-2xl shadow-2xl p-6 z-50 max-h-[600px] overflow-y-auto"
                                >
                                    {/* Tooltip Header with Close Button */}
                                    <div className="flex items-center justify-between mb-3 pb-3 border-b-2 border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-base text-gray-900">Company Profile</h4>
                                                <p className="text-xs text-gray-500">{isEditMode ? 'Edit your details' : 'Your details'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!isEditMode ? (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleEditClick}
                                                        className="border-2 border-black hover:bg-black hover:text-white text-xs h-8"
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setTooltipOpen(false)}
                                                        className="h-8 w-8 hover:bg-gray-100"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleCancelEdit}
                                                        className="border-2 border-gray-300 hover:bg-gray-100 text-xs h-8"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={handleSaveEdit}
                                                        className="bg-black text-white hover:bg-gray-800 text-xs h-8"
                                                    >
                                                        Save
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tooltip Content */}
                                    <div className="space-y-3">
                                        {isEditMode ? (
                                            <>
                                                {/* Edit Mode */}
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Company</label>
                                                        <Input
                                                            value={editFormData.companyName}
                                                            onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
                                                            className="h-9 text-sm"
                                                            placeholder="Company name"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Industry</label>
                                                        <Select value={editFormData.industry} onValueChange={(value) => setEditFormData({ ...editFormData, industry: value })}>
                                                            <SelectTrigger className="h-9 text-sm">
                                                                <SelectValue placeholder="Select industry" />
                                                            </SelectTrigger>
                                                            <SelectContent className="max-h-[200px]">
                                                                {industries.map((industry) => (
                                                                    <SelectItem key={industry} value={industry} className="text-sm">
                                                                        {industry}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Size</label>
                                                        <Select value={editFormData.companySize} onValueChange={(value) => setEditFormData({ ...editFormData, companySize: value })}>
                                                            <SelectTrigger className="h-9 text-sm">
                                                                <SelectValue placeholder="Select size" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {companySizes.map((size) => (
                                                                    <SelectItem key={size} value={size} className="text-sm">
                                                                        {size}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Tender Preferences</label>
                                                        <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto pr-1">
                                                            {tenderCategories.map((category) => (
                                                                <div
                                                                    key={category}
                                                                    onClick={() => handlePreferenceToggle(category)}
                                                                    className={`cursor-pointer p-2 rounded border text-xs transition-all ${editFormData.tenderPreferences.includes(category)
                                                                        ? 'border-black bg-black text-white'
                                                                        : 'border-gray-300 hover:border-black'
                                                                        }`}
                                                                >
                                                                    {category}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {/* View Mode */}
                                                <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                                    <span className="text-xs font-semibold text-gray-500 uppercase">Company</span>
                                                    <p className="text-sm font-bold text-gray-900">{profile.companyName}</p>
                                                </div>

                                                {profile.industry && (
                                                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase">Industry</span>
                                                        <p className="text-sm font-medium text-gray-900">{profile.industry}</p>
                                                    </div>
                                                )}

                                                {profile.companySize && (
                                                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase">Size</span>
                                                        <p className="text-sm font-medium text-gray-900">{profile.companySize}</p>
                                                    </div>
                                                )}

                                                {profile.tenderPreferences.length > 0 && (
                                                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Preferences</span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {(showAllPreferences ? profile.tenderPreferences : profile.tenderPreferences.slice(0, 2)).map((pref, idx) => (
                                                                <span key={idx} className="px-2 py-1 bg-black text-white text-xs rounded">
                                                                    {pref}
                                                                </span>
                                                            ))}
                                                            {profile.tenderPreferences.length > 2 && !showAllPreferences && (
                                                                <button
                                                                    onClick={() => setShowAllPreferences(true)}
                                                                    className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
                                                                >
                                                                    +{profile.tenderPreferences.length - 2} more
                                                                </button>
                                                            )}
                                                            {showAllPreferences && profile.tenderPreferences.length > 2 && (
                                                                <button
                                                                    onClick={() => setShowAllPreferences(false)}
                                                                    className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
                                                                >
                                                                    Show less
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative border-2 border-black hover:bg-black hover:text-white text-xs h-8"
                            onClick={() => setNotificationOpen(!notificationOpen)}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-2 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </Button>

                        <AnimatePresence>
                            {notificationOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-96 rounded-lg border-2 border-black bg-white shadow-2xl z-50 max-h-[500px] overflow-hidden flex flex-col"
                                >
                                    {/* Header */}
                                    <div className="p-4 border-b-2 border-black flex items-center justify-between">
                                        <h3 className="font-bold text-lg">Notifications</h3>
                                        {notifications.length > 0 && unreadCount > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleMarkAllAsRead}
                                                className="text-xs hover:bg-gray-100"
                                            >
                                                Mark all as read
                                            </Button>
                                        )}
                                    </div>

                                    {/* Notifications List */}
                                    <div className="overflow-y-auto flex-1 p-4">
                                        {notifications.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                                <p className="text-sm">No notifications yet</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => handleNotificationClick(notif)}
                                                        className={`rounded-lg border-2 p-3 cursor-pointer transition-all hover:shadow-md ${notif.unread
                                                            ? 'bg-blue-50 border-blue-500'
                                                            : 'bg-gray-50 border-gray-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <p className="text-sm font-bold">{notif.title}</p>
                                                                    {notif.unread && (
                                                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-gray-700 mb-2">{notif.message}</p>
                                                                {notif.metadata?.submissionDetails && (
                                                                    <div className="text-xs bg-white rounded p-2 mt-2 border border-gray-200">
                                                                        <p className="font-semibold">Submission Details:</p>
                                                                        <p className="text-gray-600">RFP: {notif.metadata.rfpTitle}</p>
                                                                    </div>
                                                                )}
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    {formatNotificationTime(notif.timestamp)}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={(e) => handleDeleteNotification(e, notif.id)}
                                                                className="p-1 hover:bg-red-100 rounded transition-colors"
                                                            >
                                                                <Trash2 className="h-3 w-3 text-gray-400 hover:text-red-500" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User Account */}
                    <UserButton
                        afterSignOutUrl="/sign-in"
                        userProfileMode="modal"
                        appearance={{
                            elements: {
                                avatarBox: "w-8 h-8 border-2 border-black",
                                userButtonPopoverCard: "border-2 border-black shadow-2xl",
                                userButtonPopoverActionButton: "hover:bg-gray-100"
                            }
                        }}
                    />
                </div>
            </header>

            {/* Notification Modal */}
            {
                selectedNotification && (
                    <NotificationModal
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(false)}
                        title={selectedNotification?.title || ""}
                        message={selectedNotification?.message || ""}
                        submissionId={selectedNotification?.metadata?.submissionDetails?.submissionId}
                    />
                )
            }
        </>
    )
}
