import Aurora from '../../components/Aurora';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../components/AsyncState';

const metrics = [
    { label: 'Pending approvals', value: '18' },
    { label: 'Tickets booked', value: '1,284' },
    { label: 'Payment success rate', value: '97%' },
];

const Homepage = () => {
    return (

        <main className="relative min-h-screen w-full overflow-hidden bg-[#030507] text-white">
            <div className='absolute -inset-[12%] blur-3xl' >
                <Aurora
                    colorStops={["#132B32", "#B497CF", "#C89B3C"]}
                    blend={0.95}
                    amplitude={0.5}
                    speed={0.7}
                />
            </div>
            <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-10">
                <div className="mb-8 max-w-2xl">
                    <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-100/70">EventSphere</p>
                    <h1 className="mt-3 text-4xl font-semibold tracking-normal text-white md:text-6xl">
                        Event operations dashboard
                    </h1>
                    <p className="mt-4 max-w-xl text-base leading-7 text-white/68">
                        Manage approvals, bookings, payments, reports, and user actions from one focused workspace.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {metrics.map((metric) => (
                        <article key={metric.label} className="rounded-md border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
                            <p className="text-sm text-white/60">{metric.label}</p>
                            <strong className="mt-2 block text-3xl font-semibold text-white">{metric.value}</strong>
                        </article>
                    ))}
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                    <section className="rounded-md border border-white/10 bg-black/25 p-5 backdrop-blur-md">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <h2 className="text-lg font-semibold">Live queue</h2>
                            <span className="rounded-md border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-xs font-medium text-emerald-100">
                                Syncing
                            </span>
                        </div>
                        <LoadingSkeleton rows={4} />
                    </section>

                    <div className="grid gap-5">
                        <EmptyState
                            title="No failed exports"
                            detail="Completed reports will appear here after download or export actions finish."
                        />
                        <ErrorState message="Revenue analytics could not refresh." />
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Homepage
