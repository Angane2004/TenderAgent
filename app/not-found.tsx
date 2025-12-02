import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
            <div className="text-center">
                <FileQuestion className="h-24 w-24 text-purple-400 mx-auto mb-6" />
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/">
                        <Button variant="outline" className="border-white/20 hover:bg-white/10">
                            Go Home
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
