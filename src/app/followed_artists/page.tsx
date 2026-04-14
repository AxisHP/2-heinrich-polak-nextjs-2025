import Link from "next/link";
import { ToggleFollowButton } from "./toggleFollowButton";
import { getFollowedArtists } from "@/actions/followed_artists";

export default async function FollowedArtistsPage() {
  const followedArtists = await getFollowedArtists()
  const followedArtistsIds = new Set(followedArtists.map((artist) => artist.author_id));

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold">Followed Artists</h1>
          <p className="text-gray-500 mt-2">
            {followedArtists.length} {followedArtists.length === 1 ? "artist" : "artists"}
          </p>
        </div>
        <div className="w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Artist</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {followedArtists.map((artist, i) => (
                <tr key={artist.author_id} className="hover">
                  <td>{i + 1}</td>
                  <Link
                      href={`/author/${artist.author_id}`}  
                      className="text-primary hover:underline"
                    > <td className="font-semibold">{artist.author_name}</td>
                  </Link>
                  <td>
                    <ToggleFollowButton
                      userId={1}
                      authorId={artist.author_id}
                      initialIsFollowed={true}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {followedArtists.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              {"You don't follow any artists"}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
