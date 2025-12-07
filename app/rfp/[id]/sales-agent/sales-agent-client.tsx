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
import { ArrowRight, TestTube, Package } from "lucide-react"
import { RFP } from "@/types"
import { storage } from "@/lib/storage"
import { DUMMY_RFPS } from "@/data/dummy-rfps"

interface SalesAgentClientProps {
    id: string
}

export default function SalesAgentClient({ id }: SalesAgentClientProps) {
    const router = useRouter()
    const [rfp, setRfp] = useState<RFP | null>(null)
    const [stage, setStage] = useState<'processing' | 'completed'>('processing')
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
        const loadData = async () => {
            // Try storage first
            let foundRfp = storage.getRFP(id)

            // If not in storage, try using dummy data (fallback for static IDs)
            if (!foundRfp) {
                try {
                    const data = DUMMY_RFPS
                    foundRfp = data.find((r: RFP) => r.id === id)

                    // If found in dummy data, save to storage for future consistency
                    if (foundRfp) {
                        const currentStorage = storage.getRFPs()
                        // Check if already exists to avoid duplicates
                        if (!currentStorage.find(r => r.id === foundRfp!.id)) {
                            storage.saveRFPs([...currentStorage, foundRfp])
                        }
                    }
                } catch (error) {
                    console.error("Error finding RFP:", error)
                }
            }

            if (foundRfp) {
                setRfp(foundRfp)

                // If already completed, show summary immediately
                if (foundRfp.salesSummary?.status === 'completed') {
                    setSummary(foundRfp.salesSummary)
                    setStage('completed')
                } else {
                    // Simulate processing if not completed
                    setTimeout(() => {
                        const newSummary = {
                            scopeOfSupply: "11kV XLPE insulated, Aluminum conductor, SWA armored cable",
                            quantity: "5000 meters",
                            testingRequired: ["Type Test", "Routine Test", "Sample Test"],
                            certifications: ["BIS", "ISO 9001"],
                            deliveryTimeline: "90 days from PO",
                            status: 'completed' as const
                        }
                        setSummary(newSummary)
                        setStage('completed')

                        // Save to storage
                        storage.updateRFP(id, {
                            salesSummary: newSummary,
                            status: 'in-progress'
                        })
                    }, 3000)
                }
            }
        }

        loadData()
    }, [id])

    if (!rfp) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1">
                <Header />

                <main className="p-6 space-y-6">
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
                                    onClick={() => router.push(`/rfp/${id}/master-agent`)}
                                    className="bg-black text-white hover:bg-gray-800"
                                >
                                    Continue to Master Agent
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    )
}
