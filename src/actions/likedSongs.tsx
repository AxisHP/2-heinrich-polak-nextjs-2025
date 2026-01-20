"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function likeSong(songId: number) {
  const db = getDb();
  const userId = 1;

  const existing = await db
    .selectFrom("liked_songs")
    .selectAll()
    .where("user_id", "=", userId)
    .where("song_id", "=", songId)
    .executeTakeFirst();

  if (existing) {
    return;
  }

  await db
    .insertInto("liked_songs")
    .values({
      user_id: userId,
      song_id: songId,
    })
    .execute();

  revalidatePath("/liked");
}

export async function unlikeSong(songId: number) {
  const db = getDb();
  const userId = 1;

  await db
    .deleteFrom("liked_songs")
    .where("user_id", "=", userId)
    .where("song_id", "=", songId)
    .execute();

  revalidatePath("/liked");
}

export async function toggleLikeSong(songId: number) {
  const db = getDb();
  const userId = 1;

  const existing = await db
    .selectFrom("liked_songs")
    .selectAll()
    .where("user_id", "=", userId)
    .where("song_id", "=", songId)
    .executeTakeFirst();

  if (existing) {
    await unlikeSong(songId);
  } else {
    await likeSong(songId);
  }
}

export async function isLiked(songId: number): Promise<boolean> {
  const db = getDb();
  const userId = 1;

  const existing = await db
    .selectFrom("liked_songs")
    .selectAll()
    .where("user_id", "=", userId)
    .where("song_id", "=", songId)
    .executeTakeFirst();

  return !!existing;
}
