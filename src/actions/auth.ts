"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT } from "jose";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@hypertecgian.com";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super_secret_jwt_key_min_32_chars");

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = await new SignJWT({ email, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set("admin-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return { success: true };
  }

  console.log("Intento de login fallido para:", email);
  return { success: false, error: "Credenciales inválidas" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("admin-token", "", { maxAge: 0, path: "/" });
  redirect("/admin/login");
}
