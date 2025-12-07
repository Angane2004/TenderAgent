"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, CheckCircle, XCircle, Clock, DollarSign, LayoutDashboard, LogOut, Shield } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import GradientBackground from "@/components/background/gradient-background"


interface SalesManager {
    id: string
    name: string
    email: string
    company: string
    status: "pending" | "approved" | "rejected"
    requestDate: string
    rfpsHandled: number
    revenue: number
}

interface CompanyRequest {
    id: string
    companyName: string
    industry: string
    contactPerson: string
    email: string
    status: "pending" | "approved" | "rejected"
    requestDate: string
}

export default function AdminPage() {
    const router = useRouter()

    const [salesManagers, setSalesManagers] = useState<SalesManager[]>([
        {
            id: "1",
            name: "John Doe",
            email: "john@company.com",
            company: "Tech Corp",
            status: "pending",
            requestDate: "2024-12-01",
            rfpsHandled: 0,
            revenue: 0
        },
        {
            id: "2",
            name: "Jane Smith",
            email: "jane@business.com",
            company: "Business Solutions",
            status: "approved",
            requestDate: "2024-11-28",
            rfpsHandled: 15,
            revenue: 125000
        }
    ])

    const [companyRequests, setCompanyRequests] = useState<CompanyRequest[]>([
        {
            id: "1",
            companyName: "New Tech Industries",
            industry: "Technology",
            contactPerson: "Mike Johnson",
            email: "mike@newtech.com",
            status: "pending",
            requestDate: "2024-12-02"
        }
    ])

    const handleManagerAction = (id: string, action: "approve" | "reject") => {
        setSalesManagers(prev => prev.map(manager =>
            manager.id === id ? { ...manager, status: action === "approve" ? "approved" : "rejected" } : manager
        ))
    }

    const handleCompanyAction = (id: string, action: "approve" | "reject") => {
        setCompanyRequests(prev => prev.map(company =>
            company.id === id ? { ...company, status: action === "approve" ? "approved" : "rejected" } : company
        ))
    }

    const stats = [
        { title: "Total Managers", value: salesManagers.length, icon: Users, color: "bg-blue-500" },
        { title: "Active Companies", value: companyRequests.filter(c => c.status === "approved").length, icon: Building2, color: "bg-green-500" },
        { title: "Pending Requests", value: salesManagers.filter(m => m.status === "pending").length + companyRequests.filter(c => c.status === "pending").length, icon: Clock, color: "bg-yellow-500" },
        { title: "Total Revenue", value: `$${(salesManagers.reduce((acc, m) => acc + m.revenue, 0) / 1000).toFixed(0)}K`, icon: DollarSign, color: "bg-purple-500" }
    ]

    return (
        <div className="flex min-h-screen bg-gray-50 relative">
            <GradientBackground />

            {/* Admin Sidebar - Fixed, Static, No Scroll */}
            <div className="fixed left-0 top-0 h-screen w-64 bg-black text-white border-r-2 border-gray-800 flex flex-col z-50">
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <Shield className="h-8 w-8" />
                        <div>
                            <h2 className="text-xl font-bold">Admin Panel</h2>
                            <p className="text-xs text-gray-400">TenderAgent</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4">
                    <Link href="/admin">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer mb-2">
                            <LayoutDashboard className="h-5 w-5" />
                            <span className="font-medium">Dashboard</span>
                        </div>
                    </Link>
                </nav>

                {/* Logout at Bottom */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors w-full text-left"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content - with left margin for fixed sidebar */}
            <div className="flex-1 ml-64">
                <Header />

                <main className="p-6 space-y-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                            <p className="text-gray-600 mt-1">Manage sales managers and company requests</p>
                        </div>
                        <Badge className="bg-black text-white px-4 py-2 text-sm">
                            Admin Access
                        </Badge>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="border-2 border-black hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                                                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                                            </div>
                                            <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                                <stat.icon className="h-7 w-7 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>


                    {/* Sales Managers */}
                    <Card className="border-2 border-black">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Sales Managers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {salesManagers.map((manager) => (
                                    <motion.div
                                        key={manager.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{manager.name}</h3>
                                            <p className="text-sm text-gray-600">{manager.email}</p>
                                            <p className="text-sm text-gray-500">{manager.company}</p>
                                            <p className="text-xs text-gray-400 mt-1">Requested: {manager.requestDate}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm font-medium">RFPs: {manager.rfpsHandled}</p>
                                                <p className="text-sm text-gray-600">K</p>
                                            </div>
                                            <Badge className={
                                                manager.status === "approved" ? "bg-green-500" :
                                                    manager.status === "rejected" ? "bg-red-500" :
                                                        "bg-yellow-500"
                                            }>
                                                {manager.status}
                                            </Badge>
                                            {manager.status === "pending" && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleManagerAction(manager.id, "approve")}
                                                        className="bg-green-500 hover:bg-green-600"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleManagerAction(manager.id, "reject")}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Company Requests */}
                    <Card className="border-2 border-black">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Company Requests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {companyRequests.map((company) => (
                                    <motion.div
                                        key={company.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{company.companyName}</h3>
                                            <p className="text-sm text-gray-600">{company.industry}</p>
                                            <p className="text-sm text-gray-500">{company.contactPerson} - {company.email}</p>
                                            <p className="text-xs text-gray-400 mt-1">Requested: {company.requestDate}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge className={
                                                company.status === "approved" ? "bg-green-500" :
                                                    company.status === "rejected" ? "bg-red-500" :
                                                        "bg-yellow-500"
                                            }>
                                                {company.status}
                                            </Badge>
                                            {company.status === "pending" && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleCompanyAction(company.id, "approve")}
                                                        className="bg-green-500 hover:bg-green-600"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleCompanyAction(company.id, "reject")}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}
