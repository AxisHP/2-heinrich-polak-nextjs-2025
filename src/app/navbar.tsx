"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { PlaybackContext } from "./playback-context";
import { handleLogout } from '@/actions/login'

export default function Navbar() {
  const playbackContext = useContext(PlaybackContext);
  const { isPlaying, dummy, setDummy } = playbackContext;
  const [searchInput, setSearchInput] = useState("");
  // const searchLinkQuery = searchInput !== "" ? { q: searchInput } : {};

  console.log(searchInput);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <div>isPlaying: {isPlaying ? "true" : "false"}</div>
        <div>Dummy: {dummy}</div>
        <button className="btn btn-xs" onClick={() => setDummy(dummy + 1)}>
          +
        </button>
        <Link href="/" className="btn btn-ghost text-xl">Spotify</Link>
        <Link href="/playlists" className="btn btn-ghost">Playlists</Link>
        <Link href="/liked_songs" className="btn btn-ghost">Liked songs</Link>
        <Link href="/history" className="btn btn-ghost">History</Link>
        <Link href='/login' className="btn btn-ghost">Login</Link>
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Search" 
          className="input input-bordered w-24 md:w-auto" 
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              window.location.href = `/search?q=${encodeURIComponent(searchInput)}`;
            }
          }}
        />
        <Link className="btn btn-primary text-xl" href={`/search?q=${encodeURIComponent(searchInput)}`}>Search</Link>
      </div>
      <div className="flex-none gap-2">

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <Image
                alt="Tailwind CSS Navbar component"
                src="/pfp.webp"
                width={40}
                height={40}
              />
            </div>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li>
              <Link className="justify-between" href="/">
                Profile</Link>
            </li>
            <li><Link href="/settings">Settings</Link></li>
            <li><button onClick={() => handleLogout()}>Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}