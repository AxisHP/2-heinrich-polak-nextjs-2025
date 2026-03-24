"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { toggleLikedSong, checkIfSongIsLiked } from "@/actions/liked_songs";
import { getUserPlaylists, addSongToPlaylist } from "@/actions/playlists";
import { getSongs } from "@/actions/songs";
import { recordPlaybackEvent } from "@/actions/playback_events";
import getCurrentUser from "@/actions/get_current_user";
import { getNextSongToPlay } from "@/lib/playback";
import { PlaybackContext } from "./playback-context";

interface Playlist {
  id: number;
  name: string;
  user_id: number;
}

function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function PlaybackBar() {
  const playbackContext = useContext(PlaybackContext);
  const {
    queue,
    setQueue,
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    playbackStart,
    setPlaybackStart,
    isShuffled,
    setIsShuffled,
    setShuffleOrder,
    setShufflePosition,
  } = playbackContext;

  const [isLiked, setIsLiked] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const hasFinishedRef = useRef(false);
  const isTransitioningRef = useRef(false);
  const originalQueueRef = useRef<typeof queue | null>(null);

  

  useEffect(() => {
    async function fetchCurrentUser() {
      const userId = await getCurrentUser();
      setUserId(userId);
    }
    fetchCurrentUser();
  }, []);

  async function startPlayback() {
    hasFinishedRef.current = false;
    setPlaybackStart({
      timestamp: Date.now(),
      progressAtStart: progress,
    });
    setIsPlaying(true);
    
    if (currentSong && progress < 2) {
      await recordPlaybackEvent(currentSong.id, "playback_start");
    }
  }

  function pausePlayback() {
    setIsPlaying(false);
    setPlaybackStart(null);
  }

  function seekTo(newProgress: number) {
    setProgress(newProgress);
    if (isPlaying) {
      setPlaybackStart({
        timestamp: Date.now(),
        progressAtStart: newProgress,
      });
    }
  }

  function togglePlayback() {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  }

  function toggleRepeatQueue() {
    setIsRepeatEnabled((prev) => !prev);
  }

  function shuffleSongs(songs: typeof queue) {
    const shuffled = [...songs];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  function toggleShuffleQueue() {
    if (!currentSong || queue.length <= 1) {
      return;
    }

    if (!isShuffled) {
      originalQueueRef.current = [...queue];

      const currentSongFromQueue =
        queue.find((song) => song.id === currentSong.id) ?? currentSong;
      const remainingSongs = queue.filter((song) => song.id !== currentSong.id);
      const shuffledQueue = [currentSongFromQueue, ...shuffleSongs(remainingSongs)];

      setQueue(shuffledQueue);
      setIsShuffled(true);
      setShuffleOrder(shuffledQueue.map((song) => song.id));
      setShufflePosition(0);
      return;
    }

    const restoredQueue = originalQueueRef.current ? [...originalQueueRef.current] : [...queue];

    setQueue(restoredQueue);
    setIsShuffled(false);
    setShuffleOrder(null);
    setShufflePosition(0);
    originalQueueRef.current = null;
  }

  const nextSong = useCallback(async (isManualSkip = false) => {
    if (
      !currentSong ||
      queue.length === 0 ||
      isTransitioningRef.current
    ) {
      return;
    }
    
    isTransitioningRef.current = true;
    hasFinishedRef.current = false;
    
    // Record event for the OLD song FIRST
    if (isManualSkip) {
      await recordPlaybackEvent(currentSong.id, "playback_skip");
    } else {
      await recordPlaybackEvent(currentSong.id, "playback_finish");
    }

    const nextSongToPlay = getNextSongToPlay(queue, currentSong);
    const shouldWrapQueue = isRepeatEnabled && !nextSongToPlay && queue.length > 0;
    const songToPlay = nextSongToPlay ?? (shouldWrapQueue ? queue[0] : null);

    if (songToPlay) {
      const wasPlaying = isPlaying;

      setCurrentSong(songToPlay);
      setProgress(0);

      if (wasPlaying) {
        setPlaybackStart({
          timestamp: Date.now(),
          progressAtStart: 0,
        });
        await recordPlaybackEvent(songToPlay.id, "playback_start");
      }
    } else {
      setIsPlaying(false);
      setPlaybackStart(null);
    }
    
    isTransitioningRef.current = false;
      }, [
        currentSong,
        queue,
        isPlaying,
        isRepeatEnabled,
        setCurrentSong,
        setIsPlaying,
        setProgress,
        setPlaybackStart,
      ]);

  async function toggleLike() {
    if (!currentSong) return;
    if (!userId) return;
    await toggleLikedSong(userId, currentSong.id, !isLiked);
    setIsLiked(!isLiked);
  }

  async function handleAddToPlaylist(playlistId: number) {
    if (!currentSong) return;
    await addSongToPlaylist(playlistId, currentSong.id);
    if (dropdownRef.current) {
      dropdownRef.current.open = false;
    }
  }

  useEffect(() => {
    async function fetchPlaylists() {
      if (!userId) return;
      const userPlaylists = await getUserPlaylists(userId);
      setPlaylists(userPlaylists);
    }
    fetchPlaylists();
  }, [userId]);

  useEffect(() => {
    async function fetchSongs() {
      const songs = await getSongs(10);
      setQueue(songs);
      setCurrentSong(songs.length > 0 ? songs[0] : null);
      setProgress(0);
      setIsShuffled(false);
      setShuffleOrder(null);
      setShufflePosition(0);
      originalQueueRef.current = null;
    }
    fetchSongs();
  }, [setQueue, setCurrentSong, setProgress, setIsShuffled, setShuffleOrder, setShufflePosition]);

  useEffect(() => {
    async function checkLikedStatus() {
      if (!currentSong) return;
      if (!userId) return;
      hasFinishedRef.current = false;
      const isLiked = await checkIfSongIsLiked(userId, currentSong.id);
      setIsLiked(isLiked);
    }
    checkLikedStatus();
  }, [currentSong, userId]);

  useEffect(() => {
    if (!isPlaying || currentSong == null || playbackStart == null) return;

    const interval = setInterval(() => {
      if (isTransitioningRef.current) return;
      
      const elapsed = (Date.now() - playbackStart.timestamp) / 1000;
      const newProgress = playbackStart.progressAtStart + elapsed;

      if (newProgress >= currentSong.duration && !hasFinishedRef.current) {
        hasFinishedRef.current = true;
        setProgress(currentSong.duration);
        clearInterval(interval);
        nextSong(false);
      } else if (newProgress < currentSong.duration) {
        setProgress(newProgress);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, currentSong, playbackStart, nextSong, setProgress]);

  const duration = currentSong?.duration || 0;
  const remaining = duration - progress;

  return (
    <div className="flex items-center justify-between h-full pl-16 pr-4">
      <div className="flex items-center gap-3 w-64 min-w-64">
        {currentSong ? (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">
              {currentSong.name}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {currentSong.artist}
            </span>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No song playing</div>
        )}
      </div>

      <div className="flex flex-col items-center gap-1 flex-1 max-w-xl">
        <div className="flex items-center gap-2">
          <button
            className={`btn btn-circle btn-sm ${isShuffled ? "btn-primary" : "btn-ghost"}`}
            aria-label="Shuffle"
            onClick={toggleShuffleQueue}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 3l-8 8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h2a4 4 0 0 1 2.828 1.172L11 10.343" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 18h2a4 4 0 0 0 2.828-1.172L21 3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 21h5v-5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-8-8" />
            </svg>
          </button>

          <button className="btn btn-circle btn-sm btn-ghost" onClick={() => seekTo(0)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-2.34l6.945 3.968c1.25.714 2.805-.188 2.805-1.628V8.688c0-1.44-1.555-2.342-2.805-1.628L12 11.03v-2.34c0-1.44-1.555-2.343-2.805-1.629l-7.108 4.062c-1.26.72-1.26 2.536 0 3.256l7.108 4.061z" />
            </svg>
          </button>

          <button
            className="btn btn-circle btn-primary"
            onClick={togglePlayback}
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <button className="btn btn-circle btn-sm btn-ghost" onClick={() => nextSong(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L14.805 7.06C13.555 6.346 12 7.25 12 8.688v2.34L5.055 7.06z" />
            </svg>
          </button>

          <button
            className={`btn btn-circle btn-sm ${isRepeatEnabled ? "btn-primary" : "btn-ghost"}`}
            aria-label={isRepeatEnabled ? "Repeat queue on" : "Repeat queue off"}
            onClick={toggleRepeatQueue}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m17 1 4 4-4 4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 11V9a4 4 0 0 1 4-4h14" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m7 23-4-4 4-4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-gray-500 w-10 text-right">
            {formatDuration(progress)}
          </span>
          <input
            type="range"
            min={0}
            max={duration}
            value={progress}
            onChange={(e) => seekTo(Number(e.target.value))}
            className="range range-xs flex-1 cursor-pointer"
          />
          <span className="text-xs text-gray-500 w-10">
            -{formatDuration(remaining)}
          </span>
        </div>
      </div>
      <div className="w-64 min-w-64 flex items-center justify-end gap-2">
        <details className="dropdown dropdown-top" ref={dropdownRef}>
          <summary className="btn btn-circle btn-ghost btn-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow mb-2">
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <li key={playlist.id}>
                  <button onClick={() => handleAddToPlaylist(playlist.id)}>
                    {playlist.name}
                  </button>
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-sm p-2">No playlists</li>
            )}
          </ul>
        </details>
        <button
          className="btn btn-circle btn-ghost btn-sm"
          onClick={toggleLike}
          disabled={!currentSong}
        >
          {isLiked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-red-500"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}