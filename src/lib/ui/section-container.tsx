import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export function SectionContainer({
  className,
  as: Component = "section",
  ...props
}: SectionContainerProps) {
  return (
    <Component
      className={cn("flex flex-col gap-4 py-4 w-full", className)}
      {...props}
    />
  );
}
