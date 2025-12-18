"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useUser as useClerkUser } from "@clerk/nextjs"

interface UserProfile {
    companyName: string
    tenderPreferences: string[]
    isOnboarded: boolean
    industry?: string
    companySize?: string
    contactEmail?: string
    phoneNumber?: string
}

interface UserContextType {
    profile: UserProfile | null
    updateProfile: (data: Partial<UserProfile>) => Promise<void>
    isLoading: boolean
    checkOnboardingStatus: () => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const STORAGE_KEY = 'tenderai_user_profile'

export function UserProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const { user, isLoaded: isClerkLoaded } = useClerkUser()

    useEffect(() => {
        // Load profile from Clerk metadata or localStorage
        if (!isClerkLoaded) return

        const loadProfile = async () => {
            try {
                if (user) {
                    // Priority 1: Check Clerk unsafeMetadata
                    const clerkMetadata = user.unsafeMetadata as Partial<UserProfile>

                    if (clerkMetadata.isOnboarded) {
                        // User has completed onboarding, use Clerk data
                        const profileData: UserProfile = {
                            companyName: clerkMetadata.companyName || "",
                            tenderPreferences: clerkMetadata.tenderPreferences || [],
                            isOnboarded: true,
                            industry: clerkMetadata.industry,
                            companySize: clerkMetadata.companySize,
                            contactEmail: clerkMetadata.contactEmail,
                            phoneNumber: clerkMetadata.phoneNumber,
                        }
                        setProfile(profileData)

                        // Sync to localStorage for offline access
                        if (typeof window !== 'undefined') {
                            localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData))
                        }
                    } else {
                        // Priority 2: Check localStorage (fallback)
                        if (typeof window !== 'undefined') {
                            const savedProfile = localStorage.getItem(STORAGE_KEY)
                            if (savedProfile) {
                                setProfile(JSON.parse(savedProfile))
                            } else {
                                // New user - initialize empty profile
                                setProfile({
                                    companyName: "",
                                    tenderPreferences: [],
                                    isOnboarded: false
                                })
                            }
                        }
                    }
                } else {
                    // No user logged in
                    setProfile(null)
                }
            } catch (error) {
                console.error('Error loading user profile:', error)
                // Fallback to default state
                setProfile({
                    companyName: "",
                    tenderPreferences: [],
                    isOnboarded: false
                })
            } finally {
                setIsLoading(false)
            }
        }

        loadProfile()
    }, [user, isClerkLoaded])

    const updateProfile = async (data: Partial<UserProfile>) => {
        setProfile(prev => {
            if (!prev) return null
            const updated = { ...prev, ...data }

            // Persist to localStorage immediately
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
                } catch (error) {
                    console.error('Error saving user profile to localStorage:', error)
                }
            }

            // Persist to Clerk unsafeMetadata (client-side accessible)
            if (user) {
                user.update({
                    unsafeMetadata: {
                        ...user.unsafeMetadata,
                        ...data
                    }
                }).catch(error => {
                    console.error('Error updating Clerk metadata:', error)
                })
            }

            return updated
        })
    }

    const checkOnboardingStatus = (): boolean => {
        if (!profile) return false
        return profile.isOnboarded
    }

    return (
        <UserContext.Provider value={{ profile, updateProfile, isLoading, checkOnboardingStatus }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context
}
