import { LinkButton, PageHeader } from "../components/ui";
import EventSphereBackdrop from "../components/EventSphereBackdrop";

const NotFoundPage = () => (
  <main className="relative isolate grid min-h-screen place-items-center bg-[#030507] px-5 text-white">
    <EventSphereBackdrop />
    <section className="max-w-xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
        EventSphere
      </p>
      <PageHeader
        title="Page not found"
        description="This route is not part of the current guest, user, or organizer experience."
      />
      <div className="flex justify-center">
        <LinkButton to="/">Back home</LinkButton>
      </div>
    </section>
  </main>
);

export default NotFoundPage;
