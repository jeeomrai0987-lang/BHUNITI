/*
 * Parcel history for P-1024 -- the audit trail behind the area discrepancy that
 * DataReconciliation and FieldSurvey both raise against the same parcel.
 *
 * Three things were wrong here beyond the untranslated text.
 *
 * Every colour in both SVGs was written as `var(--tw-colors-primary)` and
 * friends. index.css declares `--color-primary`, so those names resolved to
 * nothing: the sparkline drew with no stroke at all and the overlay polygons
 * fell back to black. The gradient was also spelled `<lineargradient>` and the
 * hatch `patterntransform`, which React forwards as unknown lowercase SVG
 * names, so `url(#areaGradient)` and `url(#diagonal-stripes)` never resolved
 * either. Both now use `currentColor` against a Tailwind text class, the way
 * ReportsAnalytics does -- a stop inside <defs> resolves currentColor against
 * its own ancestors, not against whoever references the gradient, so the class
 * has to sit on the <stop>.
 *
 * The parcel also contradicted the record it belongs to. SearchRecords holds
 * P-1024 as ULPIN 09-0824-0014-1024, khasra 412/1, 2.00 ha, owner Rahul Sharma,
 * with P-1025 next door (they share the 77.5840 edge) owned by Sunita Devi &
 * Ramesh Chand. This page chipped "ULPIN: P-1024" -- a parcel number, not a
 * ULPIN -- ended its 2023 transfer at a "V. Deshmukh" who owns nothing in the
 * database, and called P-1025 a Public Works Department holding. The fixture
 * below reads the same identities, so the last recorded transfer is what makes
 * Rahul Sharma the current owner.
 *
 * And the figures were typed in six places: "2.18 ha" in the hero, "+0.18 ha"
 * in the warning chip, "2.00 ha" twice in the cards, "2.00 -> 2.18" in the
 * before/after pair, "+9%" on the overlay badge, plus hand-plotted
 * "M0,50 L120,50" paths and 2021/2023/2025 axis labels. TIMELINE drives all of
 * it now: the variance is the newest area minus the previous one, the
 * percentage is that over the previous one, and the chart geometry comes from
 * the dates and areas.
 */

import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { REVENUE_ROUTES } from "../../routes";

/* Spelled the way src/pages/citizen/SearchRecords.jsx spells it. */
const PARCEL = { ulpin: "09-0824-0014-1024", parcelId: "P-1024", khasra: "412/1" };
const NEIGHBOUR = { parcelId: "P-1025", owner: "Sunita Devi & Ramesh Chand" };

/*
 * One row per event, oldest first. `area` is the area standing on the record
 * after the event, which is what lets the chart, the warning chip and the
 * before/after pair be derived instead of restated.
 */
const TIMELINE = [
  {
    key: "baseSurvey",
    date: new Date(2021, 2, 12),
    area: 2.0,
    icon: "library_add",
    photo:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600",
  },
  {
    key: "deedRegistration",
    date: new Date(2023, 10, 4),
    area: 2.0,
    icon: "description",
    mutation: "M-45092",
    grantor: "R.K. Holdings Ltd.",
    grantee: "Rahul Sharma",
    photo:
      "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1600",
  },
  {
    key: "boundaryUpdate",
    date: new Date(2025, 7, 22),
    area: 2.18,
    icon: "crisis_alert",
    survey: "D-2025-Q3",
    anomaly: true,
  },
];

const ANOMALY = TIMELINE[TIMELINE.length - 1];
const BASELINE = TIMELINE[TIMELINE.length - 2];

// 2.18 - 2 lands on 0.17999999999999972 in binary floating point, and that
// difference then feeds the percentage, so it is rounded once here rather than
// left for the formatter's digit limit to paper over.
const round = (value) => Math.round(value * 1e4) / 1e4;
const VARIANCE = round(ANOMALY.area - BASELINE.area);
const EXPANSION = round((VARIANCE / BASELINE.area) * 100);

