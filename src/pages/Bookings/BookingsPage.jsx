import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { EmptyState, ErrorState, LoadingSkeleton } from "../../components/AsyncState";
import { Badge, Card, LinkButton, PageHeader } from "../../components/ui";
import { fetchMyBookings } from "../../features/bookings/bookingsSlice";
import { formatCurrency, formatDate } from "../../utils/format";

const BookingsPage = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  return (
    <>
      <PageHeader
        eyebrow="Bookings"
        title="My bookings"
        description="Track pending and confirmed bookings connected to your account."
        actions={<LinkButton to="/events">Book another ticket</LinkButton>}
      />
      {status === "loading" ? <LoadingSkeleton rows={5} /> : null}
      {status === "failed" ? <ErrorState message={error} onRetry={() => dispatch(fetchMyBookings())} /> : null}
      {status !== "loading" && items.length === 0 ? (
        <EmptyState title="No bookings found" detail="Approved events can be booked from the event details page." />
      ) : null}
      <div className="grid gap-4">
        {items.map((booking) => (
          <Card key={booking._id} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold">{booking.eventId?.title || "Event"}</h2>
                <Badge tone={booking.paymentStatus === "paid" ? "success" : booking.bookingStatus === "cancelled" ? "danger" : "warning"}>
                  {booking.paymentStatus === "paid" ? "Paid" : booking.bookingStatus === "cancelled" ? "Cancelled" : "Pending Payment"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                {booking.quantity} ticket(s) · {formatCurrency(booking.amount)} · {formatDate(booking.createdAt)}
              </p>
            </div>
            <p className="text-sm text-slate-500">{booking.eventId?.venue}</p>
          </Card>
        ))}
      </div>
    </>
  );
};

export default BookingsPage;
