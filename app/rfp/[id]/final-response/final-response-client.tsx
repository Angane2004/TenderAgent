"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { LoadingButton } from "@/components/ui/loading-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Download, Send, CheckCircle, Edit, Save } from "lucide-react"
import { RFP } from "@/types"
import { useRFPs } from "@/contexts/rfp-context"
import jsPDF from "jspdf"
import toast from "react-hot-toast"
import { addNotification } from "@/lib/notification-storage"

interface FinalResponseClientProps {
    id: string
}

export default function FinalResponseClient({ id }: FinalResponseClientProps) {
    const router = useRouter()
    const { rfps, updateRFP } = useRFPs()
    const [rfp, setRfp] = useState<RFP | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isReturning, setIsReturning] = useState(false)

    // Editable fields
    const [isEditing, setIsEditing] = useState(false)
    const [editedTotalValue, setEditedTotalValue] = useState<string>("")
    const [editedPaymentTerms, setEditedPaymentTerms] = useState<string>("30 days net")
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    useEffect(() => {
        const foundRfp = rfps.find(r => r.id === id)
        if (foundRfp) {
            setRfp(foundRfp)
            // Initialize edited values from RFP or defaults
            const defaultValue = foundRfp.pricingStrategy?.totalValue || Math.random() * 500000 + 100000
            setEditedTotalValue(defaultValue.toFixed(0))
            // Load saved payment terms or use default
            setEditedPaymentTerms(foundRfp.pricingStrategy?.paymentTerms || "30 days net")

            if (foundRfp.finalResponse?.status === 'submitted') {
                setIsSubmitted(true)
            }
        }
    }, [id, rfps])

    const handleSaveEdits = () => {
        if (rfp) {
            const totalValue = parseFloat(editedTotalValue) || 0
            updateRFP(id, {
                pricingStrategy: {
                    ...rfp.pricingStrategy,
                    recommendedPrice: totalValue / (rfp.specifications?.quantity || 1),
                    margin: 15,
                    totalValue: totalValue,
                    riskLevel: rfp.riskScore,
                    status: 'completed',
                    paymentTerms: editedPaymentTerms
                }
            })
            setHasUnsavedChanges(false)
            setIsEditing(false)
            toast.success('Values saved successfully!')
        }
    }

    const generatePDF = () => {
        setIsGenerating(true)

        setTimeout(() => {
            const doc = new jsPDF()
            const totalValue = parseFloat(editedTotalValue) || 0

            // Header
            doc.setFontSize(20)
            doc.text("Tender Response Proposal", 20, 20)

            doc.setFontSize(12)
            doc.text(`Reference: ${rfp?.id}`, 20, 30)
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40)

            // Content
            doc.setFontSize(16)
            doc.text("Executive Summary", 20, 60)
            doc.setFontSize(12)
            doc.text(`Response to tender for ${rfp?.title}`, 20, 70)

            doc.text("Technical Compliance: Fully Compliant", 20, 90)
            doc.text(`Commercial Offer: INR ${totalValue.toLocaleString('en-IN')}`, 20, 100)
            doc.text(`Payment Terms: ${editedPaymentTerms}`, 20, 110)
            doc.text("Delivery Timeline: 90 Days", 20, 120)

            doc.save(`Tender_Response_${rfp?.id}.pdf`)
            setIsGenerating(false)
            toast.success('PDF downloaded successfully!')
        }, 1500)
    }

    const handleSubmit = () => {
        setIsSubmitting(true)

        setTimeout(() => {
            const submissionId = `SUB-${Math.floor(Math.random() * 10000)}`

            updateRFP(id, {
                status: 'completed',
                finalResponse: {
                    generatedAt: new Date().toISOString(),
                    submissionId: submissionId,
                    status: 'submitted'
                }
            })

            // Add notification
            addNotification({
                type: 'submission',
                title: 'Response Submitted Successfully',
                message: `Your response for "${rfp?.title}" has been submitted.`,
                metadata: {
                    rfpId: id,
                    rfpTitle: rfp?.title || '',
                    submissionDetails: {
                        submissionId: submissionId,
                        totalValue: editedTotalValue,
                        paymentTerms: editedPaymentTerms
                    }
                }
            })

            setIsSubmitted(true)
            setIsSubmitting(false)
            toast.success('Response submitted successfully!', {
                duration: 4000,
                icon: '✅',
            })
        }, 1500)
    }

    const handleReturn = () => {
        setIsReturning(true)
        setTimeout(() => {
            router.push('/dashboard')
        }, 500)
    }

    if (!rfp) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-gray-50 to-blue-50">
                <div className="h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const displayTotalValue = parseFloat(editedTotalValue) || 0

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
                        <h1 className="text-3xl font-bold">Final Response Generation</h1>
                        <p className="text-gray-600 mt-1">Review and submit response for: {rfp.title}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Preview Card */}
                        <Card className="border-2 border-black">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Response Preview
                                    </CardTitle>
                                    {!isEditing ? (
                                        <LoadingButton
                                            onClick={() => setIsEditing(true)}
                                            variant="outline"
                                            size="lg"
                                            className="border-2 border-black"
                                            disabled={isSubmitted}
                                        >
                                            <button className="flex items-center gap-2 px-4 py-2 rounded-md">
                                                <Edit className="h-6 w-6" />
                                                Edit Values
                                            </button>

                                        </LoadingButton>
                                    ) : (
                                        <LoadingButton
                                            onClick={handleSaveEdits}
                                            size="lg"
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <button className="flex items-center gap-2 px-4 py-2 rounded-md">
                                                <Save className="h-6 w-6" />
                                                Save
                                            </button>
                                        </LoadingButton>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditing && (
                                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200 mb-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="totalValue" className="font-semibold">Total Value (₹)</Label>
                                            <Input
                                                id="totalValue"
                                                type="number"
                                                value={editedTotalValue}
                                                onChange={(e) => {
                                                    setEditedTotalValue(e.target.value)
                                                    setHasUnsavedChanges(true)
                                                }}
                                                className="border-2 border-black"
                                                placeholder="Enter total value"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="paymentTerms" className="font-semibold">Payment Terms</Label>
                                            <Input
                                                id="paymentTerms"
                                                value={editedPaymentTerms}
                                                onChange={(e) => {
                                                    setEditedPaymentTerms(e.target.value)
                                                    setHasUnsavedChanges(true)
                                                }}
                                                className="border-2 border-black"
                                                placeholder="e.g., 30 days net"
                                            />
                                        </div>
                                        {hasUnsavedChanges && (
                                            <p className="text-sm text-orange-600 font-semibold">⚠ You have unsaved changes</p>
                                        )}
                                    </div>
                                )}

                                <div className="p-4 bg-gray-100 rounded-lg border border-gray-200 font-mono text-sm h-[400px] overflow-y-auto">
                                    <p className="font-bold mb-4">TENDER RESPONSE PROPOSAL</p>
                                    <p>Ref: {rfp.id}</p>
                                    <p>To: {rfp.issuedBy}</p>
                                    <br />
                                    <p className="font-bold">1. Executive Summary</p>
                                    <p>We are pleased to submit our proposal for the supply of {rfp.specifications.quantity}m of {rfp.specifications.size} cable...</p>
                                    <br />
                                    <p className="font-bold">2. Technical Compliance</p>
                                    <p>Our product fully complies with IS 7098 and IEC 60502 standards...</p>
                                    <br />
                                    <p className="font-bold">3. Commercial Offer</p>
                                    <p className={isEditing ? "text-blue-700 font-bold" : ""}>
                                        Total Value: ₹{displayTotalValue.toLocaleString('en-IN')}
                                        {isEditing && <span className="ml-2 text-xs">(EDITING)</span>}
                                    </p>
                                    <p className={isEditing ? "text-blue-700 font-bold" : ""}>
                                        Payment Terms: {editedPaymentTerms}
                                        {isEditing && <span className="ml-2 text-xs">(EDITING)</span>}
                                    </p>
                                    <br />
                                    <p className="font-bold">4. Delivery Schedule</p>
                                    <p>Material will be delivered within 90 days of PO...</p>
                                </div>

                                <LoadingButton
                                    onClick={generatePDF}
                                    loading={isGenerating}
                                    loadingText="Generating..."
                                    variant="outline"
                                    className="w-full border-2 border-black hover:bg-gray-100 h-12 text-base font-medium"
                                >
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-md">
                                        <Download className="mr-2 h-5 w-5" />
                                        Download PDF
                                    </button>
                                </LoadingButton>
                            </CardContent>
                        </Card>

                        {/* Submission Card */}
                        <Card className="border-2 border-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Send className="h-5 w-5" />
                                    Submission Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!isSubmitted ? (
                                    <div className="space-y-6">
                                        <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                                            <h4 className="font-semibold text-yellow-800 mb-2">Ready for Submission</h4>
                                            <p className="text-sm text-yellow-700">
                                                All internal approvals have been received. Please review the PDF before final submission.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                                <span className="text-sm font-medium">Sales Approval</span>
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                                <span className="text-sm font-medium">Technical Approval</span>
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                                <span className="text-sm font-medium">Finance Approval</span>
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
                                            </div>
                                        </div>

                                        <LoadingButton
                                            onClick={handleSubmit}
                                            loading={isSubmitting}
                                            loadingText="Submitting..."
                                            className="w-full bg-black text-white hover:bg-gray-800 h-12 text-lg"
                                        >
                                            Submit Response
                                        </LoadingButton>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full py-12 space-y-4">
                                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                            <CheckCircle className="h-8 w-8 text-green-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-center">Submission Successful!</h3>
                                        <p className="text-center text-gray-600">
                                            Your response has been submitted to the portal.<br />
                                            Reference ID: {rfp.finalResponse?.submissionId}
                                        </p>
                                        <LoadingButton
                                            onClick={handleReturn}
                                            loading={isReturning}
                                            loadingText="Returning..."
                                            variant="outline"
                                            className="mt-6 border-2 border-black"
                                        >
                                            Return to Dashboard
                                        </LoadingButton>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
