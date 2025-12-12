import { NextRequest, NextResponse } from 'next/server'
import { realTimeScanner } from '@/lib/scraping/real-time-scanner'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60 // Allow up to 60 seconds for scanning

/**
 * POST /api/scan-rfps
 * Server-side RFP scanning to avoid CORS issues
 */
export async function POST(request: NextRequest) {
    try {
        console.log('[API] Starting RFP scan...')

        // Perform the scan on the server
        const scannedRFPs = await realTimeScanner.scanAllSources()

        console.log(`[API] Scan complete. Found ${scannedRFPs.length} RFPs`)

        return NextResponse.json({
            success: true,
            count: scannedRFPs.length,
            rfps: scannedRFPs,
        })
    } catch (error: any) {
        console.error('[API] Scan error:', error.message)

        // Return empty array instead of error to allow fallback to demo data
        return NextResponse.json({
            success: false,
            count: 0,
            rfps: [],
            error: error.message,
        })
    }
}

/**
 * GET /api/scan-rfps
 * Check scanner status
 */
export async function GET(request: NextRequest) {
    return NextResponse.json({
        status: 'ready',
        message: 'RFP scanner is ready. POST to this endpoint to start scanning.',
    })
}
