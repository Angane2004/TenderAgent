"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Zap, Shield, TrendingUp, CheckCircle2, Menu, X, Sparkles, FileSearch, Brain, Calculator } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
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
            image: "/sales_dis.png"
        },
        {
            step: 2,
            title: "Master Orchestration",
            description: "Coordinates specialized agents and calculates win probability based on historical data",
            icon: Brain,
            image: "/mast_orch.png"
        },
        {
            step: 3,
            title: "Technical Matching",
            description: "Matches SKUs with 95%+ accuracy and validates compliance with industry standards",
            icon: Shield,
            image: "/tech.png"
        },
        {
            step: 4,
            title: "Smart Pricing",
            description: "Optimizes pricing with scenario analysis and profitability prediction algorithms",
            icon: Calculator,
            image: "/smpri.png"
        },
        {
            step: 5,
            title: "Final Response",
            description: "Generates professional PDF responses ready for submission in seconds",
            icon: CheckCircle2,
            image: "/fires.png"
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
            <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50">
                    {/* Animated mesh gradient */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
                        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
                        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
                    </div>
                </div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Radial gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)]" />

                <div className="max-w-6xl mx-auto text-center z-10 relative">
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
            <section id="workflow" className="relative py-32 px-6 scroll-mt-20 overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                    {/* Animated mesh gradient */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
                        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
                        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
                    </div>
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
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
                                    className="flex-1 perspective-1000"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="relative group">
                                        {/* Glow effect on hover */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500" />

                                        {/* Image container with 3D transform */}
                                        <motion.div
                                            className="relative h-80 rounded-2xl border-2 border-black bg-white overflow-hidden"
                                            whileHover={{
                                                rotateY: 5,
                                                rotateX: 5,
                                                scale: 1.05,
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 20
                                            }}
                                            style={{
                                                transformStyle: "preserve-3d",
                                                perspective: "1000px"
                                            }}
                                        >
                                            {/* Overlay gradient on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                                            {/* Image */}
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                priority={index === 0}
                                            />

                                            {/* Floating icon on hover */}
                                            <motion.div
                                                className="absolute bottom-4 right-4 w-16 h-16 bg-black/90 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 z-20"
                                                initial={{ y: 20, opacity: 0 }}
                                                whileHover={{ y: 0, opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <item.icon className="h-8 w-8 text-white" />
                                            </motion.div>

                                            {/* Shimmer effect */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-32 px-6 scroll-mt-20 overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50">
                    {/* Animated mesh gradient */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
                        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
                    </div>
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
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
            <section className="relative py-32 px-6 bg-black text-white overflow-hidden">
                {/* Animated gradient accents */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl animate-blob" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
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
            <footer className="relative py-12 px-6 border-t-2 border-black bg-gradient-to-br from-gray-50 to-white overflow-hidden">
                <div className="max-w-6xl mx-auto relative z-10">
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