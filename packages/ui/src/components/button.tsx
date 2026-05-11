import * as React from "react";
import { cn } from "../lib/cn";

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={cn("rounded-xl px-4 py-2 font-semibold", props.className)} />;
}
