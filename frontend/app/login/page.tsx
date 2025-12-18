"use client"

import { SignIn } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Shield, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AnimatePresence } from "framer-motion"
import GradientBackground from "@/components/background/gradient-background"

export default function LoginPage() {
    const router = useRouter()
    const [showAdminModal, setShowAdminModal] = useState(false)
    const [pin, setPin] = useState(["", "", "", "", "", "", "", ""])
    const [error, setError] = useState("")
    const [verifying, setVerifying] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [particles, setParticles] = useState<Array<{ left: number; top: number; duration: number; delay: number }>>([])

    useEffect(() => {
        setMounted(true)
        // Initialize particle positions on client side only
        setParticles(
            Array.from({ length: 15 }, () => ({
                left: Math.random() * 100,
                top: Math.random() * 100,
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
            }))
        )
    }, [])

    const handlePinChange = (index: number, value: string) => {
        if (value.length > 1 || verifying) return

        const newPin = [...pin]
        newPin[index] = value
        setPin(newPin)

        // Auto-focus next input
        if (value && index < 7) {
            const nextInput = document.getElementById(`pin-${index + 1}`)
            nextInput?.focus()
        }

        // Check if PIN is complete
        if (index === 7 && value) {
            const fullPin = newPin.join("")
            setVerifying(true)

            // Simulate verification delay with animation
            setTimeout(() => {
                if (fullPin === "11223344") {
                    router.push("/admin")
                } else {
                    setError("Incorrect PIN")
                    setVerifying(false)
                    setPin(["", "", "", "", "", "", "", ""])
                    setTimeout(() => {
                        setError("")
                        document.getElementById("pin-0")?.focus()
                    }, 1500)
                }
            }, 1200)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden p-4">
            <GradientBackground />

            {/* Animated Background Elements */}
            {mounted && (
                <div className="absolute inset-0 pointer-events-none">
                    {particles.map((particle, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-black/5 rounded-full"
                            style={{
                                left: `${particle.left}%`,
                                top: `${particle.top}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                                duration: particle.duration,
                                repeat: Infinity,
                                delay: particle.delay,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
            >
                <div className="mb-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-bold mb-2"
                    >
                        Welcome to TenderAgent
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-600"
                    >
                        Sign in to manage your RFPs with AI
                    </motion.p>
                </div>

                <SignIn
                    appearance={{
                        elements: {
                            formButtonPrimary:
                                'bg-black hover:bg-gray-800 text-sm normal-case',
                            card: 'shadow-2xl border-2 border-black',
                            headerTitle: 'text-2xl font-bold',
                            headerSubtitle: 'text-gray-600',
                            socialButtonsBlockButton:
                                'border-2 border-gray-300 hover:border-black',
                            formFieldInput:
                                'border-2 border-gray-300 focus:border-black',
                            footerActionLink: 'text-black hover:text-gray-700',
                        },
                    }}
                    routing="hash"
                    signUpUrl="/signup"
                />
            </motion.div>

            {/* Admin Access Button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="fixed bottom-8 left-8 z-50"
            >
                <Button
                    onClick={() => setShowAdminModal(true)}
                    variant="outline"
                    className="border-2 border-black hover:bg-black hover:text-white transition-all shadow-lg"
                >
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Access
                </Button>
            </motion.div>

            {/* Admin PIN Modal */}
            <AnimatePresence>
                {showAdminModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Card className="w-full max-w-md p-8 border-2 border-black shadow-2xl">
                                <div className="text-center mb-6">
                                    <Shield className="h-12 w-12 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold mb-2">Admin Access</h2>
                                    <p className="text-gray-600">Enter 8-digit PIN</p>
                                </div>

                                <div className="flex gap-2 justify-center mb-6 relative">
                                    {pin.map((digit, index) => (
                                        <Input
                                            key={index}
                                            id={`pin-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handlePinChange(index, e.target.value)}
                                            disabled={verifying}
                                            className={`w-12 h-12 text-center text-xl font-bold border-2 transition-all ${verifying ? 'border-blue-500 bg-blue-50' : 'border-black'
                                                }`}
                                        />
                                    ))}
                                    {verifying && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-blue-600"
                                        >
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span className="text-sm">Verifying...</span>
                                        </motion.div>
                                    )}
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-red-500 text-center mb-4"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <Button
                                    onClick={() => {
                                        setShowAdminModal(false)
                                        setPin(["", "", "", "", "", "", "", ""])
                                        setError("")
                                        setVerifying(false)
                                    }}
                                    variant="outline"
                                    className="w-full border-2 border-black mt-6"
                                    disabled={verifying}
                                >
                                    Cancel
                                </Button>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
