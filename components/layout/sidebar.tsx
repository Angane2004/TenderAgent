"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useUser, SignOutButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    FileText,
    BarChart3,
    Archive,
    Settings,
    Bot,
    ChevronLeft,
    ChevronRight,
    LogOut,
    CheckCircle2,
    CalendarCheck,
    Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { user } = useUser()
    const [collapsed, setCollapsed] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    useEffect(() => {
        setMounted(true)
        const savedState = localStorage.getItem('sidebar-collapsed')
        if (savedState) {
            setCollapsed(JSON.parse(savedState))
        }
    }, [])

    const toggleCollapse = () => {
        const newState = !collapsed
        setCollapsed(newState)
        localStorage.setItem('sidebar-collapsed', JSON.stringify(newState))
    }

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "text-blue-600" },
        { name: "RFPs", href: "/rfps", icon: FileText, color: "text-green-600" },
        { name: "Submissions", href: "/submissions", icon: CheckCircle2, color: "text-teal-600" },
        { name: "Calendar", href: "/calendar", icon: CalendarCheck, color: "text-red-600" },
        { name: "Analytics", href: "/analytics", icon: BarChart3, color: "text-purple-600" },
        { name: "Archive", href: "/archive", icon: Archive, color: "text-orange-600" },
        { name: "Settings", href: "/settings", icon: Settings, color: "text-gray-600" },
    ]

    if (!mounted) return null

    return (
        <>
            {/* Logout Animation Overlay */}
            <AnimatePresence>
                {isLoggingOut && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white z-50 flex items-center justify-center overflow-hidden"
                    >
                        {/* Animated Grid Background */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                        {/* Floating Particles */}
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-black rounded-full"
                                initial={{
                                    x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 500,
                                    y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 500,
                                    opacity: 0
                                }}
                                animate={{
                                    y: [null, -100],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2
                                }}
                            />
                        ))}

                        <div className="relative z-10 text-center">
                            {/* Static Bot Icon with Pulse */}
                            <motion.div className="relative w-40 h-40 mx-auto mb-8">
                                {/* Main Bot Circle */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        className="w-24 h-24 bg-black rounded-full flex items-center justify-center shadow-2xl"
                                        animate={{
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                        }}
                                    >
                                        <LogOut className="h-12 w-12 text-white" />
                                    </motion.div>
                                </div>

                                {/* Orbiting Data Nodes */}
                                {[0, 90, 180, 270].map((angle, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute top-1/2 left-1/2"
                                        style={{
                                            width: '160px',
                                            height: '160px',
                                            marginLeft: '-80px',
                                            marginTop: '-80px',
                                        }}
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "linear",
                                            delay: i * 0.25
                                        }}
                                    >
                                        <motion.div
                                            className="absolute w-3 h-3 bg-black rounded-full shadow-lg"
                                            style={{
                                                top: '0',
                                                left: '50%',
                                                transform: 'translateX(-50%)'
                                            }}
                                            animate={{
                                                scale: [1, 1.5, 1],
                                            }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                delay: i * 0.25
                                            }}
                                        />
                                    </motion.div>
                                ))}

                                {/* Pulse Rings */}
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={`ring-${i}`}
                                        className="absolute inset-0 border-2 border-black rounded-full"
                                        animate={{
                                            scale: [1, 2, 2],
                                            opacity: [0.5, 0.2, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.6,
                                        }}
                                    />
                                ))}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <p className="text-2xl font-bold mb-2">Logging out...</p>
                                <p className="text-gray-600">See you soon!</p>
                            </motion.div>

                            {/* Animated Loading Dots */}
                            <div className="flex justify-center gap-2 mt-6">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 bg-black rounded-full"
                                        animate={{
                                            y: [0, -10, 0],
                                        }}
                                        transition={{
                                            duration: 0.6,
                                            repeat: Infinity,
                                            delay: i * 0.2
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                className={cn(
                    "fixed left-0 top-0 h-screen bg-white border-r-2 border-black transition-all duration-300 z-40 flex flex-col",
                    collapsed ? "w-20" : "w-64"
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b-2 border-black flex-shrink-0">
                    {!collapsed && (
                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Bot className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-lg">TenderAgent</span>
                        </Link>
                    )}
                    {collapsed && (
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mx-auto">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                    )}
                </div>

                {/* Navigation - Scrollable with max height */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px - 140px)' }}>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-black text-white"
                                        : "hover:bg-gray-100 text-gray-700"
                                )}
                                title={collapsed ? item.name : undefined}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5 flex-shrink-0 transition-colors",
                                    collapsed && "mx-auto",
                                    !isActive && item.color
                                )} />
                                {!collapsed && (
                                    <span className="font-medium">{item.name}</span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Section - Fixed at bottom, always visible */}
                <div className="p-4 border-t-2 border-black space-y-2 bg-white flex-shrink-0">
                    {!collapsed && (
                        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-sm font-medium truncate">{user?.fullName || user?.firstName || "User"}</div>
                            <div className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress || "user@example.com"}</div>
                        </div>
                    )}
                    <SignOutButton>
                        <Button
                            onClick={() => setIsLoggingOut(true)}
                            variant="outline"
                            disabled={isLoggingOut}
                            className={cn(
                                "w-full border-2 border-black hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-70",
                                collapsed && "px-2"
                            )}
                        >
                            {isLoggingOut ? (
                                <>
                                    <Loader2 className={cn("h-4 w-4 animate-spin", !collapsed && "mr-2")} />
                                    {!collapsed && "Logging out..."}
                                </>
                            ) : (
                                <>
                                    <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
                                    {!collapsed && "Logout"}
                                </>
                            )}
                        </Button>
                    </SignOutButton>
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={toggleCollapse}
                    className="absolute -right-3 top-20 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </button>
            </div>

            {/* Spacer */}
            <div className={cn("transition-all duration-300", collapsed ? "w-20" : "w-64")} />
        </>
    )
}
