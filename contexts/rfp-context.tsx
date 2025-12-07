"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { RFP } from "@/types"
import { DUMMY_RFPS } from "@/data/dummy-rfps"

interface RFPContextType {
    rfps: RFP[]
    isScanning: boolean
    hasScanned: boolean
    scanForRFPs: () => void
}

const RFPContext = createContext<RFPContextType | undefined>(undefined)

export function RFPProvider({ children }: { children: ReactNode }) {
    const [rfps, setRfps] = useState<RFP[]>([])
    const [isScanning, setIsScanning] = useState(false)
    const [hasScanned, setHasScanned] = useState(false)

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

            setRfps(scannedRfps)
            setIsScanning(false)
            setHasScanned(true)
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
