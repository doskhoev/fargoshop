import { Product } from '@/types'

export function serializeProduct(product: {
  id: string
  name: string
  price: { toString(): string } | number
  description: string
  category: string
  inStock: boolean
  weight: string | null
  expirationDate: Date | null
  image: string | null
}): Product {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    description: product.description,
    category: product.category,
    inStock: product.inStock,
    weight: product.weight ?? undefined,
    expirationDate: product.expirationDate?.toISOString(),
    image: product.image ?? undefined
  }
}

export function buildCartResponse(
  items: Array<{
    product: Parameters<typeof serializeProduct>[0]
    quantity: number
  }>
) {
  const serialized = items.map((item) => ({
    product: serializeProduct(item.product),
    quantity: item.quantity
  }))
  const total = serialized.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  return { items: serialized, total }
}
