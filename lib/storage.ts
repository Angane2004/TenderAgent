import { RFP } from "@/types"

const STORAGE_KEY = 'tenderai_rfps'

export const storage = {
    getRFPs: (): RFP[] => {
        if (typeof window === 'undefined') return []
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : []
    },

    getRFP: (id: string): RFP | undefined => {
        const rfps = storage.getRFPs()
        return rfps.find(r => r.id === id)
    },

    saveRFPs: (rfps: RFP[]) => {
        if (typeof window === 'undefined') return
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rfps))
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
