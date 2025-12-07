"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedTabsProps {
    tabs: string[]
    activeTab: string
    onTabChange: (tab: string) => void
    className?: string
}

export function AnimatedTabs({ tabs, activeTab, onTabChange, className }: AnimatedTabsProps) {
    return (
        <div className={cn("relative inline-flex bg-white rounded-lg p-1 border border-gray-300", className)}>
            {/* Tab buttons */}
            {tabs.map((tab, _index) => {
                const isActive = activeTab === tab

                return (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className="relative px-6 py-2 text-sm font-semibold whitespace-nowrap rounded-md"
                    >
                        {/* Individual sliding background for active tab */}
                        {isActive && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-black rounded-md"
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 35
                                }}
                            />
                        )}

                        {/* Text */}
                        <span className={cn(
                            "relative z-10 transition-colors duration-200",
                            isActive ? "text-white" : "text-gray-700 hover:text-gray-900"
                        )}>
                            {tab}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}
