import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-primary-white">
      <div className="container-custom section-padding text-center">
        <h1 className="text-8xl lg:text-9xl font-bold text-primary-yellow mb-4">
          404
        </h1>
        <h2 className="text-2xl lg:text-4xl font-semibold text-primary-black mb-4">
          Страница не найдена
        </h2>
        <p className="text-primary-grey text-lg mb-8 max-w-md mx-auto">
          К сожалению, запрашиваемая страница не существует или была перемещена.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            На главную
          </Link>
          <Link href="/#contacts" className="btn-secondary">
            Связаться с нами
          </Link>
        </div>
      </div>
    </main>
  );
}
