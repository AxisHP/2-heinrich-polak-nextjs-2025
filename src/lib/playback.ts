export function getNextSongToPlay<T extends { id: number }>(
  queue: T[],
  currentSong: T | null
): T | null {
  if (!currentSong || queue.length === 0) {
    return null;
  }

  const currentSongIndex = queue.findIndex((song) => song.id === currentSong.id);

  if (currentSongIndex < 0 || currentSongIndex >= queue.length - 1) {
    return null;
  }

  return queue[currentSongIndex + 1];
}

export function getCurrentQueue<T extends { id: number }>(
  queue: T[],
  currentSong: T | null
): T[] {
  if (!currentSong || queue.length === 0) {
    return [];
  }

  const currentSongIndex = queue.findIndex((song) => song.id === currentSong.id);

  if (currentSongIndex < 0) {
    return [];
  }

  return queue.slice(currentSongIndex+1);
}