import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, StarHalf } from "lucide-react";

export interface Product {
  id: string | number;
  name: string;
  subtitle?: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  power?: string;
  voltage?: string;
  inStock: boolean;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      {/* Discount Badge */}
      {product.discount && (
        <div className="absolute top-4 right-4 z-10 bg-[#ff6a00] text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
          خصم {product.discount}%
        </div>
      )}

      {/* Out of Stock Badge */}
      {!product.inStock && (
        <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
          نفذت الكمية
        </div>
      )}

      {/* Image Container */}
      <Link href={`/product/${product.id}`} className="relative block h-24 sm:h-32 md:h-64 w-full bg-[#f9fafb] overflow-hidden p-2 md:p-6">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-1 md:p-4 transition-transform duration-500 ease-out group-hover:scale-110"
        />
        {/* Overlay for aesthetic */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>

      {/* Content */}
      <div className="p-2 md:p-5 flex flex-col flex-1 relative bg-white z-20">
        <div className="hidden md:flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? "fill-[#ffc107] text-[#ffc107]"
                  : i < product.rating
                  ? "fill-[#ffc107]/50 text-[#ffc107]"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 mr-1">({product.rating})</span>
        </div>

        <Link href={`/product/${product.id}`} className="block mb-1 md:mb-2">
          <h3 className="text-[10px] sm:text-sm md:text-lg font-bold text-brand-blue line-clamp-1 md:line-clamp-2 hover:text-[#ff6a00] transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>
        
        {product.subtitle && (
          <p className="hidden md:block text-sm text-gray-500 mb-3">{product.subtitle}</p>
        )}

        {/* Specs if available */}
        {(product.power || product.voltage) && (
          <div className="flex flex-wrap gap-2 mb-4 mt-auto">
            {product.power && (
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {product.power}
              </span>
            )}
            {product.voltage && (
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {product.voltage}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pb-8 md:pb-0">
          <div className="flex flex-col md:flex-row md:items-end gap-0 md:gap-2 mb-2 md:mb-4">
            <span className="text-[11px] sm:text-base md:text-2xl font-black text-brand-blue whitespace-nowrap">
              {product.price.toLocaleString("ar-EG")} <span className="text-[8px] md:text-sm font-normal text-gray-500">ج.م</span>
            </span>
            {product.oldPrice && (
              <span className="text-[9px] md:text-sm text-gray-400 line-through">
                {product.oldPrice.toLocaleString("ar-EG")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover CTA Button (Always visible on mobile) */}
      <div className="absolute left-0 right-0 bottom-0 p-1.5 md:p-5 translate-y-0 md:translate-y-full opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300 z-30 bg-gradient-to-t from-white via-white to-transparent pt-4 md:pt-12">
        <button 
          className="w-full flex items-center justify-center gap-1 bg-[#ff6a00] active:scale-95 hover:bg-[#e65c00] text-white py-1.5 md:py-3 rounded-md md:rounded-lg font-bold transition-colors shadow-lg shadow-[#ff6a00]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!product.inStock}
        >
          <ShoppingCart className="w-3 h-3 md:w-5 md:h-5" />
          <span className="text-[8px] md:text-base">{product.inStock ? "أضف" : "نفذ"}</span>
        </button>
      </div>
    </div>
  );
}
