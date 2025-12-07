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
import { ArrowRight, Wrench } from "lucide-react"
import { RFP } from "@/types"
import { storage } from "@/lib/storage"


interface TechnicalAgentClientProps {
    id: string
}

export default function TechnicalAgentClient({ id }: TechnicalAgentClientProps) {
    const router = useRouter()
    const [rfp, setRfp] = useState<RFP | null>(null)
    const [stage, setStage] = useState<'processing' | 'completed'>('processing')

    const logs = [
        { message: "Analyzing technical specifications...", status: 'completed' as const, progress: 100 },
        { message: "Checking product compatibility...", status: 'completed' as const, progress: 100 },
        { message: "Validating standards compliance...", status: 'completed' as const, progress: 100 },
        { message: "Reviewing testing requirements...", status: 'completed' as const, progress: 100 },
        { message: "Preparing technical response...", status: 'completed' as const, progress: 100 },
    ]

    useEffect(() => {
        const foundRfp = storage.getRFP(id)
        if (foundRfp) {
            setRfp(foundRfp)

            if (foundRfp.technicalAnalysis?.status === 'completed') {
                setStage('completed')
            } else {
                setTimeout(() => {
                    const analysis = {
                        productMatchScore: 95,
                        compatible: true,
                        standards: ["IS 7098", "IEC 60502", "BIS Certified"],
                        testingCapabilities: ["Type Test", "Routine Test", "Sample Test"],
                        status: 'completed' as const
                    }
                    setStage('completed')

                    storage.updateRFP(id, {
                        technicalAnalysis: analysis
                    })
                }, 3000)
            }
        }
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
                    <div>
                        <h1 className="text-3xl font-bold">Technical Analysis Agent</h1>
                        <p className="text-gray-600 mt-1">Analyzing technical requirements for: {rfp.title}</p>
                    </div>

                    {stage === 'processing' && (
                        <Card className="border-2 border-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Wrench className="h-5 w-5" />
                                    Analyzing Technical Specifications...
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AgentLog logs={logs} agentName="Technical Agent" />
                            </CardContent>
                        </Card>
                    )}

                    {stage === 'completed' && (
                        <>
                            <AgentCard title="Technical Analysis" status="completed">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Product Match</h4>
                                        <Badge variant="outline" className="border-green-600 text-green-600 bg-green-50">
                                            95% Compatible
                                        </Badge>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Our 11kV XLPE cable meets all specified requirements
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Standards Compliance</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline" className="border-black">IS 7098</Badge>
                                            <Badge variant="outline" className="border-black">IEC 60502</Badge>
                                            <Badge variant="outline" className="border-black">BIS Certified</Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Testing Capabilities</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="border-green-600 text-green-600">✓</Badge>
                                                <span className="text-sm">Type Test - In-house lab</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="border-green-600 text-green-600">✓</Badge>
                                                <span className="text-sm">Routine Test - Available</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="border-green-600 text-green-600">✓</Badge>
                                                <span className="text-sm">Sample Test - NABL accredited</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AgentCard>

                            <div className="flex justify-end">
                                <Button
                                    onClick={() => router.push(`/rfp/${id}/pricing-agent`)}
                                    className="bg-black text-white hover:bg-gray-800"
                                >
                                    Continue to Pricing Agent
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
