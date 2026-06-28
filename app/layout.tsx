import type { Metadata } from "next";
import { Jost, Inter } from "next/font/google";
import "./globals.css";

const displayFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tailr — AI Resume Tailor",
  description:
    "Tailor your resume and cover letter to any job description with AI. Shows exactly what changed and why.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
