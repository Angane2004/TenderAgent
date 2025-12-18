import { NextRequest, NextResponse } from 'next/server'
import { responseGenerator } from '@/lib/agents/response-generator-service'
import { MasterAgentOutput } from '@/lib/agents/master-agent-service'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/agents/response
 * Generate final RFP response document
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { rfpId, rfpTitle, masterAgentOutput } = body

        if (!rfpId || !rfpTitle || !masterAgentOutput) {
            return NextResponse.json(
                { error: 'rfpId, rfpTitle, and masterAgentOutput are required' },
                { status: 400 }
            )
        }

        // Generate the response
        const result = await responseGenerator.generateResponse({
            rfpId,
            rfpTitle,
            masterAgentOutput: masterAgentOutput as MasterAgentOutput,
        })

        // Convert buffer to base64 for JSON transport
        const pdfBase64 = result.pdfBuffer?.toString('base64')

        return NextResponse.json({
            success: true,
            data: {
                ...result,
                pdfBuffer: undefined, // Remove buffer from response
                pdfBase64, // Send as base64 instead
            },
        })
    } catch (error) {
        console.error('Response Generator API Error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

/**
 * GET /api/agents/response/preview?rfpId=xxx
 * Get markdown preview of response
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const masterOutputStr = searchParams.get('masterOutput')

        if (!masterOutputStr) {
            return NextResponse.json(
                { error: 'masterOutput is required' },
                { status: 400 }
            )
        }

        const masterOutput: MasterAgentOutput = JSON.parse(masterOutputStr)
        const markdown = responseGenerator.generateMarkdownSummary(masterOutput)

        return NextResponse.json({
            success: true,
            markdown,
        })
    } catch (error) {
        console.error('Response Preview API Error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
