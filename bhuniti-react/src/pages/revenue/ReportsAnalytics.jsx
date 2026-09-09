import { Link } from "react-router-dom";
import { REVENUE_ROUTES } from "../../routes";
import { useI18n } from "../../i18n";

/*
 * Reports & Analytics, demo figures.
 *
 * Every chart is drawn from the arrays below rather than from hand-placed SVG
 * coordinates, which is what the original markup did. The old version had drifted:
 * the processing-time curve peaked at a y value worth about 26 days while its own
 * tooltip read "22d", and the series rose (worse) under a heading that described an
 * improvement. Deriving the geometry from the numbers means the axis, the plotted
 * point and the tooltip cannot disagree again.
 */

// ── Headline figures ────────────────────────────────────────────────────────
// `deltaUnit` picks how the change chip is written: a percentage or a day count.
const KPIS = [
  {
    key: "openDiscrepancies",
    value: 1248,
    delta: 12,
    deltaUnit: "percent",
    icon: "warning",
    iconClass: "text-error",
    glow: "bg-error-container",
    chip: "text-error bg-error-container",
  },
  {
    key: "resolvedCases",
    value: 8432,
    delta: 4.2,
    deltaUnit: "percent",
    icon: "check_circle",
    iconClass: "text-primary",
    glow: "bg-surface-container-high",
    chip: "text-primary bg-surface-container-highest",
  },
  {
    key: "processingTime",
    value: 14,
    unit: "days",
    delta: -2,
    deltaUnit: "days",
    icon: "schedule",
    iconClass: "text-on-tertiary-fixed-variant",
    glow: "bg-tertiary-fixed",
    chip: "text-on-tertiary-fixed-variant bg-tertiary-fixed",
  },
  {
    key: "accuracyIndex",
    value: 94.2,
    percent: true,
    delta: 0.8,
    deltaUnit: "percent",
    icon: "verified_user",
    iconClass: "text-secondary",
    glow: "bg-secondary-container",
    chip: "text-secondary bg-secondary-container",
  },
];

// ── Bar chart: open discrepancies by root cause ─────────────────────────────
const CATEGORIES = [
  { key: "areaMismatch", value: 480, barClass: "fill-primary" },
  { key: "titleDispute", value: 640, barClass: "fill-tertiary-fixed-dim" },
  { key: "boundary", value: 360, barClass: "fill-secondary-fixed" },
  { key: "missingDoc", value: 240, barClass: "fill-error-container" },
  { key: "classificationError", value: 560, barClass: "fill-surface-tint" },
  { key: "other", value: 160, barClass: "fill-outline" },
];

/*
 * Chart 1 geometry. The viewBox is 800x240 with the baseline at y=200, so a bar
 * is `value / BAR_AXIS_MAX * BAR_PLOT_H` pixels tall and the gridlines sit at
 * the same scale -- no magic numbers in the markup.
 */
const BAR_AXIS_MAX = 800;
const BAR_PLOT_H = 200;
const BAR_TICKS = [0, 200, 400, 600];
const BAR_WIDTH = 60;
const BAR_STEP = 120;
const BAR_LEFT = 50;
const barY = (value) => BAR_PLOT_H - (value / BAR_AXIS_MAX) * BAR_PLOT_H;

// ── Source reliability ──────────────────────────────────────────────────────
const SOURCES = [
  { key: "legacy", score: 78, barClass: "bg-tertiary-fixed shadow-[0_0_10px_rgba(252,222,181,0.5)]" },
  { key: "drone", score: 96, barClass: "bg-primary-fixed shadow-[0_0_10px_rgba(218,226,253,0.5)]" },
  { key: "satellite", score: 89, barClass: "bg-secondary-fixed shadow-[0_0_10px_rgba(213,227,253,0.5)]" },
  { key: "citizen", score: 64, barClass: "bg-error-container" },
];

/*
 * Village hotspots. The three names the original shipped (Govindpura, Bairagarh,
 * Kolar) are Bhopal-area villages, which sat oddly in a dashboard scoped to
 * Ghaziabad; these three are in the demo tehsil.
 */
