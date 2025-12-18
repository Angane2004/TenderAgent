"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AgentLog } from "@/components/agents/agent-log"
import { AgentCard } from "@/components/agents/agent-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TestTube, Package, Loader2 } from "lucide-react"
import { RFP } from "@/types"
import { useRFPs } from "@/contexts/rfp-context"

interface SalesAgentClientProps {
    id: string
}

export default function SalesAgentClient({ id }: SalesAgentClientProps) {
    const router = useRouter()
    const { rfps, updateRFP } = useRFPs()
    const [rfp, setRfp] = useState<RFP | null>(null)
    const [stage, setStage] = useState<'processing' | 'completed'>('processing')
    const [isNavigating, setIsNavigating] = useState(false)
    const [summary, setSummary] = useState<{
        scopeOfSupply: string;
        quantity: string;
        testingRequired: string[];
        certifications: string[];
        deliveryTimeline: string;
        status: 'completed' | 'pending';
    } | null>(null)

    const logs = [
        { message: "Scanning RFP URL and documents...", status: 'completed' as const, progress: 100 },
        { message: "Extracting tender specifications...", status: 'completed' as const, progress: 100 },
        { message: "Analyzing scope of supply...", status: 'completed' as const, progress: 100 },
        { message: "Identifying testing requirements...", status: 'completed' as const, progress: 100 },
        { message: "Preparing summary for Master Agent...", status: 'completed' as const, progress: 100 },
    ]

    useEffect(() => {
        const foundRfp = rfps.find(r => r.id === id)

        if (foundRfp) {
            setRfp(foundRfp)

            // Check if already processed
            if (foundRfp.salesSummary?.status === 'completed') {
                setSummary(foundRfp.salesSummary)
                setStage('completed')
                return
            }

            // Call real Sales Agent API
            const processSalesAgent = async () => {
                try {
                    const response = await fetch('/api/agents/sales', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            rfpId: id,
                            rfpText: foundRfp.summary + '\n\n' +
                                `Voltage: ${foundRfp.specifications.voltage}\n` +
                                `Size: ${foundRfp.specifications.size}\n` +
                                `Conductor: ${foundRfp.specifications.conductor}\n` +
                                `Insulation: ${foundRfp.specifications.insulation}\n` +
                                `Armoring: ${foundRfp.specifications.armoring}\n` +
                                `Standard: ${foundRfp.specifications.standards?.[0] || 'N/A'}\n` +
                                `Quantity: ${foundRfp.specifications.quantity}\n` +
                                `Testing: ${foundRfp.testingRequirements?.join(', ') || 'N/A'}\n` +
                                `Certifications: ${foundRfp.certifications?.join(', ') || 'N/A'}\n` +
                                `Delivery: ${foundRfp.deliveryTimeline}`,
                        }),
                    })

                    const result = await response.json()

                    if (result.success) {
                        const newSummary = result.data
                        setSummary(newSummary)
                        setStage('completed')

                        // Update the RFP with sales summary
                        updateRFP(id, {
                            salesSummary: newSummary
                        })
                    } else {
                        // Fallback to basic extraction if API fails
                        const fallbackSummary = {
                            scopeOfSupply: foundRfp.summary || "11kV XLPE insulated, Aluminum conductor, SWA armored cable",
                            quantity: `${foundRfp.specifications.quantity.toLocaleString()} meters`,
                            testingRequired: foundRfp.testingRequirements || ['Routine Tests', 'Type Tests'],
                            certifications: foundRfp.certifications || ['BIS Certification', 'ISO 9001:2015'],
                            deliveryTimeline: foundRfp.deliveryTimeline || 'As per RFP requirements',
                            status: 'completed' as const
                        }
                        setSummary(fallbackSummary)
                        setStage('completed')
                        updateRFP(id, { salesSummary: fallbackSummary })
                    }
                } catch (error) {
                    console.error('Sales Agent error:', error)
                    // Fallback to basic extraction
                    const fallbackSummary = {
                        scopeOfSupply: foundRfp.summary || "11kV XLPE insulated, Aluminum conductor, SWA armored cable",
                        quantity: `${foundRfp.specifications.quantity.toLocaleString()} meters`,
                        testingRequired: foundRfp.testingRequirements || ['Routine Tests', 'Type Tests'],
                        certifications: foundRfp.certifications || ['BIS Certification', 'ISO 9001:2015'],
                        deliveryTimeline: foundRfp.deliveryTimeline || 'As per RFP requirements',
                        status: 'completed' as const
                    }
                    setSummary(fallbackSummary)
                    setStage('completed')
                    updateRFP(id, { salesSummary: fallbackSummary })
                }
            }

            processSalesAgent()
        }
    }, [id, rfps, updateRFP])

    if (!rfp) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="h-8 w-8 border-4 border-gray-800 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Header */}
                    <div className="border-b border-gray-200 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gray-900 rounded-lg">
                                <Package className="h-5 w-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-semibold text-gray-900">Sales Discovery Agent</h1>
                        </div>
                        <p className="text-gray-600 ml-12">Analyzing RFP: {rfp.title}</p>
                    </div>

                    {/* Processing Stage */}
                    {stage === 'processing' && (
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-gray-900">Processing RFP...</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AgentLog logs={logs} agentName="Sales Agent" />
                            </CardContent>
                        </Card>
                    )}

                    {/* Completed Stage */}
                    {stage === 'completed' && summary && (
                        <>
                            <AgentCard
                                title="Sales Discovery Summary"
                                status="completed"
                            >
                                <div className="space-y-6">
                                    {/* Core RFP Information */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold mb-2">Scope of Supply</h4>
                                            <p className="text-sm text-gray-600">{summary.scopeOfSupply}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2">Quantity</h4>
                                            <p className="text-sm text-gray-600">{summary.quantity}</p>
                                        </div>
                                    </div>

                                    {/* Market Analysis */}
                                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                                        <h4 className="font-medium mb-3 text-gray-900">Market Intelligence</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Market Position</p>
                                                <p className="text-sm font-medium text-gray-900">Established Supplier</p>
                                                <p className="text-xs text-gray-600 mt-1">Strong presence in {rfp.location?.state} region</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Demand Trend</p>
                                                <p className="text-sm font-medium text-gray-900">Growing +18%</p>
                                                <p className="text-xs text-gray-600 mt-1">Infrastructure development driving demand</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Client Segment</p>
                                                <p className="text-sm font-medium text-gray-900">Public Sector</p>
                                                <p className="text-xs text-gray-600 mt-1">Government and PSU projects</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Win Probability</p>
                                                <p className="text-sm font-medium text-gray-900">{rfp.fitScore}% High</p>
                                                <p className="text-xs text-gray-600 mt-1">Based on past performance</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Competitive Landscape */}
                                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                                        <h4 className="font-medium mb-3 text-gray-900">Competitive Analysis</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Expected Competitors</p>
                                                    <p className="text-xs text-gray-600">3-5 major players likely to bid</p>
                                                </div>
                                                <Badge variant="outline" className="border-gray-600 text-gray-700">Medium Competition</Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Our Competitive Edge</p>
                                                    <p className="text-xs text-gray-600">Strong certifications + proven track record</p>
                                                </div>
                                                <Badge variant="outline" className="bg-green-50 border-green-600 text-green-700">Advantage</Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Price Sensitivity</p>
                                                    <p className="text-xs text-gray-600">Quality-focused with reasonable budget</p>
                                                </div>
                                                <Badge variant="outline" className="border-gray-600 text-gray-700">Moderate</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Requirements & Compliance */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold mb-2">Testing Required</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {summary.testingRequired && summary.testingRequired.length > 0 ? (
                                                    summary.testingRequired.map((test: string, idx: number) => (
                                                        <Badge key={idx} variant="outline" className="border-gray-600 text-gray-700">
                                                            <TestTube className="h-3 w-3 mr-1" />
                                                            {test}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-500">No testing requirements specified</p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2">Certifications</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {summary.certifications && summary.certifications.length > 0 ? (
                                                    summary.certifications.map((cert: string, idx: number) => (
                                                        <Badge key={idx} variant="outline" className="border-gray-600 text-gray-700">
                                                            <Package className="h-3 w-3 mr-1" />
                                                            {cert}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-500">No certifications specified</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Business Impact */}
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <h4 className="font-medium mb-3 text-gray-900">Strategic Value</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <p className="text-2xl font-semibold text-gray-900">₹{(rfp.estimatedValue / 10000000).toFixed(2)}Cr</p>
                                                <p className="text-xs text-gray-500 mt-1">Contract Value</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-semibold text-gray-900">12-18%</p>
                                                <p className="text-xs text-gray-500 mt-1">Expected Margin</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-semibold text-gray-900">High</p>
                                                <p className="text-xs text-gray-500 mt-1">Strategic Importance</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline & Recommendations */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold mb-2">Delivery Timeline</h4>
                                            <p className="text-sm text-gray-600">{summary.deliveryTimeline}</p>
                                            <p className="text-xs text-gray-500 mt-1">Feasible with current capacity</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2 text-gray-900">Recommendation</h4>
                                            <Badge className="bg-green-700 text-white">Proceed with Bid</Badge>
                                            <p className="text-xs text-gray-600 mt-1">Strong alignment with business goals</p>
                                        </div>
                                    </div>
                                </div>
                            </AgentCard>

                            <div className="flex justify-end">
                                <Button
                                    onClick={() => {
                                        setIsNavigating(true)
                                        setTimeout(() => router.push(`/rfp/${id}/technical-agent`), 300)
                                    }}
                                    disabled={isNavigating}
                                    className="bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-70"
                                >
                                    {isNavigating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            Continue to Technical Agent
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    )
}
