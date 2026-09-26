/* Splits a passage into word spans on the server, for the reading pace (see
   read-pace.tsx). The container carries class "pace". The word spans are
   hidden from assistive tech and a plain copy is given instead, so screen
   readers get one continuous sentence, not one stop per word. */
export function Pace({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(/(\s+)/).map((part, i) =>
          /^\s+$/.test(part) || part === "" ? part : (
            <span key={i} className="w-pace">
              {part}
            </span>
          ),
        )}
      </span>
    </>
  );
}
