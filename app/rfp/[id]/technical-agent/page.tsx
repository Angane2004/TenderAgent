// Server Component - handles async params
import TechnicalAgentClient from "./technical-agent-client"

export default async function TechnicalAgentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <TechnicalAgentClient id={id} />
}
