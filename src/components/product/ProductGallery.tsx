"use client";

import { useState, useRef } from "react";
import SafeImage from "@/components/SafeImage";
import { CheckCircle2 } from "lucide-react";
import { normalizeImagePath } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  discount?: number;
  inStock: boolean;
}

export function ProductGallery({ images, productName, discount, inStock }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<{
    display: string;
    backgroundPosition: string;
    backgroundImage?: string;
  }>({ display: "none", backgroundPosition: "0% 0%" });

  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${normalizeImagePath(images[activeImageIndex])})`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none", backgroundPosition: "0% 0%" });
  };

  return (
    <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-24 shrink-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImageIndex(idx)}
            className={`relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
              activeImageIndex === idx
                ? "border-[#ff6a00] shadow-md ring-2 ring-[#ff6a00]/20"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <SafeImage 
              src={normalizeImagePath(img)} 
              alt={`${productName} thumbnail ${idx}`} 
              fill 
              className="object-contain p-2 bg-[#f9fafb]" 
            />
          </button>
        ))}
      </div>

      {/* Main Image with Zoom */}
      <div
        className="relative w-full aspect-square bg-[#f9fafb] rounded-2xl overflow-hidden border border-gray-100 group cursor-crosshair"
        ref={imageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {discount && (
          <div className="absolute top-4 right-4 z-10 bg-[#ff6a00] text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
            خصم {discount}%
          </div>
        )}
        {inStock && (
          <div className="absolute top-4 left-4 z-10 bg-green-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> متوفر
          </div>
        )}

        <SafeImage
          src={normalizeImagePath(images[activeImageIndex])}
          alt={productName}
          fill
          className="object-contain p-8 transition-opacity duration-300"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
        />

        {/* Zoom Overlay */}
        <div
          className="absolute inset-0 bg-no-repeat bg-white transition-opacity duration-200 pointer-events-none"
          style={{
            ...zoomStyle,
            backgroundSize: "250%",
            opacity: zoomStyle.display === "block" ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
}
