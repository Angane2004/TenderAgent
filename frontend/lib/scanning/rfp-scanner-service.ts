import { webScraper } from '../scraping/web-scraper'

export interface RFPScannerConfig {
    portalUrls: string[]
    scanInterval?: number // in milliseconds
    autoImport?: boolean
}

export interface ScannedRFPResult {
    title: string
    issuedBy: string
    deadline: string
    url: string
    fitScore?: number
    priority?: 'high' | 'medium' | 'low'
    scannedAt: string
}

/**
 * RFP Scanner Service
 * Automated scanning of tender portals for new RFPs
 */
export class RFPScannerService {
    private config: RFPScannerConfig
    private lastScanTime?: Date

    constructor(config: RFPScannerConfig) {
        this.config = config
    }

    /**
     * Scan all configured portals for new RFPs
     */
    async scanPortals(): Promise<ScannedRFPResult[]> {
        console.log(`[RFP Scanner] Starting scan of ${this.config.portalUrls.length} portals...`)

        const allRFPs: ScannedRFPResult[] = []

        for (const portalUrl of this.config.portalUrls) {
            try {
                console.log(`[RFP Scanner] Scanning ${portalUrl}...`)

                const rfps = await webScraper.scrapeEProcurement(portalUrl)

                const processedRFPs = rfps.map(rfp => ({
                    title: rfp.title,
                    issuedBy: rfp.issuedBy,
                    deadline: rfp.deadline,
                    url: rfp.url,
                    scannedAt: new Date().toISOString(),
                }))

                allRFPs.push(...processedRFPs)
                console.log(`[RFP Scanner] Found ${rfps.length} RFPs from ${portalUrl}`)
            } catch (error) {
                console.error(`[RFP Scanner] Failed to scan ${portalUrl}:`, error)
            }
        }

        this.lastScanTime = new Date()

        // Prioritize RFPs
        if (allRFPs.length > 0) {
            const prioritized = await this.prioritizeRFPs(allRFPs)
            return prioritized
        }

        return allRFPs
    }

    /**
     * Prioritize scanned RFPs based on deadline and relevance
     */
    private async prioritizeRFPs(rfps: ScannedRFPResult[]): Promise<ScannedRFPResult[]> {
        const now = new Date()

        return rfps.map(rfp => {
            const deadline = new Date(rfp.deadline)
            const daysUntilDeadline = Math.floor(
                (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            )

            let priority: 'high' | 'medium' | 'low' = 'low'

            if (daysUntilDeadline > 0 && daysUntilDeadline <= 30) {
                priority = 'high'
            } else if (daysUntilDeadline > 30 && daysUntilDeadline <= 90) {
                priority = 'medium'
            }

            // Simple fit score based on title keywords
            let fitScore = 50 // Default
            const title = rfp.title.toLowerCase()

            if (title.includes('cable') || title.includes('wire')) fitScore += 30
            if (title.includes('11kv') || title.includes('33kv')) fitScore += 10
            if (title.includes('xlpe')) fitScore += 10

            fitScore = Math.min(100, fitScore)

            return {
                ...rfp,
                priority,
                fitScore,
            }
        }).sort((a, b) => {
            // Sort by priority first, then fit score
            const priorityWeight = { high: 3, medium: 2, low: 1 }
            if (priorityWeight[b.priority!] !== priorityWeight[a.priority!]) {
                return priorityWeight[b.priority!] - priorityWeight[a.priority!]
            }
            return (b.fitScore || 0) - (a.fitScore || 0)
        })
    }

    /**
     * Get last scan time
     */
    getLastScanTime(): Date | undefined {
        return this.lastScanTime
    }

    /**
     * Check if a portal scan is needed
     */
    shouldScan(): boolean {
        if (!this.lastScanTime) return true

        const interval = this.config.scanInterval || 24 * 60 * 60 * 1000 // Default: 24 hours
        const timeSinceLastScan = Date.now() - this.lastScanTime.getTime()

        return timeSinceLastScan >= interval
    }
}

// Default configuration
const defaultConfig: RFPScannerConfig = {
    portalUrls: [
        // Add your tender portal URLs here
        // 'https://gem.gov.in/tenders',
        // 'https://eprocure.gov.in/eprocure/app',
    ],
    scanInterval: 24 * 60 * 60 * 1000, // 24 hours
    autoImport: false,
}

export const rfpScanner = new RFPScannerService(defaultConfig)
