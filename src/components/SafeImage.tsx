'use client';

import Image, { ImageLoaderProps } from 'next/image';
import { useState, useEffect } from 'react';

type Props = React.ComponentProps<typeof Image> & {
  fallbackSrc?: string;
  aspectRatio?: string;
};

// Professional Cloudinary Loader: Offloads optimization to Cloudinary CDN
// This prevents Next.js from using server RAM to process images.
const cloudinaryLoader = ({ src, width, quality }: ImageLoaderProps) => {
  if (!src.includes('res.cloudinary.com')) return src;
  
  // Split URL to inject transformations after '/upload/'
  const parts = src.split('/upload/');
  if (parts.length !== 2) return src;

  const params = [
    `w_${width}`,
    'c_limit',
    `q_${quality || 'auto'}`,
    'f_auto'
  ].join(',');

  return `${parts[0]}/upload/${params}/${parts[1]}`;
};

export default function SafeImage({ 
  src, 
  alt = 'Image',
  fallbackSrc = '/placeholder.webp', 
  onError, 
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
  loading,
  priority = false,
  ...props 
}: Props) {
  const [imgSrc, setImgSrc] = useState(src);

  // Sync state with src prop change
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const isCloudinary = typeof imgSrc === 'string' && imgSrc.includes('res.cloudinary.com');
  const isLegacyUpload = typeof imgSrc === 'string' && (imgSrc.startsWith('/uploads/') || imgSrc.startsWith('/api/media/'));

  return (
    <Image
      {...props}
      loader={isCloudinary ? cloudinaryLoader : undefined}
      src={imgSrc || fallbackSrc}
      alt={alt}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : (loading || 'lazy')}
      unoptimized={isLegacyUpload || props.unoptimized}
      className={`${className} transition-opacity duration-300`}
      onError={(e) => {
        console.error('Image load error:', imgSrc);
        setImgSrc(fallbackSrc);
        if (onError) onError(e);
      }}
    />
  );
}

