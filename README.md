# Tailr

AI-powered resume and cover letter tailor — paste your resume and a job description, get a structured fit analysis, a tailored cover letter, and specific resume edits with the reasoning behind each one.

![Tailr demo](./docs/demo.gif)

**Live demo:** [tailr-delta.vercel.app](https://tailr-delta.vercel.app)

---

## Why I built this

I'm a senior engineer actively job-hunting. Manually tailoring a resume and cover letter to each role is tedious — it's the same mental work done repeatedly, and most of what changes between applications is formulaic. Existing AI tools don't help much: they either rewrite your resume wholesale with no explanation of what changed, or produce a generic cover letter that reads like every other AI-generated one.

I wanted something different. A tool that shows exactly what changed and *why*, so I stay in control of the output rather than blindly trusting it. The transparency layer — the "why this change" reasoning on every suggestion — is a deliberate design choice, not an afterthought. It's what separates a useful tool from an autocomplete that happens to format like a resume.

---

## Architecture & key decisions

### Server-side API key handling
The Gemini API key never touches the browser. All calls to the Gemini API go through a Next.js API route (`/api/tailor`), which runs on the server. The client posts a resume and job description; the server calls Gemini, validates the response, and returns structured JSON. This means the key can't be extracted from network traffic or client-side JavaScript — a basic requirement for any app you'd deploy publicly.

### Structured output: Zod schema + Gemini JSON mode
There are two layers of output structure enforcement. First, Gemini's `responseMimeType: "application/json"` and `responseSchema` constrain the model at inference time — it's not asked to "return JSON", it's given a schema it must produce output conforming to. Second, that same shape is defined as a Zod schema in `lib/schema.ts`, which validates and types the response on the server before it ever reaches the client.

This matters because free-text parsing ("extract the JSON from this response") is brittle. The model might add markdown fences, wrap output in commentary, or subtly restructure the shape. Constrained generation sidesteps that entire class of failure. If Zod validation fails anyway, it's a genuine edge case worth surfacing, not a formatting accident.

### Validate-and-retry reliability loop
If Zod validation fails on the first response, the validation error is fed back to the model in a second prompt: "you returned this, it failed for this reason, return corrected valid JSON." If the second attempt also fails, the error is thrown cleanly and surfaced to the user with a specific, actionable message.

This self-correction loop costs one extra API call only on failure. It handles the long tail of edge cases — very long inputs, unusual resume formats, model responses that drift slightly from the schema — without adding complexity to the happy path.

### Why Gemini 2.5 Flash
Gemini 2.5 Flash is free-tier accessible, fast, and has a 1M token context window. A complete resume plus a full job description fits comfortably in a single call — no chunking, no retrieval, no multi-turn conversation management. For a structured single-call task, that simplicity is the right tradeoff. A larger model would cost more and be slower without meaningfully better output for this use case.

### No database in v1
Resume text persists in `localStorage`. Job descriptions don't. This was a deliberate scope decision, not a gap. The resume is stable — you update it infrequently. The job description is ephemeral — it belongs to a specific application you're working on right now. Adding a database would require auth, user accounts, and a session model. None of that is needed for the core workflow, and all of it adds surface area to maintain. If history, multi-device sync, or saved profiles become important, that's a clear v2 addition with a clear reason to add it.

### The reasoning layer
Every resume change includes a "why this change" explanation. The AI is explicitly instructed to justify each suggestion — not just produce output, but explain the rationale. The goal is to keep your judgment in the loop. You can read the reasoning, disagree with it, and decide what to apply. Unexplained AI output is a trust problem; explained AI output is a starting point for a decision.

---

## Tech stack

| | |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Validation** | Zod |
| **AI** | Google Gemini 2.5 Flash via `@google/generative-ai` |
| **Fonts** | Jost + Inter (Google Fonts via `next/font`) |

---

## Running locally

```bash
git clone https://github.com/your-username/tailr.git
cd tailr
npm install
cp .env.local.example .env.local
```

Open `.env.local` and add your Gemini API key:

```
GEMINI_API_KEY=your_key_here
```

Get a free key at [aistudio.google.com](https://aistudio.google.com). The free tier is sufficient for development and personal use.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Roadmap

Things I deliberately left out of v1, and why:

- **PDF export** — download the tailored cover letter and revised resume sections as a formatted PDF. Useful, but adds a PDF generation dependency and output formatting complexity that doesn't belong in the core loop.
- **Multi-resume profiles** — store several resume versions (engineering IC, tech lead, PM-adjacent) and select which to tailor from. Requires a database and auth; out of scope until the single-resume flow is proven.
- **Job URL import** — paste a job posting URL instead of raw text; scrape and parse it server-side. Fragile due to paywalls and bot detection on most job boards. Better handled with a browser extension in a later iteration.
- **Application history** — track past tailored outputs, letting you compare how different versions of your resume performed against different roles. Natural v2 feature once there's a storage layer.
- **Granular diff view** — show changes at the sentence or phrase level rather than per section, making it easier to see exactly what was reworded and why. Dependent on the model returning more structured change metadata.

The v1 focus is narrow on purpose: give the best possible tailoring output for a single resume + job pair, clearly explained, with no friction.
