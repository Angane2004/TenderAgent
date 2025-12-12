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
import { ArrowRight, IndianRupee, TrendingUp, Loader2, ThumbsUp } from "lucide-react"
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
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6 space-y-6">
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

                            {/* Pricing Comparison Table */}
                            <Card className="border-2 border-black bg-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Pricing Strategy Comparison
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b-2 border-gray-200">
                                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric</th>
                                                    <th className="text-center py-3 px-4 font-semibold text-red-700">
                                                        <div className="flex flex-col items-center">
                                                            <span>Aggressive</span>
                                                            <Badge variant="outline" className="mt-1 border-red-600 text-red-600 text-xs">
                                                                High Win Rate
                                                            </Badge>
                                                        </div>
                                                    </th>
                                                    <th className="text-center py-3 px-4 font-semibold text-green-700 bg-green-50">
                                                        <div className="flex flex-col items-center">
                                                            <span>AI Recommended</span>
                                                            <Badge className="mt-1 bg-green-600 text-white text-xs">
                                                                <ThumbsUp className="mr-3 h-4 w-4" /> Best Value
                                                            </Badge>
                                                        </div>
                                                    </th>
                                                    <th className="text-center py-3 px-4 font-semibold text-blue-700">
                                                        <div className="flex flex-col items-center">
                                                            <span>Premium</span>
                                                            <Badge variant="outline" className="mt-1 border-blue-600 text-blue-600 text-xs">
                                                                High Margin
                                                            </Badge>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Price Per Meter */}
                                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium">Price per Meter</td>
                                                    <td className="py-3 px-4 text-center text-lg font-bold text-red-600">
                                                        ₹{rfp.pricingStrategy?.aggressivePrice || 485}
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-lg font-bold text-green-600 bg-green-50">
                                                        ₹{rfp.pricingStrategy?.recommendedPrice || 525}
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-lg font-bold text-blue-600">
                                                        ₹{rfp.pricingStrategy?.premiumPrice || 565}
                                                    </td>
                                                </tr>

                                                {/* Total Value */}
                                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium">Total Project Value</td>
                                                    <td className="py-3 px-4 text-center font-semibold">
                                                        ₹{((rfp.pricingStrategy?.aggressivePrice || 485) * rfp.specifications.quantity).toLocaleString('en-IN')}
                                                    </td>
                                                    <td className="py-3 px-4 text-center font-semibold bg-green-50">
                                                        ₹{(rfp.pricingStrategy?.totalValue || 2625000).toLocaleString('en-IN')}
                                                    </td>
                                                    <td className="py-3 px-4 text-center font-semibold">
                                                        ₹{((rfp.pricingStrategy?.premiumPrice || 565) * rfp.specifications.quantity).toLocaleString('en-IN')}
                                                    </td>
                                                </tr>

                                                {/* Profit Margin */}
                                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium">Profit Margin</td>
                                                    <td className="py-3 px-4 text-center">
                                                        <Badge variant="outline" className="border-red-600 text-red-600">12%</Badge>
                                                    </td>
                                                    <td className="py-3 px-4 text-center bg-green-50">
                                                        <Badge className="bg-green-600 text-white">18%</Badge>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <Badge variant="outline" className="border-blue-600 text-blue-600">24%</Badge>
                                                    </td>
                                                </tr>

                                                {/* Estimated Profit */}
                                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium">Estimated Profit</td>
                                                    <td className="py-3 px-4 text-center font-semibold text-red-600">
                                                        ₹{(((rfp.pricingStrategy?.aggressivePrice || 485) * rfp.specifications.quantity) * 0.12).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                    </td>
                                                    <td className="py-3 px-4 text-center font-semibold text-green-600 bg-green-50">
                                                        ₹{((rfp.pricingStrategy?.totalValue || 2625000) * 0.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                    </td>
                                                    <td className="py-3 px-4 text-center font-semibold text-blue-600">
                                                        ₹{(((rfp.pricingStrategy?.premiumPrice || 565) * rfp.specifications.quantity) * 0.24).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                    </td>
                                                </tr>

                                                {/* Win Probability */}
                                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium">Win Probability</td>
                                                    <td className="py-3 px-4 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <span className="font-bold text-red-600">85%</span>
                                                            <span className="text-xs text-gray-500">High</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center bg-green-50">
                                                        <div className="flex flex-col items-center">
                                                            <span className="font-bold text-green-600">72%</span>
                                                            <span className="text-xs text-gray-500">Good</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <span className="font-bold text-blue-600">55%</span>
                                                            <span className="text-xs text-gray-500">Moderate</span>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Risk Level */}
                                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium">Risk Level</td>
                                                    <td className="py-3 px-4 text-center">
                                                        <Badge className="bg-red-600 text-white">High</Badge>
                                                    </td>
                                                    <td className="py-3 px-4 text-center bg-green-50">
                                                        <Badge className="bg-yellow-600 text-white">Medium</Badge>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <Badge className="bg-green-600 text-white">Low</Badge>
                                                    </td>
                                                </tr>

                                                {/* Competitiveness */}
                                                <tr className="hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium">Market Position</td>
                                                    <td className="py-3 px-4 text-center text-sm text-gray-600">
                                                        Highly competitive,<br />may raise concerns
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-sm text-gray-600 bg-green-50">
                                                        Balanced pricing,<br />strong value proposition
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-sm text-gray-600">
                                                        Premium positioning,<br />quality focus
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Recommendation Box */}
                                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-600 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-green-600 text-white p-2 rounded-full">
                                                <TrendingUp className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-green-900 mb-1">AI Recommendation</h4>
                                                <p className="text-sm text-green-800">
                                                    Based on market analysis, project complexity, and risk assessment, we recommend the
                                                    <span className="font-bold"> Recommended Pricing Strategy (₹{rfp.pricingStrategy?.recommendedPrice || 525}/m)</span>.
                                                    This offers the best balance between competitiveness and profitability, with a healthy 18% margin
                                                    and 72% win probability.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

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
