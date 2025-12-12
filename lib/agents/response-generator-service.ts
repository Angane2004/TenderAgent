import { MasterAgentOutput } from './master-agent-service'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface ResponseGeneratorInput {
    rfpId: string
    rfpTitle: string
    masterAgentOutput: MasterAgentOutput
}

export interface ResponseGeneratorOutput {
    documentId: string
    generatedAt: string
    pdfBuffer?: Buffer
    summary: {
        proposedProducts: number
        totalValue: number
        deliveryTimeline: string
        winProbability: number
    }
    status: 'draft' | 'completed'
}

/**
 * Response Generator Service
 * Creates comprehensive RFP responses with PDF generation
 */
export class ResponseGenerator {
    /**
     * Generate comprehensive RFP response
     */
    async generateResponse(input: ResponseGeneratorInput): Promise<ResponseGeneratorOutput> {
        const { rfpId, rfpTitle, masterAgentOutput } = input

        const documentId = `RFP-RESPONSE-${rfpId}-${Date.now()}`
        const generatedAt = new Date().toISOString()

        // Generate PDF document
        const pdfBuffer = await this.generatePDF(rfpTitle, masterAgentOutput)

        return {
            documentId,
            generatedAt,
            pdfBuffer,
            summary: {
                proposedProducts: masterAgentOutput.consolidatedResponse.selectedProducts.length,
                totalValue: masterAgentOutput.consolidatedResponse.grandTotal,
                deliveryTimeline: masterAgentOutput.consolidatedResponse.timeline,
                winProbability: masterAgentOutput.winProbability,
            },
            status: 'completed',
        }
    }

    /**
     * Generate PDF document
     */
    private async generatePDF(
        rfpTitle: string,
        data: MasterAgentOutput
    ): Promise<Buffer> {
        const doc = new jsPDF()
        let yPos = 20

        // Header
        doc.setFontSize(20)
        doc.setFont('helvetica', 'bold')
        doc.text('RFP Response Document', 105, yPos, { align: 'center' })
        yPos += 10

        doc.setFontSize(12)
        doc.setFont('helvetica', 'normal')
        doc.text(rfpTitle, 105, yPos, { align: 'center' })
        yPos += 15

        // Executive Summary
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text('Executive Summary', 14, yPos)
        yPos += 8

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const summaryText = `We are pleased to submit our proposal for ${rfpTitle}. Our technical analysis shows a ${data.technicalAnalysis.productMatchScore}% match with your requirements. The estimated win probability for this bid is ${data.winProbability}%.`
        const splitSummary = doc.splitTextToSize(summaryText, 180)
        doc.text(splitSummary, 14, yPos)
        yPos += splitSummary.length * 5 + 10

        // Recommendation
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Overall Recommendation', 14, yPos)
        yPos += 7

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const recText = doc.splitTextToSize(data.overallRecommendation, 180)
        doc.text(recText, 14, yPos)
        yPos += recText.length * 5 + 15

        // Check if we need a new page
        if (yPos > 250) {
            doc.addPage()
            yPos = 20
        }

        // Proposed Products
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Proposed Products', 14, yPos)
        yPos += 10

        const productData = data.consolidatedResponse.selectedProducts.map(p => [
            p.sku,
            p.name,
            p.quantity.toLocaleString(),
            `₹${p.unitPrice.toLocaleString()}`,
            `₹${p.totalPrice.toLocaleString()}`,
        ])

        autoTable(doc, {
            startY: yPos,
            head: [['SKU', 'Product Name', 'Quantity', 'Unit Price', 'Total Price']],
            body: productData,
            theme: 'grid',
            headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
            margin: { left: 14, right: 14 },
        })

        yPos = (doc as any).lastAutoTable.finalY + 15

        // New page for specifications
        doc.addPage()
        yPos = 20

        // Technical Specifications
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Technical Specifications', 14, yPos)
        yPos += 10

        if (data.technicalAnalysis.comparisonTable.length > 0) {
            const specData = data.technicalAnalysis.comparisonTable.map(row => [
                row.parameter,
                row.rfpRequirement,
                row.product1,
            ])

            autoTable(doc, {
                startY: yPos,
                head: [['Parameter', 'RFP Requirement', 'Proposed Product']],
                body: specData,
                theme: 'striped',
                headStyles: { fillColor: [0, 0, 0] },
                margin: { left: 14, right: 14 },
            })

            yPos = (doc as any).lastAutoTable.finalY + 15
        }

        // Pricing Breakdown
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Pricing Breakdown', 14, yPos)
        yPos += 10

        const pricingData = [
            ['Material Cost', `₹${data.consolidatedResponse.totalMaterialCost.toLocaleString()}`],
            ['Testing Costs', `₹${data.consolidatedResponse.totalTestCost.toLocaleString()}`],
            ['Service Costs', `₹${data.consolidatedResponse.totalServiceCost.toLocaleString()}`],
            ['Grand Total', `₹${data.consolidatedResponse.grandTotal.toLocaleString()}`],
        ]

        autoTable(doc, {
            startY: yPos,
            body: pricingData,
            theme: 'plain',
            styles: { fontSize: 11, cellPadding: 3 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 60 },
                1: { halign: 'right', cellWidth: 60 },
            },
            margin: { left: 14 },
        })

