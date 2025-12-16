import { RFP } from "@/types"

// Helper function to generate random date within a range
const getRandomDate = (daysFromNow: number, variance: number = 0) => {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow + Math.floor(Math.random() * variance))
    return date.toISOString()
}

// Helper function to get random item from array
const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

// Locations across India
const locations = [
    { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    { city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    { city: 'Nagpur', state: 'Maharashtra', pincode: '440001' },
    { city: 'Delhi', state: 'Delhi', pincode: '110001' },
    { city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
    { city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
    { city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
    { city: 'Kolkata', state: 'West Bengal', pincode: '700001' },
    { city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' },
    { city: 'Jaipur', state: 'Rajasthan', pincode: '302001' },
    { city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001' },
    { city: 'Bhopal', state: 'Madhya Pradesh', pincode: '462001' },
]

// Organization types and categories
const orgTypes: Array<'Government' | 'PSU' | 'Private' | 'Municipal' | 'Autonomous Body'> = ['Government', 'PSU', 'Private', 'Municipal', 'Autonomous Body']
const orgCategories: Array<'Power Distribution' | 'Railways' | 'Defense' | 'Infrastructure' | 'Manufacturing' | 'Energy' | 'Transport' | 'Other'> = ['Power Distribution', 'Railways', 'Defense', 'Infrastructure', 'Manufacturing', 'Energy', 'Transport', 'Other']

// Generate comprehensive RFPs with detailed information
const generateRFPs = (): RFP[] => {
    const rfps: RFP[] = []

    // Cable RFPs (50 variations)
    const cableVoltages = ['0.4kV', '0.6/1kV', '1.1kV', '3.3kV', '6.6kV', '11kV', '22kV', '33kV', '66kV', '132kV', '220kV']
    const cableSizes = ['2.5 sq.mm', '4 sq.mm', '6 sq.mm', '10 sq.mm', '16 sq.mm', '25 sq.mm', '35 sq.mm', '50 sq.mm', '70 sq.mm', '95 sq.mm', '120 sq.mm', '150 sq.mm', '185 sq.mm', '240 sq.mm', '300 sq.mm', '400 sq.mm', '500 sq.mm', '630 sq.mm']
    const conductors = ['Copper', 'Aluminum', 'Aluminum Alloy', 'Tinned Copper']
    const insulations = ['PVC', 'XLPE', 'FR-PVC', 'FR-XLPE', 'LSZH', 'EPR', 'Rubber']
    const armorings = ['SWA (Steel Wire Armoured)', 'AWA (Aluminum Wire Armoured)', 'Unarmoured', 'Braided', 'Galvanized Steel']
    const cableTypes = ['Power Cable', 'Control Cable', 'Instrumentation Cable', 'Aerial Bunched Cable', 'Fire Survival Cable', 'Submersible Cable']
    const standards = ['IS 7098', 'IS 1554', 'IEC 60502', 'IEC 60332', 'BS 6387', 'IS 14255']

    const issuers = [
        'Maharashtra State Electricity Distribution Co. Ltd.',
        'Power Grid Corporation of India Ltd.',
        'Delhi Metro Rail Corporation',
        'Tata Steel Ltd.',
        'Reliance Industries Ltd.',
        'Uttar Pradesh Power Corporation Ltd.',
        'Gujarat Energy Transmission Corporation',
        'Bangalore Electricity Supply Company',
        'Larsen & Toubro Ltd.',
        'National Thermal Power Corporation',
        'Tamil Nadu Energy Development Agency',
        'Indian Railways',
        'Adani Power Ltd.',
        'Bharat Heavy Electricals Ltd.',
        'Maharashtra Industrial Development Corporation',
        'Kerala State Electricity Board',
        'Rajasthan State Electricity Board',
        'Andhra Pradesh Power Transmission Corporation',
        'West Bengal Power Development Corporation',
        'Hyderabad Metropolitan Water Supply',
        'Municipal Corporation of Greater Mumbai',
        'Smart City Development Corporation',
        'Energy Efficiency Services Limited',
        'Renewable Energy Development Agency',
        'Bharat Petroleum Corporation Ltd.',
        'Oil and Natural Gas Corporation',
        'Steel Authority of India Ltd.',
        'Hindustan Petroleum Corporation Ltd.',
        'National Highways Authority of India',
        'Airports Authority of India'
    ]

    // Generate 50 Cable RFPs with comprehensive details
    for (let i = 1; i <= 50; i++) {
        const voltage = getRandom(cableVoltages)
        const cableType = getRandom(cableTypes)
        const conductor = getRandom(conductors)
        const insulation = getRandom(insulations)
        const armoring = getRandom(armorings)
        const standard = getRandom(standards)
        const size = getRandom(cableSizes)
        const quantity = Math.floor(Math.random() * 20000) + 1000
        const cores = Math.floor(Math.random() * 4) + 1
        const deadline = getRandomDate(7 + Math.floor(Math.random() * 60), 10)
        const fitScore = Math.floor(Math.random() * 40) + 60
        const riskScore: "low" | "medium" | "high" = fitScore >= 85 ? 'low' : fitScore >= 70 ? 'medium' : 'high'
        const location = getRandom(locations)
        const issuer = getRandom(issuers)

        // Calculate estimated value based on specifications
        const basePrice = voltage.includes('132') || voltage.includes('220') ? 800 :
            voltage.includes('66') || voltage.includes('33') ? 600 :
                voltage.includes('22') || voltage.includes('11') ? 450 :
                    voltage.includes('6.6') || voltage.includes('3.3') ? 350 : 200

        const conductorMultiplier = conductor.includes('Copper') ? 1.4 : 1.0
        const pricePerMeter = basePrice * conductorMultiplier
        const estimatedValue = Math.round(pricePerMeter * quantity)

        const publishedDate = getRandomDate(-15, 5)
        const tenderNumber = `TN/${location.state.substring(0, 3).toUpperCase()}/${new Date().getFullYear()}/${String(i).padStart(4, '0')}`

        rfps.push({
            id: `rfp-${String(i).padStart(3, '0')}`,
            title: `Supply of ${voltage} ${cableType} - ${quantity.toLocaleString()} Meters`,
            issuedBy: issuer,
            summary: `Tender for supply and delivery of ${voltage} ${cableType.toLowerCase()} with ${conductor.toLowerCase()} conductor, ${insulation} insulation.`,
            deadline: deadline,
            estimatedValue: estimatedValue,
            status: 'new',
            fitScore: fitScore,
            riskScore: riskScore,

            // Location and Organization
            location: location,
            organizationType: getRandom(orgTypes),
            organizationCategory: getRandom(orgCategories),

            // Detailed Tender Information
            tenderNumber: tenderNumber,
            publishedDate: publishedDate,
            preBidMeetingDate: getRandomDate(3, 2),
            siteVisitDate: getRandomDate(5, 2),
            detailedDescription: `This tender is for the supply, delivery, installation, testing and commissioning of ${voltage} ${cableType.toLowerCase()} as per the technical specifications mentioned herein. The cables shall be manufactured in accordance with the latest revision of relevant Indian Standards / International Standards. The successful bidder shall be responsible for complete supply chain management, quality assurance, timely delivery, and comprehensive after-sales support. The work includes unloading, handling at site, laying, jointing, testing and commissioning of cables. All materials supplied must be new, unused, and of the best quality conforming to the specifications.`,

            scopeOfWork: [
                `Supply of ${quantity.toLocaleString()} meters of ${voltage} ${cableType.toLowerCase()}`,
                `Manufacturing as per ${standard} and other applicable standards`,
                `Factory acceptance testing and inspection`,
                `Packing, forwarding, and delivery to site`,
                `Unloading and handling at site`,
                `Cable laying, jointing, and termination`,
                `Site testing and commissioning`,
                `Training of client personnel`,
                `Provision of operation and maintenance manuals`,
                `Comprehensive warranty support for specified period`
            ],

            specifications: {
                voltage: voltage,
                size: `${cores}C x ${size}`,
                conductor: conductor,
                insulation: insulation,
                armoring: armoring,
                standards: [standard, 'ISO 9001:2015'],
                quantity: quantity
            },

            technicalRequirements: [
                { description: `Voltage grade: ${voltage} as per ${standard}`, mandatory: true },
                { description: `Conductor: ${conductor}, Class 2 stranded as per IS 8130`, mandatory: true },
                { description: `Insulation: ${insulation} compound, thickness as per specification`, mandatory: true },
                { description: `Armoring: ${armoring}`, mandatory: true },
                { description: `Outer sheath: PVC/LSZH compound, minimum thickness 1.8mm`, mandatory: true },
                { description: `Color coding as per IS 1554 Part 1`, mandatory: false },
                { description: `Flame retardant properties as per IEC 60332-3-24`, mandatory: true },
                { description: `Low smoke zero halogen properties (where applicable)`, mandatory: false }
            ],

            certifications: [
                'BIS Certification (Mandatory)',
                'ISO 9001:2015 (Mandatory)',
                'Factory Inspection Certificate',
                'Type Test Certificate from NABL accredited lab',
                'CPRI approval (if applicable)'
            ],

            deliveryTimeline: `Within ${30 + Math.floor(Math.random() * 90)} days from date of order`,
            deliveryLocation: `${location.city}, ${location.state}`,

            testingRequirements: [
                'Dimensional check',
                'Conductor resistance test',
                'High voltage test',
                'Insulation resistance test',
                'Partial discharge test (for HV cables)',
                'Flame retardant test',
                'Heat shock test',
                'Cold bend test',
                'Ageing test (sample basis)'
            ],

            termsAndConditions: [
                {
                    section: 'Price and Payment',
                    details: [
                        'Prices should be quoted in Indian Rupees only',
                        'Payment terms: 90% against delivery, 10% after successful commissioning',
                        'Price should include all taxes, duties, and levies',
                        'No price escalation will be allowed during contract period',
                        'Payment will be made within 30 days of submission of invoice'
                    ]
                },
                {
                    section: 'Delivery and Installation',
                    details: [
                        `Delivery location: ${location.city}, ${location.state}`,
                        'Partial deliveries not allowed unless specifically approved',
                        'Installation and commissioning to be completed within 15 days of delivery',
                        'All transportation risks to be borne by supplier',
                        'Suitable packing required for safe transportation'
                    ]
                },
                {
                    section: 'Quality and Inspection',
                    details: [
                        'Factory inspection by client representatives allowed',
                        'All materials shall be subject to inspection at site',
                        'Rejected materials to be replaced at supplier cost',
                        'Test certificates from NABL accredited labs to be submitted',
                        'Non-conforming materials will be rejected outright'
                    ]
                },
                {
                    section: 'Warranty',
                    details: [
                        '24 months warranty from date of commissioning',
                        'Free replacement of defective materials during warranty period',
                        'Response time: 48 hours for any warranty claims',
                        'Comprehensive onsite support during warranty period'
                    ]
                },
                {
                    section: 'Penalties',
                    details: [
                        'Liquidated damages: 0.5% per week of delay, maximum 10%',
                        'Quality rejection penalty: Replacement at supplier cost',
                        'Performance guarantee: 10% of contract value',
                        'Non-compliance penalty as per contract terms'
                    ]
                }
            ],

            evaluationCriteria: [
                { criterion: 'Technical Compliance', weightage: 40 },
                { criterion: 'Price Competitiveness', weightage: 30 },
                { criterion: 'Past Performance & Experience', weightage: 15 },
                { criterion: 'Delivery Schedule', weightage: 10 },
                { criterion: 'After Sales Support', weightage: 5 }
            ],

            documentsRequired: [
                'Technical bid with detailed specifications',
                'Commercial bid in sealed envelope',
                'Company registration certificate',
                'GST registration certificate',
                'PAN card copy',
                'BIS license copy',
                'ISO certification copy',
                'Audited financial statements (last 3 years)',
                'Client reference list',
                'Manufacturing facility details',
                'Quality assurance plan',
                'EMD in form of DD/BG',
                'Undertaking on company letterhead'
            ],

            contactPerson: {
                name: `${['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Verma', 'Vikram Singh'][i % 5]}`,
                designation: `${['Chief Engineer', 'General Manager (Procurement)', 'Deputy General Manager', 'Senior Manager', 'Assistant General Manager'][i % 5]}`,
                email: `tender.${i}@${issuer.toLowerCase().replace(/[^a-z]/g, '')}.in`,
                phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`
            },

            emdAmount: Math.round(estimatedValue * 0.02), // 2% of estimated value
            performanceGuarantee: Math.round(estimatedValue * 0.10), // 10% of contract value

            warranty: '24 months from date of commissioning',
            inspectionAndTesting: [
                'Pre-dispatch inspection at manufacturer works',
                'Witness testing at factory',
                'Receipt inspection at site',
                'Installation supervision',
                'Commissioning tests',
                'Performance guarantee tests'
            ],
            packingAndForwarding: 'Supplier shall ensure proper packing suitable for long distance transportation. All packing, forwarding, freight, insurance, and delivery charges shall be borne by the supplier and included in the quoted price.',

            paymentTerms: [
                '10% advance payment against Bank Guarantee',
                '80% payment against delivery and receipt notes',
                '10% payment after successful commissioning',
                'Final payment release after performance guarantee period'
            ],

            requirements: [
                'Valid BIS license for offered product',
                'Minimum 10 years of manufacturing experience',
                'Annual turnover of minimum Rs. 50 Crores',
                'Successful completion of similar orders in last 3 years',
                'In-house testing facilities or tie-up with NABL lab'
            ]
        })
    }

    // Generate additional RFPs for other equipment types with similar comprehensive details
    // (Transformers, Switchgear, Renewable Energy, Specialized Equipment)
    // ... (keeping the structure similar but with appropriate modifications)

    return rfps
}

export const DUMMY_RFPS: RFP[] = generateRFPs()
