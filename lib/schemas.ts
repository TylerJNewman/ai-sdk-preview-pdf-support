import { z } from "zod";

export const documentAnalysisSchema = z.object({
  hasSignature: z.boolean().describe("Whether the document contains a signature"),
  expectedFields: z.array(z.object({
    fieldName: z.string().describe("Name of the expected field"),
    present: z.boolean().describe("Whether the field is present in the document"),
    riskLevel: z.number().min(0).max(100).describe("Risk level for field detection (0-100, where 100 is highest risk)")
  })),
  notes: z.string().optional().describe("Any additional notes about the document analysis"),
  pageIntegrity: z.object({
    isComplete: z.boolean().describe("Whether the document appears to be complete with no missing pages"),
    totalPages: z.number().describe("Total number of pages detected in the document"),
    missingPages: z.array(z.object({
      expectedPageNumber: z.number().describe("The page number that appears to be missing"),
      riskLevel: z.number().describe("Risk level (0-100) that this page is actually missing"),
      reason: z.string().describe("Reason for believing this page is missing (e.g., 'Skip in page numbers', 'Broken content flow')")
    })).describe("Array of potentially missing pages")
  })
});

export type DocumentAnalysis = z.infer<typeof documentAnalysisSchema>;
