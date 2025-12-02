// Server Component - handles async params
import MasterAgentClient from "./master-agent-client"

export default async function MasterAgentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <MasterAgentClient id={id} />
}
