import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border/50 bg-white dark:bg-slate-900",
        destructive: "border-destructive/50 bg-destructive/10",
        muted: "border-none bg-muted/50",
      },
      padding: {
        default: "p-6",
        sm: "p-4",
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export interface CardWrapperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function CardWrapper({
  className,
  variant,
  padding,
  ...props
}: CardWrapperProps) {
  return (
    <div
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  );
}
