import { Product } from '@/types'

export interface SpecMatchResult {
    product: Product
    matchScore: number
    matchedSpecs: string[]
    unmatchedSpecs: string[]
    strengths: string[]
    gaps: string[]
}

/**
 * Specification matching engine
 * Matches RFP requirements with OEM product catalog
 */
export class SpecMatcher {
    /**
     * Calculate match score between RFP specs and product
     */
    matchProduct(
        rfpSpecs: {
            voltage?: string
            size?: string
            conductor?: string
            insulation?: string
            armoring?: string
            standard?: string
        },
        product: Product
    ): SpecMatchResult {
        const matched: string[] = []
        const unmatched: string[] = []
        const strengths: string[] = []
        const gaps: string[] = []

        let totalScore = 0
        let maxScore = 0

        // Voltage matching (Weight: 20%)
        maxScore += 20
        if (rfpSpecs.voltage && product.specifications.voltage) {
            const voltageMatch = this.matchVoltage(rfpSpecs.voltage, product.specifications.voltage)
            if (voltageMatch >= 0.8) {
                totalScore += 20 * voltageMatch
                matched.push('Voltage')
                strengths.push(`Voltage rating ${product.specifications.voltage} matches requirement`)
            } else {
                unmatched.push('Voltage')
                gaps.push(`Voltage ${product.specifications.voltage} may not match ${rfpSpecs.voltage}`)
            }
        }

        // Conductor matching (Weight: 15%)
        maxScore += 15
        if (rfpSpecs.conductor && product.specifications.conductor) {
            if (this.normalizeString(rfpSpecs.conductor) === this.normalizeString(product.specifications.conductor)) {
                totalScore += 15
                matched.push('Conductor')
                strengths.push(`${product.specifications.conductor} conductor as required`)
            } else {
                unmatched.push('Conductor')
                gaps.push(`Requires ${rfpSpecs.conductor}, product has ${product.specifications.conductor}`)
            }
        }

        // Insulation matching (Weight: 20%)
        maxScore += 20
        if (rfpSpecs.insulation && product.specifications.insulation) {
            const insulationMatch = this.matchInsulation(rfpSpecs.insulation, product.specifications.insulation)
            if (insulationMatch >= 0.8) {
                totalScore += 20 * insulationMatch
                matched.push('Insulation')
                strengths.push(`Insulation type ${product.specifications.insulation} matches requirement`)
            } else {
                unmatched.push('Insulation')
                gaps.push(`Insulation mismatch: requires ${rfpSpecs.insulation}, has ${product.specifications.insulation}`)
            }
        }

        // Size matching (Weight: 25%)
        maxScore += 25
        if (rfpSpecs.size && product.specifications.size) {
            const sizeMatch = this.matchSize(rfpSpecs.size, product.specifications.size)
            if (sizeMatch >= 0.9) {
                totalScore += 25 * sizeMatch
                matched.push('Size/Cross-section')
                strengths.push(`Size ${product.specifications.size} matches specification`)
            } else if (sizeMatch >= 0.5) {
                totalScore += 25 * sizeMatch * 0.7 // Partial credit
                matched.push('Size/Cross-section (Partial)')
                gaps.push(`Size ${product.specifications.size} approximately matches ${rfpSpecs.size}`)
            } else {
                unmatched.push('Size/Cross-section')
                gaps.push(`Size mismatch: requires ${rfpSpecs.size}, has ${product.specifications.size}`)
            }
        }

        // Armoring matching (Weight: 10%)
        maxScore += 10
        if (rfpSpecs.armoring && product.specifications.armoring) {
            if (this.matchArmoring(rfpSpecs.armoring, product.specifications.armoring)) {
                totalScore += 10
                matched.push('Armoring')
                strengths.push(`Armoring type ${product.specifications.armoring} as specified`)
            } else {
                unmatched.push('Armoring')
                gaps.push(`Armoring type differs: requires ${rfpSpecs.armoring}`)
            }
        }

        // Standard matching (Weight: 10%)
        maxScore += 10
        if (rfpSpecs.standard && product.specifications.standard) {
            if (this.matchStandard(rfpSpecs.standard, product.specifications.standard)) {
                totalScore += 10
                matched.push('Standard')
                strengths.push(`Compliant with ${product.specifications.standard}`)
            } else {
                unmatched.push('Standard')
                gaps.push(`Standard mismatch: requires ${rfpSpecs.standard}`)
            }
        }

        const matchScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

        return {
            product,
            matchScore,
            matchedSpecs: matched,
            unmatchedSpecs: unmatched,
            strengths,
            gaps,
        }
    }

