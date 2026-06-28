import type { TailoredOutput } from "@/lib/schema";
import MatchAnalysis from "./MatchAnalysis";
import CoverLetter from "./CoverLetter";
import ResumeChanges from "./ResumeChanges";

interface ResultsViewProps {
  result: TailoredOutput;
  onReset: () => void;
}

export default function ResultsView({ result, onReset }: ResultsViewProps) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-surface/90 backdrop-blur border-b border-line px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span
            className="text-[1.1rem] font-semibold tracking-tight text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tailr.
          </span>
          <button
            onClick={onReset}
            className="text-sm text-muted hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 rounded-lg px-2 py-1 cursor-pointer"
          >
            ← Start over
          </button>
        </div>
      </header>

      <main className="px-6 py-12">
        <div className="max-w-3xl mx-auto flex flex-col gap-6 motion-safe:animate-fade-up">
          <MatchAnalysis analysis={result.matchAnalysis} />
          <CoverLetter coverLetter={result.coverLetter} />
          <ResumeChanges changes={result.resumeChanges} />
        </div>
      </main>
    </div>
  );
}
