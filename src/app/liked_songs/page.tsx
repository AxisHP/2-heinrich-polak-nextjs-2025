import Link from "next/link";
import { ToggleLikeButton } from "./toggleLikeButton";
import { getLikedSongs } from "@/actions/liked_songs";

function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return `${minutes}` + ":" + `${seconds}`.padStart(2, "0");
}

export default async function LikedSongsPage() {
  const likedSongs = await getLikedSongs()

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold">Liked Songs ❤️</h1>
          <p className="text-gray-500 mt-2">
            {likedSongs.length} {likedSongs.length === 1 ? "song" : "songs"}
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
              {likedSongs.map((song, i) => (
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
                    <ToggleLikeButton
                      userId={1}
                      songId={song.song_id}
                      initialIsLiked={true}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {likedSongs.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              This playlist is empty.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
