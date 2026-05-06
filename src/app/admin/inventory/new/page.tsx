import ProductForm from "@/components/ProductForm";
import Navbar from "@/components/Navbar";
import VideoBackground from "@/components/VideoBackground";
import { getSession } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const isAuth = await getSession();
  if (!isAuth) redirect("/admin/login");

  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <ProductForm />
      </main>
    </div>
  );
}
