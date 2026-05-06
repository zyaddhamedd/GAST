import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { normalizeImagePath } from "./utils";

/**
 * Data Access Layer (DAL)
 * Optimized for performance and Arabic character consistency (NFC).
 */

export const getCategories = cache(async () => {
  return unstable_cache(
    async () => {
      const categories = await prisma.category.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return categories.map((cat: any) => ({
        ...cat,
        slug: cat.slug.normalize('NFC'),
        image: normalizeImagePath(cat.image)
      }));
    },
    ['all-categories'],
    { revalidate: 3600, tags: ['categories'] }
  )();
});

export const getShopProducts = cache(async (params: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  power?: number[];
  voltage?: string[];
  page?: number;
  itemsPerPage?: number;
}) => {
  const { category, search, minPrice, maxPrice, power, voltage, page = 1, itemsPerPage = 8 } = params;
  
  // Create a stable cache key using ASCII-safe values
  const safeCategory = category ? encodeURIComponent(category.normalize('NFC')) : 'all';
  const cacheKey = `shop-p-${safeCategory}-s-${search || 'none'}-p-${page}`;

  return unstable_cache(
    async () => {
      const where: any = {};

      if (category && category !== "all") {
        // We use NFC as the primary standard for all lookups
        where.category = { slug: category.trim().normalize('NFC') };
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { subtitle: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {
          gte: minPrice ?? 0,
          lte: maxPrice ?? 1000000,
        };
      }

      if (power && power.length > 0) {
        where.power = { in: power };
      }

      if (voltage && voltage.length > 0) {
        where.voltage = { in: voltage };
      }

      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where,
          select: {
            id: true,
            name: true,
            slug: true,
            subtitle: true,
            price: true,
            oldPrice: true,
            discount: true,
            power: true,
            voltage: true,
            inStock: true,
            category: { select: { name: true } },
            images: { select: { url: true }, take: 1 },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * itemsPerPage,
          take: itemsPerPage,
        }),
        prisma.product.count({ where }),
      ]);

      const mappedProducts = products.map((p: any) => ({
        ...p,
        rating: (p.id % 2 === 0) ? 5 : 4.5,
        image: p.images?.[0]?.url ? normalizeImagePath(p.images[0].url) : "/placeholder.webp",
        category: p.category?.name || "عام",
      }));

      return { products: mappedProducts, totalCount };
    },
    [cacheKey],
    { revalidate: 300, tags: ['products'] }
  )();
});

export const getProductBySlug = cache(async (slug: string) => {
  const normalizedSlug = decodeURIComponent(slug).trim().normalize('NFC');
  const safeCacheKey = `product-slug-${encodeURIComponent(normalizedSlug)}`;

  return unstable_cache(
    async () => {
      const product = await prisma.product.findFirst({
        where: { slug: normalizedSlug },
        include: {
          category: { select: { name: true } },
          images: { select: { url: true } },
        },
      });

      if (!product) return null;

      return {
        ...product,
        rating: (product.id % 2 === 0) ? 5 : 4.5,
        image: product.images?.[0]?.url ? normalizeImagePath(product.images[0].url) : "/placeholder.webp",
        images: product.images.map((img: any) => normalizeImagePath(img.url)),
        categoryName: product.category?.name
      };
    },
    [safeCacheKey],
    { revalidate: 60, tags: [safeCacheKey] }
  )();
});

export const getProductById = cache(async (id: number) => {
  return unstable_cache(
    async () => {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: { select: { name: true } },
          images: { select: { url: true } },
        },
      });

      if (!product) return null;

      return {
        ...product,
        rating: (product.id % 2 === 0) ? 5 : 4.5,
        image: product.images?.[0]?.url ? normalizeImagePath(product.images[0].url) : "/placeholder.webp",
        images: product.images.map((img: any) => normalizeImagePath(img.url))
      };
    },
    [`product-id-${id}`],
    { revalidate: 600, tags: [`product-id-${id}`] }
  )();
});
