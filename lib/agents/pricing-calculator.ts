import pricingData from '@/data/pricing.json'

export interface PriceCalculation {
    sku: string
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

/**
 * Pricing calculation engine
 */
export class PricingCalculator {
    private pricingData: any[]

    constructor() {
        this.pricingData = pricingData as any[]
    }

    /**
     * Calculate pricing for a product
     */
    calculatePrice(
        sku: string,
        quantity: number,
        testsRequired: string[] = [],
        servicesRequired: string[] = []
    ): PriceCalculation {
        // Find pricing data for SKU
        const pricing = this.pricingData.find(p => p.sku === sku)

        if (!pricing) {
            throw new Error(`Pricing data not found for SKU: ${sku}`)
        }

        // Base unit price
        const unitPrice = pricing.basePrice || 0

        // Apply quantity-based discount
        const discountedPrice = this.applyQuantityDiscount(unitPrice, quantity)

        // Calculate material cost
        const materialCost = discountedPrice * quantity

        // Calculate test costs
        const testCosts = testsRequired.map(testName => {
            const cost = this.getTestCost(testName, pricing.testCosts)
            return { testName, cost }
        })
        const totalTestCost = testCosts.reduce((sum, t) => sum + t.cost, 0)

        // Calculate service costs
        const serviceCosts = servicesRequired.map(serviceName => {
            const cost = this.getServiceCost(serviceName, pricing.serviceCosts)
            return { serviceName, cost }
        })
        const totalServiceCost = serviceCosts.reduce((sum, s) => sum + s.cost, 0)

        // Calculate totals
        const subtotal = materialCost + totalTestCost + totalServiceCost
        const total = subtotal

        return {
            sku,
            quantity,
            unitPrice: discountedPrice,
            materialCost,
            testCosts,
            totalTestCost,
            serviceCosts,
            totalServiceCost,
            subtotal,
            total,
        }
    }

    /**
     * Apply quantity-based discount
     */
    private applyQuantityDiscount(unitPrice: number, quantity: number): number {
        if (quantity >= 10000) {
            return unitPrice * 0.85 // 15% discount
        } else if (quantity >= 5000) {
            return unitPrice * 0.90 // 10% discount
        } else if (quantity >= 2000) {
            return unitPrice * 0.95 // 5% discount
        }
        return unitPrice
    }

    /**
     * Get test cost with fallback
     */
    private getTestCost(testName: string, testCosts: Record<string, number>): number {
        const normalized = testName.toLowerCase()

        // Try exact match
        if (testCosts[testName]) return testCosts[testName]

        // Try normalized match
        for (const [key, value] of Object.entries(testCosts)) {
            if (key.toLowerCase().includes(normalized) || normalized.includes(key.toLowerCase())) {
                return value
            }
        }

        // Default costs based on test type
        if (normalized.includes('routine')) return 25000
        if (normalized.includes('type')) return 150000
        if (normalized.includes('sample')) return 50000
        if (normalized.includes('high voltage')) return 75000
        if (normalized.includes('partial discharge')) return 80000
        if (normalized.includes('fire')) return 100000

        return 50000 // Default test cost
    }

    /**
     * Get service cost with fallback
     */
    private getServiceCost(serviceName: string, serviceCosts: Record<string, number>): number {
        const normalized = serviceName.toLowerCase()

        // Try exact match
        if (serviceCosts[serviceName]) return serviceCosts[serviceName]

        // Try normalized match
        for (const [key, value] of Object.entries(serviceCosts)) {
            if (key.toLowerCase().includes(normalized) || normalized.includes(key.toLowerCase())) {
                return value
            }
        }

        // Default service costs
        if (normalized.includes('delivery')) return 15000
        if (normalized.includes('installation')) return 50000
        if (normalized.includes('commissioning')) return 75000
        if (normalized.includes('documentation')) return 10000

        return 20000 // Default service cost
    }

    /**
     * Calculate margin
     */
    calculateMargin(totalCost: number, sellingPrice: number): number {
        if (sellingPrice === 0) return 0
        return ((sellingPrice - totalCost) / sellingPrice) * 100
    }

    /**
     * Calculate competitive pricing scenarios
     */
    calculateScenarios(
        baseCost: number,
        targetMargins: { low: number; medium: number; high: number; optimal: number }
    ): {
        aggressive: number
        recommended: number
        premium: number
        optimal: number
    } {
        return {
            aggressive: baseCost / (1 - targetMargins.low / 100),
            recommended: baseCost / (1 - targetMargins.medium / 100),
            premium: baseCost / (1 - targetMargins.high / 100),
            optimal: baseCost / (1 - targetMargins.optimal / 100),
        }
    }

    /**
     * Estimate market price based on competitive analysis
     */
    estimateMarketPrice(
        productCategory: string,
        specifications: any
    ): { min: number; max: number; average: number } {
        // This would ideally use historical data and competitive analysis
        // For now, using simple estimation based on category

        let baseMin = 500
        let baseMax = 2000

        if (productCategory.includes('High Voltage')) {
            baseMin = 3000
            baseMax = 5000
        } else if (productCategory.includes('Medium Voltage')) {
            baseMin = 1000
            baseMax = 2500
        } else if (productCategory.includes('Fire Survival')) {
            baseMin = 350
            baseMax = 600
        } else if (productCategory.includes('Aerial')) {
            baseMin = 400
            baseMax = 700
        }

        const average = (baseMin + baseMax) / 2

        return { min: baseMin, max: baseMax, average }
    }
}

export const pricingCalculator = new PricingCalculator()
