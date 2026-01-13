import { getDb } from "@/lib/db";
import Link from "next/link";
import CreatePlaylistModal from "./Modal";

export default async function Playlists() {
  const db = getDb();

  const playlists = await db.selectFrom("playlists").where("user_id", "=", 1).selectAll().execute();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <CreatePlaylistModal />
        <h1 className="text-4xl font-bold">Playlists</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/playlist/${playlist.id}`}
              className="card w-64 bg-base-100 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="card-body">
                <h2 className="text-2xl font-bold">{playlist.name}</h2>
                <div className="mt-4">
                  <span className="btn btn-primary btn-sm">View Playlist</span>
                </div>
              </div>
            </Link>
          ))}

          {playlists.length === 0 && (
            <p className="text-gray-500">No playlists found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
