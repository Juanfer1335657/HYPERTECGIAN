"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

export default function FloatingCart() {
  const { itemCount } = useCart();

  if (itemCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="fixed bottom-8 right-8 z-[100]"
      >
        <Link href="/cart">
          <button className="relative p-6 bg-slate-900 text-white rounded-2xl shadow-2xl shadow-slate-900/30 hover:bg-blue-600 hover:-translate-y-1 active:scale-95 transition-all duration-300 group">
            <ShoppingCart className="w-8 h-8" />
            <span className="absolute -top-3 -right-3 bg-blue-500 text-white text-[12px] font-black w-7 h-7 flex items-center justify-center rounded-full ring-4 ring-white">
              {itemCount}
            </span>
          </button>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
