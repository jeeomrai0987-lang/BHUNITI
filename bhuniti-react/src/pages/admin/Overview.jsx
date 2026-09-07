import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useI18n } from "../../i18n";
import { logFallback } from "../../utils/log";

/*
 * District dashboard. Everything below the KPI strip is demo data, so it is
 * declared here as fixtures rather than pasted into the markup five times over.
 *
 * `quality` grades a tehsil's data health and drives three things at once -- the
 * bar colour, the pill, and whether the discrepancy count is called out -- so
 * they can never drift apart the way five hand-written table rows did.
 */
const TEHSIL_ROWS = [
  { key: "ghaziabad", verification: 96.2, discrepancies: 312, quality: "optimal" },
  { key: "loni", verification: 88.4, discrepancies: 845, quality: "attention" },
  { key: "modinagar", verification: 94.1, discrepancies: 412, quality: "optimal" },
  { key: "muradnagar", verification: 95.8, discrepancies: 158, quality: "optimal" },
  { key: "dasna", verification: 91.2, discrepancies: 115, quality: "review", last: true },
];

const QUALITY_STYLE = {
  optimal: {
    bar: "bg-secondary",
    dot: "bg-secondary",
    pill: "bg-secondary-container text-on-secondary-container",
    count: "",
  },
  attention: {
    bar: "bg-error",
    dot: "bg-error",
    pill: "bg-error-container text-on-error-container",
    count: "font-semibold text-error",
  },
  review: {
    bar: "bg-tertiary",
    dot: "bg-tertiary",
    pill: "bg-tertiary-container text-on-tertiary-container",
    count: "font-semibold text-tertiary",
  },
};

/*
 * Alert feed. `ago` is a relative age rather than a timestamp because these are
 * fixtures -- a hardcoded ISO date would read "11 months ago" by the time anyone
 * demos this. Real alerts from the API carry a `created_at` instead.
 */
const ALERTS = [
  {
    key: "boundaryDispute",
    icon: "warning",
    filled: true,
    tone: "bg-error/10 text-error",
    ago: { unit: "minutesAgo", count: 2 },
    vars: { case: "#LD-8992", tehsil: "loni" },
  },
  {
    key: "syncFailure",
    icon: "sync_problem",
    tone: "bg-tertiary/10 text-tertiary",
    ago: { unit: "minutesAgo", count: 15 },
    vars: { count: 12, tehsil: "modinagar" },
  },
  {
    key: "surveyorReassigned",
    icon: "person_add",
    tone: "bg-primary/10 text-primary",
    ago: { unit: "hoursAgo", count: 1 },
    vars: { id: "S-402", tehsil: "dasna" },
  },
  {
    key: "courtOrder",
    icon: "warning",
    filled: true,
    tone: "bg-error/10 text-error",
    ago: { unit: "hoursAgo", count: 3 },
    vars: { ulpin: "09283746" },
  },
];

const INSIGHTS = [
  {
    key: "quality",
    accent: "border-error",
    kindClass: "text-error-container",
    icon: "trending_down",
    tehsil: "loni",
    delta: 4.8,
  },
  {
    key: "bottleneck",
    accent: "border-tertiary-fixed",
    kindClass: "text-tertiary-fixed",
    icon: "hourglass_bottom",
    tehsil: "dasna",
    delta: 15,
    slaOverrunDays: 3,
  },
];

const ESCALATED_COUNT = 34;
const FILLED_ICON = { fontVariationSettings: "'FILL' 1" };

const FALLBACK_METRICS = {
  district_name: "Ghaziabad",
  total_parcels: 124580,
  verified_parcels: 116820,
  verified_pct: 93.8,
  open_discrepancies: 1842,
  high_priority_discrepancies: 126,
  pending_mutations: 2416,
  scheduled_field_surveys: 284,
};

const ONE_DECIMAL = { minimumFractionDigits: 1, maximumFractionDigits: 1 };

