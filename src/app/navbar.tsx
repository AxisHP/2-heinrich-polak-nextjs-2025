"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [searchInput, setSearchInput] = useState("");
  // const searchLinkQuery = searchInput !== "" ? { q: searchInput } : {};

  console.log(searchInput);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">Spotify</Link>
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
        <Link className="btn btn-primary text-xl" href={`{}`}>Search</Link>
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
              <Link className="justify-between" href="/profile">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li><Link href="/settings">Settings</Link></li>
            <li><Link href="/logout">Logout</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}