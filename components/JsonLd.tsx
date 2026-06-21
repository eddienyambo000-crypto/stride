/** Renders a JSON-LD <script> for structured data (SEO rich results). */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Data is server-built from trusted catalog content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
