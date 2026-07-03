"use client";

import { useRef, useState } from "react";
import Confetti from "@/components/Confetti";
import config from "../../../party.config";

export default function UploadPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");
  const [memoryMonth, setMemoryMonth] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setStatus("idle");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setStatus("sending");
    const form = new FormData();
    form.append("photo", file);
    form.append("caption", caption);
    form.append("uploadedBy", uploadedBy);
    if (memoryMonth) form.append("memoryMonth", memoryMonth);
    const res = await fetch("/api/photos", { method: "POST", body: form });
    if (!res.ok) {
      setStatus("error");
      return;
    }
    setStatus("done");
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setCaption("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center gap-6 p-6 text-center">
      {status === "done" && <Confetti />}
      <h1
        className="mt-4 text-3xl font-extrabold"
        style={{ color: "var(--party-primary)" }}
      >
        {config.eventTitle}
      </h1>
      <p className="opacity-80">Add a photo to the big screen 🎉</p>

      {status === "done" ? (
        <div className="flex flex-col items-center gap-6">
          <p className="text-2xl font-bold" style={{ color: "var(--party-secondary)" }}>
            It&apos;s on the wall! 🎈
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="rounded-full px-8 py-4 text-lg font-bold text-white"
            style={{ background: "var(--party-primary)" }}
          >
            Add another
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex w-full flex-col gap-4">
          <label
            className="flex min-h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-4 border-dashed p-4"
            style={{ borderColor: "var(--party-primary)" }}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="max-h-64 rounded-2xl" />
            ) : (
              <>
                <span className="text-5xl">📸</span>
                <span className="font-bold">Tap to snap or pick a photo</span>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onPick}
            />
          </label>

          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Say something sweet (optional)"
            maxLength={200}
            className="rounded-2xl bg-white/10 px-4 py-3 outline-none placeholder:opacity-50"
          />
          <input
            value={uploadedBy}
            onChange={(e) => setUploadedBy(e.target.value)}
            placeholder="Your name (optional)"
            maxLength={60}
            className="rounded-2xl bg-white/10 px-4 py-3 outline-none placeholder:opacity-50"
          />
          <label className="flex flex-col gap-1 text-left text-sm opacity-80">
            When is this memory from? (helps build the timeline)
            <input
              type="month"
              value={memoryMonth}
              onChange={(e) => setMemoryMonth(e.target.value)}
              className="rounded-2xl bg-white/10 px-4 py-3 outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={!preview || status === "sending"}
            className="rounded-full px-8 py-4 text-lg font-bold text-white disabled:opacity-40"
            style={{ background: "var(--party-primary)" }}
          >
            {status === "sending" ? "Sending…" : "Send it to the wall 🎉"}
          </button>
          {status === "error" && (
            <p className="text-red-300">Something went wrong — try again!</p>
          )}
        </form>
      )}
    </main>
  );
}
