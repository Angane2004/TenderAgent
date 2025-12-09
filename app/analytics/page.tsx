"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, Award, IndianRupeeIcon } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

import { useRFPs } from "@/contexts/rfp-context"
import GradientBackground from "@/components/background/gradient-background"
import { useState, useEffect } from "react"
import { formatINR } from "@/lib/currency"


export default function AnalyticsPage() {
    const { rfps } = useRFPs()
    const [winRate, setWinRate] = useState("0%")
    const [alignmentScore, setAlignmentScore] = useState("0%")
    const [revenue, setRevenue] = useState("₹0")
    const [submissionCount, setSubmissionCount] = useState(0)
    const [avgValue, setAvgValue] = useState("₹0")

    useEffect(() => {
        const updateAnalytics = () => {
            const submitted = rfps.filter(r => r.finalResponse?.status === 'submitted')

            // Calculate total revenue in INR
            const totalValue = submitted.reduce((acc, r) => acc + (r.pricingStrategy?.totalValue || 0), 0)
            setRevenue(formatINR(totalValue, { compact: true }))

            // Calculate average tender alignment score
            if (submitted.length > 0) {
                const avgScore = submitted.reduce((acc, r) => acc + (r.fitScore || 0), 0) / submitted.length
                setAlignmentScore(`${Math.round(avgScore)}%`)

                // Average value per submission
                const avgVal = totalValue / submitted.length
                setAvgValue(formatINR(avgVal, { compact: true }))
            } else {
                setAlignmentScore("0%")
                setAvgValue("₹0")
            }

            setSubmissionCount(submitted.length)
        }
        updateAnalytics()
    }, [rfps])

    const winRateData = [
        { month: "Jan", rate: 65 },
        { month: "Feb", rate: 72 },
        { month: "Mar", rate: 68 },
        { month: "Apr", rate: 75 },
        { month: "May", rate: 78 },
        { month: "Jun", rate: 82 }
    ]

    const revenueData = [
        { month: "Jan", revenue: 45000 },
        { month: "Feb", revenue: 52000 },
        { month: "Mar", revenue: 48000 },
        { month: "Apr", revenue: 61000 },
        { month: "May", revenue: 55000 },
        { month: "Jun", revenue: 67000 }
    ]

    const agentPerformance = [
        { name: "Sales Agent", value: 95 },
        { name: "Technical Agent", value: 92 },
        { name: "Pricing Agent", value: 88 },
        { name: "Master Agent", value: 90 }
    ]

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']

    return (
        <div className="flex h-screen bg-gray-50 relative">
            <GradientBackground />
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen">
                <Header />

                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                        <p className="text-gray-600 mt-1">Track performance metrics and insights</p>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            // { label: "Win Rate", value: winRate, icon: Target, trend: "+5%", color: "bg-blue-500", iconColor: "text-blue-500" },
                            { label: "Avg Response Time", value: "2.3 hrs", icon: TrendingUp, trend: "-12%", color: "bg-green-500", iconColor: "text-green-500" },
                            { label: "Total Revenue", value: revenue, icon: IndianRupeeIcon, trend: "+18%", color: "bg-yellow-500", iconColor: "text-yellow-500" },
                            // { label: "Tender Alignment Score", value: alignmentScore, icon: Target, trend: "+5%", color: "bg-blue-500", iconColor: "text-blue-500" },
                            { label: "Total Submissions", value: submissionCount.toString(), icon: Award, trend: `+${submissionCount}`, color: "bg-purple-500", iconColor: "text-purple-500" },
                            { label: "Avg Deal Value", value: avgValue, icon: TrendingUp, trend: "+8%", color: "bg-orange-500", iconColor: "text-orange-500" },
                        ].map((kpi, i) => (
                            <Card key={i} className="border-2 border-black hover:shadow-lg transition-shadow bg-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">{kpi.label}</p>
                                            <p className="text-3xl font-bold mt-2">{kpi.value}</p>
                                            <p className={`text-sm mt-1 ${kpi.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                                {kpi.trend}
                                            </p>
                                        </div>
                                        <div className={`w-14 h-14 ${kpi.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                            <kpi.icon className="h-7 w-7 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-2 border-black bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    Win Rate Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={winRateData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="month" stroke="#000" />
                                        <YAxis stroke="#000" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '2px solid black',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="rate"
                                            stroke="#3B82F6"
                                            strokeWidth={3}
                                            dot={{ fill: '#3B82F6', r: 5 }}
                                            activeDot={{ r: 7 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-black bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    Revenue by Month
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="month" stroke="#000" />
                                        <YAxis stroke="#000" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '2px solid black',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-black bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    Agent Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={agentPerformance}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {agentPerformance.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '2px solid black',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    {agentPerformance.map((agent, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                            <span className="text-sm">{agent.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-black bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    Performance Analytics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {(() => {
                                    const submitted = rfps.filter((r: any) => r.finalResponse?.status === 'submitted')

                                    // Calculate response efficiency
                                    const avgResponseTime = submitted.length > 0
                                        ? Math.round(Math.random() * 24 + 12) // Simulated: 12-36 hours
                                        : 0

                                    // Calculate category performance
                                    const categoryRevenue: Record<string, number> = {}
                                    submitted.forEach((r: any) => {
                                        const category = r.specifications.voltage
                                        const value = r.pricingStrategy?.totalValue || 0
                                        categoryRevenue[category] = (categoryRevenue[category] || 0) + value
                                    })
                                    const topRevenueCategory = Object.entries(categoryRevenue)
                                        .sort((a, b) => b[1] - a[1])[0]

                                    // Calculate quality metrics
                                    const avgTechnicalScore = submitted.length > 0
                                        ? Math.round(submitted.reduce((acc: number, r: any) =>
                                            acc + (r.fitScore || 0), 0) / submitted.length)
                                        : 0

                                    // Calculate completion rate
                                    const completionRate = rfps.length > 0
                                        ? Math.round((submitted.length / rfps.length) * 100)
                                        : 0

                                    return (
                                        <>
                                            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                    <TrendingUp className="h-4 w-4 text-blue-600" />
                                                    Response Efficiency
                                                </h4>
                                                <div className="grid grid-cols-2 gap-3 mt-3">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Avg Response Time</p>
                                                        <p className="text-lg font-bold text-blue-700">
                                                            {avgResponseTime > 0 ? `${avgResponseTime} hrs` : 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Completion Rate</p>
                                                        <p className="text-lg font-bold text-blue-700">{completionRate}%</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                    <Award className="h-4 w-4 text-green-600" />
                                                    Category Performance
                                                </h4>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {topRevenueCategory
                                                        ? `Highest Revenue: ${topRevenueCategory[0]}`
                                                        : 'No data yet'}
                                                </p>
                                                {topRevenueCategory && (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                                                            <div
                                                                className="bg-green-600 h-full rounded-full"
                                                                style={{ width: '75%' }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-green-700">
                                                            {formatINR(topRevenueCategory[1], { compact: true })}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                    <Target className="h-4 w-4 text-purple-600" />
                                                    Quality Metrics
                                                </h4>
                                                <div className="grid grid-cols-2 gap-3 mt-3">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Technical Score</p>
                                                        <p className="text-lg font-bold text-purple-700">
                                                            {avgTechnicalScore > 0 ? `${avgTechnicalScore}%` : 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Submissions</p>
                                                        <p className="text-lg font-bold text-purple-700">{submissionCount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })()}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
