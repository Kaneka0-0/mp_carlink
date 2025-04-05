import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { Bell, Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Notification {
  id: string
  type: 'bid' | 'outbid' | 'auction_end' | 'reserve_met'
  message: string
  timestamp: Date
  read: boolean
  auctionId: string
}

interface AuctionNotificationsProps {
  notifications: Notification[]
  onMarkAsRead: (notificationId: string) => Promise<void>
  onClearAll: () => Promise<void>
}

export function AuctionNotifications({
  notifications,
  onMarkAsRead,
  onClearAll,
}: AuctionNotificationsProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length)
  }, [notifications])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await onMarkAsRead(notificationId)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read.',
        variant: 'destructive',
      })
    }
  }

  const handleClearAll = async () => {
    try {
      await onClearAll()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear notifications.',
        variant: 'destructive',
      })
    }
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'bid':
        return <Check className="h-4 w-4 text-green-500" />
      case 'outbid':
        return <X className="h-4 w-4 text-red-500" />
      case 'auction_end':
        return <Bell className="h-4 w-4 text-yellow-500" />
      case 'reserve_met':
        return <Check className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2 border-b">
          <span className="font-semibold">Auction Notifications</span>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-8"
            >
              Clear All
            </Button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No notifications
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-2 p-3 ${
                  !notification.read ? 'bg-gray-50' : ''
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 