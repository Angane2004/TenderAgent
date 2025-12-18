import { useState } from "react"
import { Search, MapPin, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Location to Organizations mapping
const LOCATION_ORGANIZATIONS: Record<string, string[]> = {
    "Mumbai": ["PWD Maharashtra", "BMC Mumbai", "Maharashtra State Electricity Distribution Co."],
    "Delhi": ["PWD Delhi", "Municipal Corporation of Delhi", "Delhi Jal Board", "DMRC"],
    "Bangalore": ["PWD Karnataka", "BBMP", "Karnataka Power Transmission Corporation"],
    "Hyderabad": ["PWD Telangana", "GHMC", "Telangana State Electricity Board"],
    "Chennai": ["PWD Tamil Nadu", "Chennai Corporation", "TANGEDCO"],
    "Kolkata": ["PWD West Bengal", "Kolkata Municipal Corporation", "CESC"],
    "Ahmedabad": ["PWD Gujarat", "Ahmedabad Municipal Corporation", "Gujarat Urja Vikas Nigam"],
    "Pune": ["PWD Maharashtra", "Pune Municipal Corporation", "MSEDCL"],
    "Jaipur": ["PWD Rajasthan", "Jaipur Municipal Corporation", "Rajasthan Rajya Vidyut Prasaran Nigam"],
    "All": ["National Highways Authority of India", "Indian Railways", "CPWD", "Ministry of Defence", "NTPC", "BHEL", "ONGC"]
}

const INDIAN_CITIES = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad",
    "Chennai", "Kolkata", "Pune", "Jaipur", "Lucknow",
    "Kanpur", "Nagpur", "Indore", "Bhopal", "Patna"
]

interface ScanPreferencesProps {
    onScan: (location?: string, organization?: string) => void
    isScanning: boolean
}

export function ScanPreferences({ onScan, isScanning }: ScanPreferencesProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCity, setSelectedCity] = useState<string>("All")
    const [selectedOrg, setSelectedOrg] = useState<string>("")

    const availableOrgs = selectedCity === "All"
        ? LOCATION_ORGANIZATIONS["All"]
        : LOCATION_ORGANIZATIONS[selectedCity] || []

    const handleScan = () => {
        const location = selectedCity !== "All" ? selectedCity : undefined
        const organization = selectedOrg || undefined
        onScan(location, organization)
        setIsOpen(false)
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="border-2 border-black hover:bg-black hover:text-white transition-colors"
                    disabled={isScanning}
                >
                    <Search className="h-4 w-4 mr-2" />
                    {isScanning ? 'Scanning...' : 'Scan Preferences'}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 border-2 border-black p-0">
                {/* Header */}
                <div className="px-4 py-3 bg-black text-white">
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        <span className="font-bold">Set Scan Preferences</span>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    {/* Location Select */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                            <MapPin className="h-4 w-4" />
                            Preferred City
                        </label>
                        <select
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm"
                            value={selectedCity}
                            onChange={(e) => {
                                setSelectedCity(e.target.value)
                                setSelectedOrg("") // Reset org when city changes
                            }}
                        >
                            <option value="All">All Locations</option>
                            {INDIAN_CITIES.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    {/* Organization Select */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                            <Building2 className="h-4 w-4" />
                            Preferred Organization
                        </label>
                        <select
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm"
                            value={selectedOrg}
                            onChange={(e) => setSelectedOrg(e.target.value)}
                        >
                            <option value="">All Organizations</option>
                            {availableOrgs.map(org => (
                                <option key={org} value={org}>{org}</option>
                            ))}
                        </select>
                    </div>

                    {/* Scan Button */}
                    <Button
                        onClick={handleScan}
                        disabled={isScanning}
                        className="w-full bg-black text-white hover:bg-gray-800"
                    >
                        <Search className="h-4 w-4 mr-2" />
                        {isScanning ? 'Scanning...' : 'Scan for RFPs'}
                    </Button>

                    {/* Info */}
                    <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 text-center">
                            Scan for new tenders matching your preferences
                        </p>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
