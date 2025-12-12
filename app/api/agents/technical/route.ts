import { NextRequest, NextResponse } from 'next/server'
import { technicalAgent } from '@/lib/agents/technical-agent-service'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/agents/technical
 * Process RFP with Technical Agent
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { rfpId, extractedSpecs, testingRequired, certifications } = body

        if (!rfpId) {
            return NextResponse.json(
                { error: 'rfpId is required' },
                { status: 400 }
            )
        }

        // Run the technical agent
        const result = await technicalAgent.run({
            rfpId,
            extractedSpecs: extractedSpecs || {},
            testingRequired: testingRequired || [],
            certifications: certifications || [],
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
        console.error('Technical Agent API Error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
