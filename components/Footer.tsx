import Link from "next/link";
import { SITE, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-canvas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="font-script text-4xl">Stride</span>
            <p className="mt-3 max-w-xs text-sm text-canvas/70 leading-relaxed">
              Rwanda&apos;s premium streetwear label. Designed in Kigali. Built to
              outlast the trend cycle.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-accent-bright">
              {SITE.tagline}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={SITE.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="STRIDE on Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-line-ink text-canvas/80 hover:text-canvas hover:border-accent-bright transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                </svg>
              </a>
              <a
                href={whatsappLink("Hi STRIDE 👋")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="STRIDE on WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-full border border-line-ink text-canvas/80 hover:text-canvas hover:border-accent-bright transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.115z" />
                </svg>
              </a>
            </div>
          </div>

          <FooterCol title="Shop">
            <FooterLink href="/shop">All products</FooterLink>
            <FooterLink href="/shop?c=signature">Signature</FooterLink>
            <FooterLink href="/shop?c=essentials">Essentials</FooterLink>
            <FooterLink href="/shop?c=limited">Limited drops</FooterLink>
          </FooterCol>

          <FooterCol title="Help">
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/returns">Returns &amp; exchanges</FooterLink>
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
          </FooterCol>

          <FooterCol title="Order &amp; reach us">
            <a
              href={whatsappLink("Hi STRIDE 👋 I'd like to ask about an order.")}
              className="block text-sm text-canvas/75 hover:text-accent transition-colors"
            >
              WhatsApp {SITE.phoneDisplay}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="block text-sm text-canvas/75 hover:text-accent transition-colors"
            >
              {SITE.email}
            </a>
            <span className="block text-sm text-canvas/55">{SITE.location}</span>
            <span className="block text-xs text-canvas/45 pt-1">
              {SITE.responsePromise}
            </span>
          </FooterCol>
        </div>

        <div className="mt-12 pt-6 border-t border-line-ink flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-canvas/50">
            © {new Date().getFullYear()} STRIDE. All rights reserved.
          </p>
          <p className="text-xs text-canvas/40">
            Inspect before you pay · Cash &amp; MoMo on delivery
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-canvas/50 mb-4">
        {title}
      </h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block text-sm text-canvas/75 hover:text-accent transition-colors"
    >
      {children}
    </Link>
  );
}
