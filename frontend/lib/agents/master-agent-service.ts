import { AgentBase } from './agent-base'
import { salesAgent, SalesAgentOutput } from './sales-agent-service'
import { technicalAgent, TechnicalAgentOutput } from './technical-agent-service'
import { pricingAgent, PricingAgentOutput } from './pricing-agent-service'

export interface MasterAgentInput {
    rfpId: string
    rfpUrl?: string
    rfpDocument?: Buffer
    rfpText?: string
}

export interface MasterAgentOutput {
    rfpId: string
    salesSummary: SalesAgentOutput
    technicalAnalysis: TechnicalAgentOutput
    pricingStrategy: PricingAgentOutput
    winProbability: number
    winProbabilityReasoning: string
    overallRecommendation: string
    consolidatedResponse: {
        selectedProducts: {
            sku: string
            name: string
            specifications: any
            quantity: number
            unitPrice: number
            totalPrice: number
        }[]
        totalMaterialCost: number
        totalTestCost: number
        totalServiceCost: number
        grandTotal: number
        timeline: string
        certifications: string[]
    }
    status: 'completed' | 'pending' | 'error'
}

/**
 * Master Agent - Main Orchestrator
 * Coordinates all agents and consolidates responses
 *
 */
export class MasterAgent extends AgentBase<MasterAgentInput, MasterAgentOutput> {
    constructor() {
        super('Master Agent')
    }

    async execute(input: MasterAgentInput): Promise<MasterAgentOutput> {
        this.log('Starting RFP analysis workflow...', 'processing', 5)

        // Step 1: Run Sales Agent
        this.log('Initiating Sales Discovery Agent...', 'processing', 10)
        const salesResult = await salesAgent.run({
            rfpId: input.rfpId,
            rfpUrl: input.rfpUrl,
            rfpDocument: input.rfpDocument,
            rfpText: input.rfpText,
        })

        if (salesResult.status === 'error') {
            throw new Error(`Sales Agent failed: ${salesResult.error}`)
        }

        const salesSummary = salesResult.data
        this.log('Sales analysis completed', 'processing', 30)

        // Step 2: Prepare contextual summary for Technical Agent
        this.log('Preparing technical analysis request...', 'processing', 35)
        const technicalContext = {
            rfpId: input.rfpId,
            extractedSpecs: salesSummary.extractedSpecs || {},
            testingRequired: salesSummary.testingRequired,
            certifications: salesSummary.certifications,
        }

        // Step 3: Run Technical Agent
        this.log('Initiating Technical Analysis Agent...', 'processing', 40)
        const technicalResult = await technicalAgent.run(technicalContext)

        if (technicalResult.status === 'error') {
            throw new Error(`Technical Agent failed: ${technicalResult.error}`)
        }

        const technicalAnalysis = technicalResult.data
        this.log('Technical analysis completed', 'processing', 60)

        // Step 4: Prepare contextual summary for Pricing Agent
        this.log('Preparing pricing analysis request...', 'processing', 65)

        if (!technicalAnalysis.selectedProduct) {
            throw new Error('No suitable product found for this RFP')
        }

        const quantity = salesSummary.extractedSpecs?.quantity || 1000

        const pricingContext = {
            rfpId: input.rfpId,
            selectedProduct: technicalAnalysis.selectedProduct,
            quantity,
            testingRequired: salesSummary.testingRequired,
            certifications: salesSummary.certifications,
            estimatedValue: salesSummary.estimatedValue,
        }

        // Step 5: Run Pricing Agent
        this.log('Initiating Pricing Strategy Agent...', 'processing', 70)
        const pricingResult = await pricingAgent.run(pricingContext)

        if (pricingResult.status === 'error') {
            throw new Error(`Pricing Agent failed: ${pricingResult.error}`)
        }

        const pricingStrategy = pricingResult.data
        this.log('Pricing analysis completed', 'processing', 85)

        // Step 6: Calculate win probability
        this.log('Calculating win probability...', 'processing', 90)
        const { winProbability, reasoning } = await this.calculateWinProbability(
            technicalAnalysis,
            pricingStrategy,
            salesSummary
        )

        // Step 7: Generate overall recommendation
        this.log('Generating overall recommendation...', 'processing', 95)
        const overallRecommendation = await this.generateOverallRecommendation(
            salesSummary,
            technicalAnalysis,
            pricingStrategy,
            winProbability
        )

        // Step 8: Consolidate final response
        this.log('Consolidating final response...', 'processing', 98)
        const consolidatedResponse = this.consolidateResponse(
            salesSummary,
            technicalAnalysis,
            pricingStrategy
        )

        return {
            rfpId: input.rfpId,
            salesSummary,
            technicalAnalysis,
            pricingStrategy,
            winProbability,
            winProbabilityReasoning: reasoning,
            overallRecommendation,
            consolidatedResponse,
            status: 'completed',
        }
    }

