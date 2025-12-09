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
import { ArrowRight, IndianRupee, TrendingUp, Loader2 } from "lucide-react"
import { RFP } from "@/types"
import { useRFPs } from "@/contexts/rfp-context"


interface PricingAgentClientProps {
    id: string
}

export default function PricingAgentClient({ id }: PricingAgentClientProps) {
    const router = useRouter()
    const { rfps, updateRFP } = useRFPs()
    const [rfp, setRfp] = useState<RFP | null>(null)
    const [stage, setStage] = useState<'processing' | 'completed'>('processing')
    const [isNavigating, setIsNavigating] = useState(false)

    const logs = [
        { message: "Analyzing market pricing data...", status: 'completed' as const, progress: 100 },
        { message: "Calculating material costs...", status: 'completed' as const, progress: 100 },
        { message: "Estimating production costs...", status: 'completed' as const, progress: 100 },
        { message: "Analyzing competitor pricing...", status: 'completed' as const, progress: 100 },
        { message: "Generating pricing strategy...", status: 'completed' as const, progress: 100 },
    ]

    useEffect(() => {
        const foundRfp = rfps.find(r => r.id === id)
        if (foundRfp) {
            setRfp(foundRfp)

            if (foundRfp.pricingStrategy?.status === 'completed') {
                setStage('completed')
            } else {
                setTimeout(() => {
                    // Calculate pricing based on RFP specifications
                    const quantity = foundRfp.specifications.quantity || 5000
                    const voltage = foundRfp.specifications.voltage || "11kV"

                    // Base price per meter based on voltage and specifications
                    let basePricePerMeter = 450 // Default base price

                    // Adjust price based on voltage
                    if (voltage.includes("33kV")) basePricePerMeter = 650
                    else if (voltage.includes("22kV")) basePricePerMeter = 550
                    else if (voltage.includes("11kV")) basePricePerMeter = 450
                    else if (voltage.includes("6.6kV")) basePricePerMeter = 400

                    // Add premium for special features
                    if (foundRfp.specifications.armoring?.includes("SWA")) basePricePerMeter += 30
                    if (foundRfp.specifications.conductor?.includes("Copper")) basePricePerMeter += 50

                    // Calculate total and different pricing strategies
                    const aggressivePrice = Math.round(basePricePerMeter * 0.92) // 8% discount
                    const recommendedPrice = basePricePerMeter
                    const premiumPrice = Math.round(basePricePerMeter * 1.08) // 8% premium

                    const totalValue = recommendedPrice * quantity

                    // Determine risk level based on quantity and deadline
                    const deadline = new Date(foundRfp.deadline)
                    const today = new Date()
                    const daysUntilDeadline = Math.floor((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

                    let riskLevel: 'low' | 'medium' | 'high' = 'medium'
                    if (daysUntilDeadline > 45 && quantity < 10000) riskLevel = 'low'
                    else if (daysUntilDeadline < 20 || quantity > 20000) riskLevel = 'high'

                    const strategy = {
                        recommendedPrice,
                        aggressivePrice,
                        premiumPrice,
                        margin: 18,
                        totalValue,
                        riskLevel,
                        status: 'completed' as const
                    }
                    setStage('completed')

                    updateRFP(id, {
                        pricingStrategy: strategy
                    })
                }, 3000)
            }
        }
    }, [id, rfps, updateRFP])

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
                                    <IndianRupee className="h-5 w-5" />
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
                                            <p className="text-2xl font-bold">₹{rfp.pricingStrategy?.aggressivePrice || 485}/m</p>
                                            <p className="text-sm text-gray-600 mt-1">12% margin</p>
                                            <Badge variant="outline" className="mt-2 border-red-600 text-red-600">
                                                High Risk
                                            </Badge>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-600">
                                            <h4 className="font-semibold mb-2 text-green-600">Recommended</h4>
                                            <p className="text-2xl font-bold">₹{rfp.pricingStrategy?.recommendedPrice || 525}/m</p>
                                            <p className="text-sm text-gray-600 mt-1">18% margin</p>
                                            <Badge variant="outline" className="mt-2 border-green-600 text-green-600">
                                                Optimal
                                            </Badge>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-600">
                                            <h4 className="font-semibold mb-2 text-blue-600">Premium</h4>
                                            <p className="text-2xl font-bold">₹{rfp.pricingStrategy?.premiumPrice || 565}/m</p>
                                            <p className="text-sm text-gray-600 mt-1">24% margin</p>
                                            <Badge variant="outline" className="mt-2 border-blue-600 text-blue-600">
                                                Low Risk
                                            </Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Total Project Value</h4>
                                        <p className="text-3xl font-bold">₹{(rfp.pricingStrategy?.totalValue || 2625000).toLocaleString('en-IN')}</p>
                                        <p className="text-sm text-gray-600">Based on {rfp.specifications.quantity.toLocaleString()} meters at recommended pricing</p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                                        <h4 className="font-semibold mb-2">Risk Assessment</h4>
                                        <div className="flex items-center gap-3">
                                            <Badge className={`text-sm font-bold ${rfp.pricingStrategy?.riskLevel === 'low' ? 'bg-green-600' :
                                                rfp.pricingStrategy?.riskLevel === 'medium' ? 'bg-yellow-600' :
                                                    'bg-red-600'
                                                }`}>
                                                {(rfp.pricingStrategy?.riskLevel || 'medium').toUpperCase()} RISK
                                            </Badge>
                                            <p className="text-sm text-gray-600">
                                                {rfp.pricingStrategy?.riskLevel === 'low' && 'Good timeline and reasonable quantity. Safe to bid competitively.'}
                                                {rfp.pricingStrategy?.riskLevel === 'medium' && 'Moderate timeline or quantity. Recommended pricing is optimal.'}
                                                {rfp.pricingStrategy?.riskLevel === 'high' && 'Tight timeline or large quantity. Consider premium pricing for risk mitigation.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Market Analysis</h4>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-green-600" />
                                            <span className="text-sm text-gray-600">
                                                Recommended price is competitive for {rfp.specifications.voltage} {rfp.specifications.size} cable
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </AgentCard>

                            <div className="flex justify-end">
                                <Button
                                    onClick={() => {
                                        setIsNavigating(true)
                                        setTimeout(() => router.push(`/rfp/${id}/master-agent`), 300)
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
                                            Continue to Master Agent
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
