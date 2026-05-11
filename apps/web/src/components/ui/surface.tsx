import { cn } from "./cn";

export function Surface({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-2xl border border-white/15 bg-zinc-900/72 shadow-[0_16px_40px_-28px_rgba(3,8,20,0.85)] backdrop-blur-sm",
        className
      )}
    />
  );
}
