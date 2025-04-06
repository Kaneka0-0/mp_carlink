export interface Vehicle {
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
  status: "active" | "sold" | "cancelled" | "outbid";
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
  title: string;
  image: string;
  bidStatus: "highest" | "outbid";
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bids: string[];
  wonAuctions: string[];
}

export interface Bid {
  id: string;
  vehicleId: string;
  userId: string;
  amount: number;
  timestamp: Date;
} 