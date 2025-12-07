"use client"

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react"
import { RFP } from "@/types"
import { DUMMY_RFPS } from "@/data/dummy-rfps"

interface RFPContextType {
    rfps: RFP[]
    isScanning: boolean
    hasScanned: boolean
    scanForRFPs: () => void
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
            // Generate 5-15 random RFPs
            const count = Math.floor(Math.random() * 11) + 5
            const scannedRfps: RFP[] = []

            for (let i = 0; i < count; i++) {
                const randomRfp = DUMMY_RFPS[Math.floor(Math.random() * DUMMY_RFPS.length)]
                scannedRfps.push({
                    ...randomRfp,
                    id: `${randomRfp.id}-scan-${Date.now()}-${i}`
                })
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

    return (
        <RFPContext.Provider value={{ rfps, isScanning, hasScanned, scanForRFPs }}>
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
