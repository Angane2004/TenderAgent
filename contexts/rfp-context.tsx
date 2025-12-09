"use client"

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react"
import { RFP } from "@/types"
import { DUMMY_RFPS } from "@/data/dummy-rfps"

interface RFPContextType {
    rfps: RFP[]
    isScanning: boolean
    hasScanned: boolean
    scanForRFPs: () => void
    updateRFP: (id: string, updates: Partial<RFP>) => void
}

const RFPContext = createContext<RFPContextType | undefined>(undefined)

const STORAGE_KEY = 'tenderai_scanned_rfps'

export function RFPProvider({ children }: { children: ReactNode }) {
    const [rfps, setRfps] = useState<RFP[]>([])
    const [isScanning, setIsScanning] = useState(false)
    const [hasScanned, setHasScanned] = useState(false)

    // Load RFPs from localStorage on mount
    useEffect(() => {
        // Only access localStorage on client side
        if (typeof window === 'undefined') return

        try {
            const savedRfps = localStorage.getItem(STORAGE_KEY)
            if (savedRfps) {
                const parsed = JSON.parse(savedRfps)
                setRfps(parsed)
                setHasScanned(parsed.length > 0)
            }
        } catch (error) {
            console.error('Error loading RFPs from localStorage:', error)
        }
    }, [])

    const scanForRFPs = useCallback(() => {
        setIsScanning(true)

        // Simulate scanning for RFPs
        setTimeout(() => {
            // Generate 5-15 random UNIQUE RFPs
            const count = Math.min(Math.floor(Math.random() * 11) + 5, DUMMY_RFPS.length)
            const scannedRfps: RFP[] = []
            const usedIndices = new Set<number>()

            while (scannedRfps.length < count) {
                const randomIndex = Math.floor(Math.random() * DUMMY_RFPS.length)
                if (!usedIndices.has(randomIndex)) {
                    usedIndices.add(randomIndex)
                    const randomRfp = DUMMY_RFPS[randomIndex]
                    scannedRfps.push({
                        ...randomRfp,
                        // Keep original ID for uniqueness
                        id: randomRfp.id
                    })
                }
            }

            // Save to state
            setRfps(scannedRfps)
            setIsScanning(false)
            setHasScanned(true)

            // Save to localStorage
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(scannedRfps))
                } catch (error) {
                    console.error('Error saving RFPs to localStorage:', error)
                }
            }
        }, 2000)
    }, [])

    const updateRFP = useCallback((id: string, updates: Partial<RFP>) => {
        setRfps(currentRfps => {
            const updatedRfps = currentRfps.map(rfp =>
                rfp.id === id ? { ...rfp, ...updates } : rfp
            )

            // Save to localStorage
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRfps))
                } catch (error) {
                    console.error('Error saving updated RFPs to localStorage:', error)
                }
            }

            return updatedRfps
        })
    }, [])

    return (
        <RFPContext.Provider value={{ rfps, isScanning, hasScanned, scanForRFPs, updateRFP }}>
            {children}
        </RFPContext.Provider>
    )
}

export function useRFPs() {
    const context = useContext(RFPContext)
    if (context === undefined) {
        throw new Error("useRFPs must be used within an RFPProvider")
    }
    return context
}
