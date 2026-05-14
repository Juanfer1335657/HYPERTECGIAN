"use client";

import { login } from "@/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import VideoBackground from "@/components/VideoBackground";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await login(formData);
      if (res.success) {
        toast.success("Bienvenido, Administrador");
        router.replace("/admin");
        router.refresh();
      } else {
        toast.error(res.error || "Credenciales incorrectas");
      }
    } catch (err) {
      toast.error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <VideoBackground />
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="max-w-md w-full space-y-8 p-10 tech-card bg-black/40 border-white/10">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-400/20">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Admin Portal</h1>
            <p className="text-slate-400">Ingresa tus credenciales para acceder al sistema.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Correo Electrónico</label>
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="admin@hypertecgian.com"
                  className="w-full px-4 py-4 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/5 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Contraseña</label>
                <input 
                  name="password"
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-4 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/5 text-white"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 text-lg rounded-xl font-bold shadow-xl shadow-blue-600/20 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center"
            >
              {loading ? "Verificando..." : "Entrar al Sistema"}
              {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
            </button>
          </form>
          
          <p className="text-center text-xs text-slate-400 font-medium uppercase tracking-[0.2em] pt-4">
            Secured Cloud Access
          </p>
        </div>
      </main>
    </div>
  );
}
