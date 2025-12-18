// @ts-ignore - pdf-parse doesn't have proper types
import pdf from 'pdf-parse'

export interface ParsedDocument {
    text: string
    pages: number
    metadata?: Record<string, any>
}

export interface ExtractedSpecs {
    voltage?: string
    size?: string
    conductor?: string
    insulation?: string
    armoring?: string
    standard?: string
    quantity?: number
}

/**
 * Document parser for PDFs and text extraction
 */
export class DocumentParser {
    /**
     * Parse PDF buffer to text
     */
    async parsePDF(buffer: Buffer): Promise<ParsedDocument> {
        try {
            const data = await pdf(buffer)

            return {
                text: data.text,
                pages: data.numpages,
                metadata: data.info,
            }
        } catch (error) {
            console.error('PDF parsing error:', error)
            throw new Error('Failed to parse PDF document')
        }
    }

    /**
     * Extract specifications from text using regex patterns
     */
    extractSpecifications(text: string): ExtractedSpecs {
        const specs: ExtractedSpecs = {}

        // Voltage patterns
        const voltageMatch = text.match(/(\d+\.?\d*)\s*(kV|KV|kilovolt)/i)
        if (voltageMatch) {
            specs.voltage = `${voltageMatch[1]}kV`
        }

        // Size/Cross-section patterns
        const sizeMatch = text.match(/(\d+C?\s*x\s*\d+\.?\d*)\s*(sq\.?\s*mm|sqmm|mm2|mm²)/i)
        if (sizeMatch) {
            specs.size = sizeMatch[1].trim()
        }

        // Conductor type
        const conductorMatch = text.match(/conductor[:\s]*(aluminum|copper|al|cu)/i)
        if (conductorMatch) {
            const material = conductorMatch[1].toLowerCase()
            specs.conductor = material === 'al' ? 'Aluminum' : material === 'cu' ? 'Copper' :
                material.charAt(0).toUpperCase() + material.slice(1)
        }

        // Insulation type
        const insulationMatch = text.match(/insulation[:\s]*(XLPE|PVC|LSZH|EPR|FR-?PVC)/i)
        if (insulationMatch) {
            specs.insulation = insulationMatch[1].toUpperCase()
        }

        // Armoring type
        const armoringMatch = text.match(/armor(?:ing|ed)?[:\s]*(SWA|AWA|Steel Wire|Aluminum Wire|Unarmored|None)/i)
        if (armoringMatch) {
            specs.armoring = armoringMatch[1]
        }

        // Standard
        const standardMatch = text.match(/(IS\s*\d+|IEC\s*\d+[-\d]*|BS\s*\d+|ASTM\s*[A-Z]?\d+)/i)
        if (standardMatch) {
            specs.standard = standardMatch[1].toUpperCase().replace(/\s+/g, ' ')
        }

        // Quantity
        const quantityMatch = text.match(/quantity[:\s]*(\d+[\d,]*)\s*(meter|metre|m|km)/i)
        if (quantityMatch) {
            const qty = quantityMatch[1].replace(/,/g, '')
            const unit = quantityMatch[2].toLowerCase()
            specs.quantity = unit === 'km' ? parseInt(qty) * 1000 : parseInt(qty)
        }

        return specs
    }

    /**
     * Extract testing requirements from text
     */
    extractTestingRequirements(text: string): string[] {
        const tests: Set<string> = new Set()

        const testPatterns = [
            /routine\s+test/i,
            /type\s+test/i,
            /sample\s+test/i,
            /high\s+voltage\s+test/i,
            /partial\s+discharge\s+test/i,
            /conductor\s+resistance\s+test/i,
            /insulation\s+resistance\s+test/i,
            /impulse\s+voltage\s+test/i,
            /thermal\s+cycling\s+test/i,
            /flame\s+retardant\s+test/i,
            /fire\s+survival\s+test/i,
            /smoke\s+density\s+test/i,
            /uv\s+resistance\s+test/i,
            /weather\s+resistance\s+test/i,
            /tensile\s+strength\s+test/i,
        ]

        for (const pattern of testPatterns) {
            const match = text.match(pattern)
            if (match) {
                // Capitalize first letter
                const testName = match[0].charAt(0).toUpperCase() + match[0].slice(1)
                tests.add(testName)
            }
        }

        return Array.from(tests)
    }

    /**
     * Extract certifications from text
     */
    extractCertifications(text: string): string[] {
        const certs: Set<string> = new Set()

        const certPatterns = [
            /BIS\s+Certif(?:ication|ied)/i,
            /ISO\s+\d+:\d+/i,
            /IEC\s+Certif(?:ication|ied)/i,
            /CPRI\s+Approv(?:ed|al)/i,
            /RDSO\s+Approv(?:ed|al)/i,
            /NABL\s+Accredit(?:ed|ation)/i,
            /BS\s+\d+\s+(?:CWZ|Category)/i,
            /LSZH\s+Certif(?:icate|ied)/i,
            /Factory\s+Inspection\s+Certificate/i,
            /Fire\s+Test\s+Certificate/i,
            /Weather\s+Test\s+Certificate/i,
        ]

        for (const pattern of certPatterns) {
            const match = text.match(pattern)
            if (match) {
                certs.add(match[0].trim())
            }
        }

        return Array.from(certs)
    }

    /**
     * Extract delivery timeline from text
     */
    extractDeliveryTimeline(text: string): string | null {
        const timelinePattern = /(?:delivery|completion|supply).*?within\s+(\d+)\s+(days?|weeks?|months?)/i
        const match = text.match(timelinePattern)

        if (match) {
            return `Within ${match[1]} ${match[2].toLowerCase()}`
        }

        return null
    }

    /**
     * Extract deadline date from text
     */
    extractDeadline(text: string): string | null {
        // Look for date patterns
        const datePatterns = [
            /(?:deadline|due date|last date).*?(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
            /(?:deadline|due date|last date).*?(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i,
        ]

        for (const pattern of datePatterns) {
            const match = text.match(pattern)
            if (match) {
                return match[1]
            }
        }

        return null
    }

    /**
     * Clean and normalize text
     */
    cleanText(text: string): string {
        return text
            .replace(/\s+/g, ' ') // Multiple spaces to single
            .replace(/\n+/g, '\n') // Multiple newlines to single
            .trim()
    }

    /**
     * Extract tables from text (simple implementation)
     */
    extractTables(text: string): string[][] {
        // This is a simplified table extraction
        // For better results, would need more sophisticated parsing
        const tables: string[][] = []
        const lines = text.split('\n')

        let currentTable: string[] = []

        for (const line of lines) {
            // Detect table-like rows (multiple items separated by spaces/tabs)
            const cells = line.split(/\s{2,}|\t+/).filter(c => c.trim())

            if (cells.length >= 2) {
                currentTable.push(line)
            } else if (currentTable.length > 0) {
                // End of table
                tables.push(currentTable)
                currentTable = []
            }
        }

        if (currentTable.length > 0) {
            tables.push(currentTable)
        }

        return tables
    }
}

export const documentParser = new DocumentParser()
