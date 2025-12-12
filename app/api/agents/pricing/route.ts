import { NextRequest, NextResponse } from 'next/server'
import { pricingAgent } from '@/lib/agents/pricing-agent-service'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/agents/pricing
 * Process RFP with Pricing Agent
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { rfpId, selectedProduct, quantity, testingRequired, certifications, estimatedValue } = body

        if (!rfpId || !selectedProduct) {
            return NextResponse.json(
                { error: 'rfpId and selectedProduct are required' },
                { status: 400 }
            )
        }

        // Run the pricing agent
        const result = await pricingAgent.run({
            rfpId,
            selectedProduct,
            quantity: quantity || 1000,
            testingRequired: testingRequired || [],
            certifications: certifications || [],
            estimatedValue,
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
        console.error('Pricing Agent API Error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
