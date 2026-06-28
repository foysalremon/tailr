"use client";

import { useState } from "react";
import type { TailoredOutput } from "@/lib/schema";

interface ResumeChangesProps {
  changes: TailoredOutput["resumeChanges"];
}

function assembleForClipboard(changes: TailoredOutput["resumeChanges"]): string {
  return changes
    .map((c) => `${c.section}\n${"─".repeat(c.section.length)}\n${c.revised}`)
    .join("\n\n");
}

export default function ResumeChanges({ changes }: ResumeChangesProps) {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(assembleForClipboard(changes));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // Clipboard API unavailable — fail silently
    }
  };

  return (
    <section
      className="rounded-2xl border border-line bg-surface overflow-hidden"
      aria-labelledby="resume-changes-heading"
    >
      <div className="px-6 py-4 border-b border-line flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <h2
            id="resume-changes-heading"
            className="text-sm font-semibold text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Resume Changes
          </h2>
          {changes.length > 0 && (
            <span className="text-xs text-muted">
              {changes.length} suggestion{changes.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {changes.length > 0 && (
          <button
            onClick={handleCopyAll}
            aria-label={copiedAll ? "All sections copied" : "Copy all revised sections"}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-line text-muted hover:text-ink hover:bg-canvas transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 shrink-0 cursor-pointer"
          >
            {copiedAll ? "All copied!" : "Copy all"}
          </button>
        )}
      </div>

      {changes.length === 0 ? (
        <div className="px-6 py-7">
          <p className="text-sm text-muted">
            Your resume is well-aligned for this role — no changes suggested.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {changes.map((change, idx) => (
            <li key={idx} className="px-6 py-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted mb-5">
                {change.section}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                <div className="flex flex-col gap-1.5">
                  <p className="text-[0.7rem] font-medium uppercase tracking-wider text-muted">
                    Original
                  </p>
                  <div className="px-3.5 py-3 rounded-xl bg-canvas border border-line text-[0.8125rem] text-muted leading-relaxed">
                    {change.original || (
                      <span className="italic">No original text provided.</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="text-[0.7rem] font-medium uppercase tracking-wider text-ink">
                    Revised
                  </p>
                  <div className="px-3.5 py-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[0.8125rem] text-ink leading-relaxed">
                    {change.revised}
                  </div>
                </div>
              </div>

              {/* Reason — prominent, not a footnote */}
              <div className="pl-3.5 border-l-2 border-accent">
                <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent mb-1">
                  Why this change
                </p>
                <p className="text-[0.8125rem] text-ink/80 leading-relaxed">
                  {change.reason}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
