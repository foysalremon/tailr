import { z } from "zod";

export const TailoredOutputSchema = z.object({
  matchAnalysis: z.object({
    overallFit: z.enum(["strong", "moderate", "weak"]),
    matchingSkills: z.array(z.string()),
    gaps: z.array(z.string()),
    summary: z.string(),
  }),
  coverLetter: z.object({
    body: z.string(),
  }),
  resumeChanges: z.array(
    z.object({
      section: z.string(),
      original: z.string(),
      revised: z.string(),
      reason: z.string(),
    })
  ),
});

export type TailoredOutput = z.infer<typeof TailoredOutputSchema>;