export default function AdminOverview() {
  const { t, formatNumber } = useI18n();
  const [data, setData] = useState(FALLBACK_METRICS);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.analytics.getDistrictOverview();
        if (res) {
          setData(res);
          setOffline(false);
        }
      } catch (err) {
        logFallback("district overview metrics", err);
        setOffline(true);
      }
    }
    loadStats();
  }, []);

  const p = (key, vars) => t(`pages.adminOverview.${key}`, vars);
  const percent = (value, options) =>
    `${formatNumber(value, options)}${t("common.units.percent")}`;
  const days = (value) => `${formatNumber(value)} ${t("common.units.days")}`;
  // 4.8 keeps its decimal, 15 does not gain a ".0".
  const deltaText = (value) => percent(value, value % 1 ? ONE_DECIMAL : undefined);
  // The API sends the district's own name; the five tehsils are demo fixtures.
  const tehsilName = (key) => t(`common.place.tehsils.${key}`);
  const districtName = data.district_name || FALLBACK_METRICS.district_name;

  return (
    <main className="pt-16 min-h-screen bg-surface"><div className="flex flex-col w-full p-4 md:p-8 space-y-8 bg-surface text-on-surface">
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full relative z-10">
    <div className="flex flex-col max-w-3xl space-y-2">
    <div className="flex items-center gap-2 mb-2">
    <span className="inline-flex items-center justify-center bg-primary text-on-primary rounded-full px-3 py-1 font-label-md tracking-wider uppercase shadow-md">
                {districtName}
             </span>
    <span className="text-on-surface-variant font-label-md tracking-wide uppercase">{p("badge")}</span>
    {offline && (
    <span className="px-2 py-1 rounded bg-surface-container-high text-on-surface-variant text-[10px] uppercase tracking-wider">
                {t("common.state.offlineShort")}
             </span>
    )}
    </div>
    <h1 className="font-display text-4xl md:text-5xl text-on-surface leading-tight relative inline-block">
            {p("title")}
            <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
    </h1>
    <p className="font-body-lg text-on-surface-variant pt-4">{p("intro")}</p>
    {offline && (
    <p className="font-body-sm text-on-surface-variant" role="status">{t("common.state.offline")}</p>
    )}
    </div>
    <div className="flex items-center gap-3">
    <button className="bg-surface-container text-on-surface px-4 py-2 rounded-lg shadow-sm hover:bg-surface-container-high transition-colors flex items-center gap-2 font-label-md">
    <span className="material-symbols-outlined text-[20px]">file_download</span> {p("actions.exportReport")}
            </button>
    <button className="bg-primary text-on-primary px-5 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-transform hover:-translate-y-0.5 flex items-center gap-2 font-label-md">
    <span className="material-symbols-outlined text-[20px]">sync</span> {p("actions.forceSync")}
            </button>
    </div>
    </header>

    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">

    <div className="bg-surface-container rounded-xl p-5 shadow-sm relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
    <span className="material-symbols-outlined text-[64px]">landscape</span>
    </div>
    <p className="font-label-md text-on-surface-variant uppercase mb-2 relative z-10">{p("kpi.totalParcels")}</p>
    <div className="flex items-baseline gap-2 relative z-10">
    <span className="font-display text-3xl text-on-surface font-tabular-nums">{formatNumber(data.total_parcels)}</span>
    </div>
    <div className="mt-4 relative z-10 h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
    <div className="h-full bg-primary w-full rounded-full"></div>
    </div>
    </div>

    <div className="bg-surface-container rounded-xl p-5 shadow-sm relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-secondary">
    <span className="material-symbols-outlined text-[64px]">verified</span>
    </div>
    <p className="font-label-md text-on-surface-variant uppercase mb-2 relative z-10">{p("kpi.verifiedParcels")}</p>
    <div className="flex items-baseline gap-2 relative z-10">
    <span className="font-display text-3xl text-on-surface font-tabular-nums">{formatNumber(data.verified_parcels)}</span>
    <span className="font-body-sm text-secondary bg-secondary/10 px-2 py-0.5 rounded-full font-tabular-nums">{percent(data.verified_pct, ONE_DECIMAL)}</span>
    </div>
    <div className="mt-4 relative z-10 h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
    <div className="h-full bg-secondary rounded-full" style={{ width: `${data.verified_pct}%` }}></div>
    </div>
    </div>

    <div className="bg-error-container text-on-error-container rounded-xl p-5 shadow-sm relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
    <span className="material-symbols-outlined text-[64px]">error_outline</span>
    </div>
    <p className="font-label-md text-on-error-container/80 uppercase mb-2 relative z-10">{p("kpi.openDiscrepancies")}</p>
    <div className="flex flex-col gap-1 relative z-10">
    <div className="flex items-baseline gap-2">
    <span className="font-display text-3xl font-tabular-nums">{formatNumber(data.open_discrepancies)}</span>
    </div>
    <div className="flex items-center gap-1 text-error text-sm font-label-md">
    <span className="material-symbols-outlined text-[16px] text-error" style={FILLED_ICON}>priority_high</span>
    <span>{p("kpi.highPriority", { count: data.high_priority_discrepancies })}</span>
    </div>
    </div>
    </div>

    <div className="bg-tertiary-container text-on-tertiary-container rounded-xl p-5 shadow-sm relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
    <span className="material-symbols-outlined text-[64px]">history_edu</span>
    </div>
    <p className="font-label-md text-on-tertiary-container/80 uppercase mb-2 relative z-10">{p("kpi.pendingMutations")}</p>
    <div className="flex items-baseline gap-2 relative z-10">
    <span className="font-display text-3xl font-tabular-nums">{formatNumber(data.pending_mutations)}</span>
    </div>
    <div className="mt-4 flex gap-2 relative z-10">
    <span className="text-xs font-label-md bg-on-tertiary-container/10 px-2 py-1 rounded uppercase">{p("kpi.fieldSurveys", { count: data.scheduled_field_surveys })}</span>
    </div>
    </div>
    </section>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full mt-4 items-start">

    <div className="xl:col-span-8 flex flex-col space-y-8">

    <section className="bg-surface-container rounded-2xl shadow-md overflow-hidden flex flex-col h-[600px] relative">
    <div className="p-4 bg-surface/90 backdrop-blur-md z-20 flex justify-between items-center relative shadow-sm">
    <div className="flex items-center gap-3">
    <span className="material-symbols-outlined text-primary bg-primary-container p-2 rounded-lg">map</span>
    <div>
    <h3 className="font-headline-md text-on-surface leading-tight">{p("map.heading")}</h3>
    <p className="font-body-sm text-on-surface-variant">{p("map.subheading")}</p>
    </div>
    </div>
    <div className="flex gap-2 bg-surface-container-low p-1 rounded-lg">
    <button className="px-3 py-1.5 rounded-md bg-surface shadow-sm text-on-surface font-label-md text-xs" aria-pressed="true">{p("map.layers.heatmap")}</button>
    <button className="px-3 py-1.5 rounded-md text-on-surface-variant hover:bg-surface/50 font-label-md text-xs transition-colors" aria-pressed="false">{p("map.layers.parcels")}</button>
    <button className="px-3 py-1.5 rounded-md text-on-surface-variant hover:bg-surface/50 font-label-md text-xs transition-colors" aria-pressed="false">{p("map.layers.satellite")}</button>
    </div>
    </div>
    <div className="flex-1 w-full relative">

    <div className="absolute inset-0 bg-cover bg-center w-full h-full" role="img" aria-label={p("map.caption")} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600')" }}></div>

    <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
    <button className="w-10 h-10 bg-surface/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-on-surface hover:text-primary hover:-translate-y-0.5 transition-all" aria-label={p("map.zoomIn")}>
    <span className="material-symbols-outlined">add</span>
    </button>
    <button className="w-10 h-10 bg-surface/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-on-surface hover:text-primary hover:-translate-y-0.5 transition-all" aria-label={p("map.zoomOut")}>
    <span className="material-symbols-outlined">remove</span>
    </button>
    <button className="w-10 h-10 bg-surface/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-on-surface mt-2 hover:text-primary hover:-translate-y-0.5 transition-all" aria-label={p("map.recentre")}>
    <span className="material-symbols-outlined">my_location</span>
    </button>
    </div>

    <div className="absolute bottom-6 left-6 bg-surface/90 backdrop-blur-md p-4 rounded-xl shadow-lg z-20 min-w-[200px]">
    <h4 className="font-label-md uppercase text-on-surface-variant mb-3">{p("map.legend.heading")}</h4>
    <div className="space-y-2">
    <div className="flex items-center gap-3">
    <div className="w-4 h-4 rounded-full bg-error"></div>
    <span className="font-body-sm text-on-surface">{p("map.legend.critical")}</span>
    </div>
    <div className="flex items-center gap-3">
    <div className="w-4 h-4 rounded-full bg-tertiary"></div>
    <span className="font-body-sm text-on-surface">{p("map.legend.amber")}</span>
    </div>
    <div className="flex items-center gap-3">
    <div className="w-4 h-4 rounded-full bg-secondary"></div>
    <span className="font-body-sm text-on-surface">{p("map.legend.low")}</span>
    </div>
    </div>
    </div>
    </div>
    </section>

    <section className="bg-surface-container rounded-2xl shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
    <h3 className="font-headline-md text-on-surface flex items-center gap-2">
    <span className="material-symbols-outlined text-secondary">table_view</span>
                    {p("table.heading")}
                </h3>
    <button className="text-primary hover:bg-primary-container px-3 py-1.5 rounded-lg transition-colors font-label-md">{t("common.actions.viewAll")}</button>
    </div>
    <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
    <thead>
    <tr className="border-b-2 border-surface-variant font-label-md text-on-surface-variant">
    <th className="pb-3 pl-2 font-semibold">{t("common.fields.tehsil")}</th>
    <th className="pb-3 font-semibold">{p("table.columns.verification")}</th>
    <th className="pb-3 font-semibold text-right">{p("table.columns.discrepancies")}</th>
    <th className="pb-3 font-semibold pl-4">{p("table.columns.quality")}</th>
    <th className="pb-3 font-semibold text-center">{t("common.fields.action")}</th>
    </tr>
    </thead>
    <tbody className="font-tabular-nums text-on-surface">
    {TEHSIL_ROWS.map((row) => {
      const style = QUALITY_STYLE[row.quality];
      return (
    <tr key={row.key} className={`${row.last ? "" : "border-b border-surface-variant "}hover:bg-surface-container-high transition-colors group`}>
    <td className="py-4 pl-2 font-body-md font-medium">
    <button className="flex items-center gap-2 hover:text-primary transition-colors" aria-label={p("table.openTehsil", { tehsil: tehsilName(row.key) })}>
                                {tehsilName(row.key)} <span className="material-symbols-outlined text-[14px] text-secondary opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
    </button>
    </td>
    <td className="py-4">
    <div className="flex items-center gap-2">
    <span>{percent(row.verification, ONE_DECIMAL)}</span>
    <div className="w-16 h-1.5 bg-surface-variant rounded-full"><div className={`h-full ${style.bar} rounded-full`} style={{ width: `${row.verification}%` }}></div></div>
    </div>
    </td>
    <td className={`py-4 text-right ${style.count}`}>{formatNumber(row.discrepancies)}</td>
    <td className="py-4 pl-4"><span className={`inline-flex items-center gap-1 ${style.pill} px-2.5 py-1 rounded-full text-xs font-label-md`}><span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span> {p(`quality.${row.quality}`)}</span></td>
    <td className="py-4 text-center"><button className="text-on-surface-variant hover:text-primary" aria-label={p("table.rowMenu", { tehsil: tehsilName(row.key) })}><span className="material-symbols-outlined">more_vert</span></button></td>
    </tr>
      );
    })}
    </tbody>
    </table>
    </div>
    </section>
    </div>

    <div className="xl:col-span-4 flex flex-col space-y-8">

    <section className="bg-primary-container text-on-primary-container rounded-2xl shadow-md p-6 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-6 opacity-10">
    <span className="material-symbols-outlined text-[120px]">smart_toy</span>
    </div>
    <div className="flex items-center gap-3 mb-6 relative z-10">
    <div className="bg-primary text-on-primary p-2 rounded-full">
    <span className="material-symbols-outlined">lightbulb</span>
    </div>
    <h3 className="font-headline-md">{p("insights.heading")}</h3>
    </div>
    <div className="space-y-4 relative z-10">
    {INSIGHTS.map((insight) => (
    <div key={insight.key} className={`bg-surface/10 backdrop-blur-sm p-4 rounded-xl border-l-4 ${insight.accent}`}>
    <div className="flex justify-between items-start mb-2">
    <span className={`font-label-md uppercase tracking-wider ${insight.kindClass}`}>{p(`insights.${insight.key}.kind`)}</span>
    <span className={`material-symbols-outlined text-sm ${insight.kindClass}`}>{insight.icon}</span>
    </div>
    <p className="font-body-sm leading-relaxed text-on-primary-container/90">
                        {p(`insights.${insight.key}.body`, {
                          tehsil: tehsilName(insight.tehsil),
                          delta: deltaText(insight.delta),
                          days: insight.slaOverrunDays ? days(insight.slaOverrunDays) : undefined,
                        })}
                    </p>
    </div>
    ))}
    </div>
    </section>

    <section className="bg-surface-container rounded-2xl shadow-sm p-6 flex-1 flex flex-col">
    <div className="flex justify-between items-center mb-6">
    <h3 className="font-headline-md text-on-surface flex items-center gap-2">
    <span className="material-symbols-outlined text-error">notification_important</span>
                        {p("alerts.heading")}
                    </h3>
    <span className="bg-error text-on-error font-label-md px-2 py-0.5 rounded-full text-xs">{p("alerts.escalated", { count: ESCALATED_COUNT })}</span>
    </div>
    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
    {ALERTS.map((alert) => (
    <div key={alert.key} className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer group">
    <div className={`mt-1 p-1.5 rounded-full ${alert.tone}`}>
    <span className="material-symbols-outlined text-[16px] block" style={alert.filled ? FILLED_ICON : undefined}>{alert.icon}</span>
    </div>
    <div className="flex-1 min-w-0">
    <div className="flex justify-between items-baseline mb-1">
    <h4 className="font-label-md text-on-surface truncate pr-2">{p(`alerts.${alert.key}.title`)}</h4>
    <span className="text-[10px] text-on-surface-variant font-tabular-nums whitespace-nowrap">{t(`common.time.${alert.ago.unit}`, { count: alert.ago.count })}</span>
    </div>
    <p className="font-body-sm text-on-surface-variant line-clamp-2">
                            {p(`alerts.${alert.key}.body`, {
                              ...alert.vars,
                              tehsil: alert.vars.tehsil ? tehsilName(alert.vars.tehsil) : undefined,
                            })}
                        </p>
    </div>
    </div>
    ))}
    </div>
    <button className="w-full mt-4 py-2 border border-outline-variant rounded-lg text-on-surface-variant font-label-md hover:bg-surface-container-high transition-colors">
                    {p("alerts.viewAll")}
                </button>
    </section>
    </div>
    </div>
    </div></main>
  );
}