    /**
     * Find top N matching products from catalog
     */
    findTopMatches(
        rfpSpecs: any,
        products: Product[],
        topN: number = 3
    ): SpecMatchResult[] {
        const matches = products
            .map(product => this.matchProduct(rfpSpecs, product))
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, topN)

        return matches
    }

    // Helper matching functions

    private matchVoltage(rfpVoltage: string, productVoltage: string): number {
        const rfpValue = this.extractVoltageValue(rfpVoltage)
        const productValue = this.extractVoltageValue(productVoltage)

        if (rfpValue === productValue) return 1.0
        if (Math.abs(rfpValue - productValue) <= 1) return 0.9 // Within 1kV
        if (Math.abs(rfpValue - productValue) <= 5) return 0.7 // Within 5kV
        return 0.3
    }

    private extractVoltageValue(voltage: string): number {
        const match = voltage.match(/(\d+\.?\d*)/)
        return match ? parseFloat(match[1]) : 0
    }

    private matchInsulation(rfpInsulation: string, productInsulation: string): number {
        const rfpNorm = this.normalizeString(rfpInsulation)
        const prodNorm = this.normalizeString(productInsulation)

        if (rfpNorm === prodNorm) return 1.0

        // Check for similar types
        if (rfpNorm.includes('xlpe') && prodNorm.includes('xlpe')) return 1.0
        if (rfpNorm.includes('pvc') && prodNorm.includes('pvc')) return 1.0
        if (rfpNorm.includes('lszh') && prodNorm.includes('lszh')) return 1.0

        return 0.4
    }

    private matchSize(rfpSize: string, productSize: string): number {
        const rfpNorm = this.normalizeString(rfpSize)
        const prodNorm = this.normalizeString(productSize)

        if (rfpNorm === prodNorm) return 1.0

        // Extract core count and cross-section
        const rfpCores = this.extractCores(rfpSize)
        const prodCores = this.extractCores(productSize)
        const rfpCrossSection = this.extractCrossSection(rfpSize)
        const prodCrossSection = this.extractCrossSection(productSize)

        let score = 0

        // Core count match (50% weight)
        if (rfpCores === prodCores) {
            score += 0.5
        }

        // Cross-section match (50% weight)
        if (rfpCrossSection === prodCrossSection) {
            score += 0.5
        } else if (Math.abs(rfpCrossSection - prodCrossSection) <= 10) {
            score += 0.4 // Close enough
        } else if (Math.abs(rfpCrossSection - prodCrossSection) <= 50) {
            score += 0.2 // Somewhat close
        }

        return score
    }

    private extractCores(size: string): number {
        const match = size.match(/(\d+)C?\s*x/i)
        return match ? parseInt(match[1]) : 1
    }

    private extractCrossSection(size: string): number {
        const match = size.match(/x\s*(\d+\.?\d*)/)
        return match ? parseFloat(match[1]) : 0
    }

    private matchArmoring(rfpArm: string, prodArm: string): boolean {
        const rfpNorm = this.normalizeString(rfpArm)
        const prodNorm = this.normalizeString(prodArm)

        if (rfpNorm === prodNorm) return true
        if (rfpNorm.includes('swa') && prodNorm.includes('swa')) return true
        if (rfpNorm.includes('awa') && prodNorm.includes('awa')) return true
        if ((rfpNorm.includes('unarmor') || rfpNorm.includes('none')) &&
            (prodNorm.includes('unarmor') || prodNorm.includes('none'))) return true

        return false
    }

    private matchStandard(rfpStd: string, prodStd: string): boolean {
        const rfpNorm = this.normalizeString(rfpStd)
        const prodNorm = this.normalizeString(prodStd)

        // Exact match
        if (rfpNorm === prodNorm) return true

        // Same standard family
        if (rfpStd.includes('IS') && prodStd.includes('IS')) {
            const rfpNum = rfpStd.match(/\d+/)
            const prodNum = prodStd.match(/\d+/)
            if (rfpNum && prodNum && rfpNum[0] === prodNum[0]) return true
        }

        if (rfpStd.includes('IEC') && prodStd.includes('IEC')) {
            const rfpNum = rfpStd.match(/\d+/)
            const prodNum = prodStd.match(/\d+/)
            if (rfpNum && prodNum && rfpNum[0] === prodNum[0]) return true
        }

        return false
    }

    private normalizeString(str: string): string {
        return str.toLowerCase().replace(/[^a-z0-9]/g, '')
    }
}

export const specMatcher = new SpecMatcher()
