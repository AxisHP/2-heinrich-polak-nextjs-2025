"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function recordPlaybackEvent(
  songId: number,
  eventName: "playback_start" | "playback_skip" | "playback_finish"
) {
  const db = getDb();

  await db
    .insertInto("playback_events")
    .values({
      user_id: 1,
      song_id: songId,
      event_name: eventName,
      event_timestamp: Math.floor(Date.now() / 1000),
    })
    .execute();

  revalidatePath("/history");
}
