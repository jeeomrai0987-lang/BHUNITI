import { Fragment } from "react";
import AnimatedCounter from "../../components/AnimatedCounter";
import { useI18n } from "../../i18n";

/*
 * Public capabilities page. The six modules share one card shape and differ only
 * in their header illustration, so they are declared here and rendered from a
 * list; `media` picks which illustration a card gets.
 */
const MODULES = [
  {
    key: "gis",
    icon: "explore",
    iconClass: "bg-secondary-container text-on-secondary-container",
    media: "photo",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDxHIw3mekBP3pnQYDa8n0ffFRw1baDuOYNmnNPhSoRNSy41tvxhULk6iOeZvKElOHV1vsdZ2HtKx6b_zuU3yeTe2GCdEIKVJIXQ9WZiUHiWsJgcovNrNfdSDgDtx4i1nj6iQ9IZjv336D8yPH3uotrbRDGFPDBZCmNVqVhq8SRQtvoo6uoJ7W5GkZhcKPC-KGlsCZAToxp8ZrgzMOaoEHLOueyiQZ7LjOCAIBnSw3zS08FZ0q8yic",
    overlay: "bg-gradient-to-t from-primary/80 to-transparent mix-blend-multiply",
    badge: true,
  },
  {
    key: "ai",
    icon: "memory",
    iconClass: "bg-primary text-on-primary",
    media: "chart",
  },
  {
    key: "mutation",
    icon: "account_tree",
    iconClass: "bg-secondary-container text-on-secondary-container",
    media: "pipeline",
  },
  {
    key: "documents",
    icon: "document_scanner",
    iconClass: "bg-primary text-on-primary",
    media: "photo",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfeKkFgLRn7xd3FLLr2mgqxwPuryeiQ0qCoJNfBIY_YO_-dVmITcMc2eRn5JiAasaZEwXdm_1jYBOeSdNe9gTR2WJmxBUJrRRPM0SIisWET_2tApB3yRwq3Ls8H7F7jupVJDqZgb8AmkBC7qNJndiNuYmGyULsDBbXsbIxRY0V5qjNd7QDyJ2p5tmRf2MAeT2uji8-jAhlJRkZT-mf_-MPIpjONAueAP0vISWL2nLX12QpdlxcETg",
    overlay: "bg-primary/40 mix-blend-overlay",
  },
  {
    key: "survey",
    icon: "engineering",
    iconClass: "bg-secondary-container text-on-secondary-container",
    media: "beacon",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJHpUU5pIVhOqduWGps2TqQVukskzPDyF0fQWhRDcYinUFFY4wM6MZdjDlY59kJWeXJeA-afNdJtzXauE_lFeL9NDB8Ug6hq24SX_jcTGqEn7MgozLFRiKG-iVjngyOS3qNzAfT3mMJU-JKt4y1d8uAdX1C_it6G-A4vL-rfqa3JsvfrxSxwXWjFy42hpp25KI2lcWVF7gUrkdbY67i-KIaqa0lEUvmdSfVZdgcpVQjDjsBJKRXo4",
  },
  {
    key: "audit",
    icon: "history",
    iconClass: "bg-primary text-on-primary",
    media: "ledger",
  },
];
/*
 * Sample audit entries under the last card. Stored as real UTC instants so the
 * timestamp is formatted by Intl rather than pasted in as English text.
 */
const LEDGER = [
  {
    key: "authSuccess",
    at: "2026-03-12T09:14:22Z",
    rowClass: "w-[90%] transform translate-x-4 opacity-50",
    timeClass: "text-outline",
    bodyClass: "text-on-surface-variant",
  },
  {
    key: "boundaryModified",
    at: "2026-03-12T09:15:01Z",
    vars: { node: "#99482A" },
    rowClass: "w-full z-10 relative",
    timeClass: "text-secondary font-bold",
    bodyClass: "text-on-surface",
  },
  {
    key: "hashCommitted",
    at: "2026-03-12T09:15:05Z",
    rowClass: "w-[85%] transform translate-x-8 opacity-50",
    timeClass: "text-outline",
    bodyClass: "text-on-surface-variant",
  },
];

/*
 * The three stages drawn inside the mutation card. The middle stage is the
 * highlighted one, which is why it carries its own colour classes.
 */
