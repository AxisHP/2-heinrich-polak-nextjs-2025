# Copilot Instructions

## Project Overview

A Spotify-like music streaming app built with **Next.js 15** (App Router), **Kysely** query builder, **SQLite**, and **DaisyUI/Tailwind CSS**. The app manages authors, albums, songs, playlists, and users.

## Tech Stack & Architecture

- **Next.js 15** with App Router and Turbopack (`npm run dev`)
- **Kysely** for type-safe SQL queries against SQLite (`db.sqlite`)
- **DaisyUI** component classes for UI (cards, modals, tables, dropdowns, buttons)
- **Server Actions** in `src/actions/` for mutations with `revalidatePath`/`redirect`

## Database Patterns

- Get DB connection: `const db = getDb()` from `@/lib/db`
- Types auto-generated in `src/lib/db-types.ts` - regenerate with `npm run db:codegen`
- Tables: `authors`, `albums`, `songs`, `playlists`, `playlists_songs`, `users`
- All migrations use raw SQL via `sql` template literal from Kysely

```ts
// Query example from src/app/playlist/[id]/page.tsx
const playlist = await db
  .selectFrom("playlists")
  .selectAll()
  .where("id", "=", playlistId)
  .executeTakeFirst();
```

## Component Patterns

- **Server Components** (default): Direct database queries, async functions
- **Client Components**: Use `"use client"` directive, for interactivity (modals, forms with refs)
- Modal pattern: Use `<dialog>` with `useRef<HTMLDialogElement>`, call `dialogRef.current?.showModal()`

```tsx
// Client modal pattern from src/app/playlists/CreatePlaylistModal.tsx
"use client";
const dialogRef = useRef<HTMLDialogElement>(null);
<button onClick={() => dialogRef.current?.showModal()}>Open</button>
<dialog ref={dialogRef} className="modal">...</dialog>
```

## Server Actions

Located in `src/actions/`, always start with `"use server"`:

- Use `formData.get("fieldName")` for form inputs
- Call `revalidatePath("/path")` after mutations to refresh data
- Call `redirect("/path")` for navigation after create/delete

## Dynamic Routes

- Pattern: `src/app/[entity]/[id]/page.tsx`
- Params are async: `params: Promise<{ id: string }>`, await then parse with `parseInt()`
- Always validate: `if (isNaN(entityId)) return <div>Invalid ID</div>`

## Key Commands

```bash
npm run dev              # Start dev server with Turbopack
npm run db:migrate:latest # Run pending migrations
npm run db:seed:run      # Seed database with faker data
npm run db:codegen       # Regenerate db-types.ts from schema
npm run db:migrate:make  # Create new migration file
```

## File Structure

```
src/
  actions/         # Server actions for mutations
  app/             # App Router pages and components
    [entity]/[id]/ # Dynamic route folders
  lib/
    db.ts          # Database connection (getDb)
    db-types.ts    # Auto-generated Kysely types
migrations/        # Kysely migration files (raw SQL)
seeds/             # Database seeding scripts
```
