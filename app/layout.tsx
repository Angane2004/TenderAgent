import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { RFPProvider } from "@/contexts/rfp-context"
import { UserProvider } from "@/contexts/user-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "TenderAgent - AI-Powered RFP Automation",
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
                <body className={inter.className}>
                    <UserProvider>
                        <RFPProvider>
                            {children}
                        </RFPProvider>
                    </UserProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}
