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

            // Simulate processing
            setTimeout(() => {
                const newSummary = {
                    scopeOfSupply: foundRfp.summary || "11kV XLPE insulated, Aluminum conductor, SWA armored cable",
                    quantity: `${foundRfp.specifications.quantity.toLocaleString()} meters`,
                    testingRequired: foundRfp.testingRequirements,
                    certifications: foundRfp.certifications,
                    deliveryTimeline: foundRfp.deliveryTimeline,
                    status: 'completed' as const
                }
                setSummary(newSummary)
                setStage('completed')

                // Update the RFP with sales summary
                updateRFP(id, {
                    salesSummary: newSummary
                })
            }, 3000)
        }
    }, [id, rfps, updateRFP])

    if (!rfp) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-gray-50 to-blue-50">
                <div className="h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
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
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold">Sales Discovery Agent</h1>
                        <p className="text-gray-600 mt-1">Analyzing RFP: {rfp.title}</p>
                    </div>

                    {/* Processing Stage */}
                    {stage === 'processing' && (
                        <Card className="border-2 border-black">
                            <CardHeader>
                                <CardTitle>Processing RFP...</CardTitle>
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
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Scope of Supply</h4>
                                        <p className="text-sm text-gray-600">{summary.scopeOfSupply}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Quantity</h4>
                                        <p className="text-sm text-gray-600">{summary.quantity}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Testing Required</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {summary.testingRequired.map((test: string, idx: number) => (
                                                <Badge key={idx} variant="outline" className="border-black">
                                                    <TestTube className="h-3 w-3 mr-1" />
                                                    {test}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Certifications</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {summary.certifications.map((cert: string, idx: number) => (
                                                <Badge key={idx} variant="outline" className="border-black">
                                                    <Package className="h-3 w-3 mr-1" />
                                                    {cert}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Delivery Timeline</h4>
                                        <p className="text-sm text-gray-600">{summary.deliveryTimeline}</p>
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
                                    className="bg-black text-white hover:bg-gray-800 disabled:opacity-70"
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
