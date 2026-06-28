import type { TailoredOutput } from "@/lib/schema";

interface MatchAnalysisProps {
  analysis: TailoredOutput["matchAnalysis"];
}

const FIT = {
  strong:   { label: "Strong Match",   color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
  moderate: { label: "Moderate Match", color: "#B45309", bg: "#FFFBEB", border: "#FDE68A" },
  weak:     { label: "Weak Match",     color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
} as const;

export default function MatchAnalysis({ analysis }: MatchAnalysisProps) {
  const fit = FIT[analysis.overallFit];

  return (
    <section
      className="rounded-2xl overflow-hidden border"
      style={{ borderColor: fit.border, backgroundColor: fit.bg }}
      aria-labelledby="match-analysis-heading"
    >
      {/* Color bar — the one bold stroke */}
      <div className="h-1.5" style={{ backgroundColor: fit.color }} />

      <div className="px-7 pt-7 pb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
          Match Analysis
        </p>

        {/* Fit result — signature element */}
        <h2
          id="match-analysis-heading"
          className="text-[2.75rem] sm:text-[3.25rem] font-bold tracking-tight leading-none mb-5"
          style={{ fontFamily: "var(--font-display)", color: fit.color }}
        >
          {fit.label}
        </h2>

        <p className="text-[0.9375rem] text-ink/80 leading-relaxed mb-8 max-w-prose">
          {analysis.summary}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
              Matching skills
            </h3>
            {analysis.matchingSkills.length === 0 ? (
              <p className="text-sm text-muted">None identified.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {analysis.matchingSkills.map((skill) => (
                  <li key={skill} className="flex items-start gap-2 text-sm text-ink">
                    <span className="mt-px text-xs font-bold shrink-0 text-[#16A34A]" aria-hidden>
                      ✓
                    </span>
                    {skill}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
              Gaps
            </h3>
            {analysis.gaps.length === 0 ? (
              <p className="text-sm text-muted">No significant gaps found.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {analysis.gaps.map((gap) => (
                  <li key={gap} className="flex items-start gap-2 text-sm text-ink">
                    <span className="mt-px text-xs font-bold shrink-0 text-[#DC2626]" aria-hidden>
                      ✕
                    </span>
                    {gap}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
