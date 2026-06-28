import { NextRequest, NextResponse } from "next/server";
import { tailorApplication } from "@/lib/tailor";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { resume, jobDescription } =
    body as Record<string, unknown>;

  if (!resume || typeof resume !== "string") {
    return NextResponse.json({ error: "resume is required and must be a string" }, { status: 400 });
  }
  if (!jobDescription || typeof jobDescription !== "string") {
    return NextResponse.json(
      { error: "jobDescription is required and must be a string" },
      { status: 400 }
    );
  }

  try {
    const result = await tailorApplication(resume, jobDescription);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/tailor]", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
