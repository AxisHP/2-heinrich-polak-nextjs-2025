import { createContext } from "react";

export interface Song {
  id: number;
  name: string;
  artist: string;
  duration: number;
}

export interface PlaybackStart {
  timestamp: number;
  progressAtStart: number;
}

interface Playback {
  queue: Song[];
  setQueue: (queue: Song[]) => void;
  currentSong: Song | null;
  setCurrentSong: (currentSong: Song | null) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  progress: number;
  setProgress: (progress: number) => void;
  playbackStart: PlaybackStart | null;
  setPlaybackStart: (playbackStart: PlaybackStart | null) => void;
  isShuffled: boolean;
  setIsShuffled: (isShuffled: boolean) => void;
  shuffleOrder: number[] | null;
  setShuffleOrder: (shuffleOrder: number[] | null) => void;
  shufflePosition: number;
  setShufflePosition: (shufflePosition: number) => void;
  dummy: number;
  setDummy: (dummy: number) => void;
}

export const PlaybackContext = createContext<Playback>({
  queue: [],
  setQueue: () => {},
  currentSong: null,
  setCurrentSong: () => {},
  isPlaying: false,
  setIsPlaying: () => {},
  progress: 0,
  setProgress: () => {},
  playbackStart: null,
  setPlaybackStart: () => {},
  isShuffled: false,
  setIsShuffled: () => {},
  shuffleOrder: null,
  setShuffleOrder: () => {},
  shufflePosition: 0,
  setShufflePosition: () => {},
  dummy: 5,
  setDummy: () => {},
});
