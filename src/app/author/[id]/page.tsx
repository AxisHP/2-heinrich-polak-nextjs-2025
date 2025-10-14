import { getDb } from "@/lib/db";
import Link from "next/link";

export default async function AuthorDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const db = getDb();
  const { id } = await params;

  console.log("Author detail id:", id);

  const authorId = parseInt(id);
  if (isNaN(authorId)) {
    return <div>Invalid author id</div>;
  }

  const author = await db
    .selectFrom("authors")
    .selectAll()
    .where("id", "=", authorId)
    .executeTakeFirst();

  if (author === null || author === undefined) {
    return <div>Author not found</div>;
  }

  const albums = await db
    .selectFrom("albums")
    .select(["id", "name", "release_date"])
    .where("author_id", "=", authorId)
    .execute();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>
          <h1 className="text-3xl font-bold">{author.name}</h1>
          <p className="mt-2 text-base">{author.bio ?? "No biography."}</p>
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4">Albums</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {albums.map((album) => (
              <div key={album.id} className="card w-full bg-base-100 shadow-sm">
                <div className="card-body">
                  <h3 className="text-xl font-bold">{album.name}</h3>
                  <p>Release: {new Date(album.release_date).toDateString()}</p>
                  <div className="mt-4">
                    <Link href={`/album/${album.id}`} className="btn btn-primary">
                      View album
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {albums.length === 0 && <p>This author has no albums.</p>}
          </div>
        </div>
      </main>
    </div>
  );
}