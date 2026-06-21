import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { isAuthed } from "@/lib/admin-auth";

const BUCKET = "site-media";
const MAX_BYTES = 50 * 1024 * 1024; // 50MB
const ALLOWED = ["video/mp4", "video/webm", "video/quicktime"];

async function writeConfig(
  supabase: ReturnType<typeof getServiceSupabase>,
  cfg: Record<string, unknown>,
) {
  await supabase!.storage
    .from(BUCKET)
    .upload("config.json", Buffer.from(JSON.stringify(cfg)), {
      contentType: "application/json",
      upsert: true,
    });
}

async function readConfig(supabase: ReturnType<typeof getServiceSupabase>) {
  const { data } = await supabase!.storage.from(BUCKET).download("config.json");
  if (!data) return {} as Record<string, unknown>;
  try {
    return JSON.parse(await data.text()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Upload / replace the looped hero background video. */
export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not connected." }, { status: 503 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No video received." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Use an MP4 or WebM video." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Video is over 50MB. Please compress it (a short, web-optimised clip works best)." },
      { status: 400 },
    );
  }

  const ext = file.type === "video/webm" ? "webm" : "mp4";
  const path = `hero-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const cfg = await readConfig(supabase);
  // Best-effort cleanup of the previous hero file.
  const prev = typeof cfg.heroVideoUrl === "string" ? cfg.heroVideoUrl : "";
  const prevPath = prev.split(`/${BUCKET}/`)[1];
  if (prevPath && prevPath !== path) {
    await supabase.storage.from(BUCKET).remove([prevPath]).catch(() => {});
  }
  await writeConfig(supabase, { ...cfg, heroVideoUrl: data.publicUrl });

  return NextResponse.json({ heroVideoUrl: data.publicUrl }, { status: 201 });
}

/** Remove the hero video (revert to the gradient hero). */
export async function DELETE() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not connected." }, { status: 503 });
  }
  const cfg = await readConfig(supabase);
  const prev = typeof cfg.heroVideoUrl === "string" ? cfg.heroVideoUrl : "";
  const prevPath = prev.split(`/${BUCKET}/`)[1];
  if (prevPath) await supabase.storage.from(BUCKET).remove([prevPath]).catch(() => {});
  delete cfg.heroVideoUrl;
  await writeConfig(supabase, cfg);
  return NextResponse.json({ ok: true });
}
