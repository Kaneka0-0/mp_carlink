export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bids: string[]; // Array of vehicle IDs that user has bid on
  wonAuctions: string[]; // Array of vehicle IDs that user has won
}

export interface Bid {
  id: string;
  vehicleId: string;
  userId: string;
  amount: number;
  timestamp: Date;
}

export const mockUsers: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    bids: [],
    wonAuctions: [],
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
    bids: [],
    wonAuctions: [],
  },
  {
    id: "user3",
    name: "Mike Johnson",
    email: "mike@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    bids: [],
    wonAuctions: [],
  },
];

export const mockBids: Bid[] = []; 