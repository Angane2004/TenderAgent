import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { count = 10 } = await request.json()

        // Try Ollama first (local LLM)
        try {
            console.log('Attempting to connect to Ollama at http://localhost:11434...')

            const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama2',
                    prompt: `Generate ${count} realistic RFP (Request for Proposal) tender opportunities in JSON format. Each RFP should be for infrastructure, construction, or industrial projects in India. Include varied project types like roads, buildings, electrical systems, water supply, etc.

Return ONLY a valid JSON array with this exact structure (no additional text):
[
  {
    "title": "Construction of 2-Lane Road in Rural Area",
    "issuedBy": "State Public Works Department",
    "summary": "Tender for construction of 15 km 2-lane road connecting villages",
    "deadline": "2025-02-15",
    "estimatedValue": 45000000,
    "fitScore": 82,
    "certifications": ["ISO 9001:2015", "BIS Certification"],
    "status": "new",
    "specifications": {
      "quantity": 15000,
      "voltage": "N/A",
      "size": "2-Lane 7m width",
      "conductor": "N/A",
      "insulation": "Bituminous",
      "armoring": "N/A",
      "standards": ["IRC Standards", "MORTH"]
    },
    "deliveryTimeline": "Within 18 months",
    "testingRequirements": ["Material Testing", "Quality Checks"],
    "riskScore": "medium"
  }
]

Generate diverse, realistic Indian infrastructure/construction tenders with varying values, timelines, and requirements.`,
                    stream: false,
                    options: {
                        temperature: 0.8,
                        num_predict: 3000
                    }
                }),
                signal: AbortSignal.timeout(120000) // Increased to 120 second timeout
            })

            console.log('Ollama response status:', ollamaResponse.status)

            if (ollamaResponse.ok) {
                const ollamaData = await ollamaResponse.json()
                console.log('Ollama raw response received, length:', ollamaData.response?.length)
                // Extract JSON from response
                const responseText = ollamaData.response
                console.log('Ollama response preview:', responseText?.substring(0, 200))

                const jsonMatch = responseText.match(/\[[\s\S]*\]/)

                if (jsonMatch) {
                    console.log('Found JSON array in response')
                    try {
                        const rfps = JSON.parse(jsonMatch[0])
                        console.log('Successfully parsed', rfps.length, 'RFPs from Ollama')

                        // Validate and format RFPs
                        const formattedRfps = rfps.slice(0, count).map((rfp: any, index: number) => ({
                            title: rfp.title || `Tender ${index + 1}`,
                            issuedBy: rfp.issuedBy || 'Government Department',
                            summary: rfp.summary || 'Infrastructure development project',
                            deadline: rfp.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            estimatedValue: rfp.estimatedValue || Math.floor(Math.random() * 50000000) + 10000000,
                            fitScore: rfp.fitScore || Math.floor(Math.random() * 30) + 70,
                            certifications: rfp.certifications || ['ISO 9001:2015'],
                            status: 'new' as const,
                            specifications: rfp.specifications || {
                                quantity: Math.floor(Math.random() * 10000) + 1000,
                                voltage: 'N/A',
                                size: 'Standard',
                                conductor: 'N/A',
                                insulation: 'Standard',
                                armoring: 'N/A',
                                standards: ['IS Standards']
                            },
                            deliveryTimeline: rfp.deliveryTimeline || 'Within 12 months',
                            testingRequirements: rfp.testingRequirements || ['Quality Tests'],
                            riskScore: rfp.riskScore || (['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any)
                        }))

                        console.log(`✅ Generated ${formattedRfps.length} RFPs using Ollama/Llama2`)
                        return NextResponse.json({ success: true, rfps: formattedRfps, source: 'ollama' })
                    } catch (parseError) {
                        console.error('Error parsing Ollama JSON:', parseError)
                    }
                } else {
                    console.warn('No JSON array found in Ollama response')
                }
            } else {
                console.warn('Ollama response not OK:', ollamaResponse.statusText)
            }
        } catch (ollamaError: any) {
            console.error('Ollama connection error:', ollamaError.message)
        }

        // Fallback: Generate realistic RFPs programmatically
        const projectTypes = [
            { title: 'Road Construction', issuer: 'Public Works Department', category: 'Infrastructure' },
            { title: 'Building Construction', issuer: 'Municipal Corporation', category: 'Construction' },
            { title: 'Electrical Installation', issuer: 'State Electricity Board', category: 'Electrical' },
            { title: 'Water Supply System', issuer: 'Water Resources Department', category: 'Infrastructure' },
            { title: 'Bridge Construction', issuer: 'National Highways Authority', category: 'Infrastructure' },
            { title: 'School Building Project', issuer: 'Education Department', category: 'Construction' },
            { title: 'Hospital Equipment Supply', issuer: 'Health Department', category: 'Medical' },
            { title: 'Street Lighting Project', issuer: 'Municipal Corporation', category: 'Electrical' },
            { title: 'Sewage Treatment Plant', issuer: 'Urban Development Authority', category: 'Infrastructure' },
            { title: 'Sports Complex Development', issuer: 'Sports Authority', category: 'Construction' }
        ]

        const fallbackRfps = projectTypes.slice(0, count).map((project, index) => ({
            title: `${project.title} - Phase ${index + 1}`,
            issuedBy: project.issuer,
            summary: `Tender for ${project.title.toLowerCase()} project with comprehensive specifications and quality requirements`,
            deadline: new Date(Date.now() + (15 + index * 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            estimatedValue: Math.floor(Math.random() * 40000000) + 15000000,
            fitScore: Math.floor(Math.random() * 30) + 70,
            certifications: project.category === 'Electrical'
                ? ['ISO 9001:2015', 'BIS Certification', 'ISI Mark']
                : ['ISO 9001:2015', 'BIS Certification'],
            status: 'new' as const,
            specifications: {
                quantity: Math.floor(Math.random() * 5000) + 2000,
                voltage: project.category === 'Electrical' ? '11kV' : 'N/A',
                size: 'As per specifications',
                conductor: project.category === 'Electrical' ? 'Aluminum' : 'N/A',
                insulation: project.category === 'Electrical' ? 'XLPE' : 'Standard',
                armoring: project.category === 'Electrical' ? 'SWA' : 'N/A',
                standards: ['IS Standards', 'CPWD Standards']
            },
            deliveryTimeline: `Within ${12 + index * 2} months`,
            testingRequirements: ['Quality Tests', 'Compliance Verification', 'Material Testing'],
            riskScore: (['low', 'medium', 'high'][index % 3] as any)
        }))

        console.log(`⚠️ Generated ${fallbackRfps.length} RFPs using fallback (programmatic)`)
        return NextResponse.json({ success: true, rfps: fallbackRfps, source: 'fallback' })

    } catch (error) {
        console.error('Error generating RFPs:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to generate RFPs' },
            { status: 500 }
        )
    }
}
