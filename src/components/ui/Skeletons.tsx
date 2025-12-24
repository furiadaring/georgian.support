export default function SectionSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="container-custom section-padding py-10 lg:py-24">
        <div className="flex flex-col gap-8">
          {/* Title skeleton */}
          <div className="h-8 lg:h-12 bg-gray-200 rounded-lg w-2/3 mx-auto"></div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse bg-gray-100 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="animate-pulse min-h-screen bg-gray-100">
      <div className="container-custom section-padding pt-32 pb-16">
        <div className="max-w-2xl">
          <div className="h-12 lg:h-16 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
          <div className="h-12 lg:h-16 bg-gray-200 rounded-lg w-1/2 mb-8"></div>
          <div className="space-y-2 mb-8">
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-12 bg-gray-200 rounded-full w-32"></div>
            <div className="h-12 bg-gray-200 rounded-full w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
