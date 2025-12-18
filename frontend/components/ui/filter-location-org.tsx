import { useState } from "react"
import { Filter, MapPin, Building2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface LocationOrgFilters {
    locations: string[]
    organizations: string[]
}

interface FilterLocationOrgProps {
    onFilterChange: (filters: LocationOrgFilters) => void
    activeFilters: LocationOrgFilters
    availableLocations: string[]
    availableOrganizations: string[]
}

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

export function FilterLocationOrg({
    onFilterChange,
    activeFilters,
}: FilterLocationOrgProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCity, setSelectedCity] = useState<string>("All")

    const availableOrgs = selectedCity === "All"
        ? LOCATION_ORGANIZATIONS["All"]
        : LOCATION_ORGANIZATIONS[selectedCity] || []

    const clearAllFilters = () => {
        onFilterChange({
            locations: [],
            organizations: []
        })
        setSelectedCity("All")
    }

    const activeFilterCount = activeFilters.locations.length + activeFilters.organizations.length

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="border-2 border-black hover:bg-black hover:text-white transition-colors"
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Scan Filters
                    {activeFilterCount > 0 && (
                        <Badge className="ml-2 bg-black text-white h-5 min-w-[20px] px-1.5">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 border-2 border-black p-0">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-black text-white">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span className="font-bold">Scan Preferences</span>
                    </div>
                    {activeFilterCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="h-7 text-xs text-white hover:bg-white hover:text-black"
                        >
                            <X className="h-3 w-3 mr-1" />
                            Clear
                        </Button>
                    )}
                </div>

                <div className="p-4 space-y-4">
                    {/* Location Select */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                            <MapPin className="h-4 w-4" />
                            Select City
                        </label>
                        <select
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
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
                            Organization Type
                        </label>
                        <select
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm"
                            onChange={(e) => {
                                if (e.target.value) {
                                    onFilterChange({
                                        locations: selectedCity !== "All" ? [selectedCity] : [],
                                        organizations: [e.target.value]
                                    })
                                }
                            }}
                        >
                            <option value="">All Organizations</option>
                            {availableOrgs.map(org => (
                                <option key={org} value={org}>{org}</option>
                            ))}
                        </select>
                    </div>

                    {/* Info */}
                    <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 text-center">
                            Select preferences to scan for relevant tenders
                        </p>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
