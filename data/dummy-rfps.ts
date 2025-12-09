import { RFP } from "@/types"

// Helper function to generate random date within a range
const getRandomDate = (daysFromNow: number, variance: number = 0) => {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow + Math.floor(Math.random() * variance))
    return date.toISOString()
}

// Helper function to get random item from array
const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

// Generate 100+ unique RFPs with diverse specifications
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

    // Generate 50 Cable RFPs
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
        const riskScore = fitScore >= 85 ? 'low' : fitScore >= 70 ? 'medium' : 'high'

        // Calculate estimated value based on specifications
        const basePrice = voltage.includes('132') || voltage.includes('220') ? 800 :
            voltage.includes('66') || voltage.includes('33') ? 600 :
                voltage.includes('22') || voltage.includes('11') ? 450 :
                    voltage.includes('6.6') || voltage.includes('3.3') ? 350 : 200

        const conductorMultiplier = conductor.includes('Copper') ? 1.4 : 1.0
        const pricePerMeter = basePrice * conductorMultiplier
        const estimatedValue = Math.round(pricePerMeter * quantity)

        rfps.push({
            id: `rfp-${String(i).padStart(3, '0')}`,
            title: `Supply of ${voltage} ${cableType} - ${quantity.toLocaleString()} Meters`,
            issuedBy: getRandom(issuers),
            summary: `Tender for supply and delivery of ${voltage} ${cableType.toLowerCase()} with ${conductor.toLowerCase()} conductor, ${insulation} insulation.`,
            deadline: deadline,
            estimatedValue: estimatedValue,
            status: 'new',
            fitScore: fitScore,
            specifications: {
                voltage: voltage,
                size: `${cores}C x ${size}`,
                conductor: conductor,
                insulation: insulation,
                armoring: armoring,
                standards: [standard],
                quantity: quantity
            },
            certifications: [
                'BIS Certification',
                'ISO 9001:2015',
                'Factory Inspection Certificate'
            ],
            deliveryTimeline: `Within ${30 + Math.floor(Math.random() * 90)} days from date of order`
        })
    }

    // Generate 20 Transformer RFPs
    const transformerSizes = ['25kVA', '63kVA', '100kVA', '160kVA', '250kVA', '315kVA', '500kVA', '630kVA', '1000kVA', '1600kVA', '2500kVA']
    const transformerVoltages = ['11kV/433V', '22kV/433V', '33kV/11kV', '66kV/11kV', '132kV/33kV']

    for (let i = 51; i <= 70; i++) {
        const size = getRandom(transformerSizes)
        const voltage = getRandom(transformerVoltages)
        const quantity = Math.floor(Math.random() * 30) + 5
        const deadline = getRandomDate(20 + Math.floor(Math.random() * 50), 10)
        const fitScore = Math.floor(Math.random() * 35) + 65

        const estimatedValue = Math.round(quantity * (size.includes('2500') ? 40000000 :
            size.includes('1600') ? 25000000 :
                size.includes('1000') ? 15000000 :
                    size.includes('630') ? 10000000 :
                        size.includes('500') ? 8000000 : 5000000))

        rfps.push({
            id: `rfp-${String(i).padStart(3, '0')}`,
            title: `Distribution Transformers ${size} ${voltage} - ${quantity} Units`,
            issuedBy: getRandom(issuers),
            summary: `Procurement of oil-filled distribution transformers for grid strengthening project.`,
            deadline: deadline,
            estimatedValue: estimatedValue,
            status: 'new',
            fitScore: fitScore,
            specifications: {
                voltage: voltage,
                size: size,
                conductor: 'Copper/Aluminum',
                insulation: 'Mineral Oil',
                armoring: 'Tank Mounted',
                standards: ['IS 1180'],
                quantity: quantity
            },
            certifications: [
                'BIS Certification',
                'CPRI Approved',
                'ISO 9001:2015'
            ],
            deliveryTimeline: `Within ${60 + Math.floor(Math.random() * 90)} days from order`
        })
    }

    // Generate 15 Switchgear RFPs
    const switchgearTypes = ['11kV Indoor Switchgear', '22kV Outdoor Switchgear', '33kV GIS', '11kV VCB Panels', '415V LT Panels']
    const switchgearRatings = ['630A', '1250A', '1600A', '2000A', '2500A', '3150A']

    for (let i = 71; i <= 85; i++) {
        const type = getRandom(switchgearTypes)
        const rating = getRandom(switchgearRatings)
        const quantity = Math.floor(Math.random() * 25) + 5
        const deadline = getRandomDate(25 + Math.floor(Math.random() * 45), 10)
        const fitScore = Math.floor(Math.random() * 30) + 70

        const unitPrice = type.includes('GIS') ? 50000000 :
            type.includes('33kV') ? 35000000 :
                type.includes('22kV') ? 25000000 :
                    type.includes('11kV') && type.includes('VCB') ? 8000000 : 5000000
        const estimatedValue = Math.round(quantity * unitPrice)

        rfps.push({
            id: `rfp-${String(i).padStart(3, '0')}`,
            title: `${type} Panels ${rating} - ${quantity} Panels`,
            issuedBy: getRandom(issuers),
            summary: `Supply of metal-clad switchgear for substation modernization project.`,
            deadline: deadline,
            estimatedValue: estimatedValue,
            status: 'new',
            fitScore: fitScore,
            specifications: {
                voltage: type.includes('11kV') ? '11kV' : type.includes('22kV') ? '22kV' : type.includes('33kV') ? '33kV' : '415V',
                size: rating,
                conductor: 'Copper Bus bars',
                insulation: 'Epoxy Resin',
                armoring: 'Metal Clad',
                standards: ['IEC 62271-200'],
                quantity: quantity
            },
            certifications: [
                'IEC Certification',
                'CPRI Type Tested',
                'ISO 9001:2015'
            ],
            deliveryTimeline: `Within ${60 + Math.floor(Math.random() * 60)} days from order`
        })
    }

    // Generate 10 Renewable Energy RFPs
    const renewableTypes = [
        'Solar Panel Installation',
        'Wind Turbine Generators',
        'Battery Energy Storage System',
        'Solar Inverter Systems',
        'Hybrid Renewable System'
    ]

    for (let i = 86; i <= 95; i++) {
        const type = getRandom(renewableTypes)
        const capacity = type.includes('Solar') ? `${Math.floor(Math.random() * 1000) + 100}kW` :
            type.includes('Wind') ? `${Math.floor(Math.random() * 3) + 1}MW` :
                type.includes('Battery') ? `${Math.floor(Math.random() * 15) + 5}MWh` : '500kW'
        const deadline = getRandomDate(30 + Math.floor(Math.random() * 40), 10)
        const fitScore = Math.floor(Math.random() * 30) + 65

        const capacityValue = parseFloat(capacity.replace(/[^\d.]/g, ''))
        const estimatedValue = type.includes('Solar') ? Math.round(capacityValue * 40000000) :
            type.includes('Wind') ? Math.round(capacityValue * 60000000) :
                type.includes('Battery') ? Math.round(capacityValue * 15000000) : 50000000

        rfps.push({
            id: `rfp-${String(i).padStart(3, '0')}`,
            title: `${type} - ${capacity} Capacity`,
            issuedBy: getRandom(issuers),
            summary: `Supply and installation of ${type.toLowerCase()} for renewable energy project.`,
            deadline: deadline,
            estimatedValue: estimatedValue,
            status: 'new',
            fitScore: fitScore,
            specifications: {
                voltage: type.includes('Solar') ? '1kV DC' : type.includes('Wind') ? '690V AC' : '1500V DC',
                size: capacity,
                conductor: 'Copper',
                insulation: type.includes('Battery') ? 'Fire Rated' : 'Weather Resistant',
                armoring: 'None',
                standards: [type.includes('Solar') ? 'IEC 61215' : type.includes('Wind') ? 'IEC 61400' : 'IEC 62619'],
                quantity: Math.floor(Math.random() * 50) + 10
            },
            certifications: [
                'IEC Certification',
                'MNRE Approved',
                'ISO 9001:2015'
            ],
            deliveryTimeline: `Within ${90 + Math.floor(Math.random() * 90)} days with installation`
        })
    }

    // Generate 10 Specialized Equipment RFPs
    const specializedEquipment = [
        { type: 'Diesel Generator Sets', size: '500kVA', voltage: '415V AC' },
        { type: 'LED Street Lighting System', size: '100W/150W', voltage: '230V AC' },
        { type: 'SCADA System', size: '50 RTU Points', voltage: '24V DC' },
        { type: 'EV Charging Stations', size: '60kW DC Output', voltage: '400V AC Input' },
        { type: 'Fiber Optic Cables', size: '24 Core SM', voltage: 'N/A' }
    ]

    for (let i = 96; i <= 105; i++) {
        const equipment = getRandom(specializedEquipment)
        const quantity = Math.floor(Math.random() * 100) + 20
        const deadline = getRandomDate(15 + Math.floor(Math.random() * 50), 10)
        const fitScore = Math.floor(Math.random() * 35) + 65

        const unitPrice = equipment.type.includes('Generator') ? 50000000 :
            equipment.type.includes('LED') ? 15000 :
                equipment.type.includes('SCADA') ? 100000000 :
                    equipment.type.includes('EV') ? 3000000 :
                        equipment.type.includes('Fiber') ? 50000 : 100000
        const estimatedValue = Math.round(quantity * unitPrice)

        rfps.push({
            id: `rfp-${String(i).padStart(3, '0')}`,
            title: `${equipment.type} ${equipment.size} - ${quantity} Units`,
            issuedBy: getRandom(issuers),
            summary: `Supply and installation of ${equipment.type.toLowerCase()} for infrastructure project.`,
            deadline: deadline,
            estimatedValue: estimatedValue,
            status: 'new',
            fitScore: fitScore,
            specifications: {
                voltage: equipment.voltage,
                size: equipment.size,
                conductor: 'Copper',
                insulation: equipment.type.includes('LED') ? 'IP65 Rated' : equipment.type.includes('SCADA') ? 'Industrial Grade' : 'Standard',
                armoring: 'As per standard',
                standards: [equipment.type.includes('LED') ? 'BIS 16102' : equipment.type.includes('EV') ? 'IEC 61851' : 'IEC 61850'],
                quantity: quantity
            },
            certifications: [
                'BIS/IEC Certification',
                'ISO 9001:2015',
                'Type Test Certificate'
            ],
            deliveryTimeline: `Within ${45 + Math.floor(Math.random() * 75)} days from order`
        })
    }

    return rfps
}

export const DUMMY_RFPS: RFP[] = generateRFPs()
