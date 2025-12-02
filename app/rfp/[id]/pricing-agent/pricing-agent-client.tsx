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
import { ArrowRight, DollarSign, TrendingUp } from "lucide-react"
import { RFP } from "@/types"
import { storage } from "@/lib/storage"


interface PricingAgentClientProps {
    id: string
}

export default function PricingAgentClient({ id }: PricingAgentClientProps) {
    const router = useRouter()
    const [rfp, setRfp] = useState<RFP | null>(null)
    const [stage, setStage] = useState<'processing' | 'completed'>('processing')

    const logs = [
        { message: "Analyzing market pricing data...", status: 'completed' as const, progress: 100 },
        { message: "Calculating material costs...", status: 'completed' as const, progress: 100 },
        { message: "Estimating production costs...", status: 'completed' as const, progress: 100 },
        { message: "Analyzing competitor pricing...", status: 'completed' as const, progress: 100 },
        { message: "Generating pricing strategy...", status: 'completed' as const, progress: 100 },
    ]

    useEffect(() => {
        const foundRfp = storage.getRFP(id)
        if (foundRfp) {
            setRfp(foundRfp)

            if (foundRfp.pricingStrategy?.status === 'completed') {
                setStage('completed')
            } else {
                setTimeout(() => {
                    const strategy = {
                        recommendedPrice: 525,
                        margin: 18,
                        totalValue: 2625000,
                        riskLevel: 'low' as const,
                        status: 'completed' as const
                    }
                    setStage('completed')

                    storage.updateRFP(id, {
                        pricingStrategy: strategy
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
                        <h1 className="text-3xl font-bold">Pricing Strategy Agent</h1>
                        <p className="text-gray-600 mt-1">Calculating optimal pricing for: {rfp.title}</p>
                    </div>

                    {stage === 'processing' && (
                        <Card className="border-2 border-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Calculating Pricing Strategy...
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AgentLog logs={logs} agentName="Pricing Agent" />
                            </CardContent>
                        </Card>
                    )}

                    {stage === 'completed' && (
                        <>
                            <AgentCard title="Pricing Analysis" status="completed">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-red-50 rounded-lg border-2 border-red-600">
                                            <h4 className="font-semibold mb-2 text-red-600">Aggressive</h4>
                                            <p className="text-2xl font-bold">₹485/m</p>
                                            <p className="text-sm text-gray-600 mt-1">12% margin</p>
                                            <Badge variant="outline" className="mt-2 border-red-600 text-red-600">
                                                High Risk
                                            </Badge>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-600">
                                            <h4 className="font-semibold mb-2 text-green-600">Recommended</h4>
                                            <p className="text-2xl font-bold">₹525/m</p>
                                            <p className="text-sm text-gray-600 mt-1">18% margin</p>
                                            <Badge variant="outline" className="mt-2 border-green-600 text-green-600">
                                                Optimal
                                            </Badge>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-600">
                                            <h4 className="font-semibold mb-2 text-blue-600">Premium</h4>
                                            <p className="text-2xl font-bold">₹565/m</p>
                                            <p className="text-sm text-gray-600 mt-1">24% margin</p>
                                            <Badge variant="outline" className="mt-2 border-blue-600 text-blue-600">
                                                Low Risk
                                            </Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Total Project Value</h4>
                                        <p className="text-3xl font-bold">₹26,25,000</p>
                                        <p className="text-sm text-gray-600">(Based on recommended pricing)</p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Market Analysis</h4>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-green-600" />
                                            <span className="text-sm text-gray-600">
                                                Recommended price is 8% below market average, increasing win probability
                                            </span>
                                        </div>
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
