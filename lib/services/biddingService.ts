import { Bid, User, mockBids, mockUsers } from "../mockData";
import { Vehicle } from "../types";

export class BiddingService {
  private static instance: BiddingService;
  private bids: Bid[] = mockBids;
  private users: User[] = mockUsers;

  private constructor() {}

  public static getInstance(): BiddingService {
    if (!BiddingService.instance) {
      BiddingService.instance = new BiddingService();
    }
    return BiddingService.instance;
  }

  public placeBid(vehicleId: string, userId: string, amount: number): boolean {
    const vehicle = this.getVehicleById(vehicleId);
    if (!vehicle) return false;

    const currentBid = this.getHighestBid(vehicleId);
    if (currentBid && amount <= currentBid.amount) return false;

    const newBid: Bid = {
      id: `bid_${Date.now()}`,
      vehicleId,
      userId,
      amount,
      timestamp: new Date(),
    };

    this.bids.push(newBid);

    // Update user's bids
    const user = this.users.find(u => u.id === userId);
    if (user && !user.bids.includes(vehicleId)) {
      user.bids.push(vehicleId);
    }

    // Check if bid is winning bid (2000 higher than starting price)
    if (amount >= vehicle.startingPrice + 2000) {
      this.markAuctionAsWon(vehicleId, userId);
    }

    return true;
  }

  public getHighestBid(vehicleId: string): Bid | null {
    const vehicleBids = this.bids.filter(bid => bid.vehicleId === vehicleId);
    return vehicleBids.length > 0
      ? vehicleBids.reduce((prev, current) => (prev.amount > current.amount ? prev : current))
      : null;
  }

  public getBidHistory(vehicleId: string): Bid[] {
    return this.bids
      .filter(bid => bid.vehicleId === vehicleId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getUserBids(userId: string): Bid[] {
    return this.bids
      .filter(bid => bid.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getUserWonAuctions(userId: string): string[] {
    const user = this.users.find(u => u.id === userId);
    return user ? user.wonAuctions : [];
  }

  private getVehicleById(vehicleId: string): Vehicle | null {
    // This would typically fetch from your database
    // For now, we'll return null as this is a mock implementation
    return null;
  }

  private markAuctionAsWon(vehicleId: string, userId: string): void {
    const user = this.users.find(u => u.id === userId);
    if (user && !user.wonAuctions.includes(vehicleId)) {
      user.wonAuctions.push(vehicleId);
    }
  }
} 