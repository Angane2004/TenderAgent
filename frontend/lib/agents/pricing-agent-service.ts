import { AgentBase } from './agent-base'
import { pricingCalculator, PriceCalculation } from './pricing-calculator'
import { ProductRecommendation } from './technical-agent-service'

export interface PricingAgentInput {
    rfpId: string
    selectedProduct: ProductRecommendation
    quantity: number
    testingRequired: string[]
    certifications: string[]
    estimatedValue?: number
}

export interface PricingBreakdown {
    sku: string
    productName: string
    quantity: number
    unitPrice: number
    materialCost: number
    testCosts: {
        testName: string
        cost: number
    }[]
    totalTestCost: number
    serviceCosts: {
        serviceName: string
        cost: number
    }[]
    totalServiceCost: number
    subtotal: number
    total: number
}

export interface PricingAgentOutput {
    recommendedPrice: number
    aggressivePrice?: number
    premiumPrice?: number
    margin: number
    totalValue: number
    riskLevel: 'low' | 'medium' | 'high'
    pricingBreakdown: PricingBreakdown
    scenarios: {
        aggressive: { price: number; margin: number }
        recommended: { price: number; margin: number }
        premium: { price: number; margin: number }
        optimal: { price: number; margin: number }
    }
    competitiveAnalysis: {
        estimatedMarketPriceMin: number
        estimatedMarketPriceMax: number
        estimatedMarketPriceAvg: number
        ourPosition: 'competitive' | 'premium' | 'discount'
    }
    status: 'completed' | 'pending'
}

/**
 * Pricing Agent
 * Calculates costs, analyzes trends, optimizes pricing
 */
export class PricingAgent extends AgentBase<PricingAgentInput, PricingAgentOutput> {
    constructor() {
        super('Pricing Agent')
    }

    async execute(input: PricingAgentInput): Promise<PricingAgentOutput> {
        this.log('Calculating product pricing...', 'processing', 15)

        // Step 1: Calculate base pricing
        const calculation = pricingCalculator.calculatePrice(
            input.selectedProduct.sku,
            input.quantity,
            input.testingRequired,
            ['Documentation', 'Delivery'] // Default services
        )

        this.log('Analyzing cost breakdown...', 'processing', 35)

        // Step 2: Create pricing breakdown
        const pricingBreakdown: PricingBreakdown = {
            sku: input.selectedProduct.sku,
            productName: input.selectedProduct.productName,
            quantity: calculation.quantity,
            unitPrice: calculation.unitPrice,
            materialCost: calculation.materialCost,
            testCosts: calculation.testCosts,
            totalTestCost: calculation.totalTestCost,
            serviceCosts: calculation.serviceCosts,
            totalServiceCost: calculation.totalServiceCost,
            subtotal: calculation.subtotal,
            total: calculation.total,
        }

        // Step 3: Calculate pricing scenarios
        this.log('Generating pricing scenarios...', 'processing', 55)

        const targetMargins = {
            low: 8,      // Aggressive scenario
            medium: 15,  // Recommended scenario
            high: 22,    // Premium scenario
            optimal: 18, // Optimal scenario
        }

        const scenarios = pricingCalculator.calculateScenarios(
            calculation.total,
            targetMargins
        )

        const scenariosWithMargin = {
            aggressive: {
                price: Math.round(scenarios.aggressive),
                margin: targetMargins.low,
            },
            recommended: {
                price: Math.round(scenarios.recommended),
                margin: targetMargins.medium,
            },
            premium: {
                price: Math.round(scenarios.premium),
                margin: targetMargins.high,
            },
            optimal: {
                price: Math.round(scenarios.optimal),
                margin: targetMargins.optimal,
            },
        }

        // Step 4: Competitive analysis
        this.log('Performing competitive analysis...', 'processing', 75)

        const marketPrices = pricingCalculator.estimateMarketPrice(
            input.selectedProduct.productName,
            input.selectedProduct.specifications
        )

        const recommendedTotalPrice = scenariosWithMargin.recommended.price
        const avgMarketPrice = marketPrices.average * input.quantity

        let ourPosition: 'competitive' | 'premium' | 'discount'
        if (recommendedTotalPrice <= avgMarketPrice * 0.95) {
            ourPosition = 'discount'
        } else if (recommendedTotalPrice >= avgMarketPrice * 1.1) {
            ourPosition = 'premium'
        } else {
            ourPosition = 'competitive'
        }

        // Step 5: Risk assessment
        this.log('Assessing pricing risk...', 'processing', 90)

        const riskLevel = this.assessRiskLevel(
            input.selectedProduct.matchScore,
            targetMargins.medium,
            input.estimatedValue || 0,
            recommendedTotalPrice
        )

        return {
            recommendedPrice: scenariosWithMargin.recommended.price,
            aggressivePrice: scenariosWithMargin.aggressive.price,
            premiumPrice: scenariosWithMargin.premium.price,
            margin: targetMargins.medium,
            totalValue: recommendedTotalPrice,
            riskLevel,
            pricingBreakdown,
            scenarios: scenariosWithMargin,
            competitiveAnalysis: {
                estimatedMarketPriceMin: Math.round(marketPrices.min * input.quantity),
                estimatedMarketPriceMax: Math.round(marketPrices.max * input.quantity),
                estimatedMarketPriceAvg: Math.round(avgMarketPrice),
                ourPosition,
            },
            status: 'completed',
        }
    }

