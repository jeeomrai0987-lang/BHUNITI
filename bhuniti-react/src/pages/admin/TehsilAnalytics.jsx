import { useI18n } from "../../i18n";

/*
 * District analytics, demo figures. One row per tehsil drives the bar chart and
 * the table below it, so the two can never disagree. `scannedShare` is the
 * outer (total scanned) bar and `verifiedShare` the inner (verified) one -- both
 * are set as inline heights rather than Tailwind h-[..] classes, because a class
 * built from a template literal is invisible to Tailwind's scanner and would
 * silently not exist in the stylesheet.
 */
const TEHSILS = [
  {
    key: "ghaziabad",
    verification: 92.4,
    scannedShare: 92,
    verifiedShare: 85,
    backlog: 3542,
    resolutionDays: 12,
    discrepancy: 3.1,
    status: "optimal",
    trend: "up",
  },
  {
    key: "loni",
    verification: 71.2,
    scannedShare: 71,
    verifiedShare: 65,
    backlog: 5967,
    resolutionDays: 28,
    discrepancy: 12.4,
    status: "needsAttention",
    trend: "down",
    flagged: true,
  },
  {
    key: "modinagar",
    verification: 88.1,
    scannedShare: 88,
    verifiedShare: 82,
    backlog: 2841,
    resolutionDays: 16,
    discrepancy: 4.5,
    status: "stable",
    trend: "flat",
  },
  {
    key: "muradnagar",
    verification: 85.6,
    scannedShare: 85,
    verifiedShare: 79,
    backlog: 1120,
    resolutionDays: 14,
    discrepancy: 3.8,
    status: "stable",
    trend: "up",
  },
  {
    key: "dasna",
    verification: 95.2,
    scannedShare: 95,
    verifiedShare: 91,
    backlog: 738,
    resolutionDays: 9,
    discrepancy: 1.2,
    status: "optimal",
    trend: "up",
  },
];

// Donut slices. `dashOffset` keeps the original hand-tuned arc lengths.
//
// The stroke reads the theme variable the stylesheet actually declares. The
// markup asked for `--tw-colors-error`, which is not a name index.css defines,
// so every arc resolved to an invalid colour and fell back to no stroke at all
// -- the donut rendered as an empty ring. index.css declares `--color-*`.
const BACKLOG_SHARE = [
  { key: "loni", share: 42, color: "bg-error", stroke: "var(--color-error)", dashOffset: 150, rotate: "rotate-[90deg]" },
  { key: "ghaziabad", share: 25, color: "bg-primary", stroke: "var(--color-primary)", dashOffset: 188.4, rotate: "-rotate-90" },
  { key: "modinagar", share: 20, color: "bg-secondary", stroke: "var(--color-secondary)", dashOffset: 200, rotate: "rotate-[-18deg]" },
  { key: "others", share: 13, color: "bg-tertiary-fixed-dim", stroke: "var(--color-tertiary-fixed-dim)", dashOffset: 210, rotate: "rotate-[35deg]" },
];

const DISTRICT = {
  verification: 87.2,
  verificationDelta: 2.1,
  backlogDelta: -4.5,
  resolutionDays: 18,
  slaDays: 14,
  mapSync: 94.8,
  alertTehsil: "loni",
  districtAverageDiscrepancy: 4.2,
};

const TREND_ICON = { up: "trending_up", down: "trending_down", flat: "horizontal_rule" };
const TREND_CLASS = {
  up: "material-symbols-outlined text-[16px] text-green-600",
  down: "material-symbols-outlined text-[16px] text-error",
  flat: "material-symbols-outlined text-[16px] text-on-surface-variant",
};

const STATUS_PILL = {
  optimal: {
    className:
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 border border-green-200",
    dot: <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>,
  },
  needsAttention: {
    className:
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-error text-on-error shadow-sm",
    dot: <span className="material-symbols-outlined text-[14px]">warning</span>,
  },
  stable: {
    className:
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface border border-outline-variant/50",
    dot: <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span>,
  },
};

const TOTAL_BACKLOG = TEHSILS.reduce((sum, tehsil) => sum + tehsil.backlog, 0);
const ONE_DECIMAL = { minimumFractionDigits: 1, maximumFractionDigits: 1 };

