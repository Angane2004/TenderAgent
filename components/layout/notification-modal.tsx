"use client"

import { motion } from "framer-motion"
import { X, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface NotificationModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    message: string
    submissionId?: string
}

export function NotificationModal({
    isOpen,
    onClose,
    title,
    message,
    submissionId
}: NotificationModalProps) {
    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                >
                    <Card className="w-full max-w-md border-2 border-black shadow-2xl relative">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Content */}
                        <div className="p-8 text-center">
                            {/* Success Icon */}
                            <div className="flex justify-center mb-4">
                                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-12 w-12 text-green-600" />
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold mb-3">{title}</h2>

                            {/* Message */}
                            <p className="text-gray-600 mb-6">{message}</p>

                            {/* Submission ID */}
                            {submissionId && (
                                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3 mb-6">
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                        Reference ID
                                    </p>
                                    <p className="font-mono text-lg font-bold">{submissionId}</p>
                                </div>
                            )}

                            {/* Label */}
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg">
                                <CheckCircle className="h-5 w-5" />
                                Successfully Submitted
                            </div>

                            {/* Close Button at Bottom */}
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="w-full mt-6 border-2 border-black hover:bg-black hover:text-white"
                            >
                                Close
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </>
    )
}
