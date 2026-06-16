import { PaymentMethod, PaymentStatus } from '@/types'

export interface PaymentResult {
  success: boolean
  paymentStatus: PaymentStatus
  orderStatus?: string
  redirectUrl?: string
  error?: string
}

export interface PaymentProvider {
  method: PaymentMethod
  processOrder(): Promise<PaymentResult>
  handleWebhook?(payload: unknown): Promise<PaymentResult>
}
