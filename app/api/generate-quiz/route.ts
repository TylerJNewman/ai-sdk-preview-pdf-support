import { documentAnalysisSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { files } = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content:
          "You are a document analyzer. Your job is to analyze documents for signatures and expected fields, determining if they are present and providing confidence levels for missing fields.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this document for signatures and expected fields. Determine which fields are present or missing, and provide confidence levels for missing fields.",
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
  });

  return result.toTextStreamResponse();
}
