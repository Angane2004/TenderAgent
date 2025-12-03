"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import { Settings, User, Bell, Palette, Save, CheckCircle2 } from "lucide-react"
import GradientBackground from "@/components/background/gradient-background"
import { saveUserSettings, getUserSettings } from "@/lib/firebase-storage"

export default function SettingsPage() {
    const { user } = useUser()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const [settings, setSettings] = useState({
        emailNotifications: true,
        deadlineReminders: true,
        weeklyDigest: false,
        theme: "light",
        companyName: "",
        defaultCurrency: "USD",
        timezone: "UTC"
    })

    useEffect(() => {
        if (user?.id) {
            loadSettings()
        }
    }, [user?.id])

    const loadSettings = async () => {
        if (!user?.id) return

        const savedSettings = await getUserSettings(user.id)
        if (savedSettings) {
            setSettings(savedSettings)
        }
        setLoading(false)
    }

    const handleSave = async () => {
        if (!user?.id) return

        setSaving(true)
        const success = await saveUserSettings(user.id, settings)

        if (success) {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        }
        setSaving(false)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    return (
        <div className="flex min-h-screen bg-gray-50 relative">
            <GradientBackground />
            <Sidebar />

            <div className="flex-1">
                <Header />

                <main className="p-6 space-y-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Settings</h1>
                            <p className="text-gray-600 mt-1">Manage your account preferences</p>
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-black text-white hover:bg-gray-800"
                        >
                            {saved ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Saved!
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    {saving ? "Saving..." : "Save Changes"}
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Profile Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="border-2 border-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Profile Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input
                                            value={user?.fullName || ""}
                                            disabled
                                            className="border-2 border-gray-300"
                                        />
                                        <p className="text-xs text-gray-500">Managed by Clerk</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input
                                            value={user?.primaryEmailAddress?.emailAddress || ""}
                                            disabled
                                            className="border-2 border-gray-300"
                                        />
                                        <p className="text-xs text-gray-500">Managed by Clerk</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <Input
                                        value={settings.companyName}
                                        onChange={(e) => handleChange("companyName", e.target.value)}
                                        placeholder="Enter your company name"
                                        className="border-2 border-gray-300 focus:border-black"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Notification Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-2 border-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Notifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Email Notifications</p>
                                        <p className="text-sm text-gray-600">Receive email updates about your RFPs</p>
                                    </div>
                                    <Switch
                                        checked={settings.emailNotifications}
                                        onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Deadline Reminders</p>
                                        <p className="text-sm text-gray-600">Get notified before RFP deadlines</p>
                                    </div>
                                    <Switch
                                        checked={settings.deadlineReminders}
                                        onCheckedChange={(checked) => handleChange("deadlineReminders", checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Weekly Digest</p>
                                        <p className="text-sm text-gray-600">Receive a weekly summary of your activity</p>
                                    </div>
                                    <Switch
                                        checked={settings.weeklyDigest}
                                        onCheckedChange={(checked) => handleChange("weeklyDigest", checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Preferences */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-2 border-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Preferences
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Default Currency</Label>
                                        <select
                                            value={settings.defaultCurrency}
                                            onChange={(e) => handleChange("defaultCurrency", e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-black focus:outline-none"
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                            <option value="INR">INR (₹)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Timezone</Label>
                                        <select
                                            value={settings.timezone}
                                            onChange={(e) => handleChange("timezone", e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-black focus:outline-none"
                                        >
                                            <option value="UTC">UTC</option>
                                            <option value="America/New_York">Eastern Time</option>
                                            <option value="America/Los_Angeles">Pacific Time</option>
                                            <option value="Europe/London">London</option>
                                            <option value="Asia/Kolkata">India</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </main>
            </div>
        </div>
    )
}
