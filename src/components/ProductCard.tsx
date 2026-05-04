import SafeImage from "./SafeImage";
import Link from "next/link";
import { Star } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";
import { normalizeImagePath } from "@/lib/utils";

export interface Product {
  id: string | number;
  name: string;
  slug: string;
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
  // Ensure rating is at least 0 for the star logic
  const rating = product.rating || 0;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_20px_40px_-15px_rgba(11,17,48,0.12)] transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full">
      {/* Badges Overlay */}
      <div className="absolute top-3 right-3 left-3 z-20 flex justify-between items-start pointer-events-none">
        {/* Discount Badge - Glassmorphism style */}
        {product.discount ? (
          <div className="bg-orange-500/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border border-white/20 uppercase tracking-tighter">
            -{product.discount}%
          </div>
        ) : <div />}

        {/* Out of Stock Badge */}
        {!product.inStock && (
          <div className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border border-white/20 uppercase tracking-tighter">
            نفذت الكمية
          </div>
        )}
      </div>

      {/* Image Container */}
      <Link 
        href={`/product/${product.slug}`} 
        className="relative block h-40 sm:h-48 md:h-72 w-full bg-gradient-to-br from-[#f8f9fa] to-white overflow-hidden p-4 md:p-8"
      >
        <SafeImage
          src={normalizeImagePath(product.image)}
          alt={product.name}
          fill
          className="object-contain p-2 md:p-6 transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          priority={false}
        />
        
        {/* Glossy overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </Link>

      {/* Content */}
      <div className="p-4 md:p-6 flex flex-col flex-1 relative z-20 bg-white">
        {/* Rating - "Lit up" logic */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < Math.floor(rating)
                    ? "fill-[#FFC107] text-[#FFC107] drop-shadow-[0_0_8px_rgba(255,193,7,0.5)]"
                    : i < rating
                    ? "fill-[#FFC107]/50 text-[#FFC107]"
                    : "fill-gray-100 text-gray-200"
                } transition-all duration-500 group-hover:scale-110`}
                style={{ transitionDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-gray-400 mt-0.5 tracking-tighter">
            ({rating.toFixed(1)})
          </span>
        </div>

        <Link href={`/product/${product.slug}`} className="block mb-2 group/title">
          <h3 className="text-sm md:text-lg font-bold text-[#0b1130] line-clamp-2 transition-colors duration-300 group-hover/title:text-orange-500 leading-[1.3]">
            {product.name}
          </h3>
        </Link>
        
        {product.subtitle && (
          <p className="hidden md:block text-xs text-gray-400 mb-4 line-clamp-1 font-medium">{product.subtitle}</p>
        )}

        {/* Specs Badges */}
        {(product.power || product.voltage) && (
          <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
            {product.power && (
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-brand-blue/5 text-brand-blue/60 px-2 py-1 rounded-lg border border-brand-blue/5">
                {product.power}
              </span>
            )}
            {product.voltage && (
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-orange-500/5 text-orange-600/60 px-2 py-1 rounded-lg border border-orange-500/5">
                {product.voltage}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto">
          <div className="flex flex-wrap items-baseline gap-2 mb-1">
            <span className="text-lg md:text-2xl font-black text-[#0b1130] tracking-tighter">
              {product.price.toLocaleString("ar-EG")}
              <span className="text-[10px] md:text-xs font-bold text-gray-400 mr-1.5">ج.م</span>
            </span>
            {product.oldPrice && (
              <span className="text-xs md:text-sm text-gray-300 line-through decoration-red-500/30">
                {product.oldPrice.toLocaleString("ar-EG")}
              </span>
            )}
          </div>
          
          {/* Availability Hint */}
          <p className={`text-[9px] font-bold uppercase tracking-widest ${product.inStock ? 'text-green-500/70' : 'text-red-500/70'}`}>
            {product.inStock ? '• متوفر بالمخزن' : '• غير متوفر'}
          </p>
        </div>
      </div>

      {/* Premium CTA Button */}
      <div className="px-4 pb-6 md:px-6 md:pb-6 mt-2 opacity-100 md:opacity-0 md:translate-y-4 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500">
        <AddToCartButton product={product} />
      </div>

      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute -inset-[100%] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>
    </div>
  );
}
