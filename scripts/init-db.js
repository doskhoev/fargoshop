const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Инициализация базы данных...')

  // Создаем админа
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fargoshop.ru' },
    update: {},
    create: {
      email: 'admin@fargoshop.ru',
      password: adminPassword,
      name: 'Администратор',
      role: 'ADMIN',
    },
  })

  // Создаем обычного пользователя
  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@fargoshop.ru' },
    update: {},
    create: {
      email: 'user@fargoshop.ru',
      password: userPassword,
      name: 'Пользователь',
      role: 'USER',
    },
  })

  console.log('✅ Пользователи созданы:')
  console.log(`👤 Админ: ${admin.email}`)
  console.log(`👤 Пользователь: ${user.email}`)

  // Создаем тестовые продукты
  const products = [
    {
      name: 'Молоко "Домик в деревне" 3.2%',
      price: 89.50,
      description: 'Свежее пастеризованное молоко высшего качества',
      category: 'Молочка',
      weight: '1 л',
      inStock: true,
    },
    {
      name: 'Хлеб "Бородинский"',
      price: 45.00,
      description: 'Традиционный ржаной хлеб с кориандром',
      category: 'Хлеб',
      weight: '500 г',
      inStock: true,
    },
    {
      name: 'Яблоки "Голден"',
      price: 120.00,
      description: 'Сладкие яблоки сорта Голден',
      category: 'Фрукты',
      weight: '1 кг',
      inStock: true,
    },
    {
      name: 'Куриная грудка',
      price: 280.00,
      description: 'Свежая куриная грудка без костей',
      category: 'Мясо',
      weight: '1 кг',
      inStock: true,
    },
    {
      name: 'Картофель молодой',
      price: 60.00,
      description: 'Молодой картофель нового урожая',
      category: 'Овощи',
      weight: '1 кг',
      inStock: true,
    },
  ]

  // Проверяем, есть ли уже продукты
  const existingProducts = await prisma.product.count()
  if (existingProducts === 0) {
    for (const product of products) {
      await prisma.product.create({
        data: product,
      })
    }
    console.log('✅ Тестовые продукты созданы')
  } else {
    console.log('✅ Продукты уже существуют')
  }

  console.log('🎉 Инициализация завершена!')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
