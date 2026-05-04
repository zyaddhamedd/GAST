import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { normalizeImagePath } from "./utils";

/**
 * Data Access Layer (DAL)
 */

export async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return categories.map((cat: any) => ({
    ...cat,
    image: normalizeImagePath(cat.image)
  }));
}

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
  const cacheKey = `shop-products-${JSON.stringify(params)}`;

  return unstable_cache(
    async () => {
      const { prisma } = await import("./prisma");
      const { category, search, minPrice, maxPrice, power, voltage, page = 1, itemsPerPage = 8 } = params;
      const where: any = {};

      if (category && category !== "all") {
        where.category = { slug: category };
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
            images: {
              select: { url: true },
              take: 1,
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * itemsPerPage,
          take: itemsPerPage,
        }),
        prisma.product.count({ where }),
      ]);

      const mappedProducts = products.map((p: any) => ({
        ...p,
        rating: (p.id % 2 === 0) ? 5 : 4.5, // Mock rating for UI aesthetics
        image: p.images?.[0]?.url ? normalizeImagePath(p.images[0].url) : "/placeholder.webp",
        images: p.images.map((img: any) => ({
          ...img,
          url: normalizeImagePath(img.url)
        }))
      }));

      return { products: mappedProducts, totalCount };
    },
    [cacheKey],
    { revalidate: 300, tags: ['products'] }
  )();
});

export const getProductBySlug = cache(async (slug: string) => {
  return unstable_cache(
    async () => {
      const product = await prisma.product.findUnique({
        where: { slug },
        select: {
          id: true,
          name: true,
          slug: true,
          subtitle: true,
          description: true,
          price: true,
          oldPrice: true,
          discount: true,
          power: true,
          voltage: true,
          specs: true,
          inStock: true,
          categoryId: true,
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
    [`product-slug-${slug}`],
    { revalidate: 600, tags: [`product-slug-${slug}`] }
  )();
});

export const getProductById = cache(async (id: number) => {
  return unstable_cache(
    async () => {
      const product = await prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          slug: true,
          subtitle: true,
          description: true,
          price: true,
          oldPrice: true,
          discount: true,
          power: true,
          voltage: true,
          specs: true,
          inStock: true,
          categoryId: true,
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

export const getRelatedProducts = cache(async (categoryId: number, excludeId: number, limit = 4) => {
  return unstable_cache(
    async () => {
      const related = await prisma.product.findMany({
        where: {
          categoryId,
          id: { not: excludeId },
        },
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
        take: limit,
      });

      return related.map((p: any) => ({
        ...p,
        rating: (p.id % 2 === 0) ? 5 : 4.5, // Mock rating
        image: p.images?.[0]?.url ? normalizeImagePath(p.images[0].url) : "/placeholder.webp",
        images: p.images.map((img: any) => ({
          ...img,
          url: normalizeImagePath(img.url)
        }))
      }));
    },
    [`related-${categoryId}-${excludeId}`],
    { revalidate: 3600, tags: [`related-${categoryId}`] }
  )();
});

export const getAdminStats = cache(async () => {
  return unstable_cache(
    async () => {
      const { prisma } = await import("./prisma");
      const [products, orders, messages] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.message.count(),
      ]);
      return { products, orders, messages };
    },
    ['admin-stats'],
    { revalidate: 60, tags: ['admin-stats'] }
  )();
});
