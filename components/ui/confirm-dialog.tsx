import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "./button"

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    isLoading?: boolean
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isLoading = false
}: ConfirmDialogProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Dialog */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="bg-white rounded-lg border-4 border-black max-w-md w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b-2 border-black">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <AlertTriangle className="h-6 w-6 text-red-600" />
                                    </motion.div>
                                    <h2 className="text-xl font-bold">{title}</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="hover:bg-gray-100 p-1 rounded transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-gray-700">{description}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 p-6 border-t-2 border-gray-200">
                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                    className="flex-1 border-2 border-black hover:bg-gray-100"
                                    disabled={isLoading}
                                >
                                    {cancelText}
                                </Button>
                                <Button
                                    onClick={onConfirm}
                                    className="flex-1 bg-red-600 text-white hover:bg-red-700 border-2 border-red-600"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                    ) : (
                                        confirmText
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
