import { getGeminiModel } from "./gemini";
import { TailoredOutputSchema, type TailoredOutput } from "./schema";

function buildPrompt(resume: string, jobDescription: string, validationError?: string): string {
  const base = `You are an expert technical recruiter and resume strategist working directly with a job applicant.

The resume and job description below belong to the person you are helping — write everything in first person, as if speaking directly to them ("you", "your", "you have", "you're missing"). Never refer to them as "the candidate" or any other third-person label.

Rules you must follow:
- Be honest about fit. Flag real gaps; do NOT inflate qualifications to seem more positive.
- Never fabricate experience that isn't in the resume.
- State platforms and technologies plainly — no evasive reframing (e.g. do not call a hobby project "professional experience").
- Cover letter: write it in first person as the applicant ("I", "my", "I have"). Clean, professional prose — no fluff, no "I am excited to apply".
- Resume changes: write the revised text as the applicant would write it ("Led a team of…", "Built and maintained…"). The reason for each change should address the applicant directly ("This highlights your…", "Recruiters will look for…").
- Match analysis summary: address the applicant directly ("Your background aligns…", "You have strong experience in…", "You're missing…").

--- RESUME ---
${resume}

--- JOB DESCRIPTION ---
${jobDescription}`;

  if (validationError) {
    return `${base}

Your previous response failed schema validation with this error:
${validationError}

Return corrected, fully valid JSON that satisfies the required schema.`;
  }

  return base;
}

async function callAndValidate(prompt: string): Promise<TailoredOutput> {
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = JSON.parse(text);
  return TailoredOutputSchema.parse(parsed);
}

export async function tailorApplication(
  resume: string,
  jobDescription: string
): Promise<TailoredOutput> {
  const firstPrompt = buildPrompt(resume, jobDescription);

  try {
    return await callAndValidate(firstPrompt);
  } catch (firstError) {
    const errorMessage =
      firstError instanceof Error ? firstError.message : String(firstError);

    try {
      return await callAndValidate(buildPrompt(resume, jobDescription, errorMessage));
    } catch (secondError) {
      throw new Error(
        `Gemini returned invalid output after two attempts: ${
          secondError instanceof Error ? secondError.message : String(secondError)
        }`
      );
    }
  }
}
