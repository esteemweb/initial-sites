import Link from "next/link";
import Photo from "@/components/Photo";
import eyesClosed from "@/photos/her-03-eyes-closed.png";

export default function NotFound() {
  return (
    <main className="container grid page">
      <div className="main-col" style={{ display: "grid", gap: "var(--s5)", maxWidth: 720 }}>
        <p className="t-record ghost">404</p>
        <h1 className="t-xl">nothing here</h1>
        <p className="t-body">i looked. it&apos;s like my first gig. an empty room and the wrong address.</p>
        <p className="t-record" style={{ display: "flex", gap: "var(--s4)", flexWrap: "wrap" }}>
          <Link href="/" className="more">
            home →
          </Link>
          <Link href="/dates" className="more">
            dates →
          </Link>
        </p>
        <div style={{ maxWidth: 320 }}>
          <Photo src={eyesClosed} alt="Lore with her eyes closed, head tilted down" sizes="320px" />
        </div>
      </div>
    </main>
  );
}
