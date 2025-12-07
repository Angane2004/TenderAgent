"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { RFPCard } from "@/components/rfp/rfp-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedTabs } from "@/components/ui/animated-tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FilterButton, FilterOptions } from "@/components/ui/filter-button"
import { FileText, TrendingUp, Clock, CheckCircle2, Search } from "lucide-react"
import { motion } from "framer-motion"
import { useRFPs } from "@/contexts/rfp-context"

export default function DashboardPage() {
    const { rfps, isScanning, scanForRFPs } = useRFPs()
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({
        fitScore: [],
        riskScore: [],
        urgency: [],
        certifications: []
    })

    const handleScan = () => {
        scanForRFPs()
    }

    const filteredRfps = rfps.filter(rfp => {
        const matchesSearch = !searchQuery ||
            rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rfp.issuedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rfp.summary.toLowerCase().includes(searchQuery.toLowerCase())

        // Check actual status from storage fields
        let status = rfp.status
        if (rfp.finalResponse?.status === 'submitted') {
            status = 'completed'
        } else if (rfp.salesSummary?.status === 'completed') {
            status = 'in-progress'
        }

        const matchesFilter = filterStatus === 'all' || status === filterStatus

        // Advanced filters
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

        let matchesRiskScore = true
        if (advancedFilters.riskScore.length > 0) {
            matchesRiskScore = advancedFilters.riskScore.includes(rfp.riskScore)
        }

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

        let matchesCertifications = true
        if (advancedFilters.certifications.length > 0) {
            matchesCertifications = advancedFilters.certifications.some(cert =>
                rfp.certifications.some(rfpCert => rfpCert.includes(cert))
            )
        }

        return matchesSearch && matchesFilter && matchesFitScore && matchesRiskScore && matchesUrgency && matchesCertifications
    })

    const stats = [
        {
            title: "Total RFPs",
            value: rfps.length,
            icon: FileText,
            color: "text-blue-600",
            bgColor: "bg-blue-100"
        },
        {
            title: "High Fit Score",
            value: rfps.filter(r => r.fitScore >= 85).length,
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-100"
        },
        {
            title: "Urgent (< 7 days)",
            value: rfps.filter(r => {
                const days = Math.ceil((new Date(r.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                return days <= 7 && days > 0
            }).length,
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-100"
        },
        {
            title: "In Progress",
            value: rfps.filter(r => r.status === 'in-progress').length,
            icon: CheckCircle2,
            color: "text-purple-600",
            bgColor: "bg-purple-100"
        }
    ]

    return (
        <div className="flex h-screen bg-gradient-to-br from-purple-50 via-gray-50 to-blue-50 relative overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
                <div className="absolute top-40 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
            </div>

            <Sidebar />

            <div className="flex-1 flex flex-col h-screen relative z-10">
                <Header />

                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Sales Dashboard</h1>
                            <p className="text-slate-600 mt-1">Discover and respond to RFPs with AI assistance</p>
                        </div>
                        <Button
                            onClick={handleScan}
                            disabled={isScanning}
                            className="bg-black text-white hover:bg-gray-800 border-2 border-black relative overflow-hidden"
                        >
                            {isScanning ? (
                                <>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                    <Search className="h-4 w-4 mr-2 animate-pulse" />
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    <Search className="h-4 w-4 mr-2" />
                                    Scan for RFPs
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                                            <p className="text-3xl font-bold mt-2">{stat.value}</p>
                                        </div>
                                        <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Filters and Search */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Available RFPs</CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">{filteredRfps.length} RFPs</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 mb-6 flex-wrap">
                                <div className="flex-1 min-w-[250px] relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by title or issuer..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <FilterButton
                                    onFilterChange={setAdvancedFilters}
                                    activeFilters={advancedFilters}
                                />
                                <AnimatedTabs
                                    tabs={["All", "New", "In Progress", "Completed"]}
                                    activeTab={filterStatus === "all" ? "All" : filterStatus === "new" ? "New" : filterStatus === "in-progress" ? "In Progress" : "Completed"}
                                    onTabChange={(tab) => {
                                        const statusMap: Record<string, string> = {
                                            "All": "all",
                                            "New": "new",
                                            "In Progress": "in-progress",
                                            "Completed": "completed"
                                        }
                                        setFilterStatus(statusMap[tab] || "all")
                                    }}
                                />
                            </div>

                            {/* RFP Grid */}
                            {isScanning ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : filteredRfps.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No RFPs found matching your criteria</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {filteredRfps.map((rfp) => (
                                        <RFPCard key={rfp.id} rfp={rfp} />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}
