import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { REVENUE_ROUTES } from "../../routes";

/*
 * Reconciliation Monitor, demo figures.
 *
 * Every number the original shipped was hand-placed in the markup, and the three
 * pair cards implied three different district sizes: 2,104 mismatches at 0.9%
 * works out to ~234,000 records, 8,450 at 2.6% to ~325,000, and 14,289 at 6.2%
 * to ~230,000. One record total now drives all three, which keeps the headline
 * 14,289 exactly and corrects the other two. The donut arcs are likewise derived
 * from the agreement figure instead of the "502"/"31"/"471" dash offsets and the
 * 337° rotation the SVG used to carry, so the ring and the caption cannot drift
 * apart the way the chart on the reports screen had.
 */

// Parcels held in the district registry -- the denominator every mismatch count
// below is a share of.
const RECORD_TOTAL = 230468;

const mismatchCount = (agreement) =>
  Math.round((RECORD_TOTAL * (100 - agreement)) / 100);

/*
 * One row per reconciled system pair. `critical` marks the pair that also fills
 * the banner and the donut at the top of the page, so the headline figures and
 * the matrix row are the same numbers read twice rather than two fixtures that
 * have to be kept in step by hand.
 */
const SYSTEM_PAIRS = [
  {
    left: "registry",
    right: "survey",
    agreement: 99.1,
    dotClass: "bg-[#10b981]",
    valueClass: "",
    barClass: "bg-[#10b981]",
  },
  {
    left: "survey",
    right: "census",
    agreement: 97.4,
    dotClass: "bg-tertiary",
    valueClass: "text-tertiary",
    barClass: "bg-tertiary",
  },
  {
    left: "landRecords",
    right: "gisDb",
    agreement: 93.8,
    critical: true,
  },
];

const CRITICAL_PAIR = SYSTEM_PAIRS.find((pair) => pair.critical);

// The variance the registry treats as acceptable; the banner quotes it and the
// critical pair breaches it.
const TOLERANCE = 2;

/*
 * Donut geometry. The circle is drawn at r=80, so its real circumference is
 * ~502.65 -- close enough to the 502 the markup hardcoded that nobody noticed,
 * but the arcs are shares of the circumference now, and the error arc is rotated
 * by exactly the angle the match arc sweeps.
 */
const DONUT_RADIUS = 80;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;
const donutArc = (share) => (DONUT_CIRCUMFERENCE * share) / 100;
const donutRotation = (share) => (360 * share) / 100;

/*
 * The AI feed. Each entry names the body template it fills and carries only the
 * values that template needs, so the sentence is assembled in the active locale
 * rather than frozen as English prose. Ages are relative -- a fixed "2m ago"
 * would be as stale as the timestamp in the header used to be.
 */
const ANOMALIES = [
  {
    key: "areaDiscrepancy",
    ulpin: "09-087-0034-11",
    age: { minutesAgo: 2 },
    risk: "high",
    tag: "boundary",
    accentClass: "bg-error",
    riskClass: "bg-error-container text-on-error-container",
    registryArea: 1.4,
    gisArea: 1.9,
  },
  {
    key: "ownershipNull",
    ulpin: "09-087-0192-44",
    age: { minutesAgo: 14 },
    risk: "medium",
    tag: "attribute",
    accentClass: "bg-tertiary",
    riskClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    parties: 3,
  },
  {
    key: "clusterShift",
    // A cluster shift spans many parcels, so there is no single ULPIN to show.
    parcelCount: 32,
    age: { hoursAgo: 1 },
    risk: "systemic",
    tag: "spatial",
    accentClass: "bg-primary",
    riskClass: "bg-error-container text-on-error-container",
    highlight: true,
    shiftMetres: 4,
  },
  {
    key: "landUseMismatch",
    ulpin: "09-087-0551-02",
    age: { hoursAgo: 2 },
    risk: "medium",
    tag: "classification",
    accentClass: "bg-tertiary",
    riskClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    // Both values are real land_type entries, so they translate through the
    // generated domain catalog like every other status value in the app.
    registryLandType: "Agricultural",
    gisLandType: "Commercial",
  },
];

/*
 * The jurisdiction under the microscope. Loni is the tehsil the district
 * analytics screen already flags as needing attention (71.2% verified, 12.4%
 * discrepancy), so the hotspot panel and the systemic cluster anomaly both point
 * at it. The original put the hotspot in Loni but the cluster shift in "Village
 * Modinagar", which is a tehsil name rather than a village and belongs to a
 * different jurisdiction again.
 */
