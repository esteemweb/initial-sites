import Image from "next/image";
import { book } from "@/lib/content";

/* The jacket. Front: a page from a negotiation log with the moon blacked out
   of it — what's left unredacted is the crescent, which is what a moon
   actually is — and MOON struck through in the one red. Generated artwork
   (public/cover/front.png; prompts in scripts/cover-prompts/). Back and spine
   continue the same paper, in code. */

export function CoverFront() {
  return (
    <Image
      src="/cover/front.png"
      alt=""
      fill
      sizes="(min-width: 1024px) 440px, (min-width: 768px) 360px, 84vw"
      loading="eager"
      className="cover-img"
    />
  );
}

export function CoverBack() {
  const i = book.jacket.indexOf(". ") + 1;
  return (
    <div className="cover cover-paper">
      <div className="back-inner">
        <span className="cover-kicker">{book.publisher}</span>
        <div className="back-copy">
          <p className="jacket">{book.jacket.slice(0, i)}</p>
          <p className="jacket">{book.jacket.slice(i + 1)}</p>
          <p className="jacket">{book.jacketClose}</p>
        </div>
        <p className="sells">
          {book.sellingLine[0]} {book.sellingLine[1]}
        </p>
        <div className="back-foot">
          <span className="cover-kicker">£18.99</span>
          <span className="cover-kicker">A novel</span>
        </div>
      </div>
    </div>
  );
}

export function Spine() {
  return (
    <div className="spine-text">
      <span className="t">{book.title}</span>
      <span className="a">{book.author}</span>
      <span className="p">Bramber</span>
    </div>
  );
}
