import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'

interface PaymentIntegrationProps {
  auctionId: string
  amount: number
  onPaymentComplete: (paymentId: string) => Promise<void>
}

export function PaymentIntegration({
  auctionId,
  amount,
  onPaymentComplete,
}: PaymentIntegrationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()

  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast({
        title: 'Error',
        description: 'Payment system is not ready. Please try again.',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      })

      if (error) {
        toast({
          title: 'Payment Failed',
          description: error.message,
          variant: 'destructive',
        })
        return
      }

      // Here you would typically send the paymentMethod.id to your backend
      // to complete the payment process
      await onPaymentComplete(paymentMethod.id)
      
      toast({
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully.',
      })
      setIsOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Complete Payment</Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Amount to Pay</Label>
              <p className="text-2xl font-bold">${amount.toLocaleString()}</p>
            </div>

            <div className="space-y-2">
              <Label>Card Details</Label>
              <div className="p-3 border rounded-md">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 