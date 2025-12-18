"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"
import * as Popover from "@radix-ui/react-popover"

export interface FilterOptions {
    location: string
    organization: string
    fitScore: string[]
    riskScore: string[]
    urgency: string[]
    certifications: string[]
}

interface FilterButtonProps {
    onFilterChange: (filters: FilterOptions) => void
    activeFilters: FilterOptions
    availableLocations: string[]
    availableOrganizations: string[]
}

export function FilterButton({ onFilterChange, activeFilters, availableLocations, availableOrganizations }: FilterButtonProps) {
    const [isOpen, setIsOpen] = useState(false)

    const fitScoreOptions = [
        { label: "Excellent (85-100)", value: "excellent" },
        { label: "Good (70-84)", value: "good" },
        { label: "Fair (50-69)", value: "fair" },
        { label: "Low (<50)", value: "low" }
    ]

    const riskScoreOptions = [
        { label: "Low Risk", value: "low" },
        { label: "Medium Risk", value: "medium" },
        { label: "High Risk", value: "high" }
    ]

    const urgencyOptions = [
        { label: "Urgent (<7 days)", value: "urgent" },
        { label: "Upcoming (7-30 days)", value: "upcoming" },
        { label: "Future (>30 days)", value: "future" }
    ]

    const certificationOptions = [
        { label: "BIS", value: "BIS" },
        { label: "ISO", value: "ISO" },
        { label: "IEC", value: "IEC" },
        { label: "CPRI", value: "CPRI" },
        { label: "RDSO", value: "RDSO" }
    ]

    const toggleFilter = useCallback((category: keyof FilterOptions, value: string) => {
        const currentFilters = activeFilters[category]
        const newFilters = currentFilters.includes(value)
            ? currentFilters.filter(v => v !== value)
            : [...currentFilters, value]

        onFilterChange({
            ...activeFilters,
            [category]: newFilters
        })
    }, [activeFilters, onFilterChange])

    const clearAllFilters = useCallback(() => {
        onFilterChange({
            location: '',
            organization: '',
            fitScore: [],
            riskScore: [],
            urgency: [],
            certifications: []
        })
    }, [onFilterChange])

    const updateSingleFilter = (key: 'location' | 'organization', value: string) => {
        onFilterChange({
            ...activeFilters,
            [key]: value
        })
    }

    const activeFilterCount = Object.entries(activeFilters).reduce(
        (acc, [key, value]) => {
            if (key === 'location' || key === 'organization') {
                return acc + (value ? 1 : 0)
            }
            return acc + (value as string[]).length
        },
        0
    )

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <Button
                    variant="outline"
                    className="border-2 border-black hover:bg-gray-50 transition-colors"
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                        <Badge className="ml-2 bg-black text-white hover:bg-gray-800 px-2 py-0.5">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    align="start"
                    sideOffset={5}
                    className="w-[280px] bg-white rounded-lg border-2 border-black shadow-xl p-3 z-[99999] max-h-[400px] overflow-y-auto"
                    style={{ scrollbarWidth: 'thin' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
                        <h3 className="font-bold text-xs">FILTERS</h3>
                        {activeFilterCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllFilters}
                                className="text-xs h-6 px-2 hover:bg-gray-100"
                            >
                                <X className="h-3 w-3 mr-1" />
                                Clear
                            </Button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {/* Location Filter */}
                        <div>
                            <h4 className="font-semibold text-[10px] mb-1.5 text-gray-600 uppercase tracking-wide">Location</h4>
                            <select
                                className="w-full text-xs border-2 border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-black"
                                value={activeFilters.location}
                                onChange={(e) => updateSingleFilter('location', e.target.value)}
                            >
                                <option value="">All Locations</option>
                                {(availableLocations || []).map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        {/* Organization Filter */}
                        <div>
                            <h4 className="font-semibold text-[10px] mb-1.5 text-gray-600 uppercase tracking-wide">Organization</h4>
                            <select
                                className="w-full text-xs border-2 border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-black"
                                value={activeFilters.organization}
                                onChange={(e) => updateSingleFilter('organization', e.target.value)}
                            >
                                <option value="">All Organizations</option>
                                {(availableOrganizations || []).map(org => (
                                    <option key={org} value={org}>{org}</option>
                                ))}
                            </select>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-2"></div>

                        {/* Fit Score */}
                        <div>
                            <h4 className="font-semibold text-[10px] mb-1.5 text-gray-600 uppercase tracking-wide">Fit Score</h4>
                            <div className="space-y-0.5">
                                {fitScoreOptions.map(option => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={activeFilters.fitScore.includes(option.value)}
                                            onChange={() => toggleFilter('fitScore', option.value)}
                                            className="w-3.5 h-3.5 rounded border-gray-300 text-black focus:ring-1 focus:ring-black"
                                        />
                                        <span className="text-xs">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Risk Level */}
                        <div>
                            <h4 className="font-semibold text-[10px] mb-1.5 text-gray-600 uppercase tracking-wide">Risk Level</h4>
                            <div className="space-y-0.5">
                                {riskScoreOptions.map(option => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={activeFilters.riskScore.includes(option.value)}
                                            onChange={() => toggleFilter('riskScore', option.value)}
                                            className="w-3.5 h-3.5 rounded border-gray-300 text-black focus:ring-1 focus:ring-black"
                                        />
                                        <span className="text-xs">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Urgency */}
                        <div>
                            <h4 className="font-semibold text-[10px] mb-1.5 text-gray-600 uppercase tracking-wide">Deadline</h4>
                            <div className="space-y-0.5">
                                {urgencyOptions.map(option => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={activeFilters.urgency.includes(option.value)}
                                            onChange={() => toggleFilter('urgency', option.value)}
                                            className="w-3.5 h-3.5 rounded border-gray-300 text-black focus:ring-1 focus:ring-black"
                                        />
                                        <span className="text-xs">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Certifications */}
                        <div>
                            <h4 className="font-semibold text-[10px] mb-1.5 text-gray-600 uppercase tracking-wide">Certifications</h4>
                            <div className="grid grid-cols-2 gap-0.5">
                                {certificationOptions.map(option => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-1 p-1 rounded hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={activeFilters.certifications.includes(option.value)}
                                            onChange={() => toggleFilter('certifications', option.value)}
                                            className="w-3.5 h-3.5 rounded border-gray-300 text-black focus:ring-1 focus:ring-black"
                                        />
                                        <span className="text-[11px]">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    {activeFilterCount > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-[10px] text-gray-600">
                                <span className="font-semibold text-black">{activeFilterCount}</span> active
                            </p>
                        </div>
                    )}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}
