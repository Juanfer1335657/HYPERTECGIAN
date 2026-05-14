import ProductForm from "@/components/ProductForm";
import Navbar from "@/components/Navbar";
import VideoBackground from "@/components/VideoBackground";
import { getProducts } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const isAuth = await getSession();
  if (!isAuth) redirect("/admin/login");

  const { id } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <ProductForm product={product} />
      </main>
    </div>
  );
}
