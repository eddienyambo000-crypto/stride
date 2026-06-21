import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-6 text-center">
      <div>
        <span className="font-script text-7xl text-accent">Oops</span>
        <h1 className="mt-2 font-display text-[clamp(2rem,8vw,4rem)]">Page not found</h1>
        <p className="mt-3 text-ink-soft max-w-sm mx-auto">
          The page you&apos;re looking for has strided off. Let&apos;s get you back.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <ButtonLink href="/" size="lg">Back home</ButtonLink>
          <ButtonLink href="/shop" variant="ghost" size="lg">Shop the collection</ButtonLink>
        </div>
      </div>
    </div>
  );
}
