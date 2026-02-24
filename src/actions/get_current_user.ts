'use server'

import { cookies } from "next/headers";

export default async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return null
  }

  return parseInt(userId);
}