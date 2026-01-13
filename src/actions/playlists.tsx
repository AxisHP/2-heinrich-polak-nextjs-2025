"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect} from "next/navigation";

export async function createPlaylist(formData: FormData) {
  const db = getDb();
  const playlistName = formData.get("playlistName");

  await db
    .insertInto("playlists")
    .values({
      name: playlistName?.toString() || "New Playlist",
      user_id: 1,
    })
    .execute();
  redirect("/playlists");
}

export async function updatePlaylist(
  formData: FormData
) {
  const db = getDb();
  const playlistName = formData.get("playlistName");
  const playlistId = parseInt(formData.get("playlistId")?.toString() || "0");
  await db
    .updateTable("playlists")
    .set({
      name: playlistName?.toString() || "New Playlist",
    })
    .where("id", "=", playlistId)
    .execute();

  revalidatePath(`/playlist/${playlistId}`);
}

export async function removeSongFromPlaylist(
  playlistId: number,
  songId: number
) {
  const db = getDb();
  
  await db
    .deleteFrom("playlists_songs")
    .where("playlist_id", "=", playlistId)
    .where("song_id", "=", songId)
    .execute();
    
  revalidatePath(`/playlist/${playlistId}`);
}

export async function removePlaylist(playlistId: number) {
  const db = getDb();

  await db
    .deleteFrom("playlists_songs")
    .where("playlist_id", "=", playlistId)
    .execute();

  await db
    .deleteFrom("playlists")
    .where("id", "=", playlistId)
    .execute();

  revalidatePath(`/playlists`);
  redirect(`/playlists`);
}

export async function addToPlaylist(playlistId: number, songId: number) {
  const db = getDb();
  await db
    .insertInto("playlists_songs")
    .values({
      playlist_id: playlistId,
      song_id: songId,
    })
    .execute();
  revalidatePath(`/playlist/${playlistId}`);
  redirect(`/playlist/${playlistId}`);
}