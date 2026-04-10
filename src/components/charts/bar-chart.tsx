"use client";

import { BarChart as TremorBarChart } from "@tremor/react";

interface DataPoint {
  name: string;
  [key: string]: string | number;
}

interface BarChartProps {
  data: DataPoint[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (number: number) => string;
  className?: string;
  layout?: "vertical" | "horizontal";
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["blue"],
  valueFormatter,
  className,
  layout = "horizontal",
}: BarChartProps) {
  return (
    <TremorBarChart
      className={className}
      data={data}
      index={index}
      categories={categories}
      colors={colors}
      valueFormatter={valueFormatter}
      layout={layout}
      showLegend={true}
      showYAxis={true}
    />
  );
}
