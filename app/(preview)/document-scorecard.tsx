"use client"

import { useState } from "react"
import { z } from "zod"
import { ChevronDown, Info, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { documentAnalysisSchema } from "@/lib/schemas"

import { ScoreDistributionBar } from "./DocumentScorecardHelpers"  // example helper file

interface ScorecardItem {
  severity: "High" | "Medium" | "Low"
  category: string
  title: string
  extractionStatus: string
  riskLevel: number
  reason: string
  isExpanded?: boolean
}

interface DocumentScorecardProps {
  analysis: z.infer<typeof documentAnalysisSchema>
  onClose?: () => void
}

const severityColors: Record<ScorecardItem["severity"], string> = {
  High: "bg-red-500",
  Medium: "bg-orange-400",
  Low: "bg-green-500",
}

function getSeverityColor(severity: ScorecardItem["severity"]): string {
  return severityColors[severity] ?? "bg-gray-400";
}

export default function DocumentScorecard({ analysis, onClose }: DocumentScorecardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    extractionStatus: field.present ? "Extracted" : "Missing",
    riskLevel: field.riskLevel,
    reason: field.present 
      ? field.riskLevel > 70 
        ? `This field indicates significant issues that require immediate attention. The document may be non-compliant or invalid.`
        : field.riskLevel > 30
        ? `This field shows potential issues that should be reviewed. There may be compliance or validity concerns.`
        : `This field appears to meet all requirements and poses minimal risk.`
      : `Missing required field - this makes the document potentially invalid or non-compliant.`,
    isExpanded: false
  }))

  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Calculate statistics
  const highCount = scorecardItems.filter(item => item.severity === "High").length;
  const mediumCount = scorecardItems.filter(item => item.severity === "Medium").length;
  const lowCount = scorecardItems.filter(item => item.severity === "Low").length;
  
  const stats = {
    high: highCount,
    medium: mediumCount,
    low: lowCount,
    total: scorecardItems.length
  }

  return (
    <div className="w-[400px] border rounded-sm shadow-sm bg-card text-card-foreground mt-12 max-h-[calc(100vh-6rem)] flex flex-col">
      <div className="border-b p-2 flex items-center justify-between">
        <div className="text-foreground text-sm">Document Analysis Scorecard</div>
        <div className="flex gap-2">
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Toggle collapse"
            title="Toggle collapse"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          {onClose && (
            <button
              className="text-muted-foreground hover:text-foreground"
              onClick={onClose}
              aria-label="Close scorecard"
              title="Close"
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
            <p className="text-sm text-muted-foreground mb-2">Risk Distribution</p>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-sm w-[100px] text-left">High</span>
                <div className="w-[200px] relative">
                  <div className="absolute right-0 h-4 bg-red-500 rounded" style={{ width: `${(stats.high / stats.total) * 100}%` }}></div>
                </div>
                <span className="text-sm ml-4">{stats.high}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm w-[100px] text-left">Medium</span>
                <div className="w-[200px] relative">
                  <div className="absolute right-0 h-4 bg-orange-400 rounded" style={{ width: `${(stats.medium / stats.total) * 100}%` }}></div>
                </div>
                <span className="text-sm ml-4">{stats.medium}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm w-[100px] text-left">Low</span>
                <div className="w-[200px] relative">
                  <div className="absolute right-0 h-4 bg-green-500 rounded" style={{ width: `${(stats.low / stats.total) * 100}%` }}></div>
                </div>
                <span className="text-sm ml-4">{stats.low}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-foreground mb-4">
            Document Fields (Total: {stats.total})
          </p>

          <div className="space-y-3 mb-4 overflow-y-auto flex-1">
            {scorecardItems.map((item, i) => (
              <div key={i} className="border rounded-sm">
                <div className="flex">
                  <div className={`w-1 ${getSeverityColor(item.severity)}`} />
                  <div className="p-3 w-full">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-${item.severity.toLowerCase()}-500 text-sm font-medium`}>
                          {item.severity}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Risk Level: {item.riskLevel}%
                        </span>
                      </div>
                      <button 
                        onClick={() => toggleItem(i)}
                        className="hover:bg-secondary rounded-full p-1"
                      >
                        <ChevronDown 
                          className={`h-4 w-4 text-muted-foreground transition-transform ${
                            expandedItems[i] ? 'transform rotate-180' : ''
                          }`} 
                        />
                      </button>
                    </div>
                    <div className="text-muted-foreground text-xs mb-1">
                      {item.category}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground font-medium">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${
                        item.extractionStatus === "Extracted" 
                          ? "bg-green-500/20 text-green-700"
                          : "bg-red-500/20 text-red-700"
                      }`}>
                        {item.extractionStatus === "Extracted" ? "✓" : "!"}
                      </div>
                      <span className={`text-xs ${
                        item.extractionStatus === "Extracted"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}>
                        {item.extractionStatus}
                      </span>
                    </div>
                    {expandedItems[i] && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Risk Analysis:</span>
                          <p className="mt-1 text-xs leading-relaxed">{item.reason}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Recommended Action: </span>
                          {item.severity === "High" 
                            ? "Immediate attention required - document may be invalid"
                            : item.severity === "Medium"
                            ? "Review for compliance and validity concerns"
                            : "No immediate action needed"}
                        </div>
                      </div>
                    )}
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
            <Button>Reanalyze</Button>
          </div>
        </div>
      )}
    </div>
  )
}