import { getDb } from "@/lib/db";
import Link from "next/link";
import { RemovePlaylistSongButton } from "./removePlaylistSongPlaylist";
import { RemovePlaylistButton } from "./removePlaylistButton";
import EditPlaylistModal from "./EditPlaylistModal";

function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return `${minutes}` + ":" + `${seconds}`.padStart(2, "0");
}

export default async function PlaylistDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const db = getDb();

  const { id } = await params;

  console.log("Playlist detail id:", id);

  const playlistId = parseInt(id);

  if (isNaN(playlistId)) {
    return <div>Invalid Playlist id</div>;
  }

  const playlist = await db
    .selectFrom("playlists")
    .selectAll()
    .where("id", "=", playlistId)
    .executeTakeFirst();

  if (playlist === null || playlist === undefined) {
    return <div>Playlist not found</div>;
  }

  const playlistSongs = await db
    .selectFrom("playlists_songs")
    .innerJoin("songs", "playlists_songs.song_id", "songs.id")
    .innerJoin("albums", "songs.album_id", "albums.id")
    .innerJoin("authors", "albums.author_id", "authors.id")
    .select([
      "songs.id as song_id",
      "songs.name as song_name",
      "songs.duration",
      "albums.id as album_id",
      "albums.name as album_name",
      "authors.id as author_id",
      "authors.name as author_name",
    ])
    .where("playlists_songs.playlist_id", "=", playlistId)
    .execute();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-4xl">
        <EditPlaylistModal playlistId={playlist.id} playlistName={playlist.name} />
        <div>
          <h1 className="text-4xl font-bold">{playlist.name}</h1>
          <p className="text-gray-500 mt-2">
            {playlistSongs.length} {playlistSongs.length === 1 ? "song" : "songs"}
          </p>
        </div>
        <div className="w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Artist</th>
                <th>Album</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {playlistSongs.map((song, i) => (
                <tr key={song.song_id} className="hover">
                  <td>{i + 1}</td>
                  <td className="font-semibold">{song.song_name}</td>
                  <td>
                    <Link
                      href={`/author/${song.author_id}`}
                      className="text-primary hover:underline"
                    >
                      {song.author_name}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/album/${song.album_id}`}
                      className="text-primary hover:underline"
                    >
                      {song.album_name}
                    </Link>
                  </td>
                  <td>{formatDuration(song.duration)}</td>
                  <td>
                    <RemovePlaylistSongButton
                      playlistId={playlist.id}
                      songId={song.song_id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {playlistSongs.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              This playlist is empty.
            </p>
          )}
        </div>
        <div className="mt-4">
          <RemovePlaylistButton playlistId={playlist.id} />
        </div>
        <div className="mt-4">
          <Link href="/playlists" className="btn btn-secondary">
            ← Back to Playlists
          </Link>
        </div>
      </main>
    </div>
  );
}
