import { NextRequest, NextResponse } from 'next/server'
import { salesAgent } from '@/lib/agents/sales-agent-service'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/agents/sales
 * Process RFP with Sales Agent
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

        if (!rfpUrl && !rfpText) {
            return NextResponse.json(
                { error: 'Either rfpUrl or rfpText is required' },
                { status: 400 }
            )
        }

        // Run the sales agent
        const result = await salesAgent.run({
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
        console.error('Sales Agent API Error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
