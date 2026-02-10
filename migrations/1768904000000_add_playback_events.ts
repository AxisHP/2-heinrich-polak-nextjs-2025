import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`CREATE TABLE playback_events (
		id integer primary key autoincrement not null,
		event_name text not null check (event_name in ('playback_start', 'playback_skip', 'playback_finish')),
		event_timestamp integer not null default (unixepoch()),
		user_id integer not null,
		song_id integer not null,
		foreign key (user_id) references users(id),
		foreign key (song_id) references songs(id)
	) STRICT`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE playback_events`.execute(db);
}
