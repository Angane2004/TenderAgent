"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Mail, Lock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import AILoading from "@/components/loading/ai-loading"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showAILoading, setShowAILoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate login delay
        setTimeout(() => {
            // Save current user for session
            localStorage.setItem('tenderai_current_user', email)

            // Note: We no longer clear data here, as we want persistence per user.
            // Data is isolated by the email key in storage.ts

            setIsLoading(false)
            setShowAILoading(true)
        }, 1000)
    }

    if (showAILoading) {
        return <AILoading />
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4 relative overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Animated Circles */}
            <motion.div
                className="absolute top-20 right-20 w-64 h-64 border-2 border-black rounded-full"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-20 left-20 w-96 h-96 border-2 border-black rounded-full"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="border-2 border-black shadow-2xl bg-white">
                    <CardHeader className="space-y-4 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mx-auto w-16 h-16 bg-black rounded-2xl flex items-center justify-center"
                        >
                            <Bot className="h-8 w-8 text-white" />
                        </motion.div>
                        <div>
                            <CardTitle className="text-3xl font-bold">
                                TenderAgent
                            </CardTitle>
                            <CardDescription className="text-base mt-2 text-gray-600">
                                AI-Powered RFP Automation Platform
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="email"
                                        placeholder="manager@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 border-2 border-black focus:ring-black focus:border-black"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 border-2 border-black focus:ring-black focus:border-black"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-black text-white hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Logging in...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Sign In
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-600 border-t-2 border-gray-100 pt-4">
                            <p>Demo credentials: Any email and password</p>
                        </div>
                    </CardContent>
                </Card>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center text-gray-600 text-sm"
                >
                    <p className="flex items-center justify-center gap-2">
                        <Bot className="h-4 w-4" />
                        Powered by Multi-Agent AI System
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}
