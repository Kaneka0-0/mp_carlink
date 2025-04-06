"use client";

import { AuctionListing } from "@/components/auctions/auction-listing";

import { AuctionNotifications } from "@/components/auctions/auction-notifications";
import { AuctionScheduler } from "@/components/auctions/auction-scheduler";
import { AutoBid } from "@/components/auctions/auto-bid";
// import { PaymentIntegration } from "@/components/auctions/payment-integration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - replace with actual data fetching
const mockAuctions = [
  {
    id: "1",
    vehicle: {
      make: "Toyota",
      model: "Camry",
      year: 2022,
      image: "/images/camry.jpg",
    },
    currentBid: 25000,
    reservePrice: 30000,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    bids: [
      {
        amount: 25000,
        bidder: "John Doe",
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
    ],
  },
  {
    id: "2",
    vehicle: {
      make: "Honda",
      model: "Civic",
      year: 2021,
      image: "/images/civic.jpg",
    },
    currentBid: 20000,
    reservePrice: 25000,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    bids: [
      {
        amount: 20000,
        bidder: "Jane Smith",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
    ],
  },
];

const mockNotifications: Array<{
  id: string;
  type: "bid" | "outbid" | "auction_end" | "reserve_met";
  message: string;
  timestamp: Date;
  read: boolean;
  auctionId: string;
}> = [
  {
    id: "1",
    type: "outbid",
    message: "You have been outbid on Toyota Camry 2022",
    timestamp: new Date(),
    read: false,
    auctionId: "1",
  },
];

export default function AuctionsPage() {
  const handleBid = async (auctionId: string, amount: number) => {
    // Implement bid logic
    console.log(`Bidding ${amount} on auction ${auctionId}`);
  };

  const handleSchedule = async (data: {
    startTime: Date;
    endTime: Date;
    reservePrice: number;
  }) => {
    // Implement scheduling logic
    console.log("Scheduling auction:", data);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    // Implement mark as read logic
    console.log("Marking notification as read:", notificationId);
  };

  const handleClearAll = async () => {
    // Implement clear all notifications logic
    console.log("Clearing all notifications");
  };

  const handlePayment = async (paymentId: string) => {
    // Implement payment logic
    console.log("Processing payment:", paymentId);
  };

  const handleSetAutoBid = async (maxBid: number) => {
    // Implement auto-bid logic
    console.log("Setting auto-bid to:", maxBid);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Auctions</h1>
        <div className="flex items-center gap-4">
          <AuctionNotifications
            notifications={mockNotifications}
            onMarkAsRead={handleMarkAsRead}
            onClearAll={handleClearAll}
          />
          <AuctionScheduler vehicleId="1" onSchedule={handleSchedule} />
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Auctions</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Auctions</TabsTrigger>
          <TabsTrigger value="completed">Completed Auctions</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {mockAuctions.map((auction) => (
            <AuctionListing
              key={auction.id}
              {...auction}
              onBid={(amount) => handleBid(auction.id, amount)}
            />
          ))}
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Auctions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No upcoming auctions</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Auctions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No completed auctions</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Example of using AutoBid and PaymentIntegration components */}
      <div className="mt-8 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Auto-Bid Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <AutoBid
              currentBid={25000}
              maxBid={30000}
              onSetAutoBid={handleSetAutoBid}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <PaymentIntegration
              auctionId="1"
              amount={25000}
              onPaymentComplete={handlePayment}
            /> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