/*
 * Chart geometry. The x axis runs from the first event to today, which is what
 * gives the post-sync stretch any width at all: nothing has changed since. The
 * y axis spans only the areas actually on the record, so the step is legible
 * even though 2.00 -> 2.18 is a 9% move.
 */
const CHART = { width: 200, height: 60, top: 10, base: 50 };

function chartGeometry(events, now) {
  const start = events[0].date.getTime();
  const span = Math.max(now.getTime() - start, 1);
  const areas = events.map((event) => event.area);
  const low = Math.min(...areas);
  const high = Math.max(...areas);
  const spread = high - low;

  // A series that never moved would divide by zero, so it sits on the baseline.
  const y = (area) =>
    spread === 0
      ? CHART.base
      : CHART.top + ((high - area) / spread) * (CHART.base - CHART.top);

  const points = events.map((event) => ({
    key: event.key,
    date: event.date,
    anomaly: Boolean(event.anomaly),
    x: round(((event.date.getTime() - start) / span) * CHART.width),
    y: round(y(event.area)),
  }));

  // The recorded area holds its value until the next event rather than sliding
  // towards it, so every run is a vertical step followed by a flat stretch.
  return points.map((point, index) => ({
    ...point,
    to: index + 1 < points.length ? points[index + 1].x : CHART.width,
    fromY: index === 0 ? point.y : points[index - 1].y,
  }));
}

const runLine = (run) => `M${run.x},${run.fromY} L${run.x},${run.y} L${run.to},${run.y}`;
const runFill = (run) =>
  `${runLine(run)} L${run.to},${CHART.height} L${run.x},${CHART.height} Z`;

/*
 * The overlay schematic. Both rings are illustrative -- the real vertices live
 * in SearchRecords' polygon_coords -- but they encode the narrative: the
 * northern edge is the one that moved, so the two highlighted strips sit along
 * the top corners and the southern edge is shared by both rings.
 */
const REGISTERED_RING = "20,80 80,80 70,30 30,30";
const SYNCED_RING = "20,80 80,80 85,20 25,15";
const ADDED_STRIPS = ["70,30 80,80 85,20", "30,30 20,80 25,15"];