const HOTSPOT_TEHSIL = "loni";

/*
 * The header used to read "Today, 08:42 AM" as literal text, which would go on
 * claiming a morning sync however long the demo stayed open. This is a real Date
 * pinned to 08:42, stepped back a day when the page is opened before the run, so
 * the stamp is never in the future.
 */
function lastSyncAt(now) {
  const stamp = new Date(now);
  stamp.setHours(8, 42, 0, 0);
  if (stamp > now) stamp.setDate(stamp.getDate() - 1);
  return stamp;
}

const ONE_DECIMAL = { minimumFractionDigits: 1, maximumFractionDigits: 1 };

export default function ReconciliationMonitor() {
  const { t, label, formatNumber, formatDateTime, formatArea } = useI18n();

  const p = (key, vars) => t(`pages.reconciliationMonitor.${key}`, vars);
  const percent = (value, options) =>
    `${formatNumber(value, options)}${t("common.units.percent")}`;

  const systemName = (key) => p(`matrix.systems.${key}`);
  const pairLabel = (pair) =>
    p("matrix.pair", {
      left: systemName(pair.left),
      right: systemName(pair.right),
    });

  // `count` picks the plural form, `value` carries the grouped number.
  const mismatchLabel = (agreement) => {
    const count = mismatchCount(agreement);
    return p("matrix.mismatches", { count, value: formatNumber(count) });
  };

  const lastSync = lastSyncAt(new Date());
  const lastSyncDay =
    lastSync.toDateString() === new Date().toDateString()
      ? t("common.time.today")
      : t("common.time.yesterday");

  const criticalAgreement = CRITICAL_PAIR.agreement;
  const criticalMismatches = mismatchCount(criticalAgreement);

  // An anomaly is either minutes or hours old, never both.
  const anomalyAge = (age) =>
    age.minutesAgo === undefined
      ? t("common.time.hoursAgo", { count: age.hoursAgo })
      : t("common.time.minutesAgo", { count: age.minutesAgo });

  // The identifier line doubles as the row's accessible name, so it is built
  // once and reused for the drill-in button.
  const anomalySubject = (anomaly) =>
    p("anomalies.ulpin", {
      value:
        anomaly.ulpin ??
        p("anomalies.multiple", { count: anomaly.parcelCount }),
    });

  const anomalyBody = (anomaly) => {
    switch (anomaly.key) {
      case "areaDiscrepancy":
        return p("anomalies.body.areaDiscrepancy", {
          registry: formatArea(anomaly.registryArea),
          gis: formatArea(anomaly.gisArea),
        });
      case "ownershipNull":
        return p("anomalies.body.ownershipNull", {
          parties: p("anomalies.parties", { count: anomaly.parties }),
        });
      case "clusterShift":
        return p("anomalies.body.clusterShift", {
          village: p("hotspot.village"),
          shift: p("anomalies.metres", { count: anomaly.shiftMetres }),
        });
      default:
        return p("anomalies.body.landUseMismatch", {
          registry: label("land_type", anomaly.registryLandType),
          gis: label("land_type", anomaly.gisLandType),
        });
    }
  };

  return (
    <main className="pt-16 min-h-screen bg-surface">
      <div className="flex flex-col w-full h-full relative overflow-hidden bg-background">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-error-container/20 via-transparent to-transparent opacity-50 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-primary-container/10 via-transparent to-transparent opacity-40 blur-3xl rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

        <div className="px-8 py-8 flex flex-col gap-8 z-10 w-full max-w-[1600px] mx-auto">
          {/* ── Page header and sync pod ─────────────────────────────────── */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-error rounded-full shadow-[0_0_12px_rgba(186,26,26,0.6)]"></div>
                <h1 className="font-display text-display text-on-surface">{p("title")}</h1>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl pl-4">
                {p("intro")}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-surface-container rounded-xl p-2 shadow-sm">
              <div className="flex flex-col px-4 py-2 border-r border-outline-variant/30">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  {p("sync.status")}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="relative flex h-3 w-3" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
                  </span>
                  <span className="font-tabular-nums text-tabular-nums font-semibold text-error">
                    {p("sync.warning")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col px-4 py-2">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  {p("sync.lastRun")}
                </span>
                <span className="font-tabular-nums text-tabular-nums text-on-surface mt-1">
                  {p("sync.lastRunValue", {
                    day: lastSyncDay,
                    time: formatDateTime(lastSync, { timeStyle: "short" }),
                  })}
                </span>
              </div>

              <button
                type="button"
                className="bg-primary text-on-primary hover:bg-primary/90 rounded-lg px-4 py-3 flex items-center justify-center transition-colors shadow-md ml-2 group"
              >
                <span className="material-symbols-outlined mr-2 group-hover:-rotate-180 transition-transform duration-500" aria-hidden="true">
                  sync
                </span>
                <span className="font-label-md text-label-md">{p("sync.forceSync")}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8 flex flex-col gap-8">
              {/* ── Critical discrepancy banner ───────────────────────────── */}
              <div className="relative bg-inverse-surface text-inverse-on-surface rounded-[24px] p-8 shadow-xl overflow-hidden group">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                ></div>
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-error/20 blur-3xl rounded-full translate-x-1/4 translate-y-1/4 group-hover:bg-error/30 transition-colors duration-700"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex flex-col w-full md:w-1/2">
                    <div className="inline-flex items-center gap-2 bg-error-container text-on-error-container rounded-full px-4 py-1.5 w-max mb-6">
                      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                        warning
                      </span>
                      <span className="font-label-md text-label-md font-bold uppercase tracking-widest">
                        {p("critical.badge")}
                      </span>
                    </div>

                    <h2 className="font-headline-lg text-headline-lg text-inverse-on-surface mb-2">
                      {p("critical.heading")}
                    </h2>
                    <p className="font-body-md text-body-md text-inverse-primary opacity-90 mb-8">
                      {p("critical.body", { threshold: percent(TOLERANCE) })}
                    </p>

                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-inverse-on-surface/70 uppercase">
                          {p("critical.affectedParcels")}
                        </span>
                        <span className="font-display text-display text-inverse-on-surface">
                          {formatNumber(criticalMismatches)}
                        </span>
                      </div>
                      <div className="flex flex-col border-l border-inverse-primary/30 pl-6">
                        <span className="font-label-md text-label-md text-inverse-on-surface/70 uppercase">
                          {p("critical.mismatchRate")}
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="font-display text-display text-error-container">
                            {percent(100 - criticalAgreement, ONE_DECIMAL)}
                          </span>
                          <span className="material-symbols-outlined text-error-container text-[24px]" aria-hidden="true">
                            trending_up
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 flex justify-center items-center relative h-48">
                    <svg
                      className="w-48 h-48 transform -rotate-90 filter drop-shadow-lg"
                      viewBox="0 0 200 200"
                      role="img"
                      aria-label={p("critical.donutCaption", {
                        value: percent(criticalAgreement, ONE_DECIMAL),
                      })}
                    >
                      {/* Track */}
                      <circle
                        className="text-inverse-primary/20"
                        cx="100"
                        cy="100"
                        fill="none"
                        r={DONUT_RADIUS}
                        stroke="currentColor"
                        strokeWidth="24"
                      ></circle>
                      {/* Agreement arc */}
                      <circle
                        className="text-inverse-primary transition-all duration-1000 ease-out"
                        cx="100"
                        cy="100"
                        fill="none"
                        r={DONUT_RADIUS}
                        stroke="currentColor"
                        strokeDasharray={DONUT_CIRCUMFERENCE}
                        strokeDashoffset={DONUT_CIRCUMFERENCE - donutArc(criticalAgreement)}
                        strokeLinecap="round"
                        strokeWidth="24"
                      ></circle>
                      {/* Mismatch arc, starting exactly where the agreement arc ends */}
                      <circle
                        className="text-error-container transition-all duration-1000 ease-out delay-500"
                        cx="100"
                        cy="100"
                        fill="none"
                        r={DONUT_RADIUS}
                        stroke="currentColor"
                        strokeDasharray={DONUT_CIRCUMFERENCE}
                        strokeDashoffset={donutArc(criticalAgreement)}
                        strokeLinecap="round"
                        strokeWidth="24"
                        style={{
                          transformOrigin: "center",
                          transform: `rotate(${donutRotation(criticalAgreement)}deg)`,
                        }}
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" aria-hidden="true">
                      <span className="font-display text-display text-inverse-on-surface">
                        {percent(criticalAgreement, ONE_DECIMAL)}
                      </span>
                      <span className="font-label-md text-label-md text-inverse-on-surface/70 uppercase">
                        {p("critical.match")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── System pair matrix ────────────────────────────────────── */}
              <div className="bg-surface-container-lowest rounded-[20px] shadow-sm flex flex-col relative overflow-hidden">
                {/*
                 * The header carried a filter_list icon button with no handler and
                 * nothing to filter -- three rows, all of them shown. Dropped
                 * rather than left as an affordance that does nothing, the same
                 * call made for the dead dropdowns on the reports screen.
                 */}
                <div className="p-6 border-b border-surface-container flex items-center bg-surface-container-low/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                      <span className="material-symbols-outlined" aria-hidden="true">
                        compare_arrows
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      {p("matrix.heading")}
                    </h3>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SYSTEM_PAIRS.filter((pair) => !pair.critical).map((pair) => (
                    <article
                      key={`${pair.left}-${pair.right}`}
                      className="bg-surface p-5 rounded-2xl flex flex-col gap-4 group hover:bg-surface-container transition-colors duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {/*
                           * The sync icon sits between the two system names, so the
                           * pair is announced once as a phrase instead of as two
                           * loose words with an icon name between them.
                           */}
                          <span className="sr-only">{pairLabel(pair)}</span>
                          <span aria-hidden="true" className="font-label-md text-label-md font-bold text-on-surface bg-surface-container-high px-2 py-1 rounded">
                            {systemName(pair.left)}
                          </span>
                          <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-[16px]">
                            sync_alt
                          </span>
                          <span aria-hidden="true" className="font-label-md text-label-md font-bold text-on-surface bg-surface-container-high px-2 py-1 rounded">
                            {systemName(pair.right)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-surface-container-lowest px-2 py-1 rounded shadow-sm">
                          <div className={`w-2 h-2 rounded-full ${pair.dotClass}`} aria-hidden="true"></div>
                          <span className="sr-only">
                            {p("matrix.agreement", {
                              value: percent(pair.agreement, ONE_DECIMAL),
                            })}
                          </span>
                          <span aria-hidden="true" className={`font-tabular-nums text-tabular-nums text-[12px] font-semibold ${pair.valueClass}`}>
                            {percent(pair.agreement, ONE_DECIMAL)}
                          </span>
                        </div>
                      </div>

                      {/* Width has to be inline: Tailwind cannot see a class built
                          from a template literal. */}
                      <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden" aria-hidden="true">
                        <div className={`${pair.barClass} h-2 rounded-full`} style={{ width: `${pair.agreement}%` }}></div>
                      </div>

                      <div className="flex justify-between text-on-surface-variant">
                        <span className="font-body-sm text-body-sm">{mismatchLabel(pair.agreement)}</span>
                        <Link
                          to={REVENUE_ROUTES.auditTrail}
                          aria-label={p("matrix.viewAuditFor", { pair: pairLabel(pair) })}
                          className="font-body-sm text-body-sm text-on-surface flex items-center gap-1 group-hover:translate-x-1 transition-transform hover:underline"
                        >
                          {p("matrix.viewAudit")}
                          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                            arrow_forward
                          </span>
                        </Link>
                      </div>
                    </article>
                  ))}

                  {/* The breaching pair gets the full width and its own treatment. */}
                  <article className="bg-error-container/20 p-5 rounded-2xl flex flex-col gap-4 border border-error/20 relative overflow-hidden group hover:bg-error-container/30 transition-colors duration-300 md:col-span-2">
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-error/5 to-transparent"></div>

                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="sr-only">{pairLabel(CRITICAL_PAIR)}</span>
                        <span aria-hidden="true" className="font-label-md text-label-md font-bold text-on-error-container bg-error-container px-3 py-1.5 rounded">
                          {systemName(CRITICAL_PAIR.left)}
                        </span>
                        <span aria-hidden="true" className="material-symbols-outlined text-error text-[20px]">
                          sync_problem
                        </span>
                        <span aria-hidden="true" className="font-label-md text-label-md font-bold text-on-error-container bg-error-container px-3 py-1.5 rounded">
                          {systemName(CRITICAL_PAIR.right)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-md border border-error/20">
                        <span className="relative flex h-2 w-2" aria-hidden="true">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
                        </span>
                        <span className="sr-only">
                          {p("matrix.agreement", {
                            value: percent(criticalAgreement, ONE_DECIMAL),
                          })}
                        </span>
                        <span aria-hidden="true" className="font-tabular-nums text-tabular-nums text-[14px] font-bold text-error">
                          {percent(criticalAgreement, ONE_DECIMAL)}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden relative z-10" aria-hidden="true">
                      <div className="bg-error h-3 rounded-full relative" style={{ width: `${criticalAgreement}%` }}>
                        <div
                          className="absolute inset-0 bg-white/20"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between text-on-surface-variant relative z-10">
                      <span className="font-body-sm text-body-sm font-semibold text-on-error-container flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                          error
                        </span>
                        {p("matrix.intervention", {
                          mismatches: mismatchLabel(criticalAgreement),
                        })}
                      </span>
                      <Link
                        to={REVENUE_ROUTES.discrepancyCases}
                        aria-label={p("matrix.resolveFor", { pair: pairLabel(CRITICAL_PAIR) })}
                        className="font-body-sm text-body-sm text-error font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform hover:underline"
                      >
                        {p("matrix.resolve")}
                        <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </article>
                </div>
              </div>
            </div>

            <div className="xl:col-span-4 flex flex-col gap-8">
              {/* ── Hotspot basemap ───────────────────────────────────────── */}
              <div className="bg-surface-container-lowest rounded-[20px] shadow-sm flex flex-col overflow-hidden h-[300px] relative group">
                <div className="absolute top-4 left-4 z-20 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]" aria-hidden="true">
                    satellite_alt
                  </span>
                  <span className="font-label-md text-label-md text-on-surface">
                    {p("hotspot.label", {
                      tehsil: t(`common.place.tehsils.${HOTSPOT_TEHSIL}`),
                    })}
                  </span>
                </div>

                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  role="img"
                  aria-label={p("hotspot.caption")}
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600')",
                  }}
                ></div>

                <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
                  <button
                    type="button"
                    aria-label={p("hotspot.zoomIn")}
                    className="w-10 h-10 bg-surface text-on-surface rounded-full shadow-lg flex items-center justify-center hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">
                      add
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={p("hotspot.zoomOut")}
                    className="w-10 h-10 bg-surface text-on-surface rounded-full shadow-lg flex items-center justify-center hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">
                      remove
                    </span>
                  </button>
                </div>
              </div>

              {/* ── AI anomaly feed ───────────────────────────────────────── */}
              <div className="bg-surface-container-lowest rounded-[20px] shadow-sm flex flex-col flex-1 overflow-hidden">
                <div className="p-5 border-b border-surface-container flex justify-between items-center bg-primary-container text-on-primary-container">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                      smart_toy
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-primary-container text-[16px]">
                      {p("anomalies.heading")}
                    </h3>
                  </div>
                  <span className="bg-on-primary-container/20 text-on-primary-container px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                    {p("anomalies.live")}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[500px]">
                  <ul className="flex flex-col">
                    {ANOMALIES.map((anomaly, index) => (
                      <li
                        key={anomaly.key}
                        /* The row used to be cursor-pointer with no handler; the
                           open_in_new button is the actual control. */
                        className={`p-5 hover:bg-surface-container-low transition-colors group relative overflow-hidden ${
                          index < ANOMALIES.length - 1 ? "border-b border-surface-container" : ""
                        } ${anomaly.highlight ? "bg-surface-variant/30" : ""}`}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${anomaly.accentClass} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                        <div className="flex justify-between items-start mb-2">
                          <span className="font-tabular-nums text-tabular-nums text-on-surface font-bold">
                            {anomalySubject(anomaly)}
                          </span>
                          <span className="font-tabular-nums text-tabular-nums text-[11px] text-on-surface-variant">
                            {anomalyAge(anomaly.age)}
                          </span>
                        </div>

                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 leading-relaxed">
                          {anomalyBody(anomaly)}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <span className={`${anomaly.riskClass} text-[10px] px-2 py-1 rounded font-bold uppercase`}>
                              {p(`anomalies.risk.${anomaly.risk}`)}
                            </span>
                            <span className="bg-surface-container text-on-surface text-[10px] px-2 py-1 rounded font-bold uppercase">
                              {p(`anomalies.tags.${anomaly.tag}`)}
                            </span>
                          </div>
                          <button
                            type="button"
                            aria-label={p("anomalies.open", { subject: anomalySubject(anomaly) })}
                            className="text-primary opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                              open_in_new
                            </span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-surface-container text-center border-t border-outline-variant/20">
                  <Link
                    to={REVENUE_ROUTES.auditTrail}
                    className="text-label-md font-label-md text-primary hover:underline"
                  >
                    {p("anomalies.viewFullLog")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
