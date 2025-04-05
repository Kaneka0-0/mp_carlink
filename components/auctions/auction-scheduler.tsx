import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import { useState } from 'react'

interface AuctionSchedulerProps {
  vehicleId: string
  onSchedule: (data: {
    startTime: Date
    endTime: Date
    reservePrice: number
  }) => Promise<void>
}

export function AuctionScheduler({ vehicleId, onSchedule }: AuctionSchedulerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [startTime, setStartTime] = useState<Date>()
  const [endTime, setEndTime] = useState<Date>()
  const [reservePrice, setReservePrice] = useState<number>(0)
  const { toast } = useToast()

  const handleSchedule = async () => {
    if (!startTime || !endTime || !reservePrice) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      })
      return
    }

    if (endTime <= startTime) {
      toast({
        title: 'Invalid Time Range',
        description: 'End time must be after start time.',
        variant: 'destructive',
      })
      return
    }

    try {
      await onSchedule({
        startTime,
        endTime,
        reservePrice,
      })
      toast({
        title: 'Auction Scheduled',
        description: 'The auction has been successfully scheduled.',
      })
      setIsOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to schedule auction. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Schedule Auction</Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Auction</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    {startTime ? format(startTime, 'PPP p') : 'Select start time'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startTime}
                    onSelect={setStartTime}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    {endTime ? format(endTime, 'PPP p') : 'Select end time'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endTime}
                    onSelect={setEndTime}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservePrice">Reserve Price</Label>
              <Input
                id="reservePrice"
                type="number"
                value={reservePrice}
                onChange={(e) => setReservePrice(Number(e.target.value))}
                min={0}
                step={100}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSchedule}>Schedule Auction</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 