        yPos = (doc as any).lastAutoTable.finalY + 15

        // Certifications & Standards
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Certifications & Standards', 14, yPos)
        yPos += 8

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        data.consolidatedResponse.certifications.forEach(cert => {
            doc.text(`• ${cert}`, 14, yPos)
            yPos += 5
        })

        yPos += 10

        // Delivery Timeline
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Delivery Timeline', 14, yPos)
        yPos += 8

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(data.consolidatedResponse.timeline, 14, yPos)

        // Footer on all pages
        const pageCount = doc.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setFontSize(8)
            doc.setFont('helvetica', 'italic')
            doc.text(
                `Page ${i} of ${pageCount}`,
                105,
                285,
                { align: 'center' }
            )
            doc.text(
                `Generated on ${new Date().toLocaleDateString()}`,
                195,
                285,
                { align: 'right' }
            )
        }

        // Return as buffer (in browser, this will be a Uint8Array)
        const pdfOutput = doc.output('arraybuffer')
        return Buffer.from(pdfOutput)
    }

    /**
     * Generate markdown summary (for preview)
     */
    generateMarkdownSummary(data: MasterAgentOutput): string {
        let markdown = `# RFP Response Summary\n\n`
        markdown += `## Executive Summary\n\n`
        markdown += `- **Win Probability**: ${data.winProbability}%\n`
        markdown += `- **Technical Match**: ${data.technicalAnalysis.productMatchScore}%\n`
        markdown += `- **Total Value**: ₹${data.consolidatedResponse.grandTotal.toLocaleString()}\n\n`

        markdown += `## Recommended Products\n\n`
        data.consolidatedResponse.selectedProducts.forEach(p => {
            markdown += `### ${p.name} (${p.sku})\n`
            markdown += `- Quantity: ${p.quantity.toLocaleString()} meters\n`
            markdown += `- Unit Price: ₹${p.unitPrice.toLocaleString()}\n`
            markdown += `- Total: ₹${p.totalPrice.toLocaleString()}\n\n`
        })

        markdown += `## Pricing Summary\n\n`
        markdown += `| Component | Amount |\n`
        markdown += `|-----------|--------|\n`
        markdown += `| Material Cost | ₹${data.consolidatedResponse.totalMaterialCost.toLocaleString()} |\n`
        markdown += `| Testing Costs | ₹${data.consolidatedResponse.totalTestCost.toLocaleString()} |\n`
        markdown += `| Service Costs | ₹${data.consolidatedResponse.totalServiceCost.toLocaleString()} |\n`
        markdown += `| **Grand Total** | **₹${data.consolidatedResponse.grandTotal.toLocaleString()}** |\n\n`

        markdown += `## Recommendation\n\n`
        markdown += `${data.overallRecommendation}\n`

        return markdown
    }
}

export const responseGenerator = new ResponseGenerator()
