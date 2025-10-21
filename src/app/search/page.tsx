import { getDb } from "@/lib/db";
import Link from "next/link";

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";

  console.log("Search query:", q);

  const db = getDb();

  const albums = await db
    .selectFrom("albums")
    .where("name", "like", `%${q}%`)
    .selectAll()
    .execute();

  const songs = await db
    .selectFrom("songs")
    .where("name", "like", `%${q}%`)
    .selectAll()
    .execute();

  const authors = await db
      .selectFrom("authors")
      .where("name", "like", `%${q}%`)
      .selectAll()
      .execute();

  return (
    <div className="font-sans grid grid-rows-[80px_1fr_80px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="text-xl">
        <b>Search results for <q>{q}</q></b>
      </div>
      <main>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-lg font-bold mb-2">Albums</div>
            {albums.length === 0 && (<div className="text-sm text-gray-500">No albums found</div>)}
            {albums.map(album => (
              <div key={album.id}>
                <Link href={`/album/${album.id}`} className="text-blue-500 hover:underline">{album.name}</Link>
              </div>
            ))}
          </div>
          <div>
            <div className="text-lg font-bold mb-2">Authors</div>
            {authors.length === 0 && (<div className="text-sm text-gray-500">No authors found</div>)}
            {authors.map(author => (
              <div key={author.id}>
                <Link href={`/author/${author.id}`} className="text-blue-500 hover:underline">{author.name}</Link>
              </div>
            ))}
          </div>
          <div>
            <div className="text-lg font-bold mb-2">Songs</div>
            {songs.length === 0 && (<div className="text-sm text-gray-500">No songs found</div>)}
            {songs.map(song => (
              <div key={song.id}>
                <Link href={`/song/${song.id}`} className="text-blue-500 hover:underline">{song.name}</Link>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <Link href="/" className="text-sm text-gray-500 underline">← Back to Home</Link>
        </div>
      </main>
    </div>
  );
}