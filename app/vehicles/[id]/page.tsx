"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, DollarSign, Heart, Info, MapPin, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [bidAmount, setBidAmount] = useState("")
  const [isWatched, setIsWatched] = useState(false)
  const [isBidding, setIsBidding] = useState(false)
  const [bidSuccess, setBidSuccess] = useState(false)

  // In a real app, this would be fetched from an API
  const vehicle = {
    id: params.id,
    title: "2021 Tesla Model 3 Long Range",
    description:
      "This Tesla Model 3 Long Range is in excellent condition with only 15,000 miles. It features Autopilot, premium sound system, and a glass roof. The car has been well-maintained and comes with a clean history report.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    details: {
      brand: "Tesla",
      model: "Model 3",
      year: 2021,
      type: "Electric",
      color: "White",
      mileage: 15000,
      location: "San Francisco, CA",
    },
    auction: {
      currentBid: 32500,
      bids: 12,
      endTime: "2023-12-31T23:59:59",
      minIncrement: 500,
      seller: {
        name: "John Smith",
        rating: 4.9,
        memberSince: "2018",
      },
    },
  }

  const placeBid = (e: React.FormEvent) => {
    e.preventDefault()
    setIsBidding(true)

    // Simulate API call
    setTimeout(() => {
      setIsBidding(false)
      setBidSuccess(true)

      // Reset success message after a few seconds
      setTimeout(() => {
        setBidSuccess(false)
      }, 5000)
    }, 1500)
  }

  const toggleWatchlist = () => {
    setIsWatched(!isWatched)
  }

  // Calculate time remaining
  const endDate = new Date(vehicle.auction.endTime)
  const now = new Date()
  const timeRemaining = endDate.getTime() - now.getTime()
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

  return (
    <div className="container max-w-7xl py-10">
      <div className="mb-8">
        <Link
          href="/vehicles"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vehicles
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="relative aspect-video overflow-hidden rounded-lg border">
              <img
                src={vehicle.images[currentImage] || "/placeholder.svg"}
                alt={vehicle.title}
                className="object-cover w-full h-full"
                width={800}
                height={600}
              />
            </div>

            <div className="flex overflow-auto gap-2 pb-2">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative aspect-video w-24 min-w-[6rem] overflow-hidden rounded-md border ${
                    currentImage === index ? "ring-2 ring-teal-500" : ""
                  }`}
                  onClick={() => setCurrentImage(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${vehicle.title} - Image ${index + 1}`}
                    className="object-cover w-full h-full"
                    width={200}
                    height={150}
                  />
                </button>
              ))}
            </div>

            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="seller">Seller</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="p-4 border rounded-md mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Brand</p>
                    <p>{vehicle.details.brand}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Model</p>
                    <p>{vehicle.details.model}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Year</p>
                    <p>{vehicle.details.year}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p>{vehicle.details.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Color</p>
                    <p>{vehicle.details.color}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Mileage</p>
                    <p>{vehicle.details.mileage.toLocaleString()} miles</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p>{vehicle.details.location}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="description" className="p-4 border rounded-md mt-2">
                <p className="text-gray-700 whitespace-pre-line">{vehicle.description}</p>
              </TabsContent>

              <TabsContent value="seller" className="p-4 border rounded-md mt-2">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{vehicle.auction.seller.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(vehicle.auction.seller.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300 fill-current"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">
                        {vehicle.auction.seller.rating} • Member since {vehicle.auction.seller.memberSince}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{vehicle.title}</CardTitle>
              <CardDescription>
                {vehicle.details.brand} • {vehicle.details.model} • {vehicle.details.year}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-500">Current Bid</p>
                    <p className="text-xl font-bold">${vehicle.auction.currentBid.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-500">Time Left</p>
                    <p className="font-medium">
                      {days}d {hours}h {minutes}m
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{vehicle.auction.bids} bids</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Ends {endDate.toLocaleDateString()}</span>
                </div>
              </div>

              <Separator />

              <form onSubmit={placeBid}>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="bid-amount" className="text-sm font-medium">
                        Your Bid (USD)
                      </label>
                      <div className="text-xs text-gray-500">Min. Increment: ${vehicle.auction.minIncrement}</div>
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        id="bid-amount"
                        type="number"
                        className="pl-8"
                        placeholder={`${vehicle.auction.currentBid + vehicle.auction.minIncrement}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={vehicle.auction.currentBid + vehicle.auction.minIncrement}
                        step={vehicle.auction.minIncrement}
                        required
                      />
                    </div>
                  </div>

                  {bidSuccess && (
                    <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
                      Your bid has been placed successfully!
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isBidding}>
                    {isBidding ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Place Bid"
                    )}
                  </Button>
                </div>
              </form>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Info className="h-4 w-4" />
                <p>By placing a bid, you agree to the auction terms and conditions.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full flex items-center gap-2" onClick={toggleWatchlist}>
                <Heart className={`h-4 w-4 ${isWatched ? "fill-red-500 text-red-500" : ""}`} />
                {isWatched ? "Remove from Watchlist" : "Add to Watchlist"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bid History</CardTitle>
              <CardDescription>Recent bids on this vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: "u***r", amount: 32500, date: "2 days ago" },
                  { user: "j***n", amount: 32000, date: "2 days ago" },
                  { user: "s***h", amount: 31500, date: "3 days ago" },
                  { user: "m***e", amount: 31000, date: "3 days ago" },
                  { user: "t***y", amount: 30500, date: "4 days ago" },
                ].map((bid, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{bid.user}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">${bid.amount.toLocaleString()}</span>
                      <span className="text-gray-500">{bid.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

