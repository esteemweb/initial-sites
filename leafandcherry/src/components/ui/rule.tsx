/* pattern: the 2px accent rule as the sole structural device —
   autopsy §6 "Dividers", design-system §5 "The rule component, three jobs" */
import { cn } from "@/lib/cn";

type TrailingProps = {
  /** Heading-trailing rule: sits beside a heading and runs to the container edge. */
  variant: "trailing";
  /** Draw in from the left with scroll progress — autopsy §15.5. Needs a
   *  ScrollProgress ancestor; without one the rule is simply fully drawn. */
  draw?: boolean;
  className?: string;
};

type CapProps = {
  /** Block cap: a fixed-width horizontal rule above an item in the sequence. */
  variant: "cap";
  className?: string;
};

type Props = TrailingProps | CapProps;

/**
 * The third job — the vertical leading rule — is the `u-rule-lead` utility
 * rather than a component, because it has to be a border on the content box
 * it leads (a sibling element cannot stretch to an unknown content height).
 */
export function Rule(props: Props) {
  const { variant, className } = props;
  if (variant === "trailing") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          // 25px measured between heading text and rule -> --space-6 (24px)
          "ml-6 hidden h-0 flex-1 self-center border-t-2 border-rule sm:block",
          props.draw && "u-rule-draw",
          className,
        )}
      />
    );
  }

  return (
    <hr
      aria-hidden="true"
      className={cn(
        "w-rule-cap border-0 border-t-2 border-rule",
        className,
      )}
    />
  );
}
