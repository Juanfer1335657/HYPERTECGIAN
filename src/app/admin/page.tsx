import { getSession, logout } from "@/actions/auth";
import { getProducts } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Package, 
  Store, 
  LogOut, 
  PlusCircle, 
  BarChart3, 
  Settings,
  ArrowUpRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import VideoBackground from "@/components/VideoBackground";
import InventoryCRUD from "@/components/InventoryManager";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const isAuth = await getSession();
  if (!isAuth) redirect("/admin/login");

  const products = await getProducts();
  const avgPrice = products.length > 0 
    ? products.reduce((acc, p) => acc + p.priceUSD, 0) / products.length 
    : 0;
  const totalValueCOP = products.reduce((acc, p) => acc + p.priceCOP, 0);

  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Admin Session: Active</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">HyperTec <span className="text-blue-500">Gian</span></h1>
              <p className="text-slate-400 text-sm font-medium">Panel de Control: Infraestructura y Gestión de Activos Digitales.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <form action={logout}>
              <button className="px-8 py-4 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 text-red-400 rounded-2xl transition-all flex items-center bg-black/40 backdrop-blur-md font-black uppercase text-xs tracking-widest shadow-xl shadow-red-900/5 active:scale-95">
                <LogOut className="mr-3 w-4 h-4" />
                Finalizar Sesión
              </button>
            </form>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <a href="#inventory-section" className="tech-card p-10 space-y-6 bg-blue-600/10 border-blue-500/30 hover:bg-blue-600/20 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Package className="w-24 h-24 -mr-8 -mt-8 rotate-12" />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-400/30 group-hover:scale-110 transition-transform">
                <Package className="w-8 h-8" />
              </div>
              <span className="text-[9px] font-black text-blue-400 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full uppercase tracking-widest">In Stock</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-6xl font-black text-white tracking-tighter italic">{products.length}</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Productos Registrados</p>
            </div>
          </a>

          <div className="tech-card p-10 space-y-6 bg-emerald-600/10 border-emerald-500/30 hover:bg-emerald-600/20 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BarChart3 className="w-24 h-24 -mr-8 -mt-8 rotate-12" />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-400/30">
                <BarChart3 className="w-8 h-8" />
              </div>
              <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full uppercase tracking-widest">Market Value</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-emerald-400 italic tabular-nums">${avgPrice.toFixed(1)}<span className="text-xl"> USD</span></h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Precio Promedio</p>
            </div>
          </div>

          <div className="tech-card p-10 space-y-6 bg-indigo-600/10 border-indigo-500/30 hover:bg-indigo-600/20 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Settings className="w-24 h-24 -mr-8 -mt-8 rotate-12" />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-400/30">
                <Settings className="w-8 h-8" />
              </div>
              <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full uppercase tracking-widest">Total Value</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-indigo-400 italic tabular-nums">${(totalValueCOP / 1000).toFixed(0)}k<span className="text-xl"> COP</span></h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Valoración Total</p>
            </div>
          </div>

          <div className="tech-card p-10 space-y-6 bg-white/5 border-white/10 hover:bg-white/[0.08] transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Store className="w-24 h-24 -mr-8 -mt-8 rotate-12" />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center border border-white/10">
                <Store className="w-8 h-8" />
              </div>
            </div>
            <div className="relative z-10">
              <Link href="/shop" className="group inline-flex items-center text-3xl font-black text-white hover:text-blue-400 transition-colors uppercase tracking-widest italic" id="view-store-link">
                PÚBLICO
                <ArrowUpRight className="ml-2 w-6 h-6 transition-transform group-hover:rotate-45" />
              </Link>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Catálogo de Clientes</p>
            </div>
          </div>
        </div>

        {/* Inventory Section - DIRECTLY VISIBLE */}
        <div id="inventory-section" className="pt-8 border-t border-white/10 scroll-mt-12">
          <InventoryCRUD products={products} />
        </div>
      </main>
    </div>
  );
}
