import { getGeminiModel } from "./gemini";
import { TailoredOutputSchema, type TailoredOutput } from "./schema";

function buildPrompt(resume: string, jobDescription: string, validationError?: string): string {
  const base = `You are an expert technical recruiter and resume strategist.

Analyze the candidate's resume against the job description below and produce a structured response.

Rules you must follow:
- Be honest about fit. Flag real gaps; do NOT inflate qualifications to seem more positive.
- Never fabricate experience the candidate does not have.
- State platforms and technologies plainly — no evasive reframing (e.g. do not call "hobby project" "professional experience").
- Cover letter: clean, professional prose only. No fluff, no generic filler, no "I am excited to apply".
- Each resume change must target a specific section and include a concrete, actionable reason.

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
