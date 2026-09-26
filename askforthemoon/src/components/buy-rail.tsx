"use client";

import { useEffect, useState } from "react";
import { Moon } from "./moon";
import { worldAt } from "@/lib/worlds";

/* A way to buy that is always near and never in front. Desktop: a vertical
   rail in the left margin, mirroring the moon on the right, inking itself for
   the ground beneath. Below 1024: a bar along the bottom (the page reserves its
   height so nothing rests under it). Both appear after the first screen and
   step aside while the buy section itself is on screen. */
export function BuyRail() {
  const [show, setShow] = useState(false);
  const [leftLit, setLeftLit] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let buyInView = false;
    const buy = document.getElementById("buy");
    const io = buy
      ? new IntersectionObserver(([e]) => {
          buyInView = e.isIntersecting;
          update();
        }, { threshold: 0.15 })
      : null;
    if (buy && io) io.observe(buy);

    let raf = 0;
    function update() {
      setShow(window.scrollY > window.innerHeight * 0.8 && !buyInView);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.round(Math.min(1, Math.max(0, window.scrollY / max)) * 200) / 200 : 1);
      const at = worldAt(window.scrollY + window.innerHeight / 2);
      setLeftLit(at > 0); // any join > 0 leaves page at the left edge
    }
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io?.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <a
        href="#buy"
        className="buy-rail label"
        data-show={show}
        data-ground={leftLit ? "page" : "night"}
        aria-label="Buy the hardback, £18.99"
        inert={!show}
      >
        Buy the hardback · £18.99
      </a>
      <div className="buy-bar" data-show={show} inert={!show}>
        {/* below 1024 the progress moon lives here, clear of every line of text */}
        <span
          className="bar-moon"
          role="progressbar"
          aria-label="Reading progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-valuetext={`${Math.round(progress * 100)}% read`}
        >
          <Moon lit={progress} size={20} />
        </span>
        <span className="label mr-auto">Hardback · £18.99</span>
        <a href="#buy" className="btn">
          Buy
        </a>
      </div>
    </>
  );
}
