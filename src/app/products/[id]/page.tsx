import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PriceTag } from "@/components/PriceTag";
import { Metadata } from "next";
import { cache } from "react";
import AddToCardButton from "../AddToCardButton";
import incrementProductQuantity from "./actions";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();
  return product;
});

export const generateMetadata = async ({
  params: { id },
}: ProductPageProps): Promise<Metadata> => {
  const product = await getProduct(id);
  return {
    title: product.name + " - TanLoc Amazon",
    description: product.description,
    openGraph: {
      images: [{ url: product.imageUrl }],
    },
  };
};

const ProductPage = async ({ params: { id } }: ProductPageProps) => {
  const product = await getProduct(id);
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={500}
        height={500}
        className="rounded-lg"
        priority
      />
      <div>
        <h1 className="text-5xl font-bold">{product.name}</h1>
        <PriceTag price={product.price} className="" />
        <p className="py-6">{product.description}</p>
        <AddToCardButton
          productId={product.id}
          incrementProductQuanlity={incrementProductQuantity}
        />
      </div>
    </div>
  );
};
export default ProductPage;
