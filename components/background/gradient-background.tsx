"use client"

import { motion } from "framer-motion"

export default function GradientBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />

            {/* Floating gradient orbs */}
            <motion.div
                className="absolute top-0 -left-40 w-80 h-80 bg-gradient-to-br from-gray-200/40 to-transparent rounded-full blur-3xl"
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="absolute top-1/4 -right-40 w-96 h-96 bg-gradient-to-br from-black/5 to-transparent rounded-full blur-3xl"
                animate={{
                    x: [0, -80, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            />

            <motion.div
                className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-gray-300/30 to-transparent rounded-full blur-3xl"
                animate={{
                    x: [0, -50, 0],
                    y: [0, -80, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4
                }}
            />

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, black 1px, transparent 1px),
                        linear-gradient(to bottom, black 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                }}
            />
        </div>
    )
}
