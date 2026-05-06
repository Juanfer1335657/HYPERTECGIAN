"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

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

export async function verifyToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("admin-token", "", { maxAge: 0, path: "/" });
  redirect("/admin/login");
}

export async function getSession() {
  const payload = await verifyToken();
  return payload !== null;
}
