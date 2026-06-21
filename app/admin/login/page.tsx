"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") ?? "/admin";
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    if (res.ok) {
      router.replace(next);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-6 bg-ink text-canvas">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-script text-5xl">Stride</span>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-accent">
            Admin
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="rounded-[var(--radius-lg)] border border-line-ink bg-canvas/5 p-6 backdrop-blur"
        >
          <label htmlFor="passcode" className="block text-sm font-semibold mb-2">
            Passcode
          </label>
          <input
            id="passcode"
            type="password"
            autoFocus
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full h-11 rounded-[var(--radius-md)] border border-line-ink bg-ink px-4 text-canvas outline-none focus:border-accent transition-colors"
          />
          {error && (
            <p role="alert" className="mt-3 text-sm text-accent">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" className="w-full mt-5" disabled={loading}>
            {loading ? "Checking…" : "Enter dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
