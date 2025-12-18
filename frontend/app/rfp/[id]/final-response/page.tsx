// Server Component - handles async params
import FinalResponseClient from "./final-response-client"

export default async function FinalResponsePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <FinalResponseClient id={id} />
}
