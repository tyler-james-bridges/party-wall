"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Confetti from "@/components/Confetti";
import config from "../../../party.config";
import type { Photo } from "@/lib/store";

export default function WallPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [current, setCurrent] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const knownIds = useRef<Set<string>>(new Set());
  const newQueue = useRef<Photo[]>([]);

  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/photos");
      const data: { photos: Photo[] } = await res.json();
      const fresh = data.photos.filter((p) => !knownIds.current.has(p.id));
      if (knownIds.current.size > 0 && fresh.length > 0) {
        newQueue.current.push(...fresh);
      }
      for (const p of data.photos) knownIds.current.add(p.id);
      setPhotos(data.photos);
    } catch {
      // transient network error; retry on next poll
    }
  }, []);

  useEffect(() => {
    poll();
    const id = setInterval(poll, config.pollIntervalSeconds * 1000);
    return () => clearInterval(id);
  }, [poll]);

  useEffect(() => {
    const id = setInterval(() => {
      setPhotos((prev) => {
        const fresh = newQueue.current[0];
        if (fresh) {
          const idx = prev.findIndex((p) => p.id === fresh.id);
          if (idx >= 0) {
            newQueue.current.shift();
            setCurrent(idx);
            setCelebrate(true);
            setTimeout(() => setCelebrate(false), 4000);
            return prev;
          }
        }
        if (prev.length > 0) setCurrent((c) => (c + 1) % prev.length);
        return prev;
      });
    }, config.slideDurationSeconds * 1000);
    return () => clearInterval(id);
  }, []);

  const photo = photos[current];

  return (
    <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden">
      {celebrate && <Confetti count={120} />}
      {photo ? (
        <figure
          key={photo.id}
          className="party-fly-in flex h-full w-full flex-col items-center justify-center gap-4 p-8"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/photos/${photo.filename}`}
            alt={photo.caption || "Party photo"}
            className="max-h-[80vh] max-w-[90vw] rounded-3xl object-contain shadow-2xl"
          />
          {(photo.caption || photo.uploadedBy) && (
            <figcaption className="text-center text-2xl">
              {photo.caption && <span className="font-bold">{photo.caption}</span>}
              {photo.uploadedBy && (
                <span className="opacity-70"> — {photo.uploadedBy}</span>
              )}
            </figcaption>
          )}
        </figure>
      ) : (
        <div className="party-fade text-center">
          <h1
            className="text-6xl font-extrabold"
            style={{ color: "var(--party-primary)" }}
          >
            {config.eventTitle}
          </h1>
          <p className="mt-4 text-2xl opacity-80">
            Scan the QR code to put your photos up here! 📸
          </p>
        </div>
      )}
      <div
        className="absolute bottom-4 right-6 rounded-full px-4 py-2 text-sm font-bold"
        style={{ background: "var(--party-primary)" }}
      >
        {photos.length} photo{photos.length === 1 ? "" : "s"} 🎈
      </div>
    </main>
  );
}
