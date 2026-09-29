import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="stage flex min-h-[60svh] items-center">
      <div className="stage-inner">
        <p lang="ja" className="font-display text-5xl leading-none text-accent">
          無
        </p>
        <h1 className="mt-6 text-3xl">Nothing here.</h1>
        <p className="mt-4 max-w-prose text-text-muted">The page you followed does not exist on this site.</p>
        <ButtonLink href="/" variant="secondary" className="mt-8">
          Back to the studio
        </ButtonLink>
      </div>
    </section>
  );
}
