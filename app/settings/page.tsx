"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Bell, Shield, Database, Save } from "lucide-react"

export default function SettingsPage() {
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1">
                <Header />

                <main className="p-6 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">Settings</h1>
                        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Profile Settings */}
                        <Card className="border-2 border-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Profile Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Full Name</Label>
                                    <Input defaultValue="Demo User" className="mt-1 border-2 border-black" />
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input defaultValue="manager@company.com" className="mt-1 border-2 border-black" />
                                </div>
                                <div>
                                    <Label>Company</Label>
                                    <Input defaultValue="Acme Cables Ltd." className="mt-1 border-2 border-black" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notification Settings */}
                        <Card className="border-2 border-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Notifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">Email Notifications</p>
                                        <p className="text-sm text-gray-600">Receive RFP alerts via email</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">SMS Alerts</p>
                                        <p className="text-sm text-gray-600">Get urgent RFP notifications</p>
                                    </div>
                                    <input type="checkbox" className="w-5 h-5" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">Weekly Reports</p>
                                        <p className="text-sm text-gray-600">Performance summary emails</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security Settings */}
                        <Card className="border-2 border-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Security
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Current Password</Label>
                                    <Input type="password" placeholder="••••••••" className="mt-1 border-2 border-black" />
                                </div>
                                <div>
                                    <Label>New Password</Label>
                                    <Input type="password" placeholder="••••••••" className="mt-1 border-2 border-black" />
                                </div>
                                <div>
                                    <Label>Confirm Password</Label>
                                    <Input type="password" placeholder="••••••••" className="mt-1 border-2 border-black" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Data Settings */}
                        <Card className="border-2 border-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="h-5 w-5" />
                                    Data Management
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="outline" className="w-full border-2 border-black hover:bg-black hover:text-white">
                                    Export All Data
                                </Button>
                                <Button variant="outline" className="w-full border-2 border-black hover:bg-black hover:text-white">
                                    Clear Cache
                                </Button>
                                <Button variant="outline" className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                                    Delete Account
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSave}
                            className="bg-black text-white hover:bg-gray-800 px-8"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {saved ? "Saved!" : "Save Changes"}
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    )
}
