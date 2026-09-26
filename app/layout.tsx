import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyNotion — Learn Coding Online",
  description:
    "StudyNotion ed-tech platform: online coding courses, instructor dashboards, cart & payments. Full-stack Next.js (App Router) + MongoDB.",
};

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter text-richblack-25">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
