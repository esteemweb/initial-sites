import Link from "next/link";
import { author, book, endorsements, log, midBook, novel, rooms, sampleEnd } from "@/lib/content";
import { Split } from "@/components/split";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { PauseLine } from "@/components/pause-line";
import { BookObject } from "@/components/book-object";
import { Buy } from "@/components/buy";
import { Found } from "@/components/found";
import { LogLine } from "@/components/log-line";
import { MoonClips } from "@/components/moon";
import { RoomTitle } from "@/components/room-title";
import { Atmosphere } from "@/components/atmosphere";
import { DayCount } from "@/components/day-count";
import { daysSince } from "@/lib/days";
import { BuyRail } from "@/components/buy-rail";
import { Silence } from "@/components/silence";
import { Pace } from "@/components/pace-text";
import { ReadPace } from "@/components/read-pace";
import { ProgressMoon } from "@/components/progress-moon";
import { Intro } from "@/components/intro";

/* Order is the argument: who wrote it → what it claims → what it is →
   what's inside → a page of it → where to get it. Night is the ground; page
   appears only where reading happens. */
export default function Home() {
  return (
    <>
      <a href="#author" className="skip label">
        Skip to content
      </a>
      <SiteHeader initialAt={58} />
      <main>
        <Hero />
        <Author />
        <Atmosphere />
        <PauseLine />
        <Novel />
        <Rooms />
        <Endorsements />
        <ReadSample />
        <BuySection />
      </main>
      <SiteFooter />
      <ProgressMoon />
      <BuyRail />
      <Silence />
      <ReadPace />
    </>
  );
}

function Hero() {
  return (
    <section aria-label="Ask for the Moon, a novel by Thea Brandt" data-at="58">
      <Intro />
      <Split className="hero">
        <h1 className="display hero-title">
          <span className="grp">
            <span className="w">Ask</span> <span className="w">for</span>
          </span>{" "}
          <span className="grp">
            <span className="w">the</span> <span className="w">Moon</span>
          </span>
        </h1>
        <div className="hero-foot">
          <p className="hero-credential">
            A novel by Thea Brandt, who spent eleven years as a crisis negotiator.
          </p>
          <p className="label">
            Case: {book.title}
            <span className="max-md:hidden"> · {book.publisher}</span>
            <br />
            <DayCount built={daysSince(book.publishedISO)} />
          </p>
        </div>
      </Split>
    </section>
  );
}

function Author() {
  return (
    <section id="author" className="section on-night rule-t" aria-labelledby="author-h" data-at="0">
      <LogLine entry={log.author} onRule />
      <div className="grid-12 gap-y-12">
        <h2 id="author-h" className="label quiet col-span-12 lg:col-span-3 pt-2">
          The author
        </h2>
        <p className="pace say-lg col-span-12 lg:[grid-column:4/span_8]">
          <Pace text={author.opening} />
        </p>
        <ol className="record-list col-span-12 lg:[grid-column:4/span_6] lg:row-start-3">
          {author.record.map((r) => (
            <li key={r.year}>
              <span className="yr label quiet">{r.year}</span>
              <span className="t-body">{r.text}</span>
            </li>
          ))}
        </ol>
        <div className="col-span-12 lg:[grid-column:10/span_3] lg:row-start-3 lg:self-center justify-self-start lg:justify-self-end">
          <Found name="log" width={300} rotate={2.5} />
        </div>
        <div className="col-span-12 lg:[grid-column:4/span_8] mt-8">
          <p className="say-xl">{author.proof}</p>
          <p className="label quiet mt-4">{author.proofNote}</p>
        </div>
      </div>

      <figure className="mt-24 lg:mt-32 m-0">
        <blockquote className="m-0">
          <p className="t-display">“{author.quote}”</p>
        </blockquote>
        <figcaption className="grid-12 mt-8">
          <span className="t-body quiet col-span-12 lg:[grid-column:4/span_6]">
            Thea Brandt, on why she left. {author.quoteNote}
          </span>
        </figcaption>
      </figure>

      <div className="grid-12 mt-16">
        <div className="prose t-read measure col-span-12 lg:[grid-column:4/span_7]">
          <p className="pace">
            <em>
              <Pace text="Ask for the Moon" />
            </em>{" "}
            <Pace text={author.after[0].replace(/^Ask for the Moon /, "")} />
          </p>
          <p className="pace">
            <Pace text={author.after[1]} />
          </p>
        </div>
      </div>
    </section>
  );
}