const PIPELINE_STEPS = [
  { key: "deed", className: "bg-surface-container-lowest text-on-surface" },
  { key: "verify", className: "bg-secondary text-on-primary transform scale-110" },
  { key: "mutate", className: "bg-surface-container-lowest text-on-surface" },
];

const UPTIME_SLA = 99.9;
const MODEL_ACCURACY = 98.4;
const ONE_DECIMAL = { minimumFractionDigits: 1, maximumFractionDigits: 1 };

// A ledger stamp is deliberately absolute and in UTC, the way an audit log is.
const LEDGER_STAMP = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  timeZone: "UTC",
  timeZoneName: "short",
};
export default function Features() {
  const { t, formatNumber, formatDateTime } = useI18n();

  const p = (key, vars) => t(`pages.features.${key}`, vars);
  const m = (module, field, vars) => p(`modules.${module.key}.${field}`, vars);
  const percent = (value) =>
    `${formatNumber(value, ONE_DECIMAL)}${t("common.units.percent")}`;

  /* The header illustration for one card. Each branch is the original markup. */
  function media(module) {
    switch (module.media) {
      case "photo":
        return (
          <div
            className="h-72 w-full relative bg-surface-container bg-cover bg-center"
            role="img"
            aria-label={m(module, "imageCaption")}
            style={{ backgroundImage: `url('${module.image}')` }}
          >
            <div className={`absolute inset-0 pointer-events-none ${module.overlay}`}></div>
            {module.badge && (
              <div className="absolute bottom-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm">
                <span className="font-label-caps text-label-caps text-on-surface flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                  {m(module, "badge")}
                </span>
              </div>
            )}
          </div>
        );

      case "beacon":
        return (
          <div
            className="h-72 w-full relative bg-surface-container bg-cover bg-center"
            role="img"
            aria-label={m(module, "imageCaption")}
            style={{ backgroundImage: `url('${module.image}')` }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-ping absolute"></div>
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg relative z-10 text-on-primary">
                <span className="material-symbols-outlined text-[24px]">satellite_alt</span>
              </div>
            </div>
          </div>
        );
      case "chart":
        return (
          <div className="h-72 w-full relative bg-primary-container p-8 flex items-end justify-center">
            <svg
              className="w-full h-48 drop-shadow-md"
              preserveAspectRatio="none"
              viewBox="0 0 400 150"
              role="img"
              aria-label={m(module, "chartCaption")}
            >
              <path
                className="text-secondary/20"
                d="M0,150 L0,80 C50,90 100,20 150,60 C200,100 250,10 300,50 C350,90 400,30 400,30 L400,150 Z"
                fill="currentColor"
              ></path>
              <path
                className="text-secondary"
                d="M0,80 C50,90 100,20 150,60 C200,100 250,10 300,50 C350,90 400,30 400,30"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              ></path>
              <circle className="text-surface-white" cx="150" cy="60" fill="currentColor" r="4"></circle>
              <circle className="text-surface-white" cx="300" cy="50" fill="currentColor" r="4"></circle>
            </svg>
            <div className="absolute top-4 right-4 bg-surface-white/10 backdrop-blur-md px-3 py-1 rounded shadow-sm">
              <span className="font-tabular-nums text-tabular-nums text-on-primary">
                {m(module, "accuracy", { value: percent(MODEL_ACCURACY) })}
              </span>
            </div>
          </div>
        );
      case "pipeline":
        return (
          <div className="h-72 w-full relative bg-surface p-8 flex items-center justify-center">
            <div className="flex items-center gap-2 w-full max-w-md">
              {PIPELINE_STEPS.map((step, index) => (
                <Fragment key={step.key}>
                  {index > 0 && (
                    <span className="material-symbols-outlined text-outline" aria-hidden="true">
                      arrow_forward
                    </span>
                  )}
                  <div className={`flex-1 p-3 rounded-lg shadow-sm text-center ${step.className}`}>
                    <span className="font-label-caps text-label-caps">
                      {m(module, `steps.${step.key}`)}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        );

      case "ledger":
        return (
          <div className="h-72 w-full relative bg-surface p-6 overflow-hidden flex flex-col gap-2">
            <h3 className="sr-only">{m(module, "ledger.caption")}</h3>
            {LEDGER.map((entry) => (
              <div
                key={entry.key}
                className={`bg-surface-container-lowest p-3 rounded shadow-sm ${entry.rowClass}`}
              >
                <span
                  className={`font-tabular-nums text-tabular-nums text-[10px] ${entry.timeClass}`}
                >
                  {formatDateTime(entry.at, LEDGER_STAMP)}
                </span>
                <p className={`font-body-sm text-body-sm truncate ${entry.bodyClass}`}>
                  {m(module, `ledger.${entry.key}`, entry.vars)}
                </p>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <main className="w-full pt-20">
      <div className="flex flex-col w-full">
        <section className="w-full relative overflow-hidden bg-surface-container-lowest shadow-sm">
          <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
            <svg
              className="w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <path className="text-primary" d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor"></path>
              <path className="text-secondary" d="M0 50 C 30 100 70 100 100 50 Z" fill="currentColor"></path>
            </svg>
          </div>
          <div className="max-w-container-max mx-auto px-margin-desktop py-24 relative z-10 flex flex-col lg:flex-row items-end justify-between gap-8">
            <div className="max-w-3xl">
              <span className="font-label-caps text-label-caps text-secondary block mb-4 uppercase tracking-widest">
                {p("eyebrow")}
              </span>
              <h1 className="font-display text-display text-on-surface mb-6">{p("title")}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                {p("intro")}
              </p>
            </div>
            {/* The counter carries the caption in its aria-label, so the visible
                caption below it is hidden from assistive tech to avoid a repeat. */}
            <div className="flex gap-12 bg-surface p-8 rounded-xl shadow-md">
              <div className="flex flex-col">
                <AnimatedCounter
                  target={UPTIME_SLA}
                  suffix={t("common.units.percent")}
                  className="font-display text-display text-primary"
                  label={p("stats.uptime")}
                />
                <span
                  className="font-label-caps text-label-caps text-on-surface-variant"
                  aria-hidden="true"
                >
                  {p("stats.uptime")}
                </span>
              </div>
              <div className="flex flex-col">
                <AnimatedCounter
                  target={MODULES.length}
                  className="font-display text-display text-secondary"
                  label={p("stats.modules")}
                />
                <span
                  className="font-label-caps text-label-caps text-on-surface-variant"
                  aria-hidden="true"
                >
                  {p("stats.modules")}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full max-w-container-max mx-auto px-margin-desktop py-24">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {MODULES.map((module) => (
              <article
                key={module.key}
                className="bg-surface-container-lowest rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-500 overflow-hidden flex flex-col group"
              >
                {media(module)}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${module.iconClass}`}
                    >
                      <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                        {module.icon}
                      </span>
                    </div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">
                      {m(module, "title")}
                    </h2>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-8 flex-grow">
                    {m(module, "body")}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
                    <div className="bg-surface p-5 rounded-xl shadow-sm">
                      <h4 className="font-label-caps text-label-caps text-primary mb-2">
                        {p("forOfficials")}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {m(module, "officials")}
                      </p>
                    </div>
                    <div className="bg-surface p-5 rounded-xl shadow-sm">
                      <h4 className="font-label-caps text-label-caps text-secondary mb-2">
                        {p("forCitizens")}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {m(module, "citizens")}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="w-full bg-primary text-on-primary py-24 relative overflow-hidden shadow-xl z-10">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 70% 30%, #ffffff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>
          <div className="max-w-3xl mx-auto px-margin-desktop text-center relative z-10">
            <h2 className="font-display text-display mb-6">{p("cta.heading")}</h2>
            <p className="font-body-lg text-body-lg text-inverse-primary mb-10 max-w-xl mx-auto">
              {p("cta.body")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                className="px-8 py-4 bg-surface-container-lowest text-primary font-label-caps rounded-lg hover:bg-surface transition-all shadow-md"
              >
                {p("cta.demo")}
              </button>
              <button
                type="button"
                className="px-8 py-4 bg-transparent text-on-primary font-label-caps rounded-lg hover:bg-surface-white/10 transition-all shadow-sm shadow-on-primary/10"
              >
                {p("cta.docs")}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
