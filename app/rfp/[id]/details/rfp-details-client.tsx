"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedTabs } from "@/components/ui/animated-tabs"
import { ArrowLeft, FileText, Package, Calendar, Building2, Download, MapPin, Phone, Mail, User, CheckCircle2, XCircle } from "lucide-react"
import { RFP } from "@/types"
import Link from "next/link"
import { useRFPs } from "@/contexts/rfp-context"
import { generateTenderPDF } from "@/lib/tender-pdf-generator"

interface RFPDetailsClientProps {
    id: string
}

export default function RFPDetailsClient({ id }: RFPDetailsClientProps) {
    const router = useRouter()
    const { rfps } = useRFPs()
    const [rfp, setRfp] = useState<RFP | null>(null)
    const [loading, setLoading] = useState(true)
    const [downloading, setDownloading] = useState(false)
    const [activeTab, setActiveTab] = useState("Overview")

    useEffect(() => {
        const foundRfp = rfps.find(r => r.id === id)
        if (foundRfp) {
            setRfp(foundRfp)
        }
        setLoading(false)
    }, [id, rfps])

    const handleDownloadPDF = async () => {
        if (!rfp) return
        setDownloading(true)
        try {
            await generateTenderPDF(rfp)
        } catch (error) {
            console.error('PDF generation failed:', error)
        } finally {
            setDownloading(false)
        }
    }

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
                    <Link href="/dashboard">
                        <Button className="bg-black text-white hover:bg-gray-800">
                            Back to Dashboard
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
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard">
                            <Button variant="outline" className="border-2 border-black hover:bg-black hover:text-white">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <Button
                            onClick={handleDownloadPDF}
                            disabled={downloading}
                            className="bg-black text-white hover:bg-gray-800 border-2 border-black"
                        >
                            {downloading ? (
                                <>
                                    <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Generating PDF...
                                </>
                            ) : (
                                <>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download as PDF
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Header */}
                    <div className="bg-white p-6 rounded-xl border-2 border-black">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="border-gray-600 text-gray-600">
                                        {rfp.location?.city}, {rfp.location?.state}
                                    </Badge>
                                    <Badge className="bg-black text-white">
                                        Fit Score: {rfp.fitScore}%
                                    </Badge>
                                </div>
                                <h1 className="text-3xl font-bold mb-2">{rfp.title}</h1>
                                <p className="text-gray-600 mb-4">Issued by {rfp.issuedBy}</p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">Deadline: {new Date(rfp.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm font-semibold">₹{rfp.estimatedValue.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}

                    <AnimatedTabs
                        tabs={["Overview", "Tender Details", "Scope", "Technical", "Terms", "Documents", "Contact"]}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {/* Tab Content */}
                    <Card className="border-2 border-black">
                        <CardContent className="p-6">
                            {/* Overview Tab */}
                            {activeTab === "Overview" && (
                                <div className="space-y-6">
                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="h-5 w-5" />
                                                Summary
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-700 leading-relaxed">{rfp.summary}</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Building2 className="h-5 w-5" />
                                                Organization Details
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Issued By</p>
                                                    <p className="font-semibold">{rfp.issuedBy}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Location</p>
                                                    <p className="font-semibold">{rfp.location?.city}, {rfp.location?.state}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Estimated Value</p>
                                                    <p className="font-semibold text-green-600">₹{rfp.estimatedValue.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Deadline</p>
                                                    <p className="font-semibold">{new Date(rfp.deadline).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader>
                                            <CardTitle>Required Certifications</CardTitle>
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
                                </div>
                            )}

                            {/* Tender Details Tab */}
                            {activeTab === "Tender Details" && (
                                <div className="space-y-6">
                                    {/* Basic Details */}
                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader className="bg-gray-50">
                                            <CardTitle className="text-lg">Basic Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="grid grid-cols-2 divide-x divide-y border-t">
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Organisation Chain</p>
                                                    <p className="font-semibold text-sm">{rfp.issuedBy}</p>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Tender Reference Number</p>
                                                    <p className="font-semibold text-sm">{rfp.issuedBy.toUpperCase().slice(0, 3)}/PWD/{new Date().getFullYear()}/{rfp.id.slice(0, 6)}</p>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Tender ID</p>
                                                    <p className="font-semibold text-sm">{new Date().getFullYear()}_TID_{rfp.id.slice(0, 8).toUpperCase()}</p>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Withdrawal Allowed</p>
                                                    <p className="font-semibold text-sm">Yes</p>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Tender Type</p>
                                                    <p className="font-semibold text-sm">Open Tender</p>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Form Of Contract</p>
                                                    <p className="font-semibold text-sm">Percentage</p>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Tender Category</p>
                                                    <p className="font-semibold text-sm">Works</p>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">No. of Covers</p>
                                                    <p className="font-semibold text-sm">2</p>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Payment Mode</p>
                                                    <p className="font-semibold text-sm">Online</p>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Allow Two Stage Bidding</p>
                                                    <p className="font-semibold text-sm">No</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Covers Information */}
                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader className="bg-gray-50">
                                            <CardTitle className="text-lg">Covers Information, No. Of Covers - 2</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b bg-gray-100">
                                                        <th className="p-3 text-left text-xs font-semibold">Cover No</th>
                                                        <th className="p-3 text-left text-xs font-semibold">Cover Type</th>
                                                        <th className="p-3 text-left text-xs font-semibold">Description</th>
                                                        <th className="p-3 text-left text-xs font-semibold">Document Type</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="border-b">
                                                        <td className="p-3 text-sm">1</td>
                                                        <td className="p-3 text-sm">Fee/PreQual/Technical</td>
                                                        <td className="p-3 text-sm">Attach Scanned Copy of online Tender Fee and EMD receipt & mentioned documents</td>
                                                        <td className="p-3 text-sm">.pdf</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-3 text-sm">2</td>
                                                        <td className="p-3 text-sm">Finance</td>
                                                        <td className="p-3 text-sm">Commercial Bid</td>
                                                        <td className="p-3 text-sm">.xls</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </CardContent>
                                    </Card>

                                    {/* Fee Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Card className="border-2 border-black bg-white">
                                            <CardHeader className="bg-gray-50">
                                                <CardTitle className="text-base">Tender Fee Details [Total Fee in ₹ - 1,680]</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="divide-y">
                                                    <div className="p-3 flex justify-between">
                                                        <span className="text-sm text-gray-600">Tender Fee in ₹</span>
                                                        <span className="font-semibold text-sm">1,180</span>
                                                    </div>
                                                    <div className="p-3 flex justify-between">
                                                        <span className="text-sm text-gray-600">Processing Fee in ₹</span>
                                                        <span className="font-semibold text-sm">500</span>
                                                    </div>
                                                    <div className="p-3 flex justify-between">
                                                        <span className="text-sm text-gray-600">Fee Payable To</span>
                                                        <span className="font-semibold text-sm">Nil</span>
                                                    </div>
                                                    <div className="p-3 flex justify-between">
                                                        <span className="text-sm text-gray-600">Tender Fee Exemption Allowed</span>
                                                        <span className="font-semibold text-sm">No</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-2 border-black bg-white">
                                            <CardHeader className="bg-gray-50">
                                                <CardTitle className="text-base">EMD Fee Details</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="divide-y">
                                                    <div className="p-3 flex justify-between">
                                                        <span className="text-sm text-gray-600">EMD Amount in ₹</span>
                                                        <span className="font-semibold text-sm">{Math.round((rfp.estimatedValue || 0) * 0.01).toLocaleString()}</span>
                                                    </div>
                                                    <div className="p-3 flex justify-between">
                                                        <span className="text-sm text-gray-600">EMD Exemption Allowed</span>
                                                        <span className="font-semibold text-sm">No</span>
                                                    </div>
                                                    <div className="p-3 flex justify-between">
                                                        <span className="text-sm text-gray-600">EMD Fee Type</span>
                                                        <span className="font-semibold text-sm">fixed</span>
                                                    </div>
                                                    <div className="p-3 flex justify-between">
                                                        <span className="text-sm text-gray-600">EMD Percentage</span>
                                                        <span className="font-semibold text-sm">1%</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Work Item Details */}
                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader className="bg-gray-50">
                                            <CardTitle className="text-lg">Work Item Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="divide-y">
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Title</p>
                                                    <p className="font-semibold text-sm">{rfp.title}</p>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Work Description</p>
                                                    <p className="text-sm">{rfp.summary}</p>
                                                </div>
                                                <div className="grid grid-cols-3 divide-x">
                                                    <div className="p-3">
                                                        <p className="text-xs text-gray-600 mb-1">Tender Value in ₹</p>
                                                        <p className="font-semibold text-sm text-green-600">₹{(rfp.estimatedValue || 0).toLocaleString()}</p>
                                                    </div>
                                                    <div className="p-3">
                                                        <p className="text-xs text-gray-600 mb-1">Product Category</p>
                                                        <p className="font-semibold text-sm">Electrical Works - Cables</p>
                                                    </div>
                                                    <div className="p-3">
                                                        <p className="text-xs text-gray-600 mb-1">Contract Type</p>
                                                        <p className="font-semibold text-sm">Tender</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 divide-x">
                                                    <div className="p-3">
                                                        <p className="text-xs text-gray-600 mb-1">Bid Validity (Days)</p>
                                                        <p className="font-semibold text-sm">180</p>
                                                    </div>
                                                    <div className="p-3">
                                                        <p className="text-xs text-gray-600 mb-1">Period Of Work (Days)</p>
                                                        <p className="font-semibold text-sm">240</p>
                                                    </div>
                                                    <div className="p-3">
                                                        <p className="text-xs text-gray-600 mb-1">Location</p>
                                                        <p className="font-semibold text-sm">{rfp.location?.city}, {rfp.location?.state}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Critical Dates */}
                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader className="bg-gray-50">
                                            <CardTitle className="text-lg">Critical Dates</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="grid grid-cols-2 divide-x divide-y">
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Published Date</p>
                                                    <p className="font-semibold text-sm">{new Date(rfp.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Bid Opening Date</p>
                                                    <p className="font-semibold text-sm">{new Date(rfp.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Document Download Start Date</p>
                                                    <p className="font-semibold text-sm">{new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Document Download End Date</p>
                                                    <p className="font-semibold text-sm">{new Date(new Date(rfp.deadline).getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Bid Submission Start Date</p>
                                                    <p className="font-semibold text-sm">{new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-xs text-gray-600 mb-1">Bid Submission End Date</p>
                                                    <p className="font-semibold text-sm">{new Date(new Date(rfp.deadline).getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Tender Documents */}
                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader className="bg-gray-50">
                                            <CardTitle className="text-lg">Tender Documents</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold mb-2 text-sm">NIT Document</h4>
                                                    <table className="w-full border">
                                                        <thead>
                                                            <tr className="bg-gray-50 border-b">
                                                                <th className="p-2 text-left text-xs">S.No</th>
                                                                <th className="p-2 text-left text-xs">Document Name</th>
                                                                <th className="p-2 text-left text-xs">Description</th>
                                                                <th className="p-2 text-left text-xs">Size (KB)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr className="border-b">
                                                                <td className="p-2 text-sm">1</td>
                                                                <td className="p-2 text-sm text-blue-600">Tendernotice_1.pdf</td>
                                                                <td className="p-2 text-sm">Inviting ETender Notice for {rfp.title}</td>
                                                                <td className="p-2 text-sm">103.45</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2 text-sm">Work Item Documents</h4>
                                                    <table className="w-full border">
                                                        <thead>
                                                            <tr className="bg-gray-50 border-b">
                                                                <th className="p-2 text-left text-xs">S.No</th>
                                                                <th className="p-2 text-left text-xs">Document Type</th>
                                                                <th className="p-2 text-left text-xs">Document Name</th>
                                                                <th className="p-2 text-left text-xs">Description</th>
                                                                <th className="p-2 text-left text-xs">Size (KB)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr className="border-b">
                                                                <td className="p-2 text-sm">1</td>
                                                                <td className="p-2 text-sm">BOQ</td>
                                                                <td className="p-2 text-sm text-blue-600">BOQ_2170758.xls</td>
                                                                <td className="p-2 text-sm">Commercial Bid</td>
                                                                <td className="p-2 text-sm">333.00</td>
                                                            </tr>
                                                            <tr className="border-b">
                                                                <td className="p-2 text-sm">2</td>
                                                                <td className="p-2 text-sm">Other Document</td>
                                                                <td className="p-2 text-sm text-blue-600">SHB.pdf</td>
                                                                <td className="p-2 text-sm">Standard Bidding Document</td>
                                                                <td className="p-2 text-sm">49.68</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="p-2 text-sm">3</td>
                                                                <td className="p-2 text-sm">Tender Documents</td>
                                                                <td className="p-2 text-sm text-blue-600">MainTendDoc.pdf</td>
                                                                <td className="p-2 text-sm">Main Tender Documents</td>
                                                                <td className="p-2 text-sm">834.69</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Tender Inviting Authority */}
                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader className="bg-gray-50">
                                            <CardTitle className="text-lg">Tender Inviting Authority</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-xs text-gray-600">Name</p>
                                                    <p className="font-semibold text-sm">Commissioner, {rfp.issuedBy}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600">Address</p>
                                                    <p className="text-sm">{rfp.issuedBy}, {rfp.location?.city}, {rfp.location?.state}, India</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Scope Tab */}
                            {activeTab === "Scope" && (
                                <div className="space-y-6">
                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader>
                                            <CardTitle>Scope of Work</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-700 leading-relaxed mb-4">
                                                This tender involves the supply and installation of high-quality electrical cables and related infrastructure.
                                                The scope includes design, procurement, installation, testing, and commissioning of all electrical systems.
                                            </p>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <p>Supply of {rfp.specifications.quantity.toLocaleString()} meters of {rfp.specifications.voltage} cables</p>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <p>Installation and termination of all cables as per specifications</p>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <p>Complete testing and commissioning with test certificates</p>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <p>Warranty period: {rfp.deliveryTimeline}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader>
                                            <CardTitle>Deliverables</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 list-disc list-inside text-gray-700">
                                                <li>Complete cable supply documentation and material certificates</li>
                                                <li>Installation drawings and as-built documentation</li>
                                                <li>Testing reports and commissioning certificates</li>
                                                <li>Operation and maintenance manuals</li>
                                                <li>Warranty documentation</li>
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Technical Tab */}
                            {activeTab === "Technical" && (
                                <div className="space-y-6">
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
                                                    <p className="text-sm text-gray-600 mb-1">Voltage Rating</p>
                                                    <p className="font-semibold">{rfp.specifications.voltage}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Size</p>
                                                    <p className="font-semibold">{rfp.specifications.size}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Conductor Material</p>
                                                    <p className="font-semibold">{rfp.specifications.conductor}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Insulation Type</p>
                                                    <p className="font-semibold">{rfp.specifications.insulation}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Armoring</p>
                                                    <p className="font-semibold">{rfp.specifications.armoring}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Quantity</p>
                                                    <p className="font-semibold">{rfp.specifications.quantity.toLocaleString()} meters</p>
                                                </div>
                                                <div className="col-span-2 md:col-span-3">
                                                    <p className="text-sm text-gray-600 mb-1">Standards</p>
                                                    <p className="font-semibold">{rfp.specifications.standards?.join(', ') || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {rfp.technicalRequirements && rfp.technicalRequirements.length > 0 && (
                                        <Card className="border-2 border-black bg-white">
                                            <CardHeader>
                                                <CardTitle>Technical Requirements</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {rfp.technicalRequirements.map((req, idx) => (
                                                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                            {req.mandatory ? (
                                                                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                            ) : (
                                                                <XCircle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                            )}
                                                            <div className="flex-1">
                                                                <p className="text-gray-700">{req.description}</p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {req.mandatory ? 'Mandatory' : 'Optional'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader>
                                            <CardTitle>Testing Requirements</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {rfp.testingRequirements?.map((test, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                        <span className="text-gray-700">{test}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Terms Tab */}
                            {activeTab === "Terms" && (
                                <div className="space-y-6">
                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader>
                                            <CardTitle>Terms and Conditions</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold mb-2">Payment Terms</h4>
                                                    <p className="text-gray-700">Payment will be made in installments based on project milestones. Advance payment of 10% upon order confirmation, 40% upon delivery, 40% upon installation, and 10% upon successful commissioning.</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2">Delivery Timeline</h4>
                                                    <p className="text-gray-700">{rfp.deliveryTimeline}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2">Warranty</h4>
                                                    <p className="text-gray-700">Minimum 2 years comprehensive warranty from the date of commissioning.</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2">Penalties</h4>
                                                    <p className="text-gray-700">Liquidated damages of 0.5% per week of delay, subject to a maximum of 10% of the contract value.</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader>
                                            <CardTitle>Submission Requirements</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 list-disc list-inside text-gray-700">
                                                <li>Valid GST registration certificate</li>
                                                <li>PAN card copy</li>
                                                <li>Company registration documents</li>
                                                <li>Financial statements for last 3 years</li>
                                                <li>List of similar completed projects</li>
                                                <li>Manufacturing facility details (if applicable)</li>
                                                <li>Quality certifications ({rfp.certifications.join(', ')})</li>
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Documents Tab */}
                            {activeTab === "Documents" && (
                                <div className="space-y-6">
                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="h-5 w-5" />
                                                Required Documents
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div
                                                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors cursor-pointer"
                                                    onClick={() => {
                                                        const content = `TECHNICAL SPECIFICATIONS\n\n` +
                                                            `Tender: ${rfp.title}\n` +
                                                            `Issued by: ${rfp.issuedBy}\n\n` +
                                                            `SPECIFICATIONS:\n` +
                                                            `Voltage: ${rfp.specifications.voltage}\n` +
                                                            `Size: ${rfp.specifications.size}\n` +
                                                            `Conductor: ${rfp.specifications.conductor}\n` +
                                                            `Insulation: ${rfp.specifications.insulation}\n` +
                                                            `Armoring: ${rfp.specifications.armoring}\n` +
                                                            `Quantity: ${rfp.specifications.quantity} meters\n` +
                                                            `Standards: ${rfp.specifications.standards?.join(', ')}\n\n` +
                                                            `Delivery Timeline: ${rfp.deliveryTimeline}\n` +
                                                            `Testing Requirements: ${rfp.testingRequirements?.join(', ')}`

                                                        const blob = new Blob([content], { type: 'text/plain' })
                                                        const url = URL.createObjectURL(blob)
                                                        const a = document.createElement('a')
                                                        a.href = url
                                                        a.download = `Technical_Specifications_${rfp.id}.txt`
                                                        document.body.appendChild(a)
                                                        a.click()
                                                        document.body.removeChild(a)
                                                        URL.revokeObjectURL(url)
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <FileText className="h-8 w-8 text-gray-600" />
                                                            <div>
                                                                <p className="font-semibold">Technical Specifications.txt</p>
                                                                <p className="text-sm text-gray-600">Detailed specifications</p>
                                                            </div>
                                                        </div>
                                                        <Download className="h-5 w-5 text-gray-600" />
                                                    </div>
                                                </div>
                                                <div
                                                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors cursor-pointer"
                                                    onClick={handleDownloadPDF}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <FileText className="h-8 w-8 text-gray-600" />
                                                            <div>
                                                                <p className="font-semibold">Complete Tender Document.pdf</p>
                                                                <p className="text-sm text-gray-600">Full tender document with all details</p>
                                                            </div>
                                                        </div>
                                                        <Download className="h-5 w-5 text-gray-600" />
                                                    </div>
                                                </div>
                                                <div
                                                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors cursor-pointer"
                                                    onClick={() => {
                                                        const content = `TERMS AND CONDITIONS\n\n` +
                                                            `Tender: ${rfp.title}\n` +
                                                            `Issued by: ${rfp.issuedBy}\n` +
                                                            `Deadline: ${new Date(rfp.deadline).toLocaleDateString()}\n\n` +
                                                            `PAYMENT TERMS:\n` +
                                                            `Payment will be made in installments:\n` +
                                                            `- 10% advance upon order confirmation\n` +
                                                            `- 40% upon delivery\n` +
                                                            `- 40% upon installation\n` +
                                                            `- 10% upon successful commissioning\n\n` +
                                                            `DELIVERY TIMELINE: ${rfp.deliveryTimeline}\n\n` +
                                                            `WARRANTY: Minimum 2 years from commissioning date\n\n` +
                                                            `PENALTIES: 0.5% per week delay (max 10% of contract value)\n\n` +
                                                            `REQUIRED CERTIFICATIONS:\n${rfp.certifications.join('\n')}`

                                                        const blob = new Blob([content], { type: 'text/plain' })
                                                        const url = URL.createObjectURL(blob)
                                                        const a = document.createElement('a')
                                                        a.href = url
                                                        a.download = `Terms_and_Conditions_${rfp.id}.txt`
                                                        document.body.appendChild(a)
                                                        a.click()
                                                        document.body.removeChild(a)
                                                        URL.revokeObjectURL(url)
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <FileText className="h-8 w-8 text-gray-600" />
                                                            <div>
                                                                <p className="font-semibold">Terms and Conditions.txt</p>
                                                                <p className="text-sm text-gray-600">T&C Document with payment terms</p>
                                                            </div>
                                                        </div>
                                                        <Download className="h-5 w-5 text-gray-600" />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Contact Tab */}
                            {activeTab === "Contact" && (
                                <div className="space-y-6">
                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <User className="h-5 w-5" />
                                                Contact Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <Building2 className="h-5 w-5 text-gray-600 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Organization</p>
                                                        <p className="font-semibold">{rfp.issuedBy}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Address</p>
                                                        <p className="font-semibold">{rfp.location?.city}, {rfp.location?.state}, India</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Phone className="h-5 w-5 text-gray-600 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Phone</p>
                                                        <p className="font-semibold">+91-XXXX-XXXXXX</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Mail className="h-5 w-5 text-gray-600 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Email</p>
                                                        <p className="font-semibold">tenders@{rfp.issuedBy.toLowerCase().replace(/\s+/g, '')}.gov.in</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-2 border-black bg-white">
                                        <CardHeader>
                                            <CardTitle>Support Information</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-700 mb-4">
                                                For queries regarding this tender, please contact the tender office during business hours (10:00 AM - 5:00 PM, Monday to Friday).
                                            </p>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm font-semibold">Important Note:</p>
                                                <p className="text-sm text-gray-700 mt-1">
                                                    All communications must reference the tender ID and company name. Queries received after the clarification deadline will not be entertained.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Start RFP Response Button */}
                    <div className="mt-8">
                        <div className="bg-white rounded-lg border-2 border-black p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-xl">Ready to respond?</h3>
                                    <p className="text-sm text-gray-600 mt-1">Start the AI-powered RFP response workflow</p>
                                </div>
                                <Button
                                    onClick={() => {
                                        console.log('Navigating to sales agent with RFP ID:', id)
                                        router.push(`/rfp/${id}/sales-agent`)
                                    }}
                                    className="bg-black text-white hover:bg-gray-800 border-2 border-black text-lg px-8 py-6"
                                >
                                    Start RFP Response
                                    <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
