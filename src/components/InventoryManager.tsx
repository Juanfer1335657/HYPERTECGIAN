"use client";

import { useState } from "react";
import { createProduct, updateProduct, deleteProduct } from "@/actions/products";
import { Product, Duration } from "@/lib/db";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Save, 
  ArrowLeft, 
  Package,
  Image as ImageIcon,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import VideoBackground from "@/components/VideoBackground";

export default function InventoryCRUD({ products: initialProducts }: { products: Product[] }) {
  const [products, setProducts] = useState(initialProducts);

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      toast.success("Producto eliminado");
      window.location.reload();
    } catch (err) {
      toast.error("Error al eliminar");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-400" />
          Gestión de Inventario
        </h2>
        <Link 
          href="/admin/inventory/new"
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center group active:scale-95"
        >
          <Plus className="mr-2 w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          Añadir Producto
        </Link>
      </div>

      {/* Inventory List */}
      <div className="tech-card bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Asset Digital</th>
                <th className="text-left py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Servicio</th>
                <th className="text-left py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Valuación USD</th>
                <th className="text-left py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Valuación COP</th>
                <th className="text-right py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10 text-slate-600">
                        <Package className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-white font-black uppercase tracking-widest">Base de Datos Vacía</p>
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-[0.2em]">Inicia la carga de productos para el catálogo</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-5">
                        <div className="relative w-14 h-14 rounded-[1.2rem] overflow-hidden border border-white/10 p-1 bg-white/5 group-hover:border-blue-500/30 transition-colors">
                          <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover rounded-[0.9rem]" />
                        </div>
                        <div className="space-y-1">
                          <span className="font-black text-white uppercase tracking-tight block">{p.title}</span>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10">ID: {p.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border border-blue-500/20 shadow-lg shadow-blue-500/5">
                        {p.duration}
                      </span>
                    </td>
                    <td className="py-6 px-8 font-black text-slate-300 tabular-nums italic text-lg tracking-tighter">${p.priceUSD.toLocaleString()}</td>
                    <td className="py-6 px-8 font-black text-blue-400/80 tabular-nums italic text-lg tracking-tighter">${Math.round(p.priceCOP).toLocaleString()}</td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                        <Link 
                          href={`/admin/inventory/edit/${p.id}`}
                          className="p-3 bg-white/5 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-2xl transition-all border border-white/5 hover:border-blue-500/30 active:scale-90"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-3 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-2xl transition-all border border-white/5 hover:border-red-500/30 active:scale-90"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

