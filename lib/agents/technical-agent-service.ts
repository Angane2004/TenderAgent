import { AgentBase } from './agent-base'
import { specMatcher, SpecMatchResult } from './spec-matcher'
import { Product } from '@/types'
import productsData from '@/data/products.json'
import standardsData from '@/data/standards.json'

export interface TechnicalAgentInput {
    rfpId: string
    extractedSpecs: {
        voltage?: string
        size?: string
        conductor?: string
        insulation?: string
        armoring?: string
        standard?: string
        quantity?: number
    }
    testingRequired: string[]
    certifications: string[]
}

export interface ProductRecommendation {
    rank: number
    sku: string
    productName: string
    matchScore: number
    matchedSpecs: string[]
    unmatchedSpecs: string[]
    strengths: string[]
    gaps: string[]
    specifications: any
    certifications: string[]
    pricePerMeter: number
}

export interface TechnicalAgentOutput {
    productMatchScore: number
    compatible: boolean
    standards: string[]
    testingCapabilities: string[]
    recommendations: ProductRecommendation[]
    selectedProduct: ProductRecommendation | null
    comparisonTable: {
        parameter: string
        rfpRequirement: string
        product1: string
        product2: string
        product3: string
    }[]
    status: 'completed' | 'pending'
}

/**
 * Technical Analysis Agent
 * Matches products, analyzes spec gaps, validates compliance
 */
export class TechnicalAgent extends AgentBase<TechnicalAgentInput, TechnicalAgentOutput> {
    private products: Product[]

    constructor() {
        super('Technical Agent')
        this.products = productsData as Product[]
    }

    async execute(input: TechnicalAgentInput): Promise<TechnicalAgentOutput> {
        this.log('Analyzing technical specifications...', 'processing', 10)

        // Step 1: Find top 3 matching products
        this.log('Searching product catalog for matches...', 'processing', 25)
        const matches = specMatcher.findTopMatches(input.extractedSpecs, this.products, 3)

        // Step 2: Create product recommendations
        this.log('Evaluating product recommendations...', 'processing', 40)
        const recommendations: ProductRecommendation[] = matches.map((match, index) => ({
            rank: index + 1,
            sku: match.product.sku,
            productName: match.product.name,
            matchScore: match.matchScore,
            matchedSpecs: match.matchedSpecs,
            unmatchedSpecs: match.unmatchedSpecs,
            strengths: match.strengths,
            gaps: match.gaps,
            specifications: match.product.specifications,
            certifications: match.product.certifications,
            pricePerMeter: match.product.pricePerMeter,
        }))

        // Step 3: Select the best product
        this.log('Selecting optimal product...', 'processing', 55)
        const selectedProduct = recommendations.length > 0 ? recommendations[0] : null
        const compatible = selectedProduct ? selectedProduct.matchScore >= 70 : false

        // Step 4: Validate standards compliance
        this.log('Validating standards compliance...', 'processing', 70)
        const standards = this.validateStandards(input.extractedSpecs, input.certifications)

        // Step 5: Check testing capabilities
        this.log('Checking testing capabilities...', 'processing', 85)
        const testingCapabilities = this.assessTestingCapabilities(input.testingRequired)

        // Step 6: Generate comparison table
        this.log('Generating comparison table...', 'processing', 95)
        const comparisonTable = this.generateComparisonTable(
            input.extractedSpecs,
            recommendations
        )

        return {
            productMatchScore: selectedProduct?.matchScore || 0,
            compatible,
            standards,
            testingCapabilities,
            recommendations,
            selectedProduct,
            comparisonTable,
            status: 'completed',
        }
    }

    /**
     * Validate standards compliance
     */
    private validateStandards(
        specs: any,
        requiredCerts: string[]
    ): string[] {
        const standards: Set<string> = new Set()

        // Add standard from specs
        if (specs.standard) {
            standards.add(specs.standard)
        }

        // Add relevant standards based on voltage
        if (specs.voltage) {
            const voltage = specs.voltage
            if (voltage.includes('11') || voltage.includes('22') || voltage.includes('33')) {
                standards.add('IS 7098 Part 2')
                standards.add('IEC 60502-2')
            } else if (voltage.includes('1.1') || voltage.includes('0.6')) {
                standards.add('IS 1554')
                standards.add('IEC 60227')
            }
        }

        // Add certifications as standards
        requiredCerts.forEach(cert => {
            if (cert.includes('IS ') || cert.includes('IEC ') || cert.includes('BS ')) {
                standards.add(cert)
            }
        })

        // Add common certifications
        standards.add('BIS Certified')
        standards.add('ISO 9001:2015')

        return Array.from(standards)
    }

