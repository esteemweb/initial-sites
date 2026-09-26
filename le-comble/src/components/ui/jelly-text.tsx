import { Fragment } from "react";

/* A heading's words, each in its own box, so the jelly field
   (src/components/ui/cloth.tsx) can nudge them one by one. The spaces stay
   plain text between the boxes, so lines break exactly as before and screen
   readers read the heading as one sentence. */

export function JellyText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="jelly-w">{w}</span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
