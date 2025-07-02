import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import StructuredData from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Probabl - Master Behavioral Economics Through Gaming",
  description: "Beat cognitive biases and earn legendary badges in the ultimate behavioral economics game. Learn from Kahneman, Thaler, and Annie Duke through poker, trading, and decision-making challenges.",
  keywords: [
    "behavioral economics",
    "cognitive biases",
    "decision making",
    "poker psychology",
    "trading psychology",
    "Daniel Kahneman",
    "Richard Thaler",
    "gamification",
    "educational games",
    "probability"
  ],
  authors: [{ name: "Probabl" }],
  creator: "Probabl",
  publisher: "Probabl",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://probabl.xyz",
    siteName: "Probabl",
    title: "Probabl - Master Behavioral Economics Through Gaming",
    description: "Beat cognitive biases and earn legendary badges in the ultimate behavioral economics game. Learn from Kahneman, Thaler, and Annie Duke.",
    images: [
      {
        url: "https://probabl.xyz/og-image.png",
        width: 1200,
        height: 630,
        alt: "Probabl - Behavioral Economics Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Probabl - Master Behavioral Economics Through Gaming",
    description: "Beat cognitive biases and earn legendary badges. Learn decision-making from poker, trading, and behavioral economics legends.",
    images: ["https://probabl.xyz/og-image.png"],
    creator: "@probabl",
  },
  verification: {
    google: "your-google-site-verification-code",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#8B5CF6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://probabl.xyz" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#8B5CF6" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <StructuredData />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
