"use client";

import { useContext } from "react";
import { PlaybackContext } from "./playback-context";
import { getCurrentQueue } from "@/lib/playback";

export function SideBar() {
  const { isPlaying, currentSong, queue } = useContext(PlaybackContext);

  const currentQueue = getCurrentQueue(queue, currentSong);

  return (
    <div>
      <div>isPlaying: {isPlaying ? "true" : "false"}</div>
      <br />
      <div>
        <p className="pb-2">Playing:</p>
        {currentSong && (
          <div>
            <span className="text-sm font-medium truncate">{currentSong.name}</span>
            <br />
            <span className="text-xs text-gray-500 truncate pb-3">{currentSong.artist}</span>
          </div>
        )}
      </div>
      <br />
      <div>
        <p className="pb-2">Queue:</p>
        {currentQueue.length > 0 && (
          currentQueue.map((song) => (
            <div key={song.id}>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">{song.name}</span>
                <span className="text-xs text-gray-500 truncate pb-3">{song.artist}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}