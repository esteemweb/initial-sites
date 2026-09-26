import { SiteHeader } from "@/components/sections/site-header";
import { ImageZone } from "@/components/sections/image-zone";
import { Hero } from "@/components/sections/hero";
import { Principles } from "@/components/sections/principles";
import { Statement } from "@/components/sections/statement";
import { Work } from "@/components/sections/work";
import { Process } from "@/components/sections/process";
import { Studio } from "@/components/sections/studio";
import { Contact } from "@/components/sections/contact";

/* design-system §7 page architecture */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="relative overflow-x-clip focus:outline-none">
        <ImageZone>
          <Hero />
          <Principles />
          <Statement />
        </ImageZone>
        <Work />
        <Process />
        <Studio />
      </main>
      <Contact />
    </>
  );
}
