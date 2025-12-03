"use client"

import { SignUp } from "@clerk/nextjs"
import { motion } from "framer-motion"
import GradientBackground from "@/components/background/gradient-background"

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden p-4">
            <GradientBackground />

            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-black/5 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Sign Up Card */}
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
                        Join TenderAgent
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-600"
                    >
                        Create your account to start managing RFPs with AI
                    </motion.p>
                </div>

                <SignUp
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
                    routing="path"
                    path="/signup"
                    signInUrl="/login"
                />
            </motion.div>
        </div>
    )
}
