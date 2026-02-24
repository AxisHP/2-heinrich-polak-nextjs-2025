"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleLikedSong(
  userId: number,
  songId: number,
  isLiked: boolean
) {
  const db = getDb();

  if (isLiked) {
    await db
      .insertInto("user_liked_songs")
      .values({
        user_id: userId,
        song_id: songId,
      })
      .execute();
  } else {
    await db
      .deleteFrom("user_liked_songs")
      .where("user_id", "=", userId)
      .where("song_id", "=", songId)
      .execute();
  }
  revalidatePath(`/liked_songs`);
}

export async function checkIfSongIsLiked(
  userId: number,
  songId: number
): Promise<boolean> {
  const db = getDb();

  const result = await db
    .selectFrom("user_liked_songs")
    .where("user_id", "=", userId)
    .where("song_id", "=", songId)
    .selectAll()
    .executeTakeFirst();

  return !!result;
}

export async function getLikedSongs() {
  const db = getDb();

  const likedSongs = await db
    .selectFrom("user_liked_songs")
    .innerJoin("songs", "user_liked_songs.song_id", "songs.id")
    .innerJoin("albums", "songs.album_id", "albums.id")
    .innerJoin("authors", "albums.author_id", "authors.id")
    .where("user_id", "=", 1)
    .select([
      "songs.id as song_id",
      "songs.name as song_name",
      "songs.duration",
      "albums.id as album_id",
      "albums.name as album_name",
      "authors.id as author_id",
      "authors.name as author_name",
    ])
    .execute();

  return likedSongs
}