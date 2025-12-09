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
import { ArrowRight, Brain, CheckCircle, Zap, Bot, Loader2 } from "lucide-react"
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
    const [isNavigating, setIsNavigating] = useState(false)

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

                                    {/* Tender Alignment Metrics */}
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-700">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Tender Alignment Score
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-gray-200 rounded-full h-3 border-2 border-black">
                                                    <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: '85%' }} />
                                                </div>
                                                <span className="text-xl font-bold text-blue-700">85%</span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">Overall fit with tender requirements</p>
                                        </div>

                                        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-700">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Requirement Match
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-gray-200 rounded-full h-3 border-2 border-black">
                                                    <div className="bg-green-600 h-full rounded-full transition-all duration-500" style={{ width: '92%' }} />
                                                </div>
                                                <span className="text-xl font-bold text-green-700">92%</span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">Specifications we can fulfill</p>
                                        </div>

                                        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-purple-700">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                Capability Score
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-gray-200 rounded-full h-3 border-2 border-black">
                                                    <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: '88%' }} />
                                                </div>
                                                <span className="text-xl font-bold text-purple-700">88%</span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">Technical capability alignment</p>
                                        </div>

                                        <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-orange-700">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                                Strategic Fit
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-gray-200 rounded-full h-3 border-2 border-black">
                                                    <div className="bg-orange-600 h-full rounded-full transition-all duration-500" style={{ width: '80%' }} />
                                                </div>
                                                <span className="text-xl font-bold text-orange-700">80%</span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">Alignment with business goals</p>
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
                                    onClick={() => {
                                        setIsNavigating(true)
                                        setTimeout(() => router.push(`/rfp/${id}/final-response`), 300)
                                    }}
                                    disabled={isNavigating}
                                    className="bg-black text-white hover:bg-gray-800 disabled:opacity-70"
                                >
                                    {isNavigating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            Generate Final Response
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
