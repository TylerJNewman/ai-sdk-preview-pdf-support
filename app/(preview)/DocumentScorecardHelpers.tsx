interface ScoreDistributionProps {
  label: string;
  count: number;
  total: number;
  severityColor: string;
}

export function ScoreDistributionBar({ label, count, total, severityColor }: ScoreDistributionProps) {
  const width = total > 0 ? (count / total) * 300 : 0;

  return (
    <div className="flex items-center justify-between text-sm text-foreground">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <div
          className={`h-4 ${severityColor} rounded-sm`}
          style={{ width: `${width}px` }}
        />
        <span>{count}</span>
      </div>
    </div>
  );
} 