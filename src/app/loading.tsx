export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-white">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary-grey/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary-yellow rounded-full animate-spin"></div>
        </div>
        <p className="text-primary-grey font-medium">Загрузка...</p>
      </div>
    </div>
  );
}
