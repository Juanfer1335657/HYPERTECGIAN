import { getProducts } from "@/lib/db";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div>
      <h1>Catálogo</h1>
      <p>Productos: {products.length}</p>
    </div>
  );
}