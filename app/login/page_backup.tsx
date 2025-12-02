"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Zap, Shield, TrendingUp, CheckCircle2, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    const workflow = [
        {
            step: 1,
            title: "Sales Discovery",
            description: "AI scans and extracts RFP specifications automatically",
            icon: Bot,
            color: "from-blue-500 to-cyan-500"
        },
        {
            step: 2,
            title: "Master Orchestration",
            description: "Coordinates specialized agents and calculates win probability",
            icon: Zap,
            color: "from-purple-500 to-pink-500"
        },
        {
            step: 3,
            title: "Technical Matching",
            description: "Matches SKUs with 95%+ accuracy and validates compliance",
            icon: Shield,
            color: "from-green-500 to-emerald-500"
        },
        {
            step: 4,
            title: "Smart Pricing",
            description: "Optimizes pricing with scenario analysis and profitability prediction",
            icon: TrendingUp,
            color: "from-orange-500 to-red-500"
        },
        {
            step: 5,
            title: "Final Response",
            description: "Generates professional PDF responses ready for submission",
            icon: CheckCircle2,
            color: "from-indigo-500 to-purple-500"
        }
    ]

    const features = [
        {
            title: "AI-Powered Analysis",
            description: "Multi-agent system processes RFPs 10x faster than manual methods",
            icon: Bot
        },
        {
            title: "95% Match Accuracy",
            description: "Technical agent ensures perfect SKU matching with compliance validation",
            icon: Shield
        },
        {
            title: "Smart Pricing",
            description: "Scenario-based pricing optimization for maximum win probability",
            icon: TrendingUp
        },
        {
            title: "Instant PDF Generation",
            description: "Professional responses generated in seconds, not hours",
            icon: Sparkles
        }
    ]

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[120px]"
                    style={{
                        left: mousePosition.x - 250,
                        top: mousePosition.y - 250,
                        transition: "all 0.3s ease-out"
                    }}
                />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-pink-500/20 blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            {/* Hero Section */}
            <motion.section
                style={{ opacity, scale }}
                className="relative min-h-screen flex items-center justify-center px-6"
            >
                <div className="max-w-6xl mx-auto text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8">
                            <Sparkles className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm">AI-Powered RFP Automation</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
                    >
                        TenderAgent
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
                    >
                        Automate your RFP lifecycle with intelligent multi-agent AI.
                        From discovery to final response in minutes, not days.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link href="/login">
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg group">
                                Get Started
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="#workflow">
                            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 px-8 py-6 text-lg">
                                See How It Works
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
                    >
                        <div>
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">10x</div>
                            <div className="text-sm text-gray-400 mt-2">Faster Processing</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">95%</div>
                            <div className="text-sm text-gray-400 mt-2">Match Accuracy</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">78%</div>
                            <div className="text-sm text-gray-400 mt-2">Win Probability</div>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-white rounded-full mt-2"
                        />
                    </div>
                </motion.div>
            </motion.section>

            {/* Workflow Section */}
            <section id="workflow" className="relative py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl font-bold mb-6">How It Works</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Our multi-agent AI system handles the entire RFP lifecycle automatically
                        </p>
                    </motion.div>

                    <div className="space-y-32">
                        {workflow.map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
                            >
                                <div className="flex-1">
                                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6`}>
                                        <item.icon className="h-10 w-10 text-white" />
                                    </div>
                                    <div className="text-sm text-gray-500 mb-2">Step {item.step}</div>
                                    <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
                                    <p className="text-lg text-gray-400">{item.description}</p>
                                </div>
                                <div className="flex-1">
                                    <div className={`relative h-64 rounded-2xl bg-gradient-to-br ${item.color} opacity-20 backdrop-blur-xl border border-white/10`}>
                                        {/* Placeholder for workflow visualization */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <item.icon className="h-32 w-32 text-white/30" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-32 px-6 bg-gradient-to-b from-black to-gray-900">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl font-bold mb-6">Powerful Features</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Everything you need to win more tenders
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all group"
                            >
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl font-bold mb-6">Ready to Transform Your RFP Process?</h2>
                        <p className="text-xl text-gray-400 mb-12">
                            Join leading companies using AI to win more tenders
                        </p>
                        <Link href="/login">
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-lg group">
                                Start Free Trial
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-12 px-6 border-t border-white/10">
                <div className="max-w-6xl mx-auto text-center text-gray-500">
                    <p>&copy; 2025 TenderAgent. Powered by Multi-Agent AI.</p>
                </div>
            </footer>
        </div>
    )
}
