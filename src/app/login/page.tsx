'use client';

import { handleLogin } from "@/actions/login";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-bold">Login</h1>
          <p className="text-gray-500 mt-2">
            Please log in to access your music library and playback history.
          </p>
        </div>
        <form className="flex flex-col gap-4" action={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            name="email"
            className="input input-bordered w-full"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-primary w-full">
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}