"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Loader2 } from "lucide-react"

interface AgentLogEntry {
    message: string
    status: 'processing' | 'completed'
    progress?: number
}

interface AgentLogProps {
    logs: AgentLogEntry[]
    agentName: string
}

export function AgentLog({ logs, agentName }: AgentLogProps) {
    const [visibleLogs, setVisibleLogs] = useState<AgentLogEntry[]>([])

    useEffect(() => {
        logs.forEach((log, index) => {
            setTimeout(() => {
                setVisibleLogs(prev => [...prev, log])
            }, index * 800)
        })
    }, [logs])

    return (
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="text-lg font-semibold text-white">{agentName} Activity Log</h3>
                </div>

                <div className="space-y-3">
                    {visibleLogs.map((log, index) => (
                        <div key={index} className="flex items-start gap-3 animate-slideIn">
                            {log.status === 'completed' ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            ) : (
                                <Loader2 className="h-5 w-5 text-blue-500 animate-spin mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                                <p className="text-sm text-slate-200">{log.message}</p>
                                {log.progress !== undefined && (
                                    <Progress value={log.progress} className="mt-2 h-1" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
