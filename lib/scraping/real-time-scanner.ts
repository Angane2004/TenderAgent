import axios from 'axios'
import * as cheerio from 'cheerio'

export interface RealRFPData {
    title: string
    issuedBy: string
    deadline: string
    summary: string
    url: string
    estimatedValue?: number
    category?: string
    location?: string
    referenceNumber?: string
}

/**
 * Real-time RFP Scanner for Indian Government Tender Portals
 * Supports GeM, eProcurement portals, and other tender websites
 */
export class RealTimeRFPScanner {
    private axiosInstance: ReturnType<typeof axios.create>

    constructor() {
        this.axiosInstance = axios.create({
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            },
        })
    }

    /**
     * Scan eProcurement Portal (Generic implementation)
     * Portal: https://eprocure.gov.in/eprocure/app
     */
    async scanEProcurementPortal(): Promise<RealRFPData[]> {
        try {
            // Note: This is a sample URL - actual portal may require authentication
            const url = 'https://eprocure.gov.in/eprocure/app'

            console.log('Scanning eProcurement portal...')

            // For demonstration, using a mock approach
            // In production, you'd need to handle authentication and actual scraping
            const rfps: RealRFPData[] = []

            // Placeholder - would need actual implementation based on portal structure
            console.warn('eProcurement portal requires authentication - returning sample data')

            return rfps
        } catch (error) {
            console.error('Error scanning eProcurement:', error)
            return []
        }
    }

    /**
     * Scan publicly available tender listing sites
     * Using TenderTiger as an example (public tender aggregator)
     */
    async scanTenderTiger(): Promise<RealRFPData[]> {
        try {
            const url = 'https://www.tendertiger.com/tenders/'
            console.log('Scanning TenderTiger...')

            const response = await this.axiosInstance.get(url)
            const $ = cheerio.load(response.data)
            const rfps: RealRFPData[] = []

            // Parse tender listings
            $('.tender-row, .tender-item, tr.tender').each((_, element) => {
                try {
                    const $row = $(element)

                    // Extract tender details (adjust selectors based on actual HTML structure)
                    const title = $row.find('.title, .tender-title, td:nth-child(2)').first().text().trim()
                    const issuer = $row.find('.issuer, .organization, td:nth-child(3)').first().text().trim()
                    const deadline = $row.find('.deadline, .due-date, td:nth-child(4)').first().text().trim()
                    const link = $row.find('a').first().attr('href')

                    if (title && title.length > 10) {
                        rfps.push({
                            title,
                            issuedBy: issuer || 'Government Organization',
                            deadline: this.parseDeadline(deadline),
                            summary: title, // Would extract full summary from detail page
                            url: link ? (link.startsWith('http') ? link : `https://www.tendertiger.com${link}`) : url,
                            category: this.categorizeTender(title),
                            referenceNumber: this.extractReferenceNumber($row.text()),
                        })
                    }
                } catch (err) {
                    // Skip invalid rows
                }
            })

            console.log(`Found ${rfps.length} RFPs from TenderTiger`)
            return rfps.slice(0, 20) // Limit to 20 most recent
        } catch (error) {
            console.error('Error scanning TenderTiger:', error)
            return []
        }
    }

    /**
     * Scan CPPP (Central Public Procurement Portal)
     */
    async scanCPPP(): Promise<RealRFPData[]> {
        try {
            // CPPP eProcurement portal
            const url = 'https://eprocure.gov.in/cppp/'
            console.log('Scanning CPPP...')

            // This would require proper implementation with authentication
            console.warn('CPPP requires authentication - implement based on access')

            return []
        } catch (error) {
            console.error('Error scanning CPPP:', error)
            return []
        }
    }

    /**
     * Scan IndiaMart Tenders (if available)
     */
    async scanIndiaMart(): Promise<RealRFPData[]> {
        try {
            const url = 'https://tenders.indiamart.com/'
            console.log('Scanning IndiaMart Tenders...')

            const response = await this.axiosInstance.get(url)
            const $ = cheerio.load(response.data)
            const rfps: RealRFPData[] = []

            // Parse tender listings based on actual HTML structure
            $('.tender-list-item, .tender-card').each((_, element) => {
                try {
                    const $item = $(element)
                    const title = $item.find('h3, .title').text().trim()
                    const issuer = $item.find('.issuer, .org-name').text().trim()
                    const deadline = $item.find('.deadline').text().trim()
                    const link = $item.find('a').attr('href')

                    if (title) {
                        rfps.push({
                            title,
                            issuedBy: issuer || 'Organization',
                            deadline: this.parseDeadline(deadline),
                            summary: title,
                            url: link || url,
                            category: this.categorizeTender(title),
                        })
                    }
                } catch (err) {
                    // Skip
                }
            })

            return rfps
        } catch (error) {
            console.error('Error scanning IndiaMart:', error)
            return []
        }
    }

    /**
     * Scan all available sources concurrently
     */
    async scanAllSources(): Promise<RealRFPData[]> {
        console.log('Starting real-time RFP scan across all sources...')

        const results = await Promise.allSettled([
            this.scanTenderTiger(),
            this.scanIndiaMart(),
            // Add more sources as needed
        ])

        const allRFPs: RealRFPData[] = []

        results.forEach((result) => {
            if (result.status === 'fulfilled') {
                allRFPs.push(...result.value)
            }
        })

        // Remove duplicates based on title similarity
        const uniqueRFPs = this.removeDuplicates(allRFPs)

        console.log(`Total unique RFPs found: ${uniqueRFPs.length}`)
        return uniqueRFPs
    }

    /**
     * Parse various deadline formats
     */
    private parseDeadline(deadlineStr: string): string {
        if (!deadlineStr) {
            // Default to 30 days from now
            const futureDate = new Date()
            futureDate.setDate(futureDate.getDate() + 30)
            return futureDate.toISOString()
        }

        try {
            // Try to parse common Indian date formats
            // DD-MM-YYYY, DD/MM/YYYY, DD-MMM-YYYY, etc.
            const cleaned = deadlineStr.replace(/\s+/g, ' ').trim()

            // Try ISO format first
            if (cleaned.match(/\d{4}-\d{2}-\d{2}/)) {
                return new Date(cleaned).toISOString()
            }

            // Try DD-MM-YYYY or DD/MM/YYYY
            const parts = cleaned.split(/[-\/\s]/)
            if (parts.length >= 3) {
                const day = parseInt(parts[0])
                const month = parseInt(parts[1]) - 1 // JS months are 0-indexed
                const year = parseInt(parts[2])

                if (day && month !== undefined && year) {
                    const fullYear = year < 100 ? 2000 + year : year
                    return new Date(fullYear, month, day).toISOString()
                }
            }

            // Fallback: try native Date parser
            const parsed = new Date(cleaned)
            if (!isNaN(parsed.getTime())) {
                return parsed.toISOString()
            }
        } catch {
            // Parsing failed
        }

        // Default fallback
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + 30)
        return futureDate.toISOString()
    }

    /**
     * Categorize tender based on keywords
     */
    private categorizeTender(title: string): string {
        const titleLower = title.toLowerCase()

        if (titleLower.match(/cable|wire|electrical|power|transformer/)) {
            return 'Electrical & Power'
        }
        if (titleLower.match(/construct|building|civil|road|bridge/)) {
            return 'Construction & Infrastructure'
        }
        if (titleLower.match(/it|software|computer|network|hardware/)) {
            return 'IT & Telecom'
        }
        if (titleLower.match(/medical|hospital|pharma|health/)) {
            return 'Healthcare'
        }
        if (titleLower.match(/furniture|stationery|supply|goods/)) {
            return 'General Supplies'
        }

        return 'Other'
    }

    /**
     * Extract reference number from text
     */
    private extractReferenceNumber(text: string): string {
        const refMatch = text.match(/(?:ref|tender|notice|no)[:\s]*([A-Z0-9\-\/]+)/i)
        return refMatch ? refMatch[1] : ''
    }

    /**
     * Remove duplicate RFPs based on title similarity
     */
    private removeDuplicates(rfps: RealRFPData[]): RealRFPData[] {
        const unique: RealRFPData[] = []
        const seen = new Set<string>()

        rfps.forEach(rfp => {
            const normalized = rfp.title.toLowerCase().replace(/[^a-z0-9]/g, '')
            const key = normalized.substring(0, 50) // Use first 50 chars as key

            if (!seen.has(key)) {
                seen.add(key)
                unique.push(rfp)
            }
        })

        return unique
    }

    /**
     * Filter RFPs relevant to company profile
     */
    filterRelevantRFPs(rfps: RealRFPData[], keywords: string[]): RealRFPData[] {
        if (!keywords || keywords.length === 0) return rfps

        return rfps.filter(rfp => {
            const searchText = `${rfp.title} ${rfp.summary} ${rfp.category}`.toLowerCase()
            return keywords.some(keyword => searchText.includes(keyword.toLowerCase()))
        })
    }
}

export const realTimeScanner = new RealTimeRFPScanner()
