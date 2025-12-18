import { RFP } from '@/types'

/**
 * Determines the actual status of an RFP based on agent task progress
 * 
 * @param rfp - The RFP object to check
 * @returns The actual status:
 *   - 'completed': Final response has been submitted
 *   - 'in-progress': At least one agent task (sales/technical/pricing) is completed
 *   - 'new': No agent tasks have been started
 */
export function getActualRFPStatus(rfp: RFP): 'new' | 'in-progress' | 'completed' {
    // If final response is submitted, RFP is completed
    if (rfp.finalResponse?.status === 'submitted') {
        return 'completed'
    }

    // If any agent task is completed, RFP is in progress
    const hasCompletedTask =
        rfp.salesSummary?.status === 'completed' ||
        rfp.technicalAnalysis?.status === 'completed' ||
        rfp.pricingStrategy?.status === 'completed'

    if (hasCompletedTask) {
        return 'in-progress'
    }

    // Otherwise, use the RFP's current status (or default to 'new')
    return rfp.status || 'new'
}

/**
 * Determines the next agent step to continue from based on completed tasks
 * 
 * @param rfp - The RFP object to check
 * @returns The path to the next agent step
 * 
 * Flow: sales-agent → technical-agent → pricing-agent → final-response
 */
export function getNextAgentStep(rfp: RFP): string {
    // If final response is generated but not submitted, continue to final response
    if (rfp.finalResponse && rfp.finalResponse.status !== 'submitted') {
        return `/rfp/${rfp.id}/final-response`
    }

    // If pricing is completed, go to final response
    if (rfp.pricingStrategy?.status === 'completed') {
        return `/rfp/${rfp.id}/final-response`
    }

    // If technical analysis is completed, go to pricing agent
    if (rfp.technicalAnalysis?.status === 'completed') {
        return `/rfp/${rfp.id}/pricing-agent`
    }

    // If sales summary is completed, go to technical agent
    if (rfp.salesSummary?.status === 'completed') {
        return `/rfp/${rfp.id}/technical-agent`
    }

    // Otherwise, start from sales agent
    return `/rfp/${rfp.id}/sales-agent`
}
