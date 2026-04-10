"use client";

import { AreaChart as TremorAreaChart } from "@tremor/react";

interface DataPoint {
  date: string;
  [key: string]: string | number;
}

interface AreaChartProps {
  data: DataPoint[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (number: number) => string;
  className?: string;
}

export function AreaChart({
  data,
  index,
  categories,
  colors = ["blue", "slate"],
  valueFormatter,
  className,
}: AreaChartProps) {
  return (
    <TremorAreaChart
      className={className}
      data={data}
      index={index}
      categories={categories}
      colors={colors}
      valueFormatter={valueFormatter}
      showLegend={true}
      showYAxis={true}
      showGradient={true}
      startEndOnly={false}
    />
  );
}
