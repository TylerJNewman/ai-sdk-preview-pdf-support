import { z } from "zod";

export const documentAnalysisSchema = z.object({
  hasSignature: z.boolean().describe("Whether the document contains a signature"),
  expectedFields: z.array(z.object({
    fieldName: z.string().describe("Name of the expected field"),
    present: z.boolean().describe("Whether the field is present in the document"),
    confidence: z.number().min(0).max(100).describe("Confidence level that this field is missing (0-100)")
  })),
  notes: z.string().optional().describe("Any additional notes about the document analysis")
});

export type DocumentAnalysis = z.infer<typeof documentAnalysisSchema>;
