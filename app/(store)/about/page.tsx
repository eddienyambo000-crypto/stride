import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "STRIDE is a premium streetwear label designed in Kigali, Rwanda. Bold graphics, heavyweight quality, and a promise: inspect before you pay.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">
        The label
      </p>
      <h1 className="font-display text-[clamp(2.4rem,8vw,4.5rem)] leading-[0.95]">
        Average was never
        <br />
        the assignment.
      </h1>

      <div className="mt-8 space-y-5 text-lg text-ink-soft leading-relaxed">
        <p>
          STRIDE is a streetwear label born in Kigali, built for people who refuse
          to blend in. Every piece is a statement — bold graphics, heavyweight
          cotton, and a fit that carries itself.
        </p>
        <p>
          We started STRIDE because Rwanda&apos;s creative energy deserved a label
          that matched it. No watered-down designs, no flimsy fabric. Just pieces
          worth conquering for.
        </p>
        <p>
          And because trust matters, we built our store around a simple promise:{" "}
          <span className="font-semibold text-ink">
            you inspect your order before you pay
          </span>
          . Our rider brings it to you, you check the fit and the quality, and only
          then does any money change hands.
        </p>
      </div>

      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        <Stat value="Kigali" label="Designed & based in" />
        <Stat value="Heavyweight" label="Premium cotton only" />
        <Stat value="Pay on delivery" label="Inspect before you pay" />
      </div>

      <div className="mt-12 rounded-[var(--radius-lg)] bg-ink text-canvas p-8 text-center">
        <span className="font-script text-5xl">Stride to conquer</span>
        <p className="mt-4 text-canvas/70">
          New graphics drop regularly. Limited pieces sell out fast.
        </p>
        <div className="mt-6">
          <ButtonLink href="/shop" size="lg">Shop the collection</ButtonLink>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        Questions? WhatsApp {SITE.phoneDisplay} · {SITE.email}
      </p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-line bg-canvas-soft p-5 text-center">
      <p className="font-display text-2xl text-accent">{value}</p>
      <p className="mt-1 text-sm text-ink-soft">{label}</p>
    </div>
  );
}
