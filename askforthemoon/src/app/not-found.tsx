import Link from "next/link";
import { Split } from "@/components/split";

export default function NotFound() {
  return (
    <main data-at="58">
      <Split className="hero hero-short">
        <h1 className="display hero-title">
          <span className="grp">
            <span className="w">Not</span>
          </span>{" "}
          <span className="grp">
            <span className="w">here</span>
          </span>
        </h1>
        <div className="hero-foot">
          <p className="hero-credential">
            There is nothing at this address. Every number is the wrong number when you say it
            first; this one was just wrong.
          </p>
          <p className="label">
            <Link href="/" className="tap underline underline-offset-4">
              Back to the book
            </Link>
          </p>
        </div>
      </Split>
    </main>
  );
}
