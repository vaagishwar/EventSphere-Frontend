import { useEffect } from "react";
import { BarChart3, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { EmptyState, ErrorState, LoadingSkeleton } from "../../components/AsyncState";
import { Badge, Button, Card, LinkButton, PageHeader, StatCard } from "../../components/ui";
import { deleteEvent, fetchEvents } from "../../features/events/eventsSlice";
import { formatDate, getEventId } from "../../utils/format";

const OrganizerDashboardPage = () => {
  const dispatch = useDispatch();
  const { items, status, error, actionStatus } = useSelector((state) => state.events);
  const pending = items.filter((event) => !event.isApproved).length;

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <>
      <PageHeader
        eyebrow="Organizer"
        title="Organizer dashboard"
        description="Create events, monitor approval status, and update submissions before bookings begin."
        actions={
          <>
            <LinkButton to="/organizer/events/new">Create event</LinkButton>
            <LinkButton to="/events" variant="secondary">View catalog</LinkButton>
          </>
        }
      />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Your events" value={items.length} />
        <StatCard label="Pending approval" value={pending} />
        <StatCard label="Approved" value={items.length - pending} />
      </div>
      {status === "loading" ? <LoadingSkeleton rows={5} /> : null}
      {status === "failed" ? <ErrorState message={error} onRetry={() => dispatch(fetchEvents())} /> : null}
      {status !== "loading" && items.length === 0 ? <EmptyState title="No organizer events yet" detail="Create your first event to submit it for admin approval." /> : null}
      <div className="grid gap-4">
        {items.map((event) => (
          <Card key={getEventId(event)} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">{event.title}</h2>
                <Badge tone={event.isApproved ? "success" : "warning"}>{event.isApproved ? "Approved" : "Pending"}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-400">{event.venue} · {formatDate(event.eventDate)}</p>
            </div>
            <div className="flex gap-2">
              <Button as={Link} to={`/organizer/events/${getEventId(event)}`} variant="secondary">
                <BarChart3 size={16} className="mr-2" /> Manage
              </Button>
              <Button as={Link} to={`/organizer/events/${getEventId(event)}/edit`} variant="secondary">
                <Edit size={16} className="mr-2" /> Edit
              </Button>
              <Button type="button" variant="danger" disabled={actionStatus === "loading"} onClick={() => dispatch(deleteEvent(getEventId(event)))}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default OrganizerDashboardPage;
