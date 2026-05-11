import { clsx } from "clsx";

export function cn(...args: Array<string | false | null | undefined>): string {
  return clsx(args);
}
