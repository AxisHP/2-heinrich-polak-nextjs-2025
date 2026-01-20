"use client";

import { toggleLikedSong } from "@/actions/liked_songs";

export function ToggleLikeButton(props: {
  userId: number;
  songId: number;
  initialIsLiked: boolean;
}) {
  return (
    <button
      className="btn btn-xs bg-red-500 hover:bg-red-700 text-white"
      onClick={() => toggleLikedSong(props.userId, props.songId, !props.initialIsLiked)}
    >
      {props.initialIsLiked ? "Unlike" : "Like"}
    </button>
  );
}
