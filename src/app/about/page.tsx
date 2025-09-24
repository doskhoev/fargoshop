'use client'

import Header from '@/components/Header'
import { useState } from 'react'

export default function About() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div>
      <Header onSearch={handleSearch} />
      
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-8 xs:py-10 sm:py-12">
        {/* Заголовок */}
        <div className="text-center mb-12 xs:mb-16 sm:mb-20">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6 xs:mb-8">
            О нас
          </h1>
          <p className="text-lg xs:text-xl sm:text-2xl text-secondary max-w-3xl mx-auto leading-relaxed">
            Мы — команда энтузиастов, которая верит в то, что качественные продукты 
            должны быть доступны каждому
          </p>
        </div>

        {/* Основной контент */}
        <div className="max-w-4xl mx-auto space-y-8 xs:space-y-12 sm:space-y-16 lg:space-y-20">
          
          {/* Наша миссия */}
          <section className="card p-4 xs:p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 xs:gap-4 sm:gap-6 mb-4 xs:mb-6 sm:mb-8">
              <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl xs:text-2xl sm:text-3xl">🎯</span>
              </div>
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                Наша миссия
              </h2>
            </div>
            <p className="text-sm xs:text-base sm:text-lg text-secondary leading-relaxed">
              Мы стремимся сделать покупку продуктов максимально удобной и доступной. 
              Наша цель — обеспечить каждого клиента свежими, качественными продуктами 
              с быстрой доставкой прямо к двери.
            </p>
          </section>

          {/* Наши ценности */}
          <section className="card p-4 xs:p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 xs:gap-4 sm:gap-6 mb-4 xs:mb-6 sm:mb-8">
              <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 bg-secondary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl xs:text-2xl sm:text-3xl">💎</span>
              </div>
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                Наши ценности
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-6 sm:gap-8">
              <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 xs:gap-3">
                  <span className="text-lg xs:text-xl">⭐</span>
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold text-primary">Качество</h3>
                </div>
                <p className="text-sm xs:text-base text-secondary leading-relaxed">
                  Мы тщательно отбираем поставщиков и проверяем каждый продукт 
                  перед тем, как он попадет к вам.
                </p>
              </div>
              <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 xs:gap-3">
                  <span className="text-lg xs:text-xl">🌿</span>
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold text-primary">Свежесть</h3>
                </div>
                <p className="text-sm xs:text-base text-secondary leading-relaxed">
                  Все продукты хранятся в оптимальных условиях и доставляются 
                  в кратчайшие сроки.
                </p>
              </div>
              <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 xs:gap-3">
                  <span className="text-lg xs:text-xl">🎯</span>
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold text-primary">Удобство</h3>
                </div>
                <p className="text-sm xs:text-base text-secondary leading-relaxed">
                  Простой заказ, быстрая доставка и возможность оплаты курьеру 
                  — все для вашего комфорта.
                </p>
              </div>
              <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 xs:gap-3">
                  <span className="text-lg xs:text-xl">💰</span>
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold text-primary">Доступность</h3>
                </div>
                <p className="text-sm xs:text-base text-secondary leading-relaxed">
                  Честные цены без наценок, регулярные скидки и акции 
                  для наших постоянных клиентов.
                </p>
              </div>
            </div>
          </section>

          {/* Наша команда */}
          <section className="card p-4 xs:p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 xs:gap-4 sm:gap-6 mb-4 xs:mb-6 sm:mb-8">
              <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl xs:text-2xl sm:text-3xl">👥</span>
              </div>
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                Наша команда
              </h2>
            </div>
            <p className="text-sm xs:text-base sm:text-lg text-secondary leading-relaxed mb-6 xs:mb-8">
              За FargoShop стоит команда профессионалов, которые каждый день работают 
              над тем, чтобы сделать ваши покупки лучше.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mx-auto mb-3 xs:mb-4 flex items-center justify-center">
                  <span className="text-xl xs:text-2xl sm:text-3xl">👨‍💼</span>
                </div>
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-primary mb-1 xs:mb-2">Менеджеры</h3>
                <p className="text-xs xs:text-sm sm:text-base text-secondary">
                  Следят за качеством и ассортиментом
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full mx-auto mb-3 xs:mb-4 flex items-center justify-center">
                  <span className="text-xl xs:text-2xl sm:text-3xl">🚚</span>
                </div>
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-primary mb-1 xs:mb-2">Курьеры</h3>
                <p className="text-xs xs:text-sm sm:text-base text-secondary">
                  Обеспечивают быструю доставку
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full mx-auto mb-3 xs:mb-4 flex items-center justify-center">
                  <span className="text-xl xs:text-2xl sm:text-3xl">💬</span>
                </div>
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-primary mb-1 xs:mb-2">Поддержка</h3>
                <p className="text-xs xs:text-sm sm:text-base text-secondary">
                  Помогают с любыми вопросами
                </p>
              </div>
            </div>
          </section>

          {/* Контакты */}
          <section className="card p-4 xs:p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 xs:gap-4 sm:gap-6 mb-4 xs:mb-6 sm:mb-8">
              <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 bg-secondary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl xs:text-2xl sm:text-3xl">📞</span>
              </div>
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                Свяжитесь с нами
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-6 sm:gap-8">
              <div className="space-y-3 xs:space-y-4">
                <div className="flex items-center gap-2 xs:gap-3">
                  <span className="text-lg xs:text-xl sm:text-2xl">📧</span>
                  <div>
                    <p className="text-sm xs:text-base font-semibold text-primary">Email</p>
                    <p className="text-xs xs:text-sm text-secondary">info@fargoshop.ru</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 xs:gap-3">
                  <span className="text-lg xs:text-xl sm:text-2xl">📱</span>
                  <div>
                    <p className="text-sm xs:text-base font-semibold text-primary">Телефон</p>
                    <p className="text-xs xs:text-sm text-secondary">+7 (999) 123-45-67</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 xs:gap-3">
                  <span className="text-lg xs:text-xl sm:text-2xl">⏰</span>
                  <div>
                    <p className="text-sm xs:text-base font-semibold text-primary">Время работы</p>
                    <p className="text-xs xs:text-sm text-secondary">Пн-Вс: 8:00 - 22:00</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 xs:space-y-4">
                <div className="flex items-center gap-2 xs:gap-3">
                  <span className="text-lg xs:text-xl sm:text-2xl">📍</span>
                  <div>
                    <p className="text-sm xs:text-base font-semibold text-primary">Адрес</p>
                    <p className="text-xs xs:text-sm text-secondary">г. Москва, ул. Примерная, 123</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 xs:gap-3">
                  <span className="text-lg xs:text-xl sm:text-2xl">🚚</span>
                  <div>
                    <p className="text-sm xs:text-base font-semibold text-primary">Доставка</p>
                    <p className="text-xs xs:text-sm text-secondary">По всей Москве и области</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
