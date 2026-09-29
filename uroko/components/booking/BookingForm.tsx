"use client";

import { useActionState, useState, type FormEvent } from "react";
import { submitConsultation, type ConsultationState } from "@/app/book/actions";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { GlowCard } from "@/components/ui/spotlight-card";
import { MotifPlate } from "@/components/motifs/MotifPlate";
import { artists, availabilityLabel } from "@/lib/content/artists";
import { getMotif, motifs } from "@/lib/content/motifs";
import { LIMITS, placements, sizes } from "@/lib/booking/validate";
import { formatSlot, type SlotDay } from "@/lib/booking/slots";

const initial: ConsultationState = { errors: {} };

const methods = [
  { id: "any", label: "Either", note: "advise me" },
  { id: "tebori", label: "Tebori", note: "by hand" },
  { id: "machine", label: "Machine", note: "by machine" },
] as const;

const dot = { open: "bg-ok", waitlist: "bg-warn", closed: "bg-err" } as const;

/** Radio-card styling shared by artist, method and size choices. */
const choice =
  "cursor-pointer border border-line transition-colors duration-150 hover:border-text-muted has-[:checked]:border-shu-bright has-[:checked]:bg-surface-raised has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-shu";

function Section({ n, title, note, children }: { n: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-6 border-t border-line pt-8">
      <legend className="contents">
        <span className="flex items-baseline gap-4">
          <span className="text-base tabular-nums text-shu-bright">{n}</span>
          <span className="text-2xl text-paper">{title}</span>
        </span>
      </legend>
      {note ? <p className="-mt-3 text-sm text-text-muted">{note}</p> : null}
      {children}
    </fieldset>
  );
}

