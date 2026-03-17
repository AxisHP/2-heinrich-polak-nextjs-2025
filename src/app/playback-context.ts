import { createContext } from "react";

interface Playback {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  dummy: number;
  setDummy: (dummy: number) => void;
}

// createContext(1)
// createContext<number>(1)

export const PlaybackContext = createContext<Playback>({
  isPlaying: false,
  setIsPlaying: () => {},
  dummy: 5,
  setDummy: () => {},
});
