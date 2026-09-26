import type { ReactElement } from "react";
import IconShell, { type IconLabelling } from "./IconShell";
import { CLOSE_GLYPH } from "./glyph-paths";

/** Close icon. The same cross the "do not" care symbols use, so the mark stays one mark. */
export default function CloseIcon(props: IconLabelling): ReactElement {
  return <IconShell paths={CLOSE_GLYPH} defaultLabel="Close" {...props} />;
}
