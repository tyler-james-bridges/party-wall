"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import config from "../../party.config";

export default function Home() {
  const [uploadUrl, setUploadUrl] = useState("");

  useEffect(() => {
    setUploadUrl(`${window.location.origin}/upload`);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <h1
        className="text-5xl font-extrabold sm:text-6xl"
        style={{ color: "var(--party-primary)" }}
      >
        {config.eventTitle}
      </h1>
      <p className="max-w-md text-lg opacity-80">{config.eventSubtitle}</p>

      {uploadUrl && (
        <div className="rounded-3xl bg-white p-6 shadow-2xl">
          <QRCodeSVG value={uploadUrl} size={220} />
        </div>
      )}
      <p className="text-sm opacity-70">
        Guests: scan the code to add photos to the wall
      </p>

      <nav className="mt-4 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/wall"
          className="rounded-full px-8 py-4 text-lg font-bold text-white shadow-lg"
          style={{ background: "var(--party-primary)" }}
        >
          Open the Wall (TV)
        </Link>
        <Link
          href="/timeline"
          className="rounded-full px-8 py-4 text-lg font-bold shadow-lg"
          style={{ background: "var(--party-secondary)", color: "#1e1b4b" }}
        >
          {config.timelineTitle}
        </Link>
        <Link
          href="/upload"
          className="rounded-full border-2 px-8 py-4 text-lg font-bold"
          style={{ borderColor: "var(--party-primary)" }}
        >
          Add a Photo
        </Link>
      </nav>
    </main>
  );
}
