"use client";

import { addToPlaylist } from "@/actions/playlists";

export function AddToPlaylistButton(props: {
  playlistId: number;
  songId: number;
  playlistName: string;
}) {
  return (
    <button
      className="btn btn-xs w-full justify-start"
      onClick={() => addToPlaylist(props.playlistId, props.songId)}
    >
      {props.playlistName}
    </button>
  );
}
