import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { ErrorState, LoadingSkeleton } from "../../components/AsyncState";
import { Badge, Button, Card, Field, PageHeader, inputClass } from "../../components/ui";
import { createBooking, fetchMyBookings } from "../../features/bookings/bookingsSlice";
import { clearPayment, confirmPayment, createPaymentOrder, paymentCancelled } from "../../features/payments/paymentsSlice";
import { fetchEventDetails, selectSelectedEvent } from "../../features/events/eventsSlice";
import { formatCurrency, formatDate, getEventSeatsLabel } from "../../utils/format";

const loadRazorpay = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Razorpay checkout could not be loaded"));
    document.body.appendChild(script);
  });

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const event = useSelector(selectSelectedEvent);
  const user = useSelector((state) => state.auth.user);
  const { detailsStatus, error } = useSelector((state) => state.events);
  const bookingStatus = useSelector((state) => state.bookings.actionStatus);
  const paymentStatus = useSelector((state) => state.payments.status);
  const myBookings = useSelector((state) => state.bookings.items);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchEventDetails(eventId));
    if (user) {
      dispatch(fetchMyBookings());
    }
    return () => dispatch(clearPayment());
  }, [dispatch, eventId, user]);

  const handleBooking = async () => {
    let bookingId;
    
    if (existingBooking) {
      bookingId = existingBooking._id;
    } else {
      const bookingResult = await dispatch(createBooking({ eventId, quantity: Number(quantity) }));
      if (!createBooking.fulfilled.match(bookingResult)) return;
      bookingId = bookingResult.payload._id;
    }

    const orderResult = await dispatch(createPaymentOrder({ bookingId }));
    if (!createPaymentOrder.fulfilled.match(orderResult)) return;

    const payment = orderResult.payload;
    await loadRazorpay();

    const checkout = new window.Razorpay({
      key: payment.keyId,
      amount: payment.order.amount,
      currency: payment.order.currency,
      name: "EventSphere",
      description: event.title,
      order_id: payment.order.id,
      handler: (response) => {
        dispatch(
          confirmPayment({
            bookingId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        );
      },
      modal: {
        ondismiss: () => dispatch(paymentCancelled()),
      },
      theme: { color: "#67e8f9" },
    });

    checkout.open();
  };

  if (detailsStatus === "loading") return <LoadingSkeleton rows={6} />;
  if (detailsStatus === "failed") return <ErrorState message={error} onRetry={() => dispatch(fetchEventDetails(eventId))} />;
  if (!event) return null;

  const existingBooking = myBookings.find((booking) => booking.eventId?._id === eventId && booking.bookingStatus !== "cancelled");
  const canBook = user?.role === "user" && event.isApproved && event.availableSeats > 0 && !existingBooking;
  const busy = bookingStatus === "loading" || paymentStatus === "loading";

  return (
    <>
      <PageHeader eyebrow="Event details" title={event.title} description={event.description} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="p-0">
          <div className="aspect-[16/8] overflow-hidden rounded-t-md bg-slate-900">
            {event.banner ? <img className="h-full w-full object-cover" src={event.banner} alt={event.title} /> : null}
          </div>
          <div className="grid gap-4 p-5 text-sm text-slate-300">
            <Badge tone={event.isApproved ? "success" : "warning"}>{event.isApproved ? "Approved" : "Awaiting approval"}</Badge>
            <p>{event.venue}</p>
            <p>{formatDate(event.eventDate)}</p>
            <p>{getEventSeatsLabel(event)}</p>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Ticket price</p>
          <strong className="mt-1 block text-3xl text-white">{formatCurrency(event.price)}</strong>
          {existingBooking ? (
            <>
              <div className="mt-4 rounded-md border border-white/10 bg-white/[0.045] p-4">
                <p className="text-sm font-semibold text-white">You already have a booking for this event</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge tone={existingBooking.paymentStatus === "paid" ? "success" : "warning"}>
                    {existingBooking.paymentStatus === "paid" ? "Paid" : "Pending Payment"}
                  </Badge>
                  <span className="text-sm text-slate-400">
                    {existingBooking.quantity} ticket(s) · {formatCurrency(existingBooking.amount)}
                  </span>
                </div>
                {existingBooking.paymentStatus !== "paid" && (
                  <Button className="mt-3 w-full" type="button" disabled={busy} onClick={handleBooking}>
                    {busy ? "Processing..." : "Complete Payment"}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <Field label="Quantity" id="quantity">
                <input id="quantity" className={inputClass} type="number" min="1" max={event.availableSeats || 1} value={quantity} onChange={(e) => setQuantity(e.target.value)} disabled={!canBook} />
              </Field>
              <Button className="mt-4 w-full" type="button" disabled={!canBook || busy} onClick={handleBooking}>
                {busy ? "Processing..." : "Book and pay"}
              </Button>
              {!canBook ? <p className="mt-3 text-sm text-slate-500">Bookings are available only for verified user accounts on approved events with seats available.</p> : null}
            </>
          )}
        </Card>
      </div>
    </>
  );
};

export default EventDetailsPage;
