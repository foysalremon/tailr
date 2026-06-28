interface InputFormProps {
  resume: string;
  jobDescription: string;
  onResumeChange: (value: string) => void;
  onJobDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  error: string | null;
}

export default function InputForm({
  resume,
  jobDescription,
  onResumeChange,
  onJobDescriptionChange,
  onSubmit,
  error,
}: InputFormProps) {
  const canSubmit = resume.trim().length > 0 && jobDescription.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-surface border-b border-line px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-baseline gap-3">
          <span
            className="text-[1.1rem] font-semibold tracking-tight text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tailr.
          </span>
          <span className="text-sm text-muted hidden sm:inline">
            Your resume, tailored to every job.
          </span>
        </div>
      </header>

      <main className="flex-1 px-6 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1
              className="text-[2rem] font-semibold tracking-tight text-ink leading-tight mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Tailor your application
            </h1>
            <p className="text-muted text-[0.95rem] leading-relaxed max-w-xl">
              Paste your resume and the job posting below. Tailr will honestly
              assess your fit, write a cover letter, and suggest specific edits
              — with the reason for each change.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="resume"
                className="text-sm font-medium text-ink"
              >
                Your resume
              </label>
              <textarea
                id="resume"
                value={resume}
                onChange={(e) => onResumeChange(e.target.value)}
                placeholder="Paste your full resume here — work history, skills, education, and anything else relevant. The more detail, the better the tailoring."
                className="w-full h-72 px-4 py-3 rounded-xl border border-line bg-surface text-ink text-[0.875rem] leading-relaxed placeholder:text-muted/50 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              />
              {resume.trim().length > 0 && (
                <p className="text-xs text-muted">Auto-saved to your browser.</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="job-description"
                className="text-sm font-medium text-ink"
              >
                Job description
              </label>
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => onJobDescriptionChange(e.target.value)}
                placeholder="Paste the complete job posting — requirements, responsibilities, and any context about the team or role. Don't trim it."
                className="w-full h-72 px-4 py-3 rounded-xl border border-line bg-surface text-ink text-[0.875rem] leading-relaxed placeholder:text-muted/50 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 px-4 py-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm leading-relaxed"
            >
              {error}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={onSubmit}
              disabled={!canSubmit}
              className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-canvas disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Tailor my application
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
