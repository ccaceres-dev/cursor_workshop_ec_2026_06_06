"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { filterChartPointsByRange } from "@/lib/markets/probability";
import type { ChartMode, ChartPoint, ChartRange } from "@/lib/markets/types";
import { cn } from "@/lib/utils";

const CHART_WIDTH = 640;
const CHART_HEIGHT = 220;
const PADDING = { top: 16, right: 16, bottom: 28, left: 40 };

const rangeOptions: ChartRange[] = ["7d", "30d", "all"];

const modeLabels: Record<ChartMode, string> = {
  aggregate: "Based on visible position totals.",
  ledger: "Derived from available ledger activity.",
  baseline_flat:
    "Showing a flat 50% baseline because market-wide history is unavailable under current access rules.",
};

function buildPath(points: ChartPoint[]): string {
  if (points.length === 0) {
    return "";
  }

  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const start = new Date(points[0].at).getTime();
  const end = new Date(points.at(-1)?.at ?? points[0].at).getTime();
  const span = Math.max(end - start, 1);

  return points
    .map((point, index) => {
      const x =
        PADDING.left +
        ((new Date(point.at).getTime() - start) / span) * innerWidth;
      const y =
        PADDING.top +
        innerHeight -
        (point.yesChancePercent / 100) * innerHeight;

      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export function ProbabilityChart({
  points,
  mode,
}: {
  points: ChartPoint[];
  mode: ChartMode;
}) {
  const [range, setRange] = useState<ChartRange>("all");
  const filteredPoints = useMemo(
    () => filterChartPointsByRange(points, range),
    [points, range],
  );
  const path = useMemo(() => buildPath(filteredPoints), [filteredPoints]);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Yes chance over time
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {modeLabels[mode]}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {rangeOptions.map((option) => (
            <Button
              key={option}
              type="button"
              size="xs"
              variant={range === option ? "default" : "outline"}
              onClick={() => setRange(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="mt-6 h-auto w-full"
        role="img"
        aria-label="Yes chance probability chart"
      >
        <title>Yes chance probability chart</title>
        {[0, 25, 50, 75, 100].map((tick) => {
          const y =
            PADDING.top +
            (CHART_HEIGHT - PADDING.top - PADDING.bottom) -
            (tick / 100) * (CHART_HEIGHT - PADDING.top - PADDING.bottom);

          return (
            <g key={tick}>
              <line
                x1={PADDING.left}
                x2={CHART_WIDTH - PADDING.right}
                y1={y}
                y2={y}
                className="stroke-border"
                strokeWidth="1"
              />
              <text
                x={PADDING.left - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {tick}%
              </text>
            </g>
          );
        })}
        <path
          d={path}
          fill="none"
          className={cn("stroke-chart-1")}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
