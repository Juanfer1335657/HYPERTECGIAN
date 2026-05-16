"use client";

import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import { Trash2, MessageCircle, ArrowLeft, CreditCard, Wallet, Landmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import VideoBackground from "@/components/VideoBackground";

export default function CartPage() {
  const { cart, removeFromCart, totalUSD, totalCOP, itemCount, clearCart } = useCart();
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const handleCheckout = () => {
    if (!name.trim()) {
      toast.error("Por favor ingresa tu nombre");
      return;
    }

    const itemsText = cart.map(item => `- ${item.title} (${item.duration}) x${item.quantity}: $${(item.priceUSD * item.quantity).toLocaleString()} USD / $${(item.priceCOP * item.quantity).toLocaleString()} COP`).join("\n");
    
    const message = `*Nueva Orden Hyper Tecgian*\n\n` +
      `*Cliente:* ${name}\n` +
      `*Método de Pago:* ${paymentMethod}\n\n` +
      `*Productos:*\n${itemsText}\n\n` +
      `*Total USD:* $${totalUSD.toLocaleString()} USD\n` +
      `*Total COP:* $${totalCOP.toLocaleString()} COP\n\n` +
      `Quedo atento a las instrucciones de pago. Muchas gracias!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/573015851969?text=${encodedMessage}`, "_blank");
    
    // Optional: Clear cart after checkout
    // clearCart();
    toast.success("Redirigiendo a WhatsApp...");
  };

  if (itemCount === 0) {
    return (
      <div className="min-h-screen relative">
        <VideoBackground />
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6 relative z-10">
          <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto border border-white/10">
            <Trash2 className="w-10 h-10 text-slate-400" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white">Tu carrito está vacío</h1>
            <p className="text-slate-400">Parece que aún no has añadido nada a tu selección tecnológica.</p>
          </div>
          <Link href="/shop" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-xl shadow-blue-600/20 transition-all inline-flex items-center">
            Volver a la tienda
            <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12 lg:grid lg:grid-cols-12 lg:gap-12 relative z-10">
        <div className="lg:col-span-12 mb-8">
           <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Carrito de Compras</h1>
        </div>
        
        <div className="lg:col-span-7 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 tech-card bg-black/40 border-white/10">
              <div className="w-20 h-20 relative shrink-0 rounded-lg overflow-hidden bg-slate-900 border border-white/5">
                <Image src={item.image} alt={item.title} fill className="object-contain" />
              </div>
              <div className="flex-grow space-y-1">
                <div className="flex justify-between">
                  <h3 className="font-bold text-white text-lg">{item.title}</h3>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-red-400 transition-colors bg-white/5 p-2 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded border border-blue-500/30">
                    {item.duration}
                  </span>
                  <p className="text-sm font-semibold text-slate-300">{item.quantity} x ${item.priceUSD.toLocaleString()} USD</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-5 mt-12 lg:mt-0 space-y-6">
          <div className="tech-card p-8 space-y-6 bg-black/60 backdrop-blur-2xl border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white leading-tight">Resumen de Compra</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-blue-400 uppercase tracking-widest">Nombre Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-4 py-4 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/5 text-white"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-blue-400 uppercase tracking-widest">Método de Pago</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: "PayPal", icon: CreditCard, label: "PayPal" },
                    { id: "Nequi", icon: Wallet, label: "Nequi" },
                    { id: "Transferencia", icon: Landmark, label: "Transferencia Bancaria" }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        paymentMethod === method.id 
                        ? "border-blue-500 bg-blue-600/20 text-blue-300 font-bold shadow-lg shadow-blue-600/10" 
                        : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <method.icon className="w-5 h-5" />
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Total Estimado</span>
                <div className="text-right">
                  <p className="text-3xl font-black text-white leading-none">${totalUSD.toLocaleString()} USD</p>
                  <p className="text-sm text-blue-400 font-semibold mt-1">${totalCOP.toLocaleString()} COP</p>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 text-xl rounded-2xl font-black uppercase tracking-wider shadow-2xl shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center flex-col gap-1"
              >
                <span className="flex items-center">
                  Comprar por WhatsApp
                  <MessageCircle className="ml-2 w-6 h-6" />
                </span>
                <span className="text-[10px] font-medium opacity-80 normal-case tracking-normal">Redirección segura a chat verificado</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
