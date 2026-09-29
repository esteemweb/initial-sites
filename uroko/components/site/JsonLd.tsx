import { site } from "@/lib/content/site";

/** LocalBusiness structured data for search engines and map cards. */
export function StudioJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    name: site.name,
    alternateName: site.kanji,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    image: `${site.url}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.lines[0],
      addressLocality: "Naka-ku, Yokohama",
      addressRegion: "Kanagawa",
      postalCode: "231-0861",
      addressCountry: "JP",
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "12:00", closes: "20:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday"], opens: "12:00", closes: "18:00" },
    ],
    foundingDate: String(site.founded),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
