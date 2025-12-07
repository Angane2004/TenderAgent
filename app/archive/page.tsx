"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Archive as ArchiveIcon, Search, Download, Calendar } from "lucide-react"
import { RFP } from "@/types"
import { formatDate } from "@/lib/utils"

import { storage } from "@/lib/storage"

export default function ArchivePage() {
    const [archivedRfps, setArchivedRfps] = useState<RFP[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const rfps = storage.getRFPs()
        const completed = rfps.filter(r => r.status === 'completed' || r.finalResponse?.status === 'submitted')
        setArchivedRfps(completed)
        setLoading(false)
    }, [])

    const filteredRfps = archivedRfps.filter(rfp =>
        rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rfp.issuedBy.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
