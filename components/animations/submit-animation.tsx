"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Send, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface SubmitAnimationProps {
    show: boolean
    onComplete: () => void
}

export function SubmitAnimation({ show, onComplete }: SubmitAnimationProps) {
    const [stage, setStage] = useState<'sending' | 'success'>('sending')

    useEffect(() => {
        if (show) {
            setStage('sending')
            const timer = setTimeout(() => {
                setStage('success')
                setTimeout(onComplete, 1500)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [show, onComplete])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="bg-white rounded-2xl p-12 shadow-2xl"
                    >
                        {stage === 'sending' ? (
                            <div className="flex flex-col items-center gap-6">
                                {/* Floating Send Arrow */}
                                <motion.div
                                    className="relative"
                                    animate={{
                                        y: [0, -20, 0],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <motion.div
                                        className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl"
                                        animate={{
                                            boxShadow: [
                                                "0 10px 40px rgba(59, 130, 246, 0.3)",
                                                "0 20px 60px rgba(59, 130, 246, 0.5)",
                                                "0 10px 40px rgba(59, 130, 246, 0.3)"
                                            ]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                        }}
                                    >
                                        <Send className="h-12 w-12 text-white" />
                                    </motion.div>

                                    {/* Particle Effects */}
                                    {[...Array(8)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-2 h-2 bg-blue-500 rounded-full"
                                            style={{
                                                top: '50%',
                                                left: '50%',
                                            }}
                                            animate={{
                                                x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
                                                y: [0, Math.sin(i * 45 * Math.PI / 180) * 60],
                                                opacity: [1, 0],
                                                scale: [1, 0],
                                            }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                delay: i * 0.1,
                                            }}
                                        />
                                    ))}
                                </motion.div>

                                <motion.h3
                                    className="text-2xl font-bold text-gray-900"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    Submitting Response...
                                </motion.h3>

                                <div className="flex gap-2">
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="w-3 h-3 bg-blue-500 rounded-full"
                                            animate={{
                                                y: [0, -10, 0],
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex flex-col items-center gap-6"
                            >
                                {/* Success Checkmark */}
                                <motion.div
                                    className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{
                                        duration: 0.5,
                                    }}
                                >
                                    <CheckCircle className="h-12 w-12 text-white" />
                                </motion.div>

                                <h3 className="text-2xl font-bold text-gray-900">
                                    Response Submitted!
                                </h3>

                                <p className="text-gray-600">
                                    Your RFP response has been sent successfully
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
