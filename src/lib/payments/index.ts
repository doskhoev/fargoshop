import { PaymentMethod } from '@prisma/client'
import { PaymentProvider } from './types'
import { cashOnDeliveryProvider } from './cash-on-delivery'
import { yukassaProvider } from './yukassa'

const providers: Record<PaymentMethod, PaymentProvider> = {
  CASH_ON_DELIVERY: cashOnDeliveryProvider,
  YUKASSA: yukassaProvider
}

export function getPaymentProvider(method: PaymentMethod): PaymentProvider {
  return providers[method]
}
