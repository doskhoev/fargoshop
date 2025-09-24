import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CartProvider from '@/components/CartProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FargoShop - Интернет-магазин продуктов',
  description: 'Свежие продукты с доставкой на дом',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <CartProvider>
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  )
}