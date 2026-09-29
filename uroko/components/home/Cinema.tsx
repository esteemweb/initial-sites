"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Home page motion, kept to what carries content:
 * - smooth wheel scrolling on desktop (phones scroll natively);
 * - the "how the work is done" chapters, pinned, each revealing over the last;
 * - the six-motif strip, pinned, one card at a time.
 * The chapter change is the only masked reveal on the page (the user asked for
 * it): scrubbed to scroll, never an entrance animation. No other text reveals or
 * parallax; the other decorative moment is the 3D emblem (Emblem3D). Under
 * prefers-reduced-motion nothing animates and the chapters swap instantly.
 */
export function Cinema() {
  useEffect(() => {
    // Reduced motion: no smooth scrolling and no animation, but the chapters must
    // still all be reachable on desktop, so they pin and swap instantly.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const mmReduced = gsap.matchMedia();
      mmReduced.add("(min-width: 1024px)", () => {
        const services = document.querySelector<HTMLElement>("[data-services]");
        if (!services) return;
        const chapters = [...services.querySelectorAll<HTMLElement>("[data-chapter]")];
        const frames = [...services.querySelectorAll<HTMLElement>("[data-frame]")];
        gsap.set(services.querySelectorAll("[data-word], [data-label], [data-point]"), { y: 0, yPercent: 0, autoAlpha: 1 });
        gsap.set(frames, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(services.querySelector("[data-progress]"), { scaleY: 1 });
        const show = (k: number) => {
          chapters.forEach((c, i) => gsap.set(c, { autoAlpha: i === k ? 1 : 0 }));
          frames.forEach((f, i) => gsap.set(f, { autoAlpha: i === k ? 1 : 0 }));
        };
        show(0);
        ScrollTrigger.create({
          trigger: services,
          start: "top top",
          end: `+=${chapters.length * 100}%`,
          pin: true,
          onUpdate: (self) => show(Math.min(chapters.length - 1, Math.floor(self.progress * chapters.length))),
        });
      });
      return () => mmReduced.revert();
    }

    const finePointer = matchMedia("(pointer: fine)").matches;
    const lenis = finePointer
      ? new Lenis({ duration: 1.2, smoothWheel: true, syncTouch: false, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
      : null;
    const tick = (t: number) => lenis?.raf(t * 1000);
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(1000, 16);
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Visiting: the street photo pushes in slowly and drifts as the section passes (all widths)
      const visit = document.querySelector<HTMLElement>("[data-visit]");
      const visitPhoto = visit?.querySelector<HTMLElement>("[data-visit-photo]");
      if (visit && visitPhoto) {
        gsap.fromTo(
          visitPhoto,
          { scale: 1.22, yPercent: -4 }, // stays zoomed past 1.08 so the 4% drift never shows an edge
          { scale: 1.1, yPercent: 4, ease: "none", scrollTrigger: { trigger: visit, start: "top bottom", end: "bottom top", scrub: true } },
        );
      }

      // Pins are created in page order (motif strip, then chapters) so each one's
      // start is measured after the pinned length above it exists.
      mm.add("(min-width: 1024px)", () => {
        // Motif strip: pinned; the column moves one card per step
        const strip = document.querySelector<HTMLElement>("[data-filmstrip]");
        if (!strip) return;
        const cards = strip.querySelectorAll<HTMLElement>("[data-card]");
        const track = strip.querySelector<HTMLElement>("[data-track]");
        const counter = strip.querySelector<HTMLElement>("[data-counter]");
        const names = strip.querySelectorAll<HTMLElement>("[data-name]");
        const n = cards.length;
        const step = cards[0].offsetHeight + parseFloat(getComputedStyle(track!).rowGap || "0");
        let current = -1;
        const setActive = (i: number) => {
          if (i === current) return; // only touch the DOM when the active card changes
          current = i;
          cards.forEach((c, j) => c.classList.toggle("is-active", j === i));
          names.forEach((m, j) => (m.style.opacity = j === i ? "1" : "0"));
          if (counter) counter.textContent = String(i + 1).padStart(2, "0");
        };
        setActive(0);
        gsap.fromTo(
          track,
          { y: () => (step * (n - 1)) / 2 },
          {
            y: () => (-step * (n - 1)) / 2,
            ease: "none",
            scrollTrigger: {
              trigger: strip,
              start: "top top",
              end: `+=${n * 140}%`,
              pin: true,
              scrub: 1.2,
              onUpdate: (self) => setActive(Math.min(n - 1, Math.round(self.progress * (n - 1)))),
            },
          },
        );
      });
      mm.add("(min-width: 1024px)", () => {
        // Chapters: pinned split screen. Each change:
        // - the next photo wipes up over the whole panel, led by a vermilion line on the wipe's
        //   edge, and settles from a zoom while the current photo pushes back and darkens;
        // - the counter, name and kanji roll out through their masks, then the next roll in;
        // - the three lines fade and lift in sequence;
        // - a vermilion progress line beside the photo fills across the three chapters.
        // Transforms, opacity and clip-path only, scrubbed to the (smoothed) scroll.
        const services = document.querySelector<HTMLElement>("[data-services]");
        if (!services) return;
        const chapters = [...services.querySelectorAll<HTMLElement>("[data-chapter]")];
        const frames = [...services.querySelectorAll<HTMLElement>("[data-frame]")];
        const panel = services.querySelector<HTMLElement>("[data-window]");
        const edge = services.querySelector<HTMLElement>("[data-edge]");
        const progress = services.querySelector<HTMLElement>("[data-progress]");
        const words = chapters.map((c) => c.querySelector<HTMLElement>("[data-word]"));
        const labels = chapters.map((c) => [...c.querySelectorAll<HTMLElement>("[data-label]")]);
        const points = chapters.map((c) => [...c.querySelectorAll<HTMLElement>("[data-point]")]);
        const imgs = frames.map((f) => f.querySelector("img"));
        const shades = frames.map((f) => f.querySelector<HTMLElement>("[data-shade]"));
        const n = chapters.length;

        // Starting state: only the first chapter shows (y: 0 clears the CSS starting transform,
        // which GSAP would otherwise read as a px offset)
        chapters.forEach((_, i) => {
          if (i === 0) return;
          gsap.set(words[i], { y: 0, yPercent: 110 });
          gsap.set(labels[i], { y: 0, yPercent: 110 });
          gsap.set(points[i], { autoAlpha: 0, y: 28 });
          gsap.set(frames[i], { clipPath: "inset(100% 0% 0% 0%)" });
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: services, start: "top top", end: `+=${n * 120}%`, pin: true, scrub: 1.2, invalidateOnRefresh: true },
        });
        for (let i = 0; i < n - 1; i++) {
          const t = i * 2.4 + 1; // a beat of stillness before each change
          // Photo: full-panel wipe with the ink line riding its edge (same ease, so they stay together)
          tl.to(frames[i + 1], { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut" }, t);
          tl.fromTo(edge, { y: () => panel?.offsetHeight ?? 0, autoAlpha: 1 }, { y: 0, duration: 1.2, ease: "power3.inOut", immediateRender: false }, t);
          tl.to(edge, { autoAlpha: 0, duration: 0.15 }, t + 1.2);
          tl.fromTo(imgs[i + 1], { scale: 1.3 }, { scale: 1, duration: 1.6, ease: "power2.out" }, t);
          tl.to(imgs[i], { scale: 1.12, duration: 1.2, ease: "power2.in" }, t);
          tl.to(shades[i], { opacity: 0.65, duration: 1.2, ease: "power1.in" }, t);
          // Counter, name and kanji: out through the top of their masks, then the next rise in
          tl.to([...labels[i], words[i]], { yPercent: -110, duration: 0.5, ease: "power3.in", stagger: 0.04 }, t);
          tl.to([...labels[i + 1], words[i + 1]], { yPercent: 0, duration: 0.9, ease: "power3.out", stagger: 0.06 }, t + 0.35);
          // Lines: fade and lift away, then the next fade in from below, one by one
          tl.to(points[i], { autoAlpha: 0, y: -20, duration: 0.4, ease: "power2.in", stagger: 0.05 }, t);
          tl.to(points[i + 1], { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }, t + 0.45);
        }
        tl.to({}, { duration: 1 }); // hold the last chapter before the pin releases
        if (progress) tl.fromTo(progress, { scaleY: 0 }, { scaleY: 1, duration: tl.duration(), ease: "none" }, 0);
      });

      // Process steps. Desktop: pinned; the photo wipes in and pushes in slowly while the four
      // steps reveal one after another (line draws, kanji rises through its mask, text lifts in),
      // then all four hold together before the pin releases. Phones: each step reveals once as it
      // enters. Everything stays visible once revealed.
      const processEls = () => {
        const process = document.querySelector<HTMLElement>("[data-process]");
        if (!process) return null;
        const steps = [...process.querySelectorAll<HTMLElement>("[data-step]")].map((s) => ({
          el: s,
          line: s.querySelector<HTMLElement>("[data-step-line]"),
          kanji: s.querySelector<HTMLElement>("[data-step-kanji]"),
          text: s.querySelector<HTMLElement>("[data-step-text]"),
        }));
        return {
          process,
          steps,
          photo: process.querySelector<HTMLElement>("[data-process-photo]"),
          img: process.querySelector<HTMLElement>("[data-process-img]"),
        };
      };
      const hideSteps = (steps: NonNullable<ReturnType<typeof processEls>>["steps"]) => {
        steps.forEach((s) => {
          gsap.set(s.line, { scaleX: 0 });
          gsap.set(s.kanji, { yPercent: 110 });
          gsap.set(s.text, { autoAlpha: 0, y: 24 });
        });
      };

      mm.add("(min-width: 1024px)", () => {
        const p = processEls();
        if (!p) return;
        hideSteps(p.steps);
        gsap.set(p.photo, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(p.img, { scale: 1.25 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: p.process, start: "top top", end: "+=220%", pin: true, scrub: 1, invalidateOnRefresh: true },
        });
        tl.to(p.photo, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.inOut" }, 0);
        tl.to(p.img, { scale: 1, duration: 5.4, ease: "power1.out" }, 0);
        p.steps.forEach((s, i) => {
          const t = 0.6 + i * 1; // one step per beat
          tl.to(s.line, { scaleX: 1, duration: 0.6, ease: "power3.inOut" }, t);
          tl.to(s.kanji, { yPercent: 0, duration: 0.7, ease: "power3.out" }, t + 0.15);
          tl.to(s.text, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, t + 0.3);
        });
        tl.to({}, { duration: 1 }); // all four steps hold together
      });

      mm.add("(max-width: 1023px)", () => {
        const p = processEls();
        if (!p) return;
        hideSteps(p.steps);
        p.steps.forEach((s) => {
          gsap
            .timeline({ scrollTrigger: { trigger: s.el, start: "top 85%", once: true } })
            .to(s.line, { scaleX: 1, duration: 0.7, ease: "power3.inOut" }, 0)
            .to(s.kanji, { yPercent: 0, duration: 0.8, ease: "power3.out" }, 0.1)
            .to(s.text, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.25);
        });
      });

    });

    return () => {
      ctx.revert();
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
      }
    };
  }, []);

  return null;
}
