export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14 sm:py-20">
      <h1 className="font-display text-[clamp(2rem,6vw,3.25rem)]">{title}</h1>
      <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>
      <div className="mt-8 space-y-1">{children}</div>
    </div>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-xl mt-8 mb-2">{children}</h2>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-ink-soft leading-relaxed mb-3">{children}</p>;
}

export function UL({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5 text-ink-soft mb-3">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
