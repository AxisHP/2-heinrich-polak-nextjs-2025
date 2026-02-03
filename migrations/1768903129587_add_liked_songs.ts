import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`CREATE TABLE user_liked_songs (
		id integer primary key autoincrement not null,
		user_id integer not null,
		song_id integer not null,
		liked_at integer not null default (unixepoch()),
		foreign key (user_id) references users(id),
		foreign key (song_id) references songs(id),
		unique (user_id, song_id)
	) STRICT`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE user_liked_songs`.execute(db);
}