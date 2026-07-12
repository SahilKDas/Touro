import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Touro — Your tournament, in sync",
    description: "Live schedules, squad locations, and smarter tournament logistics in one place.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "Touro — Your tournament, in sync",
      description: "Live schedules, squad locations, and smarter tournament logistics in one place.",
      url: origin,
      siteName: "Touro",
      images: [{ url: `${origin}/og.png`, width: 1728, height: 906, alt: "Touro — Your tournament, in sync." }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Touro — Your tournament, in sync",
      description: "Live schedules, squad locations, and smarter tournament logistics in one place.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>{children}</body></html>;
}
