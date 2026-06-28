"use client";

import { useState } from "react";
import type { TailoredOutput } from "@/lib/schema";

interface CoverLetterProps {
  coverLetter: TailoredOutput["coverLetter"];
}

export default function CoverLetter({ coverLetter }: CoverLetterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — do nothing silently
    }
  };

  return (
    <section
      className="rounded-2xl border border-line bg-surface overflow-hidden"
      aria-labelledby="cover-letter-heading"
    >
      <div className="px-6 py-4 border-b border-line flex items-center justify-between gap-4">
        <h2
          id="cover-letter-heading"
          className="text-sm font-semibold text-ink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Cover Letter
        </h2>
        <button
          onClick={handleCopy}
          aria-label={copied ? "Copied to clipboard" : "Copy cover letter"}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-line text-muted hover:text-ink hover:bg-canvas transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 shrink-0 cursor-pointer"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      <div className="px-6 py-7">
        <p className="text-[0.9rem] text-ink leading-[1.75] whitespace-pre-wrap">
          {coverLetter.body}
        </p>
      </div>
    </section>
  );
}
