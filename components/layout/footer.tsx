import { Car } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t bg-white py-6">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Car className="h-5 w-5 text-teal-500" />
          <span>Carlink</span>
        </div>
        <p className="text-sm text-gray-500">© 2023 Carlink. All rights reserved.</p>
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
  )
} 