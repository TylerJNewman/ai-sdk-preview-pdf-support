"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Info, Menu, X } from "lucide-react"
import { z } from "zod"
import { documentAnalysisSchema } from "@/lib/schemas"

interface ScorecardItem {
  severity: "High" | "Medium" | "Low"
  category: string
  title: string
  extractionStatus: string
}

interface DocumentScorecardProps {
  analysis: z.infer<typeof documentAnalysisSchema>
  onClose?: () => void
}

export default function DocumentScorecard({ analysis, onClose }: DocumentScorecardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!analysis) {
    return (
      <div className="w-[400px] border rounded-sm shadow-sm bg-white p-4">
        <div className="text-gray-500 text-sm">No analysis data available</div>
      </div>
    );
  }

  // Convert analysis data into scorecard items
  const scorecardItems: ScorecardItem[] = analysis.expectedFields.map(field => ({
    severity: field.riskLevel < 30 ? "Low" : field.riskLevel < 70 ? "Medium" : "High",
    category: "Document Field",
    title: field.fieldName,
    extractionStatus: field.present ? "Extracted" : "No Extraction"
  }))

  // Calculate statistics
  const stats = {
    high: scorecardItems.filter(item => item.severity === "High").length,
    medium: scorecardItems.filter(item => item.severity === "Medium").length,
    low: scorecardItems.filter(item => item.severity === "Low").length,
    total: scorecardItems.length
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-500"
      case "Medium": return "bg-orange-400"
      case "Low": return "bg-green-500"
      default: return "bg-gray-400"
    }
  }

  return (
    <div className="w-[400px] border rounded-sm shadow-sm bg-card text-card-foreground mt-12 max-h-[calc(100vh-6rem)] flex flex-col">
      <div className="border-b p-2 flex items-center justify-between">
        <div className="text-foreground text-sm">Document Analysis Scorecard</div>
        <div className="flex gap-2">
          <button 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          {onClose && (
            <button 
              className="text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Menu className="h-5 w-5 text-foreground" />
            <h2 className="font-medium text-foreground">Risk Assessment</h2>
          </div>

          <div className="mb-6">
            <div className="text-sm text-muted-foreground mb-2">Risk Distribution</div>
            <div className="space-y-2">
              {[
                { label: "High", count: stats.high, width: (stats.high / stats.total) * 300 },
                { label: "Medium", count: stats.medium, width: (stats.medium / stats.total) * 300 },
                { label: "Low", count: stats.low, width: (stats.low / stats.total) * 300 }
              ].map((level) => (
                <div key={level.label} className="flex items-center justify-between text-sm text-foreground">
                  <span>{level.label} Risk</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className={`h-4 ${getSeverityColor(level.label)} rounded-sm`} 
                      style={{ width: `${level.width}px` }}
                    ></div>
                    <span>{level.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-foreground mb-4">Document Fields (Total: {stats.total})</div>

          <div className="space-y-3 mb-4 overflow-y-auto flex-1">
            {scorecardItems.map((item, i) => (
              <div key={i} className="border rounded-sm">
                <div className="flex">
                  <div className={`w-1 ${getSeverityColor(item.severity)}`}></div>
                  <div className="p-3 w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-${item.severity.toLowerCase()}-500 text-sm font-medium`}>
                        {item.severity} Risk
                      </span>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-muted-foreground text-xs mb-1">{item.category}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{item.title}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="h-4 w-4 rounded-full bg-secondary flex items-center justify-center text-[10px] text-secondary-foreground">
                        {item.extractionStatus === "Extracted" ? "✓" : "T"}
                      </div>
                      <span className="text-xs text-muted-foreground">{item.extractionStatus}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground mb-4">
            Last analyzed: {new Date().toLocaleString()}
          </div>

          <div className="flex items-center justify-between">
            <Select defaultValue="default">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Analysis Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Standard Analysis</SelectItem>
                <SelectItem value="detailed">Detailed Analysis</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              Reanalyze
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 