import type { TailoredOutput } from "@/lib/schema";

interface ResumeChangesProps {
  changes: TailoredOutput["resumeChanges"];
}

export default function ResumeChanges({ changes }: ResumeChangesProps) {
  return (
    <section className="rounded-2xl border border-line bg-surface overflow-hidden">
      <div className="px-6 py-4 border-b border-line flex items-baseline gap-2">
        <h2
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
              {/* Section label */}
              <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted mb-5">
                {change.section}
              </p>

              {/* Original → Revised */}
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
