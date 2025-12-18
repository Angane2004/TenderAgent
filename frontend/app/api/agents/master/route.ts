import { NextRequest, NextResponse } from 'next/server'
import { masterAgent } from '@/lib/agents/master-agent-service'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for long-running agent operations

/**
 * POST /api/agents/master
 * Orchestrate all agents (Sales -> Technical -> Pricing)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { rfpId, rfpUrl, rfpText } = body

        if (!rfpId) {
            return NextResponse.json(
                { error: 'rfpId is required' },
                { status: 400 }
            )
        }

        // Run the master agent (orchestrates all agents)
        const result = await masterAgent.run({
            rfpId,
            rfpUrl,
            rfpText,
        })

        if (result.status === 'error') {
            return NextResponse.json(
                { error: result.error, logs: result.logs },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            logs: result.logs,
        })
    } catch (error) {
        console.error('Master Agent API Error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
