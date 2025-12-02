// Server Component - handles async params
import SalesAgentClient from "./sales-agent-client"

export default async function SalesAgentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <SalesAgentClient id={id} />
}
