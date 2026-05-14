"use client";

import { Product } from "@/lib/db";
import { useCart } from "@/context/CartContext";
import { Plus, Check, Clock, Search } from "lucide-react";
import { toast } from "sonner";
import { useState, useMemo } from "react";

export default function ProductGrid({ products }: { products: Product[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Buscar productos por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white/5 backdrop-blur-md rounded-3xl border border-dashed border-white/10">
          <p className="text-slate-400 font-medium">No se encontraron productos que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.35rem)] xl:w-[calc(25%-1.5rem)] max-w-[320px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setAdding(true);
    addToCart(product);
    toast.success(`${product.title} añadido al carrito`);
    setTimeout(() => setAdding(false), 1500);
  };

  return (
    <div className="tech-card overflow-hidden flex flex-col h-full group bg-black/40 border-white/10">
      <div className="aspect-square w-full relative bg-slate-900 overflow-hidden">
        <img 
          src={product.image || "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=600"} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-white">
            <Clock className="w-4 h-4 text-blue-400" />
            {product.duration}
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4 flex flex-col flex-grow">
        <div className="space-y-1">
          <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{product.title}</h3>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white italic">${product.priceUSD.toLocaleString()} USD</span>
                            <span className="text-sm text-blue-400 font-bold tracking-tight">${Math.round(product.priceCOP).toLocaleString()} COP</span>
          </div>
        </div>

        <button 
          onClick={handleAdd}
          disabled={adding}
          className={`mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all duration-300 ${
            adding 
            ? "bg-emerald-500 text-white" 
            : "bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20 active:scale-95"
          }`}
        >
          {adding ? (
            <>
              <Check className="w-4 h-4" />
              <span>Añadido</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Agregar al carrito</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
