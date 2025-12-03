import { RFP } from "@/types"

const getCurrentUserKey = () => {
    if (typeof window === 'undefined') return 'tenderai_rfps_guest'
    const user = localStorage.getItem('tenderai_current_user')
    return user ? `tenderai_rfps_${user}` : 'tenderai_rfps_guest'
}

export const storage = {
    getRFPs: (): RFP[] => {
        if (typeof window === 'undefined') return []
        const key = getCurrentUserKey()
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : []
    },

    getRFP: (id: string): RFP | undefined => {
        const rfps = storage.getRFPs()
        return rfps.find(r => r.id === id)
    },

    saveRFPs: (rfps: RFP[]) => {
        if (typeof window === 'undefined') return
        const key = getCurrentUserKey()
        localStorage.setItem(key, JSON.stringify(rfps))
        // Dispatch custom event to notify listeners
        window.dispatchEvent(new Event('rfpsUpdated'))
    },

    updateRFP: (id: string, updates: Partial<RFP>) => {
        const rfps = storage.getRFPs()
        const index = rfps.findIndex(r => r.id === id)

        if (index !== -1) {
            rfps[index] = { ...rfps[index], ...updates }
            storage.saveRFPs(rfps)
            return rfps[index]
        }
        return null
    },

    // Reset data to initial state (useful for testing/demo)
    resetData: (initialData: RFP[]) => {
        storage.saveRFPs(initialData)
    }
}
