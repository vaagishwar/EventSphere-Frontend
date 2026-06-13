import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { LoadingSkeleton } from "../../components/AsyncState";
import { Button, Card, Field, PageHeader, inputClass } from "../../components/ui";
import { createEvent, fetchEventDetails, selectSelectedEvent, updateEvent } from "../../features/events/eventsSlice";
import { errorToast } from "../../lib/toast";

const emptyForm = {
  title: "",
  description: "",
  venue: "",
  eventDate: "",
  totalSeats: 50,
  price: 499,
  banner: "",
};

const toLocalInputDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const EventEditorForm = ({ eventId, initialForm, isEdit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actionStatus } = useSelector((state) => state.events);
  const [form, setForm] = useState(initialForm);
  const loading = actionStatus === "loading";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedDate = new Date(form.eventDate);

    if (Number.isNaN(selectedDate.getTime())) {
      errorToast("Choose a valid event date and time");
      return;
    }

    if (selectedDate.getTime() <= Date.now()) {
      errorToast("Event date must be in the future");
      return;
    }

    const payload = {
      ...form,
      eventDate: selectedDate.toISOString(),
      totalSeats: Number(form.totalSeats),
      price: Number(form.price),
      banner: form.banner || undefined,
    };

    const result = isEdit
      ? await dispatch(updateEvent({ eventId, payload }))
      : await dispatch(createEvent(payload));

    if (createEvent.fulfilled.match(result) || updateEvent.fulfilled.match(result)) {
      navigate("/organizer");
    }
  };

  return (
    <Card>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <Field label="Title" id="title">
          <input id="title" className={inputClass} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Venue" id="venue">
          <input id="venue" className={inputClass} required value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
        </Field>
        <Field label="Event date" id="eventDate">
          <input id="eventDate" className={inputClass} type="datetime-local" required value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
        </Field>
        <Field label="Banner URL" id="banner">
          <input id="banner" className={inputClass} value={form.banner} onChange={(e) => setForm({ ...form, banner: e.target.value })} />
        </Field>
        <Field label="Total seats" id="totalSeats">
          <input id="totalSeats" className={inputClass} type="number" min="1" required value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: e.target.value })} />
        </Field>
        <Field label="Price in INR" id="price">
          <input id="price" className={inputClass} type="number" min="1" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </Field>
        <Field label="Description" id="description">
          <textarea id="description" className={`${inputClass} min-h-32 md:col-span-2`} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <div className="md:col-span-2">
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save event"}</Button>
        </div>
      </form>
    </Card>
  );
};

const EventFormPage = () => {
  const { eventId } = useParams();
  const isEdit = Boolean(eventId);
  const dispatch = useDispatch();
  const selected = useSelector(selectSelectedEvent);
  const { detailsStatus } = useSelector((state) => state.events);

  useEffect(() => {
    if (isEdit) dispatch(fetchEventDetails(eventId));
  }, [dispatch, eventId, isEdit]);

  const initialForm = isEdit && selected
    ? {
        title: selected.title || "",
        description: selected.description || "",
        venue: selected.venue || "",
        eventDate: toLocalInputDate(selected.eventDate),
        totalSeats: selected.totalSeats || 50,
        price: selected.price || 499,
        banner: selected.banner || "",
      }
    : emptyForm;

  return (
    <>
      <PageHeader
        eyebrow="Organizer"
        title={isEdit ? "Edit event" : "Create event"}
        description="Submitted events require admin approval before users can book tickets."
      />
      {isEdit && detailsStatus === "loading" ? (
        <LoadingSkeleton rows={5} />
      ) : (
        <EventEditorForm
          key={isEdit ? eventId : "new-event"}
          eventId={eventId}
          initialForm={initialForm}
          isEdit={isEdit}
        />
      )}
    </>
  );
};

export default EventFormPage;
