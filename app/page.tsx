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
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener("scroll", handleScroll)
        window.addEventListener("mousemove", handleMouseMove)
        return () => {
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("mousemove", handleMouseMove)
        }
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
            image: "/sales_dis.jpeg"
        },
        {
            step: 2,
            title: "Master Orchestration",
            description: "Coordinates specialized agents and calculates win probability based on historical data",
            icon: Brain,
            image: "/mast_orch.jpeg"
        },
        {
            step: 3,
            title: "Technical Matching",
            description: "Matches SKUs with 95%+ accuracy and validates compliance with industry standards",
            icon: Shield,
            image: "/tech.jpeg"
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
        <div ref={containerRef} className="min-h-screen bg-white text-black overflow-hidden">
            {/* Mouse follower glow effect */}
            <div
                className="fixed w-96 h-96 rounded-full pointer-events-none z-0 transition-all duration-300 ease-out"
                style={{
                    left: mousePosition.x - 192,
                    top: mousePosition.y - 192,
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
            />

            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-lg shadow-lg border-b-2 border-purple-100" : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group">
                            <motion.div
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                                className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center group-hover:shadow-xl transition-all"
                            >
                                <Bot className="h-6 w-6 text-white" />
                            </motion.div>
                            <span className="text-2xl font-bold text-black">TenderAgent</span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <button
                                onClick={() => smoothScrollTo('workflow')}
                                className="text-sm font-medium hover:text-gray-500 transition-colors cursor-pointer relative group"
                            >
                                How It Works
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300" />
                            </button>
                            <button
                                onClick={() => smoothScrollTo('features')}
                                className="text-sm font-medium hover:text-gray-500 transition-colors cursor-pointer relative group"
                            >
                                Features
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300" />
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
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white hover:from-black hover:via-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-2xl group">
                                        Get Started
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.div>
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
                                className="block w-full text-left text-sm font-medium hover:text-purple-600 transition-colors"
                            >
                                How It Works
                            </button>
                            <button
                                onClick={() => smoothScrollTo('features')}
                                className="block w-full text-left text-sm font-medium hover:text-purple-600 transition-colors"
                            >
                                Features
                            </button>
                            <Link href="/login" className="block">
                                <Button variant="outline" className="w-full border-2 border-black hover:bg-black hover:text-white">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/login" className="block">
                                <Button className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white hover:from-black hover:via-gray-900 hover:to-black transition-all">
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
                    {/* Enhanced animated mesh gradient with glow */}
                    <div className="absolute inset-0 opacity-40">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                x: [0, 100, 0],
                                y: [0, 50, 0],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute top-0 -left-4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                x: [0, -100, 0],
                                y: [0, -50, 0],
                            }}
                            transition={{
                                duration: 25,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 2
                            }}
                            className="absolute top-0 -right-4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.4, 1],
                                x: [0, 50, 0],
                                y: [0, 100, 0],
                            }}
                            transition={{
                                duration: 30,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 4
                            }}
                            className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl"
                        />
                    </div>
                </div>

                {/* Grid Pattern Overlay with shimmer */}
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
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gray-300 bg-gray-50 mb-8 hover:shadow-lg hover:border-black transition-all duration-300 cursor-default"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="h-4 w-4 text-gray-700" />
                            </motion.div>
                            <span className="text-sm font-medium text-black">AI-Powered RFP Automation</span>
                        </motion.div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-8xl font-bold mb-6 text-black"
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
                            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white hover:from-black hover:via-gray-900 hover:to-black px-8 py-6 text-lg group shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <span className="relative">Get Started Free</span>
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform relative" />
                                </Button>
                            </motion.div>
                        </Link>
                        <div onClick={() => smoothScrollTo('workflow')}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-black hover:bg-black hover:text-white px-8 py-6 text-lg transition-all duration-300"
                                >
                                    See How It Works
                                </Button>
                            </motion.div>
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
                            { value: "10x", label: "Faster Processing", color: "from-purple-600 to-blue-600" },
                            { value: "95%", label: "Match Accuracy", color: "from-blue-600 to-cyan-600" },
                            { value: "78%", label: "Win Probability", color: "from-cyan-600 to-purple-600" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="p-6 border-2 border-black rounded-2xl bg-white hover:shadow-2xl hover:shadow-purple-200 transition-all duration-300 cursor-default relative overflow-hidden group"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                <div className="relative z-10">
                                    <div className="text-4xl font-bold mb-2 text-black">{stat.value}</div>
                                    <div className="text-sm opacity-70">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
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
                        <h2 className="text-5xl font-bold mb-6 text-black">How It Works</h2>
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
                                        <motion.div
                                            whileHover={{ rotate: 360, scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                            className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center shadow-xl"
                                        >
                                            <item.icon className="h-8 w-8 text-white" />
                                        </motion.div>
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
                                        {/* Enhanced glow effect on hover */}
                                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-50 blur-2xl transition-all duration-500" />

                                        {/* Image container with 3D transform */}
                                        <motion.div
                                            className="relative h-80 rounded-2xl border-2 border-black bg-white overflow-hidden shadow-xl"
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
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

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
                                                className="absolute bottom-4 right-4 w-16 h-16 bg-black/90 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 z-20 shadow-2xl"
                                                initial={{ y: 20, opacity: 0 }}
                                                whileHover={{ y: 0, opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <item.icon className="h-8 w-8 text-white" />
                                            </motion.div>

                                            {/* Shimmer effect */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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
                        <h2 className="text-5xl font-bold mb-6 text-black">Powerful Features</h2>
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
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="p-8 rounded-2xl border-2 border-black bg-white hover:shadow-2xl hover:shadow-gray-300 transition-all duration-300 group cursor-default relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-600/5 to-gray-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative z-10">
                                    <motion.div
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center mb-6 shadow-xl"
                                    >
                                        <feature.icon className="h-7 w-7 text-white" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                    <p className="opacity-70">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {/* <section className="relative py-32 px-6 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white overflow-hidden"> */}
                {/* Animated gradient accents */}
                {/* <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl font-bold mb-6">Ready to Transform Your RFP Process?</h2>
                        <p className="text-xl text-purple-100 mb-12">
                            Join leading companies using AI to win more tenders
                        </p>
                        <Link href="/login">
                            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    size="lg"
                                    className="bg-white text-black hover:bg-gray-100 px-12 py-6 text-lg group shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-white hover:border-gray-200 relative overflow-hidden"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <span className="relative">Start Free Trial</span>
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform relative" />
                                </Button>
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>
            </section> */}

            {/* Footer */}
            <footer className="relative py-12 px-6 border-t-2 border-black bg-gradient-to-br from-gray-50 to-white overflow-hidden">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
                                <Bot className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-black">TenderAgent</span>
                        </div>
                        <p className="text-gray-600">&copy; 2025 TenderAgent. Made By <b>Team Zero</b>.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}