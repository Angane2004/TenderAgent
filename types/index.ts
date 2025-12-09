export interface RFP {
    id: string
    title: string
    issuedBy: string
    summary: string
    submissionDate: string
    deadline: string
    status: 'new' | 'in-progress' | 'completed'
    riskScore: 'low' | 'medium' | 'high'
    fitScore: number
    scope: string
    specifications: {
        voltage: string
        size: string
        conductor: string
        insulation: string
        armoring: string
        standard: string
        quantity: number
    }
    testingRequirements: string[]
    certifications: string[]
    deliveryTimeline: string
    // Agent Outputs
    salesSummary?: {
        scopeOfSupply: string
        quantity: string
        testingRequired: string[]
        certifications: string[]
        deliveryTimeline: string
        status: 'completed' | 'pending'
    }
    technicalAnalysis?: {
        productMatchScore: number
        compatible: boolean
        standards: string[]
        testingCapabilities: string[]
        status: 'completed' | 'pending'
    }
    pricingStrategy?: {
        recommendedPrice: number
        aggressivePrice?: number
        premiumPrice?: number
        margin: number
        totalValue: number
        riskLevel: 'low' | 'medium' | 'high'
        status: 'completed' | 'pending'
        paymentTerms?: string
    }
    finalResponse?: {
        generatedAt: string
        submissionId?: string
        status: 'draft' | 'submitted'
    }
}

export interface Product {
    sku: string
    name: string
    category: string
    specifications: {
        voltage: string
        size: string
        conductor: string
        insulation: string
        armoring: string
        standard: string
    }
    certifications: string[]
    pricePerMeter: number
    available: boolean
}

export interface PricingData {
    sku: string
    basePrice: number
    testCosts: {
        [testName: string]: number
    }
    serviceCosts: {
        [serviceName: string]: number
    }
    historicalPrices: {
        date: string
        price: number
    }[]
}

export interface AgentLog {
    id: string
    timestamp: Date
    agent: 'sales' | 'master' | 'technical' | 'pricing'
    message: string
    status: 'processing' | 'completed' | 'error'
}

export interface SKURecommendation {
    sku: string
    matchPercentage: number
    product: Product
    gaps: string[]
    strengths: string[]
}

export interface PricingBreakdown {
    sku: string
    quantity: number
    unitPrice: number
    subtotal: number
    testCosts: number
    serviceCosts: number
    total: number
}

export interface FinalResponse {
    rfpId: string
    salesSummary: string
    technicalRecommendations: SKURecommendation[]
    pricingBreakdown: PricingBreakdown[]
    totalCost: number
    winProbability: number
    generatedAt: Date
}
