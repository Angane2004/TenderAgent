"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface UserProfile {
    companyName: string
    tenderPreferences: string[]
    isOnboarded: boolean
}

interface UserContextType {
    profile: UserProfile | null
    updateProfile: (data: Partial<UserProfile>) => void
    isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const STORAGE_KEY = 'tenderai_user_profile'

export function UserProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Load profile from localStorage on mount
        if (typeof window === 'undefined') return

        try {
            const savedProfile = localStorage.getItem(STORAGE_KEY)
            if (savedProfile) {
                setProfile(JSON.parse(savedProfile))
            } else {
                // Initialize default state if no profile exists
                setProfile({
                    companyName: "",
                    tenderPreferences: [],
                    isOnboarded: false
                })
            }
        } catch (error) {
            console.error('Error loading user profile:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const updateProfile = (data: Partial<UserProfile>) => {
        setProfile(prev => {
            if (!prev) return null
            const updated = { ...prev, ...data }

            // Persist to localStorage
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
                } catch (error) {
                    console.error('Error saving user profile:', error)
                }
            }

            return updated
        })
    }

    return (
        <UserContext.Provider value={{ profile, updateProfile, isLoading }}>
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
