import type { ReactElement } from "react";
import { SPEC_LABELS, type SpecCode } from "@/data/products";
import IconShell, { type IconLabelling } from "./IconShell";
import { SPEC_GLYPHS } from "./glyph-paths";

interface SpecMarkProps extends IconLabelling {
  code: SpecCode;
}

/**
 * One spec mark. The text equivalent comes from the catalogue's `SPEC_LABELS`,
 * so the mark and its wording can never drift apart.
 */
export default function SpecMark({
  code,
  ...labelling
}: SpecMarkProps): ReactElement {
  return (
    <IconShell
      paths={SPEC_GLYPHS[code]}
      defaultLabel={SPEC_LABELS[code]}
      {...labelling}
    />
  );
}
