"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Clock, AlertCircle, Download } from "lucide-react"
import { RFP } from "@/types"
import Link from "next/link"

import { storage } from "@/lib/storage"

export default function CalendarPage() {
    const [rfps, setRfps] = useState<RFP[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedRfps = storage.getRFPs()
        setRfps(savedRfps)
        setLoading(false)
    }, [])

    const getDaysUntil = (deadline: string) => {
        return Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    }

    const getUrgencyColor = (days: number) => {
        if (days <= 7) return { bg: 'bg-red-50', border: 'border-red-600', text: 'text-red-600', badge: 'URGENT' }
        if (days <= 30) return { bg: 'bg-yellow-50', border: 'border-yellow-600', text: 'text-yellow-600', badge: 'SOON' }
        return { bg: 'bg-green-50', border: 'border-green-600', text: 'text-green-600', badge: 'ON TRACK' }
    }

    const sortedRfps = [...rfps].sort((a, b) =>
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    )

    const downloadICS = () => {
        let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TenderAgent//Tender Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Tender Deadlines
X-WR-TIMEZONE:Asia/Kolkata
`

        rfps.forEach(rfp => {
            const deadline = new Date(rfp.deadline)
            const dtstart = deadline.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

            icsContent += `BEGIN:VEVENT
UID:${rfp.id}@tenderagent.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${dtstart}
SUMMARY:${rfp.title}
DESCRIPTION:${rfp.summary}\\n\\nIssued by: ${rfp.issuedBy}\\nFit Score: ${rfp.fitScore}%
LOCATION:${rfp.issuedBy}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
`
        })

        icsContent += 'END:VCALENDAR'

        const blob = new Blob([icsContent], { type: 'text/calendar' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'tender-deadlines.ics'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1">
                <Header />

                <main className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Tender Calendar & Deadlines</h1>
                            <p className="text-gray-600 mt-1">Track all your tender deadlines in one place</p>
                        </div>
                        <Button
                            onClick={downloadICS}
                            className="bg-black text-white hover:bg-gray-800"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export to Calendar
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-2 border-red-600 bg-red-50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-600">Urgent (&le;7 days)</p>
                                        <p className="text-3xl font-bold text-red-600 mt-2">
                                            {rfps.filter(r => getDaysUntil(r.deadline) <= 7).length}
                                        </p>
                                    </div>
                                    <AlertCircle className="h-12 w-12 text-red-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-yellow-600 bg-yellow-50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-yellow-600">Coming Soon (&le;30 days)</p>
                                        <p className="text-3xl font-bold text-yellow-600 mt-2">
                                            {rfps.filter(r => getDaysUntil(r.deadline) > 7 && getDaysUntil(r.deadline) <= 30).length}
                                        </p>
                                    </div>
                                    <Clock className="h-12 w-12 text-yellow-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-green-600 bg-green-50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600">On Track (&gt;30 days)</p>
                                        <p className="text-3xl font-bold text-green-600 mt-2">
                                            {rfps.filter(r => getDaysUntil(r.deadline) > 30).length}
                                        </p>
                                    </div>
                                    <CalendarIcon className="h-12 w-12 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Timeline */}
                    <Card className="border-2 border-black bg-white">
                        <CardHeader>
                            <CardTitle>Upcoming Deadlines</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {sortedRfps.map((rfp) => {
                                    const daysUntil = getDaysUntil(rfp.deadline)
                                    const urgency = getUrgencyColor(daysUntil)

                                    return (
                                        <div
                                            key={rfp.id}
                                            className={`p-4 rounded-lg border-2 ${urgency.border} ${urgency.bg} hover:shadow-lg transition-shadow`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Badge variant="outline" className={`border-2 ${urgency.border} ${urgency.text}`}>
                                                            {urgency.badge}
                                                        </Badge>
                                                        <Badge variant="outline" className="border-black">
                                                            {rfp.fitScore}% Fit
                                                        </Badge>
                                                    </div>
                                                    <h3 className="font-bold text-lg mb-1">{rfp.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-2">{rfp.issuedBy}</p>
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <CalendarIcon className="h-4 w-4" />
                                                            <span>{new Date(rfp.deadline).toLocaleDateString('en-US', {
                                                                weekday: 'short',
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}</span>
                                                        </div>
                                                        <div className={`flex items-center gap-2 font-bold ${urgency.text}`}>
                                                            <Clock className="h-4 w-4" />
                                                            <span>{daysUntil > 0 ? `${daysUntil} days left` : 'OVERDUE'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Link href={`/rfp/${rfp.id}/details`}>
                                                    <Button variant="outline" className="border-2 border-black hover:bg-black hover:text-white">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}
