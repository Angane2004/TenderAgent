"use client"

import { memo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Building2, Clock, TrendingUp, CheckCircle, IndianRupeeIcon, ArrowRight, Loader2, MapPin, Download } from "lucide-react"
import { RFP } from "@/types"
import { getDaysUntil, formatDate } from "@/lib/utils"
import { getActualRFPStatus, getNextAgentStep } from "@/lib/rfp-utils"
import { generateTenderPDF } from "@/lib/tender-pdf-generator"

interface RFPCardProps {
    rfp: RFP
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ')
}

export const RFPCard = memo(function RFPCard({ rfp }: RFPCardProps) {
    const router = useRouter()
    const daysUntil = getDaysUntil(rfp.deadline)
    const actualStatus = getActualRFPStatus(rfp)
    const nextStep = getNextAgentStep(rfp)
    const [isNavigating, setIsNavigating] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    const handleDownloadPDF = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDownloading(true)
        try {
            await generateTenderPDF(rfp)
        } catch (error) {
            console.error('PDF generation failed:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    const handleSelectResponse = () => {
        setIsNavigating(true)
        setTimeout(() => {
            router.push(`/rfp/${rfp.id}/sales-agent`)
        }, 300)
    }

    return (
        <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-black bg-white" style={{ willChange: "transform, box-shadow" }}>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{rfp.title}</CardTitle>
                        <CardDescription className="mt-2 flex items-center gap-2 text-gray-600">
                            <Building2 className="h-4 w-4" />
                            {rfp.issuedBy}
                        </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                        {rfp.location && (
                            <Badge variant="outline" className="border-green-600 text-green-600 bg-green-50 text-xs justify-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                {rfp.location.city}
                            </Badge>
                        )}
                        <Badge
                            variant="outline"
                            className={cn(
                                daysUntil <= 7
                                    ? "border-red-600 text-red-600 bg-red-50"
                                    : daysUntil <= 30
                                        ? "border-yellow-600 text-yellow-600 bg-yellow-50"
                                        : "border-green-600 text-green-600 bg-green-50",
                                "font-semibold"
                            )}
                        >
                            <Clock className="mr-1 h-3 w-3" />
                            {daysUntil > 0 ? `${daysUntil}d left` : "Overdue"}
                        </Badge>
                        <Badge variant="outline" className="border-blue-600 text-blue-600 bg-blue-50 justify-center">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            {rfp.fitScore}% fit
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">{rfp.summary}</p>

                {/* Estimated Value Card with Profit/Loss */}
                {(rfp.estimatedValue || rfp.pricingStrategy?.totalValue) && (
                    <div className={`p-3 rounded-lg border-2 ${rfp.fitScore >= 85
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-600'
                        : rfp.fitScore >= 70
                            ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-600'
                            : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-600'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <IndianRupeeIcon className={`h-5 w-5 ${rfp.fitScore >= 85 ? 'text-green-600' :
                                    rfp.fitScore >= 70 ? 'text-yellow-600' :
                                        'text-orange-600'
                                    }`} />
                                <span className={`text-xs font-semibold uppercase ${rfp.fitScore >= 85 ? 'text-green-700' :
                                    rfp.fitScore >= 70 ? 'text-yellow-700' :
                                        'text-orange-700'
                                    }`}>Estimated Value</span>
                            </div>
                            <Badge className={`text-white text-xs ${rfp.fitScore >= 85 ? 'bg-green-600' :
                                rfp.fitScore >= 70 ? 'bg-yellow-600' :
                                    'bg-orange-600'
                                }`}>
                                {rfp.fitScore >= 85 ? 'High Profit' : rfp.fitScore >= 70 ? 'Good Margin' : 'Break Even'}
                            </Badge>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <p className={`text-2xl font-bold ${rfp.fitScore >= 85 ? 'text-green-900' :
                                rfp.fitScore >= 70 ? 'text-yellow-900' :
                                    'text-orange-900'
                                }`}>
                                ₹{((rfp.estimatedValue || rfp.pricingStrategy?.totalValue || 0) / 100000).toFixed(2)}L
                            </p>
                            <div className="text-right">
                                {/* <p className="text-xs text-green-700 font-semibold">
                                    Win Probability: {rfp.fitScore}%
                                </p> */}
                                <p className={`text-xs ${rfp.fitScore >= 85 ? 'text-green-600' :
                                    rfp.fitScore >= 70 ? 'text-yellow-600' :
                                        'text-orange-600'
                                    }`}>
                                    Est. Profit: ₹{(((rfp.estimatedValue || rfp.pricingStrategy?.totalValue || 0) * 0.18) / 100000).toFixed(2)}L
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{formatDate(rfp.deadline)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600 font-semibold">
                            {daysUntil > 0 ? `${daysUntil} days left` : "Overdue"}
                        </span>
                    </div>
                </div>

                {rfp.certifications && Array.isArray(rfp.certifications) && rfp.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {rfp.certifications.slice(0, 3).map((cert, idx) => (
                            <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs border-gray-300"
                            >
                                {cert}
                            </Badge>
                        ))}
                        {rfp.certifications.length > 3 && (
                            <Badge variant="outline" className="text-xs border-gray-300">
                                +{rfp.certifications.length - 3}
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex w-full gap-2 p-6 pt-0">
                {actualStatus === 'completed' ? (
                    <div className="w-full flex items-center justify-center py-2">
                        <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 px-6 py-2 text-sm font-semibold border-2 border-green-700 shadow-lg">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Successfully Submitted
                        </Badge>
                    </div>
                ) : actualStatus === 'in-progress' ? (
                    <Link href={nextStep} className="w-full group">
                        <Button className="w-full relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white border-2 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-gray-500">
                            {/* Animated shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-blue-500/20 blur-xl transition-all duration-500" />

                            <span className="relative z-10 flex items-center justify-center font-semibold">
                                Continue the RFP
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                        </Button>
                    </Link>
                ) : (
                    <div className="flex w-full gap-2">
                        <Button
                            onClick={handleDownloadPDF}
                            disabled={isDownloading}
                            variant="outline"
                            className="flex-1 border-2 border-black hover:bg-gray-100"
                        >
                            {isDownloading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <Download className="h-4 w-4" />
                                    
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 border-2 border-black hover:bg-gray-100"
                            onClick={() => router.push(`/rfp/${rfp.id}/details`)}
                        >
                            View Details
                        </Button>
                        <Button
                            onClick={handleSelectResponse}
                            disabled={isNavigating}
                            className="flex-1 bg-black text-white hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isNavigating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Starting...
                                </>
                            ) : (
                                "Select for Response"
                            )}
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
})
