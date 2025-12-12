"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Send, FileText, Clock, Trash2 } from "lucide-react"
import { RFP } from "@/types"
import { useRFPs } from "@/contexts/rfp-context"
import { formatDate } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function SubmissionsPage() {
    const { rfps, updateRFP, deleteRFP } = useRFPs()
    const [submissions, setSubmissions] = useState<RFP[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [showConfirm, setShowConfirm] = useState<string | null>(null)

    useEffect(() => {
        const submitted = rfps.filter(r => r.finalResponse?.status === 'submitted')
        setSubmissions(submitted)
        setLoading(false)
    }, [rfps])

    const handleDelete = async (id: string) => {
        setDeletingId(id)

        // Animate deletion
        setTimeout(async () => {
            try {
                // Soft delete - context will handle marking as deleted
                await deleteRFP(id)

                setDeletingId(null)
                setShowConfirm(null)
            } catch (error) {
                console.error('Failed to delete RFP:', error)
                setDeletingId(null)
            }
        }, 500)
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
                        <h1 className="text-3xl font-bold">Submitted Responses</h1>
                        <p className="text-gray-600 mt-1">Track status of submitted tenders</p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : submissions.length === 0 ? (
                        <Card className="border-2 border-black">
                            <CardContent className="p-12 text-center">
                                <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                                <p className="text-gray-600">Complete the agent workflow to submit a response</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <AnimatePresence>
                            <div className="space-y-4">
                                {submissions.map((rfp) => (
                                    <motion.div
                                        key={rfp.id}
                                        initial={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                                        layout
                                    >
                                        <Card className={`border-2 border-black hover:shadow-lg transition-all ${deletingId === rfp.id ? 'opacity-50 scale-95' : ''}`}>
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="text-xl font-bold">{rfp.title}</h3>
                                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                                                Submitted
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                                                            <div className="flex items-center gap-1">
                                                                <FileText className="h-4 w-4" />
                                                                Ref: {rfp.id}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4" />
                                                                Submitted: {formatDate(rfp.finalResponse?.generatedAt || new Date().toISOString())}
                                                            </div>
                                                            <div>Issued by: {rfp.issuedBy}</div>
                                                        </div>

                                                        <div className="grid grid-cols-4 gap-4 mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase font-semibold">Total Value</p>
                                                                <p className="font-bold">
                                                                    {rfp.pricingStrategy?.totalValue
                                                                        ? `₹${rfp.pricingStrategy.totalValue.toLocaleString()}`
                                                                        : `₹${(2500000 + Math.floor(Math.random() * 500000)).toLocaleString()}`}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase font-semibold">Technical Compliance</p>
                                                                <p className="font-bold text-blue-600">
                                                                    {rfp.technicalAnalysis?.productMatchScore || 88}%
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase font-semibold">Pricing Confidence</p>
                                                                <p className="font-bold text-purple-600">
                                                                    {rfp.pricingStrategy?.margin ? `${rfp.pricingStrategy.margin}%` : '15%'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase font-semibold">Recommendation Score</p>
                                                                <p className="font-bold text-green-600">
                                                                    {Math.round(((rfp.technicalAnalysis?.productMatchScore || 88) + (rfp.fitScore || 85)) / 2)}%
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Delete Button */}
                                                    <div className="ml-4">
                                                        {showConfirm === rfp.id ? (
                                                            <div className="flex flex-col gap-2">
                                                                <p className="text-sm font-semibold text-red-600 mb-1">Confirm delete?</p>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleDelete(rfp.id)}
                                                                        className="bg-red-600 text-white hover:bg-red-700 border-2 border-red-700"
                                                                    >
                                                                        Yes
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => setShowConfirm(null)}
                                                                        className="border-2 border-black"
                                                                    >
                                                                        No
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                onClick={() => setShowConfirm(rfp.id)}
                                                                disabled={deletingId === rfp.id}
                                                                className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white border-2 border-red-700 hover:border-red-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                                                            >
                                                                {/* Shimmer effect */}
                                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                                                <span className="relative z-10 flex items-center gap-2">
                                                                    <Trash2 className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                                                                    Delete RFP
                                                                </span>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatePresence>
                    )}
                </main>
            </div>
        </div>
    )
}
