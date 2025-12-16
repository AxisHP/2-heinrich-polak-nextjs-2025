import { createPlaylist } from "@/actions/playlists";

export default async function CreatePlaylist() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
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
  );
}
