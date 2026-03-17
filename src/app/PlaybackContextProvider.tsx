"use client";

import { useState } from "react";
import { PlaybackContext } from "./playback-context";

export function PlaybackContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [dummy, setDummy] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <PlaybackContext
      value={{
        isPlaying: isPlaying,
        setIsPlaying,
        dummy,
        setDummy,
      }}
    >
      {children}
    </PlaybackContext>
  );
}
