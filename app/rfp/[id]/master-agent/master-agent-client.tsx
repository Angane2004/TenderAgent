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

    // Real-time calculated scores
    const [scores, setScores] = useState({
        tenderAlignment: 0,
        requirementMatch: 0,
        capabilityScore: 0,
        strategicFit: 0
    })

    // Calculate scores based on RFP data and agent outputs
    const calculateScores = (rfp: RFP) => {
        // 1. Tender Alignment Score (based on fit score and overall compatibility)
        const tenderAlignment = Math.round(
            (rfp.fitScore * 0.4) + // 40% from fit score
            ((rfp.technicalAnalysis?.compatible ? 30 : 10)) + // 30% if compatible
            ((rfp.pricingStrategy ? 30 : 10)) // 30% if pricing available
        )

        // 2. Requirement Match (based on technical analysis and certifications)
        const hasCertifications = rfp.certifications && rfp.certifications.length > 0
        const hasTesting = rfp.testingRequirements && rfp.testingRequirements.length > 0
        const requirementMatch = Math.round(
            (rfp.technicalAnalysis?.productMatchScore || 70) * 0.7 + // 70% from product match
            (hasCertifications ? 15 : 5) + // 15% if certifications available
            (hasTesting ? 15 : 5) // 15% if testing requirements met
        )

        // 3. Capability Score (based on technical capabilities and resources)
        const hasSpecs = rfp.specifications && Object.keys(rfp.specifications).length > 0
        const hasDelivery = rfp.deliveryTimeline && rfp.deliveryTimeline.length > 0
        const capabilityScore = Math.round(
            (rfp.technicalAnalysis?.productMatchScore || 70) * 0.6 + // 60% from technical match
            (hasSpecs ? 20 : 10) + // 20% if detailed specs
            (hasDelivery ? 20 : 10) // 20% if delivery timeline clear
        )

        // 4. Strategic Fit (based on value, margin, and risk)
        const hasGoodMargin = rfp.pricingStrategy && rfp.pricingStrategy.margin >= 15
        const isLowRisk = rfp.pricingStrategy && rfp.pricingStrategy.riskLevel === 'low'
        const hasGoodValue = rfp.estimatedValue && rfp.estimatedValue > 1000000
        const strategicFit = Math.round(
            (rfp.fitScore * 0.5) + // 50% from overall fit
            (hasGoodMargin ? 20 : 10) + // 20% if good margin
            (isLowRisk ? 15 : 5) + // 15% if low risk
            (hasGoodValue ? 15 : 10) // 15% if high value
        )

        setScores({
            tenderAlignment,
            requirementMatch,
            capabilityScore,
            strategicFit
        })
    }

    useEffect(() => {
        const foundRfp = rfps.find(r => r.id === id)
        if (foundRfp) {
            setRfp(foundRfp)

            // Calculate scores immediately
            calculateScores(foundRfp)

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
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="h-5 w-5" />
                                        <span className="font-semibold">All agents completed successfully - Ready for response generation</span>
                                    </div>

                                    {/* Agent Status Overview */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-lg border-2 border-black">
                                            <h4 className="font-semibold mb-2">Sales Discovery</h4>
                                            <Badge variant="outline" className="border-green-600 text-green-600">
                                                Completed
                                            </Badge>
                                            <p className="text-xs text-gray-600 mt-2">Market analysis & competitive positioning done</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg border-2 border-black">
                                            <h4 className="font-semibold mb-2">Technical Analysis</h4>
                                            <Badge variant="outline" className="border-green-600 text-green-600">
                                                Completed
                                            </Badge>
                                            <p className="text-xs text-gray-600 mt-2">Capability assessment & compliance verified</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg border-2 border-black">
                                            <h4 className="font-semibold mb-2">Pricing Strategy</h4>
                                            <Badge variant="outline" className="border-green-600 text-green-600">
                                                Completed
                                            </Badge>
                                            <p className="text-xs text-gray-600 mt-2">Commercial proposal & margins optimized</p>
                                        </div>
                                    </div>

                                    {/* Tender Alignment Metrics */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-700">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Tender Alignment Score
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-gray-200 rounded-full h-3 border-2 border-black">
                                                    <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${scores.tenderAlignment}%` }} />
                                                </div>
                                                <span className="text-xl font-bold text-blue-700">{scores.tenderAlignment}%</span>
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
                                                    <div className="bg-green-600 h-full rounded-full transition-all duration-500" style={{ width: `${scores.requirementMatch}%` }} />
                                                </div>
                                                <span className="text-xl font-bold text-green-700">{scores.requirementMatch}%</span>
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
                                                    <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${scores.capabilityScore}%` }} />
                                                </div>
                                                <span className="text-xl font-bold text-purple-700">{scores.capabilityScore}%</span>
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
                                                    <div className="bg-orange-600 h-full rounded-full transition-all duration-500" style={{ width: `${scores.strategicFit}%` }} />
                                                </div>
                                                <span className="text-xl font-bold text-orange-700">{scores.strategicFit}%</span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">Alignment with business goals</p>
                                        </div>
                                    </div>

                                    {/* Decision Framework */}
                                    <div className="p-4 bg-gray-50 rounded-lg border-2 border-black">
                                        <h4 className="font-semibold mb-3">Decision Framework Analysis</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium mb-2 text-green-700">Strengths</p>
                                                <ul className="space-y-1 text-sm text-gray-700">
                                                    <li>✓ High technical capability match (95%)</li>
                                                    <li>✓ All required certifications available</li>
                                                    <li>✓ Competitive pricing with healthy margins</li>
                                                    <li>✓ Strong regional presence and track record</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium mb-2 text-blue-700">Opportunities</p>
                                                <ul className="space-y-1 text-sm text-gray-700">
                                                    <li>✓ High-value government contract</li>
                                                    <li>✓ Growing infrastructure demand</li>
                                                    <li>✓ Long-term relationship potential</li>
                                                    <li>✓ Portfolio diversification</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Execution Roadmap */}
                                    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                        <h4 className="font-semibold mb-3 text-blue-900">Recommended Execution Roadmap</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-3 p-2 bg-white rounded border border-blue-200">
                                                <Badge className="bg-blue-600 text-white mt-0.5">1</Badge>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Response Finalization</p>
                                                    <p className="text-xs text-gray-600">Generate final proposal with all technical & commercial details</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-2 bg-white rounded border border-blue-200">
                                                <Badge className="bg-blue-600 text-white mt-0.5">2</Badge>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Internal Review</p>
                                                    <p className="text-xs text-gray-600">Technical, legal, and management approval cycle</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-2 bg-white rounded border border-blue-200">
                                                <Badge className="bg-blue-600 text-white mt-0.5">3</Badge>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Submission Preparation</p>
                                                    <p className="text-xs text-gray-600">Document compilation, EMD arrangement, fee payment</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-2 bg-white rounded border border-blue-200">
                                                <Badge className="bg-blue-600 text-white mt-0.5">4</Badge>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Bid Submission</p>
                                                    <p className="text-xs text-gray-600">Submit before deadline: {new Date(rfp.deadline).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Final Recommendation */}
                                    <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                                        <h4 className="font-semibold mb-3 text-green-900">Master Agent Recommendation</h4>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge className="bg-green-600 text-white text-lg px-4 py-2">PROCEED WITH BID</Badge>
                                            <span className="text-sm font-medium">High Win Probability - Strategic Value Tender</span>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2">
                                            <strong>Rationale:</strong> All technical requirements can be met, pricing is competitive with healthy margins,
                                            win probability is high ({rfp.fitScore}%), and the tender aligns perfectly with our strategic goals.
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <strong>Next Action:</strong> Proceed to generate the final response document incorporating all agent insights
                                            and prepare for submission.
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
