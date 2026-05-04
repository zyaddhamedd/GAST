import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditProductClient } from "./EditProductClient";

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: true,
      category: true,
    },
  });

  if (!product) notFound();

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <EditProductClient 
      initialProduct={product as any} 
      categories={categories as any} 
    />
  );
}
