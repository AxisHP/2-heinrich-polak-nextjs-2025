"use client";

import { useRef } from "react";
import { updatePlaylist } from "@/actions/playlists";

interface EditPlaylistModalProps {
  playlistId: number;
  playlistName: string;
}

export default function EditPlaylistModal({ playlistId, playlistName }: EditPlaylistModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button 
        className="btn btn-secondary"
        onClick={() => dialogRef.current?.showModal()}>
          Edit Playlist
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <h1 className="text-4xl font-bold">Update Playlist</h1>
            <form action={(event: FormData) => {
              updatePlaylist(event);
              dialogRef.current?.close();
            }}>
              <input type="hidden" name="playlistId" value={playlistId} />
              <div className="form-control w-64">
                <label className="label">
                  <span className="label-text">Playlist Name</span>
                </label>
                <input
                  type="text"
                  name="playlistName"
                  defaultValue={playlistName}
                  className="input input-bordered w-full"
                  autoComplete="off"
                />
              </div>
              <div className="mt-4">
                <button type="submit" className="btn btn-primary">
                  Update Playlist
                </button>
              </div>
            </form>
          </main> 
        </div>
      </dialog>
    </>
  );
}