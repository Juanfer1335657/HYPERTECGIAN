"use client";

import Link from "next/link";
import { Home } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-white group">
          Hyper<span className="text-blue-400 transition-colors group-hover:text-blue-300">Tecgian</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/shop" className="text-sm font-medium text-slate-200 hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Catálogo</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
