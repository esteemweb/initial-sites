/* Project enquiry — option lists and validation rules for the dialog. Demo site:
   the form is validated in the browser only; nothing is sent or stored. */

export const projectTypes = [
  { plate: "C", value: "identity", label: "Identity systems" },
  { plate: "M", value: "editorial", label: "Editorial & print" },
  { plate: "Y", value: "packaging", label: "Packaging" },
  { plate: "K", value: "type-web", label: "Type & web" },
] as const;

export const budgets = ["Under £5k", "£5k–£15k", "£15k–£40k", "£40k+", "Not sure yet"] as const;
export const timelines = ["ASAP", "1–3 months", "3–6 months", "Flexible"] as const;

export type Enquiry = {
  name: string;
  email: string;
  company: string;
  types: string[];
  budget: string;
  timeline: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof Enquiry, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEnquiry(input: Partial<Record<keyof Enquiry, unknown>>): {
  data: Enquiry;
  errors: FieldErrors;
} {
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const types = Array.isArray(input.types)
    ? input.types.filter((t): t is string => projectTypes.some((p) => p.value === t))
    : [];

  const data: Enquiry = {
    name: str(input.name, 100),
    email: str(input.email, 200),
    company: str(input.company, 150),
    types,
    budget: budgets.includes(input.budget as (typeof budgets)[number]) ? (input.budget as string) : "",
    timeline: timelines.includes(input.timeline as (typeof timelines)[number]) ? (input.timeline as string) : "",
    message: str(input.message, 3000),
  };

  const errors: FieldErrors = {};
  if (!data.name) errors.name = "Tell us your name.";
  if (!EMAIL.test(data.email)) errors.email = "Enter an email address we can reply to, like name@example.com.";
  if (data.types.length === 0) errors.types = "Pick at least one kind of project.";
  if (data.message.length < 20) errors.message = "Tell us a bit more — at least 20 characters.";
  return { data, errors };
}
