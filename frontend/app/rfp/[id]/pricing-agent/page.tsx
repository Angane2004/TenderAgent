// Server Component - handles async params
import PricingAgentClient from "./pricing-agent-client"

export default async function PricingAgentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <PricingAgentClient id={id} />
}
