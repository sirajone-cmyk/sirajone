import React from "react";
import { cn } from "../../utils/cn";

export function Spinner({ className }) {
  return <span className={cn("spinner", className)} aria-hidden />;
}
