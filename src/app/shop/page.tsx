import { getProducts } from "@/lib/db";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import FloatingCart from "@/components/FloatingCart";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Catálogo</h1>
        <p className="text-slate-300 mb-8">Explora nuestra selección</p>

        {products.length === 0 ? (
          <p className="text-slate-400">No hay productos</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </main>
      <FloatingCart />
    </div>
  );
}