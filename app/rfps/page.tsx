"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { RFPCard } from "@/components/rfp/rfp-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, FileText, TrendingUp, AlertCircle, Clock } from "lucide-react"
import { RFP } from "@/types"
import { AnimatedTabs } from "@/components/ui/animated-tabs"
import { motion } from "framer-motion"

export default function RFPsPage() {
    const [rfps, setRfps] = useState<RFP[]>([])
    const [filteredRfps, setFilteredRfps] = useState<RFP[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [activeFilter, setActiveFilter] = useState<string>("all")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/data/rfps.json')
            .then(res => res.json())
            .then(data => {
                setRfps(data)
                setFilteredRfps(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    useEffect(() => {
        let filtered = rfps

        // Apply status filter
        if (activeFilter !== "all") {
            filtered = filtered.filter(rfp => rfp.status === activeFilter)
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(rfp =>
                rfp.title.toLowerCase().includes(query) ||
                rfp.issuedBy.toLowerCase().includes(query) ||
                rfp.summary.toLowerCase().includes(query)
            )
        }

        setFilteredRfps(filtered)
    }, [searchQuery, activeFilter, rfps])

    const stats = [
        {
            label: "Total RFPs",
            value: rfps.length,
            icon: FileText,
            color: "text-blue-600"
        },
        {
            label: "High Fit Score",
            value: rfps.filter(r => r.fitScore >= 80).length,
            icon: TrendingUp,
            color: "text-green-600"
        },
        {
            label: "High Risk",
            value: rfps.filter(r => r.riskScore === "high").length,
            icon: AlertCircle,
            color: "text-red-600"
        },
        {
            label: "Urgent",
            value: rfps.filter(r => {
                const daysLeft = Math.ceil((new Date(r.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                return daysLeft <= 7
            }).length,
            icon: Clock,
            color: "text-orange-600"
        }
    ]

    const filters = [
        { label: "All", value: "all" },
        { label: "New", value: "new" },
        { label: "In Progress", value: "in-progress" },
        { label: "Completed", value: "completed" }
    ]

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1">
                <Header />

                <main className="p-6 space-y-6">
                    {/* Page Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">All RFPs</h1>
                        <p className="text-slate-600 mt-1">Manage and track all your RFP submissions</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-xl border-2 border-black hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                                    </div>
                                    <div className={cn("w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center", stat.color)}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white p-6 rounded-xl border-2 border-black">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search RFPs by title, issuer, or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 border-2 border-black focus:ring-black focus:border-black"
                                />
                            </div>

                            {/* Animated Filter Tabs */}
                            <AnimatedTabs
                                tabs={filters.map(f => f.label)}
                                activeTab={filters.find(f => f.value === activeFilter)?.label || "All"}
                                onTabChange={(label) => {
                                    const filter = filters.find(f => f.label === label)
                                    if (filter) setActiveFilter(filter.value)
                                }}
                            />
                        </div>

                        {/* Results Count */}
                        <div className="mt-4 text-sm text-gray-600">
                            Showing <span className="font-bold text-black">{filteredRfps.length}</span> of {rfps.length} RFPs
                        </div>
                    </div>

                    {/* RFPs Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredRfps.length === 0 ? (
                        <div className="bg-white p-12 rounded-xl border-2 border-black text-center">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No RFPs found</h3>
                            <p className="text-gray-600">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredRfps.map((rfp, index) => (
                                <motion.div
                                    key={rfp.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <RFPCard rfp={rfp} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ')
}
