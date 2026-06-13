import { ArrowRight, CalendarDays, Sparkles, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

import Aurora from "../components/Aurora";
import { Card, LinkButton } from "../components/ui";

const LandingPage = () => (
  <section className="relative isolate min-h-screen overflow-hidden bg-[#030507] text-white">
    <div className="absolute -inset-[12%] -z-10 blur-3xl">
      <Aurora
        colorStops={["#132B32", "#B497CF", "#C89B3C"]}
        blend={0.95}
        amplitude={0.5}
        speed={0.7}
      />
    </div>
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_12%,rgba(180,151,207,0.20),transparent_26%),radial-gradient(circle_at_86%_8%,rgba(200,155,60,0.18),transparent_24%),linear-gradient(180deg,rgba(3,5,7,0.25),#030507_86%)]" />

    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8">
      <header className="flex items-center justify-between">
        <Link to="/" className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-100/75">
          EventSphere
        </Link>
        <div className="flex gap-2">
          <LinkButton to="/login" variant="ghost">Sign in</LinkButton>
          <LinkButton to="/register" variant="secondary">Register</LinkButton>
        </div>
      </header>

      <div className="grid flex-1 gap-10 py-16 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-100/70">
            Events, bookings, payments
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-normal text-white md:text-7xl">
            Build the room before the crowd arrives.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
            Discover approved events, book tickets through Razorpay, and let organizers create polished event listings from one cinematic EventSphere workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton to="/register">
              Get started <ArrowRight className="ml-2" size={17} />
            </LinkButton>
            <LinkButton to="/login" variant="secondary">
              Continue to app
            </LinkButton>
          </div>
        </div>

        <Card className="grid gap-4 border-white/12 bg-black/25 backdrop-blur-xl">
          {[
            { icon: Sparkles, title: "Guest experience", copy: "A branded first screen with clear paths into sign in, registration, and account verification." },
            { icon: Ticket, title: "User journey", copy: "Browse approved events, reserve seats, and complete Razorpay checkout from event details." },
            { icon: CalendarDays, title: "Organizer tools", copy: "Create events, edit submissions, and monitor approval state from a dedicated workspace." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-md border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/10">
                <Icon className="text-cyan-200" size={22} />
                <h2 className="mt-3 text-lg font-semibold">{item.title}</h2>
                <p className="mt-1 text-sm leading-6 text-white/58">{item.copy}</p>
              </article>
            );
          })}
        </Card>
      </div>
      <Link className="pb-4 text-sm text-white/45 transition hover:text-white" to="/events">
        Explore events after signing in
      </Link>
    </div>
  </section>
);

export default LandingPage;
