"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Building2, FileText, Target, CheckCircle2, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import GradientBackground from "@/components/background/gradient-background"
import { saveUserProfile, saveUserSettings } from "@/lib/firebase-storage"

export default function OnboardingPage() {
    const router = useRouter()
    const { user } = useUser()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        companyName: "",
        industry: "",
        companySize: "",
        description: "",
        tenderCategories: "",
        specifications: "",
        budget: "",
        location: "",
    })

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        if (!user?.id) return

        setLoading(true)

        try {
            // Save to Firebase user profile
            await saveUserProfile(user.id, {
                name: user.fullName || user.firstName || "User",
                email: user.primaryEmailAddress?.emailAddress || "",
                role: "Sales Manager",
                ...formData
            })

            // Also save to settings
            await saveUserSettings(user.id, {
                companyName: formData.companyName,
                industry: formData.industry,
                emailNotifications: true,
                deadlineReminders: true,
                weeklyDigest: false,
                theme: "light",
                defaultCurrency: "USD",
                timezone: "UTC"
            })

            // Redirect to dashboard
            setTimeout(() => {
                router.push("/dashboard")
            }, 1000)
        } catch (error) {
            console.error("Error saving onboarding data:", error)
            setLoading(false)
        }
    }

    const steps = [
        {
            number: 1,
            title: "Company Information",
            icon: Building2,
            fields: (
                <>
                    <div className="space-y-2">
                        <Label>Company Name *</Label>
                        <Input
                            value={formData.companyName}
                            onChange={(e) => handleChange("companyName", e.target.value)}
                            placeholder="Enter your company name"
                            className="border-2 border-gray-300 focus:border-black"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Industry *</Label>
                        <Input
                            value={formData.industry}
                            onChange={(e) => handleChange("industry", e.target.value)}
                            placeholder="e.g., Technology, Construction, Healthcare"
                            className="border-2 border-gray-300 focus:border-black"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Company Size</Label>
                        <select
                            value={formData.companySize}
                            onChange={(e) => handleChange("companySize", e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-black focus:outline-none"
                        >
                            <option value="">Select company size</option>
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201-500">201-500 employees</option>
                            <option value="500+">500+ employees</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                            value={formData.location}
                            onChange={(e) => handleChange("location", e.target.value)}
                            placeholder="City, Country"
                            className="border-2 border-gray-300 focus:border-black"
                        />
                    </div>
                </>
            )
        },
        {
            number: 2,
            title: "Tender Requirements",
            icon: Target,
            fields: (
                <>
                    <div className="space-y-2">
                        <Label>Tender Categories *</Label>
                        <Input
                            value={formData.tenderCategories}
                            onChange={(e) => handleChange("tenderCategories", e.target.value)}
                            placeholder="e.g., IT Services, Construction, Consulting"
                            className="border-2 border-gray-300 focus:border-black"
                        />
                        <p className="text-xs text-gray-500">Separate multiple categories with commas</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Specifications & Requirements *</Label>
                        <Textarea
                            value={formData.specifications}
                            onChange={(e) => handleChange("specifications", e.target.value)}
                            placeholder="Describe what you're looking for in tenders (e.g., project types, technical requirements, certifications needed)"
                            className="border-2 border-gray-300 focus:border-black min-h-32"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Budget Range</Label>
                        <Input
                            value={formData.budget}
                            onChange={(e) => handleChange("budget", e.target.value)}
                            placeholder="e.g., $50,000 - $500,000"
                            className="border-2 border-gray-300 focus:border-black"
                        />
                    </div>
                </>
            )
        },
        {
            number: 3,
            title: "Additional Details",
            icon: FileText,
            fields: (
                <>
                    <div className="space-y-2">
                        <Label>Company Description</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Brief description of your company and its capabilities"
                            className="border-2 border-gray-300 focus:border-black min-h-32"
                        />
                    </div>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                            What happens next?
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1 ml-7">
                            <li>• AI will scan for relevant tenders based on your criteria</li>
                            <li>• You&apos;ll receive notifications for matching opportunities</li>
                            <li>• Automated RFP response generation will be available</li>
                            <li>• Track all your submissions in one dashboard</li>
                        </ul>
                    </div>
                </>
            )
        }
    ]

    const currentStep = steps[step - 1]
    const isLastStep = step === steps.length
    const canProceed = step === 1
        ? formData.companyName && formData.industry
        : step === 2
            ? formData.tenderCategories && formData.specifications
            : true

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden p-4">
            <GradientBackground />

            <div className="max-w-3xl w-full relative z-10">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {steps.map((s, index) => (
                            <div key={s.number} className="flex items-center flex-1">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${step >= s.number
                                    ? 'bg-black border-black text-white'
                                    : 'bg-white border-gray-300 text-gray-400'
                                    }`}>
                                    {step > s.number ? (
                                        <CheckCircle2 className="h-5 w-5" />
                                    ) : (
                                        <s.icon className="h-5 w-5" />
                                    )}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-2 transition-all ${step > s.number ? 'bg-black' : 'bg-gray-300'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-sm text-gray-600">
                        Step {step} of {steps.length}: {currentStep.title}
                    </p>
                </div>

                {/* Form Card */}
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="border-2 border-black shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <currentStep.icon className="h-6 w-6" />
                                {currentStep.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {currentStep.fields}

                            {/* Navigation Buttons */}
                            <div className="flex gap-4 pt-4">
                                {step > 1 && (
                                    <Button
                                        onClick={() => setStep(step - 1)}
                                        variant="outline"
                                        className="flex-1 border-2 border-black"
                                        disabled={loading}
                                    >
                                        Back
                                    </Button>
                                )}
                                <Button
                                    onClick={() => {
                                        if (isLastStep) {
                                            handleSubmit()
                                        } else {
                                            setStep(step + 1)
                                        }
                                    }}
                                    disabled={!canProceed || loading}
                                    className="flex-1 bg-black text-white hover:bg-gray-800"
                                >
                                    {loading ? (
                                        "Saving..."
                                    ) : isLastStep ? (
                                        <>
                                            Complete Setup
                                            <CheckCircle2 className="h-4 w-4 ml-2" />
                                        </>
                                    ) : (
                                        <>
                                            Continue
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
