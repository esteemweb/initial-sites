"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="stage flex min-h-[60svh] items-center">
      <div className="stage-inner">
        <p lang="ja" className="font-display text-5xl leading-none text-accent">
          誤
        </p>
        <h1 className="mt-6 text-3xl">Something went wrong.</h1>
        <p className="mt-4 max-w-prose text-text-muted">
          The page hit an error while rendering. Nothing you entered has been charged or sent anywhere.
          {error.digest ? <span className="block font-mono text-sm">ref {error.digest}</span> : null}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={reset} variant="primary">
            Try again
          </Button>
          <ButtonLink href="/" variant="secondary">
            Back to the studio
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
