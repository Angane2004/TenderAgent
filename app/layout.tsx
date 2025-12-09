import type { Metadata } from "next"
import { Ubuntu } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { RFPProvider } from "@/contexts/rfp-context"
import { UserProvider } from "@/contexts/user-context"
import { Toaster } from 'react-hot-toast'
import "./globals.css"

const ubuntu = Ubuntu({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-ubuntu"
})

export const metadata: Metadata = {
    title: "TenderAgent - AI-Powered RFP Automation",
    keywords: ["RFP Automation", "AI-Powered RFP", "Intelligent Multi-Agent System", "TenderAgent"],
    icons: {
        icon: "/meeting.png",
    },
    description: "Automate your RFP lifecycle with intelligent multi-agent system",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={ubuntu.className}>
                    <UserProvider>
                        <RFPProvider>
                            {children}
                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    duration: 5000,
                                    style: {
                                        background: '#fff',
                                        color: '#000',
                                        border: '2px solid #000',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        fontFamily: 'Ubuntu, sans-serif',
                                        fontWeight: 500,
                                        fontSize: '14px'
                                    },
                                    success: {
                                        iconTheme: {
                                            primary: '#10b981',
                                            secondary: '#fff',
                                        },
                                    },
                                    error: {
                                        iconTheme: {
                                            primary: '#ef4444',
                                            secondary: '#fff',
                                        },
                                    },
                                }}
                            />
                        </RFPProvider>
                    </UserProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}
