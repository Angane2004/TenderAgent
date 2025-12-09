"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar as CalendarIcon, Clock, AlertCircle, Download, ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react"
import { RFP } from "@/types"
import Link from "next/link"
import { useRFPs } from "@/contexts/rfp-context"
import GradientBackground from "@/components/background/gradient-background"
import { formatINR } from "@/lib/currency"

export default function CalendarPage() {
    const { rfps } = useRFPs() // Use RFP context instead of local storage
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedRFP, setSelectedRFP] = useState<RFP | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

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
            const date = new Date(rfp.deadline)
            const dateStr = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

            icsContent += `BEGIN:VEVENT
UID:${rfp.id}@tenderagent.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'}
DTSTART:${dateStr}
DTEND:${dateStr}
SUMMARY:Deadline: ${rfp.title}
DESCRIPTION:${rfp.summary}
STATUS:CONFIRMED
END:VEVENT
`
        })

        icsContent += 'END:VCALENDAR'

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'tender-deadlines.ics')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Calendar grid helpers
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const getRFPsForDate = (date: Date) => {
        return rfps.filter(rfp => {
            const rfpDate = new Date(rfp.deadline)
            return rfpDate.toDateString() === date.toDateString()
        })
    }

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth)
        const firstDay = getFirstDayOfMonth(currentMonth)
        const days = []

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(null)
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day)
        }

        return days
    }

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
    }

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    }

    const isToday = (day: number) => {
        const today = new Date()
        return day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear()
    }



    return (
        <div className="flex h-screen bg-gray-50 relative">
            <GradientBackground />
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen">
                <Header />

                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Tender Calendar & Deadlines</h1>
                            <p className="text-gray-600 mt-1">Track all your tender deadlines in one place</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
                                variant="outline"
                                className="border-2 border-black hover:bg-black hover:text-white"
                            >
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                {viewMode === 'list' ? 'Calendar View' : 'List View'}
                            </Button>
                            <Button
                                onClick={downloadICS}
                                className="bg-black text-white hover:bg-gray-800"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export to Calendar
                            </Button>
                        </div>
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

                    {/* Timeline or Calendar Grid */}
                    {viewMode === 'list' ? (
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
                    ) : (
                        <Card className="border-2 border-black bg-white">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>
                                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={prevMonth}
                                            className="border-2 border-black hover:bg-black hover:text-white"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={nextMonth}
                                            className="border-2 border-black hover:bg-black hover:text-white"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-2">
                                    {/* Day headers */}
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="text-center font-bold text-sm p-2 border-b-2 border-black">
                                            {day}
                                        </div>
                                    ))}

                                    {/* Calendar days */}
                                    {generateCalendarDays().map((day, index) => {
                                        if (day === null) {
                                            return <div key={`empty-${index}`} className="min-h-[120px] p-2 border border-gray-200 bg-gray-50" />
                                        }

                                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                                        const dayRFPs = getRFPsForDate(date)
                                        const today = isToday(day)

                                        return (
                                            <div
                                                key={day}
                                                className={`min-h-[120px] p-2 border-2 ${today ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                                    } hover:border-black transition-all`}
                                            >
                                                <div className={`text-sm font-bold mb-2 ${today ? 'text-blue-600' : ''}`}>
                                                    {day}
                                                </div>
                                                <div className="space-y-1">
                                                    {dayRFPs.map(rfp => {
                                                        const daysUntil = getDaysUntil(rfp.deadline)
                                                        const urgency = getUrgencyColor(daysUntil)
                                                        return (
                                                            <div
                                                                key={rfp.id}
                                                                onClick={() => {
                                                                    setSelectedRFP(rfp)
                                                                    setModalOpen(true)
                                                                }}
                                                                className={`text-xs p-2 rounded-md ${urgency.bg} ${urgency.text} border-2 ${urgency.border} hover:shadow-lg transition-all cursor-pointer`}
                                                            >
                                                                <p className="font-bold truncate" title={rfp.title}>
                                                                    {rfp.title}
                                                                </p>
                                                                <p className="text-[10px] opacity-75 truncate">
                                                                    {rfp.issuedBy}
                                                                </p>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </main>
            </div>

            {/* Tender Detail Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    {selectedRFP && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold pr-8">
                                    {selectedRFP.title}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-3">
                                        <p className="text-xs text-blue-600 font-semibold">Fit Score</p>
                                        <p className="text-2xl font-bold text-blue-600">{selectedRFP.fitScore}%</p>
                                    </div>
                                    <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-3">
                                        <p className="text-xs text-gray-600 font-semibold">Days Left</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {getDaysUntil(selectedRFP.deadline)}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3">
                                        <p className="text-xs text-green-600 font-semibold">Est. Value</p>
                                        <p className="text-lg font-bold text-green-600">
                                            {formatINR(selectedRFP.pricingStrategy?.totalValue || 500000, { compact: true })}
                                        </p>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Issued By</p>
                                        <p className="text-sm font-medium">{selectedRFP.issuedBy}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Deadline</p>
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                                            <p className="text-sm font-medium">
                                                {new Date(selectedRFP.deadline).toLocaleDateString('en-IN', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Summary</p>
                                        <p className="text-sm text-gray-700">{selectedRFP.summary}</p>
                                    </div>

                                    {selectedRFP.certifications && selectedRFP.certifications.length > 0 && (
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Required Certifications</p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedRFP.certifications.map((cert, idx) => (
                                                    <Badge key={idx} variant="outline" className="border-black">
                                                        {cert}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                                    <Link href={`/rfp/${selectedRFP.id}/details`} className="flex-1">
                                        <Button
                                            variant="outline"
                                            className="w-full border-2 border-black hover:bg-black hover:text-white"
                                            onClick={() => setModalOpen(false)}
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View Full Details
                                        </Button>
                                    </Link>
                                    <Link href={`/rfp/${selectedRFP.id}/sales-agent`} className="flex-1">
                                        <Button
                                            className="w-full bg-black text-white hover:bg-gray-800"
                                            onClick={() => setModalOpen(false)}
                                        >
                                            Start Response
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
