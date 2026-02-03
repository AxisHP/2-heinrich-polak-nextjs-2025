import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar";
import { PlaybackBar } from "./PlaybackBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotify by Heinrich Polak",
  description: "Listen to your music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="pb-4">{children}</div>
        <div className="fixed top-0 left-0 right-0">
          <Navbar />
        </div>
        <div className="fixed h-24 bg-base-100 bottom-0 left-0 right-0 inset-shadow-sm">
          <PlaybackBar />
        </div>
      </body>
    </html>
  );
}
