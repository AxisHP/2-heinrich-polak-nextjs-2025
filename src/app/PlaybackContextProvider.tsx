"use client";

import { useState } from "react";
import { PlaybackContext, PlaybackStart, Song } from "./playback-context";

export function PlaybackContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [dummy, setDummy] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackStart, setPlaybackStart] = useState<PlaybackStart | null>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState<number[] | null>(null);
  const [shufflePosition, setShufflePosition] = useState(0);

  return (
    <PlaybackContext
      value={{
        queue,
        setQueue,
        currentSong,
        setCurrentSong,
        isPlaying: isPlaying,
        setIsPlaying,
        progress,
        setProgress,
        playbackStart,
        setPlaybackStart,
        isShuffled,
        setIsShuffled,
        shuffleOrder,
        setShuffleOrder,
        shufflePosition,
        setShufflePosition,
        dummy,
        setDummy,
      }}
    >
      {children}
    </PlaybackContext>
  );
}
