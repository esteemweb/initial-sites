"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Split } from "./split";
import { worldAt } from "@/lib/worlds";

/* The header is a Split too: it takes the join of whatever section sits beneath
   it (each carries data-at), so its words invert exactly like the page instead of
   guessing with a blend mode. It steps out of the way while you read down and
   comes back the moment you scroll up. */
export function HideOnScroll({ children, initialAt }: { children: ReactNode; initialAt: number }) {
  const [hidden, setHidden] = useState(false);
  const [at, setAt] = useState<number>(initialAt);
  const last = useRef(0);
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();


  useEffect(() => {
    const headerH = () => ref.current?.offsetHeight ?? 64;
    const update = () => {
      const y = window.scrollY;
      const dy = y - last.current;
      if (Math.abs(dy) >= 6) {
        setHidden(dy > 0 && y > 120);
        last.current = y;
      }
      setAt(worldAt(window.scrollY + headerH() - 1));
    };
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return (
    <header
      ref={ref}
      className="site-header"
      data-hidden={hidden}
      onFocusCapture={() => setHidden(false)}
    >
      <Split
        at={at}
        className="header-split"
        layerClassName="header-row"
      >
        {children}
      </Split>
    </header>
  );
}
