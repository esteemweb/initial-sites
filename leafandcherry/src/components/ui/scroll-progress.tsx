"use client";

/* A plain wrapper that exposes its own scroll progress as a CSS variable
   (`--p` unless `name` says otherwise) to everything inside it, so a server
   component can drive scroll-linked CSS without becoming a client component
   itself. Nest two with different names to run two ranges over one subtree.
   See useScrollProgress for the range. */
import { useRef } from "react";
import { useScrollProgress } from "@/lib/motion";

type Props = {
  /** Viewport fraction where progress is 0 (top edge position). */
  start: number;
  /** Viewport fraction where progress reaches 1. */
  end: number;
  /** CSS variable to write. */
  name?: string;
  as?: "div" | "ul";
  className?: string;
  children: React.ReactNode;
};

export function ScrollProgress({
  start,
  end,
  name,
  as: Tag = "div",
  className,
  children,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  useScrollProgress(ref, start, end, name);

  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      {children}
    </Tag>
  );
}