const VILLAGES = [
  { key: "duhai", cases: 142, level: "critical", chip: "bg-error-container text-on-error-container" },
  { key: "bhojpur", cases: 89, level: "elevated", chip: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
  { key: "kadrabad", cases: 45, level: "normal", chip: "bg-surface-container-highest text-on-surface" },
];

// ── Line chart: average mutation processing time, in days ───────────────────
// Declining, which is what "avg processing time -2 days" in the KPI row claims.
const TREND = [
  { key: "jan", days: 22 },
  { key: "feb", days: 18 },
  { key: "mar", days: 16 },
  { key: "apr", days: 15 },
  { key: "may", days: 14 },
];

const TREND_AXIS_MAX = 30;
const TREND_PLOT_H = 160;         // y=200 is 0 days, y=40 is 30 days
const TREND_BASELINE = 200;
const TREND_TICKS = [0, 15, 30];
const TREND_LEFT = 50;
const TREND_STEP = 100;
const trendX = (index) => TREND_LEFT + index * TREND_STEP;
const trendY = (days) => TREND_BASELINE - (days / TREND_AXIS_MAX) * TREND_PLOT_H;

const ONE_DECIMAL = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
const SIGNED = { signDisplay: "always" };

export default function ReportsAnalytics() {
  const { t, formatNumber } = useI18n();
  const p = (key, vars) => t(`pages.reportsAnalytics.${key}`, vars);

  const percent = (value) =>
    `${formatNumber(value, Number.isInteger(value) ? undefined : ONE_DECIMAL)}${t(
      "common.units.percent"
    )}`;

  /* "+12%" or "-2 days", depending on what the figure above it measures. */
  const changeChip = (kpi) =>
    kpi.deltaUnit === "percent"
      ? `${formatNumber(kpi.delta, { ...SIGNED, ...(Number.isInteger(kpi.delta) ? {} : ONE_DECIMAL) })}${t("common.units.percent")}`
      : `${formatNumber(kpi.delta, SIGNED)} ${t("common.units.days")}`;

  const dayTick = (value) => p("trend.axisTick", { value: formatNumber(value) });

  /* Screen readers get the series as a sentence, since an SVG is opaque to them. */
  const barSummary = [...CATEGORIES]
    .sort((a, b) => b.value - a.value)
    .map((item) => `${p(`categories.items.${item.key}`)} ${formatNumber(item.value)}`)
    .join(", ");
  const trendSummary = TREND.map((point) =>
    p("trend.point", { month: p(`trend.months.${point.key}`), value: dayTick(point.days) })
  ).join(", ");

  const trendLine = TREND.map((point, index) => `${trendX(index)} ${trendY(point.days)}`).join(" L ");
  const trendArea = `M ${trendLine} L ${trendX(TREND.length - 1)} ${TREND_BASELINE} L ${TREND_LEFT} ${TREND_BASELINE} Z`;

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

      <div className="flex flex-col w-full p-8 gap-8">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="font-headline-lg text-on-surface">{p("title")}</h1>
            <p className="font-body-md text-on-surface-variant">{p("intro")}</p>
          </div>

          {/* The scope strip states what the extract covers. The original drew it
              as four buttons with dropdown chevrons, none of which were wired to
              anything, so they are plain chips here instead of dead controls. */}
          <div
            className="flex flex-wrap items-center bg-surface-container-lowest shadow-sm rounded-full p-2 gap-2"
            role="group"
            aria-label={p("scope.heading")}
          >
            <span className="bg-surface-container px-4 py-2 rounded-full text-on-surface font-label-md">
              {p("scope.district", { value: p("scope.all") })}
            </span>
            <span className="bg-surface-container px-4 py-2 rounded-full text-on-surface font-label-md">
              {p("scope.tehsil", { value: p("scope.all") })}
            </span>
            <span className="bg-surface-container px-4 py-2 rounded-full text-on-surface font-label-md">
              {p("scope.village", { value: p("scope.all") })}
            </span>
            <span className="w-px h-6 bg-surface-container-highest mx-2" aria-hidden="true"></span>
            <span className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                calendar_today
              </span>
              <span className="font-label-md">{p("scope.period")}</span>
            </span>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {KPIS.map((kpi) => (
            <div
              key={kpi.key}
              className="bg-surface-container-lowest shadow-sm rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group"
            >
              <div
                className={`absolute -right-6 -top-6 w-24 h-24 ${kpi.glow} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out`}
                aria-hidden="true"
              ></div>
              <div className="flex justify-between items-start relative z-10">
                <span className="font-label-md text-on-surface-variant uppercase tracking-wider">
                  {p(`kpi.${kpi.key}`)}
                </span>
                <span className={`material-symbols-outlined ${kpi.iconClass}`} aria-hidden="true">
                  {kpi.icon}
                </span>
              </div>
              <div className="flex items-baseline gap-3 relative z-10">
                <h2 className="font-display text-on-surface">
                  {kpi.percent ? percent(kpi.value) : formatNumber(kpi.value)}
                  {kpi.unit && (
                    <span className="font-headline-md text-on-surface-variant ml-1">
                      {t(`common.units.${kpi.unit}`)}
                    </span>
                  )}
                </h2>
                <span
                  className={`font-label-md ${kpi.chip} px-2 py-0.5 rounded-full`}
                  title={p("kpi.change", { value: changeChip(kpi) })}
                >
                  {changeChip(kpi)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Discrepancies by category */}
          <div className="col-span-12 xl:col-span-8 bg-surface-container-lowest shadow-sm rounded-2xl p-8 flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-headline-md text-on-surface">{p("categories.heading")}</h3>
                <p className="font-body-sm text-on-surface-variant mt-1">{p("categories.intro")}</p>
              </div>
            </div>
            <div className="relative w-full h-72 mt-auto">
              <svg
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 800 240"
                role="img"
                aria-label={p("categories.caption", { summary: barSummary })}
              >
                {BAR_TICKS.map((tick) => (
                  <g key={tick}>
                    <line
                      className="text-surface-container-highest"
                      stroke="currentColor"
                      strokeDasharray={tick === 0 ? undefined : "4"}
                      strokeWidth="1"
                      x1="0"
                      x2="800"
                      y1={barY(tick)}
                      y2={barY(tick)}
                    ></line>
                    <text
                      className="fill-on-surface-variant font-tabular-nums text-[12px]"
                      textAnchor="end"
                      x="-10"
                      y={barY(tick) + 5}
                    >
                      {p("categories.axisTick", { value: formatNumber(tick) })}
                    </text>
                  </g>
                ))}

                {CATEGORIES.map((item, index) => {
                  const x = BAR_LEFT + index * BAR_STEP;
                  const top = barY(item.value);
                  return (
                    <g key={item.key} className="chart-bar group">
                      <rect
                        className={`${item.barClass} transition-all duration-300 group-hover:opacity-80`}
                        height={BAR_PLOT_H - top}
                        rx="4"
                        width={BAR_WIDTH}
                        x={x}
                        y={top}
                      ></rect>
                      <text
                        className="fill-on-surface font-label-md opacity-0 group-hover:opacity-100 transition-opacity"
                        textAnchor="middle"
                        x={x + BAR_WIDTH / 2}
                        y={top - 10}
                      >
                        {formatNumber(item.value)}
                      </text>
                      <text
                        className="fill-on-surface-variant font-label-md text-[12px]"
                        textAnchor="middle"
                        x={x + BAR_WIDTH / 2}
                        y="230"
                      >
                        {p(`categories.items.${item.key}`)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Source reliability */}
          <div className="col-span-12 xl:col-span-4 bg-primary-container shadow-md rounded-2xl p-8 text-on-primary-container relative overflow-hidden flex flex-col justify-between">
            <div
              className="absolute -top-32 -right-32 w-96 h-96 bg-primary-fixed rounded-full blur-[100px] opacity-20 pointer-events-none"
              aria-hidden="true"
            ></div>
            <div className="relative z-10">
              <h3 className="font-headline-md text-white">{p("sources.heading")}</h3>
              <p className="font-body-sm text-primary-fixed mt-1">{p("sources.intro")}</p>
            </div>
            <div className="relative z-10 flex flex-col gap-6 mt-8">
              {SOURCES.map((source) => (
                <div key={source.key} className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <span className="font-label-md text-white">{p(`sources.items.${source.key}`)}</span>
                    <span className="font-tabular-nums text-primary-fixed">
                      {percent(source.score)}
                    </span>
                  </div>
                  {/* The bar repeats the figure beside it, so it is decorative.
                      The width is inline because a Tailwind class built from a
                      template literal never reaches the stylesheet. */}
                  <div
                    className="w-full h-2 bg-inverse-surface rounded-full overflow-hidden"
                    aria-hidden="true"
                  >
                    <div
                      className={`h-full ${source.barClass} rounded-full`}
                      style={{ width: `${source.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative z-10 mt-8 pt-6 bg-inverse-surface/30 px-4 py-3 rounded-lg flex items-start gap-3 backdrop-blur-sm">
              <span
                className="material-symbols-outlined text-tertiary-fixed text-[20px]"
                aria-hidden="true"
              >
                lightbulb
              </span>
              <p className="font-body-sm text-primary-fixed leading-tight">
                {p("sources.insight", { tehsil: t("common.place.tehsils.muradnagar") })}
              </p>
            </div>
          </div>

          {/* Village hotspots over a satellite basemap */}
          <div className="col-span-12 xl:col-span-7 bg-surface-container-lowest shadow-sm rounded-2xl overflow-hidden relative h-[500px]">
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              role="img"
              aria-label={p("hotspots.mapCaption")}
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600')",
              }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/20 to-surface-container-lowest/10"
              aria-hidden="true"
            ></div>

            <div className="absolute top-6 left-6 bg-surface-container-lowest/90 backdrop-blur-xl shadow-lg rounded-xl p-4 min-w-[280px]">
              <h3 className="font-headline-md text-on-surface">{p("hotspots.heading")}</h3>
              <p className="font-body-sm text-on-surface-variant">{p("hotspots.intro")}</p>
              <div className="mt-4 flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error" aria-hidden="true"></div>
                  <span className="font-label-md text-on-surface">{p("hotspots.legend.high")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-tertiary-fixed-dim" aria-hidden="true"></div>
                  <span className="font-label-md text-on-surface">
                    {p("hotspots.legend.monitoring")}
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 bg-surface-container-lowest/95 backdrop-blur-xl shadow-xl rounded-xl overflow-hidden flex flex-col max-h-[200px]">
              <div className="px-6 py-3 bg-surface-container-low flex justify-between items-center shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                <h4 className="font-label-md text-on-surface uppercase tracking-wider">
                  {p("hotspots.tableHeading")}
                </h4>
                {/* The full case list already exists as its own screen, so this
                    links there rather than being a button with no handler. */}
                <Link
                  to={REVENUE_ROUTES.discrepancyCases}
                  className="text-primary font-label-md hover:underline"
                >
                  {p("hotspots.viewFull")}
                </Link>
              </div>
              <ul className="overflow-y-auto w-full p-2">
                {VILLAGES.map((village) => (
                  <li
                    key={village.key}
                    className="flex items-center px-4 py-3 hover:bg-surface-container rounded-lg transition-colors"
                  >
                    <span className="flex-1 font-body-md text-on-surface font-medium">
                      {p(`hotspots.villages.${village.key}`)}
                    </span>
                    <span className="w-32 font-tabular-nums text-on-surface-variant">
                      {p("hotspots.cases", { count: village.cases })}
                    </span>
                    <span className="w-24 text-right">
                      <span
                        className={`inline-block ${village.chip} font-label-md px-2 py-1 rounded-md`}
                      >
                        {p(`hotspots.levels.${village.level}`)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mutation processing time */}
          <div className="col-span-12 xl:col-span-5 bg-surface-container-lowest shadow-sm rounded-2xl p-8 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-headline-md text-on-surface">{p("trend.heading")}</h3>
                <p className="font-body-sm text-on-surface-variant mt-1">{p("trend.intro")}</p>
              </div>
            </div>
            <div className="relative w-full h-64 mt-auto">
              <svg
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 500 240"
                role="img"
                aria-label={p("trend.caption", { summary: trendSummary })}
              >
                <defs>
                  <linearGradient id="lineAreaGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop className="text-primary" offset="0%" stopColor="currentColor" stopOpacity="0.15"></stop>
                    <stop className="text-primary" offset="100%" stopColor="currentColor" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>

                {TREND_TICKS.map((tick) => (
                  <g key={tick}>
                    <line
                      className="text-surface-container-highest"
                      stroke="currentColor"
                      strokeDasharray={tick === 0 ? undefined : "4"}
                      strokeWidth="1"
                      x1="0"
                      x2="500"
                      y1={trendY(tick)}
                      y2={trendY(tick)}
                    ></line>
                    <text
                      className="fill-on-surface-variant font-tabular-nums text-[12px]"
                      textAnchor="end"
                      x="-10"
                      y={trendY(tick) + 5}
                    >
                      {dayTick(tick)}
                    </text>
                  </g>
                ))}

                <path d={trendArea} fill="url(#lineAreaGrad)"></path>
                <path
                  className="text-primary"
                  d={`M ${trendLine}`}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                ></path>

                {TREND.map((point, index) => (
                  <g key={point.key} className="group">
                    <circle
                      className="fill-surface-container-lowest stroke-primary"
                      cx={trendX(index)}
                      cy={trendY(point.days)}
                      r="5"
                      strokeWidth="2"
                    ></circle>
                    <text
                      className="fill-on-surface font-label-md opacity-0 group-hover:opacity-100 transition-opacity"
                      textAnchor="middle"
                      x={trendX(index)}
                      y={trendY(point.days) - 20}
                    >
                      {dayTick(point.days)}
                    </text>
                    <text
                      className="fill-on-surface-variant font-label-md text-[12px]"
                      textAnchor="middle"
                      x={trendX(index)}
                      y="225"
                    >
                      {p(`trend.months.${point.key}`)}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
