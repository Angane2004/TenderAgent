"use client"

import { Bell, Settings, User, LogOut, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface HeaderProps {
    onSearch?: (query: string) => void
}

export function Header({ onSearch }: HeaderProps = {}) {
    const [notificationOpen, setNotificationOpen] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchQuery(query)
        onSearch?.(query)
    }

    const notifications = [
        { id: 1, title: "New RFP Available", message: "11kV XLPE Cable tender from MSEB", time: "5 min ago", unread: true },
        { id: 2, title: "Response Submitted", message: "RFP-2024-001 successfully submitted", time: "1 hour ago", unread: true },
        { id: 3, title: "Win Probability Updated", message: "RFP-2024-003 now at 82% win rate", time: "2 hours ago", unread: false },
    ]

    return (
        <header className="h-16 border-b-2 border-black bg-white px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search RFPs, analytics, or settings..."
                        className="pl-10 border-2 border-black focus:ring-black focus:border-black"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                            setNotificationOpen(!notificationOpen)
                            setSettingsOpen(false)
                        }}
                        className="relative border-2 border-black hover:bg-black hover:text-white transition-colors"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                            {notifications.filter(n => n.unread).length}
                        </span>
                    </Button>

                    <AnimatePresence>
                        {notificationOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-80 bg-white border-2 border-black rounded-lg shadow-2xl overflow-hidden"
                            >
                                <div className="p-4 border-b-2 border-black bg-gray-50">
                                    <h3 className="font-bold">Notifications</h3>
                                    <p className="text-xs text-gray-600">{notifications.filter(n => n.unread).length} unread</p>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${notif.unread ? 'bg-blue-50' : ''
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-sm">{notif.title}</p>
                                                    <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                                                    <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                                                </div>
                                                {notif.unread && (
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t-2 border-black bg-gray-50 text-center">
                                    <button className="text-sm font-medium hover:underline">View All Notifications</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Settings */}
                <div className="relative">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                            setSettingsOpen(!settingsOpen)
                            setNotificationOpen(false)
                        }}
                        className="border-2 border-black hover:bg-black hover:text-white transition-colors"
                    >
                        <Settings className="h-5 w-5" />
                    </Button>

                    <AnimatePresence>
                        {settingsOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-72 bg-white border-2 border-black rounded-lg shadow-2xl overflow-hidden"
                            >
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                                            <User className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-base">Demo User</p>
                                            <p className="text-sm text-gray-600">manager@company.com</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="py-1">
                                    <Link href="/settings">
                                        <button className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center gap-3 border-b border-gray-100">
                                            <Settings className="h-5 w-5 text-gray-700" />
                                            <span className="text-base font-medium">Account Settings</span>
                                        </button>
                                    </Link>
                                    <button className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center gap-3 border-b border-gray-100">
                                        <Bell className="h-5 w-5 text-gray-700" />
                                        <span className="text-base font-medium">Preferences</span>
                                    </button>
                                    <Link href="/">
                                        <button className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center gap-3">
                                            <LogOut className="h-5 w-5 text-gray-700" />
                                            <span className="text-base font-medium">Logout</span>
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Click outside to close */}
            {(notificationOpen || settingsOpen) && (
                <div
                    className="fixed inset-0 z-20"
                    onClick={() => {
                        setNotificationOpen(false)
                        setSettingsOpen(false)
                    }}
                />
            )}
        </header>
    )
}
