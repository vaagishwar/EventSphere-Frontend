export const LoadingSkeleton = ({ rows = 3, className = "" }) => (
  <div className={`grid gap-3 ${className}`} aria-busy="true" aria-live="polite">
    {Array.from({ length: rows }).map((_, index) => (
      <div
        key={index}
        className="h-12 animate-pulse rounded-md border border-white/10 bg-white/8 shadow-inner shadow-black/10 backdrop-blur-md"
      />
    ))}
  </div>
);

export const EmptyState = ({ title = "Nothing here yet", detail }) => (
  <section className="rounded-md border border-white/12 bg-black/22 p-5 text-white shadow-2xl shadow-black/10 backdrop-blur-xl">
    <h2 className="text-base font-semibold">{title}</h2>
    {detail ? <p className="mt-1 text-sm text-white/58">{detail}</p> : null}
  </section>
);

export const ErrorState = ({ message = "Something went wrong", onRetry }) => (
  <section className="rounded-md border border-red-300/25 bg-red-500/10 p-5 text-white shadow-2xl shadow-red-950/10 backdrop-blur-xl">
    <h2 className="text-base font-semibold">Unable to load data</h2>
    <p className="mt-1 text-sm text-red-100/80">{message}</p>
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-md border border-white/15 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
      >
        Retry
      </button>
    ) : null}
  </section>
);
