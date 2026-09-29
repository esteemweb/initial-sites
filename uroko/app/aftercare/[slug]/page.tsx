import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, guides } from "@/lib/content/aftercare";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/aftercare/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  return g ? { title: g.title, description: g.summary } : {};
}

export default async function GuidePage({ params }: PageProps<"/aftercare/[slug]">) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const others = guides.filter((x) => x.slug !== g.slug);

  return (
    <>
      <article className="stage">
        <div className="stage-inner grid gap-12 lg:grid-cols-12">
          <header className="lg:col-span-4">
            <Link href="/aftercare" className="text-sm text-text-muted no-underline hover:underline">
              ← Aftercare
            </Link>
            <p lang="ja" className="mt-8 font-display text-5xl leading-none text-accent">
              {g.ja}
            </p>
            <h1 className="mt-6 text-3xl">{g.title}</h1>
            <p className="mt-4 text-text-muted">{g.summary}</p>
            <p className="mt-4 text-xs text-text-muted">{g.readMinutes} min read</p>
          </header>
          <div className="lg:col-span-7 lg:col-start-6">
            {g.sections.map((s) => (
              <section key={s.heading} className="border-t border-line py-8 first:border-t-0 first:pt-0">
                <h2 className="text-2xl">{s.heading}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="mt-4 max-w-prose text-lg text-text-muted">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </article>

      <section className="stage bg-surface-deep">
        <div className="stage-inner">
          <h2 className="text-2xl">More guides</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/aftercare/${o.slug}`} className="flex h-full flex-col border border-line bg-surface p-5 no-underline hover:border-text">
                  <span lang="ja" className="font-display text-2xl text-accent">
                    {o.ja}
                  </span>
                  <span className="mt-3 text-lg">{o.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
