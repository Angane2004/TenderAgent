"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bot } from "lucide-react"

export default function AILoading() {
    const router = useRouter()
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setTimeout(() => router.push('/dashboard'), 500)
                    return 100
                }
                return prev + 2
            })
        }, 30)

        return () => clearInterval(interval)
    }, [router])

    const messages = [
        "Initializing AI agents...",
        "Loading RFP database...",
        "Preparing analytics...",
        "Almost ready..."
    ]

    const currentMessage = messages[Math.floor((progress / 100) * messages.length)] || messages[0]

    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Floating Particles */}
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-black rounded-full"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        opacity: 0
                    }}
                    animate={{
                        y: [null, -100],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                    }}
                />
            ))}

            {/* Geometric Shapes */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={`shape-${i}`}
                    className="absolute border-2 border-black/10"
                    style={{
                        width: 100 + i * 50,
                        height: 100 + i * 50,
                        left: `${20 + i * 15}%`,
                        top: `${10 + i * 10}%`,
                    }}
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 10 + i * 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}

            <div className="relative z-10 text-center">
                {/* Static Bot Icon with Pulse */}
                <motion.div className="relative w-48 h-48 mx-auto mb-8">
                    {/* Main Bot Circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className="w-32 h-32 bg-gradient-to-br from-black via-gray-800 to-black rounded-full flex items-center justify-center shadow-2xl"
                            animate={{
                                scale: [1, 1.1, 1],
                                boxShadow: [
                                    "0 20px 50px rgba(0,0,0,0.3)",
                                    "0 25px 60px rgba(0,0,0,0.4)",
                                    "0 20px 50px rgba(0,0,0,0.3)"
                                ]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                        >
                            <Bot className="h-16 w-16 text-white" />
                        </motion.div>
                    </div>

                    {/* Orbiting Data Nodes */}
                    {[0, 72, 144, 216, 288].map((angle, i) => (
                        <motion.div
                            key={i}
                            className="absolute top-1/2 left-1/2"
                            style={{
                                width: '200px',
                                height: '200px',
                                marginLeft: '-100px',
                                marginTop: '-100px',
                            }}
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * 0.2
                            }}
                        >
                            <motion.div
                                className="absolute w-4 h-4 bg-gradient-to-br from-black to-gray-600 rounded-full shadow-lg"
                                style={{
                                    top: '0',
                                    left: '50%',
                                    transform: 'translateX(-50%)'
                                }}
                                animate={{
                                    scale: [1, 1.5, 1],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                            />
                        </motion.div>
                    ))}

                    {/* Pulse Rings */}
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={`ring-${i}`}
                            className="absolute inset-0 border-2 border-black rounded-full"
                            animate={{
                                scale: [1, 2.5, 2.5],
                                opacity: [0.6, 0.2, 0],
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                delay: i * 0.8,
                            }}
                        />
                    ))}
                </motion.div>

                {/* Progress Bar */}
                <div className="w-80 h-4 bg-gray-200 rounded-full overflow-hidden mb-4 border-2 border-black shadow-lg">
                    <motion.div
                        className="h-full bg-gradient-to-r from-black via-gray-700 to-black bg-[length:200%_100%]"
                        initial={{ width: 0 }}
                        animate={{
                            width: `${progress}%`,
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                        }}
                        transition={{
                            width: { duration: 0.3 },
                            backgroundPosition: { duration: 2, repeat: Infinity }
                        }}
                    />
                </div>

                {/* Progress Text */}
                <motion.div
                    className="text-black text-2xl font-bold mb-2"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                >
                    {progress}%
                </motion.div>
                <motion.div
                    className="text-gray-600 text-base font-medium mb-6"
                    key={currentMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {currentMessage}
                </motion.div>

                {/* Animated Loading Dots */}
                <div className="flex justify-center gap-2">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-3 h-3 bg-black rounded-full"
                            animate={{
                                y: [0, -15, 0],
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
