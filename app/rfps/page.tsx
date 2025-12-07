"use client"

import { useState, useMemo, useCallback } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { RFPCard } from "@/components/rfp/rfp-card"
import { Input } from "@/components/ui/input"
import { FilterButton, FilterOptions } from "@/components/ui/filter-button"
import { Search, FileText, TrendingUp, AlertCircle, Clock } from "lucide-react"
import { AnimatedTabs } from "@/components/ui/animated-tabs"
import { motion } from "framer-motion"
import { useRFPs } from "@/contexts/rfp-context"

export default function RFPsPage() {
    const { rfps, isScanning } = useRFPs()
    const [searchQuery, setSearchQuery] = useState("")
    const [activeFilter, setActiveFilter] = useState<string>("all")
    const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({
        fitScore: [],
        riskScore: [],
        urgency: [],
        certifications: []
    })

    // Memoized filtering logic
    const filteredRfps = useMemo(() => {
        return rfps.filter(rfp => {
            // Search filter
            const matchesSearch = !searchQuery ||
                rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                rfp.issuedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                rfp.summary.toLowerCase().includes(searchQuery.toLowerCase())

            // Status filter
            const matchesStatus = activeFilter === "all" || rfp.status === activeFilter

            // Fit Score filter
            let matchesFitScore = true
            if (advancedFilters.fitScore.length > 0) {
                matchesFitScore = advancedFilters.fitScore.some(filter => {
                    if (filter === 'excellent') return rfp.fitScore >= 85
                    if (filter === 'good') return rfp.fitScore >= 70 && rfp.fitScore < 85
                    if (filter === 'fair') return rfp.fitScore >= 50 && rfp.fitScore < 70
                    if (filter === 'low') return rfp.fitScore < 50
                    return false
                })
            }

            // Risk Score filter
            let matchesRiskScore = true
            if (advancedFilters.riskScore.length > 0) {
                matchesRiskScore = advancedFilters.riskScore.includes(rfp.riskScore)
            }

            // Urgency filter
            let matchesUrgency = true
            if (advancedFilters.urgency.length > 0) {
                const daysUntil = Math.ceil((new Date(rfp.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                matchesUrgency = advancedFilters.urgency.some(filter => {
                    if (filter === 'urgent') return daysUntil <= 7
                    if (filter === 'upcoming') return daysUntil > 7 && daysUntil <= 30
                    if (filter === 'future') return daysUntil > 30
                    return false
                })
            }

            // Certifications filter
            let matchesCertifications = true
            if (advancedFilters.certifications.length > 0) {
                matchesCertifications = advancedFilters.certifications.some(cert =>
                    rfp.certifications.some(rfpCert => rfpCert.includes(cert))
                )
            }

            return matchesSearch && matchesStatus && matchesFitScore && matchesRiskScore && matchesUrgency && matchesCertifications
        })
    }, [rfps, searchQuery, activeFilter, advancedFilters])

    const stats = useMemo(() => [
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
    ], [rfps])

    const handleFilterChange = useCallback((filters: FilterOptions) => {
        setAdvancedFilters(filters)
    }, [])

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }, [])

    const filters = [
        { label: "All", value: "all" },
        { label: "New", value: "new" },
        { label: "In Progress", value: "in-progress" },
        { label: "Completed", value: "completed" }
    ]

    const handleTabChange = useCallback((label: string) => {
        const filter = filters.find(f => f.label === label)
        if (filter) setActiveFilter(filter.value)
    }, [filters])

    return (
        <div className="flex h-screen bg-gradient-to-br from-purple-50 via-gray-50 to-blue-50 relative overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
                <div className="absolute top-40 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
            </div>

            <Sidebar />

            <div className="flex-1 flex flex-col h-screen">
                <Header />

                <main className="flex-1 overflow-y-auto p-6 space-y-6">
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
                                    <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${stat.color}`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white p-6 rounded-xl border-2 border-black">
                        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                            {/* Search */}
                            <div className="flex-1 min-w-[250px] relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search RFPs by title, issuer, or description..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="pl-10 border-2 border-black focus:ring-black focus:border-black"
                                />
                            </div>

                            {/* Filter Button */}
                            <FilterButton
                                onFilterChange={handleFilterChange}
                                activeFilters={advancedFilters}
                            />

                            {/* Animated Filter Tabs */}
                            <AnimatedTabs
                                tabs={filters.map(f => f.label)}
                                activeTab={filters.find(f => f.value === activeFilter)?.label || "All"}
                                onTabChange={handleTabChange}
                            />
                        </div>

                        {/* Results Count */}
                        <div className="mt-4 text-sm text-gray-600">
                            Showing <span className="font-bold text-black">{filteredRfps.length}</span> of {rfps.length} RFPs
                        </div>
                    </div>

                    {/* RFPs Grid */}
                    {isScanning ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : rfps.length === 0 ? (
                        <div className="bg-white p-12 rounded-xl border-2 border-black text-center">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No RFPs Yet</h3>
                            <p className="text-gray-600">RFPs will appear here after scanning from the Dashboard</p>
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
