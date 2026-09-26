/** Minimal class joiner. No dependency needed for the class shapes we use. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
