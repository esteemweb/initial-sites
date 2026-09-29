// Skeleton for the library while a filtered request renders on the server.
export default function MotifsLoading() {
  return (
    <section className="stage" aria-busy="true" aria-label="Loading motifs">
      <div className="stage-inner">
        <div className="h-4 w-32 bg-surface-deep" />
        <div className="mt-4 h-12 w-2/3 max-w-xl bg-surface-deep" />
        <div className="mt-12 h-40 border-y border-line" />
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <li key={i}>
              <div className="aspect-[4/5] bg-surface-deep" />
              <div className="mt-3 h-5 w-1/2 bg-surface-deep" />
              <div className="mt-2 h-4 w-3/4 bg-surface-deep" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
