/* pattern: segmented control — design-system §8 "Subscription interactive
   widget". 48px tall, radius 0, 1px hairline around the group and between
   cells. Active state is a 2px --color-rule underline PLUS weight 500, so
   colour is never the only signal (autopsy §13 lists colour-as-only-signal
   as a leave-behind — the reference's in-copy phone link had neither).

   Real <input type="radio"> in a <fieldset> with a <legend>. Never a div with
   an onClick: arrow-key roving focus, form semantics and screen-reader
   group announcement all come free from the radio group. */
import { cn } from "@/lib/cn";

export type Option<T extends string> = {
  value: T;
  label: string;
  /** When set the option is unselectable, and this is shown as helper text. */
  unavailableReason?: string | null;
};

type Props<T extends string> = {
  /** Rendered as the <legend>; also the accessible group name. */
  legend: string;
  name: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  /** Extra line under the control, e.g. why an option is unavailable. */
  helper?: string | null;
};

export function SegmentedControl<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  helper,
}: Props<T>) {
  const helperId = `${name}-helper`;

  return (
    <fieldset className="min-w-0">
      <legend className="font-mono text-2xs uppercase text-text-muted">
        {legend}
      </legend>

      <div
        className="mt-3 flex flex-wrap border border-hairline"
        aria-describedby={helper ? helperId : undefined}
      >
        {options.map((opt) => {
          const disabled = Boolean(opt.unavailableReason);
          const checked = opt.value === value;

          return (
            <label
              key={opt.value}
              className={cn(
                "relative flex h-12 flex-1 cursor-pointer items-center justify-center",
                "border-r border-hairline px-4 text-sm last:border-r-0",
                "u-transition-ui",
                "u-focus-ring-within",
                // active = underline + weight, two signals not one
                checked
                  ? "u-seg-active font-medium text-text"
                  : "text-text-muted hover:text-text",
                disabled && "cursor-not-allowed opacity-45 hover:text-text-muted",
              )}
            >
              {/* aria-disabled, not the `disabled` attribute: a disabled radio
                  cannot take focus, so a keyboard user would never reach the
                  option and never hear why it is unavailable. */}
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                aria-disabled={disabled || undefined}
                aria-describedby={disabled ? helperId : undefined}
                onChange={() => {
                  if (!disabled) onChange(opt.value);
                }}
                className="sr-only"
              />
              {opt.label}
            </label>
          );
        })}
      </div>

      {helper ? (
        <p id={helperId} className="mt-3 font-mono text-2xs text-text-muted">
          {helper}
        </p>
      ) : null}
    </fieldset>
  );
}
