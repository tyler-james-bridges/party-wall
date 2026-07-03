# party-wall

A live party photo wall + auto-generated memory timeline. Portable and reusable for any event.

- **Guests scan a QR code** → upload photos from their phones (no app installs)
- **Photos appear live on the TV** slideshow with confetti when new ones land
- **A memory timeline builds itself** from the same photos, grouped by month — e.g. "Her Year in Three" for a 3rd birthday

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the home page shows the QR code guests scan. Put `/wall` on the TV (laptop + HDMI or cast) and hand out the QR.

## Make it yours

All personalization lives in one file: [`party.config.ts`](party.config.ts)

```ts
honoree: "Nora",
age: 3,
eventTitle: "Happy 3rd Birthday Nora!",
timelineTitle: "Nora's Year in Three",
theme: { primary: "#f472b6", secondary: "#fbbf24", ... },
```

Change the config, restart — new event. Works for birthdays, holidays, reunions, anything.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Host home — QR code + links |
| `/upload` | Phone-first guest upload (photo, caption, name, memory month) |
| `/wall` | Fullscreen TV slideshow, polls for new photos, celebrates arrivals |
| `/timeline` | Auto-generated memory timeline grouped by month |

## Storage

Photos and metadata are stored on the local filesystem (`data/` by default, override with `PARTY_WALL_DATA_DIR`). No database, no cloud dependencies — run it on a laptop on your home wifi and everything stays in your house. The `data/` folder afterward *is* your keepsake album.

## Notes

- Guests must be on the same network as the host (home wifi) or the app must be deployed somewhere reachable.
- For deployment on serverless platforms you'd want to swap the filesystem store (`src/lib/store.ts`) for blob storage — the store module is the only thing to change.
