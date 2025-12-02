"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Zap, Shield, TrendingUp, CheckCircle2, Menu, X, Sparkles, FileSearch, Brain, Calculator } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const smoothScrollTo = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setMobileMenuOpen(false)
        }
    }

    const workflow = [
        {
            step: 1,
            title: "Sales Discovery",
            description: "AI scans and extracts RFP specifications automatically from emails, portals, and documents",
            icon: FileSearch,
            image: "M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
        },
        {
            step: 2,
            title: "Master Orchestration",
            description: "Coordinates specialized agents and calculates win probability based on historical data",
            icon: Brain,
            image: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        },
        {
            step: 3,
            title: "Technical Matching",
            description: "Matches SKUs with 95%+ accuracy and validates compliance with industry standards",
            icon: Shield,
            image: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
        },
        {
            step: 4,
            title: "Smart Pricing",
            description: "Optimizes pricing with scenario analysis and profitability prediction algorithms",
            icon: Calculator,
            image: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
        },
        {
            step: 5,
            title: "Final Response",
            description: "Generates professional PDF responses ready for submission in seconds",
            icon: CheckCircle2,
            image: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        }
    ]

    const features = [
        {
            title: "AI-Powered Analysis",
            description: "Multi-agent system processes RFPs 10x faster than manual methods with intelligent automation",
            icon: Bot
        },
        {
            title: "95% Match Accuracy",
            description: "Technical agent ensures perfect SKU matching with comprehensive compliance validation",
            icon: Shield
        },
        {
            title: "Smart Pricing",
            description: "Scenario-based pricing optimization for maximum win probability and profitability",
            icon: TrendingUp
        },
        {
            title: "Instant PDF Generation",
            description: "Professional responses generated in seconds, not hours, with customizable templates",
            icon: Sparkles
        }
    ]

    return (
        <div ref={containerRef} className="min-h-screen bg-white text-black">
            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Bot className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold">TenderAgent</span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <button
                                onClick={() => smoothScrollTo('workflow')}
                                className="text-sm font-medium hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                How It Works
                            </button>
                            <button
                                onClick={() => smoothScrollTo('features')}
                                className="text-sm font-medium hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                Features
                            </button>
                            <Link href="/login">
                                <Button
                                    variant="outline"
                                    className="border-2 border-black hover:bg-black hover:text-white transition-all duration-300"
                                >
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button className="bg-black text-white hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-4 pb-4 space-y-4"
                        >
                            <button
                                onClick={() => smoothScrollTo('workflow')}
                                className="block w-full text-left text-sm font-medium hover:text-gray-600 transition-colors"
                            >
                                How It Works
                            </button>
                            <button
                                onClick={() => smoothScrollTo('features')}
                                className="block w-full text-left text-sm font-medium hover:text-gray-600 transition-colors"
                            >
                                Features
                            </button>
                            <Link href="/login" className="block">
                                <Button variant="outline" className="w-full border-2 border-black hover:bg-black hover:text-white">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/login" className="block">
                                <Button className="w-full bg-black text-white hover:bg-gray-800">
                                    Get Started
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
                {/* Animated Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                <div className="max-w-6xl mx-auto text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black mb-8 hover:bg-black hover:text-white transition-all duration-300 cursor-default">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-sm font-medium">AI-Powered RFP Automation</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-8xl font-bold mb-6"
                    >
                        TenderAgent
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
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
                            <Button
                                size="lg"
                                className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg group shadow-2xl hover:shadow-3xl transition-all duration-300"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <div onClick={() => smoothScrollTo('workflow')}>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-black hover:bg-black hover:text-white px-8 py-6 text-lg transition-all duration-300"
                            >
                                See How It Works
                            </Button>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
                    >
                        {[
                            { value: "10x", label: "Faster Processing" },
                            { value: "95%", label: "Match Accuracy" },
                            { value: "78%", label: "Win Probability" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="p-6 border-2 border-black rounded-2xl hover:bg-black hover:text-white transition-all duration-300 cursor-default"
                            >
                                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                                <div className="text-sm opacity-70">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-black rounded-full flex justify-center">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-black rounded-full mt-2"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Workflow Section */}
            <section id="workflow" className="relative py-32 px-6 bg-gray-50 scroll-mt-20">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl font-bold mb-6">How It Works</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Our multi-agent AI system handles the entire RFP lifecycle automatically
                        </p>
                    </motion.div>

                    <div className="space-y-24">
                        {workflow.map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
                            >
                                <div className="flex-1 space-y-4">
                                    <div className="inline-flex items-center gap-3 mb-4">
                                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                                            <item.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="text-sm font-medium text-gray-500">Step {item.step}</div>
                                    </div>
                                    <h3 className="text-3xl font-bold">{item.title}</h3>
                                    <p className="text-lg text-gray-600">{item.description}</p>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="flex-1"
                                >
                                    <div className="relative h-64 rounded-2xl border-2 border-black bg-white p-8 flex items-center justify-center hover:bg-black group transition-all duration-300">
                                        {/* SVG Illustration */}
                                        <svg
                                            className="h-40 w-40 group-hover:scale-110 transition-transform duration-300"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="0.5"
                                        >
                                            <path d={item.image} className="group-hover:stroke-white transition-colors" />
                                            <item.icon className="absolute inset-0 m-auto h-20 w-20 opacity-10 group-hover:opacity-20 transition-opacity" />
                                        </svg>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-32 px-6 bg-white scroll-mt-20">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl font-bold mb-6">Powerful Features</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                                whileHover={{ scale: 1.02 }}
                                className="p-8 rounded-2xl border-2 border-black hover:bg-black hover:text-white transition-all duration-300 group cursor-default"
                            >
                                <div className="w-14 h-14 rounded-xl bg-black group-hover:bg-white flex items-center justify-center mb-6 transition-colors">
                                    <feature.icon className="h-7 w-7 text-white group-hover:text-black transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="opacity-70">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32 px-6 bg-black text-white">
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
                            <Button
                                size="lg"
                                className="bg-white text-black hover:bg-gray-200 px-12 py-6 text-lg group shadow-2xl transition-all duration-300"
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-12 px-6 border-t-2 border-black bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                <Bot className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold">TenderAgent</span>
                        </div>
                        <p className="text-gray-600">&copy; 2025 TenderAgent. Powered by Multi-Agent AI.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
