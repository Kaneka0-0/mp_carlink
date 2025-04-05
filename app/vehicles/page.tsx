// This file is part of the Vehicle Auction App project
//vehicle/page.tsx

"use client"

import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Car, Clock, DollarSign, Filter, Heart, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"

export default function VehiclesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [yearRange, setYearRange] = useState([2010, 2023])
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    const fetchVehicles = async () => {
      const querySnapshot = await getDocs(collection(db, "vehicles"))
      const vehicleData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setVehicles(vehicleData)
    }

    fetchVehicles()
  }, [])

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
                    src={vehicle.images?.[0] || "/placeholder.svg"}
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
                      <span>Current Bid: ${vehicle.currentBid?.toLocaleString()}</span>
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



