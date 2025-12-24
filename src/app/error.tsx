"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-primary-white">
      <div className="container-custom section-padding text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl lg:text-4xl font-semibold text-primary-black mb-4">
          Произошла ошибка
        </h1>
        <p className="text-primary-grey text-lg mb-8 max-w-md mx-auto">
          Что-то пошло не так. Пожалуйста, попробуйте ещё раз или свяжитесь с нами.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset} className="btn-primary">
            Попробовать снова
          </button>
          <Link href="/" className="btn-secondary">
            На главную
          </Link>
        </div>
      </div>
    </main>
  );
}
