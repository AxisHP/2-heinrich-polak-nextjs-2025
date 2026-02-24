"use server";

import { getDb } from "@/lib/db";

export async function getSongs(limit: number = 10) {
  const db = getDb();

  const songs = await db
    .selectFrom("songs")
    .innerJoin("albums", "albums.id", "songs.album_id")
    .innerJoin("authors", "authors.id", "albums.author_id")
    .select([
      "songs.id",
      "songs.name",
      "songs.duration",
      "authors.name as artist",
    ])
    .limit(limit)
    .execute();

  return songs;
}
