import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { RFP } from "@/types"

export async function generateTenderPDF(rfp: RFP): Promise<void> {
    const doc = new jsPDF()
    let yPosition = 20

    // Helper function to add text with word wrap
    const addText = (text: string, x: number, y: number, maxWidth: number = 170): number => {
        const lines = doc.splitTextToSize(text, maxWidth)
        doc.text(lines, x, y)
        return y + (lines.length * 7)
    }

    // Helper function to add section heading
    const addHeading = (text: string, y: number): number => {
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text(text, 20, y)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        return y + 10
    }

    // Cover Page
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('TENDER DOCUMENT', 105, 40, { align: 'center' })

    doc.setFontSize(16)
    yPosition = 60
    yPosition = addText(rfp.title, 20, yPosition, 170)

    doc.setFontSize(12)
    yPosition += 20
    doc.text(`Tender Number: ${rfp.tenderNumber || 'N/A'}`, 20, yPosition)
    yPosition += 10
    doc.text(`Issued By: ${rfp.issuedBy}`, 20, yPosition)
    yPosition += 10
    if (rfp.location) {
        doc.text(`Location: ${rfp.location.city}, ${rfp.location.state}`, 20, yPosition)
        yPosition += 10
    }
    doc.text(`Deadline: ${new Date(rfp.deadline).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })}`, 20, yPosition)

    // Add disclaimer
    yPosition = 250
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text('This is a system-generated document. For official purposes, please refer to the original tender notification.', 105, yPosition, { align: 'center' })

    // Page 2 - Tender Details
    doc.addPage()
    yPosition = 20

    yPosition = addHeading('1. TENDER INFORMATION', yPosition)
    yPosition += 5

    const tenderInfo = [
        ['Tender Number', rfp.tenderNumber || 'N/A'],
        ['Published Date', rfp.publishedDate ? new Date(rfp.publishedDate).toLocaleDateString('en-IN') : 'N/A'],
        ['Submission Deadline', new Date(rfp.deadline).toLocaleDateString('en-IN')],
        ['Pre-Bid Meeting', rfp.preBidMeetingDate ? new Date(rfp.preBidMeetingDate).toLocaleDateString('en-IN') : 'N/A'],
        ['Site Visit Date', rfp.siteVisitDate ? new Date(rfp.siteVisitDate).toLocaleDateString('en-IN') : 'N/A'],
        ['Estimated Value', rfp.estimatedValue ? `₹${rfp.estimatedValue.toLocaleString('en-IN')}` : 'N/A'],
        ['EMD Amount', rfp.emdAmount ? `₹${rfp.emdAmount.toLocaleString('en-IN')}` : 'N/A'],
        ['Performance Guarantee', rfp.performanceGuarantee ? `${(rfp.performanceGuarantee / (rfp.estimatedValue || 1) * 100).toFixed(0)}% of contract value` : 'N/A'],
    ]

    autoTable(doc, {
        startY: yPosition,
        head: [['Parameter', 'Details']],
        body: tenderInfo,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9 }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // Tender Details Section (Government Format)
    doc.addPage()
    yPosition = 20
    yPosition = addHeading('TENDER DETAILS', yPosition)
    yPosition += 5

    // Basic Details
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Basic Details', 20, yPosition)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    yPosition += 8

    const basicDetails = [
        ['Organisation Chain', rfp.issuedBy],
        ['Tender Reference Number', `${rfp.issuedBy.toUpperCase().slice(0, 3)}/PWD/${new Date().getFullYear()}/${rfp.id.slice(0, 6)}`],
        ['Tender ID', `${new Date().getFullYear()}_TID_${rfp.id.slice(0, 8).toUpperCase()}`],
        ['Withdrawal Allowed', 'Yes'],
        ['Tender Type', 'Open Tender'],
        ['Form Of Contract', 'Percentage'],
        ['Tender Category', 'Works'],
        ['No. of Covers', '2'],
        ['Payment Mode', 'Online'],
        ['Allow Two Stage Bidding', 'No']
    ]

    autoTable(doc, {
        startY: yPosition,
        body: basicDetails,
        theme: 'grid',
        styles: { fontSize: 9 },
        columnStyles: {
            0: { cellWidth: 80, fontStyle: 'bold' },
            1: { cellWidth: 100 }
        }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 12

    // Covers Information
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Covers Information, No. Of Covers - 2', 20, yPosition)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    yPosition += 8

    const coversInfo = [
        ['1', 'Fee/PreQual/Technical', 'Attach Scanned Copy of online Tender Fee and EMD receipt & mentioned documents', '.pdf'],
        ['2', 'Finance', 'Commercial Bid', '.xls']
    ]

    autoTable(doc, {
        startY: yPosition,
        head: [['Cover No', 'Cover Type', 'Description', 'Document Type']],
        body: coversInfo,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9 },
        columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 45 },
            2: { cellWidth: 95 },
            3: { cellWidth: 30 }
        }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 12

    // Fee Details
    if (yPosition > 200) {
        doc.addPage()
        yPosition = 20
    }

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Tender Fee Details [Total Fee in ₹ - 1,680]', 20, yPosition)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    yPosition += 8

    const tenderFeeDetails = [
        ['Tender Fee in ₹', '1,180'],
        ['Processing Fee in ₹', '500'],
        ['Fee Payable To', 'Nil'],
        ['Tender Fee Exemption Allowed', 'No']
    ]

    autoTable(doc, {
        startY: yPosition,
        body: tenderFeeDetails,
        theme: 'grid',
        styles: { fontSize: 9 },
        columnStyles: {
            0: { cellWidth: 80, fontStyle: 'bold' },
            1: { cellWidth: 100 }
        }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 10

    // EMD Fee Details
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('EMD Fee Details', 20, yPosition)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    yPosition += 8

    const emdFeeDetails = [
        ['EMD Amount in ₹', Math.round((rfp.estimatedValue || 0) * 0.01).toLocaleString('en-IN')],
        ['EMD Exemption Allowed', 'No'],
        ['EMD Fee Type', 'fixed'],
        ['EMD Percentage', '1%']
    ]

    autoTable(doc, {
        startY: yPosition,
        body: emdFeeDetails,
        theme: 'grid',
        styles: { fontSize: 9 },
        columnStyles: {
            0: { cellWidth: 80, fontStyle: 'bold' },
            1: { cellWidth: 100 }
        }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 12

    // Work Item Details
    doc.addPage()
    yPosition = 20

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Work Item Details', 20, yPosition)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    yPosition += 8

    const workItemDetails = [
        ['Title', rfp.title],
        ['Work Description', rfp.summary],
        ['Tender Value in ₹', `₹${(rfp.estimatedValue || 0).toLocaleString('en-IN')}`],
        ['Product Category', 'Electrical Works - Cables'],
        ['Contract Type', 'Tender'],
        ['Bid Validity (Days)', '180'],
        ['Period Of Work (Days)', '240'],
        ['Location', rfp.location ? `${rfp.location.city}, ${rfp.location.state}` : 'N/A']
    ]

    autoTable(doc, {
        startY: yPosition,
        body: workItemDetails,
        theme: 'grid',
        styles: { fontSize: 9 },
        columnStyles: {
            0: { cellWidth: 60, fontStyle: 'bold' },
            1: { cellWidth: 120 }
        }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 12

    // Critical Dates
    if (yPosition > 180) {
        doc.addPage()
        yPosition = 20
    }

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Critical Dates', 20, yPosition)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    yPosition += 8

    const publishedDate = new Date(rfp.deadline)
    const downloadStartDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    const downloadEndDate = new Date(new Date(rfp.deadline).getTime() - 2 * 24 * 60 * 60 * 1000)
    const dateFormat = (date: Date) => date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    const criticalDates = [
        ['Published Date', dateFormat(publishedDate)],
        ['Bid Opening Date', dateFormat(publishedDate)],
        ['Document Download Start Date', dateFormat(downloadStartDate)],
        ['Document Download End Date', dateFormat(downloadEndDate)],
        ['Bid Submission Start Date', dateFormat(downloadStartDate)],
        ['Bid Submission End Date', dateFormat(downloadEndDate)]
    ]

    autoTable(doc, {
        startY: yPosition,
        body: criticalDates,
        theme: 'grid',
        styles: { fontSize: 9 },
        columnStyles: {
            0: { cellWidth: 80, fontStyle: 'bold' },
            1: { cellWidth: 100 }
        }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 12

    // Tender Documents
    if (yPosition > 150) {
        doc.addPage()
        yPosition = 20
    }

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Tender Documents', 20, yPosition)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    yPosition += 8

    // NIT Document
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('NIT Document', 20, yPosition)
    doc.setFont('helvetica', 'normal')
    yPosition += 6

    const nitDocuments = [
        ['1', 'Tendernotice_1.pdf', `Inviting ETender Notice for ${rfp.title}`, '103.45']
    ]

    autoTable(doc, {
        startY: yPosition,
        head: [['S.No', 'Document Name', 'Description', 'Size (KB)']],
        body: nitDocuments,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 8 },
        columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 40 },
            2: { cellWidth: 105 },
            3: { cellWidth: 30 }
        }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 8

    // Work Item Documents
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Work Item Documents', 20, yPosition)
    doc.setFont('helvetica', 'normal')
    yPosition += 6

    const workDocuments = [
        ['1', 'BOQ', 'BOQ_2170758.xls', 'Commercial Bid', '333.00'],
        ['2', 'Other Document', 'SHB.pdf', 'Standard Bidding Document', '49.68'],
        ['3', 'Tender Documents', 'MainTendDoc.pdf', 'Main Tender Documents', '834.69']
    ]

    autoTable(doc, {
        startY: yPosition,
        head: [['S.No', 'Document Type', 'Document Name', 'Description', 'Size (KB)']],
        body: workDocuments,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 8 },
        columnStyles: {
            0: { cellWidth: 12 },
            1: { cellWidth: 35 },
            2: { cellWidth: 38 },
            3: { cellWidth: 75 },
            4: { cellWidth: 30 }
        }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 12

    // Tender Inviting Authority
    if (yPosition > 230) {
        doc.addPage()
        yPosition = 20
    }

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Tender Inviting Authority', 20, yPosition)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    yPosition += 8

    const authorityDetails = [
        ['Name', `Commissioner, ${rfp.issuedBy}`],
        ['Address', rfp.location ? `${rfp.issuedBy}, ${rfp.location.city}, ${rfp.location.state}, India` : rfp.issuedBy]
    ]

    autoTable(doc, {
        startY: yPosition,
        body: authorityDetails,
        theme: 'grid',
        styles: { fontSize: 9 },
        columnStyles: {
            0: { cellWidth: 40, fontStyle: 'bold' },
            1: { cellWidth: 140 }
        }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // Description
    if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
    }
    yPosition = addHeading('2. DETAILED DESCRIPTION', yPosition)
    yPosition = addText(rfp.detailedDescription || rfp.summary, 20, yPosition, 170)

    // Page 3 - Scope of Work
    doc.addPage()
    yPosition = 20
    yPosition = addHeading('3. SCOPE OF WORK', yPosition)

    if (rfp.scopeOfWork && rfp.scopeOfWork.length > 0) {
        rfp.scopeOfWork.forEach((item, index) => {
            if (yPosition > 270) {
                doc.addPage()
                yPosition = 20
            }
            const text = `${index + 1}. ${item}`
            yPosition = addText(text, 20, yPosition, 170)
            yPosition += 3
        })
    }

    // Page - Technical Specifications
    doc.addPage()
    yPosition = 20
    yPosition = addHeading('4. TECHNICAL SPECIFICATIONS', yPosition)

    const specData = [
        ['Voltage', rfp.specifications.voltage],
        ['Size/Rating', rfp.specifications.size],
        ['Conductor', rfp.specifications.conductor || 'N/A'],
        ['Insulation', rfp.specifications.insulation || 'N/A'],
        ['Armoring', rfp.specifications.armoring || 'N/A'],
        ['Quantity', `${rfp.specifications.quantity.toLocaleString()} ${rfp.title.toLowerCase().includes('cable') ? 'meters' : 'units'}`],
        ['Standards', rfp.specifications.standards?.join(', ') || 'N/A'],
    ]

    autoTable(doc, {
        startY: yPosition,
        head: [['Specification', 'Details']],
        body: specData,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9 }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // Technical Requirements
    if (rfp.technicalRequirements && rfp.technicalRequirements.length > 0) {
        if (yPosition > 240) {
            doc.addPage()
            yPosition = 20
        }
        yPosition = addHeading('4.1 TECHNICAL REQUIREMENTS', yPosition)

        const techReqData = rfp.technicalRequirements.map((req, index) => [
            (index + 1).toString(),
            req.description,
            req.mandatory ? 'Yes' : 'No'
        ])

        autoTable(doc, {
            startY: yPosition,
            head: [['Sr.', 'Requirement', 'Mandatory']],
            body: techReqData,
            theme: 'grid',
            headStyles: { fillColor: [0, 0, 0], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 9 },
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 140 },
                2: { cellWidth: 25 }
            }
        })

        yPosition = (doc as any).lastAutoTable.finalY + 10
    }

    // Page - Testing Requirements
    doc.addPage()
    yPosition = 20
    yPosition = addHeading('5. TESTING REQUIREMENTS', yPosition)

    if (rfp.testingRequirements && rfp.testingRequirements.length > 0) {
        rfp.testingRequirements.forEach((test, index) => {
            if (yPosition > 270) {
                doc.addPage()
                yPosition = 20
            }
            yPosition = addText(`${index + 1}. ${test}`, 20, yPosition, 170)
            yPosition += 2
        })
    }

    yPosition += 10

    // Inspection and Testing
    if (rfp.inspectionAndTesting && rfp.inspectionAndTesting.length > 0) {
        if (yPosition > 240) {
            doc.addPage()
            yPosition = 20
        }
        yPosition = addHeading('5.1 INSPECTION & TESTING SCHEDULE', yPosition)

        rfp.inspectionAndTesting.forEach((item, index) => {
            if (yPosition > 270) {
                doc.addPage()
                yPosition = 20
            }
            yPosition = addText(`${index + 1}. ${item}`, 20, yPosition, 170)
            yPosition += 2
        })
    }

    // Page - Terms and Conditions
    doc.addPage()
    yPosition = 20
    yPosition = addHeading('6. TERMS AND CONDITIONS', yPosition)

    if (rfp.termsAndConditions && rfp.termsAndConditions.length > 0) {
        rfp.termsAndConditions.forEach((term, index) => {
            if (yPosition > 250) {
                doc.addPage()
                yPosition = 20
            }
            yPosition = addHeading(`6.${index + 1} ${term.section.toUpperCase()}`, yPosition)

            term.details.forEach((detail, detailIndex) => {
                if (yPosition > 270) {
                    doc.addPage()
                    yPosition = 20
                }
                yPosition = addText(`  ${detailIndex + 1}. ${detail}`, 20, yPosition, 165)
                yPosition += 2
            })
            yPosition += 5
        })
    }

    // Payment Terms
    if (rfp.paymentTerms && rfp.paymentTerms.length > 0) {
        if (yPosition > 240) {
            doc.addPage()
            yPosition = 20
        }
        yPosition = addHeading('6.A PAYMENT TERMS', yPosition)

        rfp.paymentTerms.forEach((term, index) => {
            if (yPosition > 270) {
                doc.addPage()
                yPosition = 20
            }
            yPosition = addText(`${index + 1}. ${term}`, 20, yPosition, 170)
            yPosition += 2
        })
    }

    // Page - Evaluation Criteria
    doc.addPage()
    yPosition = 20
    yPosition = addHeading('7. EVALUATION CRITERIA', yPosition)

    if (rfp.evaluationCriteria && rfp.evaluationCriteria.length > 0) {
        const evalData = rfp.evaluationCriteria.map((criteria, index) => [
            (index + 1).toString(),
            criteria.criterion,
            `${criteria.weightage}%`
        ])

        autoTable(doc, {
            startY: yPosition,
            head: [['Sr.', 'Criterion', 'Weightage']],
            body: evalData,
            theme: 'grid',
            headStyles: { fillColor: [0, 0, 0], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 9 },
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 140 },
                2: { cellWidth: 25 }
            }
        })

        yPosition = (doc as any).lastAutoTable.finalY + 15
    }

    // Documents Required
    if (rfp.documentsRequired && rfp.documentsRequired.length > 0) {
        if (yPosition > 200) {
            doc.addPage()
            yPosition = 20
        }
        yPosition = addHeading('8. DOCUMENTS REQUIRED', yPosition)

        rfp.documentsRequired.forEach((doc_req, index) => {
            if (yPosition > 270) {
                doc.addPage()
                yPosition = 20
            }
            yPosition = addText(`${index + 1}. ${doc_req}`, 20, yPosition, 170)
            yPosition += 2
        })
    }

    // Page - Contact Information
    doc.addPage()
    yPosition = 20
    yPosition = addHeading('9. CONTACT INFORMATION', yPosition)

    if (rfp.contactPerson) {
        const contactData = [
            ['Name', rfp.contactPerson.name],
            ['Designation', rfp.contactPerson.designation],
            ['Email', rfp.contactPerson.email],
            ['Phone', rfp.contactPerson.phone],
        ]

        autoTable(doc, {
            startY: yPosition,
            body: contactData,
            theme: 'grid',
            styles: { fontSize: 10 }
        })

        yPosition = (doc as any).lastAutoTable.finalY + 15
    }

    // Organization Details
    yPosition = addHeading('10. ORGANIZATION DETAILS', yPosition)

    const orgData = [
        ['Organization', rfp.issuedBy],
        ['Type', rfp.organizationType || 'N/A'],
        ['Category', rfp.organizationCategory || 'N/A'],
    ]

    if (rfp.location) {
        orgData.push(['Address', `${rfp.location.city}, ${rfp.location.state} - ${rfp.location.pincode || ''}`])
    }

    autoTable(doc, {
        startY: yPosition,
        body: orgData,
        theme: 'grid',
        styles: { fontSize: 10 }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // Additional Information
    if (rfp.warranty || rfp.packingAndForwarding) {
        if (yPosition > 220) {
            doc.addPage()
            yPosition = 20
        }
        yPosition = addHeading('11. ADDITIONAL INFORMATION', yPosition)

        if (rfp.warranty) {
            doc.setFont('helvetica', 'bold')
            doc.text('Warranty:', 20, yPosition)
            doc.setFont('helvetica', 'normal')
            yPosition += 7
            yPosition = addText(rfp.warranty, 20, yPosition, 170)
            yPosition += 7
        }

        if (rfp.packingAndForwarding) {
            doc.setFont('helvetica', 'bold')
            doc.text('Packing & Forwarding:', 20, yPosition)
            doc.setFont('helvetica', 'normal')
            yPosition += 7
            yPosition = addText(rfp.packingAndForwarding, 20, yPosition, 170)
        }
    }

    // Footer on last page
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'italic')
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' })
        doc.text(`Tender No: ${rfp.tenderNumber || rfp.id}`, 20, 290)
    }

    // Save the PDF
    const filename = `${rfp.tenderNumber || rfp.id}_Tender_Document.pdf`
    doc.save(filename)
}
