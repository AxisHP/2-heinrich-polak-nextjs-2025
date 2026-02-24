import getCurrentUser from "@/actions/get_current_user";
import { getDb } from "@/lib/db";

export default async function HistoryPage() {
  const userId = await getCurrentUser();
  if (!userId) {
    return <div>Please log in to view playback history.</div>;
  }

  const db = getDb();

  const history = await db
    .selectFrom("playback_events")
    .innerJoin("songs", "songs.id", "playback_events.song_id")
    .select([
      "songs.name as song_name",
      "playback_events.event_name",
      "playback_events.event_timestamp",
    ])
    .where("playback_events.user_id", "=", userId)
    .orderBy("playback_events.event_timestamp", "desc")
    .execute();

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold">Playback History</h1>
          <p className="text-gray-500 mt-2">
            {history.length} {history.length === 1 ? "event" : "events"}
          </p>
        </div>

        <div className="w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Song Name</th>
                <th>Event</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((event, i) => (
                <tr key={i} className="hover">
                  <td>{i + 1}</td>
                  <td className="font-semibold">{event.song_name}</td>
                  <td>
                    <span
                      className={`badge ${
                        event.event_name === "playback_start"
                          ? "badge-success"
                          : event.event_name === "playback_skip"
                          ? "badge-warning"
                          : "badge-info"
                      }`}
                    >
                      {event.event_name.replace("playback_", "")}
                    </span>
                  </td>
                  <td className="text-sm text-gray-500">
                    {formatDate(event.event_timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {history.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No playback history found
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
