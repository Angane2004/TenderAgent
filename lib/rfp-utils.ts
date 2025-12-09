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
