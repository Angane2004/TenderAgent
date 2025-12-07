"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface AnimatedBackgroundProps {
    theme?: "professional" | "dark" | "light"
    intensity?: "low" | "medium" | "high"
    showCursor?: boolean
}

export function AnimatedBackground({
    theme = "professional",
    intensity = "medium",
    showCursor = true
}: AnimatedBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [cursorText, setCursorText] = useState("")
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    // AI/RFP related terms that float around
    const floatingTerms = [
        "RFP Analysis", "AI Processing", "Tender Evaluation", "Proposal Generation",
        "Compliance Check", "Smart Pricing", "Win Probability", "SKU Matching",
        "Technical Review", "Sales Discovery", "Master Orchestration", "Final Response",
        "Automated Workflow", "Multi-Agent AI", "Document Analysis", "Bid Management"
    ]

    // Text that appears with cursor typing effect
    const cursorTexts = [
        "Analyzing RFP requirements...",
        "Processing tender documents...",
        "Calculating win probability...",
        "Generating proposal response...",
        "Optimizing pricing strategy...",
        "Matching technical specifications..."
    ]

    // Typing cursor effect
    useEffect(() => {
        if (!showCursor) return

        let currentIndex = 0
        let charIndex = 0
        let isDeleting = false

        const typeText = () => {
            const currentText = cursorTexts[currentIndex]

            if (!isDeleting) {
                setCursorText(currentText.substring(0, charIndex + 1))
                charIndex++

                if (charIndex === currentText.length) {
                    setTimeout(() => { isDeleting = true }, 2000)
                }
            } else {
                setCursorText(currentText.substring(0, charIndex - 1))
                charIndex--

                if (charIndex === 0) {
                    isDeleting = false
                    currentIndex = (currentIndex + 1) % cursorTexts.length
                }
            }
        }

        const interval = setInterval(typeText, isDeleting ? 50 : 100)
        return () => clearInterval(interval)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showCursor])

    // Mouse tracking for interactive particles
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    // Canvas particle system
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const particles: Array<{
            x: number
            y: number
            vx: number
            vy: number
            size: number
            opacity: number
        }> = []

        const particleCount = intensity === "low" ? 20 : intensity === "medium" ? 40 : 60

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            })
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update and draw particles
            particles.forEach((particle, i) => {
                // Move particle
                particle.x += particle.vx
                particle.y += particle.vy

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

                // Mouse interaction
                const dx = mousePos.x - particle.x
                const dy = mousePos.y - particle.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < 100) {
                    particle.x -= dx * 0.01
                    particle.y -= dy * 0.01
                }

                // Draw particle
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fillStyle = theme === "professional"
                    ? `rgba(37, 99, 235, ${particle.opacity})`
                    : `rgba(0, 0, 0, ${particle.opacity})`
                ctx.fill()

                // Draw connections
                particles.forEach((otherParticle, j) => {
                    if (i === j) return
                    const dx = particle.x - otherParticle.x
                    const dy = particle.y - otherParticle.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 100) {
                        ctx.beginPath()
                        ctx.moveTo(particle.x, particle.y)
                        ctx.lineTo(otherParticle.x, otherParticle.y)
                        ctx.strokeStyle = theme === "professional"
                            ? `rgba(37, 99, 235, ${0.1 * (1 - distance / 100)})`
                            : `rgba(0, 0, 0, ${0.1 * (1 - distance / 100)})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                })
            })

            requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [intensity, theme, mousePos])

    const getGradientColors = () => {
        switch (theme) {
            case "professional":
                return "from-blue-900 via-blue-800 to-blue-900"
            case "dark":
                return "from-gray-900 via-gray-800 to-gray-900"
            case "light":
                return "from-blue-50 via-purple-50 to-pink-50"
            default:
                return "from-blue-900 via-blue-800 to-blue-900"
        }
    }

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradientColors()}`} />

            {/* Geometric Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,currentColor_48%,currentColor_52%,transparent_52%)] bg-[length:20px_20px]" />
            </div>

            {/* Canvas for particles */}
            <canvas ref={canvasRef} className="absolute inset-0" />

            {/* Floating Text Terms */}
            {floatingTerms.map((term, index) => (
                <motion.div
                    key={index}
                    className="absolute text-white/10 font-mono text-sm select-none"
                    initial={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                    }}
                    animate={{
                        x: [
                            null,
                            Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        ],
                        y: [
                            null,
                            Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                            Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                        ],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 20 + Math.random() * 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {term}
                </motion.div>
            ))}

            {/* Cursor Typing Effect */}
            {showCursor && (
                <motion.div
                    className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-white/20 font-mono text-2xl select-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {cursorText}
                    <span className="inline-block w-0.5 h-6 bg-white/40 ml-1 animate-pulse" />
                </motion.div>
            )}

            {/* Radial Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
        </div>
    )
}