export function BookingForm({ days, defaults }: { days: SlotDay[]; defaults: { artist?: string; motif?: string } }) {
  const [state, action, pending] = useActionState(submitConsultation, initial);
  const v = (k: string, fallback = "") => state.values?.[k] ?? fallback;
  const e = state.errors;

  // Live summary: read the (uncontrolled) form on every change
  const [picked, setPicked] = useState<Record<string, string>>(() => ({
    artist: v("artist", defaults.artist ?? ""),
    motif: v("motif", defaults.motif ?? ""),
    placement: v("placement"),
    size: v("size"),
    method: v("method", "any"),
    slot: v("slot"),
  }));
  const onChange = (ev: FormEvent<HTMLFormElement>) => {
    const fd = new FormData(ev.currentTarget);
    setPicked(Object.fromEntries(["artist", "motif", "placement", "size", "method", "slot"].map((k) => [k, String(fd.get(k) ?? "")])));
  };

  const firstOpen = days.find((d) => d.slots.some((s) => !s.taken))?.date ?? days[0]?.date;
  const [day, setDay] = useState(() => (v("slot") ? v("slot").split("T")[0] : firstOpen));

  const artist = artists.find((a) => a.slug === picked.artist);
  const motif = picked.motif ? getMotif(picked.motif) : undefined;
  const size = sizes.find((s) => s.id === picked.size);
  const method = methods.find((m) => m.id === picked.method);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <form action={action} onChange={onChange} noValidate className="grid gap-12 lg:col-span-7" aria-describedby={e.form ? "form-error" : undefined}>
        {e.form ? (
          <p id="form-error" role="alert" className="border-l-2 border-err pl-4 text-err">
            {e.form}
          </p>
        ) : null}

        <Section n="01" title="About you">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="name" label="Name" error={e.name}>
              <Input id="name" name="name" autoComplete="name" maxLength={LIMITS.name} defaultValue={v("name")} error={e.name} required />
            </Field>
            <Field id="email" label="Email" error={e.email}>
              <Input id="email" name="email" type="email" autoComplete="email" maxLength={LIMITS.email} defaultValue={v("email")} error={e.email} required />
            </Field>
            <Field id="phone" label="Phone" hint="Optional. Only used if a session has to move." error={e.phone}>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={LIMITS.phone} defaultValue={v("phone")} error={e.phone} hint="x" />
            </Field>
          </div>
        </Section>

        <Section n="02" title="The piece" note="Nothing here is binding. The consultation is where the decisions get made.">
          <div role="radiogroup" aria-labelledby="artist-label" className="grid gap-3">
            <p id="artist-label" className="text-sm text-text-muted">
              Artist
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <label className={`${choice} grid content-between gap-6 p-4`}>
                <input type="radio" name="artist" value="" defaultChecked={!picked.artist} className="sr-only" />
                <span lang="ja" className="font-display text-3xl leading-none text-text-muted" aria-hidden="true">
                  任
                </span>
                <span>
                  <span className="block text-base text-paper">Any</span>
                  <span className="block text-xs text-text-muted">Help me choose</span>
                </span>
              </label>
              {artists.map((a) => (
                <label key={a.slug} className={`${choice} grid content-between gap-6 p-4`}>
                  <input type="radio" name="artist" value={a.slug} defaultChecked={picked.artist === a.slug} className="sr-only" />
                  <span lang="ja" className="inline-flex h-10 w-10 items-center justify-center bg-shu font-display text-2xl leading-none text-shu-fg" aria-hidden="true">
                    {a.seal}
                  </span>
                  <span>
                    <span className="block text-base text-paper">{a.name}</span>
                    <span className="block text-xs text-text-muted">{a.role}</span>
                    <span className="mt-2 flex items-center gap-2 text-xs text-text-muted">
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot[a.availability.status]}`} aria-hidden="true" />
                      {availabilityLabel[a.availability.status]}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            {e.artist ? (
              <p className="text-sm text-err" role="alert">
                {e.artist}
              </p>
            ) : null}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="motif" label="Motif" error={e.motif}>
              <Select id="motif" name="motif" defaultValue={picked.motif} error={e.motif}>
                <option value="">Not decided</option>
                {motifs.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.name} ({m.ja})
                  </option>
                ))}
              </Select>
            </Field>
            <Field id="placement" label="Placement" error={e.placement}>
              <Select id="placement" name="placement" defaultValue={picked.placement} error={e.placement} required>
                <option value="" disabled>
                  Choose…
                </option>
                {placements.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div role="radiogroup" aria-labelledby="size-label" className="grid gap-3">
            <p id="size-label" className="text-sm text-text-muted">
              Rough size
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {sizes.map((s) => (
                <label key={s.id} className={`${choice} flex h-16 flex-col justify-center px-4`}>
                  <input type="radio" name="size" value={s.id} defaultChecked={picked.size === s.id} className="sr-only" />
                  <span className="text-sm text-paper">{s.label}</span>
                  <span className="text-xs text-text-muted">{s.note}</span>
                </label>
              ))}
            </div>
            {e.size ? (
              <p className="text-sm text-err" role="alert">
                {e.size}
              </p>
            ) : null}
          </div>

          <div role="radiogroup" aria-labelledby="method-label" className="grid gap-3">
            <p id="method-label" className="text-sm text-text-muted">
              Method
            </p>
            <div className="grid grid-cols-3 gap-3">
              {methods.map((m) => (
                <label key={m.id} className={`${choice} flex h-16 flex-col justify-center px-4`}>
                  <input type="radio" name="method" value={m.id} defaultChecked={picked.method === m.id} className="sr-only" />
                  <span className="text-sm text-paper">{m.label}</span>
                  <span className="text-xs text-text-muted">{m.note}</span>
                </label>
              ))}
            </div>
            {e.method ? (
              <p className="text-sm text-err" role="alert">
                {e.method}
              </p>
            ) : null}
          </div>

          <Field id="message" label="Anything else" error={e.message}>
            <Textarea
              id="message"
              name="message"
              maxLength={LIMITS.message}
              defaultValue={v("message")}
              placeholder="Reference images can come later. Existing tattoos near the placement, cover-ups, anything we should know."
              error={e.message}
            />
          </Field>
        </Section>

        <Section n="03" title="A time" note="Thirty minutes at the studio, Japan time. Free.">
          {e.slot ? (
            <p className="text-sm text-err" role="alert">
              {e.slot}
            </p>
          ) : null}
          {/* Day strip: pick a day, then a time. Every day's radios stay in the form, only the chosen day shows. */}
          <div className="no-scrollbar -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0 lg:overflow-visible">
            <div role="tablist" aria-label="Day" className="flex gap-2 lg:grid lg:grid-cols-6">
              {days.map((d) => {
                const free = d.slots.filter((s) => !s.taken).length;
                const on = d.date === day;
                const chosen = picked.slot.startsWith(d.date);
                return (
                  <button
                    key={d.date}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    disabled={free === 0}
                    onClick={() => setDay(d.date)}
                    className={`grid w-20 shrink-0 gap-1 border px-3 py-3 lg:w-auto text-left transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${
                      on ? "border-shu-bright bg-surface-raised" : "border-line hover:border-text-muted"
                    }`}
                  >
                    <span className="text-xs text-text-muted">{d.weekday}</span>
                    <span className="text-base leading-none text-paper">{d.label.split(" ")[0]}</span>
                    <span className="text-xs text-text-muted">{d.label.split(" ")[1]}</span>
                    <span className={`mt-1 h-1 w-1 rounded-full ${chosen ? "bg-shu-bright" : "bg-transparent"}`} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>
          {days.map((d) => (
            <div key={d.date} role="tabpanel" hidden={d.date !== day} className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {d.slots.map((s) => (
                <label
                  key={s.id}
                  className={`flex h-12 items-center justify-center border text-sm ${
                    s.taken ? "cursor-not-allowed border-line/50 text-text-muted/40 line-through" : `${choice} text-paper`
                  }`}
                >
                  <input type="radio" name="slot" value={s.id} disabled={s.taken} defaultChecked={v("slot") === s.id} className="sr-only" />
                  {s.time}
                </label>
              ))}
            </div>
          ))}
        </Section>

        <div className="grid gap-6 border-t border-line pt-8">
          <label className="flex items-start gap-3">
            <input type="checkbox" name="age" defaultChecked={v("age") === "on"} className="mt-1 h-4 w-4 accent-shu" />
            <span className="text-sm">
              I am 20 or over and will bring photo ID to the consultation.
              {e.age ? (
                <span className="block text-err" role="alert">
                  {e.age}
                </span>
              ) : null}
            </span>
          </label>
          <p className="text-sm text-text-muted">Next: a deposit step. This is a demo site, so the deposit is simulated and nothing is charged.</p>
          <div>
            <Button type="submit" variant="seal" disabled={pending}>
              {pending ? "Sending…" : "Continue to deposit"}
            </Button>
          </div>
        </div>
      </form>

      {/* Live summary of what has been chosen so far */}
      <aside aria-label="Your consultation" className="lg:col-span-5">
        <div className="lg:sticky lg:top-8">
          <GlowCard glowColor="red" autoGlow customSize className="min-w-0 grid-cols-1 grid-rows-none! content-start gap-6! p-6!">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-lg text-paper">Your consultation</p>
              <p className="text-sm text-text-muted">30 min · free</p>
            </div>
            <div className="grid grid-cols-[6rem_1fr] gap-5">
              <div className="aspect-[4/5] overflow-hidden">
                {motif ? (
                  <MotifPlate motif={motif} size="thumb" />
                ) : (
                  <div className="flex h-full items-center justify-center border border-dashed border-line font-display text-3xl text-text-muted" lang="ja" aria-hidden="true">
                    鱗
                  </div>
                )}
              </div>
              <dl className="grid content-start gap-3 text-sm">
                <div>
                  <dt className="text-text-muted">Motif</dt>
                  <dd className="text-paper">{motif ? `${motif.name} · ${motif.sessions[0]}–${motif.sessions[1]} sessions` : "Not decided"}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Artist</dt>
                  <dd className="text-paper">{artist ? `${artist.name}, ${artist.role.toLowerCase()}` : "Any"}</dd>
                </div>
              </dl>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5 text-sm">
              <div>
                <dt className="text-text-muted">Placement</dt>
                <dd className="text-paper">{picked.placement || "—"}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Size</dt>
                <dd className="text-paper">{size ? `${size.label}, ${size.note}` : "—"}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Method</dt>
                <dd className="text-paper">{method ? method.label : "—"}</dd>
              </div>
              <div className="col-span-2 border-t border-line pt-4">
                <dt className="text-text-muted">When</dt>
                <dd className="text-lg text-shu-bright">{picked.slot ? formatSlot(picked.slot) : "Pick a day and a time"}</dd>
              </div>
            </dl>
          </GlowCard>
        </div>
      </aside>
    </div>
  );
}
