"use server";

import { getDb } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const db = getDb();

  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();
  if (!user) {
    throw new Error("Invalid email");
  }

  if (user.password !== password) {
    throw new Error("Invalid password");
  }

  const cookieStore = await cookies();
  cookieStore.set("userId", String(user.id));

  redirect("/");
}

export async function handleLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  redirect("/login");
}