    /**
     * Assess pricing risk level
     */
    private assessRiskLevel(
        productMatchScore: number,
        margin: number,
        rfpEstimatedValue: number,
        ourPrice: number
    ): 'low' | 'medium' | 'high' {
        let riskScore = 0

        // Low match score increases risk
        if (productMatchScore < 80) riskScore += 2
        else if (productMatchScore < 90) riskScore += 1

        // Low margin increases risk
        if (margin < 10) riskScore += 2
        else if (margin < 15) riskScore += 1

        // Price significantly higher than RFP estimate increases risk
        if (rfpEstimatedValue > 0) {
            const priceDiff = ((ourPrice - rfpEstimatedValue) / rfpEstimatedValue) * 100
            if (priceDiff > 20) riskScore += 2
            else if (priceDiff > 10) riskScore += 1
        }

        if (riskScore >= 4) return 'high'
        if (riskScore >= 2) return 'medium'
        return 'low'
    }

    /**
     * Use AI to provide pricing strategy recommendation
     */
    async generatePricingStrategy(
        rfpContext: string,
        pricingOutput: PricingAgentOutput
    ): Promise<string> {
        const prompt = `
Given this RFP context and our pricing analysis, recommend the best pricing strategy.

RFP Context:
${rfpContext}

Our Pricing Analysis:
- Recommended Price: ₹${pricingOutput.recommendedPrice.toLocaleString()}
- Margin: ${pricingOutput.margin}%
- Risk Level: ${pricingOutput.riskLevel}
- Market Position: ${pricingOutput.competitiveAnalysis.ourPosition}
- Estimated Market Average: ₹${pricingOutput.competitiveAnalysis.estimatedMarketPriceAvg.toLocaleString()}

Scenarios:
- Aggressive: ₹${pricingOutput.scenarios.aggressive.price.toLocaleString()} (${pricingOutput.scenarios.aggressive.margin}% margin)
- Recommended: ₹${pricingOutput.scenarios.recommended.price.toLocaleString()} (${pricingOutput.scenarios.recommended.margin}% margin)
- Premium: ₹${pricingOutput.scenarios.premium.price.toLocaleString()} (${pricingOutput.scenarios.premium.margin}% margin)

Provide a 2-3 sentence recommendation on which pricing scenario to use and why.
`

        const strategy = await this.callAI(
            prompt,
            'You are a pricing strategy expert for B2B industrial equipment.',
            { temperature: 0.5, maxTokens: 300 }
        )

        return strategy.trim()
    }
}

export const pricingAgent = new PricingAgent()
