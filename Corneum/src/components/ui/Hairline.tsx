/* design-system §Colour: the only separator. 1px, ink at 0.12. Rules
   between content, never a component boundary (1.32:1 is below 3:1). */
export function Hairline({ className = "" }: { className?: string }) {
  return <hr className={`col-span-12 ${className}`} />;
}
