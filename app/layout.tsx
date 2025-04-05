import type React from "react"
import Link from "next/link"
import { Car, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import "@/app/globals.css"

export const metadata = {
  title: "Carlink - Vehicle Auction Platform",
  description: "Find, bid, and win your dream car on our transparent auction platform.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl">
                  <Car className="h-5 w-5 text-teal-500" />
                  <Link href="/">Carlink</Link>
                </div>
                <nav className="hidden md:flex items-center gap-6">
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
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    Sign In
                  </Button>
                  <Button size="sm" className="hidden md:flex">
                    Sign Up
                  </Button>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <line x1="4" x2="20" y1="12" y2="12" />
                      <line x1="4" x2="20" y1="6" y2="6" />
                      <line x1="4" x2="20" y1="18" y2="18" />
                    </svg>
                  </Button>
                </div>
              </div>
            </header>
            {children}
            <footer className="w-full border-t bg-white py-6">
              <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-2 font-semibold">
                  <Car className="h-5 w-5 text-teal-500" />
                  <span>Carlink</span>
                </div>
                <p className="text-center text-sm text-gray-500 md:text-left">© 2023 Carlink. All rights reserved.</p>
                <div className="flex gap-4">
                  <Link href="#" className="text-sm text-gray-500 hover:text-teal-500">
                    Terms
                  </Link>
                  <Link href="#" className="text-sm text-gray-500 hover:text-teal-500">
                    Privacy
                  </Link>
                  <Link href="#" className="text-sm text-gray-500 hover:text-teal-500">
                    Contact
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'