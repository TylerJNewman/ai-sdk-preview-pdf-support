import { documentAnalysisSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";

export const maxDuration = 60;

const model = openai("gpt-4o-mini");
const anthropicModel = anthropic("claude-3-5-sonnet-20240620");
// const googleModel = google("gemini-1.5-pro-latest");
const googleModelLatest = google("gemini-2.0-flash");


export async function POST(req: Request) {
  const { files } = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: googleModelLatest,
    messages: [
      {
        role: "system",
        content:
          "You are a document analyzer. Your job is to analyze documents for signatures, expected fields, and page integrity. Check for any missing, blank, or corrupted pages. Examine page numbers, headers/footers, and content flow to detect potential missing pages. Also analyze for signatures and expected fields, determining if they are present and providing confidence levels for missing fields.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this document for completeness, missing pages, signatures, and expected fields. Check page numbers, content flow, and any signs of missing pages. Also determine which fields are present or missing, and provide confidence levels for missing fields.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: documentAnalysisSchema,
    onFinish({ usage }) {
      console.log('Token usage:', usage);
    },
  });

  return result.toTextStreamResponse();
}
