// Server Component - handles async params
import RFPDetailsClient from "./rfp-details-client"

export default async function RFPDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <RFPDetailsClient id={id} />
}