function Novel() {
  return (
    <section id="novel" className="section on-night rule-t" aria-labelledby="novel-h" data-at="0">
      <LogLine entry={log.novel} onRule />
      <div className="grid-12 gap-y-16 items-start">
        <div className="novel-cover col-span-12 md:col-span-6 md:sticky md:top-24">
          <BookObject />
        </div>
        <div className="novel-text col-span-12 md:[grid-column:7/span_6]">
          <h2 id="novel-h" className="label quiet">
            The novel
          </h2>
          <p className="pace say-lg mt-6">
            <Pace text={book.jacket} />
          </p>
          <div className="prose t-read measure mt-12">
            {novel.premise.map((p) => (
              <p key={p.slice(0, 20)} className="pace">
                <Pace text={p} />
              </p>
            ))}
          </div>
          <div className="mt-12 flex justify-end">
            <Found name="notepad" width={220} rotate={-3} />
          </div>
          <p className="pace t-read italic measure mt-12">
            <Pace text={novel.method} />
          </p>
          <dl className="facts mt-12">
            <dt className="label quiet">Edition</dt>
            <dd className="label">Hardback, {book.pages} pages</dd>
            <dt className="label quiet">Published</dt>
            <dd className="label">
              <time dateTime={book.publishedISO}>{book.published}</time>, {book.publisher}
            </dd>
            <dt className="label quiet">Also</dt>
            <dd className="label">Ebook · audiobook read by the author</dd>
            <dt className="label quiet">Case</dt>
            <dd className="label">240 × 159 mm · cloth spine</dd>
          </dl>
        </div>
      </div>
    </section>
  );
}

