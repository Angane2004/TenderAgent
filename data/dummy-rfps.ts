import { RFP } from "@/types"

export const DUMMY_RFPS: RFP[] = [
    {
        "id": "rfp-001",
        "title": "Supply of 11kV XLPE Armoured Cables - 5000 Meters",
        "issuedBy": "Maharashtra State Electricity Distribution Co. Ltd.",
        "summary": "Tender for supply and delivery of 11kV XLPE insulated, armoured power cables for grid expansion project in Pune region.",
        "submissionDate": "2025-12-20T17:00:00",
        "deadline": "2025-12-20T17:00:00",
        "status": "new",
        "riskScore": "low",
        "fitScore": 92,
        "scope": "Supply, testing, and delivery of 11kV XLPE cables with aluminum conductor, XLPE insulation, and galvanized steel wire armoring. Includes factory acceptance tests and delivery to site.",
        "specifications": {
            "voltage": "11kV",
            "size": "3C x 185 sq.mm",
            "conductor": "Aluminum",
            "insulation": "XLPE",
            "armoring": "SWA (Steel Wire Armoured)",
            "standard": "IS 7098 Part 2",
            "quantity": 5000
        },
        "testingRequirements": [
            "Routine Tests as per IS 7098",
            "Type Tests (if required)",
            "High Voltage Test",
            "Partial Discharge Test",
            "Conductor Resistance Test"
        ],
        "certifications": [
            "BIS Certification",
            "ISO 9001:2015",
            "Factory Inspection Certificate"
        ],
        "deliveryTimeline": "Within 60 days from date of order"
    },
    {
        "id": "rfp-002",
        "title": "33kV HT Cables for Substation Interconnection - 2000 Meters",
        "issuedBy": "Power Grid Corporation of India Ltd.",
        "summary": "Procurement of 33kV high tension cables for interconnecting new substations in Delhi NCR region.",
        "submissionDate": "2025-12-15T15:00:00",
        "deadline": "2025-12-15T15:00:00",
        "status": "new",
        "riskScore": "medium",
        "fitScore": 85,
        "scope": "Supply of 33kV XLPE cables with copper conductor, suitable for underground installation. Includes all necessary tests and certifications.",
        "specifications": {
            "voltage": "33kV",
            "size": "3C x 240 sq.mm",
            "conductor": "Copper",
            "insulation": "XLPE",
            "armoring": "AWA (Aluminum Wire Armoured)",
            "standard": "IEC 60502-2",
            "quantity": 2000
        },
        "testingRequirements": [
            "Routine Tests as per IEC 60502",
            "Type Tests",
            "Impulse Voltage Test",
            "Partial Discharge Test",
            "Thermal Cycling Test"
        ],
        "certifications": [
            "IEC Certification",
            "CPRI Approved",
            "ISO 9001:2015"
        ],
        "deliveryTimeline": "Within 45 days from date of order"
    },
    {
        "id": "rfp-003",
        "title": "LT Control Cables for Industrial Plant - 10000 Meters",
        "issuedBy": "Tata Steel Ltd.",
        "summary": "Supply of low tension control and instrumentation cables for new steel plant automation project.",
        "submissionDate": "2026-01-10T16:00:00",
        "deadline": "2026-01-10T16:00:00",
        "status": "new",
        "riskScore": "low",
        "fitScore": 88,
        "scope": "Supply of multicore control cables with PVC insulation, suitable for industrial environment. Fire retardant and oil resistant properties required.",
        "specifications": {
            "voltage": "1.1kV",
            "size": "4C x 2.5 sq.mm",
            "conductor": "Copper",
            "insulation": "PVC/FR-PVC",
            "armoring": "Unarmoured",
            "standard": "IS 1554 Part 1",
            "quantity": 10000
        },
        "testingRequirements": [
            "Routine Tests as per IS 1554",
            "Flame Retardant Test",
            "Insulation Resistance Test",
            "Conductor Resistance Test"
        ],
        "certifications": [
            "BIS Certification",
            "Fire Test Certificate",
            "ISO 9001:2015"
        ],
        "deliveryTimeline": "Within 90 days from date of order"
    },
    {
        "id": "rfp-004",
        "title": "Aerial Bunched Cables for Rural Electrification - 15000 Meters",
        "issuedBy": "Uttar Pradesh Power Corporation Ltd.",
        "summary": "Tender for supply of aerial bunched cables for rural electrification program covering 50 villages.",
        "submissionDate": "2025-12-25T14:00:00",
        "deadline": "2025-12-25T14:00:00",
        "status": "new",
        "riskScore": "high",
        "fitScore": 75,
        "scope": "Supply of ABC cables with XLPE insulation, suitable for overhead installation in rural areas. Weather resistant and UV stabilized.",
        "specifications": {
            "voltage": "0.6/1kV",
            "size": "3C x 95 sq.mm + 1C x 70 sq.mm (Neutral)",
            "conductor": "Aluminum Alloy",
            "insulation": "XLPE (UV Resistant)",
            "armoring": "None (Self-supporting)",
            "standard": "IS 14255",
            "quantity": 15000
        },
        "testingRequirements": [
            "Routine Tests as per IS 14255",
            "UV Resistance Test",
            "Weather Resistance Test",
            "Tensile Strength Test"
        ],
        "certifications": [
            "BIS Certification",
            "Weather Test Certificate",
            "ISO 9001:2015"
        ],
        "deliveryTimeline": "Within 120 days from date of order in 3 phases"
    },
    {
        "id": "rfp-005",
        "title": "Fire Survival Cables for Metro Rail Project - 8000 Meters",
        "issuedBy": "Delhi Metro Rail Corporation",
        "summary": "Procurement of fire survival cables for signaling and emergency systems in new metro corridor.",
        "submissionDate": "2026-01-05T12:00:00",
        "deadline": "2026-01-05T12:00:00",
        "status": "new",
        "riskScore": "medium",
        "fitScore": 80,
        "scope": "Supply of fire survival cables with mica tape insulation, capable of operating during fire conditions. Low smoke, zero halogen properties required.",
        "specifications": {
            "voltage": "0.6/1kV",
            "size": "2C x 4 sq.mm",
            "conductor": "Copper",
            "insulation": "LSZH with Mica Tape",
            "armoring": "SWA (Steel Wire Armoured)",
            "standard": "BS 6387 Category CWZ",
            "quantity": 8000
        },
        "testingRequirements": [
            "Fire Survival Test as per BS 6387",
            "Smoke Density Test",
            "Halogen Acid Gas Test",
            "Circuit Integrity Test"
        ],
        "certifications": [
            "BS 6387 CWZ Certification",
            "LSZH Certificate",
            "RDSO Approved",
            "ISO 9001:2015"
        ],
        "deliveryTimeline": "Within 75 days from date of order"
    }
]
