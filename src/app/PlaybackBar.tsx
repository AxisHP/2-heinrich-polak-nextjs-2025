"use client";

import { useState, useEffect, useRef } from "react";
import { toggleLikedSong, checkIfSongIsLiked } from "@/actions/liked_songs";
import { getUserPlaylists, addSongToPlaylist } from "@/actions/playlists";
import { getSongs } from "@/actions/songs";

interface Song {
  id: number;
  name: string;
  artist: string;
  duration: number;
}

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
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(87);
  const [isLiked, setIsLiked] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isShuffle, setIsShuffle] = useState(false);
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  const [playbackStart, setPlaybackStart] = useState<{
    timestamp: number;
    progressAtStart: number;
  } | null>(null);

  function startPlayback() {
    setPlaybackStart({
      timestamp: Date.now(),
      progressAtStart: progress,
    });
    setIsPlaying(true);
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

  function nextSong() {
    if (!currentSong || queue.length === 0) return;
    
    let nextSongToPlay: Song | null = null;
    
    if (isShuffle) {
      // Pick a random song from queue
      const randomIndex = Math.floor(Math.random() * queue.length);
      nextSongToPlay = queue[randomIndex];
    } else {
      // Pick next song in order
      const currentIndex = queue.findIndex(song => song.id === currentSong.id);
      if (currentIndex < queue.length - 1) {
        nextSongToPlay = queue[currentIndex + 1];
      }
    }
    
    if (nextSongToPlay) {
      setCurrentSong(nextSongToPlay);
      setProgress(0);
      if (isPlaying) {
        setPlaybackStart({
          timestamp: Date.now(),
          progressAtStart: 0,
        });
      }
    }
  }

  async function toggleLike() {
    if (!currentSong) return;
    const userId = 1;
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
      const userPlaylists = await getUserPlaylists(1);
      setPlaylists(userPlaylists);
    }
    fetchPlaylists();
  }, []);

  useEffect(() => {
    async function fetchSongs() {
      const songs = await getSongs(10);
      setQueue(songs);
      if (songs.length > 0) {
        setCurrentSong(songs[0]);
      }
    }
    fetchSongs();
  }, []);

  useEffect(() => {
    async function checkLikedStatus() {
      if (!currentSong) return;
      const isLiked = await checkIfSongIsLiked(1, currentSong.id);
      setIsLiked(isLiked);
    }
    checkLikedStatus();
  }, [currentSong]);

  useEffect(() => {
    if (!isPlaying || currentSong == null || playbackStart == null) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - playbackStart.timestamp) / 1000;
      const newProgress = playbackStart.progressAtStart + elapsed;

      if (newProgress >= currentSong.duration) {
        setProgress(currentSong.duration);
        nextSong();
      } else {
        setProgress(newProgress);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, currentSong, playbackStart]);

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
            className={`btn btn-circle btn-sm btn-ghost ${isShuffle ? 'text-primary' : ''}`}
            onClick={() => setIsShuffle(!isShuffle)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
              />
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

          <button className="btn btn-circle btn-sm btn-ghost" onClick={nextSong}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L14.805 7.06C13.555 6.346 12 7.25 12 8.688v2.34L5.055 7.06z" />
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