export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/90 to-primary-600/90"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-400/20 rounded-full -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full translate-y-40 -translate-x-40"></div>
      
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-12 xs:py-16 sm:py-20 lg:py-24 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-bold mb-6 xs:mb-8 leading-tight">
            Свежие продукты
            <span className="block text-secondary-200">с доставкой</span>
          </h1>
          <p className="text-base xs:text-lg sm:text-xl md:text-2xl mb-8 xs:mb-10 sm:mb-12 text-primary-100 leading-relaxed max-w-2xl">
            Заказывайте качественные продукты питания онлайн. 
            Быстрая доставка, свежие товары, доступные цены.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 xs:gap-6">
            <button className="btn-primary bg-white text-primary-600 hover:bg-neutral-50 hover:text-primary-700 text-base xs:text-lg px-6 xs:px-8 py-3 xs:py-4">
              Сделать заказ
            </button>
            <button className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-base xs:text-lg px-6 xs:px-8 py-3 xs:py-4">
              Узнать больше
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
