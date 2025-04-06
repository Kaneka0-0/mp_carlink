"use client";

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  ArrowLeft,
  DollarSign,
  Heart,
  Info,
  MapPin,
  User
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

import AuctionCountdown from "@/components/auctions/auctionCountdown";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Bid, mockUsers } from "@/lib/mockData";
import { BiddingService } from "@/lib/services/biddingService";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  color: string;
  mileage: number;
  description: string;
  images: string[];
  startingPrice: number;
  reservePrice?: number;
  status: "active" | "sold" | "cancelled";
  createdAt: Date;
  sellerId: string;
  location?: string;
  currentBid?: number;
  bids?: number;
  endTime?: string;
  seller?: {
    username: string;
    rating: number;
    memberSince: string;
  };
  price: number;
}

export default function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [currentImage, setCurrentImage] = useState(0);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isWatched, setIsWatched] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(mockUsers[0]);
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);
  const biddingService = BiddingService.getInstance();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const docRef = doc(db, "vehicles", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const vehicleData: Vehicle = {
            id: docSnap.id,
            brand: data.brand,
            model: data.model,
            year: data.year,
            type: data.type,
            color: data.color,
            mileage: data.mileage,
            description: data.description,
            images: data.images,
            startingPrice: data.startingPrice,
            reservePrice: data.reservePrice,
            status: data.status,
            createdAt: data.createdAt?.toDate() || new Date(),
            sellerId: data.sellerId,
            location: data.location,
            currentBid: data.currentBid || data.startingPrice,
            bids: data.bids || 0,
            endTime: data.endTime ? new Date(data.endTime).toISOString() : undefined,
            seller: data.seller,
            price: data.currentBid || data.startingPrice,
          };
          setVehicle(vehicleData);
        } else {
          toast({
            title: "Error",
            description: "Vehicle not found",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching vehicle:", error);
        toast({
          title: "Error",
          description: "Failed to load vehicle details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  useEffect(() => {
    if (vehicle) {
      setBidHistory(biddingService.getBidHistory(vehicle.id));
    }
  }, [vehicle]);

  const placeBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;

    setIsBidding(true);

    // Validate bid amount
    const minBid =
      (vehicle.currentBid || vehicle.startingPrice) +
      (vehicle.reservePrice ? vehicle.reservePrice * 0.05 : 500);
    const bidValue = Number(bidAmount);

    if (bidValue < minBid) {
      toast({
        title: "Invalid Bid",
        description: `Your bid must be at least $${minBid.toLocaleString()}`,
        variant: "destructive",
      });
      setIsBidding(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsBidding(false);
      setBidSuccess(true);
      setBidAmount("");

      // Update local state to reflect new bid
      setVehicle((prev) =>
        prev
          ? {
              ...prev,
              currentBid: bidValue,
              bids: (prev.bids || 0) + 1,
            }
          : null
      );

      // Reset success message after a few seconds
      setTimeout(() => {
        setBidSuccess(false);
      }, 5000);
    }, 1500);
  };

  const toggleWatchlist = () => {
    setIsWatched(!isWatched);
    toast({
      title: isWatched ? "Removed from Watchlist" : "Added to Watchlist",
      description: isWatched
        ? "This vehicle has been removed from your watchlist"
        : "This vehicle has been added to your watchlist",
    });
  };

  const handlePlaceBid = () => {
    if (!vehicle || !currentUser) return;
    
    const amount = Number(bidAmount);
    if (isNaN(amount)) return;
    
    const success = biddingService.placeBid(vehicle.id, currentUser.id, amount);
    if (success) {
      setBidHistory(biddingService.getBidHistory(vehicle.id));
      // Update vehicle price
      setVehicle(prev => prev ? { ...prev, currentBid: amount } : null);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-7xl py-10">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container max-w-7xl py-10">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Vehicle Not Found</h2>
          <p className="text-gray-500 mb-6">
            The vehicle you're looking for doesn't exist or may have been
            removed.
          </p>
          <Link href="/vehicles">
            <Button>Browse Vehicles</Button>
          </Link>
        </div>
      </div>
    );
  }

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
                alt={`${vehicle.brand} ${vehicle.model}`}
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
                    src={image}
                    alt={`${vehicle.brand} ${vehicle.model} - Image ${
                      index + 1
                    }`}
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

              <TabsContent
                value="details"
                className="p-4 border rounded-md mt-2"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Brand</p>
                    <p>{vehicle.brand}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Model</p>
                    <p>{vehicle.model}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Year</p>
                    <p>{vehicle.year}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p>{vehicle.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Color</p>
                    <p>{vehicle.color}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Mileage</p>
                    <p>{vehicle.mileage.toLocaleString()} miles</p>
                  </div>
                  {vehicle.location && (
                    <div className="space-y-1 col-span-2">
                      <p className="text-sm font-medium text-gray-500">
                        Location
                      </p>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <p>{vehicle.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent
                value="description"
                className="p-4 border rounded-md mt-2"
              >
                <p className="text-gray-700 whitespace-pre-line">
                  {vehicle.description}
                </p>
              </TabsContent>

              <TabsContent
                value="seller"
                className="p-4 border rounded-md mt-2"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {vehicle.seller?.username || "Unknown Seller"}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(vehicle.seller?.rating || 0)
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
                        {vehicle.seller?.rating || 0} • Member since{" "}
                        {vehicle.seller?.memberSince || "N/A"}
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
              <CardTitle>{`${vehicle.brand} ${vehicle.model}`}</CardTitle>
              <CardDescription>
                {`${vehicle.year} • ${vehicle.type} • ${vehicle.color}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Current Bid</p>
                  <p className="text-2xl font-bold">
                    ${(vehicle.currentBid || vehicle.startingPrice).toLocaleString()}
                  </p>
                  {vehicle.reservePrice && (
                    <p className="text-sm text-gray-500">
                      Reserve: ${vehicle.reservePrice.toLocaleString()}
                    </p>
                  )}
                </div>
                <Button
                  variant={isWatched ? "default" : "outline"}
                  size="sm"
                  onClick={toggleWatchlist}
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      isWatched ? "fill-current" : ""
                    }`}
                  />
                  {isWatched ? "Watching" : "Watch"}
                </Button>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Auction Ends In</p>
                {vehicle.endTime ? (
                  <div className="text-2xl font-bold text-teal-600">
                   <AuctionCountdown endDate={vehicle.endTime} />
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-400">No end time set</p>
                  
                )}
              </div>

              <Separator />

              <form onSubmit={placeBid}>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="bid-amount"
                        className="text-sm font-medium"
                      >
                        Your Bid (USD)
                      </label>
                      <div className="text-xs text-gray-500">
                        Min. Bid: $
                        {(
                          (vehicle.currentBid || vehicle.startingPrice) + 500
                        ).toLocaleString()}
                      </div>
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        id="bid-amount"
                        type="number"
                        min={
                          (vehicle.currentBid || vehicle.startingPrice) + 500
                        }
                        step="500"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="pl-9"
                        placeholder="Enter your bid amount"
                        required
                      />
                    </div>
                  </div>

                  {bidSuccess && (
                    <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
                      Your bid has been placed successfully!
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    disabled={isBidding}
                  >
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
                <p>
                  By placing a bid, you agree to the auction terms and
                  conditions.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={toggleWatchlist}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isWatched ? "fill-red-500 text-red-500" : ""
                  }`}
                />
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
                {bidHistory.map((bid) => {
                  const bidder = mockUsers.find(u => u.id === bid.userId);
                  return (
                    <div key={bid.id} className="flex items-center justify-between p-4 border rounded">
                      <div className="flex items-center gap-4">
                        <img
                          src={bidder?.avatar}
                          alt={bidder?.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-semibold">{bidder?.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(bid.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-bold">${bid.amount.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

