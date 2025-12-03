"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Building2, Clock, TrendingUp, AlertCircle, DollarSign } from "lucide-react"
import { RFP } from "@/types"
import { getDaysUntil, formatDate } from "@/lib/utils"

interface RFPCardProps {
    rfp: RFP
}

export function RFPCard({ rfp }: RFPCardProps) {
    const daysUntil = getDaysUntil(rfp.deadline)

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'low': return 'success'
            case 'medium': return 'warning'
            case 'high': return 'destructive'
            default: return 'secondary'
        }
    }

    const getDeadlineColor = (days: number) => {
        if (days <= 7) return 'destructive'
        if (days <= 30) return 'warning'
        return 'success'
    }

    return (
        <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-black bg-white">
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
                        <Badge
                            variant="outline"
                            className={cn(
                                "border-2",
                                rfp.riskScore === 'low' && "border-green-600 text-green-600 bg-green-50",
                                rfp.riskScore === 'medium' && "border-yellow-600 text-yellow-600 bg-yellow-50",
                                rfp.riskScore === 'high' && "border-red-600 text-red-600 bg-red-50"
                            )}
                        >
                            {rfp.riskScore.toUpperCase()} RISK
                        </Badge>
                        <Badge variant="outline" className="justify-center border-2 border-black">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {rfp.fitScore}% Fit
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {rfp.summary}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Deadline:</span>
                    </div>
                    <div className="font-medium">{formatDate(rfp.deadline)}</div>

                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Time Left:</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className={cn(
                                "text-xs border-2",
                                daysUntil <= 7 && "border-red-600 text-red-600 bg-red-50",
                                daysUntil > 7 && daysUntil <= 30 && "border-yellow-600 text-yellow-600 bg-yellow-50",
                                daysUntil > 30 && "border-green-600 text-green-600 bg-green-50"
                            )}
                        >
                            {daysUntil > 0 ? `${daysUntil} days` : 'OVERDUE'}
                        </Badge>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs border-black">
                        {rfp.specifications.voltage}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-black">
                        {rfp.specifications.size}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-black">
                        {rfp.specifications.quantity.toLocaleString()} meters
                    </Badge>
                </div>

                {/* Profit & Price Section */}
                <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-xs text-gray-600">Estimated Value</p>
                                <p className="text-lg font-bold text-green-700">
                                    ${(rfp.pricingStrategy?.totalValue || Math.random() * 500000 + 100000).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-600">Profitability</p>
                            <Badge className={cn(
                                "text-xs font-bold",
                                (rfp.fitScore || 0) >= 80 ? "bg-green-600" :
                                    (rfp.fitScore || 0) >= 60 ? "bg-yellow-600" :
                                        "bg-orange-600"
                            )}>
                                {(rfp.fitScore || 0) >= 80 ? "HIGH" :
                                    (rfp.fitScore || 0) >= 60 ? "MEDIUM" :
                                        "LOW"}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex gap-2">
                <Link href={`/rfp/${rfp.id}/details`} className="flex-1">
                    <Button variant="outline" className="w-full border-2 border-black hover:bg-black hover:text-white">
                        View Details
                    </Button>
                </Link>
                <Link href={`/rfp/${rfp.id}/sales-agent`} className="flex-1">
                    <Button className="w-full bg-black text-white hover:bg-gray-800">
                        Select for Response
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ')
}
