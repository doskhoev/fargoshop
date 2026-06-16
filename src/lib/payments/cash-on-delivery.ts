import { PaymentProvider, PaymentResult } from './types'

export const cashOnDeliveryProvider: PaymentProvider = {
  method: 'CASH_ON_DELIVERY',

  async processOrder(): Promise<PaymentResult> {
    return {
      success: true,
      paymentStatus: 'NOT_REQUIRED',
      orderStatus: 'CONFIRMED'
    }
  }
}
