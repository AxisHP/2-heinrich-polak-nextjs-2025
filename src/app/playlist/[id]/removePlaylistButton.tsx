"use client";

import { removePlaylist } from "@/actions/playlists";

export function RemovePlaylistButton(props: {
  playlistId: number;
}) {
  return (
    <button
      className="btn bg-red-500"
      onClick={() => removePlaylist(props.playlistId)}
    >
      Remove
    </button>
  );
}
