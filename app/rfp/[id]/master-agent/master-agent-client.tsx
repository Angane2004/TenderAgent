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
import { ArrowRight, Brain, CheckCircle } from "lucide-react"
import { RFP } from "@/types"
import { useRFPs } from "@/contexts/rfp-context"

interface MasterAgentClientProps {
    id: string
}

export default function MasterAgentClient({ id }: MasterAgentClientProps) {
    const router = useRouter()
    const { rfps } = useRFPs()
    const [rfp, setRfp] = useState<RFP | null>(null)
    const [stage, setStage] = useState<'processing' | 'completed'>('processing')

    const logs = [
        { message: "Receiving input from Sales Agent...", status: 'completed' as const, progress: 100 },
        { message: "Coordinating with Technical Agent...", status: 'completed' as const, progress: 100 },
        { message: "Coordinating with Pricing Agent...", status: 'completed' as const, progress: 100 },
        { message: "Synthesizing all agent outputs...", status: 'completed' as const, progress: 100 },
        { message: "Preparing final response strategy...", status: 'completed' as const, progress: 100 },
    ]

    useEffect(() => {
        const foundRfp = rfps.find(r => r.id === id)
        if (foundRfp) {
            setRfp(foundRfp)

            // Simulate processing
            setTimeout(() => {
                setStage('completed')
            }, 3000)
        }
    }, [id, rfps])

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
                        <h1 className="text-3xl font-bold">Master Orchestration Agent</h1>
                        <p className="text-gray-600 mt-1">Coordinating all agents for: {rfp.title}</p>
                    </div>

                    {/* Processing Stage */}
                    {stage === 'processing' && (
                        <Card className="border-2 border-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brain className="h-5 w-5" />
                                    Orchestrating Agents...
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AgentLog logs={logs} agentName="Master Agent" />
                            </CardContent>
                        </Card>
                    )}

                    {/* Completed Stage */}
                    {stage === 'completed' && (
                        <>
                            <AgentCard
                                title="Master Agent Summary"
                                status="completed"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="h-5 w-5" />
                                        <span className="font-semibold">All agents completed successfully</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-lg border-2 border-black">
                                            <h4 className="font-semibold mb-2">Sales Discovery</h4>
                                            <Badge variant="outline" className="border-green-600 text-green-600">
                                                Completed
                                            </Badge>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg border-2 border-black">
                                            <h4 className="font-semibold mb-2">Technical Analysis</h4>
                                            <Badge variant="outline" className="border-green-600 text-green-600">
                                                Completed
                                            </Badge>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg border-2 border-black">
                                            <h4 className="font-semibold mb-2">Pricing Strategy</h4>
                                            <Badge variant="outline" className="border-green-600 text-green-600">
                                                Completed
                                            </Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Win Probability</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 bg-gray-200 rounded-full h-4 border-2 border-black">
                                                <div className="bg-green-600 h-full rounded-full" style={{ width: '78%' }} />
                                            </div>
                                            <span className="text-2xl font-bold">78%</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Recommendation</h4>
                                        <p className="text-sm text-gray-600">
                                            Proceed with tender response. All technical requirements can be met, pricing is competitive, and win probability is high.
                                        </p>
                                    </div>
                                </div>
                            </AgentCard>

                            <div className="flex justify-end">
                                <Button
                                    onClick={() => router.push(`/rfp/${id}/final-response`)}
                                    className="bg-black text-white hover:bg-gray-800"
                                >
                                    Generate Final Response
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
