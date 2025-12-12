"use client"

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { RFP } from "@/types"
import { firebaseDB } from "@/lib/firebase/firebase-db"
import { DUMMY_RFPS } from "@/data/dummy-rfps"

interface RFPContextType {
    rfps: RFP[]
    isScanning: boolean
    hasScanned: boolean
    scanForRFPs: () => void
    updateRFP: (id: string, updates: Partial<RFP>) => void
    deleteRFP: (id: string) => Promise<void>
    refreshRFPs: () => Promise<void>
}

const RFPContext = createContext<RFPContextType | undefined>(undefined)

export function RFPProvider({ children }: { children: ReactNode }) {
    const { user, isLoaded } = useUser()
    const [rfps, setRfps] = useState<RFP[]>([])
    const [isScanning, setIsScanning] = useState(false)
    const [hasScanned, setHasScanned] = useState(false)
    const [useFirebase, setUseFirebase] = useState(true)

    // Load RFPs from Firebase on mount with real-time updates
    useEffect(() => {
        if (typeof window === 'undefined') return
        if (!isLoaded) return // Wait for Clerk to load

        const userId = user?.id

        // Check if Firebase is configured
        const hasFirebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

        if (!hasFirebaseConfig) {
            console.warn('Firebase not configured, using localStorage fallback')
            setUseFirebase(false)
            // Load from localStorage as fallback
            try {
                const storageKey = userId ? `tenderai_scanned_rfps_${userId}` : 'tenderai_scanned_rfps'
                const savedRfps = localStorage.getItem(storageKey)
                if (savedRfps) {
                    const parsed = JSON.parse(savedRfps)
                    setRfps(parsed)
                    setHasScanned(parsed.length > 0)
                    console.log('Loaded', parsed.length, `RFPs from localStorage for user ${userId || 'anonymous'}`)
                }
            } catch (error) {
                console.error('Error loading RFPs from localStorage:', error)
            }
            return
        }

        console.log('Firebase is configured, setting up real-time sync for user:', userId)
        setUseFirebase(true)

        // First, do an initial fetch with user ID
        const initializeData = async () => {
            try {
                const initialRfps = await firebaseDB.getRFPs(userId)
                console.log('Initial fetch from Firebase:', initialRfps.length, 'RFPs for user', userId)
                setRfps(initialRfps)
                setHasScanned(initialRfps.length > 0)
            } catch (error) {
                console.error('Error with initial Firebase fetch:', error)
                // Fall back to localStorage
                try {
                    const storageKey = userId ? `tenderai_scanned_rfps_${userId}` : 'tenderai_scanned_rfps'
                    const savedRfps = localStorage.getItem(storageKey)
                    if (savedRfps) {
                        const parsed = JSON.parse(savedRfps)
                        setRfps(parsed)
                        setHasScanned(parsed.length > 0)
                    }
                } catch (err) {
                    console.error('Error loading from localStorage fallback:', err)
                }
            }
        }

        initializeData()

        // Then subscribe to real-time updates with user ID
        const unsubscribe = firebaseDB.subscribeToRFPs(userId, (updatedRfps) => {
            console.log('Real-time update from Firebase:', updatedRfps.length, 'RFPs for user', userId)
            setRfps(updatedRfps)
            setHasScanned(updatedRfps.length > 0)
        })

        // Cleanup subscription on unmount
        return () => {
            console.log('Cleaning up Firebase subscription')
            unsubscribe()
        }
    }, [isLoaded, user?.id])

    const refreshRFPs = useCallback(async () => {
        const userId = user?.id
        if (!useFirebase) {
            // Fallback to localStorage
            try {
                const storageKey = userId ? `tenderai_scanned_rfps_${userId}` : 'tenderai_scanned_rfps'
                const savedRfps = localStorage.getItem(storageKey)
                if (savedRfps) {
                    setRfps(JSON.parse(savedRfps))
                }
            } catch (error) {
                console.error('Error refreshing RFPs:', error)
            }
            return
        }

        try {
            const fetchedRfps = await firebaseDB.getRFPs(userId)
            setRfps(fetchedRfps)
            setHasScanned(fetchedRfps.length > 0)
        } catch (error) {
            console.error('Error refreshing RFPs from Firebase:', error)
        }
    }, [useFirebase])

    const scanForRFPs = useCallback(async () => {
        setIsScanning(true)
        const userId = user?.id

        try {
            console.log('Calling server-side RFP scanner API...')

            // Call server-side API to avoid CORS issues
            const response = await fetch('/api/scan-rfps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const result = await response.json()

            if (!result.success || result.rfps.length === 0) {
                console.warn('No real RFPs found from API, generating realistic RFPs with AI...')

                // Generate realistic RFPs using AI
                try {
                    const aiResponse = await fetch('/api/generate-rfps', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ count: 10 })
                    })

                    const aiResult = await aiResponse.json()

                    if (aiResult.success && aiResult.rfps && aiResult.rfps.length > 0) {
                        const source = aiResult.source || 'unknown'
                        console.log(`✅ Generated ${aiResult.rfps.length} RFPs from source: ${source}`)

                        const generatedRfps = aiResult.rfps.map((rfp: any, index: number) => ({
                            ...rfp,
                            id: `ai-${Date.now()}-${index}`,
                        }))

                        if (useFirebase) {
                            for (const rfp of generatedRfps) {
                                await firebaseDB.saveRFP(rfp, userId)
                            }
                            setRfps(generatedRfps)
                        } else {
                            setRfps(generatedRfps)
                            const storageKey = userId ? `tenderai_scanned_rfps_${userId}` : 'tenderai_scanned_rfps'
                            localStorage.setItem(storageKey, JSON.stringify(generatedRfps))
                        }

                        setIsScanning(false)
                        setHasScanned(true)
                        return
                    }
                } catch (aiError) {
                    console.error('Error generating AI RFPs:', aiError)
                }

                // If AI generation fails, show error message
                console.error('Unable to generate or find RFPs')
                setIsScanning(false)
                return
            }

            const scannedRealRFPs = result.rfps

            // Convert real RFPs to our RFP format
            const convertedRFPs: RFP[] = scannedRealRFPs.map((realRfp, index) => ({
                id: `rfp-${Date.now()}-${index}`,
                title: realRfp.title,
                issuedBy: realRfp.issuedBy,
                summary: realRfp.summary,
                deadline: realRfp.deadline,
                estimatedValue: realRfp.estimatedValue,
                fitScore: Math.floor(Math.random() * 30) + 70, // 70-100 range
                certifications: realRfp.category?.includes('Electrical')
                    ? ['BIS Certification', 'ISO 9001:2015']
                    : ['ISO 9001:2015'],
                status: 'new' as const,
                specifications: {
                    quantity: Math.floor(Math.random() * 10000) + 1000,
                    voltage: '11kV',
                    size: '3C x 185 sq.mm',
                    conductor: 'Aluminum',
                    insulation: 'XLPE',
                    armoring: 'SWA',
                    standards: ['IS 7098'],
                },
                deliveryTimeline: 'Within 60 days',
                testingRequirements: ['Routine Tests', 'Type Tests'],
                riskScore: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
            }))

            console.log(`Converted ${convertedRFPs.length} real RFPs`)

            // Save to Firebase or localStorage
            if (useFirebase) {
                try {
                    for (let i = 0; i < convertedRFPs.length; i++) {
                        await firebaseDB.saveRFP(convertedRFPs[i], userId)
                        // Also save to scanned RFPs collection for tracking
                        await firebaseDB.saveScannedRFP({
                            ...scannedRealRFPs[i],
                            convertedRfpId: convertedRFPs[i].id,
                        })
                    }
                    console.log('Saved scanned RFPs to Firebase')
                    // Update state immediately so RFPs show up right away
                    setRfps(convertedRFPs)
                } catch (error) {
                    console.error('Error saving RFPs to Firebase:', error)
                    // Fallback to localStorage
                    setRfps(convertedRFPs)
                    const storageKey = userId ? `tenderai_scanned_rfps_${userId}` : 'tenderai_scanned_rfps'
                    localStorage.setItem(storageKey, JSON.stringify(convertedRFPs))
                }
            } else {
                setRfps(convertedRFPs)
                const storageKey = userId ? `tenderai_scanned_rfps_${userId}` : 'tenderai_scanned_rfps'
                localStorage.setItem(storageKey, JSON.stringify(convertedRFPs))
            }

            setIsScanning(false)
            setHasScanned(true)

        } catch (error) {
            console.error('Error during real-time scan:', error)

            // Fallback to demo data on error
            const demoRfps = DUMMY_RFPS.slice(0, 10).map(rfp => ({
                ...rfp,
                id: `demo-${rfp.id}-${Date.now()}`,
            }))

            if (useFirebase) {
                try {
                    for (const rfp of demoRfps) {
                        await firebaseDB.saveRFP(rfp)
                    }
                } catch (err) {
                    setRfps(demoRfps)
                    localStorage.setItem('tenderai_scanned_rfps', JSON.stringify(demoRfps))
                }
            } else {
                setRfps(demoRfps)
                localStorage.setItem('tenderai_scanned_rfps', JSON.stringify(demoRfps))
            }

            setIsScanning(false)
            setHasScanned(true)
        }
    }, [useFirebase, user?.id])

    const updateRFP = useCallback(async (id: string, updates: Partial<RFP>) => {
        const userId = user?.id
        if (useFirebase) {
            // Update in Firebase
            try {
                await firebaseDB.updateRFP(id, updates)
                console.log('RFP updated in Firebase:', id)
            } catch (error) {
                console.error('Error updating RFP in Firebase:', error)
                // Fallback to local state update
                setRfps(currentRfps =>
                    currentRfps.map(rfp =>
                        rfp.id === id ? { ...rfp, ...updates } : rfp
                    )
                )
            }
        } else {
            // Update in localStorage
            setRfps(currentRfps => {
                const updatedRfps = currentRfps.map(rfp =>
                    rfp.id === id ? { ...rfp, ...updates } : rfp
                )

                if (typeof window !== 'undefined') {
                    try {
                        localStorage.setItem('tenderai_scanned_rfps', JSON.stringify(updatedRfps))
                    } catch (error) {
                        console.error('Error saving updated RFPs to localStorage:', error)
                    }
                }

                return updatedRfps
            })
        }
    }, [useFirebase, user?.id])

    const deleteRFP = useCallback(async (id: string) => {
        const userId = user?.id
        if (useFirebase) {
            // Delete from Firebase
            try {
                await firebaseDB.deleteRFP(id)
                console.log('RFP deleted from Firebase:', id)
            } catch (error) {
                console.error('Error deleting RFP from Firebase:', error)
                // Fallback: remove from local state
                setRfps(currentRfps => currentRfps.filter(rfp => rfp.id !== id))
            }
        } else {
            // Delete from localStorage
            setRfps(currentRfps => {
                const updatedRfps = currentRfps.filter(rfp => rfp.id !== id)

                if (typeof window !== 'undefined') {
                    try {
                        localStorage.setItem('tenderai_scanned_rfps', JSON.stringify(updatedRfps))
                    } catch (error) {
                        console.error('Error deleting RFP from localStorage:', error)
                    }
                }

                return updatedRfps
            })
        }
    }, [useFirebase])

    return (
        <RFPContext.Provider value={{ rfps, isScanning, hasScanned, scanForRFPs, updateRFP, deleteRFP, refreshRFPs }}>
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
