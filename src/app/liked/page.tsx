import { getDb } from "@/lib/db";
import Link from "next/link";
import { LikeSongButton } from "../album/[id]/LikeSongButton";

function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return `${minutes}` + ":" + `${seconds}`.padStart(2, "0");
}

export default async function LikedSongsPage() {
  const db = getDb();
  const userId = 1;

  const likedSongs = await db
    .selectFrom("liked_songs")
    .innerJoin("songs", "liked_songs.song_id", "songs.id")
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
      "liked_songs.liked_at",
    ])
    .where("liked_songs.user_id", "=", userId)
    .orderBy("liked_songs.liked_at", "desc")
    .execute();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-10 h-10 text-error"
            >
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            Liked Songs
          </h1>
          <p className="text-gray-500 mt-2">
            {likedSongs.length} {likedSongs.length === 1 ? "song" : "songs"}
          </p>
        </div>

        {likedSongs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No liked songs yet.</p>
            <p className="text-gray-400 mt-2">
              Click the heart icon on any song to add it here.
            </p>
            <Link href="/" className="btn btn-primary mt-4">
              Browse Albums
            </Link>
          </div>
        ) : (
          <div className="w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Album</th>
                  <th>Duration</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {likedSongs.map((song, i) => (
                  <tr key={song.song_id} className="hover">
                    <td>{i + 1}</td>
                    <td className="font-medium">{song.song_name}</td>
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
                      <LikeSongButton songId={song.song_id} isLiked={true} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
