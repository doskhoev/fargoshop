import { Product } from '@/types'

export const mockProducts: Product[] = [
  // Овощи
  {
    id: '1',
    name: 'Свежие помидоры',
    price: 150,
    image: '/images/tomatoes.jpg',
    description: 'Сочные красные помидоры, выращенные в теплице',
    category: 'Овощи',
    inStock: true,
    weight: '1 кг',
    expirationDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Огурцы тепличные',
    price: 120,
    image: '/images/cucumbers.jpg',
    description: 'Свежие хрустящие огурцы из теплицы',
    category: 'Овощи',
    inStock: true,
    weight: '1 кг',
    expirationDate: '2024-01-12'
  },
  {
    id: '3',
    name: 'Морковь',
    price: 80,
    image: '/images/carrots.jpg',
    description: 'Сладкая морковь, богатая витаминами',
    category: 'Овощи',
    inStock: true,
    weight: '1 кг',
    expirationDate: '2024-01-18'
  },
  {
    id: '4',
    name: 'Картофель молодой',
    price: 60,
    image: '/images/potatoes.jpg',
    description: 'Молодой картофель с тонкой кожурой',
    category: 'Овощи',
    inStock: true,
    weight: '2 кг',
    expirationDate: '2024-01-20'
  },
  {
    id: '5',
    name: 'Лук репчатый',
    price: 40,
    image: '/images/onions.jpg',
    description: 'Свежий репчатый лук',
    category: 'Овощи',
    inStock: true,
    weight: '1 кг',
    expirationDate: '2024-01-25'
  },
  {
    id: '6',
    name: 'Болгарский перец',
    price: 180,
    image: '/images/peppers.jpg',
    description: 'Сочный болгарский перец разных цветов',
    category: 'Овощи',
    inStock: false,
    weight: '1 кг',
    expirationDate: '2024-01-10'
  },

  // Фрукты
  {
    id: '7',
    name: 'Яблоки Гренни Смит',
    price: 120,
    image: '/images/apples.jpg',
    description: 'Хрустящие зеленые яблоки с кисло-сладким вкусом',
    category: 'Фрукты',
    inStock: true,
    weight: '1 кг',
    expirationDate: '2024-01-20'
  },
  {
    id: '8',
    name: 'Бананы',
    price: 90,
    image: '/images/bananas.jpg',
    description: 'Спелые сладкие бананы',
    category: 'Фрукты',
    inStock: true,
    weight: '1 кг',
    expirationDate: '2024-01-08'
  },
  {
    id: '9',
    name: 'Апельсины',
    price: 140,
    image: '/images/oranges.jpg',
    description: 'Сочные апельсины, богатые витамином C',
    category: 'Фрукты',
    inStock: true,
    weight: '1 кг',
    expirationDate: '2024-01-15'
  },
  {
    id: '10',
    name: 'Клубника',
    price: 250,
    image: '/images/strawberries.jpg',
    description: 'Свежая сладкая клубника',
    category: 'Фрукты',
    inStock: true,
    weight: '250 г',
    expirationDate: '2024-01-05'
  },
  {
    id: '11',
    name: 'Виноград зеленый',
    price: 200,
    image: '/images/grapes.jpg',
    description: 'Сладкий зеленый виноград без косточек',
    category: 'Фрукты',
    inStock: false,
    weight: '500 г',
    expirationDate: '2024-01-12'
  },

  // Молочные продукты
  {
    id: '12',
    name: 'Молоко 3.2%',
    price: 85,
    image: '/images/milk.jpg',
    description: 'Свежее коровье молоко высшего качества',
    category: 'Молочка',
    inStock: true,
    weight: '1 л',
    expirationDate: '2024-01-12'
  },
  {
    id: '13',
    name: 'Сыр Российский',
    price: 280,
    image: '/images/cheese.jpg',
    description: 'Твердый сыр российского производства',
    category: 'Молочка',
    inStock: true,
    weight: '200 г',
    expirationDate: '2024-01-25'
  },
  {
    id: '14',
    name: 'Творог 5%',
    price: 120,
    image: '/images/cottage_cheese.jpg',
    description: 'Нежный творог средней жирности',
    category: 'Молочка',
    inStock: true,
    weight: '250 г',
    expirationDate: '2024-01-10'
  },
  {
    id: '15',
    name: 'Йогурт натуральный',
    price: 65,
    image: '/images/yogurt.jpg',
    description: 'Натуральный йогурт без добавок',
    category: 'Молочка',
    inStock: true,
    weight: '150 г',
    expirationDate: '2024-01-08'
  },
  {
    id: '16',
    name: 'Сметана 20%',
    price: 95,
    image: '/images/sour_cream.jpg',
    description: 'Домашняя сметана высокой жирности',
    category: 'Молочка',
    inStock: true,
    weight: '200 г',
    expirationDate: '2024-01-14'
  },
  {
    id: '17',
    name: 'Кефир 2.5%',
    price: 55,
    image: '/images/kefir.jpg',
    description: 'Свежий кефир для здоровья кишечника',
    category: 'Молочка',
    inStock: false,
    weight: '500 мл',
    expirationDate: '2024-01-06'
  },

  // Хлебобулочные изделия
  {
    id: '18',
    name: 'Хлеб бородинский',
    price: 45,
    image: '/images/bread.jpg',
    description: 'Традиционный ржаной хлеб с кориандром',
    category: 'Хлеб',
    inStock: true,
    weight: '500 г',
    expirationDate: '2024-01-10'
  },
  {
    id: '19',
    name: 'Батон нарезной',
    price: 35,
    image: '/images/loaf.jpg',
    description: 'Мягкий белый хлеб для бутербродов',
    category: 'Хлеб',
    inStock: true,
    weight: '400 г',
    expirationDate: '2024-01-09'
  },
  {
    id: '20',
    name: 'Булочки с маком',
    price: 25,
    image: '/images/buns.jpg',
    description: 'Сладкие булочки с маковой начинкой',
    category: 'Хлеб',
    inStock: true,
    weight: '100 г',
    expirationDate: '2024-01-07'
  },
  {
    id: '21',
    name: 'Печенье овсяное',
    price: 80,
    image: '/images/cookies.jpg',
    description: 'Полезное печенье из овсяных хлопьев',
    category: 'Хлеб',
    inStock: true,
    weight: '200 г',
    expirationDate: '2024-01-20'
  },
  {
    id: '22',
    name: 'Круассаны',
    price: 120,
    image: '/images/croissants.jpg',
    description: 'Слоеные круассаны с маслом',
    category: 'Хлеб',
    inStock: false,
    weight: '150 г',
    expirationDate: '2024-01-05'
  },

  // Мясо и птица
  {
    id: '23',
    name: 'Куриная грудка',
    price: 320,
    image: '/images/chicken.jpg',
    description: 'Свежая куриная грудка без костей',
    category: 'Мясо',
    inStock: true,
    weight: '1 кг',
    expirationDate: '2024-01-08'
  },
  {
    id: '24',
    name: 'Говядина вырезка',
    price: 650,
    image: '/images/beef.jpg',
    description: 'Нежная и свежая говяжья вырезка премиум класса. Бери не пожалеешь!',
    category: 'Мясо',
    inStock: true,
    weight: '1 кг',
    expirationDate: '2024-01-06'
  },
  {
    id: '25',
    name: 'Свинина корейка',
    price: 450,
    image: '/images/pork.jpg',
    description: 'Сочная свиная корейка для жарки',
    category: 'Мясо',
    inStock: true,
    weight: '1 кг',
    expirationDate: '2024-01-07'
  },
  {
    id: '26',
    name: 'Куриные крылышки',
    price: 180,
    image: '/images/chicken_wings.jpg',
    description: 'Куриные крылышки для гриля',
    category: 'Мясо',
    inStock: true,
    weight: '500 г',
    expirationDate: '2024-01-09'
  },
  {
    id: '27',
    name: 'Фарш говяжий',
    price: 280,
    image: '/images/ground_beef.jpg',
    description: 'Свежий говяжий фарш для котлет',
    category: 'Мясо',
    inStock: false,
    weight: '500 г',
    expirationDate: '2024-01-05'
  },

  // Рыба и морепродукты
  {
    id: '28',
    name: 'Лосось свежий',
    price: 1200,
    image: '/images/salmon.jpg',
    description: 'Свежий лосось, нарезанный порциями',
    category: 'Рыба',
    inStock: true,
    weight: '1 кг',
    expirationDate: '2024-01-06'
  },
  {
    id: '29',
    name: 'Креветки замороженные',
    price: 450,
    image: '/images/shrimp.jpg',
    description: 'Крупные креветки в панцире',
    category: 'Рыба',
    inStock: true,
    weight: '500 г',
    expirationDate: '2024-01-20'
  },
  {
    id: '30',
    name: 'Треска филе',
    price: 380,
    image: '/images/cod.jpg',
    description: 'Филе трески без костей',
    category: 'Рыба',
    inStock: true,
    weight: '800 г',
    expirationDate: '2024-01-08'
  },

  // Крупы и макароны
  {
    id: '31',
    name: 'Рис длиннозерный',
    price: 120,
    image: '/images/rice.jpg',
    description: 'Качественный длиннозерный рис',
    category: 'Крупы',
    inStock: true,
    weight: '1 кг',
    expirationDate: '2024-12-31'
  },
  {
    id: '32',
    name: 'Гречка ядрица',
    price: 85,
    image: '/images/buckwheat.jpg',
    description: 'Отборная гречневая крупа',
    category: 'Крупы',
    inStock: true,
    weight: '800 г',
    expirationDate: '2024-12-31'
  },
  {
    id: '33',
    name: 'Макароны спагетти',
    price: 65,
    image: '/images/pasta.jpg',
    description: 'Итальянские макароны из твердых сортов пшеницы',
    category: 'Крупы',
    inStock: true,
    weight: '500 г',
    expirationDate: '2024-12-31'
  },

  // Напитки
  {
    id: '34',
    name: 'Сок апельсиновый',
    price: 95,
    image: '/images/orange_juice.jpg',
    description: '100% апельсиновый сок без сахара',
    category: 'Напитки',
    inStock: true,
    weight: '1 л',
    expirationDate: '2024-01-15'
  },
  {
    id: '35',
    name: 'Минеральная вода',
    price: 45,
    image: '/images/water.jpg',
    description: 'Природная минеральная вода',
    category: 'Напитки',
    inStock: true,
    weight: '1.5 л',
    expirationDate: '2024-12-31'
  },
  {
    id: '36',
    name: 'Чай черный листовой',
    price: 180,
    image: '/images/tea.jpg',
    description: 'Элитный черный чай в пакетиках',
    category: 'Напитки',
    inStock: true,
    weight: '100 г',
    expirationDate: '2025-01-01'
  }
]
