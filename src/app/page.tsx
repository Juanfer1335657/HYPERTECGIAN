"use client";

import Link from "next/link";
import { ShoppingBag, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import VideoBackground from "@/components/VideoBackground";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <VideoBackground />

      {/* Admin Button top right */}
      <div className="absolute top-6 right-6 z-20">
        <Link 
          href="/admin" 
          className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl flex items-center gap-2 transition-all font-medium"
        >
          <ShieldCheck className="w-4 h-4" />
          Admin
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl w-full text-center space-y-12 relative z-10"
      >
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold tracking-widest uppercase border border-blue-400/30 backdrop-blur-sm"
          >
            Premium Platform
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[1.1]">
            Hyper<span className="text-blue-400">Tecgian</span>
          </h1>
          <p className="text-xl text-slate-200 max-w-xl mx-auto leading-relaxed font-light">
            La experiencia definitiva en comercio tecnológico. Hardware, software y servicios con un diseño impecable.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          <Link 
            href="/shop"
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 text-lg rounded-2xl font-bold shadow-2xl shadow-blue-600/30 hover:-translate-y-1 transition-all flex items-center justify-center w-full sm:w-auto"
          >
            Explorar Tienda
            <ShoppingBag className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/10 mt-20"
        >
          <div className="text-left space-y-2">
            <h3 className="font-semibold text-blue-400 uppercase text-xs tracking-widest">Global Reach</h3>
            <p className="text-sm text-slate-300">Precios en USD y COP integrados para mercados internacionales.</p>
          </div>
          <div className="text-left space-y-2">
            <h3 className="font-semibold text-blue-400 uppercase text-xs tracking-widest">Streamlined</h3>
            <p className="text-sm text-slate-300">Checkout optimizado vía WhatsApp para una comunicación directa.</p>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
