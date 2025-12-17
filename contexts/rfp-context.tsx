"use client"

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useUser as useUserProfile } from "@/contexts/user-context"
import { RFP } from "@/types"
import { firebaseDB } from "@/lib/firebase/firebase-db"
import { DUMMY_RFPS } from "@/data/dummy-rfps"
import { calculateFitScore } from "@/lib/rfp-matching-service"

interface RFPContextType {
    rfps: RFP[]
    isScanning: boolean
    hasScanned: boolean
    scanForRFPs: (preferences?: { location?: string; organization?: string }) => void
    updateRFP: (id: string, updates: Partial<RFP>) => void
    deleteRFP: (id: string) => Promise<void>
    permanentlyDeleteRFP: (id: string) => Promise<void>
    getDeletedRFPs: () => Promise<RFP[]>
    refreshRFPs: () => Promise<void>
    clearAllRFPs: () => Promise<void>
}

const RFPContext = createContext<RFPContextType | undefined>(undefined)

export function RFPProvider({ children }: { children: ReactNode }) {
    const { user, isLoaded } = useUser()
    const { profile } = useUserProfile()
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

    const scanForRFPs = useCallback(async (preferences?: { location?: string; organization?: string }) => {
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
                body: JSON.stringify({
                    location: preferences?.location,
                    organization: preferences?.organization
                })
            })

            const result = await response.json()

            if (!result.success || result.rfps.length === 0) {
                console.warn('No real RFPs found from API, generating realistic RFPs with AI...')

                // Generate realistic RFPs using AI with filter preferences
                try {
                    const aiResponse = await fetch('/api/generate-rfps', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            count: 10,
                            location: preferences?.location,
                            organization: preferences?.organization,
                            userProfile: profile ? {
                                companyName: profile.companyName,
                                industry: profile.industry,
                                companySize: profile.companySize,
                                tenderPreferences: profile.tenderPreferences
                            } : null
                        })
                    })

                    const aiResult = await aiResponse.json()

                    if (aiResult.success && aiResult.rfps && aiResult.rfps.length > 0) {
                        const source = aiResult.source || 'unknown'
                        console.log(`✅ Generated ${aiResult.rfps.length} RFPs from source: ${source}`)

                        // Get existing RFPs to check for duplicates
                        const existingRfps = useFirebase ? await firebaseDB.getRFPs(userId) : rfps

                        const generatedRfps = aiResult.rfps.map((rfp: any, index: number) => {
                            // Calculate fit score based on user profile
                            const matchResult = profile ? calculateFitScore(rfp, {
                                companyName: profile.companyName,
                                industry: profile.industry,
                                companySize: profile.companySize,
                                tenderPreferences: profile.tenderPreferences
                            }) : { score: rfp.fitScore || 50, reasons: [], isMatch: true }

                            return {
                                ...rfp,
                                id: `ai-${Date.now()}-${index}`,
                                isNew: true,
                                scannedAt: new Date().toISOString(),
                                fitScore: matchResult.score,
                                matchReasons: matchResult.reasons,
                                // Add comprehensive data for PDF generation
                                tenderNumber: rfp.tenderNumber || `TN/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
                                scopeOfWork: rfp.scopeOfWork || [
                                    'Supply of materials as per specifications',
                                    'Installation and commissioning at site',
                                    'Testing and quality assurance',
                                    'Training of personnel',
                                    'Warranty support for specified period'
                                ],
                                technicalRequirements: rfp.technicalRequirements || [
                                    { description: 'BIS certification for all materials', mandatory: true },
                                    { description: 'Type test reports from NABL accredited labs', mandatory: true },
                                    { description: 'Routine test reports for all items', mandatory: true },
                                    { description: 'ISO 9001:2015 certification', mandatory: false }
                                ],
                                testingRequirements: rfp.testingRequirements || [
                                    'Routine Tests as per IS specifications',
                                    'Type Tests at manufacturer\'s works',
                                    'Sample Testing at third-party labs',
                                    'Pre-dispatch Inspection'
                                ],
                                termsAndConditions: rfp.termsAndConditions || [
                                    {
                                        section: 'Payment Terms',
                                        details: [
                                            '30% advance payment against bank guarantee',
                                            '60% on despatch of materials',
                                            '10% on successful commissioning'
                                        ]
                                    },
                                    {
                                        section: 'Delivery Terms',
                                        details: [
                                            'Delivery within specified timeline',
                                            'Penalty for delay as per tender conditions',
                                            'Free delivery to site'
                                        ]
                                    },
                                    {
                                        section: 'Warranty',
                                        details: [
                                            '24 months from date of commissioning',
                                            'Free replacement of defective items',
                                            'Onsite support during warranty period'
                                        ]
                                    }
                                ],
                                evaluationCriteria: rfp.evaluationCriteria || [
                                    { criterion: 'Technical Compliance', weightage: 40 },
                                    { criterion: 'Price', weightage: 35 },
                                    { criterion: 'Past Performance', weightage: 15 },
                                    { criterion: 'Delivery Schedule', weightage: 10 }
                                ],
                                documentsRequired: rfp.documentsRequired || [
                                    'Technical bid with detailed specifications',
                                    'Commercial bid with pricing',
                                    'EMD in form of DD/BG',
                                    'Copy of GST registration',
                                    'Copy of PAN card',
                                    'Experience certificates',
                                    'ISO & BIS certificates'
                                ],
                                contactPerson: rfp.contactPerson || {
                                    name: 'Tender Section Officer',
                                    designation: 'Assistant Engineer',
                                    email: 'tender@example.gov.in',
                                    phone: '+91-11-2345-6789'
                                },
                                detailedDescription: rfp.detailedDescription || rfp.summary,
                                warranty: rfp.warranty || '24 months comprehensive warranty from date of commissioning',
                                deliveryTimeline: rfp.deliveryTimeline || 'Within 60 days from date of order'
                            }
                        })

                        // Filter out duplicates based on title and issuedBy
                        const newRfps = generatedRfps.filter((newRfp: any) => {
                            const isDuplicate = existingRfps.some((existing: any) =>
                                existing.title === newRfp.title &&
                                existing.issuedBy === newRfp.issuedBy
                            )
                            return !isDuplicate
                        })

                        console.log(`Filtered out ${generatedRfps.length - newRfps.length} duplicates, adding ${newRfps.length} new RFPs`)

                        if (useFirebase) {
                            for (const rfp of newRfps) {
                                await firebaseDB.saveRFP(rfp, userId)
                            }
                            // Merge new with existing RFPs
                            setRfps([...existingRfps, ...newRfps])
                        } else {
                            const mergedRfps = [...existingRfps, ...newRfps]
                            setRfps(mergedRfps)
                            const storageKey = userId ? `tenderai_scanned_rfps_${userId}` : 'tenderai_scanned_rfps'
                            localStorage.setItem(storageKey, JSON.stringify(mergedRfps))
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
                isNew: true, // Mark as new for visual indicator
                scannedAt: new Date().toISOString()
            }))

            console.log(`Converted ${convertedRFPs.length} real RFPs`)

            // Get existing RFPs to check for duplicates
            const existingRfps = useFirebase ? await firebaseDB.getRFPs(userId) : rfps

            // Filter out duplicates
            const newRfps = convertedRFPs.filter((newRfp) => {
                const isDuplicate = existingRfps.some((existing) =>
                    existing.title === newRfp.title &&
                    existing.issuedBy === newRfp.issuedBy
                )
                return !isDuplicate
            })

            console.log(`Filtered out ${convertedRFPs.length - newRfps.length} duplicates, adding ${newRfps.length} new RFPs`)

            // Save to Firebase or localStorage
            if (useFirebase) {
                try {
                    for (let i = 0; i < newRfps.length; i++) {
                        await firebaseDB.saveRFP(newRfps[i], userId)
                        // Also save to scanned RFPs collection for tracking
                        const originalIndex = convertedRFPs.indexOf(newRfps[i])
                        if (originalIndex !== -1) {
                            await firebaseDB.saveScannedRFP({
                                ...scannedRealRFPs[originalIndex],
                                convertedRfpId: newRfps[i].id,
                            })
                        }
                    }
                    console.log('Saved scanned RFPs to Firebase')
                    // Merge new with existing RFPs
                    setRfps([...existingRfps, ...newRfps])
                } catch (error) {
                    console.error('Error saving RFPs to Firebase:', error)
                    // Fallback to localStorage
                    const mergedRfps = [...existingRfps, ...newRfps]
                    setRfps(mergedRfps)
                    const storageKey = userId ? `tenderai_scanned_rfps_${userId}` : 'tenderai_scanned_rfps'
                    localStorage.setItem(storageKey, JSON.stringify(mergedRfps))
                }
            } else {
                const mergedRfps = [...existingRfps, ...newRfps]
                setRfps(mergedRfps)
                const storageKey = userId ? `tenderai_scanned_rfps_${userId}` : 'tenderai_scanned_rfps'
                localStorage.setItem(storageKey, JSON.stringify(mergedRfps))
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
            // Soft delete in Firebase - mark as deleted instead of removing
            try {
                await firebaseDB.updateRFP(id, {
                    deleted: true,
                    deletedAt: new Date().toISOString()
                })
                console.log('RFP soft deleted in Firebase:', id)
            } catch (error) {
                console.error('Error soft deleting RFP in Firebase:', error)
                // Fallback to local state update
                setRfps(currentRfps =>
                    currentRfps.map(rfp =>
                        rfp.id === id ? { ...rfp, deleted: true, deletedAt: new Date().toISOString() } : rfp
                    )
                )
            }
        } else {
            // Soft delete in localStorage
            setRfps(currentRfps => {
                const updatedRfps = currentRfps.map(rfp =>
                    rfp.id === id ? { ...rfp, deleted: true, deletedAt: new Date().toISOString() } : rfp
                )

                if (typeof window !== 'undefined') {
                    try {
                        const storageKey = userId ? `tenderai_scanned_rfps_${userId}` : 'tenderai_scanned_rfps'
                        localStorage.setItem(storageKey, JSON.stringify(updatedRfps))
                    } catch (error) {
                        console.error('Error soft deleting RFP in localStorage:', error)
                    }
                }

                return updatedRfps
            })
        }
    }, [useFirebase, user?.id])

    const getDeletedRFPs = useCallback(async (): Promise<RFP[]> => {
        const userId = user?.id
        if (useFirebase) {
            try {
                const deletedRfps = await firebaseDB.getDeletedRFPs(userId)
                return deletedRfps
            } catch (error) {
                console.error('Error fetching deleted RFPs from Firebase:', error)
                return []
            }
        } else {
            // Get deleted RFPs from localStorage
            try {
                const storageKey = userId ? `tenderai_scanned_rfps_${userId}` : 'tenderai_scanned_rfps'
                const savedRfps = localStorage.getItem(storageKey)
                if (savedRfps) {
                    const parsed = JSON.parse(savedRfps)
                    return parsed.filter((rfp: RFP) => rfp.deleted === true)
                }
            } catch (error) {
                console.error('Error fetching deleted RFPs from localStorage:', error)
            }
            return []
        }
    }, [useFirebase, user?.id])

    const permanentlyDeleteRFP = useCallback(async (id: string) => {
        const userId = user?.id
        if (useFirebase) {
            // Permanently delete from Firebase
            try {
                await firebaseDB.permanentlyDeleteRFP(id)
                console.log('RFP permanently deleted from Firebase:', id)
            } catch (error) {
                console.error('Error permanently deleting RFP from Firebase:', error)
                throw error
            }
        } else {
            // Permanently delete from localStorage
            setRfps(currentRfps => {
                const updatedRfps = currentRfps.filter(rfp => rfp.id !== id)

                if (typeof window !== 'undefined') {
                    try {
                        const storageKey = userId ? `tenderai_scanned_rfps_${userId}` : 'tenderai_scanned_rfps'
                        localStorage.setItem(storageKey, JSON.stringify(updatedRfps))
                    } catch (error) {
                        console.error('Error permanently deleting RFP from localStorage:', error)
                    }
                }

                return updatedRfps
            })
        }
    }, [useFirebase, user?.id])

    const clearAllRFPs = useCallback(async () => {
        const userId = user?.id
        if (useFirebase) {
            try {
                // Get all RFPs
                const allRfps = await firebaseDB.getRFPs(userId)

                // Only delete RFPs that are 'new' or 'in-progress'
                // Preserve 'submitted' and 'completed' RFPs
                for (const rfp of allRfps) {
                    const status = rfp.status || 'new'
                    if (status === 'new' || status === 'in-progress') {
                        await firebaseDB.permanentlyDeleteRFP(rfp.id)
                    }
                }

                // Update state to only show submitted and completed RFPs
                const remainingRfps = allRfps.filter(rfp => {
                    const status = rfp.status || 'new'
                    return status === 'submitted' || status === 'completed'
                })

                console.log(`Cleared ${allRfps.length - remainingRfps.length} RFPs, preserved ${remainingRfps.length} submitted/completed RFPs`)
                setRfps(remainingRfps)
                setHasScanned(remainingRfps.length > 0)
            } catch (error) {
                console.error('Error clearing RFPs from Firebase:', error)
            }
        } else {
            // Clear from localStorage but preserve submitted and completed
            const remainingRfps = rfps.filter(rfp => {
                const status = rfp.status || 'new'
                return status === 'submitted' || status === 'completed'
            })

            setRfps(remainingRfps)
            setHasScanned(remainingRfps.length > 0)

            if (typeof window !== 'undefined') {
                try {
                    const storageKey = userId ? `tenderai_scanned_rfps_${userId}` : 'tenderai_scanned_rfps'
                    localStorage.setItem(storageKey, JSON.stringify(remainingRfps))
                    console.log(`Cleared RFPs from localStorage, preserved ${remainingRfps.length} submitted/completed RFPs`)
                } catch (error) {
                    console.error('Error clearing RFPs from localStorage:', error)
                }
            }
        }
    }, [useFirebase, user?.id, rfps])

    return (
        <RFPContext.Provider value={{ rfps, isScanning, hasScanned, scanForRFPs, updateRFP, deleteRFP, permanentlyDeleteRFP, getDeletedRFPs, refreshRFPs, clearAllRFPs }}>
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