    /**
     * Calculate win probability using AI
     */
    private async calculateWinProbability(
        technical: TechnicalAgentOutput,
        pricing: PricingAgentOutput,
        sales: SalesAgentOutput
    ): Promise<{ winProbability: number; reasoning: string }> {
        const prompt = `
Calculate the win probability (0-100%) for this RFP bid based on the following factors:

Technical Match:
- Product Match Score: ${technical.productMatchScore}%
- Compatible: ${technical.compatible ? 'Yes' : 'No'}
- Match Strengths: ${technical.selectedProduct?.strengths.join(', ') || 'None'}
- Match Gaps: ${technical.selectedProduct?.gaps.join(', ') || 'None'}

Pricing:
- Our Price: ₹${pricing.recommendedPrice.toLocaleString()}
- Margin: ${pricing.margin}%
- Risk Level: ${pricing.riskLevel}
- Market Position: ${pricing.competitiveAnalysis.ourPosition}
- Estimated Market Avg: ₹${pricing.competitiveAnalysis.estimatedMarketPriceAvg.toLocaleString()}

Requirements:
- Testing Capabilities: ${sales.testingRequired.length} tests required
- Certifications: ${sales.certifications.join(', ')}

Provide your response in JSON format:
{
  "winProbability": <number 0-100>,
  "reasoning": "<2-3 sentence explanation>"
}
`

        const result = await this.extractJSON<{
            winProbability: number
            reasoning: string
        }>(
            prompt,
            '{ winProbability: number, reasoning: string }',
            'You are an expert in RFP bid analysis and win probability estimation.'
        )

        return {
            winProbability: Math.min(100, Math.max(0, result.winProbability)),
            reasoning: result.reasoning,
        }
    }

    /**
     * Generate overall recommendation
     */
    private async generateOverallRecommendation(
        sales: SalesAgentOutput,
        technical: TechnicalAgentOutput,
        pricing: PricingAgentOutput,
        winProbability: number
    ): Promise<string> {
        const shouldBid = winProbability >= 60 && technical.compatible && pricing.riskLevel !== 'high'

        const prompt = `
Based on this RFP analysis, provide a clear recommendation on whether we should bid.

Win Probability: ${winProbability}%
Product Match: ${technical.productMatchScore}%
Compatible: ${technical.compatible}
Pricing Risk: ${pricing.riskLevel}
Market Position: ${pricing.competitiveAnalysis.ourPosition}

Decision: ${shouldBid ? 'RECOMMEND BIDDING' : 'NOT RECOMMENDED'}

Provide a 3-4 sentence recommendation with key reasons.
`

        const recommendation = await this.callAI(
            prompt,
            'You are a senior business development manager making RFP bid decisions.',
            { temperature: 0.6, maxTokens: 300 }
        )

        return recommendation.trim()
    }

    /**
     * Consolidate all agent outputs into final response
     */
    private consolidateResponse(
        sales: SalesAgentOutput,
        technical: TechnicalAgentOutput,
        pricing: PricingAgentOutput
    ): MasterAgentOutput['consolidatedResponse'] {
        const selectedProducts = technical.selectedProduct ? [{
            sku: technical.selectedProduct.sku,
            name: technical.selectedProduct.productName,
            specifications: technical.selectedProduct.specifications,
            quantity: pricing.pricingBreakdown.quantity,
            unitPrice: pricing.pricingBreakdown.unitPrice,
            totalPrice: pricing.pricingBreakdown.materialCost,
        }] : []

        return {
            selectedProducts,
            totalMaterialCost: pricing.pricingBreakdown.materialCost,
            totalTestCost: pricing.pricingBreakdown.totalTestCost,
            totalServiceCost: pricing.pricingBreakdown.totalServiceCost,
            grandTotal: pricing.totalValue,
            timeline: sales.deliveryTimeline,
            certifications: sales.certifications,
        }
    }
}

export const masterAgent = new MasterAgent()
