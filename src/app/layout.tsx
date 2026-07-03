import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import config from "../../party.config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: config.eventTitle,
  description: config.eventSubtitle,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = config;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased min-h-screen`}
        style={
          {
            "--party-primary": theme.primary,
            "--party-secondary": theme.secondary,
            "--party-bg": theme.background,
            "--party-text": theme.text,
            background: theme.background,
            color: theme.text,
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
