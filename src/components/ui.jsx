import { Link } from "react-router-dom";

export const PageHeader = ({ eyebrow, title, description, actions }) => (
  <div className="mb-6 flex flex-col gap-4 rounded-md border border-white/10 bg-black/18 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl md:flex-row md:items-end md:justify-between">
    <div>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white md:text-4xl">
        {title}
      </h1>
      {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">{description}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
  </div>
);

export const Card = ({ children, className = "" }) => (
  <section className={`rounded-md border border-white/12 bg-black/24 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl ${className}`}>
    {children}
  </section>
);

export const StatCard = ({ label, value, detail }) => (
  <Card>
    <p className="text-sm text-white/50">{label}</p>
    <strong className="mt-2 block text-3xl font-semibold text-white">{value}</strong>
    {detail ? <p className="mt-2 text-xs text-white/38">{detail}</p> : null}
  </Card>
);

export const Button = ({ as: Component = "button", variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "border-cyan-200/50 bg-cyan-200 text-[#061013] shadow-lg shadow-cyan-300/10 hover:bg-cyan-100",
    secondary: "border-white/12 bg-white/8 text-white shadow-lg shadow-black/10 hover:bg-white/14",
    danger: "border-red-300/30 bg-red-500/15 text-red-100 hover:bg-red-500/25",
    ghost: "border-transparent bg-transparent text-white/68 hover:bg-white/8 hover:text-white",
  };

  return (
    <Component
      className={`inline-flex min-h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${className}`}
      {...props}
    />
  );
};

export const LinkButton = (props) => <Button as={Link} {...props} />;

export const Field = ({ label, id, error, children }) => (
  <label htmlFor={id} className="grid gap-2 text-sm font-medium text-white/78">
    {label}
    {children}
    {error ? <span className="text-xs text-red-200">{error}</span> : null}
  </label>
);

export const inputClass =
  "min-h-11 rounded-md border border-white/12 bg-black/28 px-3 py-2 text-sm text-white shadow-inner shadow-black/10 outline-none backdrop-blur-md transition placeholder:text-white/30 focus:border-cyan-200/65 focus:ring-2 focus:ring-cyan-200/15";

export const Badge = ({ children, tone = "default" }) => {
  const tones = {
    default: "border-white/12 bg-white/8 text-white/78",
    success: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
    warning: "border-amber-300/25 bg-amber-300/10 text-amber-100",
    danger: "border-red-300/25 bg-red-300/10 text-red-100",
  };

  return (
    <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
};
