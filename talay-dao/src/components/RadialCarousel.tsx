"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  animate,
  type Variants,
  type MotionValue,
} from "motion/react";
import { X } from "lucide-react";

/* Radial carousel.

   The motion is kept exactly as supplied: spring-smoothed rotation driven by
   a pan gesture, per-item polar placement, shared layoutId morph between the
   thumbnail ring and the centre card, staggered enter/exit.

   RESTYLED to the design system. The original shipped rounded-[42px] cards,
   shadow-2xl, ring-1, bg-white and dark: variants — this site is zero-radius,
   zero-shadow, hairline-separated and single-mode, so dropped in unchanged it
   would have read as a bolted-on widget. Surfaces now use tokens; geometry
   and timing are untouched.

   Two additions beyond a restyle, both matching standards held elsewhere in
   this project:
   - prefers-reduced-motion is honoured; the ring places itself without spring
     or stagger and the gesture still works.
   - thumbnails are real <button>s with labels rather than divs with click
     handlers, so the gallery is keyboard-reachable. */

export interface GalleryItem {
  id: string | number;
  url: string;
  title?: string;
}

export interface RadialCarouselProps {
  items: GalleryItem[];
  radius?: number;
  thumbnailSize?: number;
  centerSize?: number;
  /* Start on the ring rather than the centre card. */
  initialExpanded?: boolean;
  /* One full counter-clockwise revolution of the ring as the preloader
     lifts — the same sense the canvas sheet unwinds in, so the loader's
     turn carries straight into the ring. Fires on the preloader's
     `talaydao:loaded` event, or at once if that has already happened
     (client-side navigation). Skipped under reduced motion. */
  introSpin?: boolean;
}

export const RadialCarousel: React.FC<RadialCarouselProps> = ({
  items,
  radius = 260,
  thumbnailSize = 110,
  centerSize = 400,
  initialExpanded = false,
  introSpin = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const reduced = useReducedMotion();

  const [responsiveSizes, setResponsiveSizes] = useState({
    radius,
    thumbnailSize,
    centerSize,
  });

  useEffect(() => {
    const updateSizes = () => {
      const width = window.innerWidth;
      if (width < 400) {
        setResponsiveSizes({
          radius: Math.min(radius, 110),
          thumbnailSize: Math.min(thumbnailSize, 70),
          centerSize: Math.min(centerSize, 260),
        });
      } else if (width < 640) {
        setResponsiveSizes({
          radius: Math.min(radius, 140),
          thumbnailSize: Math.min(thumbnailSize, 80),
          centerSize: Math.min(centerSize, 300),
        });
      } else if (width < 1024) {
        setResponsiveSizes({
          radius: Math.min(radius, 200),
          thumbnailSize: Math.min(thumbnailSize, 90),
          centerSize: Math.min(centerSize, 340),
        });
      } else {
        setResponsiveSizes({ radius, thumbnailSize, centerSize });
      }
    };
    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, [radius, thumbnailSize, centerSize]);

  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, { bounce: 0.15, duration: 0.1 });

  useEffect(() => {
    if (!introSpin || reduced) return;
    let controls: ReturnType<typeof animate> | undefined;
    const spin = () => {
      /* 360 is the same picture as 0, so the ring does not jump; it then
         eases through one full turn and lands where it started. */
      rotation.set(360);
      controls = animate(rotation, 0, {
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1],
      });
    };
    if (document.documentElement.dataset.loaded === "true") {
      spin();
    } else {
      document.addEventListener("talaydao:loaded", spin, { once: true });
    }
    return () => {
      document.removeEventListener("talaydao:loaded", spin);
      controls?.stop();
    };
  }, [introSpin, reduced, rotation]);

  const toggleExpand = useCallback(() => setIsExpanded((prev) => !prev), []);

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    setIsExpanded(false);
  };

  const containerVariants: Variants = {
    collapsed: {
      transition: reduced
        ? {}
        : { staggerChildren: 0.01, staggerDirection: -1 },
    },
    expanded: {
      transition: reduced ? {} : { staggerChildren: 0.03, delayChildren: 0.1 },
    },
  };

  const active = items[activeIndex];

  return (
    <div className="h-carousel relative flex w-full touch-pan-y select-none items-center justify-center overflow-visible">
      <AnimatePresence mode="popLayout">
        {!isExpanded ? (
          <motion.div
            key="center-view"
            layout
            transition={{ type: "spring", bounce: 0.15, duration: 0.15 }}
            className="relative z-10"
          >
            <motion.div
              layoutId={`card-${active.id}`}
              style={{
                width: responsiveSizes.centerSize,
                height: responsiveSizes.centerSize,
              }}
              className="relative overflow-hidden border border-hairline-strong bg-surface p-xs"
            >
              <motion.img
                layoutId={`img-${active.id}`}
                src={active.url}
                alt={active.title ?? ""}
                className="h-full w-full object-cover"
                draggable={false}
              />

              <button
                type="button"
                onClick={toggleExpand}
                aria-label="Show all images"
                className="transition-micro absolute right-md top-md flex h-10 w-10 items-center justify-center border border-hairline-strong bg-surface text-ink hover:bg-surface-sunk"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="radial-view"
            variants={containerVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className={`relative flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing ${
              isPanning ? "touch-none" : "touch-pan-y"
            }`}
            onPanStart={() => setIsPanning(true)}
            onPanEnd={() => setIsPanning(false)}
            onPan={(_, info) => {
              rotation.set(rotation.get() + info.delta.x * 0.5);
            }}
          >
            {items.map((item, index) => {
              const baseAngle =
                (index / items.length) * (2 * Math.PI) - Math.PI / 2;
              return (
                <Item
                  key={item.id}
                  item={item}
                  baseAngle={baseAngle}
                  radius={responsiveSizes.radius}
                  thumbnailSize={responsiveSizes.thumbnailSize}
                  rotation={smoothRotation}
                  reduced={!!reduced}
                  onClick={() => handleItemClick(index)}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ItemProps {
  item: GalleryItem;
  baseAngle: number;
  radius: number;
  thumbnailSize: number;
  rotation: MotionValue<number>;
  reduced: boolean;
  onClick: () => void;
}

const Item: React.FC<ItemProps> = ({
  item,
  baseAngle,
  radius,
  thumbnailSize,
  rotation,
  reduced,
  onClick,
}) => {
  const x = useTransform(rotation, (r: number) =>
    Math.cos(baseAngle + (r * Math.PI) / 180) * radius,
  );
  const y = useTransform(rotation, (r: number) =>
    Math.sin(baseAngle + (r * Math.PI) / 180) * radius,
  );
  const rotate = useTransform(
    rotation,
    (r: number) => ((baseAngle + (r * Math.PI) / 180) * 180) / Math.PI + 90,
  );

  const itemVariants: Variants = {
    collapsed: {
      opacity: 0,
      scale: reduced ? 1 : 0.8,
      transition: reduced
        ? { duration: 0 }
        : { type: "spring", bounce: 0.4, duration: 0.5 },
    },
    expanded: {
      scale: 1,
      opacity: 1,
      transition: reduced
        ? { duration: 0 }
        : { type: "spring", bounce: 0.4, duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      style={{ x, y, rotate }}
      className="absolute"
    >
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={item.title ?? "Open image"}
        layoutId={`card-${item.id}`}
        style={{ width: thumbnailSize, height: thumbnailSize }}
        className="block cursor-pointer overflow-hidden border border-hairline-strong bg-surface p-2xs"
      >
        <motion.img
          layoutId={`img-${item.id}`}
          src={item.url}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      </motion.button>
    </motion.div>
  );
};
