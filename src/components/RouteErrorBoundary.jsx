import { isRouteErrorResponse, useRouteError } from "react-router-dom";

import EventSphereBackdrop from "./EventSphereBackdrop";
import { Button, LinkButton } from "./ui";

const RouteErrorBoundary = () => {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error?.message || "Something went wrong while rendering this page.";

  return (
    <main className="relative isolate grid min-h-screen place-items-center bg-[#030507] px-5 text-white">
      <EventSphereBackdrop />
      <section className="max-w-xl rounded-md border border-white/12 bg-black/24 p-6 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
          EventSphere
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Something needs a refresh</h1>
        <p className="mt-3 text-sm leading-6 text-white/62">{message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button type="button" variant="secondary" onClick={() => window.location.reload()}>
            Reload page
          </Button>
          <LinkButton to="/dashboard">Go to dashboard</LinkButton>
        </div>
      </section>
    </main>
  );
};

export default RouteErrorBoundary;
