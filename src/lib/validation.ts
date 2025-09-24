import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Пароль обязателен')
})

export const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа')
})

export const productSchema = z.object({
  name: z.string().min(1, 'Название товара обязательно'),
  price: z.number().positive('Цена должна быть положительной'),
  description: z.string().min(1, 'Описание обязательно'),
  category: z.string().min(1, 'Категория обязательна'),
  weight: z.string().optional(),
  expirationDate: z.string().optional(),
  inStock: z.boolean().default(true)
})

export const cartItemSchema = z.object({
  productId: z.string().min(1, 'ID товара обязателен'),
  quantity: z.number().int().positive('Количество должно быть положительным числом')
})
