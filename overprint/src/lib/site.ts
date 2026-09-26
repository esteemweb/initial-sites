/* Site-wide contact details. Demo site: `.example` is a domain reserved for
   examples by internet standards (RFC 2606), so this address can never belong to
   a real person or business. Swap in a real inbox only if the studio becomes real. */
export const studioEmail = "hello@overprint.example";

/* Any component can open the enquiry dialog by dispatching this event — the
   dialog lives once, in the header. */
export const OPEN_ENQUIRY_EVENT = "overprint:open-enquiry";

export function openEnquiry() {
  window.dispatchEvent(new Event(OPEN_ENQUIRY_EVENT));
}
