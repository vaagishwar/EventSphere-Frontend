import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import EventCard from "../../components/EventCard";
import { EmptyState, ErrorState, LoadingSkeleton } from "../../components/AsyncState";
import { LinkButton, PageHeader } from "../../components/ui";
import { fetchEvents } from "../../features/events/eventsSlice";

const EventsListPage = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.events);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Event catalog"
        description="Approved events are visible to users. Organizers see their own submissions, and admins see every event."
        actions={user?.role === "organizer" ? <LinkButton to="/organizer/events/new">Create event</LinkButton> : null}
      />
      {status === "loading" ? <LoadingSkeleton rows={5} /> : null}
      {status === "failed" ? <ErrorState message={error} onRetry={() => dispatch(fetchEvents())} /> : null}
      {status !== "loading" && status !== "failed" && items.length === 0 ? (
        <EmptyState title="No events found" detail="Create an event as an organizer or wait for approved public events." />
      ) : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((event) => <EventCard key={event._id} event={event} />)}
      </div>
    </>
  );
};

export default EventsListPage;
