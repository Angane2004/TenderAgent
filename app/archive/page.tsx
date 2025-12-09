"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Archive as ArchiveIcon, Search, Download, Calendar, Target, DollarSign, FileText } from "lucide-react"
import { RFP } from "@/types"
import { formatDate } from "@/lib/utils"
import { useRFPs } from "@/contexts/rfp-context"
import { formatINR } from "@/lib/currency"
import toast from "react-hot-toast"
import { Building2 } from "lucide-react"

export default function ArchivePage() {
    const { rfps } = useRFPs()
    const [archivedRfps, setArchivedRfps] = useState<RFP[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // In real app, "completed" RFPs that are past deadline would be archived
        const completed = rfps.filter(r => r.status === 'completed' || r.finalResponse?.status === 'submitted')
        setArchivedRfps(completed)
        setLoading(false)
    }, [rfps])

    const filteredRfps = archivedRfps.filter(rfp =>
        rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rfp.issuedBy.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const handleDownloadPDF = (rfp: RFP) => {
        const pdfContent = `
RFP RESPONSE ARCHIVE
====================
Tender: ${rfp.title}
Issued By: ${rfp.issuedBy}
Deadline: ${new Date(rfp.deadline).toLocaleDateString('en-IN')}
SUBMISSION DETAILS
------------------
Submitted: ${rfp.finalResponse?.generatedAt ? new Date(rfp.finalResponse.generatedAt).toLocaleString('en-IN') : 'N/A'}
Submission ID: ${rfp.finalResponse?.submissionId || 'N/A'}
FINANCIAL SUMMARY
-----------------
Total Value: ${formatINR((rfp.pricingStrategy?.totalValue || 0) * 83)}
Tender Alignment Score: ${rfp.fitScore}%
TECHNICAL SPECIFICATIONS
------------------------
${rfp.specifications ? JSON.stringify(rfp.specifications, null, 2) : 'N/A'}
    `

        const blob = new Blob([pdfContent], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Archive_${rfp.id}_${new Date().toISOString().split('T')[0]}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast.success('Archive downloaded successfully!')
    }

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
                    <div>
                        <h1 className="text-3xl font-bold">Archive</h1>
                        <p className="text-gray-600 mt-1">View and download completed RFP responses</p>
                    </div>

                    {/* Search */}
                    <Card className="border-2 border-black">
                        <CardContent className="p-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search archived RFPs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 border-2 border-black focus:ring-black focus:border-black"
                                />
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                Showing <span className="font-bold text-black">{filteredRfps.length}</span> archived RFPs
                            </div>
                        </CardContent>
                    </Card>

                    {/* Archive Statistics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <Card className="border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-white">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-purple-500 rounded-lg">
                                        <FileText className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-600 font-semibold">Total Archived</p>
                                        <p className="text-3xl font-bold text-purple-700">{archivedRfps.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-white">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-500 rounded-lg">
                                        <DollarSign className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-600 font-semibold">Total Value</p>
                                        <p className="text-2xl font-bold text-blue-700">
                                            {formatINR(archivedRfps.reduce((sum, r) => sum + ((r.pricingStrategy?.totalValue || 0)), 0), { compact: true })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-white">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-green-500 rounded-lg">
                                        <Target className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-green-600 font-semibold">Avg Alignment</p>
                                        <p className="text-3xl font-bold text-green-700">
                                            {archivedRfps.length > 0 ? Math.round(archivedRfps.reduce((sum, r) => sum + r.fitScore, 0) / archivedRfps.length) : 0}%
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Timeline View */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Submission Timeline
                        </h2>

                        {archivedRfps.map((rfp, index) => (
                            <div key={rfp.id} className="relative pl-10 pb-6 border-l-4 border-purple-300">
                                {/* Timeline dot */}
                                <div className="absolute left-[-14px] top-2 w-6 h-6 rounded-full bg-purple-500 border-4 border-white shadow-lg" />

                                {/* Card */}
                                <Card className="border-2 border-black hover:shadow-xl transition-all duration-300 bg-white">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Building2 className="h-5 w-5 text-gray-600" />
                                                    <h3 className="font-bold text-lg">{rfp.title}</h3>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{rfp.issuedBy}</p>
                                                <div className="flex gap-4 text-xs text-gray-500">
                                                    <span>📅 Archived: {formatDate(rfp.finalResponse?.generatedAt || rfp.deadline)}</span>
                                                    <span>💰 Value: {formatINR((rfp.pricingStrategy?.totalValue || 0), { compact: true })}</span>
                                                    <span>🎯 Score: {rfp.fitScore}%</span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDownloadPDF(rfp)}
                                                className="border-2 border-black hover:bg-black hover:text-white"
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {/* Archive List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredRfps.length === 0 ? (
                        <Card className="border-2 border-black">
                            <CardContent className="p-12 text-center">
                                <ArchiveIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No archived RFPs found</h3>
                                <p className="text-gray-600">Completed RFPs will appear here</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredRfps.map((rfp) => (
                                <Card key={rfp.id} className="border-2 border-black hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold mb-2">{rfp.title}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        Completed: {formatDate(rfp.deadline)}
                                                    </div>
                                                    <div>Issued by: {rfp.issuedBy}</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge variant="outline" className="border-black">
                                                        Fit Score: {rfp.fitScore}%
                                                    </Badge>
                                                    <Badge variant="outline" className="border-black">
                                                        {rfp.specifications.quantity.toLocaleString()} meters
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    className="border-2 border-black hover:bg-black hover:text-white"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download PDF
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
