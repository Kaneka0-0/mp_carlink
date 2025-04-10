import Link from "next/link"
import { ArrowRight, Car, Clock, DollarSign } from "lucide-react"
import displaypic from "@/public/displaypic/head.jpg"


import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* The header is now managed in the root layout.tsx file */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-black to-black">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                    Find Your Dream Car at Auction
                  </h1>
                  <p className="max-w-[600px] text-gray-300 md:text-xl">
                    Discover, bid, and win your next vehicle on our transparent auction platform. Sell your car with
                    ease and get the best market value.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/vehicles">
                    <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
                      Browse Auctions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/sell">
                    <Button size="lg" variant="outline">
                      Sell Your Vehicle
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center w-full h-full">
                <img
                  src={displaypic.src}
                  alt="Car auction display"
                  className="rounded-lg object-cover w-full h-full"
                  width={1000}
                  height={600}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Auctions</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Check out these hot vehicles currently up for auction
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <Link href={`/vehicles/${i}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View</span>
                  </Link>
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=400&width=600`}
                      alt="Car"
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      width={600}
                      height={400}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Ends in 2 days</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">2021 Tesla Model 3</h3>
                    <p className="text-sm text-gray-500">Electric • White • 15,000 miles</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-teal-600 font-medium">
                        <DollarSign className="h-4 w-4" />
                        <span>Current Bid: $32,500</span>
                      </div>
                      <div className="text-sm text-gray-500">12 bids</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Link href="/vehicles">
                <Button variant="outline" size="lg">
                  View All Auctions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our auction platform makes buying and selling vehicles simple
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                  <Car className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">List Your Vehicle</h3>
                <p className="text-gray-500">Create a detailed listing with photos and set your starting price</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600">
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
                    className="h-8 w-8"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Receive Bids</h3>
                <p className="text-gray-500">Watch as buyers place competitive bids on your vehicle</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                  <DollarSign className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Complete the Sale</h3>
                <p className="text-gray-500">Finalize the transaction with the highest bidder securely</p>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="/sell">
                <Button className="bg-teal-600 hover:bg-teal-700" size="lg">
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      {/* <footer className="w-full border-t bg-white py-6">
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
      </footer> */}
    </div>
  )
}

