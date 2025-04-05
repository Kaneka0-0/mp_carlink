"use client"

import { useState } from "react"
import Link from "next/link"
import { Car, Clock, DollarSign, Filter, Heart, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function VehiclesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [yearRange, setYearRange] = useState([2010, 2023])

  const vehicles = [
    {
      id: 1,
      title: "2021 Tesla Model 3",
      image: "/placeholder.svg?height=400&width=600",
      description: "Electric • White • 15,000 miles",
      currentBid: 32500,
      bids: 12,
      endTime: "2 days",
      isWatched: true,
    },
    {
      id: 2,
      title: "2019 BMW X5",
      image: "/placeholder.svg?height=400&width=600",
      description: "SUV • Black • 28,500 miles",
      currentBid: 29800,
      bids: 8,
      endTime: "4 days",
      isWatched: false,
    },
    {
      id: 3,
      title: "2020 Audi A4",
      image: "/placeholder.svg?height=400&width=600",
      description: "Sedan • Silver • 22,000 miles",
      currentBid: 27500,
      bids: 5,
      endTime: "3 days",
      isWatched: false,
    },
    {
      id: 4,
      title: "2022 Mercedes-Benz GLC",
      image: "/placeholder.svg?height=400&width=600",
      description: "SUV • Blue • 8,000 miles",
      currentBid: 42500,
      bids: 15,
      endTime: "1 day",
      isWatched: true,
    },
    {
      id: 5,
      title: "2021 Porsche 911",
      image: "/placeholder.svg?height=400&width=600",
      description: "Coupe • Red • 5,500 miles",
      currentBid: 89500,
      bids: 22,
      endTime: "3 days",
      isWatched: false,
    },
    {
      id: 6,
      title: "2020 Lexus RX 350",
      image: "/placeholder.svg?height=400&width=600",
      description: "SUV • White • 18,000 miles",
      currentBid: 38500,
      bids: 10,
      endTime: "2 days",
      isWatched: false,
    },
    {
      id: 7,
      title: "2022 Toyota Camry",
      image: "/placeholder.svg?height=400&width=600",
      description: "Sedan • Blue • 12,000 miles",
      currentBid: 24500,
      bids: 7,
      endTime: "5 days",
      isWatched: false,
    },
    {
      id: 8,
      title: "2021 Honda Accord",
      image: "/placeholder.svg?height=400&width=600",
      description: "Sedan • Black • 20,000 miles",
      currentBid: 23000,
      bids: 6,
      endTime: "4 days",
      isWatched: false,
    },
    {
      id: 9,
      title: "2020 Ford Mustang",
      image: "/placeholder.svg?height=400&width=600",
      description: "Coupe • Yellow • 15,000 miles",
      currentBid: 35000,
      bids: 14,
      endTime: "2 days",
      isWatched: false,
    },
  ]

  const toggleWatchlist = (id: number) => {
    // In a real app, this would update the state and make an API call
    console.log(`Toggle watchlist for vehicle ${id}`)
  }

  return (
    <div className="container max-w-7xl py-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Vehicle Auctions</h1>
              <p className="text-gray-500">Browse and bid on vehicles currently up for auction</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search vehicles..." className="w-full pl-8" />
          </div>

          <div className="flex items-center gap-2">
            <Select defaultValue="ending-soon">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest Listings</SelectItem>
                <SelectItem value="most-bids">Most Bids</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Filter Vehicles</SheetTitle>
                  <SheetDescription>Refine your search with the following filters</SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Select>
                      <SelectTrigger id="brand">
                        <SelectValue placeholder="All Brands" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        <SelectItem value="audi">Audi</SelectItem>
                        <SelectItem value="bmw">BMW</SelectItem>
                        <SelectItem value="ford">Ford</SelectItem>
                        <SelectItem value="honda">Honda</SelectItem>
                        <SelectItem value="mercedes">Mercedes</SelectItem>
                        <SelectItem value="tesla">Tesla</SelectItem>
                        <SelectItem value="toyota">Toyota</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Vehicle Type</Label>
                    <Select>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="sedan">Sedan</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="coupe">Coupe</SelectItem>
                        <SelectItem value="hatchback">Hatchback</SelectItem>
                        <SelectItem value="convertible">Convertible</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Price Range</Label>
                      <div className="text-sm text-gray-500">
                        ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                      </div>
                    </div>
                    <Slider
                      defaultValue={priceRange}
                      max={100000}
                      step={1000}
                      onValueChange={(value) => setPriceRange(value as number[])}
                      className="py-4"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Year Range</Label>
                      <div className="text-sm text-gray-500">
                        {yearRange[0]} - {yearRange[1]}
                      </div>
                    </div>
                    <Slider
                      defaultValue={yearRange}
                      min={2000}
                      max={2023}
                      step={1}
                      onValueChange={(value) => setYearRange(value as number[])}
                      className="py-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Select>
                      <SelectTrigger id="color">
                        <SelectValue placeholder="All Colors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Colors</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="gray">Gray</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline">Reset Filters</Button>
                    <Button className="bg-teal-600 hover:bg-teal-700">Apply Filters</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden group">
              <Link href={`/vehicles/${vehicle.id}`} className="block">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={vehicle.image || "/placeholder.svg"}
                    alt={vehicle.title}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    width={600}
                    height={400}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Ends in {vehicle.endTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
              <CardContent className="p-4">
                <Link href={`/vehicles/${vehicle.id}`} className="block">
                  <h3 className="font-semibold text-lg group-hover:text-teal-600 transition-colors">{vehicle.title}</h3>
                  <p className="text-sm text-gray-500">{vehicle.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-teal-600 font-medium">
                      <DollarSign className="h-4 w-4" />
                      <span>Current Bid: ${vehicle.currentBid.toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-gray-500">{vehicle.bids} bids</div>
                  </div>
                </Link>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                  asChild
                >
                  <Link href={`/vehicles/${vehicle.id}`}>Place Bid</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={vehicle.isWatched ? "text-red-500" : "text-gray-500"}
                  onClick={() => toggleWatchlist(vehicle.id)}
                >
                  <Heart className={`h-4 w-4 ${vehicle.isWatched ? "fill-current" : ""}`} />
                  <span className="sr-only">{vehicle.isWatched ? "Remove from watchlist" : "Add to watchlist"}</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

