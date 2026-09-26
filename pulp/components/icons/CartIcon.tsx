import type { ReactElement } from "react";
import IconShell, { type IconLabelling } from "./IconShell";
import { CART_GLYPH } from "./glyph-paths";

/** Basket icon. Drawn to match the spec set: same grid, same limb, flat and filled. */
export default function CartIcon(props: IconLabelling): ReactElement {
  return <IconShell paths={CART_GLYPH} defaultLabel="Basket" {...props} />;
}
