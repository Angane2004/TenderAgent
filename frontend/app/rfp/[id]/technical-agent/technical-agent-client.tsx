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
import { ArrowRight, Wrench, Loader2 } from "lucide-react"
import { RFP } from "@/types"
import { useRFPs } from "@/contexts/rfp-context"


interface TechnicalAgentClientProps {
    id: string
}

export default function TechnicalAgentClient({ id }: TechnicalAgentClientProps) {
    const router = useRouter()
    const { rfps, updateRFP } = useRFPs()
    const [rfp, setRfp] = useState<RFP | null>(null)
    const [stage, setStage] = useState<'processing' | 'completed'>('processing')
    const [isNavigating, setIsNavigating] = useState(false)

    const logs = [
        { message: "Analyzing technical specifications...", status: 'completed' as const, progress: 100 },
        { message: "Checking product compatibility...", status: 'completed' as const, progress: 100 },
        { message: "Validating standards compliance...", status: 'completed' as const, progress: 100 },
        { message: "Reviewing testing requirements...", status: 'completed' as const, progress: 100 },
        { message: "Preparing technical response...", status: 'completed' as const, progress: 100 },
    ]

    useEffect(() => {
        const foundRfp = rfps.find(r => r.id === id)
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

                    updateRFP(id, {
                        technicalAnalysis: analysis
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
                            <AgentCard
                                title="Technical Analysis Complete"
                                status="completed"
                            >
                                <div className="space-y-6">
                                    {/* Technical Compatibility */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                                            <h4 className="font-semibold mb-2 text-green-900">Product Match</h4>
                                            <p className="text-3xl font-bold text-green-700">95%</p>
                                            <p className="text-xs text-gray-600 mt-1">Specifications align perfectly</p>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                            <h4 className="font-semibold mb-2 text-blue-900">Capacity Match</h4>
                                            <p className="text-3xl font-bold text-blue-700">100%</p>
                                            <p className="text-xs text-gray-600 mt-1">Can fulfill all requirements</p>
                                        </div>
                                        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                                            <h4 className="font-semibold mb-2 text-purple-900">Timeline Feasibility</h4>
                                            <p className="text-3xl font-bold text-purple-700">High</p>
                                            <p className="text-xs text-gray-600 mt-1">Within delivery window</p>
                                        </div>
                                    </div>

                                    {/* Manufacturing Capabilities */}
                                    <div className="p-4 bg-gray-50 rounded-lg border-2 border-black">
                                        <h4 className="font-semibold mb-3">Manufacturing Capabilities</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium mb-2">Production Capacity</p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="border-green-600 text-green-600">✓</Badge>
                                                        <span className="text-sm">{rfp.specifications.voltage} cables - {rfp.specifications.quantity.toLocaleString()} meters/month</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="border-green-600 text-green-600">✓</Badge>
                                                        <span className="text-sm">Current utilization: 65% (capacity available)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="border-green-600 text-green-600">✓</Badge>
                                                        <span className="text-sm">Scalable to meet surge demand</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium mb-2">Technical Specifications</p>
                                                <div className="space-y-1 text-sm text-gray-700">
                                                    <p>• Voltage Rating: {rfp.specifications.voltage}</p>
                                                    <p>• Size: {rfp.specifications.size}</p>
                                                    <p>• Conductor: {rfp.specifications.conductor}</p>
                                                    <p>• Insulation: {rfp.specifications.insulation}</p>
                                                    <p>• Armoring: {rfp.specifications.armoring}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quality Assurance */}
                                    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                        <h4 className="font-semibold mb-3 text-blue-900">Quality Assurance & Testing</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium mb-2">Testing Capabilities</p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="border-green-600 text-green-600">✓</Badge>
                                                        <span className="text-sm">Type Test - In-house NABL lab</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="border-green-600 text-green-600">✓</Badge>
                                                        <span className="text-sm">Routine Test - 100% inspection</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="border-green-600 text-green-600">✓</Badge>
                                                        <span className="text-sm">Sample Test - Third-party accredited</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium mb-2">Quality Standards</p>
                                                <div className="space-y-1 text-sm text-gray-700">
                                                    <p>• ISO 9001:2015 Certified</p>
                                                    <p>• BIS License for cables</p>
                                                    <p>• Compliant with {rfp.specifications.standards?.join(', ')}</p>
                                                    <p>• Regular third-party audits</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Compliance & Certifications */}
                                    <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                                        <h4 className="font-semibold mb-3 text-purple-900">Compliance & Certifications</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium mb-2">Required Certifications</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {rfp.certifications.map((cert, idx) => (
                                                        <Badge key={idx} variant="outline" className="border-green-600 text-green-600">
                                                            ✓ {cert}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-green-600 mt-2 font-medium">All certifications available ✓</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium mb-2">Additional Compliance</p>
                                                <div className="space-y-1 text-sm text-gray-700">
                                                    <p>• Environmental: ISO 14001</p>
                                                    <p>• Safety: OHSAS 18001</p>
                                                    <p>• RoHS compliant materials</p>
                                                    <p>• REACH regulation adherence</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Risk Assessment */}
                                    <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                                        <h4 className="font-semibold mb-3 text-yellow-900">Technical Risk Assessment</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between p-2 bg-white rounded border border-yellow-200">
                                                <div>
                                                    <p className="text-sm font-medium">Raw Material Availability</p>
                                                    <p className="text-xs text-gray-600">Established supplier relationships</p>
                                                </div>
                                                <Badge variant="outline" className="border-green-600 text-green-600">Low Risk</Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-2 bg-white rounded border border-yellow-200">
                                                <div>
                                                    <p className="text-sm font-medium">Production Timeline</p>
                                                    <p className="text-xs text-gray-600">Adequate lead time for manufacturing</p>
                                                </div>
                                                <Badge variant="outline" className="border-green-600 text-green-600">Low Risk</Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-2 bg-white rounded border border-yellow-200">
                                                <div>
                                                    <p className="text-sm font-medium">Quality Compliance</p>
                                                    <p className="text-xs text-gray-600">Proven track record with similar projects</p>
                                                </div>
                                                <Badge variant="outline" className="border-green-600 text-green-600">Low Risk</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Technical Recommendation */}
                                    <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                                        <h4 className="font-semibold mb-2 text-green-900">Technical Verdict</h4>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className="bg-green-600 text-white">APPROVED</Badge>
                                            <span className="text-sm font-medium">Technically Feasible & Compliant</span>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                            All technical requirements can be met with existing capabilities. Manufacturing capacity is sufficient,
                                            all required certifications are in place, and quality standards exceed tender requirements.
                                            Recommend proceeding with commercial proposal.
                                        </p>
                                    </div>
                                </div>
                            </AgentCard>

                            <div className="flex justify-end">
                                <Button
                                    onClick={() => {
                                        setIsNavigating(true)
                                        setTimeout(() => router.push(`/rfp/${id}/pricing-agent`), 300)
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
                                            Continue to Pricing Agent
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
