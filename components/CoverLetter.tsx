"use client";

import { useState } from "react";
import type { TailoredOutput } from "@/lib/schema";

interface CoverLetterProps {
  coverLetter: TailoredOutput["coverLetter"];
}

export default function CoverLetter({ coverLetter }: CoverLetterProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fail silently
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");

      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const margin = 22;
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const maxW = pageW - margin * 2;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const lineH = 6;
      const paraGap = 4;
      let y = margin;

      const paragraphs = coverLetter.body
        .split(/\n\n+/)
        .map((p) => p.replace(/\n/g, " ").trim())
        .filter(Boolean);

      for (const para of paragraphs) {
        const lines = doc.splitTextToSize(para, maxW);
        const blockH = lines.length * lineH;

        if (y + blockH > pageH - margin) {
          doc.addPage();
          y = margin;
        }

        doc.text(lines, margin, y);
        y += blockH + paraGap;
      }

      doc.save("cover-letter.pdf");
    } finally {
      setDownloading(false);
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

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            aria-label="Download cover letter as PDF"
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-line text-muted hover:text-ink hover:bg-canvas transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {downloading ? "Generating…" : "Download PDF"}
          </button>

          <button
            onClick={handleCopy}
            aria-label={copied ? "Copied to clipboard" : "Copy cover letter"}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-line text-muted hover:text-ink hover:bg-canvas transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 cursor-pointer"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      </div>

      <div className="px-6 py-7">
        <p className="text-[0.9rem] text-ink leading-[1.75] whitespace-pre-wrap">
          {coverLetter.body}
        </p>
      </div>
    </section>
  );
}
