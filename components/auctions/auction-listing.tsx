import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { formatTimeRemaining } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface AuctionListingProps {
  id: string
  vehicle: {
    make: string
    model: string
    year: number
    image: string
  }
  currentBid: number
  reservePrice: number
  endTime: Date
  bids: Array<{
    amount: number
    bidder: string
    timestamp: Date
  }>
  onBid: (amount: number) => Promise<void>
}

export function AuctionListing({
  id,
  vehicle,
  currentBid,
  reservePrice,
  endTime,
  bids,
  onBid,
}: AuctionListingProps) {
  const [bidAmount, setBidAmount] = useState(currentBid + 100)
  const [timeRemaining, setTimeRemaining] = useState(formatTimeRemaining(endTime))
  const [isEnded, setIsEnded] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = formatTimeRemaining(endTime)
      setTimeRemaining(remaining)
      
      if (remaining === 'Auction ended') {
        setIsEnded(true)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  const handleBid = async () => {
    if (bidAmount <= currentBid) {
      toast({
        title: 'Invalid Bid',
        description: 'Your bid must be higher than the current bid.',
        variant: 'destructive',
      })
      return
    }

    try {
      await onBid(bidAmount)
      toast({
        title: 'Bid Placed',
        description: 'Your bid has been successfully placed.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to place bid. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </CardTitle>
            <div className="mt-2">
              <Badge variant={isEnded ? "destructive" : "default"}>
                {timeRemaining}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${currentBid.toLocaleString()}</div>
            <div className="text-sm text-gray-500">
              Reserve: ${reservePrice.toLocaleString()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={vehicle.image}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bid-amount">Your Bid</Label>
              <div className="flex gap-2">
                <Input
                  id="bid-amount"
                  type="number"
                  min={currentBid + 100}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  disabled={isEnded}
                />
                <Button onClick={handleBid} disabled={isEnded}>
                  Place Bid
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Bid History</h3>
              <div className="space-y-2">
                {bids.map((bid, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{bid.bidder}</span>
                    <span>${bid.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 