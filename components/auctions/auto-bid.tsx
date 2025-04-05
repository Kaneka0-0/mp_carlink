import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'

interface AutoBidProps {
  currentBid: number
  maxBid: number
  onSetAutoBid: (maxBid: number) => Promise<void>
}

export function AutoBid({ currentBid, maxBid: initialMaxBid, onSetAutoBid }: AutoBidProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [maxBid, setMaxBid] = useState(initialMaxBid)
  const { toast } = useToast()

  const handleSetAutoBid = async () => {
    if (maxBid <= currentBid) {
      toast({
        title: 'Invalid Max Bid',
        description: 'Your maximum bid must be higher than the current bid.',
        variant: 'destructive',
      })
      return
    }

    try {
      await onSetAutoBid(maxBid)
      toast({
        title: 'Auto-Bid Set',
        description: 'Your auto-bid has been successfully configured.',
      })
      setIsOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to set auto-bid. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Set Auto-Bid
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Auto-Bid</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxBid">Maximum Bid Amount</Label>
              <Input
                id="maxBid"
                type="number"
                value={maxBid}
                onChange={(e) => setMaxBid(Number(e.target.value))}
                min={currentBid + 100}
                step={100}
              />
              <p className="text-sm text-gray-500">
                The system will automatically bid on your behalf up to this amount.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Current Bid</Label>
              <p className="text-lg font-semibold">${currentBid.toLocaleString()}</p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSetAutoBid}>Set Auto-Bid</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 