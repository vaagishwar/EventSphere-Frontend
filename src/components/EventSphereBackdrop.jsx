import Aurora from "./Aurora";

const EventSphereBackdrop = ({ intensity = "default" }) => {
  const isSoft = intensity === "soft";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#030507]">
      <div className={`absolute -inset-[18%] ${isSoft ? "opacity-55" : "opacity-80"} blur-3xl`}>
        <Aurora
          colorStops={["#132B32", "#B497CF", "#C89B3C"]}
          blend={0.95}
          amplitude={isSoft ? 0.35 : 0.5}
          speed={isSoft ? 0.45 : 0.7}
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(180,151,207,0.18),transparent_26%),radial-gradient(circle_at_88%_6%,rgba(200,155,60,0.16),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(34,211,238,0.08),transparent_32%),linear-gradient(180deg,rgba(3,5,7,0.36),#030507_78%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />
    </div>
  );
};

export default EventSphereBackdrop;
