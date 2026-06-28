import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { ResponseSchema } from "@google/generative-ai";

const tailorResponseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    matchAnalysis: {
      type: SchemaType.OBJECT,
      properties: {
        overallFit: {
          type: SchemaType.STRING,
          format: "enum",
          enum: ["strong", "moderate", "weak"],
        },
        matchingSkills: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        gaps: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        summary: { type: SchemaType.STRING },
      },
      required: ["overallFit", "matchingSkills", "gaps", "summary"],
    },
    coverLetter: {
      type: SchemaType.OBJECT,
      properties: {
        body: { type: SchemaType.STRING },
      },
      required: ["body"],
    },
    resumeChanges: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          section: { type: SchemaType.STRING },
          original: { type: SchemaType.STRING },
          revised: { type: SchemaType.STRING },
          reason: { type: SchemaType.STRING },
        },
        required: ["section", "original", "revised", "reason"],
      },
    },
  },
  required: ["matchAnalysis", "coverLetter", "resumeChanges"],
};

export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  return new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: tailorResponseSchema,
    },
  });
}
