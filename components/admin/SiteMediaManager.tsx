"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function SiteMediaManager({
  heroVideoUrl,
  editable,
}: {
  heroVideoUrl?: string;
  editable: boolean;
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  function upload(file: File) {
    setError(null);
    setUploading(true);
    setProgress(0);
    const fd = new FormData();
    fd.append("file", file);
    // XHR for upload progress feedback (big files).
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/site-media");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      setUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        router.refresh();
      } else {
        try {
          setError(JSON.parse(xhr.responseText).error ?? "Upload failed.");
        } catch {
          setError("Upload failed.");
        }
      }
    };
    xhr.onerror = () => {
      setUploading(false);
      setError("Network error during upload.");
    };
    xhr.send(fd);
  }

  async function remove() {
    if (!confirm("Remove the hero background video?")) return;
    setRemoving(true);
    await fetch("/api/admin/site-media", { method: "DELETE" });
    setRemoving(false);
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Site appearance</h1>
      <p className="text-sm text-muted mt-1">
        Manage the homepage hero background video. It plays muted and loops.
      </p>

      {!editable && (
        <div className="mt-6 rounded-[var(--radius-md)] border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-ink-soft">
          <span className="font-semibold text-warning">Demo mode.</span> Connect
          Supabase to manage site media.
        </div>
      )}

      <div className="mt-6 max-w-xl rounded-[var(--radius-lg)] border border-line bg-canvas p-6">
        <h2 className="font-semibold">Hero background video</h2>

        <div className="mt-4 relative aspect-video overflow-hidden rounded-[var(--radius-md)] border border-line bg-ink">
          {heroVideoUrl ? (
            <video
              src={heroVideoUrl}
              className="h-full w-full object-cover"
              muted
              loop
              autoPlay
              playsInline
              controls
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-canvas/60 text-sm">
              No video yet — the hero shows the default gradient.
            </div>
          )}
        </div>

        {uploading && (
          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-canvas-soft overflow-hidden">
              <div
                className="h-full bg-accent transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted">Uploading… {progress}%</p>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}

        {editable && (
          <div className="mt-5 flex flex-wrap gap-3">
            <label
              className={cn(
                "inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent text-white text-sm font-semibold px-5 py-2.5 cursor-pointer hover:bg-accent-deep transition-colors",
                uploading && "opacity-60 pointer-events-none",
              )}
            >
              {heroVideoUrl ? "Replace video" : "Upload video"}
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                  e.target.value = "";
                }}
              />
            </label>
            {heroVideoUrl && (
              <button
                type="button"
                onClick={remove}
                disabled={removing}
                className="rounded-[var(--radius-md)] border border-line text-sm font-semibold px-4 text-ink-soft hover:border-danger hover:text-danger transition-colors cursor-pointer disabled:opacity-50"
              >
                {removing ? "Removing…" : "Remove"}
              </button>
            )}
          </div>
        )}

        <ul className="mt-5 text-xs text-muted space-y-1">
          <li>• MP4 or WebM, up to 50MB. A short 8–15s loop works best.</li>
          <li>• Plays muted &amp; looped. Keep it subtle — text sits on top.</li>
          <li>• Tip: a 1080p, web-compressed clip loads fastest on mobile data.</li>
        </ul>
      </div>
    </div>
  );
}
