import { AgentBase } from './agent-base'
import { webScraper } from '../scraping/web-scraper'
import { documentParser } from '../scraping/document-parser'

export interface SalesAgentInput {
    rfpUrl?: string
    rfpDocument?: Buffer
    rfpText?: string
    rfpId: string
}

export interface SalesAgentOutput {
    scopeOfSupply: string
    quantity: string
    testingRequired: string[]
    certifications: string[]
    deliveryTimeline: string
    estimatedValue?: number
    extractedSpecs?: {
        voltage?: string
        size?: string
        conductor?: string
        insulation?: string
        armoring?: string
        standard?: string
        quantity?: number
    }
    status: 'completed' | 'pending'
}

/**
 * Sales Discovery Agent
 * Scans RFPs, extracts specifications, and prepares summaries
 */
export class SalesAgent extends AgentBase<SalesAgentInput, SalesAgentOutput> {
    constructor() {
        super('Sales Agent')
    }

    async execute(input: SalesAgentInput): Promise<SalesAgentOutput> {
        this.log('Scanning RFP URL and documents...', 'processing', 10)

        // Step 1: Get RFP content
        let rfpText = input.rfpText || ''
        let specs = {}

        if (input.rfpUrl && !rfpText) {
            this.log('Scraping RFP from URL...', 'processing', 20)
            const scrapedData = await webScraper.scrapeRFPPage(input.rfpUrl)
            rfpText = scrapedData.summary

            // Download and parse any PDF documents
            if (scrapedData.documentUrls.length > 0) {
                this.log('Downloading and parsing RFP documents...', 'processing', 30)
                for (const docUrl of scrapedData.documentUrls.slice(0, 2)) { // Limit to first 2 docs
                    try {
                        const buffer = await webScraper.downloadDocument(docUrl)
                        const parsed = await documentParser.parsePDF(buffer)
                        rfpText += '\n\n' + parsed.text
                    } catch (error) {
                        this.log(`Failed to download document: ${docUrl}`, 'processing')
                    }
                }
            }
        } else if (input.rfpDocument) {
            this.log('Parsing PDF document...', 'processing', 20)
            const parsed = await documentParser.parsePDF(input.rfpDocument)
            rfpText = parsed.text
        }

        if (!rfpText) {
            throw new Error('No RFP content available to analyze')
        }

        // Step 2: Extract specifications using regex
        this.log('Extracting tender specifications...', 'processing', 40)
        specs = documentParser.extractSpecifications(rfpText)
        const testingReqs = documentParser.extractTestingRequirements(rfpText)
        const certifications = documentParser.extractCertifications(rfpText)
        const deliveryTimeline = documentParser.extractDeliveryTimeline(rfpText)

        // Step 3: Use AI to analyze scope of supply
        this.log('Analyzing scope of supply...', 'processing', 60)

        const scopePrompt = `
Analyze this RFP/tender document and provide a concise scope of supply description (1-2 sentences).

RFP Text:
${rfpText.substring(0, 8000)}

Provide only the scope of supply description, no other text.
`

        const scopeOfSupply = await this.callAI(
            scopePrompt,
            'You are an expert in analyzing electrical cables and wires RFP documents.',
            { temperature: 0.3, maxTokens: 200 }
        )

        // Step 4: Extract quantity with AI if not found
        this.log('Identifying testing requirements...', 'processing', 80)

        let quantity = 'Not specified'
        if (specs.quantity) {
            quantity = `${specs.quantity.toLocaleString()} meters`
        } else {
            // Try to extract with AI
            const qtyPrompt = `Extract the total quantity in meters from this RFP. Return only the number, or "Not specified" if not found:\n\n${rfpText.substring(0, 4000)}`
            const qtyResponse = await this.callAI(qtyPrompt, undefined, { temperature: 0.1, maxTokens: 50 })
            quantity = qtyResponse.trim()
        }

        // Step 5: Estimate value if quantity is available
        let estimatedValue: number | undefined
        if (specs.quantity && specs.voltage) {
            // Simple estimation based on voltage (would be more sophisticated in production)
            const pricePerMeter = specs.voltage.includes('33') ? 3500 :
                specs.voltage.includes('22') ? 2000 :
                    specs.voltage.includes('11') ? 1200 : 500
            estimatedValue = specs.quantity * pricePerMeter
        }

        this.log('Preparing summary for Master Agent...', 'processing', 95)

        return {
            scopeOfSupply: scopeOfSupply.trim(),
            quantity,
            testingRequired: testingReqs.length > 0 ? testingReqs : ['Routine Tests', 'Type Tests'],
            certifications: certifications.length > 0 ? certifications : ['BIS Certification', 'ISO 9001:2015'],
            deliveryTimeline: deliveryTimeline || 'As per RFP requirements',
            estimatedValue,
            extractedSpecs: specs,
            status: 'completed',
        }
    }

    /**
     * Scan tender portals for new RFPs (useful for automated monitoring)
     */
    async scanTenderPortals(portalUrls: string[]): Promise<any[]> {
        this.log('Scanning tender portals for new RFPs...', 'processing', 0)

        const allRFPs: any[] = []

        for (const url of portalUrls) {
            try {
                const rfps = await webScraper.scrapeEProcurement(url)
                allRFPs.push(...rfps)
                this.log(`Found ${rfps.length} RFPs from ${url}`, 'processing')
            } catch (error) {
                this.log(`Failed to scan ${url}: ${error}`, 'processing')
            }
        }

        this.log(`Total RFPs found: ${allRFPs.length}`, 'completed', 100)
        return allRFPs
    }

    /**
     * Prioritize RFPs based on fit score
     */
    async prioritizeRFPs(rfps: any[]): Promise<any[]> {
        this.log('Prioritizing RFPs based on fit score...', 'processing', 0)

        // This would use AI to calculate fit scores based on company capabilities
        // For now, simple deadline-based prioritization
        const now = new Date()

        const prioritized = rfps
            .map(rfp => {
                const deadline = new Date(rfp.deadline)
                const daysUntilDeadline = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

                return {
                    ...rfp,
                    daysUntilDeadline,
                    priority: daysUntilDeadline < 30 && daysUntilDeadline > 3 ? 'high' :
                        daysUntilDeadline >= 30 && daysUntilDeadline < 90 ? 'medium' : 'low',
                }
            })
            .sort((a, b) => {
                const priorityWeight = { high: 3, medium: 2, low: 1 }
                return priorityWeight[b.priority] - priorityWeight[a.priority]
            })

        this.log('RFP prioritization completed', 'completed', 100)
        return prioritized
    }
}

export const salesAgent = new SalesAgent()
