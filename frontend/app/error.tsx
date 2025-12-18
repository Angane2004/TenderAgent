'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 max-w-2xl w-full overflow-auto">
                <p className="text-red-600 font-semibold mb-2">Error Message:</p>
                <p className="text-red-800 font-mono text-sm mb-4">{error.message}</p>
                {error.digest && (
                    <p className="text-gray-500 text-xs">Digest: {error.digest}</p>
                )}
            </div>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
                Try again
            </button>
        </div>
    )
}
