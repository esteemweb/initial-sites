/** Shared by the forms and the server, so both say the same thing. */

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const NAME = /^[\p{L}\p{N} ._'-]+$/u;

export function checkEmail(v: string): string | null {
  const e = v.trim();
  if (!e) return "an email, so the link has somewhere to go";
  if (e.length > 254 || !EMAIL.test(e)) return "that email doesn't look right. check for a typo";
  return null;
}

export function checkName(v: string): string | null {
  const n = v.trim();
  if (!n) return "a name to call you. anything, it's only for this page";
  if (n.length < 2) return "at least two characters";
  if (n.length > 24) return "24 characters at most";
  if (!NAME.test(n)) return "letters, numbers, spaces, dots, dashes. nothing fancier";
  return null;
}

export type FieldError = { field: "email" | "name" | "form"; message: string };
