import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { EmptyState, ErrorState, LoadingSkeleton } from "../../components/AsyncState";
import { Badge, Button, Card, PageHeader, StatCard } from "../../components/ui";
import { approveEvent, fetchEvents } from "../../features/events/eventsSlice";
import { formatDate, getEventId } from "../../utils/format";

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { items, status, error, actionStatus } = useSelector((state) => state.events);
  const pending = items.filter((event) => !event.isApproved);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <>
      <PageHeader eyebrow="Admin" title="Admin dashboard" description="Approve organizer events and review platform readiness." />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="All events" value={items.length} />
        <StatCard label="Pending approval" value={pending.length} />
        <StatCard label="Approved events" value={items.length - pending.length} />
      </div>
      {status === "loading" ? <LoadingSkeleton rows={4} /> : null}
      {status === "failed" ? <ErrorState message={error} onRetry={() => dispatch(fetchEvents())} /> : null}
      {status !== "loading" && pending.length === 0 ? <EmptyState title="No pending approvals" detail="New organizer submissions will appear here." /> : null}
      <div className="grid gap-4">
        {pending.map((event) => (
          <Card key={getEventId(event)} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">{event.title}</h2>
                <Badge tone="warning">Pending</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-400">{event.venue} · {formatDate(event.eventDate)}</p>
            </div>
            <Button type="button" disabled={actionStatus === "loading"} onClick={() => dispatch(approveEvent(getEventId(event)))}>
              Approve event
            </Button>
          </Card>
        ))}
      </div>
    </>
  );
};

export default AdminDashboardPage;
