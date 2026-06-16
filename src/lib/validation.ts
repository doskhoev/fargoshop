import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Пароль обязателен')
})

export const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().min(10, 'Телефон должен содержать минимум 10 символов'),
  address: z.string().min(5, 'Адрес должен содержать минимум 5 символов').optional().or(z.literal(''))
})

export const addCartItemSchema = z.object({
  productId: z.string().min(1, 'ID товара обязателен'),
  quantity: z.number().int().positive().default(1)
})

export const updateCartItemSchema = z.object({
  productId: z.string().min(1, 'ID товара обязателен'),
  quantity: z.number().int().min(0, 'Количество не может быть отрицательным')
})

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа').optional(),
  email: z.string().email('Некорректный email').optional(),
  phone: z.string().min(10, 'Телефон должен содержать минимум 10 символов').optional(),
  address: z.string().min(5, 'Адрес должен содержать минимум 5 символов').optional().or(z.literal('')),
  currentPassword: z.string().min(1).optional()
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Текущий пароль обязателен'),
  newPassword: z.string().min(6, 'Новый пароль должен содержать минимум 6 символов')
})

export const productSchema = z.object({
  name: z.string().min(1, 'Название товара обязательно'),
  price: z.number().positive('Цена должна быть положительной'),
  description: z.string().min(1, 'Описание обязательно'),
  category: z.string().min(1, 'Категория обязательна'),
  weight: z.string().optional(),
  expirationDate: z.string().optional(),
  inStock: z.boolean().default(true),
  image: z.string().optional()
})

export const cartItemSchema = z.object({
  productId: z.string().min(1, 'ID товара обязателен'),
  quantity: z.number().int().positive('Количество должно быть положительным числом')
})

export const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'Корзина не может быть пустой'),
  phone: z.string().min(10, 'Телефон обязателен'),
  address: z.string().min(5, 'Адрес доставки обязателен'),
  paymentMethod: z.enum(['CASH_ON_DELIVERY', 'YUKASSA']).default('CASH_ON_DELIVERY'),
  guestName: z.string().min(2).optional()
})

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'ASSEMBLING',
    'READY_FOR_DELIVERY',
    'IN_DELIVERY',
    'DELIVERED',
    'CANCELLED'
  ])
})

export const createStaffUserSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  role: z.enum(['PICKER', 'COURIER'])
})
