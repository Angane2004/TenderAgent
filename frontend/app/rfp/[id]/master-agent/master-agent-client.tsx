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
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="h-8 w-8 border-4 border-gray-800 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen">
                <Header />

                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Header */}
                    <div className="border-b border-gray-200 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gray-900 rounded-lg">
                                <Brain className="h-5 w-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-semibold text-gray-900">Master Orchestration Agent</h1>
                        </div>
                        <p className="text-gray-600 ml-12">Coordinating all agents for: {rfp.title}</p>
                    </div>

                    {/* Processing Stage */}
                    {stage === 'processing' && (
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
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
                                    <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                                        <CheckCircle className="h-5 w-5" />
                                        <span className="font-medium">All agents completed successfully - Ready for response generation</span>
                                    </div>

                                    {/* Agent Status Overview */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                                            <h4 className="font-medium mb-2 text-gray-900">Sales Discovery</h4>
                                            <Badge variant="outline" className="bg-green-50 border-green-600 text-green-700">
                                                Completed
                                            </Badge>
                                            <p className="text-xs text-gray-600 mt-2">Market analysis & competitive positioning done</p>
                                        </div>
                                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                                            <h4 className="font-medium mb-2 text-gray-900">Technical Analysis</h4>
                                            <Badge variant="outline" className="bg-green-50 border-green-600 text-green-700">
                                                Completed
                                            </Badge>
                                            <p className="text-xs text-gray-600 mt-2">Capability assessment & compliance verified</p>
                                        </div>
                                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                                            <h4 className="font-medium mb-2 text-gray-900">Pricing Strategy</h4>
                                            <Badge variant="outline" className="bg-green-50 border-green-600 text-green-700">
                                                Completed
                                            </Badge>
                                            <p className="text-xs text-gray-600 mt-2">Commercial proposal & margins optimized</p>
                                        </div>
                                    </div>

                                    {/* Tender Alignment Metrics */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Performance Metrics</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-white rounded-lg border border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium text-gray-900">Tender Alignment</h4>
                                                    <span className="text-xl font-semibold text-gray-900">{scores.tenderAlignment}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div className="bg-gray-800 h-full rounded-full transition-all duration-500" style={{ width: `${scores.tenderAlignment}%` }} />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">Overall fit with tender requirements</p>
                                            </div>

                                            <div className="p-4 bg-white rounded-lg border border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium text-gray-900">Requirement Match</h4>
                                                    <span className="text-xl font-semibold text-gray-900">{scores.requirementMatch}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div className="bg-gray-800 h-full rounded-full transition-all duration-500" style={{ width: `${scores.requirementMatch}%` }} />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">Specifications we can fulfill</p>
                                            </div>

                                            <div className="p-4 bg-white rounded-lg border border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium text-gray-900">Capability Score</h4>
                                                    <span className="text-xl font-semibold text-gray-900">{scores.capabilityScore}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div className="bg-gray-800 h-full rounded-full transition-all duration-500" style={{ width: `${scores.capabilityScore}%` }} />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">Technical capability alignment</p>
                                            </div>

                                            <div className="p-4 bg-white rounded-lg border border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium text-gray-900">Strategic Fit</h4>
                                                    <span className="text-xl font-semibold text-gray-900">{scores.strategicFit}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div className="bg-gray-800 h-full rounded-full transition-all duration-500" style={{ width: `${scores.strategicFit}%` }} />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">Alignment with business goals</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decision Framework */}
                                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                                        <h4 className="font-medium mb-3 text-gray-900">Decision Framework Analysis</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium mb-2 text-gray-700">Strengths</p>
                                                <ul className="space-y-1 text-sm text-gray-600">
                                                    <li>• High technical capability match (95%)</li>
                                                    <li>• All required certifications available</li>
                                                    <li>• Competitive pricing with healthy margins</li>
                                                    <li>• Strong regional presence and track record</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium mb-2 text-gray-700">Opportunities</p>
                                                <ul className="space-y-1 text-sm text-gray-600">
                                                    <li>• High-value government contract</li>
                                                    <li>• Growing infrastructure demand</li>
                                                    <li>• Long-term relationship potential</li>
                                                    <li>• Portfolio diversification</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Execution Roadmap */}
                                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                                        <h4 className="font-medium mb-3 text-gray-900">Recommended Execution Roadmap</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                                                <Badge className="bg-gray-800 text-white mt-0.5">1</Badge>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">Response Finalization</p>
                                                    <p className="text-xs text-gray-600">Generate final proposal with all technical & commercial details</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                                                <Badge className="bg-gray-800 text-white mt-0.5">2</Badge>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">Internal Review</p>
                                                    <p className="text-xs text-gray-600">Technical, legal, and management approval cycle</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                                                <Badge className="bg-gray-800 text-white mt-0.5">3</Badge>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">Submission Preparation</p>
                                                    <p className="text-xs text-gray-600">Document compilation, EMD arrangement, fee payment</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                                                <Badge className="bg-gray-800 text-white mt-0.5">4</Badge>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">Bid Submission</p>
                                                    <p className="text-xs text-gray-600">Submit before deadline: {new Date(rfp.deadline).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Final Recommendation */}
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <h4 className="font-medium mb-3 text-gray-900">Master Agent Recommendation</h4>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge className="bg-green-700 text-white text-base px-4 py-1.5">PROCEED WITH BID</Badge>
                                            <span className="text-sm font-medium text-gray-700">High Win Probability - Strategic Value Tender</span>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2">
                                            <strong className="text-gray-900">Rationale:</strong> All technical requirements can be met, pricing is competitive with healthy margins,
                                            win probability is high ({rfp.fitScore}%), and the tender aligns perfectly with our strategic goals.
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <strong className="text-gray-900">Next Action:</strong> Proceed to generate the final response document incorporating all agent insights
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
                                    className="bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-70"
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
