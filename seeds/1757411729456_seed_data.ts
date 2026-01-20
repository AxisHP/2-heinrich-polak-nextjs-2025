import { DB } from "@/lib/db-types";
import { faker } from "@faker-js/faker";
import type { Kysely } from "kysely";

export async function seed(db: Kysely<DB>): Promise<void> {
  await db.deleteFrom("playlists_songs").execute();
  await db.deleteFrom("playlists").execute();
  await db.deleteFrom("user_liked_songs").execute();
  await db.deleteFrom("users").execute();
  await db.deleteFrom("songs").execute();
  await db.deleteFrom("albums").execute();
  await db.deleteFrom("authors").execute();

  for (let i = 0; i < 20; i += 1) {
    const numBioParagraphs = faker.number.int({ min: 0, max: 5 });

    const bio =
      numBioParagraphs !== 0 ? faker.lorem.paragraph(numBioParagraphs) : null;

    await db
      .insertInto("authors")
      .values({
        name: faker.music.artist(),
        bio,
      })
      .execute();
  }

  const authors = await db.selectFrom("authors").selectAll().execute();

  for (const author of authors) {
    const numAlbums = faker.number.int({ min: 0, max: 10 });

    for (let i = 0; i < numAlbums; i += 1) {
      await db
        .insertInto("albums")
        .values({
          author_id: author.id,
          name: faker.music.album(),
          release_date: faker.date.past().getTime(),
        })
        .execute();
    }
  }

  const albums = await db.selectFrom("albums").selectAll().execute();

  for (const album of albums) {
    const typeOfAlbum = faker.number.int({ min: 0, max: 9 });

    let numSongs = 1;

    if (typeOfAlbum < 2) {
      numSongs = 1;
    } else if (typeOfAlbum < 5) {
      numSongs = faker.number.int({ min: 4, max: 6 });
    } else {
      numSongs = faker.number.int({ min: 10, max: 20 });
    }

    console.log(album.name, numSongs);

    for (let i = 0; i < numSongs; i += 1) {
      await db
        .insertInto("songs")
        .values({
          album_id: album.id,
          name: faker.music.songName(),
          duration: faker.number.int({ min: 90, max: 240 }),
        })
        .execute();
    }
  }

  for (let new_user_id = 1; new_user_id < 12; new_user_id += 1) {
    await db
      .insertInto("users")
      .values({
        id: new_user_id,
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
      })
      .execute();

    const numPlaylists = faker.number.int({ min: 1, max: 10 });
    for (let j = 0; j < numPlaylists; j += 1) {
      await db
        .insertInto("playlists")
        .values({
          name: faker.music.genre() + " " + faker.word.words(2),
          user_id: new_user_id,
        })
        .execute();
    }
  }

  const playlists = await db.selectFrom("playlists").selectAll().execute();
  const allSongs = await db.selectFrom("songs").selectAll().execute();

  for (const playlist of playlists) {
    const numSongsInPlaylist = faker.number.int({ min: 5, max: 30 });

    const shuffledSongs = [...allSongs].sort(() => Math.random() - 0.5);
    const selectedSongs = shuffledSongs.slice(
      0,
      Math.min(numSongsInPlaylist, allSongs.length)
    );

    for (const song of selectedSongs) {
      await db
        .insertInto("playlists_songs")
        .values({
          playlist_id: playlist.id,
          song_id: song.id,
        })
        .execute();
    }
  }

  const users = await db.selectFrom("users").selectAll().execute();

  for (const user of users) {
    const numLikedSongs = faker.number.int({ min: 0, max: 20 });

    const shuffledSongs = [...allSongs].sort(() => Math.random() - 0.5);
    const selectedSongs = shuffledSongs.slice(
      0,
      Math.min(numLikedSongs, allSongs.length)
    );

    for (const song of selectedSongs) {
      await db
        .insertInto("user_liked_songs")
        .values({
          user_id: user.id,
          song_id: song.id,
        })
        .execute();
    }
  }
}
