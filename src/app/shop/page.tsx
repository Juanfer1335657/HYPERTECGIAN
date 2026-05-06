import { getProducts } from "@/lib/db";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import FloatingCart from "@/components/FloatingCart";
import VideoBackground from "@/components/VideoBackground";

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-8 relative z-10">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Catálogo</h1>
          <p className="text-slate-300 text-lg font-light max-w-2xl">Explora nuestra selección</p>
        </div>

        {products.length === 0 ? (
          <div className="h-[40vh] flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-slate-100 rounded-3xl">
            <p className="text-slate-400 font-medium">No hay productos</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </main>
      <FloatingCart />
    </div>
  );
}