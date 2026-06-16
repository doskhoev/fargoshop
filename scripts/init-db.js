const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Инициализация базы данных...')

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

  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@fargoshop.ru' },
    update: {
      phone: '+79991234567',
      address: 'г. Москва, ул. Примерная, д. 1, кв. 10',
    },
    create: {
      email: 'user@fargoshop.ru',
      password: userPassword,
      name: 'Пользователь',
      role: 'USER',
      phone: '+79991234567',
      address: 'г. Москва, ул. Примерная, д. 1, кв. 10',
    },
  })

  const pickerPassword = await bcrypt.hash('picker123', 12)
  const picker = await prisma.user.upsert({
    where: { email: 'picker@fargoshop.ru' },
    update: {},
    create: {
      email: 'picker@fargoshop.ru',
      password: pickerPassword,
      name: 'Сборщик',
      role: 'PICKER',
    },
  })

  const courierPassword = await bcrypt.hash('courier123', 12)
  const courier = await prisma.user.upsert({
    where: { email: 'courier@fargoshop.ru' },
    update: {},
    create: {
      email: 'courier@fargoshop.ru',
      password: courierPassword,
      name: 'Курьер',
      role: 'COURIER',
    },
  })

  console.log('✅ Пользователи созданы:')
  console.log(`👤 Админ: ${admin.email} / admin123`)
  console.log(`👤 Пользователь: ${user.email} / user123`)
  console.log(`📦 Сборщик: ${picker.email} / picker123`)
  console.log(`🚚 Курьер: ${courier.email} / courier123`)

  const products = [
    {
      name: 'Молоко "Домик в деревне" 3.2%',
      price: 89.5,
      description: 'Свежее пастеризованное молоко высшего качества',
      category: 'Молочка',
      weight: '1 л',
      inStock: true,
    },
    {
      name: 'Хлеб "Бородинский"',
      price: 45.0,
      description: 'Традиционный ржаной хлеб с кориандром',
      category: 'Хлеб',
      weight: '500 г',
      inStock: true,
    },
    {
      name: 'Яблоки "Голден"',
      price: 120.0,
      description: 'Сладкие яблоки сорта Голден',
      category: 'Фрукты',
      weight: '1 кг',
      inStock: true,
    },
    {
      name: 'Куриная грудка',
      price: 280.0,
      description: 'Свежая куриная грудка без костей',
      category: 'Мясо',
      weight: '1 кг',
      inStock: true,
    },
    {
      name: 'Картофель молодой',
      price: 60.0,
      description: 'Молодой картофель нового урожая',
      category: 'Овощи',
      weight: '1 кг',
      inStock: true,
    },
  ]

  const existingProducts = await prisma.product.count()
  let productList = await prisma.product.findMany()

  if (existingProducts === 0) {
    for (const product of products) {
      await prisma.product.create({ data: product })
    }
    productList = await prisma.product.findMany()
    console.log('✅ Тестовые продукты созданы')
  } else {
    console.log('✅ Продукты уже существуют')
  }

  const existingOrders = await prisma.order.count()
  if (existingOrders === 0 && productList.length >= 2) {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const orderNumber = `FS-${dateStr}-0001`
    const total = Number(productList[0].price) * 2 + Number(productList[1].price)

    await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        phone: user.phone,
        address: user.address,
        status: 'CONFIRMED',
        paymentMethod: 'CASH_ON_DELIVERY',
        paymentStatus: 'NOT_REQUIRED',
        total,
        items: {
          create: [
            {
              productId: productList[0].id,
              quantity: 2,
              price: productList[0].price,
            },
            {
              productId: productList[1].id,
              quantity: 1,
              price: productList[1].price,
            },
          ],
        },
      },
    })
    console.log('✅ Тестовый заказ создан')
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
