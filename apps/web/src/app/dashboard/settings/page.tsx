import { Surface } from "@/components/ui/surface";
import { settingsBlocks } from "@/lib/mock-data";

export default function SettingsPage() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {settingsBlocks.map((block) => (
        <Surface key={block.title} className="space-y-3 p-4 md:p-5">
          <h3 className="text-lg font-bold text-white">{block.title}</h3>
          <div className="space-y-2">
            {block.items.map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200">
                <span>{item}</span>
                <button type="button" className="rounded-lg border border-white/10 px-2 py-1 text-xs text-zinc-300">
                  Configurer
                </button>
              </div>
            ))}
          </div>
        </Surface>
      ))}
    </div>
  );
}