export default function TehsilAnalytics() {
  const { t, formatNumber } = useI18n();

  const p = (key, vars) => t(`pages.tehsilAnalytics.${key}`, vars);
  const percent = (value, options) =>
    `${formatNumber(value, options)}${t("common.units.percent")}`;
  const days = (value) => `${formatNumber(value)} ${t("common.units.days")}`;
  // Jurisdiction names are shared with the other district screens.
  const tehsilName = (key) => t(`common.place.tehsils.${key}`);
  const alertTehsil = TEHSILS.find((row) => row.key === DISTRICT.alertTehsil);

  return (
    <main className="pt-16 min-h-screen bg-surface"><div className="flex flex-col w-full p-8 gap-8 animate-fade-in">

    <div className="flex flex-col gap-2">
    <h1 className="font-display text-display text-on-surface">{p("title")}</h1>
    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                {p("intro", { district: t("common.place.district") })}
            </p>
    </div>

    <div className="bg-error-container text-on-error-container p-6 rounded-2xl flex items-start gap-4 shadow-md relative overflow-hidden group">
    <div className="absolute -right-12 -top-12 w-48 h-48 bg-error/10 rounded-full mix-blend-multiply blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
    <span className="material-symbols-outlined text-error text-[32px] mt-1 relative z-10">warning</span>
    <div className="flex flex-col gap-2 relative z-10 flex-1">
    <h2 className="font-headline-md text-headline-md font-bold text-on-error-container">{p("alert.heading", { tehsil: tehsilName(DISTRICT.alertTehsil) })}</h2>
    <p className="font-body-md text-body-md opacity-90">
                    {p("alert.body", {
                      tehsil: tehsilName(DISTRICT.alertTehsil),
                      rate: percent(alertTehsil.discrepancy, ONE_DECIMAL),
                      average: percent(DISTRICT.districtAverageDiscrepancy, ONE_DECIMAL),
                    })}
                </p>
    <div className="mt-2 flex gap-3">
    <button className="bg-error text-on-error px-4 py-2 rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-error/90 transition-colors shadow-sm">{p("alert.rootCause")}</button>
    <button className="px-4 py-2 rounded-lg font-label-md text-label-md uppercase tracking-wider text-error hover:bg-error/10 transition-colors">{p("alert.dismiss")}</button>
    </div>
    </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

    <div className="bg-surface-container p-6 rounded-2xl shadow-sm flex flex-col gap-3 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors"></div>
    <div className="flex items-center justify-between">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">{p("kpi.verification")}</span>
    <span className="material-symbols-outlined text-primary">verified</span>
    </div>
    <div className="flex items-baseline gap-2">
    <span className="font-display text-display text-on-surface">{percent(DISTRICT.verification, ONE_DECIMAL)}</span>
    <span className="font-label-md text-label-md text-secondary">{p("kpi.verificationDelta", { value: percent(DISTRICT.verificationDelta, ONE_DECIMAL) })}</span>
    </div>
    <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden mt-2">
    <div className="bg-primary h-full rounded-full" style={{ width: `${DISTRICT.verification}%` }}></div>
    </div>
    </div>

    <div className="bg-surface-container p-6 rounded-2xl shadow-sm flex flex-col gap-3 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-tertiary/5 rounded-full blur-xl group-hover:bg-tertiary/10 transition-colors"></div>
    <div className="flex items-center justify-between">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">{p("kpi.backlog")}</span>
    <span className="material-symbols-outlined text-tertiary-fixed-dim">history</span>
    </div>
    <div className="flex items-baseline gap-2">
    <span className="font-display text-display text-on-surface">{formatNumber(TOTAL_BACKLOG)}</span>
    <span className="font-label-md text-label-md text-error">{p("kpi.backlogDelta", { value: percent(DISTRICT.backlogDelta, ONE_DECIMAL) })}</span>
    </div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{p("kpi.backlogNote", { count: TEHSILS.length })}</p>
    </div>

    <div className="bg-surface-container p-6 rounded-2xl shadow-sm flex flex-col gap-3 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary/5 rounded-full blur-xl group-hover:bg-secondary/10 transition-colors"></div>
    <div className="flex items-center justify-between">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">{p("kpi.resolution")}</span>
    <span className="material-symbols-outlined text-secondary">timer</span>
    </div>
    <div className="flex items-baseline gap-2">
    <span className="font-display text-display text-on-surface">{formatNumber(DISTRICT.resolutionDays)}<span className="text-headline-md font-headline-md opacity-50 ml-1">{p("kpi.resolutionUnit")}</span></span>
    </div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{p("kpi.slaTarget", { days: days(DISTRICT.slaDays) })}</p>
    </div>

    <div className="bg-surface-container p-6 rounded-2xl shadow-sm flex flex-col gap-3 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
    <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay" role="img" aria-label={p("kpi.mapSyncCaption")} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600')" }}></div>
    <div className="flex items-center justify-between relative z-10">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">{p("kpi.mapSync")}</span>
    <span className="material-symbols-outlined text-primary">sync</span>
    </div>
    <div className="flex items-baseline gap-2 relative z-10">
    <span className="font-display text-display text-on-surface">{percent(DISTRICT.mapSync, ONE_DECIMAL)}</span>
    </div>
    <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden mt-2 relative z-10">
    <div className="bg-primary h-full rounded-full" style={{ width: `${DISTRICT.mapSync}%` }}></div>
    </div>
    </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

    <div className="bg-surface-container-low p-6 rounded-3xl shadow-sm lg:col-span-2 flex flex-col gap-6">
    <div className="flex items-center justify-between">
    <h3 className="font-headline-md text-headline-md text-on-surface">{p("chart.heading")}</h3>
    <button className="text-on-surface-variant hover:text-primary transition-colors" aria-label={p("chart.options")}>
    <span className="material-symbols-outlined">more_horiz</span>
    </button>
    </div>
    <div className="flex-1 flex items-end justify-around h-64 gap-2 relative">

    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
    <div className="w-full h-[1px] bg-outline"></div>
    <div className="w-full h-[1px] bg-outline"></div>
    <div className="w-full h-[1px] bg-outline"></div>
    <div className="w-full h-[1px] bg-outline"></div>
    <div className="w-full h-[1px] bg-outline"></div>
    </div>

    {TEHSILS.map((tehsil) => (
    <div key={tehsil.key} className="flex flex-col items-center gap-2 group relative z-10 h-full justify-end w-16"
      title={p("chart.barLabel", { tehsil: tehsilName(tehsil.key), value: percent(tehsil.scannedShare) })}>
    <span className={`font-label-md text-label-md absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity ${tehsil.flagged ? "text-error" : "text-on-surface"}`}>{percent(tehsil.scannedShare)}</span>
    <div className={`w-12 rounded-t-lg transition-colors relative overflow-hidden ${tehsil.flagged ? "bg-error/20 group-hover:bg-error/30" : "bg-primary/20 group-hover:bg-primary/30"}`} style={{ height: `${tehsil.scannedShare}%` }}>
    <div className={`absolute bottom-0 w-full rounded-t-sm group-hover:opacity-90 ${tehsil.flagged ? "bg-error" : "bg-primary"}`} style={{ height: `${tehsil.verifiedShare}%` }}></div>
    </div>
    <span className={`font-label-md text-label-md rotate-[-45deg] origin-top-left mt-4 whitespace-nowrap ${tehsil.flagged ? "text-error font-bold" : "text-on-surface-variant"}`}>{tehsilName(tehsil.key)}</span>
    </div>
    ))}
    </div>
    <div className="flex items-center justify-center gap-6 mt-8">
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 bg-primary rounded-sm"></div>
    <span className="font-label-md text-label-md text-on-surface-variant">{p("chart.verified")}</span>
    </div>
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 bg-primary/20 rounded-sm"></div>
    <span className="font-label-md text-label-md text-on-surface-variant">{p("chart.scanned")}</span>
    </div>
    </div>
    </div>
    <div className="bg-surface-container-low p-6 rounded-3xl shadow-sm flex flex-col gap-6 relative overflow-hidden">
    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-tertiary-fixed/10 rounded-full blur-3xl"></div>
    <h3 className="font-headline-md text-headline-md text-on-surface">{p("backlog.heading")}</h3>
    <div className="flex-1 flex flex-col items-center justify-center relative">

    <svg className="w-48 h-48 drop-shadow-md" viewBox="0 0 100 100" role="img" aria-label={p("backlog.heading")}>
    {BACKLOG_SHARE.map((slice) => (
    <circle key={slice.key} className={`transform ${slice.rotate} origin-center transition-all duration-1000 cursor-pointer`} cx="50" cy="50" fill="transparent" r="40" stroke={slice.stroke} strokeDasharray="251.2" strokeDashoffset={slice.dashOffset} strokeWidth="16">
    <title>{p("backlog.legendItem", { name: slice.key === "others" ? p("backlog.others") : tehsilName(slice.key), share: percent(slice.share) })}</title>
    </circle>
    ))}
    <text className="text-on-surface" fill="currentColor" fontSize="10" fontWeight="600" textAnchor="middle" x="50" y="45">{tehsilName(BACKLOG_SHARE[0].key)}</text>
    <text className="text-error" fill="currentColor" fontSize="14" fontWeight="700" textAnchor="middle" x="50" y="58">{percent(BACKLOG_SHARE[0].share)}</text>
    </svg>
    </div>
    <div className="grid grid-cols-2 gap-3 mt-4">
    {BACKLOG_SHARE.map((slice) => (
    <div key={slice.key} className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-sm ${slice.color}`}></div>
    <span className="font-body-sm text-body-sm text-on-surface-variant">{p("backlog.legendItem", { name: slice.key === "others" ? p("backlog.others") : tehsilName(slice.key), share: percent(slice.share) })}</span>
    </div>
    ))}
    </div>
    </div>
    </div>
    <div className="bg-surface-container-lowest rounded-3xl shadow-md overflow-hidden flex flex-col border border-outline-variant/30 mt-4">
    <div className="p-6 border-b border-outline-variant/50 bg-surface-container-low flex items-center justify-between">
    <div className="flex items-center gap-4">
    <h3 className="font-headline-md text-headline-md text-on-surface">{p("table.heading")}</h3>
    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label-md text-label-md">{p("table.period")}</span>
    </div>
    <div className="flex gap-2">
    <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors" aria-label={t("common.actions.download")}><span className="material-symbols-outlined">download</span></button>
    <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors" aria-label={t("common.actions.filter")}><span className="material-symbols-outlined">filter_list</span></button>
    </div>
    </div>
    <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
    <thead>
    <tr className="bg-surface-container-low/50">
    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold sticky left-0 bg-surface-container-low z-20 shadow-[1px_0_0_rgba(0,0,0,0.05)]">{t("common.fields.tehsil")}</th>
    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">{p("table.columns.verification")}</th>
    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">{p("table.columns.backlog")}</th>
    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">{p("table.columns.resolutionTime")}</th>
    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">{p("table.columns.discrepancyRate")}</th>
    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">{t("common.fields.status")}</th>
    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold text-right">{t("common.fields.action")}</th>
    </tr>
    </thead>
    <tbody className="divide-y divide-outline-variant/20 font-tabular-nums text-tabular-nums">
    {TEHSILS.map((tehsil) => (
    <tr key={tehsil.key} className={tehsil.flagged ? "bg-error/5 hover:bg-error/10 transition-colors group" : "hover:bg-surface-container-low/30 transition-colors group"}>
    <td className={tehsil.flagged
      ? "p-4 font-body-md text-body-md font-bold text-error sticky left-0 bg-[#fff5f5] group-hover:bg-[#ffebeb] z-10 transition-colors shadow-[1px_0_0_rgba(0,0,0,0.05)]"
      : "p-4 font-body-md text-body-md font-medium text-on-surface sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low/30 z-10 transition-colors shadow-[1px_0_0_rgba(0,0,0,0.05)]"}>{tehsilName(tehsil.key)}</td>
    <td className="p-4">
    <div className="flex items-center gap-2">
    <span className={tehsil.flagged ? "text-error font-bold" : "text-on-surface"}>{percent(tehsil.verification, ONE_DECIMAL)}</span>
    <span className={TREND_CLASS[tehsil.trend]}>{TREND_ICON[tehsil.trend]}</span>
    </div>
    </td>
    <td className={tehsil.flagged ? "p-4 text-error font-bold" : "p-4 text-on-surface"}>{formatNumber(tehsil.backlog)}</td>
    <td className={tehsil.flagged ? "p-4 text-error" : "p-4 text-on-surface"}>{days(tehsil.resolutionDays)}</td>
    <td className={tehsil.flagged ? "p-4 text-error font-bold" : "p-4 text-on-surface"}>{percent(tehsil.discrepancy, ONE_DECIMAL)}</td>
    <td className="p-4">
    <span className={STATUS_PILL[tehsil.status].className}>
    {STATUS_PILL[tehsil.status].dot}
                                    {p(`status.${tehsil.status}`)}
                                </span>
    </td>
    <td className="p-4 text-right">
    <button className={tehsil.flagged
      ? "text-error font-label-md text-label-md uppercase tracking-wider hover:underline flex items-center justify-end w-full font-bold"
      : "text-primary font-label-md text-label-md uppercase tracking-wider hover:underline flex items-center justify-end w-full"}
      aria-label={p("table.drillDownFor", { tehsil: tehsilName(tehsil.key) })}>{p("table.drillDown")} <span className="material-symbols-outlined text-[18px] ml-1">chevron_right</span></button>
    </td>
    </tr>
    ))}
    </tbody>
    </table>
    </div>
    </div>
    </div>
    </main>
  );
}
