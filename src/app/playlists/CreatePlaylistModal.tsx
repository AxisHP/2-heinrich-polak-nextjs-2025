"use client";

import { useRef } from "react";
import { createPlaylist } from "@/actions/playlists";

export default function CreatePlaylistModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button 
        className="btn btn-secondary"
        onClick={() => dialogRef.current?.showModal()}>
          Create New Playlist
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <h1 className="text-4xl font-bold">Create Playlist</h1>
            <form action={createPlaylist}>
              <div className="form-control w-64">
                <label className="label">
                  <span className="label-text">Playlist Name</span>
                </label>
                <input
                  type="text"
                  name="playlistName"
                  placeholder="My Playlist"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="mt-4">
                <button type="submit" className="btn btn-primary">
                  Create Playlist
                </button>
              </div>
            </form>
          </main>
        </div>
      </dialog>
    </>
  );
}