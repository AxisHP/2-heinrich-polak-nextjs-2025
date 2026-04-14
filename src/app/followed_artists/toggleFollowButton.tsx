"use client";

import { toggleFollowedArtist } from "@/actions/followed_artists";

export function ToggleFollowButton(props: {
  userId: number;
  authorId: number;
  initialIsFollowed: boolean;
}) {
  return (
    <button
      className="btn btn-xs bg-blue-500 hover:bg-blue-700 text-white"
      onClick={() => toggleFollowedArtist(props.userId, props.authorId, !props.initialIsFollowed)}
    >
      {props.initialIsFollowed ? "Unfollow" : "Follow"}
    </button>
  );
}
