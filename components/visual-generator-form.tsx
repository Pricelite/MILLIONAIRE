"use client";

import { useEffect, useMemo, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

type PastedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

export function VisualGeneratorForm() {
  const [prompt, setPrompt] = useState(
    "Creer un visuel propre et professionnel de chantier, style realiste, lumiere naturelle, haute qualite."
  );
  const [images, setImages] = useState<PastedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, [images]);

  useEffect(() => {
    if (!loading) return;
    setProgress(10);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const increment = prev < 50 ? 8 : 4;
        return Math.min(90, prev + increment);
      });
    }, 240);
    return () => clearInterval(timer);
  }, [loading]);

  const canSubmit = useMemo(() => prompt.trim().length >= 8 && !loading, [loading, prompt]);

  function appendFiles(files: File[]) {
    if (!files.length) return;
    setImages((prev) => {
      const kept = prev.slice(0, 5);
      const left = Math.max(0, 5 - kept.length);
      const next = files.slice(0, left).map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        previewUrl: URL.createObjectURL(file)
      }));
      return [...kept, ...next];
    });
  }

  function onFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;
    if (!fileList) return;
    appendFiles(Array.from(fileList).filter((file) => file.type.startsWith("image/")));
    event.target.value = "";
  }

  function onPaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const files = Array.from(event.clipboardData.items)
      .filter((item) => item.type.startsWith("image/"))
      .map((item) => item.getAsFile())
      .filter((file): file is File => Boolean(file));

    if (!files.length) return;
    event.preventDefault();
    appendFiles(files);
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const found = prev.find((item) => item.id === id);
      if (found) URL.revokeObjectURL(found.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  }

  async function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setResultUrl(null);

    try {
      const formData = new FormData();
      formData.append("prompt", prompt.trim());
      images.forEach((image) => formData.append("images", image.file));

      const res = await fetch("/api/visuals/generate", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Generation impossible");
      }

      const data = (await res.json()) as { image: string };
      setProgress(100);
      setResultUrl(data.image);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setTimeout(() => setProgress(0), 250);
      setLoading(false);
    }
  }

  return (
    <section className="card p-4">
      <h2 className="text-lg font-semibold">Visuel IA chantier</h2>
      <p className="mt-1 text-sm text-slate-600">
        Colle une ou plusieurs photos (Ctrl+V) puis genere un visuel marketing.
      </p>

      <form onSubmit={handleGenerate} className="mt-4 space-y-3">
        <textarea
          className="min-h-24 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: A partir de ces photos, creer une image propre avant/apres pour presenter le chantier au client."
        />

        <div
          onPaste={onPaste}
          className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4"
        >
          <p className="text-sm font-medium text-slate-700">
            Zone collage photo (Ctrl+V) ou upload
          </p>
          <p className="mt-1 text-xs text-slate-500">Maximum 5 images</p>
          <label className="btn-secondary mt-3 inline-flex cursor-pointer gap-2">
            <ImagePlus className="h-4 w-4" />
            Ajouter des photos
            <input
              className="hidden"
              type="file"
              accept="image/*"
              multiple
              onChange={onFileInputChange}
            />
          </label>

          {images.length ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {images.map((image) => (
                <div key={image.id} className="relative overflow-hidden rounded-lg border border-slate-200">
                  <img src={image.previewUrl} alt="Source" className="h-24 w-full object-cover" />
                  <button
                    type="button"
                    className="absolute right-1 top-1 rounded-md bg-white/90 p-1"
                    onClick={() => removeImage(image.id)}
                  >
                    <Trash2 className="h-4 w-4 text-slate-700" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <button type="submit" className="btn-primary" disabled={!canSubmit}>
          {loading ? "Generation visuel..." : "Generer visuel"}
        </button>

        {loading || progress > 0 ? (
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
              <span>Generation du visuel...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-brand-600 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}
      </form>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      {resultUrl ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-slate-700">Visuel genere</p>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <img src={resultUrl} alt="Visuel IA" className="w-full object-cover" />
          </div>
        </div>
      ) : null}
    </section>
  );
}

