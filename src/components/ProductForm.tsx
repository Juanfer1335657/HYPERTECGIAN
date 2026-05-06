"use client";

import { useState } from "react";
import { createProduct, updateProduct } from "@/actions/products";
import { Product } from "@/lib/db";
import { 
  Save, 
  X, 
  Image as ImageIcon, 
  DollarSign, 
  ArrowLeft 
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(product?.image || null);
  const [isPending, setIsPending] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<Duration>(product?.duration || "1 mes");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setPreviewImage(e.target.value);
    }
  };

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    // Explicitly add selected duration to formData just in case local state is used for the custom UI
    formData.set("duration", selectedDuration);
    
    try {
      if (product) {
        await updateProduct(product.id, formData);
        toast.success("Producto actualizado");
      } else {
        await createProduct(formData);
        toast.success("Producto creado");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      toast.error("Error al procesar la solicitud");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <Link 
          href="/admin" 
          className="group flex items-center gap-4 text-slate-400 hover:text-white transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-blue-600/10 group-hover:border-blue-500/50 transition-all shadow-xl">
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-500">Volver</span>
            <span className="font-black uppercase tracking-tight text-white italic">Panel de Control</span>
          </div>
        </Link>

        {product && (
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Asset ID</span>
            <span className="text-sm font-mono text-blue-400 font-bold">#{product.id.split("-")[0].toUpperCase()}</span>
          </div>
        )}
      </div>

      <div className="bg-[#080808] rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="p-12 border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Configuration Mode: {product ? 'Update' : 'New Deployment'}</span>
              </div>
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                {product ? "Ajustes de" : "Nuevo"} <span className="text-blue-500">Producto</span>
              </h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">Engineered for HyperTec High-Performance Infrastructure</p>
            </div>
            
            {!product && (
              <div className="hidden lg:block">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Standard Encryption</p>
                  <p className="text-xs font-bold text-slate-400 tracking-tight italic">AES-256 Enabled for Asset Uploads</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <form action={handleSubmit} className="p-12 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Asset Configuration (Images) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" /> Identidad Visual
                  </label>
                  <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest">Recomendado: 1:1 Aspect Ratio</span>
                </div>
                
                <div className="aspect-square bg-white/[0.02] rounded-[2.5rem] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group relative transition-all hover:border-blue-500/30">
                  {previewImage ? (
                    <>
                      <img 
                        src={previewImage} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" 
                        alt="Vista previa" 
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 cursor-pointer">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                          <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Cambiar Recurso Digital</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-4 p-12 group-hover:scale-105 transition-transform">
                      <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
                        <ImageIcon className="w-10 h-10 text-slate-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-white uppercase tracking-widest">Seleccionar Archivo</p>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">O arrastra el asset aquí</p>
                      </div>
                    </div>
                  )}
                  <input 
                    name="imageFile" 
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Source Mapping (URL)</label>
                </div>
                <input 
                  name="imageURL" 
                  onChange={handleUrlChange}
                  defaultValue={product?.image}
                  placeholder="https://images.hypertec.gian/asset-01.jpg"
                  className="w-full px-8 py-6 rounded-3xl border border-white/10 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white/[0.02] text-slate-200 placeholder:text-slate-800 text-sm font-medium italic"
                />
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] px-1">Nomenclatura del Acto Comercial</label>
                <input 
                  name="title" 
                  required
                  defaultValue={product?.title}
                  placeholder="Ej. Servidor Dedicado Elite X1"
                  className="w-full px-8 py-6 rounded-3xl border border-white/10 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white/[0.02] text-white text-2xl font-black tracking-tighter italic"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] px-1">Valuación Nominal (USD)</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center transition-colors group-focus-within:border-blue-500/50">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                    </div>
                    <input 
                      name="priceUSD" 
                      type="number" 
                      step="0.01"
                      required
                      defaultValue={product?.priceUSD}
                      className="w-full pl-18 pr-8 py-6 rounded-3xl border border-white/10 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white/[0.02] text-slate-200 font-black italic tabular-nums text-lg"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] px-1">Valuación Local (COP)</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center transition-colors group-focus-within:border-emerald-500/50">
                      <span className="text-xs font-black text-emerald-500">$</span>
                    </div>
                    <input 
                      name="priceCOP" 
                      type="number" 
                      required
                      defaultValue={product?.priceCOP}
                      className="w-full pl-18 pr-8 py-6 rounded-3xl border border-white/10 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white/[0.02] text-slate-200 font-black italic tabular-nums text-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] px-1">Ciclo de Facturación (Duration)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {(["1 mes", "3 meses", "6 meses", "12 meses"] as Duration[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDuration(d)}
                      className={`py-5 px-4 rounded-[1.5rem] border-2 transition-all flex flex-col items-center justify-center gap-1 group active:scale-95 ${
                        selectedDuration === d 
                        ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]" 
                        : "bg-white/[0.03] border-white/5 text-slate-400 hover:border-white/20 hover:bg-white/[0.06]"
                      }`}
                    >
                      <span className={`text-xl font-black tracking-tighter italic ${selectedDuration === d ? "scale-110" : ""} transition-transform`}>
                        {d.split(" ")[0]}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                        {d.split(" ")[1]}
                      </span>
                    </button>
                  ))}
                </div>
                {/* Hidden input for form submission */}
                <input type="hidden" name="duration" value={selectedDuration} />
              </div>

              <div className="pt-10 flex flex-col sm:flex-row gap-5">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="flex-grow bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white py-7 px-10 rounded-3xl font-black uppercase tracking-[0.4em] shadow-2xl shadow-blue-900/30 transition-all flex items-center justify-center active:scale-[0.98] text-sm group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                  {isPending ? (
                    <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="mr-4 w-6 h-6 group-hover:rotate-12 transition-transform" />
                      {product ? "Confirmar Cambios" : "Ejecutar Despliegue"}
                    </>
                  )}
                </button>
                <Link 
                  href="/admin"
                  className="px-12 border-2 border-white/5 hover:border-white/10 hover:bg-white/5 text-slate-500 hover:text-white py-7 rounded-3xl font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center text-xs"
                >
                  Cancelar
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Footer Design Element */}
      <div className="mt-12 text-center opacity-20 pointer-events-none">
        <p className="text-[8px] font-mono uppercase tracking-[0.5em] text-white">System Secure Interface v4.0.2 // HyperTec Internal Assets</p>
      </div>
    </div>
  );
}

