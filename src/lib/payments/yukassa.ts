import { PaymentProvider, PaymentResult } from './types'

export const yukassaProvider: PaymentProvider = {
  method: 'YUKASSA',

  async processOrder(): Promise<PaymentResult> {
    // TODO: integrate YooKassa SDK when credentials are configured
    // Requires YUKASSA_SHOP_ID and YUKASSA_SECRET_KEY env vars
    return {
      success: false,
      paymentStatus: 'PENDING',
      error: 'ЮKassa пока не подключена'
    }
  },

  async handleWebhook(_payload: unknown): Promise<PaymentResult> {
    return {
      success: false,
      paymentStatus: 'FAILED',
      error: 'Webhook handler not implemented'
    }
  }
}
