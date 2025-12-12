import axios from 'axios'
import * as cheerio from 'cheerio'
import { aiConfig } from '../config/ai-config'

export interface ScrapedRFP {
    title: string
    issuedBy: string
    summary: string
    deadline: string
    url: string
    documentUrls: string[]
    metadata: Record<string, any>
}

export interface ScrapeOptions {
    timeout?: number
    useProxy?: boolean
}

/**
 * Web scraper for RFP portals and documents
 */
export class WebScraper {
    private axiosInstance: ReturnType<typeof axios.create>

    constructor() {
        this.axiosInstance = axios.create({
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        })

        // Add proxy if configured
        if (aiConfig.scraping.proxyUrl) {
            // Proxy configuration would go here
        }
    }

    /**
     * Scrape an RFP page from a URL
     */
    async scrapeRFPPage(url: string, options: ScrapeOptions = {}): Promise<ScrapedRFP> {
        try {
            const response = await this.axiosInstance.get(url, {
                timeout: options.timeout || 30000,
            })

            const $ = cheerio.load(response.data)

            // Generic extraction - can be customized per portal
            const title = this.extractTitle($)
            const issuedBy = this.extractOrganization($)
            const deadline = this.extractDeadline($)
            const summary = this.extractSummary($)
            const documentUrls = this.extractDocumentUrls($, url)

            return {
                title,
                issuedBy,
                summary,
                deadline,
                url,
                documentUrls,
                metadata: {
                    scrapedAt: new Date().toISOString(),
                    source: new URL(url).hostname,
                },
            }
        } catch (error) {
            console.error('Scraping error:', error)
            throw new Error(`Failed to scrape URL: ${url}`)
        }
    }

    /**
     * Scrape GeM (Government e-Marketplace) portal
     */
    async scrapeGeMPortal(bidNumber?: string): Promise<ScrapedRFP[]> {
        // GeM portal specific implementation
        // This would require authentication and specific selectors
        const baseUrl = 'https://gem.gov.in'

        // For now, return mock data structure
        // Real implementation would parse GeM's tender list
        console.warn('GeM scraping requires authentication and specific implementation')
        return []
    }

    /**
     * Scrape eProcurement portal (generic implementation)
     */
    async scrapeEProcurement(portalUrl: string): Promise<ScrapedRFP[]> {
        try {
            const response = await this.axiosInstance.get(portalUrl)
            const $ = cheerio.load(response.data)

            const rfps: ScrapedRFP[] = []

            // Generic tender row extraction
            // Selectors would need to be customized per portal
            $('table.tender-list tr, .tender-row, .rfp-item').each((_, element) => {
                try {
                    const $row = $(element)

                    // Extract tender details
                    const title = $row.find('.title, .tender-title, h3, h4').first().text().trim()
                    const issuedBy = $row.find('.organization, .issuer').first().text().trim()
                    const deadline = $row.find('.deadline, .due-date').first().text().trim()
                    const link = $row.find('a').first().attr('href')

                    if (title && link) {
                        const fullUrl = link.startsWith('http') ? link : new URL(link, portalUrl).href

                        rfps.push({
                            title,
                            issuedBy: issuedBy || 'Unknown',
                            summary: title, // Would be extracted from detail page
                            deadline: deadline || '',
                            url: fullUrl,
                            documentUrls: [],
                            metadata: {
                                scrapedAt: new Date().toISOString(),
                                source: new URL(portalUrl).hostname,
                            },
                        })
                    }
                } catch (err) {
                    // Skip invalid rows
                    console.warn('Failed to parse row:', err)
                }
            })

            return rfps
        } catch (error) {
            console.error('eProcurement scraping error:', error)
            return []
        }
    }

    /**
     * Download and parse PDF document
     */
    async downloadDocument(url: string): Promise<Buffer> {
        try {
            const response = await this.axiosInstance.get(url, {
                responseType: 'arraybuffer',
            })
            return Buffer.from(response.data)
        } catch (error) {
            console.error('Document download error:', error)
            throw new Error(`Failed to download document: ${url}`)
        }
    }

    // Helper methods for extracting common fields

    private extractTitle($: cheerio.CheerioAPI): string {
        return (
            $('h1').first().text().trim() ||
            $('.tender-title, .rfp-title').first().text().trim() ||
            $('title').text().trim() ||
            'Untitled RFP'
        )
    }

    private extractOrganization($: cheerio.CheerioAPI): string {
        return (
            $('.organization, .issuer, .department').first().text().trim() ||
            $('meta[name="organization"]').attr('content') ||
            'Unknown Organization'
        )
    }

    private extractDeadline($: cheerio.CheerioAPI): string {
        const deadline = (
            $('.deadline, .due-date, .submission-date').first().text().trim() ||
            $('meta[name="deadline"]').attr('content') ||
            ''
        )
        return deadline
    }

    private extractSummary($: cheerio.CheerioAPI): string {
        return (
            $('.summary, .description, .overview').first().text().trim() ||
            $('meta[name="description"]').attr('content') ||
            $('p').first().text().trim() ||
            ''
        ).substring(0, 500) // Limit to 500 chars
    }

    private extractDocumentUrls($: cheerio.CheerioAPI, baseUrl: string): string[] {
        const urls: string[] = []

        $('a[href$=".pdf"], a[href*="/download"], .document-link').each((_, element) => {
            const href = $(element).attr('href')
            if (href) {
                try {
                    const fullUrl = href.startsWith('http') ? href : new URL(href, baseUrl).href
                    urls.push(fullUrl)
                } catch {
                    // Invalid URL, skip
                }
            }
        })

        return urls
    }

    /**
     * Extract text content from HTML
     */
    extractTextContent(html: string): string {
        const $ = cheerio.load(html)

        // Remove scripts and styles
        $('script, style, nav, header, footer').remove()

        // Get main content
        const content = $('main, article, .content, .main-content, body').first().text()

        // Clean whitespace
        return content.replace(/\s+/g, ' ').trim()
    }
}

export const webScraper = new WebScraper()
