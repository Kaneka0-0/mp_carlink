import { Car, MessageSquare } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Car className="h-5 w-5 text-teal-500" />
          <Link href="/">Carlink</Link>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/vehicles" className="text-sm font-medium hover:text-teal-500 transition-colors">
            Browse Auctions
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-teal-500 transition-colors">
            Dashboard
          </Link>
          <Link href="/sell" className="text-sm font-medium hover:text-teal-500 transition-colors">
            Sell Vehicle
          </Link>
          <Link
            href="/ai-assistant"
            className="text-sm font-medium hover:text-teal-500 transition-colors flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            AI Assistant
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/auth">
            <Button variant="ghost" className="text-gray-600 hover:text-teal-600">
              Sign In
            </Button>
          </Link>
          <Link href="/auth">
            <Button className="bg-teal-600 hover:bg-teal-700">Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  )
} 