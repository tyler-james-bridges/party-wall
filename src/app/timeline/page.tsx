import { listPhotos, type Photo } from "@/lib/store";
import config from "../../../party.config";

export const dynamic = "force-dynamic";

function monthLabel(iso: string): string {
  const [year, month] = iso.split("-").map(Number);
  if (!year || !month) return iso;
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default async function TimelinePage() {
  const photos = await listPhotos();
  const groups = new Map<string, Photo[]>();
  for (const photo of photos) {
    const key = photo.memoryMonth || photo.createdAt.slice(0, 7);
    const list = groups.get(key) ?? [];
    list.push(photo);
    groups.set(key, list);
  }
  const months = [...groups.keys()].sort();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="py-10 text-center">
        <h1
          className="text-5xl font-extrabold"
          style={{ color: "var(--party-primary)" }}
        >
          {config.timelineTitle}
        </h1>
        <p className="mt-3 text-lg opacity-80">
          A year of memories, built from everyone&apos;s photos ✨
        </p>
      </header>

      {months.length === 0 ? (
        <p className="text-center text-xl opacity-70">
          No memories yet — photos added to the wall show up here automatically.
        </p>
      ) : (
        <ol className="relative border-l-4 pl-8" style={{ borderColor: "var(--party-secondary)" }}>
          {months.map((month) => (
            <li key={month} className="party-fade mb-14">
              <span
                className="absolute -left-3 mt-1 h-5 w-5 rounded-full"
                style={{ background: "var(--party-secondary)" }}
              />
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--party-secondary)" }}
              >
                {monthLabel(month)}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {groups.get(month)!.map((photo) => (
                  <figure key={photo.id} className="flex flex-col gap-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/photos/${photo.filename}`}
                      alt={photo.caption || "Memory"}
                      className="aspect-square rounded-2xl object-cover shadow-lg"
                    />
                    {photo.caption && (
                      <figcaption className="text-sm opacity-80">
                        {photo.caption}
                        {photo.uploadedBy && (
                          <span className="opacity-60"> — {photo.uploadedBy}</span>
                        )}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
