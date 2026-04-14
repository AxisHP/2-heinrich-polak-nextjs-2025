"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import getCurrentUser from "@/actions/get_current_user"

export async function toggleFollowedArtist(
  userId: number,
  authorId: number,
  isFollowed: boolean
) {
  const db = getDb();

  if (isFollowed) {
    await db
      .insertInto("user_followed_artists")
      .values({
        user_id: userId,
        author_id: authorId,
      })
      .execute();
  } else {
    await db
      .deleteFrom("user_followed_artists")
      .where("user_id", "=", userId)
      .where("author_id", "=", authorId)
      .execute();
  }
  revalidatePath(`/followed_artists`);
}

export async function checkIfArtistIsFollowed(
  userId: number,
  authorId: number
): Promise<boolean> {
  const db = getDb();

  const result = await db
    .selectFrom("user_followed_artists")
    .where("user_id", "=", userId)
    .where("author_id", "=", authorId)
    .selectAll()
    .executeTakeFirst();

  return !!result;
}

export async function getFollowedArtists() {
  const db = getDb();
  const userId = await getCurrentUser();
  if (!userId) {
    return [];
  }

  const followedArtists = await db
    .selectFrom("user_followed_artists")
    .innerJoin("authors", "user_followed_artists.author_id", "authors.id")
    .where("user_id", "=", userId)
    .select([
      "authors.id as author_id",
      "authors.name as author_name"
    ])
    .execute();

  return followedArtists
}