"use client"

import { useState } from "react"
import Link from "next/link"
import { Car, Clock, DollarSign, Eye, Heart, Plus, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("my-vehicles")

  const myVehicles = [
    {
      id: 1,
      title: "2021 Tesla Model 3",
      image: "/placeholder.svg?height=400&width=600",
      description: "Electric • White • 15,000 miles",
      currentBid: 32500,
      bids: 12,
      endTime: "2 days",
      status: "active",
    },
    {
      id: 2,
      title: "2019 BMW X5",
      image: "/placeholder.svg?height=400&width=600",
      description: "SUV • Black • 28,500 miles",
      currentBid: 29800,
      bids: 8,
      endTime: "4 days",
      status: "active",
    },
    {
      id: 3,
      title: "2020 Audi A4",
      image: "/placeholder.svg?height=400&width=600",
      description: "Sedan • Silver • 22,000 miles",
      soldPrice: 27500,
      status: "sold",
    },
  ]

  const watchlist = [
    {
      id: 4,
      title: "2022 Mercedes-Benz GLC",
      image: "/placeholder.svg?height=400&width=600",
      description: "SUV • Blue • 8,000 miles",
      currentBid: 42500,
      bids: 15,
      endTime: "1 day",
      status: "active",
    },
    {
      id: 5,
      title: "2021 Porsche 911",
      image: "/placeholder.svg?height=400&width=600",
      description: "Coupe • Red • 5,500 miles",
      currentBid: 89500,
      bids: 22,
      endTime: "3 days",
      status: "active",
    },
  ]

  const myBids = [
    {
      id: 6,
      title: "2020 Lexus RX 350",
      image: "/placeholder.svg?height=400&width=600",
      description: "SUV • White • 18,000 miles",
      myBid: 36000,
      currentBid: 38500,
      bidStatus: "outbid",
      endTime: "2 days",
      status: "active",
    },
    {
      id: 7,
      title: "2022 Toyota Camry",
      image: "/placeholder.svg?height=400&width=600",
      description: "Sedan • Blue • 12,000 miles",
      myBid: 24500,
      currentBid: 24500,
      bidStatus: "highest",
      endTime: "5 days",
      status: "active",
    },
  ]

  return (
    <div className="container max-w-7xl py-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-gray-500">Manage your vehicles, bids, and watchlist</p>
            </div>
          </div>
          <Link href="/sell">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="my-vehicles" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="my-vehicles">My Vehicles</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="my-bids">My Bids</TabsTrigger>
          </TabsList>

          <TabsContent value="my-vehicles" className="space-y-6">
            {myVehicles.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 mb-4">
                    <Car className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Vehicles Listed</h3>
                  <p className="text-gray-500 mb-6">You haven't listed any vehicles for auction yet.</p>
                  <Link href="/sell">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Vehicle
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myVehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={vehicle.image || "/placeholder.svg"}
                        alt={vehicle.title}
                        className="object-cover w-full h-full"
                        width={600}
                        height={400}
                      />
                      {vehicle.status === "active" && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">Ends in {vehicle.endTime}</span>
                          </div>
                        </div>
                      )}
                      {vehicle.status === "sold" && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold">SOLD</div>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{vehicle.title}</h3>
                      <p className="text-sm text-gray-500">{vehicle.description}</p>
                      {vehicle.status === "active" && (
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-teal-600 font-medium">
                            <DollarSign className="h-4 w-4" />
                            <span>Current Bid: ${vehicle.currentBid.toLocaleString()}</span>
                          </div>
                          <div className="text-sm text-gray-500">{vehicle.bids} bids</div>
                        </div>
                      )}
                      {vehicle.status === "sold" && (
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-green-600 font-medium">
                            <DollarSign className="h-4 w-4" />
                            <span>Sold for: ${vehicle.soldPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/vehicles/${vehicle.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Settings</span>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-6">
            {watchlist.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 mb-4">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Watchlist Empty</h3>
                  <p className="text-gray-500 mb-6">You haven't added any vehicles to your watchlist yet.</p>
                  <Link href="/vehicles">
                    <Button>Browse Auctions</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {watchlist.map((vehicle) => (
                  <Card key={vehicle.id} className="overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={vehicle.image || "/placeholder.svg"}
                        alt={vehicle.title}
                        className="object-cover w-full h-full"
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
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{vehicle.title}</h3>
                      <p className="text-sm text-gray-500">{vehicle.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-teal-600 font-medium">
                          <DollarSign className="h-4 w-4" />
                          <span>Current Bid: ${vehicle.currentBid.toLocaleString()}</span>
                        </div>
                        <div className="text-sm text-gray-500">{vehicle.bids} bids</div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/vehicles/${vehicle.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500">
                        <Heart className="h-4 w-4 fill-current" />
                        <span className="sr-only">Remove from watchlist</span>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-bids" className="space-y-6">
            {myBids.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 mb-4">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Active Bids</h3>
                  <p className="text-gray-500 mb-6">You haven't placed any bids on vehicles yet.</p>
                  <Link href="/vehicles">
                    <Button>Browse Auctions</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myBids.map((vehicle) => (
                  <Card key={vehicle.id} className="overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={vehicle.image || "/placeholder.svg"}
                        alt={vehicle.title}
                        className="object-cover w-full h-full"
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
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{vehicle.title}</h3>
                      <p className="text-sm text-gray-500">{vehicle.description}</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 font-medium">
                            <DollarSign className="h-4 w-4" />
                            <span>Your Bid: ${vehicle.myBid.toLocaleString()}</span>
                          </div>
                          <div
                            className={`text-sm font-medium px-2 py-1 rounded-full ${
                              vehicle.bidStatus === "highest"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {vehicle.bidStatus === "highest" ? "Highest Bid" : "Outbid"}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-teal-600 font-medium">
                            <DollarSign className="h-4 w-4" />
                            <span>Current Bid: ${vehicle.currentBid.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/vehicles/${vehicle.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </Button>
                      {vehicle.bidStatus === "outbid" && (
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                          Place New Bid
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

