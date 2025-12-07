"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, TestTube, Package, Calendar, Building2 } from "lucide-react"
import { RFP } from "@/types"
import Link from "next/link"
import { useRFPs } from "@/contexts/rfp-context"

interface RFPDetailsClientProps {
    id: string
}

export default function RFPDetailsClient({ id }: RFPDetailsClientProps) {
    const router = useRouter()
    const { rfps } = useRFPs()
    const [rfp, setRfp] = useState<RFP | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const foundRfp = rfps.find(r => r.id === id)
        if (foundRfp) {
            setRfp(foundRfp)
        }
        setLoading(false)
    }, [id, rfps])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!rfp) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">RFP Not Found</h2>
                    <p className="text-gray-600 mb-4">The requested RFP could not be found.</p>
                    <Link href="/rfps">
                        <Button className="bg-black text-white hover:bg-gray-800">
                            Back to RFPs
                        </Button>
                    </Link>
                </div>
            </div>
        )
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
                    {/* Back Button */}
                    <Link href="/rfps">
                        <Button variant="outline" className="border-2 border-black hover:bg-black hover:text-white">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to RFPs
                        </Button>
                    </Link>

                    {/* Header */}
                    <div className="bg-white p-6 rounded-xl border-2 border-black">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2">{rfp.title}</h1>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        <span>{rfp.issuedBy}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Deadline: {new Date(rfp.deadline).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Badge
                                    variant="outline"
                                    className={`border-2 ${rfp.riskScore === 'low' ? 'border-green-600 text-green-600 bg-green-50' :
                                        rfp.riskScore === 'medium' ? 'border-yellow-600 text-yellow-600 bg-yellow-50' :
                                            'border-red-600 text-red-600 bg-red-50'
                                        }`}
                                >
                                    {rfp.riskScore.toUpperCase()} RISK
                                </Badge>
                                <Badge variant="outline" className="border-2 border-black">
                                    {rfp.fitScore}% Fit Score
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <Card className="border-2 border-black bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">{rfp.summary}</p>
                        </CardContent>
                    </Card>

                    {/* Specifications */}
                    <Card className="border-2 border-black bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Technical Specifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Voltage</p>
                                    <p className="font-semibold">{rfp.specifications.voltage}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Size</p>
                                    <p className="font-semibold">{rfp.specifications.size}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Conductor</p>
                                    <p className="font-semibold">{rfp.specifications.conductor}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Insulation</p>
                                    <p className="font-semibold">{rfp.specifications.insulation}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Armoring</p>
                                    <p className="font-semibold">{rfp.specifications.armoring}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Standard</p>
                                    <p className="font-semibold">{rfp.specifications.standard}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Quantity</p>
                                    <p className="font-semibold">{rfp.specifications.quantity.toLocaleString()} meters</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Testing Requirements */}
                    <Card className="border-2 border-black bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TestTube className="h-5 w-5" />
                                Testing Requirements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {rfp.testingRequirements.map((test, idx) => (
                                    <Badge key={idx} variant="outline" className="border-black">
                                        {test}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Certifications */}
                    <Card className="border-2 border-black bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Required Certifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {rfp.certifications.map((cert, idx) => (
                                    <Badge key={idx} variant="outline" className="border-black">
                                        {cert}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Delivery Timeline */}
                    <Card className="border-2 border-black bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Delivery Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">{rfp.deliveryTimeline}</p>
                        </CardContent>
                    </Card>

                    {/* Action Button */}
                    <div className="flex justify-end">
                        <Link href={`/rfp/${id}/sales-agent`}>
                            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg">
                                Start RFP Response
                            </Button>
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    )
}