function Rooms() {
  return (
    <section aria-labelledby="rooms-h">
      <div className="section on-page rule-t pb-16 lg:pb-24" data-at="100">
        <LogLine entry={log.rooms} onRule />
        <div className="grid-12 gap-y-6 items-start">
          <h2 id="rooms-h" className="label col-span-12 lg:col-span-3 pt-2">
            Contents
          </h2>
          <p className="say-lg col-span-12 lg:[grid-column:4/span_6]">
            Eight rooms. Different worlds, different stakes, the same woman in the room.
          </p>
          <div className="found-over pad-cross col-span-12 lg:[grid-column:10/span_3] justify-self-start lg:justify-self-end">
            <Found name="pad" width={220} rotate={3.5} />
          </div>
        </div>
      </div>
      <MoonClips indices={rooms.map((_, i) => i)} />
      <ol className="rooms">
        {rooms.map((r, i) => {
          const note = i === 0 ? "note-never-first-night" : i === 3 ? "note-who-set-it-chalk" : null;
          return (
            <li key={r.n} data-at={r.lit} style={{ ["--tab-at" as string]: `${r.lit}%` }}>
              <Split at={r.lit} className={r.scene ? "room" : "room room-empty"}>
                <span className="room-n" aria-hidden="true" />
                <RoomTitle n={r.n} title={r.title} index={i} />
                {r.knows && (
                  <div className="room-knows">
                    <p className="say-lg italic m-0" data-silence-trigger={i === 2 ? "" : undefined}>
                      {r.knows}
                    </p>
                    {i === 2 && <p className="silence-caption label m-0 mt-2">[4 sec]</p>}
                    {note && (
                      <Found name={note} width={150} rotate={i === 0 ? -3 : 2} className="margin-note" decorative />
                    )}
                  </div>
                )}
                {r.scene && (
                  <p className="pace room-scene t-read">
                    <Pace text={r.scene} />
                  </p>
                )}
              </Split>
              {/* the numeral sits on the join, on top: the bar runs behind it */}
              <span className="room-tab label" aria-hidden="true">
                {r.n}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function ReadSample() {
  return (
    <section id="read" className="section on-night rule-t" aria-labelledby="read-h" data-at="0">
      <LogLine entry={log.read} onRule />
      <div className="grid-12 gap-y-6">
        <h2 id="read-h" className="label quiet col-span-12 lg:col-span-3 pt-2">
          Read
        </h2>
        <div className="col-span-12 lg:[grid-column:4/span_8]">
          <p className="say-lg">A page from the middle of the book, because anyone can write a first one.</p>
          <p className="t-body quiet mt-4">
            Chapter four. A bakery at two in the morning, and forty people in the yard.
          </p>
        </div>
      </div>

      <figure className="spread mt-12 lg:mt-16 mx-auto max-w-[608px] lg:max-w-[1088px]" aria-label="Pages 141 and 142">
        <span className="run left-6 lg:left-12" aria-hidden="true">
          {book.title}
        </span>
        <span className="run page-2 right-12" aria-hidden="true">
          {midBook.chapter}
        </span>
        <div className="spread-text">
          {midBook.paragraphs.map((p, i) => {
            const [before, after] = p.split("{{REDACTED}}");
            return (
              <p key={i}>
                {before}
                {after !== undefined && (
                  <>
                    <span className="redaction" role="img" aria-label="name redacted" />
                    <sup className="fn-mark">
                      <a href="#fn-212" aria-label="footnote 1">
                        1
                      </a>
                    </sup>
                    {after}
                  </>
                )}
              </p>
            );
          })}
          <p id="fn-212" className="footnote label">
            <sup>1</sup> {midBook.footnote}
          </p>
        </div>
        <span className="folio left-6 lg:left-12" aria-hidden="true">
          <span className="lg:hidden">
            {midBook.folios[0]}–{midBook.folios[1]}
          </span>
          <span className="max-lg:hidden">{midBook.folios[0]}</span>
        </span>
        <span className="folio page-2 right-12" aria-hidden="true">
          {midBook.folios[1]}
        </span>
      </figure>

      <div className="grid-12 mt-12 gap-y-4">
        <div className="col-span-12 lg:[grid-column:4/span_7]">
          <p className="label quiet">{sampleEnd.mark}</p>
          <p className="t-read measure mt-2">{sampleEnd.next}</p>
        </div>
        <div className="col-span-12 lg:[grid-column:4/span_9] flex flex-wrap items-center gap-x-6 gap-y-4 mt-6">
          <Link href="/read" className="btn">
            Read chapter one
          </Link>
          <span className="t-body quiet">The whole chapter, free, no email. About ten minutes.</span>
        </div>
      </div>
    </section>
  );
}

function BuySection() {
  return (
    <section id="buy" className="section on-night rule-t" aria-labelledby="buy-h" data-at="0">
      <LogLine entry={log.buy} onRule />
      <p className="t-display mb-24">{book.jacketClose}</p>
      <h2 id="buy-h" className="sr-only">
        Buy the book
      </h2>
      <Buy headingLevel={3} />
    </section>
  );
}

function Endorsements() {
  return (
    <section className="section on-night" aria-labelledby="praise-h" data-at="0">
      <h2 id="praise-h" className="label quiet">
        From people who work in these rooms
      </h2>
      <div className="grid-12 gap-y-12 mt-12">
        {endorsements.map((e) => (
          <figure key={e.name} className="m-0 col-span-12 md:col-span-6 lg:col-span-3 rule-t pt-6">
            <blockquote className="m-0">
              <p className="t-read">“{e.quote}”</p>
            </blockquote>
            <figcaption className="label mt-6">
              {e.name}
              <span className="quiet block mt-1">{e.role}</span>
            </figcaption>
          </figure>
        ))}
        <div className="found-over letter-cross col-span-12 lg:[grid-column:10/span_3] justify-self-start lg:justify-self-end">
          <Found name="letter" width={220} rotate={-2} />
        </div>
      </div>
    </section>
  );
}
