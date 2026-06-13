import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { EmptyState, LoadingSkeleton } from "../../components/AsyncState";
import { LinkButton, PageHeader, StatCard } from "../../components/ui";
import { fetchMyBookings } from "../../features/bookings/bookingsSlice";
import { fetchEvents } from "../../features/events/eventsSlice";
import { selectDashboardMetrics } from "../../features/dashboard/dashboardSlice";
import { formatCurrency } from "../../utils/format";

const UserDashboardPage = () => {
  const dispatch = useDispatch();
  const metrics = useSelector(selectDashboardMetrics);
  const bookingsStatus = useSelector((state) => state.bookings.status);

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchMyBookings());
  }, [dispatch]);

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome${metrics.user?.name ? `, ${metrics.user.name}` : ""}`}
        description="Track your ticket bookings and discover approved upcoming events."
        actions={
          <>
            <LinkButton to="/events">Browse events</LinkButton>
            <LinkButton to="/bookings" variant="secondary">My bookings</LinkButton>
          </>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Approved events" value={metrics.approvedEvents} />
        <StatCard label="Your bookings" value={metrics.totalBookings} />
        <StatCard label="Paid value" value={formatCurrency(metrics.revenue)} />
      </div>
      <div className="mt-6">
        {bookingsStatus === "loading" ? <LoadingSkeleton rows={4} /> : null}
        {bookingsStatus !== "loading" && metrics.totalBookings === 0 ? (
          <EmptyState title="No bookings yet" detail="Choose an approved event and start checkout to create your first booking." />
        ) : null}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-white/12 bg-black/22 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <h2 className="text-lg font-semibold">Recommended next step</h2>
          <p className="mt-2 text-sm leading-6 text-white/58">
            Start from the event catalog. Only approved upcoming events are shown to user accounts, matching the backend visibility rules.
          </p>
          <LinkButton className="mt-4" to="/events" variant="secondary">Open catalog</LinkButton>
        </div>
        <div className="rounded-md border border-white/12 bg-black/22 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <h2 className="text-lg font-semibold">Payment flow</h2>
          <p className="mt-2 text-sm leading-6 text-white/58">
            Booking creates a pending reservation first, then Razorpay checkout confirms payment and seats.
          </p>
        </div>
      </div>
    </>
  );
};

export default UserDashboardPage;
