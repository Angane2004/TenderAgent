import { NextRequest, NextResponse } from 'next/server'
import { getRelevantProjectTypes } from '@/lib/rfp-matching-service'

export async function POST(request: NextRequest) {
    try {
        const { count = 10, location, organization, userProfile } = await request.json()

        const isProduction = process.env.NODE_ENV === 'production'
        console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`)
        console.log(`Filters - Location: ${location || 'All'}, Organization: ${organization || 'All'}`)
        console.log(`User Profile - Industry: ${userProfile?.industry || 'None'}, Preferences: ${userProfile?.tenderPreferences?.length || 0}`)

        // Only try Ollama in development
        if (!isProduction) {
            try {
                console.log('Attempting to connect to Ollama at http://localhost:11434...')

                // Build industry-specific context for better RFP generation
                const industryContext = userProfile?.industry
                    ? `The company is in the "${userProfile.industry}" industry.`
                    : ''

                const preferencesContext = userProfile?.tenderPreferences?.length > 0
                    ? `They are interested in: ${userProfile.tenderPreferences.join(', ')}.`
                    : ''

                const prompt = `Generate ${count} realistic RFP (Request for Proposal) tender opportunities in JSON format for Indian infrastructure/construction projects.${location ? ` Focus on projects in ${location}.` : ''}${organization ? ` Focus on tenders from ${organization}.` : ''} ${industryContext} ${preferencesContext}

Return ONLY a valid JSON array with this exact structure (no additional text):
[
  {
    "title": "Construction of 2-Lane Road in Rural Area",
    "issuedBy": "${organization || 'State Public Works Department'}",
    "summary": "Tender for construction of 15 km 2-lane road connecting villages",
    "deadline": "2025-02-15",
    "estimatedValue": 45000000,
    "location": { "city": "${location || 'Mumbai'}", "state": "Maharashtra" },
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

Generate diverse, realistic Indian infrastructure/construction tenders with varying values, timelines, and requirements that match the company's industry and preferences.`

                const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'llama2',
                        prompt,
                        stream: false,
                        options: {
                            temperature: 0.8,
                            num_predict: 3000
                        }
                    }),
                    signal: AbortSignal.timeout(15000)
                })

                if (ollamaResponse.ok) {
                    const ollamaData = await ollamaResponse.json()
                    const responseText = ollamaData.response
                    const jsonMatch = responseText.match(/\[[\s\S]*\]/)

                    if (jsonMatch) {
                        try {
                            const rfps = JSON.parse(jsonMatch[0])
                            const formattedRfps = rfps.slice(0, count).map((rfp: any, index: number) => ({
                                ...rfp,
                                location: rfp.location || { city: location || 'Mumbai', state: 'Maharashtra' },
                                issuedBy: rfp.issuedBy || organization || 'Government Department'
                            }))

                            console.log(`✅ Generated ${formattedRfps.length} RFPs using Ollama/Llama2`)
                            return NextResponse.json({ success: true, rfps: formattedRfps, source: 'ollama' })
                        } catch (parseError) {
                            console.error('Error parsing Ollama JSON:', parseError)
                        }
                    }
                }
            } catch (ollamaError: any) {
                console.error('Ollama connection error:', ollamaError.message)
            }
        }

        // Fallback: Generate realistic RFPs programmatically (for both dev and prod)
        const allProjectTypes = [
            { title: 'Road Construction', issuer: 'Public Works Department', category: 'Infrastructure' },
            { title: 'Building Construction', issuer: 'Municipal Corporation', category: 'Construction' },
            { title: 'Electrical Installation', issuer: 'State Electricity Board', category: 'Electrical Infrastructure' },
            { title: 'Power Distribution Network', issuer: 'Power Distribution Company', category: 'Electrical Infrastructure' },
            { title: 'Renewable Energy Project', issuer: 'Renewable Energy Agency', category: 'Renewable Energy' },
            { title: 'Solar Power Plant', issuer: 'Energy Department', category: 'Renewable Energy' },
            { title: 'Water Supply System', issuer: 'Water Resources Department', category: 'Water & Wastewater' },
            { title: 'Bridge Construction', issuer: 'National Highways Authority', category: 'Infrastructure' },
            { title: 'School Building Project', issuer: 'Education Department', category: 'Construction' },
            { title: 'Hospital Equipment Supply', issuer: 'Health Department', category: 'Healthcare & Medical' },
            { title: 'Street Lighting Project', issuer: 'Municipal Corporation', category: 'Electrical Infrastructure' },
            { title: 'Sewage Treatment Plant', issuer: 'Urban Development Authority', category: 'Water & Wastewater' },
            { title: 'Sports Complex Development', issuer: 'Sports Authority', category: 'Construction' },
            { title: 'IT Infrastructure Setup', issuer: 'IT Department', category: 'IT & Software Services' },
            { title: 'Telecom Network Expansion', issuer: 'Telecom Authority', category: 'Telecommunications' },
            { title: 'Industrial Machinery Supply', issuer: 'Industrial Development Corporation', category: 'Industrial Machinery' },
            { title: 'Railway Electrification', issuer: 'Railway Board', category: 'Electrical Infrastructure' },
            { title: 'Wind Energy Farm', issuer: 'Renewable Energy Corporation', category: 'Renewable Energy' },
            { title: 'Oil Pipeline Project', issuer: 'Oil & Natural Gas Corporation', category: 'Oil & Gas' },
            { title: 'Mining Equipment Supply', issuer: 'Mining Authority', category: 'Mining & Minerals' },
            // Paint and Coating Industry (for AsianPaints profile)
            { title: 'Decorative Paint Supply', issuer: 'Public Works Department', category: 'Paint & Coatings' },
            { title: 'Industrial Coating Supply', issuer: 'Manufacturing Corporation', category: 'Paint & Coatings' },
            { title: 'Protective Coating Application', issuer: 'Infrastructure Development Authority', category: 'Paint & Coatings' },
            { title: 'Wall Painting Services', issuer: 'Municipal Corporation', category: 'Paint & Coatings' },
            { title: 'Weatherproof Coating Supply', issuer: 'Housing Board', category: 'Paint & Coatings' },
            { title: 'Epoxy Flooring Coating', issuer: 'Industrial Estate', category: 'Paint & Coatings' },
            { title: 'Anti-Corrosive Paint Supply', issuer: 'Port Trust Authority', category: 'Paint & Coatings' },
            { title: 'Emulsion Paint for Buildings', issuer: 'Urban Development Corporation', category: 'Paint & Coatings' },
            { title: 'Exterior Paint Supply', issuer: 'Public Works Department', category: 'Paint & Coatings' },
            { title: 'Texture Paint Application', issuer: 'Housing Development Board', category: 'Paint & Coatings' }
        ]

        // Filter project types based on user profile
        const relevantProjectTypes = userProfile
            ? getRelevantProjectTypes(userProfile, allProjectTypes)
            : allProjectTypes

        console.log(`Filtered to ${relevantProjectTypes.length} relevant project types based on profile`)

        // Use relevant project types for generation
        const projectTypes = relevantProjectTypes.length > 0 ? relevantProjectTypes : allProjectTypes

        const fallbackRfps = projectTypes.slice(0, Math.min(count, projectTypes.length)).map((project, index) => ({
            title: `${project.title} - ${location || 'Phase ' + (index + 1)}`,
            issuedBy: organization || project.issuer,
            summary: `Tender for ${project.title.toLowerCase()} project in ${location || 'various locations'} with comprehensive specifications and quality requirements`,
            deadline: new Date(Date.now() + (15 + index * 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            estimatedValue: Math.floor(Math.random() * 40000000) + 15000000,
            location: location ? { city: location, state: 'India' } : undefined,
            fitScore: Math.floor(Math.random() * 30) + 70,
            certifications: project.category?.includes('Electrical') || project.category?.includes('Renewable')
                ? ['ISO 9001:2015', 'BIS Certification', 'ISI Mark']
                : ['ISO 9001:2015', 'BIS Certification'],
            status: 'new' as const,
            specifications: project.category?.includes('Electrical') || project.category?.includes('Renewable') ? {
                quantity: Math.floor(Math.random() * 5000) + 2000,
                voltage: ['11kV', '33kV', '66kV', '132kV'][index % 4],
                size: `${[95, 185, 240, 300, 400][index % 5]} sq.mm`,
                conductor: ['Aluminum', 'Copper', 'ACSR'][index % 3],
                insulation: ['XLPE', 'PVC', 'EPR'][index % 3],
                armoring: ['SWA', 'AWA', 'STA'][index % 3],
                standards: ['IS 7098', 'IS 1554', 'IEC 60502']
            } : project.category === 'Infrastructure' || project.category === 'Construction' ? {
                quantity: Math.floor(Math.random() * 10000) + 5000,
                voltage: 'Not Applicable',
                size: `${[7, 10, 12, 15][index % 4]}m width`,
                conductor: 'Concrete/Asphalt',
                insulation: ['Bituminous', 'Tar', 'Cement'][index % 3],
                armoring: ['Steel Reinforcement', 'Fiber Mesh'][index % 2],
                standards: ['IRC Standards', 'MORTH', 'IS 456']
            } : {
                quantity: Math.floor(Math.random() * 3000) + 1000,
                voltage: 'Not Applicable',
                size: `${[5000, 10000, 15000, 20000][index % 4]} sq.ft`,
                conductor: ['RCC', 'Steel Structure', 'Precast'][index % 3],
                insulation: ['Thermal', 'Acoustic', 'Weather Resistant'][index % 3],
                armoring: ['Seismic Resistant', 'Wind Resistant'][index % 2],
                standards: ['IS 456', 'IS 800', 'NBC']
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
