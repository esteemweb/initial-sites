"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { emblemBox, emblemPath } from "@/lib/content/emblem-path";

gsap.registerPlugin(ScrollTrigger);

/**
 * The floating mark: Uroko's fish-scale emblem (lib/content/emblem-path.ts,
 * drawn by scripts/emblem-scales.mjs), extruded in 3D. Two copies (one turned
 * to face the other way) slide in as the boot screen opens and overlap small above
 * the man's head in the hero; as you scroll they tumble in
 * opposite directions while the pair turns as one and grows; the pair flies
 * deep into the distance where the motifs begin, returns for the process
 * steps, then leaves.
 *
 * Look: shell-white blades lit by a vermilion key, an indigo fill and a faint
 * shell-white ambient.
 */
export function Emblem3D() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = innerWidth <= 768;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    // The hero mask is small, so phones need a sharper canvas than 1x to keep its edges clean
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 1.25));
    renderer.setSize(innerWidth, innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100);
    camera.position.set(0, 0, mobile ? 20 : 14);

    // Geometry: the traced mark, extruded thin like a blade
    // The gaps between the scales are nested outlines drawn in the same direction, so
    // holes are found by nesting depth (odd depth = hole in its parent). This is the
    // even-odd rule done directly; three's general even-odd builder froze the page for ~1 s.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${emblemPath}"/></svg>`;
    const polys = new SVGLoader().parse(svg).paths.flatMap((p) => p.subPaths.map((sp) => sp.getPoints(5)));
    const inside = (pt: THREE.Vector2, poly: THREE.Vector2[]) => {
      let hit = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const a = poly[i], b = poly[j];
        if (a.y > pt.y !== b.y > pt.y && pt.x < ((b.x - a.x) * (pt.y - a.y)) / (b.y - a.y) + a.x) hit = !hit;
      }
      return hit;
    };
    const containers = polys.map((poly, i) => polys.map((other, j) => (i !== j && inside(poly[0], other) ? j : -1)).filter((j) => j >= 0));
    const depth = containers.map((c) => c.length);
    const shapes: THREE.Shape[] = [];
    const shapeOf = new Map<number, THREE.Shape>();
    polys.forEach((poly, i) => {
      if (depth[i] % 2 === 0) {
        const shape = new THREE.Shape(poly);
        shapeOf.set(i, shape);
        shapes.push(shape);
      }
    });
    polys.forEach((poly, i) => {
      if (depth[i] % 2 === 1) {
        const parent = containers[i].find((j) => depth[j] === depth[i] - 1);
        if (parent !== undefined) shapeOf.get(parent)?.holes.push(new THREE.Path(poly));
      }
    });
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 16,
      bevelEnabled: true,
      bevelThickness: 5,
      bevelSize: 3,
      bevelSegments: 2,
      curveSegments: 5,
    });
    const w = emblemBox.x2 - emblemBox.x1;
    const h = emblemBox.y2 - emblemBox.y1;
    geo.translate(-(emblemBox.x1 + w / 2), -(emblemBox.y1 + h / 2), -8);
    const k = 5.5 / Math.max(w, h);
    geo.scale(k, k, k);
    geo.rotateX(Math.PI); // SVG is y-down; rotate rather than mirror so faces stay outward
    geo.computeVertexNormals();

    // Two pieces, slightly different finish, one turned to face the other way
    const matA = new THREE.MeshStandardMaterial({ color: 0xeceff0, metalness: 0.25, roughness: 0.35 });
    const matB = new THREE.MeshStandardMaterial({ color: 0xeceff0, metalness: 0.45, roughness: 0.2 });
    const pieceA = new THREE.Mesh(geo, matA);
    const pieceB = new THREE.Mesh(geo, matB);
    pieceA.rotation.y = Math.PI;

    const spin = new THREE.Group(); // scroll-driven rotation and position
    spin.add(pieceA, pieceB);
    const float = new THREE.Group(); // mouse tilt and drift
    float.add(spin);
    scene.add(float);

    // Pigment lighting: a vermilion (朱) key that follows the pointer, an indigo
    // (藍) fill from the other side, and a faint shell-white ambient
    const follow = new THREE.PointLight(0xec6a4a, 26, 15);
    follow.position.set(0, 2, 5);
    const key = new THREE.PointLight(0xe0502e, 48, 20);
    key.position.set(3, 2, 4);
    const fill = new THREE.PointLight(0x3b5f99, 60, 15);
    fill.position.set(-3, 1, 3);
    scene.add(follow, key, fill, new THREE.AmbientLight(0x8fa8cc, 0.35));

    // GSAP drives these targets; the render loop eases the real object toward
    // them with a damped spring, so the emblem trails the scroll like
    // something weighted in water and settles when the scroll stops.
    // Hero: the pair floats small above his head, over the name, never over his face
    // (scaled rather than pushed back, so the lights still reach it)
    const target = { rotY: 0, rotX: 0, px: 0, py: mobile ? 5.1 : 3.7, pz: -2.5, sc: mobile ? 0.21 : 0.2, aRx: 0, bRx: 0, idle: 0 };
    spin.position.set(target.px, target.py, target.pz);
    spin.scale.setScalar(target.sc);
    const aHome = -1.4;
    const bHome = 1.4;
    pieceA.position.set(aHome, 0, 0);
    pieceB.position.set(bHome, 0, 0);

    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / innerHeight - 0.5) * 2;
      gsap.to(float.rotation, { x: mouse.y * 0.08, y: mouse.x * 0.12, duration: 0.8, ease: "power3.out", overwrite: "auto" });
      gsap.to(float.position, { x: mouse.x * 0.2, y: mouse.y * -0.12, duration: 0.8, ease: "power3.out", overwrite: "auto" });
    };

    const ctx = gsap.context((self) => {
      if (reduced) {
        target.rotY = 0.4;
        spin.rotation.y = 0.4;
        return;
      }

      // Entry: pieces start far apart and slide together; the pair tumbles into place
      pieceA.position.x = -25;
      pieceB.position.x = 25;
      // They fly in as the boot screen opens (BootLoader fires "uroko:reveal"),
      // decelerating out of its accelerating dive.
      const enter = () => {
        gsap.to(pieceA.position, { x: aHome, duration: 3, ease: "power3.out" });
        gsap.to(pieceB.position, { x: bHome, duration: 3, ease: "power3.out" });
        gsap.fromTo(target, { rotX: 0 }, { rotX: -6.4, duration: 4, ease: "power2.out" });
      };
      if (document.documentElement.dataset.revealed || !document.getElementById("boot")) enter();
      else {
        const onReveal = () => self.add(enter);
        addEventListener("uroko:reveal", onReveal, { once: true });
        self.add(() => () => removeEventListener("uroko:reveal", onReveal));
      }

      // The pair turns five times over the first nine viewports, locked to the smooth scroll
      gsap.to(target, {
        rotY: Math.PI * 10,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "+=900%", scrub: true },
      });

      // The two pieces tumble in opposite directions and the pair comes forward
      gsap
        .timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            // Finish growing where the motifs begin; from there the pair flies off (below)
            endTrigger: "[data-services-intro]",
            end: "top top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        .to(target, { pz: 1, py: mobile ? 0.3 : 0.8, sc: 1, aRx: 12.6, bRx: -12.6, ease: "none" }, 0);

      // Motifs: the pair flies deep into the distance and up out of frame, clear of the motif cards
      const servicesIntro = document.querySelector("[data-services-intro]");
      if (servicesIntro) {
        gsap
          .timeline({ scrollTrigger: { trigger: servicesIntro, start: "top top", end: "+=2500", scrub: 0.8, invalidateOnRefresh: true } })
          .to(target, { pz: -35, py: 12, ease: "none", duration: 8 })
          .to(target, { py: 20, ease: "none" });
      }

      // Process: returns, turns, and leaves upward again
      const process = document.querySelector("[data-process]");
      if (process && !mobile) {
        gsap
          .timeline({ scrollTrigger: { trigger: process, start: "top center", end: "100% bottom", scrub: 1, invalidateOnRefresh: true, immediateRender: false } })
          .to(target, { rotY: "+=2", duration: 20 }, 0)
          .to(target, { py: 1.5, pz: 0, duration: 10 }, 0)
          .to(target, { py: 10, duration: 8 }, 15);
      }

      // No footer moment: after the process steps the pair has left the frame for good.

      ScrollTrigger.refresh();
    });

    if (!mobile && !reduced) addEventListener("mousemove", onMove);

    const onResize = () => {
      renderer.setSize(innerWidth, innerHeight, false);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    };
    addEventListener("resize", onResize);

    let lastT = performance.now();
    let lastKey = "";
    const ease = (cur: number, tgt: number, k: number, dt: number) => cur + (tgt - cur) * (1 - Math.exp(-k * dt));
    // Runs on GSAP's ticker, the same frame loop that drives the smooth
    // scroll, so the emblem and the page always move in the same frame.
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      // Heavier moves (position, the two halves) trail more than the turn
      spin.rotation.y = ease(spin.rotation.y, target.rotY, 7, dt);
      spin.rotation.x = ease(spin.rotation.x, target.rotX, 5, dt);
      spin.position.x = ease(spin.position.x, target.px, 3.5, dt);
      spin.position.y = ease(spin.position.y, target.py, 3.5, dt);
      spin.position.z = ease(spin.position.z, target.pz, 3.5, dt);
      spin.scale.setScalar(ease(spin.scale.x, target.sc, 3.5, dt));
      pieceA.rotation.x = ease(pieceA.rotation.x, target.aRx, 4.5, dt);
      pieceB.rotation.x = ease(pieceB.rotation.x, target.bRx, 4.5, dt);
      spin.rotation.z = ease(spin.rotation.z, target.idle, 6, dt);
      follow.position.x = ease(follow.position.x, mouse.x * 4, 5, dt);
      follow.position.y = ease(follow.position.y, -mouse.y * 2 + 2, 5, dt);

      // Draw only when the picture changed; skip entirely once it has flown out of view
      const key = [
        spin.rotation.x, spin.rotation.y, spin.rotation.z, spin.scale.x, spin.position.x, spin.position.y, spin.position.z,
        pieceA.position.x, pieceB.position.x, pieceA.rotation.x, pieceB.rotation.x,
        float.rotation.x, float.rotation.y, float.rotation.z, float.position.x, float.position.y,
        follow.position.x, follow.position.y,
      ].map((v) => v.toFixed(3)).join(",");
      const outOfView = spin.position.y > 9 || spin.position.z < -30;
      if (key !== lastKey && !outOfView) renderer.render(scene, camera);
      if (outOfView && key !== lastKey) renderer.clear();
      lastKey = key;
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      ctx.revert();
      removeEventListener("mousemove", onMove);
      removeEventListener("resize", onResize);
      geo.dispose();
      matA.dispose();
      matB.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-20 h-full w-full" />;
}
