import { Copy, Edit, ExternalLink, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EmptyState, ErrorState, LoadingSkeleton } from "../../components/AsyncState";
import { Badge, Button, Card, LinkButton, PageHeader, StatCard } from "../../components/ui";
import { deleteEvent } from "../../features/events/eventsSlice";
import {
  clearOrganizerAnalytics,
  fetchOrganizerEventAnalytics,
} from "../../features/organizer/organizerAnalyticsSlice";
import { successToast } from "../../lib/toast";
import { formatCurrency, formatDate, getEventId } from "../../utils/format";

const chartTooltipStyle = {
  background: "rgba(3, 5, 7, 0.92)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 8,
  color: "#fff",
};

const MetaItem = ({ label, value }) => (
  <div className="rounded-md border border-white/10 bg-white/[0.045] p-3">
    <p className="text-xs uppercase tracking-[0.2em] text-white/36">{label}</p>
    <p className="mt-1 text-sm font-semibold text-white">{value}</p>
  </div>
);

const OrganizerEventManagementPage = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const analytics = useSelector((state) => state.organizerAnalytics);
  const eventActionStatus = useSelector((state) => state.events.actionStatus);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchOrganizerEventAnalytics({ eventId, page, limit: 10 }));
    return () => dispatch(clearOrganizerAnalytics());
  }, [dispatch, eventId, page]);

  const event = analytics.event;
  const trend = useMemo(() => analytics.trend ?? [], [analytics.trend]);
  const soldSeats = event ? event.totalSeats - event.availableSeats : 0;

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/events/${eventId}`;
    await navigator.clipboard.writeText(link);
    successToast("Event link copied");
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteEvent(eventId));
    if (deleteEvent.fulfilled.match(result)) {
      navigate("/organizer");
    }
  };

  if (analytics.status === "loading" && !event) {
    return <LoadingSkeleton rows={8} />;
  }

  if (analytics.status === "failed") {
    return (
      <ErrorState
        message={analytics.error}
        onRetry={() => dispatch(fetchOrganizerEventAnalytics({ eventId, page, limit: 10 }))}
      />
    );
  }

  if (!event) return null;

  return (
    <>
      <PageHeader
        eyebrow="Organizer event"
        title={event.title}
        description="Manage event details, monitor seat movement, and review attendee activity without exposing attendee checkout controls."
        actions={
          <>
            <LinkButton to={`/organizer/events/${eventId}/edit`} variant="secondary">
              <Edit size={16} className="mr-2" /> Edit Event
            </LinkButton>
            <LinkButton to={`/events/${eventId}`} variant="secondary">
              <ExternalLink size={16} className="mr-2" /> Public Page
            </LinkButton>
            <Button type="button" variant="secondary" onClick={handleCopyLink}>
              <Copy size={16} className="mr-2" /> Copy Link
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={eventActionStatus === "loading"}
              onClick={handleDelete}
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </Button>
          </>
        }
      />

      {!event.isApproved ? (
        <Card className="mb-6 border-amber-300/25 bg-amber-300/10">
          <Badge tone="warning">Waiting For Admin Approval</Badge>
          <p className="mt-2 text-sm leading-6 text-amber-50/75">
            This event is visible to you as the organizer, but users cannot book tickets until an admin approves it.
          </p>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden p-0">
          <div className="aspect-[16/7] overflow-hidden bg-black/40">
            {event.banner ? (
              <img className="h-full w-full object-cover" src={event.banner} alt={event.title} />
            ) : (
              <div className="grid h-full place-items-center bg-gradient-to-br from-cyan-300/18 via-[#B497CF]/16 to-[#C89B3C]/14 text-white/42">
                EventSphere
              </div>
            )}
          </div>
          <div className="p-5">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge tone={event.isApproved ? "success" : "warning"}>
                {event.isApproved ? "Approved" : "Pending Approval"}
              </Badge>
              <Badge>{soldSeats}/{event.totalSeats} sold</Badge>
            </div>
            <p className="max-w-3xl text-sm leading-6 text-white/58">{event.description}</p>
          </div>
        </Card>

        <Card>
          <div className="grid gap-3 sm:grid-cols-2">
            <MetaItem label="Venue" value={event.venue} />
            <MetaItem label="Date" value={formatDate(event.eventDate)} />
            <MetaItem label="Ticket Price" value={formatCurrency(event.price)} />
            <MetaItem label="Total Seats" value={event.totalSeats} />
            <MetaItem label="Available Seats" value={analytics.availableSeats} />
            <MetaItem label="Created" value={formatDate(event.createdAt)} />
            <MetaItem label="Updated" value={formatDate(event.updatedAt)} />
          </div>
        </Card>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
        <StatCard label="Total Bookings" value={analytics.totalBookings} />
        <StatCard label="Confirmed Bookings" value={analytics.confirmedBookings} />
        <StatCard label="Pending Bookings" value={analytics.pendingBookings} />
        <StatCard label="Cancelled Bookings" value={analytics.cancelledBookings} />
        <StatCard label="Available Seats" value={analytics.availableSeats} />
        <StatCard label="Revenue Generated" value={formatCurrency(analytics.revenue)} />
        <StatCard label="Fill Rate" value={`${analytics.fillRate}%`} detail={`${soldSeats} seats filled`} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Bookings Trend</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.42)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.42)" tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                <Bar dataKey="bookings" name="Daily Booking Count" fill="#67e8f9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Revenue Trend</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#C89B3C" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#C89B3C" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.42)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.42)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#C89B3C" fill="url(#revenueGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <Card className="mt-6 overflow-hidden">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent Attendees</h2>
            <p className="mt-1 text-sm text-white/50">Latest bookings for this event.</p>
          </div>
          <Badge>{analytics.pagination.total} records</Badge>
        </div>

        {analytics.recentBookings.length === 0 ? (
          <EmptyState title="No bookings yet" detail="Attendees will appear after users create bookings." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] border-separate border-spacing-0 text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.18em] text-white/38">
                <tr>
                  {["User Name", "Email", "Tickets", "Amount", "Payment Status", "Booking Status", "Created At"].map((heading) => (
                    <th key={heading} className="border-b border-white/10 px-3 py-3 font-semibold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analytics.recentBookings.map((booking) => (
                  <tr key={booking._id} className="text-white/72">
                    <td className="border-b border-white/8 px-3 py-4 font-semibold text-white">{booking.userId?.name || "Unknown user"}</td>
                    <td className="border-b border-white/8 px-3 py-4">{booking.userId?.email || "Not available"}</td>
                    <td className="border-b border-white/8 px-3 py-4">{booking.quantity}</td>
                    <td className="border-b border-white/8 px-3 py-4">{formatCurrency(booking.amount)}</td>
                    <td className="border-b border-white/8 px-3 py-4"><Badge>{booking.paymentStatus}</Badge></td>
                    <td className="border-b border-white/8 px-3 py-4"><Badge tone={booking.bookingStatus === "confirmed" ? "success" : "warning"}>{booking.bookingStatus}</Badge></td>
                    <td className="border-b border-white/8 px-3 py-4">{formatDate(booking.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <Button type="button" variant="secondary" disabled={page <= 1} onClick={() => setPage((value) => Math.max(value - 1, 1))}>
            Previous
          </Button>
          <p className="text-sm text-white/50">
            Page {analytics.pagination.page} of {analytics.pagination.totalPages}
          </p>
          <Button type="button" variant="secondary" disabled={page >= analytics.pagination.totalPages} onClick={() => setPage((value) => value + 1)}>
            Next
          </Button>
        </div>
      </Card>
    </>
  );
};

export default OrganizerEventManagementPage;
