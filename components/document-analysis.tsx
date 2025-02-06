import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DocumentAnalysis } from "@/lib/schemas";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentAnalysisProps {
  analysis: DocumentAnalysis;
  clearPDF: () => void;
}

export default function DocumentAnalysis({ analysis, clearPDF }: DocumentAnalysisProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Document Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Page Integrity */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Page Integrity</h3>
              <div className={`p-4 rounded-lg ${
                analysis.pageIntegrity.isComplete ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                <p>Total Pages: {analysis.pageIntegrity.totalPages}</p>
                <p>{analysis.pageIntegrity.isComplete ? "Document is complete" : "Document may have missing pages"}</p>
              </div>
              {!analysis.pageIntegrity.isComplete && analysis.pageIntegrity.missingPages.map((page, index) => (
                <div key={index} className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <p>Missing Page {page.expectedPageNumber}</p>
                  <p>Reason: {page.reason}</p>
                  <p>Risk Level: {Math.round(page.riskLevel)}%</p>
                </div>
              ))}
            </div>

            {/* Signature Status */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Signature Status</h3>
              <div className={`p-4 rounded-lg ${
                analysis.hasSignature ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                {analysis.hasSignature ? "Document is signed" : "Document is not signed"}
              </div>
            </div>

            {/* Expected Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Expected Fields</h3>
              {analysis.expectedFields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{field.fieldName}</span>
                    <span className={`text-sm ${
                      field.present ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {field.present ? "Present" : "Missing"}
                    </span>
                  </div>
                  {!field.present && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Risk Level</span>
                        <span>{field.riskLevel < 30 ? "Low" : field.riskLevel < 70 ? "Medium" : "High"}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gradient-to-r from-green-500 via-orange-400 to-red-500">
                        <div 
                          className="h-full rounded-full bg-background" 
                          style={{ 
                            width: `${100 - field.riskLevel}%`, 
                            marginLeft: `${field.riskLevel}%` 
                          }} 
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Notes */}
            {analysis.notes && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Additional Notes</h3>
                <p className="text-muted-foreground">{analysis.notes}</p>
              </div>
            )}

            {/* Actions */}
            <Button
              onClick={clearPDF}
              className="w-full mt-6"
            >
              <FileText className="mr-2 h-4 w-4" /> Analyze Another Document
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 