export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 h-[320px] md:h-[450px]">
          <div className="h-24 sm:h-32 md:h-64 bg-gray-50" />
          <div className="p-2 md:p-5 space-y-3">
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-6 bg-gray-100 rounded w-3/4" />
            <div className="mt-auto pt-4">
              <div className="h-8 bg-gray-100 rounded w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RelatedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 h-[320px] md:h-[400px]">
          <div className="h-24 sm:h-32 md:h-56 bg-gray-50" />
          <div className="p-2 md:p-4 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-6 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminTableSkeleton() {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="h-10 bg-white/5 rounded-xl border border-white/5 flex items-center px-6 gap-4">
         <div className="w-1/4 h-3 bg-white/5 rounded-full" />
         <div className="w-1/4 h-3 bg-white/5 rounded-full" />
         <div className="w-1/4 h-3 bg-white/5 rounded-full" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 bg-white/5 rounded-2xl border border-white/5 flex items-center px-6 gap-4 relative overflow-hidden">
          <div className="w-12 h-12 bg-white/5 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="w-1/3 h-3 bg-white/5 rounded-full" />
            <div className="w-1/4 h-2 bg-white/5 rounded-full opacity-50" />
          </div>
          <div className="w-24 h-4 bg-white/5 rounded-full" />
          <div className="w-20 h-8 bg-white/5 rounded-xl" />
          {/* Shimmer Effect */}
          <div className="absolute inset-0 shimmer pointer-events-none" />
        </div>
      ))}
    </div>
  );
}

export function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-[240px] md:h-[320px] bg-gray-50 rounded-xl" />
      ))}
    </div>
  );
}
