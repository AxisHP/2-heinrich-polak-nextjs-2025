import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar";
import { PlaybackBar } from "./PlaybackBar";
import { PlaybackContextProvider } from "./PlaybackContextProvider";
import { SideBar } from "./SideBar";

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
      > <PlaybackContextProvider>
          <div>
            <div className="pb-4 pr-64">
              {children}
            </div>
            <div className="fixed top-16 right-0 bottom-24 w-64 overflow-y-auto border-l border-base-300 bg-base-100 p-3 z-10">
              <SideBar />
            </div>
          </div>
          <div className="fixed top-0 left-0 right-0 z-30">
            <Navbar />
          </div>
          <div className="fixed h-24 bg-base-100 bottom-0 left-0 right-0 inset-shadow-sm z-30">
            <PlaybackBar />
          </div>
        </PlaybackContextProvider>
      </body>
    </html>
  );
}
