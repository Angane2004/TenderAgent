"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, DollarSign, Award } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

import { storage } from "@/lib/storage"
import GradientBackground from "@/components/background/gradient-background"
import { useState, useEffect } from "react"

export default function AnalyticsPage() {
    const [winRate, setWinRate] = useState("0%")
    const [revenue, setRevenue] = useState("$0")

    useEffect(() => {
        const updateAnalytics = () => {
            const rfps = storage.getRFPs()
            const completed = rfps.filter(r => r.status === 'completed' || r.finalResponse?.status === 'submitted')
            const totalValue = completed.reduce((acc, r) => acc + (r.pricingStrategy?.totalValue || 0), 0)

            setRevenue(`$${(totalValue / 1000).toFixed(1)}K`)
            setWinRate(completed.length > 0 ? "78%" : "0%") // Mock win rate for now
        }

        // Initial load
        updateAnalytics()

        // Listen for storage changes
        const handleStorageChange = () => {
            updateAnalytics()
        }

        window.addEventListener('storage', handleStorageChange)
        // Also listen for custom event when RFPs are updated
        window.addEventListener('rfpsUpdated', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('rfpsUpdated', handleStorageChange)
        }
    }, [])

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
        <div className="flex min-h-screen bg-gray-50 relative">
            <GradientBackground />
            <Sidebar />

            <div className="flex-1">
                <Header />

                <main className="p-6 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                        <p className="text-gray-600 mt-1">Track performance metrics and insights</p>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Win Rate", value: winRate, icon: Target, trend: "+5%", color: "bg-blue-500", iconColor: "text-blue-500" },
                            { label: "Avg Response Time", value: "2.3 hrs", icon: TrendingUp, trend: "-12%", color: "bg-green-500", iconColor: "text-green-500" },
                            { label: "Total Revenue", value: revenue, icon: DollarSign, trend: "+18%", color: "bg-yellow-500", iconColor: "text-yellow-500" },
                            { label: "Success Score", value: "92/100", icon: Award, trend: "+3%", color: "bg-purple-500", iconColor: "text-purple-500" }
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
                                    Key Insights
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <Target className="h-4 w-4 text-blue-600" />
                                        Top Performing Agent
                                    </h4>
                                    <p className="text-sm text-gray-600">Sales Agent with 95% accuracy rate</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                        Fastest Response
                                    </h4>
                                    <p className="text-sm text-gray-600">Average 2.3 hours per RFP</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <Award className="h-4 w-4 text-purple-600" />
                                        Win Rate Improvement
                                    </h4>
                                    <p className="text-sm text-gray-600">+17% increase over last quarter</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
