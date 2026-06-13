import { CalendarDays, MapPin, Ticket } from "lucide-react";

import { Badge, Card, LinkButton } from "./ui";
import { formatCurrency, formatDate, getEventId, getEventSeatsLabel } from "../utils/format";

const EventCard = ({ event }) => (
  <Card className="group flex h-full flex-col overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/28 hover:shadow-cyan-950/20">
    <div className="aspect-[16/9] bg-black/40">
      {event.banner ? (
        <img className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" src={event.banner} alt={event.title} />
      ) : (
        <div className="grid h-full place-items-center bg-gradient-to-br from-cyan-300/18 via-[#B497CF]/16 to-[#C89B3C]/14 text-sm text-white/42">
          EventSphere
        </div>
      )}
    </div>
    <div className="flex flex-1 flex-col p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Badge tone={event.isApproved ? "success" : "warning"}>{event.isApproved ? "Approved" : "Pending"}</Badge>
        <span className="text-sm font-semibold text-cyan-100">{formatCurrency(event.price)}</span>
      </div>
      <h2 className="text-lg font-semibold text-white">{event.title}</h2>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/54">{event.description}</p>
      <div className="mt-4 grid gap-2 text-sm text-white/52">
        <span className="flex items-center gap-2"><CalendarDays size={16} /> {formatDate(event.eventDate)}</span>
        <span className="flex items-center gap-2"><MapPin size={16} /> {event.venue}</span>
        <span className="flex items-center gap-2"><Ticket size={16} /> {getEventSeatsLabel(event)}</span>
      </div>
      <LinkButton className="mt-5" to={`/events/${getEventId(event)}`} variant="secondary">
        View details
      </LinkButton>
    </div>
  </Card>
);

export default EventCard;
