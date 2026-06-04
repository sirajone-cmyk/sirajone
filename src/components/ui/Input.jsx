import React from "react";
import { cn } from "../../utils/cn";

export function Input({ className, ...props }) {
  return <input className={cn("input focus-ring", className)} {...props} />;
}
