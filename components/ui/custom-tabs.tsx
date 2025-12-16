import { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface CustomTab {
    value: string
    label: string
}

interface CustomTabsProps {
    tabs: CustomTab[]
    activeTab: string
    onTabChange: (value: string) => void
    children: ReactNode
}

export function CustomTabs({ tabs, activeTab, onTabChange, children }: CustomTabsProps) {
    return (
        <div className="w-full">
            {/* Tabs List */}
            <div className="border-2 border-black bg-white rounded-t-lg overflow-hidden">
                <div className="flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => onTabChange(tab.value)}
                            className={cn(
                                "flex-1 px-4 py-3 font-semibold border-r-2 border-black last:border-r-0 transition-all duration-300 relative overflow-hidden",
                                activeTab === tab.value
                                    ? "bg-black text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                            )}
                        >
                            {tab.label}
                            {activeTab === tab.value && (
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                                    layoutId="activeTab"
                                    transition={{ type: "spring", duration: 0.5 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {children}
            </div>
        </div>
    )
}

interface CustomTabContentProps {
    value: string
    activeTab: string
    children: ReactNode
}

export function CustomTabContent({ value, activeTab, children }: CustomTabContentProps) {
    if (value !== activeTab) return null

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {children}
        </motion.div>
    )
}