export default function HistoricalTimeline() {
  const { t, formatNumber, formatDate } = useI18n();
  const p = (key, vars) => t(`pages.historicalTimeline.${key}`, vars);

  // formatArea() allows 0 to 4 decimals, so a flat 2.00 ha would print as
  // "2 ha" beside "2.18 ha". A register states hectares to two places, and the
  // two figures have to line up to be comparable, so the page fixes the digits.
  const AREA_DIGITS = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  const area = (value) => `${formatNumber(value, AREA_DIGITS)} ${t("common.units.hectare")}`;
  const signedArea = (value) =>
    `${formatNumber(value, { ...AREA_DIGITS, signDisplay: "always" })} ${t("common.units.hectare")}`;
  const signedPercent = (value) =>
    `${formatNumber(value, { signDisplay: "always", maximumFractionDigits: 1 })}${t("common.units.percent")}`;

  const [baseSurvey, deedRegistration, boundaryUpdate] = TIMELINE;
  const runs = chartGeometry(TIMELINE, new Date());
  const eventTitle = (event) => p(`events.${event.key}.title`);
  const jumpTo = (event) =>
    document.getElementById(`card-${event.key}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

  return (
    <main className="relative pt-16 min-h-screen bg-background">
      <nav
        className="px-8 py-4 flex items-center gap-2 text-label-md text-on-surface-variant"
        aria-label={t("common.a11y.breadcrumb")}
      >
        <span>{p("breadcrumb.system")}</span>
        <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
          chevron_right
        </span>
        <span className="text-on-surface font-semibold" aria-current="page">
          {p("breadcrumb.dashboard")}
        </span>
      </nav>

      <div className="flex flex-col w-full relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl opacity-50 mix-blend-multiply"></div>
        </div>

        <div className="px-8 py-10 z-10 w-full max-w-7xl mx-auto flex flex-col gap-12">
          <section className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-end w-full">
            <div className="flex flex-col gap-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center bg-tertiary text-on-tertiary rounded-full px-3 py-1 font-label-md text-label-md shadow-sm">
                  {p("ulpinChip", { id: PARCEL.ulpin })}
                </span>
                <span className="inline-flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"
                    aria-hidden="true"
                  ></span>
                  {p("anomalyDetected")}
                </span>
              </div>
              <h1 className="font-display text-display text-on-surface">{p("title")}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                {p("intro", { parcel: PARCEL.parcelId, khasra: PARCEL.khasra })}
              </p>
            </div>

            <div className="bg-surface-container rounded-2xl p-6 shadow-sm flex flex-col gap-3 min-w-[300px] relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    {p("area.gisReported")}
                  </span>
                  <span className="font-headline-lg text-headline-lg text-on-surface flex items-baseline gap-2">
                    {formatNumber(ANOMALY.area, AREA_DIGITS)}
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {t("common.units.hectare")}
                    </span>
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    {p("area.registry", { value: area(BASELINE.area) })}
                  </span>
                </div>
                <span className="material-symbols-outlined text-error" aria-hidden="true">
                  trending_up
                </span>
              </div>

              <div className="h-16 w-full mt-2 relative">
                <svg
                  className="w-full h-full"
                  preserveAspectRatio="none"
                  viewBox={`0 0 ${CHART.width} ${CHART.height}`}
                  role="img"
                  aria-label={p("area.chartCaption", {
                    from: area(BASELINE.area),
                    year: formatDate(ANOMALY.date, { year: "numeric" }),
                    to: area(ANOMALY.area),
                  })}
                >
                  <defs>
                    {/* A <stop> resolves currentColor against its own ancestors,
                        so the tint has to be classed here rather than on the
                        <path> that references the gradient. */}
                    <linearGradient id="timelineAreaStable" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop className="text-primary" offset="0%" stopColor="currentColor" stopOpacity="0.16" />
                      <stop className="text-primary" offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="timelineAreaAnomaly" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop className="text-error" offset="0%" stopColor="currentColor" stopOpacity="0.22" />
                      <stop className="text-error" offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {runs.map((run) => (
                    <g key={run.key} className={run.anomaly ? "text-error" : "text-primary"}>
                      <path
                        d={runFill(run)}
                        fill={`url(#${run.anomaly ? "timelineAreaAnomaly" : "timelineAreaStable"})`}
                        stroke="none"
                      />
                      <path
                        d={runLine(run)}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={run.anomaly ? 2.5 : 2}
                        strokeLinejoin="round"
                      />
                      <circle cx={run.x} cy={run.y} r={run.anomaly ? 4 : 3} fill="currentColor" />
                    </g>
                  ))}
                </svg>
              </div>

              {/* The year labels used to be <text> inside the same stretched
                  viewBox, which squashed them horizontally. As HTML they stay
                  crisp and pick up the locale's digits. */}
              <div className="relative h-4" aria-hidden="true">
                {runs.map((run, index) => (
                  <span
                    key={run.key}
                    className={`absolute font-tabular-nums text-[10px] ${
                      index === 0 ? "" : "-translate-x-1/2"
                    } ${run.anomaly ? "text-error font-bold" : "text-on-surface-variant"}`}
                    style={{ left: `${(run.x / CHART.width) * 100}%` }}
                  >
                    {formatDate(run.date, { year: "numeric" })}
                  </span>
                ))}
              </div>

              <div className="bg-error-container text-on-error-container font-label-md text-label-md px-3 py-2 rounded-lg mt-2 flex items-start gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[16px] mt-0.5" aria-hidden="true">
                  warning
                </span>
                <p>
                  {p("area.firstInconsistency", {
                    month: formatDate(ANOMALY.date, { month: "long", year: "numeric" }),
                    variance: signedArea(VARIANCE),
                  })}
                </p>
              </div>
            </div>
          </section>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <aside className="xl:col-span-3 flex flex-col relative">
              <div className="sticky top-24">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    history
                  </span>
                  {p("chronology.heading")}
                </h2>
                <div className="relative pl-6 flex flex-col gap-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary before:via-outline-variant before:to-error before:rounded-full">
                  {TIMELINE.map((event) => (
                    <button
                      key={event.key}
                      type="button"
                      className="group flex flex-col gap-1 text-left relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded w-full"
                      aria-label={p("chronology.jumpTo", { title: eventTitle(event) })}
                      onClick={() => jumpTo(event)}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute -left-[30px] top-1.5 w-3 h-3 rounded-full border-2 group-hover:scale-125 transition-transform duration-300 shadow-sm z-10 ${
                          event.anomaly
                            ? "bg-error border-error animate-pulse"
                            : "bg-surface border-outline group-hover:border-primary"
                        }`}
                      ></span>
                      <span
                        className={`font-tabular-nums text-body-sm ${
                          event.anomaly ? "text-error font-semibold" : "text-on-surface-variant"
                        }`}
                      >
                        {formatDate(event.date)}
                      </span>
                      <span
                        className={`font-label-md text-label-md text-on-surface transition-colors ${
                          event.anomaly ? "group-hover:text-error" : "group-hover:text-primary"
                        }`}
                      >
                        {eventTitle(event)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <div className="xl:col-span-9 flex flex-col gap-12">
              <article
                className="bg-surface-container rounded-2xl shadow-sm overflow-hidden flex flex-col lg:flex-row transition-all duration-500 hover:shadow-md group"
                id={`card-${baseSurvey.key}`}
              >
                <div className="lg:w-1/3 min-h-[200px] relative">
                  <div
                    className="w-full h-full bg-cover bg-center absolute inset-0"
                    style={{ backgroundImage: `url('${baseSurvey.photo}')` }}
                    role="img"
                    aria-label={p("events.baseSurvey.photoCaption")}
                  ></div>
                  <div
                    className="absolute inset-0 bg-surface-container/20 group-hover:bg-transparent transition-colors duration-500 backdrop-blur-[2px] group-hover:backdrop-blur-none"
                    aria-hidden="true"
                  ></div>
                  <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm">
                    <span className="font-label-md text-label-md text-on-surface">
                      {p("events.baseSurvey.badge")}
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:w-2/3 flex flex-col gap-6 justify-center bg-surface-container relative">
                  <div
                    className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"
                    aria-hidden="true"
                  ></div>
                  <header>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-primary text-[20px]" aria-hidden="true">
                        {baseSurvey.icon}
                      </span>
                      <time
                        className="font-tabular-nums text-body-sm text-on-surface-variant"
                        dateTime={baseSurvey.date.toISOString().slice(0, 10)}
                      >
                        {formatDate(baseSurvey.date)}
                      </time>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      {eventTitle(baseSurvey)}
                    </h3>
                  </header>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col bg-surface p-4 rounded-xl shadow-sm">
                      <span className="font-label-md text-label-md text-on-surface-variant mb-1">
                        {p("events.baseSurvey.recordedArea")}
                      </span>
                      <span className="font-tabular-nums text-body-lg text-on-surface font-semibold">
                        {area(baseSurvey.area)}
                      </span>
                    </div>
                    <div className="flex flex-col bg-surface p-4 rounded-xl shadow-sm">
                      <span className="font-label-md text-label-md text-on-surface-variant mb-1">
                        {p("events.baseSurvey.authority")}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface">
                        {p("events.baseSurvey.authorityValue")}
                      </span>
                    </div>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {p("events.baseSurvey.body")}
                  </p>
                </div>
              </article>
              <article
                className="bg-surface-container rounded-2xl shadow-sm overflow-hidden flex flex-col lg:flex-row transition-all duration-500 hover:shadow-md group"
                id={`card-${deedRegistration.key}`}
              >
                <div className="lg:w-1/3 min-h-[200px] relative order-first lg:order-last">
                  <div
                    className="w-full h-full bg-cover bg-center absolute inset-0 opacity-90 transition-all duration-500 rounded-xl"
                    style={{ backgroundImage: `url('${deedRegistration.photo}')` }}
                    role="img"
                    aria-label={p("events.deedRegistration.photoCaption")}
                  ></div>
                </div>
                <div className="p-8 lg:w-2/3 flex flex-col gap-6 justify-center bg-surface-container relative">
                  <div
                    className="absolute top-0 left-0 w-32 h-32 bg-outline-variant/10 rounded-br-full pointer-events-none"
                    aria-hidden="true"
                  ></div>
                  <header>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-outline text-[20px]" aria-hidden="true">
                        {deedRegistration.icon}
                      </span>
                      <time
                        className="font-tabular-nums text-body-sm text-on-surface-variant"
                        dateTime={deedRegistration.date.toISOString().slice(0, 10)}
                      >
                        {formatDate(deedRegistration.date)}
                      </time>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      {eventTitle(deedRegistration)}
                    </h3>
                  </header>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col bg-surface p-4 rounded-xl shadow-sm">
                      <span className="font-label-md text-label-md text-on-surface-variant mb-1">
                        {p("events.deedRegistration.grantor")}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface font-medium truncate">
                        {deedRegistration.grantor}
                      </span>
                    </div>
                    <div className="flex flex-col bg-surface p-4 rounded-xl shadow-sm">
                      <span className="font-label-md text-label-md text-on-surface-variant mb-1">
                        {p("events.deedRegistration.grantee")}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface font-medium truncate">
                        {deedRegistration.grantee}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-surface-container-high px-4 py-3 rounded-lg">
                    <span className="material-symbols-outlined text-on-surface-variant" aria-hidden="true">
                      task_alt
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface">
                      {p("events.deedRegistration.note", {
                        mutation: deedRegistration.mutation,
                        value: area(deedRegistration.area),
                      })}
                    </span>
                  </div>
                </div>
              </article>
              <article
                className="bg-error-container rounded-2xl shadow-md overflow-hidden flex flex-col relative transition-transform duration-300 hover:-translate-y-1"
                id={`card-${boundaryUpdate.key}`}
              >
                <div
                  className="absolute inset-0 pointer-events-none overflow-hidden opacity-5 text-on-error-container"
                  aria-hidden="true"
                >
                  <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      {/* patternUnits defaults to objectBoundingBox, where a
                          width of 40 means forty times the box -- the stripe
                          filled the whole card. */}
                      <pattern
                        id="timelineHatch"
                        height="40"
                        width="40"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(45)"
                      >
                        <rect fill="currentColor" height="40" width="20"></rect>
                      </pattern>
                    </defs>
                    <rect fill="url(#timelineHatch)" height="100%" width="100%"></rect>
                  </svg>
                </div>

                <div className="p-8 flex flex-col gap-6 relative z-10">
                  <header className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-error text-[20px]" aria-hidden="true">
                          {boundaryUpdate.icon}
                        </span>
                        <time
                          className="font-tabular-nums text-body-sm text-on-error-container font-semibold"
                          dateTime={boundaryUpdate.date.toISOString().slice(0, 10)}
                        >
                          {formatDate(boundaryUpdate.date)}
                        </time>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-on-error-container">
                        {eventTitle(boundaryUpdate)}
                      </h3>
                    </div>
                    <span className="bg-error text-on-error px-3 py-1 rounded-full font-label-md text-label-md shadow-sm uppercase tracking-wide shrink-0">
                      {p("events.boundaryUpdate.actionRequired")}
                    </span>
                  </header>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 flex flex-col gap-4">
                      <p className="font-body-md text-body-md text-on-error-container">
                        {p("events.boundaryUpdate.body", { survey: boundaryUpdate.survey })}
                      </p>
                      <div className="bg-surface rounded-xl p-5 shadow-inner">
                        <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-outline-variant/20">
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface-variant">
                              {p("events.boundaryUpdate.previousArea")}
                            </span>
                            <span className="font-tabular-nums text-body-lg text-on-surface">
                              {area(BASELINE.area)}
                            </span>
                          </div>
                          <span className="material-symbols-outlined text-outline-variant" aria-hidden="true">
                            arrow_forward
                          </span>
                          <div className="flex flex-col text-right">
                            <span className="font-label-md text-label-md text-error">
                              {p("events.boundaryUpdate.newArea")}
                            </span>
                            <span className="font-tabular-nums text-body-lg text-error font-bold">
                              {area(boundaryUpdate.area)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-[16px] text-error mt-0.5" aria-hidden="true">
                            report_problem
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            {p("events.boundaryUpdate.overlap", {
                              parcel: NEIGHBOUR.parcelId,
                              owner: NEIGHBOUR.owner,
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {/* No create-a-dispute route exists in the demo build, so
                            this stays a button; the overlay has a real home. */}
                        <button
                          type="button"
                          className="bg-error text-on-error px-5 py-2.5 rounded-lg font-label-md text-label-md shadow-sm hover:shadow-md transition-shadow flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                            gavel
                          </span>
                          {p("events.boundaryUpdate.initiateDispute")}
                        </button>
                        <Link
                          to={REVENUE_ROUTES.gisExplorer}
                          className="bg-surface text-on-surface px-5 py-2.5 rounded-lg font-label-md text-label-md shadow-sm hover:bg-surface-bright transition-colors flex items-center gap-2 border border-outline-variant/30"
                        >
                          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                            map
                          </span>
                          {p("events.boundaryUpdate.viewOverlay")}
                        </Link>
                      </div>
                    </div>

                    <div className="w-full md:w-64 h-64 bg-surface rounded-xl shadow-inner relative overflow-hidden flex items-center justify-center p-4">
                      <div
                        className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"
                        aria-hidden="true"
                      ></div>
                      <svg
                        className="w-full h-full relative z-10 drop-shadow-md"
                        viewBox="0 0 100 100"
                        role="img"
                        aria-label={p("events.boundaryUpdate.mapCaption")}
                      >
                        <polygon
                          className="text-outline"
                          points={REGISTERED_RING}
                          fill="none"
                          stroke="currentColor"
                          strokeDasharray="4 2"
                          strokeWidth="1.5"
                        />
                        <polygon
                          className="text-error"
                          points={SYNCED_RING}
                          fill="currentColor"
                          fillOpacity="0.12"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        {/* The two added strips were animate-pulse, which with
                            the pulsing rail dot and header dot made three
                            things blinking at once. They read as highlights
                            without the motion. */}
                        {ADDED_STRIPS.map((points) => (
                          <polygon
                            key={points}
                            className="text-error"
                            points={points}
                            fill="currentColor"
                            fillOpacity="0.4"
                          />
                        ))}
                        <text
                          className="font-label-md text-on-surface"
                          fill="currentColor"
                          fontSize="8"
                          textAnchor="middle"
                          x="50"
                          y="58"
                        >
                          {PARCEL.parcelId}
                        </text>
                      </svg>
                      <div className="absolute bottom-2 right-2 bg-surface/80 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
                        <span className="font-tabular-nums text-[10px] font-bold text-error">
                          {p("events.boundaryUpdate.expansion", {
                            value: signedPercent(EXPANSION),
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
