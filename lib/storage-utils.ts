// Debounced localStorage utility
export function debouncedSetItem(key: string, value: any, delay: number = 500) {
    if (typeof window === 'undefined') return

    // Clear any existing timeout for this key
    const timeoutKey = `_timeout_${key}`
    const existingTimeout = (window as any)[timeoutKey]
    if (existingTimeout) {
        clearTimeout(existingTimeout)
    }

    // Set new timeout
    (window as any)[timeoutKey] = setTimeout(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error('Error writing to localStorage:', error)
        }
    }, delay)
}

// Memoized localStorage getter with caching
const cache = new Map<string, { value: any; timestamp: number }>()
const CACHE_TTL = 5000 // 5 seconds

export function cachedGetItem<T = any>(key: string, ttl: number = CACHE_TTL): T | null {
    if (typeof window === 'undefined') return null

    // Check cache first
    const cached = cache.get(key)
    if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.value
    }

    // Read from localStorage
    try {
        const item = localStorage.getItem(key)
        if (item === null) return null

        const value = JSON.parse(item)
        cache.set(key, { value, timestamp: Date.now() })
        return value
    } catch (error) {
        console.error('Error reading from localStorage:', error)
        return null
    }
}

// Clear cache for a specific key
export function clearCache(key?: string) {
    if (key) {
        cache.delete(key)
    } else {
        cache.clear()
    }
}

// Batch localStorage operations
export function batchSetItems(items: Record<string, any>) {
    if (typeof window === 'undefined') return

    requestAnimationFrame(() => {
        Object.entries(items).forEach(([key, value]) => {
            try {
                localStorage.setItem(key, JSON.stringify(value))
            } catch (error) {
                console.error(`Error writing ${key} to localStorage:`, error)
            }
        })
    })
}
