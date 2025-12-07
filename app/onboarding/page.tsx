"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building2, ArrowRight, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export default function OnboardingPage() {
    const router = useRouter()
    const { updateProfile } = useUser()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        companyName: "",
        preferences: [] as string[]
    })

    const tenderCategories = [
        "Electrical Infrastructure",
        "Civil Construction",
        "Renewable Energy",
        "IT & Software Services",
        "Industrial Machinery",
        "Consultancy Services",
        "Logistics & Supply Chain",
        "Healthcare & Medical"
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

    const handleSubmit = () => {
        updateProfile({
            companyName: formData.companyName,
            tenderPreferences: formData.preferences,
            isOnboarded: true
        })

        // Add a small delay for better UX
        setTimeout(() => {
            router.push('/dashboard')
        }, 500)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-gray-50 to-blue-50 flex items-center justify-center p-4">
            {/* Animated background blobs */}
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
                <div className="absolute top-40 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg relative z-10"
            >
                <Card className="border-2 border-black shadow-xl backdrop-blur-sm bg-white/90">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-2">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-bold">Welcome to TenderAI</CardTitle>
                        <CardDescription className="text-lg">
                            Let's set up your company profile to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="companyName" className="text-base font-semibold">
                                        Company Name
                                    </Label>
                                    <Input
                                        id="companyName"
                                        placeholder="e.g. Acme Constructions Ltd."
                                        className="h-12 text-lg border-2 border-gray-200 focus:border-black transition-colors"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>
                                <Button
                                    className="w-full h-12 text-lg bg-black text-white hover:bg-gray-800"
                                    disabled={!formData.companyName}
                                    onClick={() => setStep(2)}
                                >
                                    Continue <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">
                                        What kind of tenders are you looking for?
                                    </Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {tenderCategories.map((category) => (
                                            <div
                                                key={category}
                                                onClick={() => handlePreferenceToggle(category)}
                                                className={`
                                                    cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-2
                                                    ${formData.preferences.includes(category)
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-gray-200 hover:border-black text-gray-700 hover:bg-gray-50'}
                                                `}
                                            >
                                                <div className={`
                                                    w-4 h-4 rounded-full border flex items-center justify-center
                                                    ${formData.preferences.includes(category) ? 'border-white' : 'border-gray-400'}
                                                `}>
                                                    {formData.preferences.includes(category) && (
                                                        <div className="w-2 h-2 bg-white rounded-full" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">{category}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 border-2 border-black"
                                        onClick={() => setStep(1)}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        className="flex-1 h-12 bg-black text-white hover:bg-gray-800"
                                        disabled={formData.preferences.length === 0}
                                        onClick={handleSubmit}
                                    >
                                        Complete Setup <CheckCircle2 className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex items-center justify-center gap-2 mt-4">
                            <div className={`h-2 w-2 rounded-full transition-colors ${step === 1 ? 'bg-black' : 'bg-gray-200'}`} />
                            <div className={`h-2 w-2 rounded-full transition-colors ${step === 2 ? 'bg-black' : 'bg-gray-200'}`} />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
