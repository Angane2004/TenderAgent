"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building2, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function OnboardingPage() {
    const router = useRouter()
    const { updateProfile } = useUser()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [formData, setFormData] = useState({
        companyName: "",
        industry: "",
        companySize: "",
        preferences: [] as string[],
        contactEmail: "",
        phoneNumber: ""
    })

    const industries = [
        "Electrical Infrastructure",
        "Civil Construction",
        "Renewable Energy",
        "IT & Software Services",
        "Industrial Machinery",
        "Consultancy Services",
        "Logistics & Supply Chain",
        "Healthcare & Medical",
        "Manufacturing",
        "Telecommunications",
        "Oil & Gas",
        "Mining & Minerals",
        "Water & Wastewater",
        "Transportation",
        "Defense & Aerospace",
        "Agriculture & Farming",
        "Education & Training",
        "Financial Services",
        "Real Estate & Property",
        "Hospitality & Tourism",
        "Retail & E-commerce",
        "Media & Entertainment",
        "Environmental Services",
        "Security Services"
    ]

    const companySizes = [
        "1-10 employees",
        "11-50 employees",
        "51-200 employees",
        "201-500 employees",
        "501-1000 employees",
        "1000+ employees"
    ]

    const tenderCategories = [
        "Electrical Infrastructure",
        "Civil Construction",
        "Renewable Energy",
        "IT & Software Services",
        "Industrial Machinery",
        "Consultancy Services",
        "Logistics & Supply Chain",
        "Healthcare & Medical",
        "Manufacturing Equipment",
        "Telecommunications",
        "Oil & Gas Equipment",
        "Mining Equipment",
        "Water Treatment",
        "Transportation & Vehicles",
        "Defense Equipment",
        "Agricultural Equipment",
        "Educational Supplies",
        "Office Supplies",
        "Security Systems",
        "Environmental Solutions"
    ]

    const handlePreferenceToggle = (category: string) => {
        setFormData(prev => {
            if (prev.preferences.includes(category)) {
                return { ...prev, preferences: prev.preferences.filter(c => c !== category) }
            } else {
                return { ...prev, preferences: [...prev.preferences, category] }
            }
        })
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        setShowError(false)

        try {
            // Validate required fields
            if (!formData.companyName || !formData.industry || !formData.companySize || formData.preferences.length === 0) {
                setShowError(true)
                setIsSubmitting(false)
                setTimeout(() => setShowError(false), 5000)
                return
            }

            await updateProfile({
                companyName: formData.companyName,
                industry: formData.industry,
                companySize: formData.companySize,
                tenderPreferences: formData.preferences,
                contactEmail: formData.contactEmail,
                phoneNumber: formData.phoneNumber,
                isOnboarded: true
            })

            // Show success message
            setShowSuccess(true)

            // Wait for user to see success message, then redirect
            await new Promise(resolve => setTimeout(resolve, 2000))
            router.push('/dashboard')
        } catch (error) {
            console.error('Error saving profile:', error)
            setShowError(true)
            setIsSubmitting(false)
            setTimeout(() => setShowError(false), 5000)
        }
    }

    const canProceedStep1 = formData.companyName.trim().length > 0
    const canProceedStep2 = formData.industry && formData.companySize
    const canSubmit = formData.preferences.length > 0

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-green-600 flex items-center gap-3 max-w-md"
                    >
                        <CheckCircle2 className="w-6 h-6" />
                        <div>
                            <p className="font-bold text-lg">Profile Submitted Successfully!</p>
                            <p className="text-sm">Redirecting to dashboard...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Toast */}
            <AnimatePresence>
                {showError && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-red-600 flex items-center gap-3 max-w-md"
                    >
                        <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">!</span>
                        </div>
                        <div>
                            <p className="font-bold text-lg">Submission Failed</p>
                            <p className="text-sm">Something is missing. Please try again later.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl"
            >
                <Card className="border-2 border-gray-200 shadow-lg bg-white">
                    <CardHeader className="text-center space-y-3 pb-6">
                        <div className="mx-auto w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-2">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-gray-900">
                            Company Profile Setup
                        </CardTitle>
                        <CardDescription className="text-base text-gray-600">
                            Complete your profile to get started with TenderAI
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 pb-8">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName" className="text-base font-semibold text-gray-900">
                                            Company Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="companyName"
                                            placeholder="Enter your company name"
                                            className="h-12 text-base border-2 border-gray-300 focus:border-black"
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                            autoFocus
                                        />
                                    </div>
                                    <Button
                                        className="w-full h-12 text-base bg-black text-white hover:bg-gray-800"
                                        disabled={!canProceedStep1}
                                        onClick={() => setStep(2)}
                                    >
                                        Continue <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="industry" className="text-base font-semibold text-gray-900">
                                            Industry / Sector <span className="text-red-500">*</span>
                                        </Label>
                                        <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                                            <SelectTrigger className="h-12 text-base border-2 border-gray-300 focus:border-black">
                                                <SelectValue placeholder="Select your industry" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[300px]">
                                                {industries.map((industry) => (
                                                    <SelectItem key={industry} value={industry} className="text-base">
                                                        {industry}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="companySize" className="text-base font-semibold text-gray-900">
                                            Company Size <span className="text-red-500">*</span>
                                        </Label>
                                        <Select value={formData.companySize} onValueChange={(value) => setFormData({ ...formData, companySize: value })}>
                                            <SelectTrigger className="h-12 text-base border-2 border-gray-300 focus:border-black">
                                                <SelectValue placeholder="Select company size" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {companySizes.map((size) => (
                                                    <SelectItem key={size} value={size} className="text-base">
                                                        {size}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            variant="outline"
                                            className="h-12 border-2 border-gray-300 hover:bg-gray-50"
                                            onClick={() => setStep(1)}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            className="h-12 bg-black text-white hover:bg-gray-800"
                                            disabled={!canProceedStep2}
                                            onClick={() => setStep(3)}
                                        >
                                            Continue <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-3">
                                        <Label className="text-base font-semibold text-gray-900">
                                            Tender Preferences <span className="text-red-500">*</span>
                                        </Label>
                                        <p className="text-sm text-gray-600">Select the types of tenders you're interested in</p>
                                        <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
                                            {tenderCategories.map((category) => (
                                                <div
                                                    key={category}
                                                    onClick={() => handlePreferenceToggle(category)}
                                                    className={`
                                                        cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3
                                                        ${formData.preferences.includes(category)
                                                            ? 'border-black bg-black text-white'
                                                            : 'border-gray-300 hover:border-black text-gray-700 hover:bg-gray-50'}
                                                    `}
                                                >
                                                    <div className={`
                                                        w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                                                        ${formData.preferences.includes(category) ? 'border-white bg-white' : 'border-gray-400'}
                                                    `}>
                                                        {formData.preferences.includes(category) && (
                                                            <CheckCircle2 className="w-4 h-4 text-black" />
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-medium">{category}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            variant="outline"
                                            className="h-12 border-2 border-gray-300 hover:bg-gray-50"
                                            onClick={() => setStep(2)}
                                            disabled={isSubmitting}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            className="h-12 bg-black text-white hover:bg-gray-800"
                                            disabled={!canSubmit || isSubmitting}
                                            onClick={handleSubmit}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    Complete Setup <CheckCircle2 className="ml-2 w-5 h-5" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Simple Progress Indicators */}
                        <div className="flex items-center justify-center gap-2 pt-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={`h-2 rounded-full transition-all duration-300 ${step === i
                                        ? 'w-8 bg-black'
                                        : step > i
                                            ? 'w-2 bg-green-500'
                                            : 'w-2 bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
