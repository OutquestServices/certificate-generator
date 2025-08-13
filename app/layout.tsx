import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Providers from "@/lib/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "InstantCertMailer • Bulk Certificate Generator & Email Sender",
    template: "%s | InstantCertMailer",
  },
  description:
    "Generate personalized certificates in bulk and send them directly from your own verified email addresses. Drag & drop designer, CSV merge, high‑resolution exports, and automated delivery via AWS SES.",
  keywords: [
    "bulk certificate generator",
    "certificate email sender",
    "personalized certificates",
    "custom from email",
    "AWS SES certificates",
    "mass certificate mailing",
    "Next.js app",
    "Prisma",
    "html2canvas export",
    "JSZip",
    // Additional relevant keywords
    "certificate automation",
    "bulk email certificates",
    "online certificate maker",
    "csv certificate generator",
    "digital certificate platform",
    "award certificate generator",
    "training certificate generator",
    "course completion certificates",
    "corporate recognition certificates",
    "mass personalized images",
    "dynamic image generation",
    "email attachment automation",
    "send certificates via email",
    "SES verified sender",
    "custom sender email",
    "Bulk Certificate Generator",
    "Email Sender",
    "react certificate designer",
  ],
  authors: [{ name: "Allenki Akshay" }],
  creator: "Allenki Akshay",
  publisher: "Allenki Akshay",
  metadataBase: new URL("https://www.instantcertmailer.in"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "InstantCertMailer • Bulk Certificate Generator & Email Sender",
    description:
      "Design once, personalize at scale, and send certificates from your own verified email (AWS SES). Fast CSV workflow & automated delivery.",
    url: "https://www.instantcertmailer.in/",
    siteName: "InstantCertMailer",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InstantCertMailer – Bulk Certificates & Email Sending",
    description:
      "Generate and mail personalized certificates in bulk using your custom verified email address.",
    creator: "@instantcertmailer", // update if actual handle differs
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-JQ20KKEJY2" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
