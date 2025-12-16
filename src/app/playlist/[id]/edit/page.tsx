import { updatePlaylist } from "@/actions/playlists";
import { getDb } from "@/lib/db";

export default async function UpdatePlaylist({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const playlistId = parseInt(id);

  if (isNaN(playlistId)) {
    return <div>Invalid Playlist id</div>;
  }

  const db = getDb();

  const playlist = await db
    .selectFrom("playlists")
    .selectAll()
    .where("id", "=", playlistId)
    .executeTakeFirst();

  if (playlist === null || playlist === undefined) {
    return <div>Playlist not found</div>;
  }  

  

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Update Playlist</h1>
        <form action={updatePlaylist}>
          <input type="hidden" name="playlistId" value={playlist.id} />
          <div className="form-control w-64">
            <label className="label">
              <span className="label-text">Playlist Name</span>
            </label>
            <input
              type="text"
              name="playlistName"
              defaultValue={playlist.name}
              className="input input-bordered w-full"
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
  );
}
