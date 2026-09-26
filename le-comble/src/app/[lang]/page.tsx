import { notFound } from "next/navigation";
import { isLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { HomePage } from "@/components/pages/home";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  return isLang(lang) ? pageMetadata(lang, "home") : {};
}

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return <HomePage lang={lang} />;
}