    /**
     * Assess testing capabilities
     */
    private assessTestingCapabilities(requiredTests: string[]): string[] {
        const capabilities: string[] = []

        // Map required tests to our capabilities
        const testMapping: Record<string, string> = {
            'routine': 'Routine Test - In-house lab',
            'type': 'Type Test - NABL accredited facility',
            'sample': 'Sample Test - Available',
            'high voltage': 'High Voltage Test - CPRI approved lab',
            'partial discharge': 'Partial Discharge Test - Available',
            'conductor resistance': 'Conductor Resistance Test - In-house',
            'insulation resistance': 'Insulation Resistance Test - In-house',
            'impulse': 'Impulse Voltage Test - Available',
            'thermal': 'Thermal Cycling Test - Available',
            'flame': 'Flame Retardant Test - NABL accredited',
            'fire': 'Fire Survival Test - BS 6387 certified lab',
            'smoke': 'Smoke Density Test - Available',
            'uv': 'UV Resistance Test - Available',
            'weather': 'Weather Resistance Test - Available',
            'tensile': 'Tensile Strength Test - Available',
        }

        requiredTests.forEach(test => {
            const testLower = test.toLowerCase()
            for (const [key, capability] of Object.entries(testMapping)) {
                if (testLower.includes(key)) {
                    capabilities.push(capability)
                }
            }
        })

        // Add default capabilities if none found
        if (capabilities.length === 0) {
            capabilities.push('Routine Test - In-house lab')
            capabilities.push('Type Test - Available')
            capabilities.push('Sample Test - NABL accredited')
        }

        return Array.from(new Set(capabilities))
    }

    /**
     * Generate comparison table for RFP spec vs product specs
     */
    private generateComparisonTable(
        rfpSpecs: any,
        recommendations: ProductRecommendation[]
    ): TechnicalAgentOutput['comparisonTable'] {
        const table: TechnicalAgentOutput['comparisonTable'] = []

        const parameters = [
            { key: 'voltage', label: 'Voltage Rating' },
            { key: 'size', label: 'Size/Cross-section' },
            { key: 'conductor', label: 'Conductor Material' },
            { key: 'insulation', label: 'Insulation Type' },
            { key: 'armoring', label: 'Armoring' },
            { key: 'standard', label: 'Standard' },
        ]

        parameters.forEach(param => {
            const row = {
                parameter: param.label,
                rfpRequirement: rfpSpecs[param.key] || 'Not specified',
                product1: recommendations[0]?.specifications[param.key] || '-',
                product2: recommendations[1]?.specifications[param.key] || '-',
                product3: recommendations[2]?.specifications[param.key] || '-',
            }
            table.push(row)
        })

        // Add price comparison
        table.push({
            parameter: 'Price per Meter',
            rfpRequirement: '-',
            product1: recommendations[0] ? `₹${recommendations[0].pricePerMeter}` : '-',
            product2: recommendations[1] ? `₹${recommendations[1].pricePerMeter}` : '-',
            product3: recommendations[2] ? `₹${recommendations[2].pricePerMeter}` : '-',
        })

        return table
    }

    /**
     * Use AI to enhance product recommendations with reasoning
     */
    async enhanceRecommendations(
        rfpText: string,
        recommendations: ProductRecommendation[]
    ): Promise<string> {
        const prompt = `
Given this RFP and our top 3 product recommendations, provide a brief analysis of which product is best and why.

RFP Requirements Summary:
${rfpText.substring(0, 2000)}

Product Recommendations:
${recommendations.map(r => `
${r.rank}. ${r.productName} (SKU: ${r.sku})
   Match Score: ${r.matchScore}%
   Strengths: ${r.strengths.join(', ')}
   Gaps: ${r.gaps.join(', ')}
`).join('\n')}

Provide a 2-3 sentence recommendation with justification.
`

        const analysis = await this.callAI(
            prompt,
            'You are a technical expert in electrical cables and wires.',
            { temperature: 0.4, maxTokens: 300 }
        )

        return analysis.trim()
    }
}

export const technicalAgent = new TechnicalAgent()
