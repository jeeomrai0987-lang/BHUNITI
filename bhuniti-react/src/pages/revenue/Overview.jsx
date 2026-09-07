/*
 * The revenue officer's dashboard: six KPI counters, the cadastral map with its
 * tehsil and village pickers, the discrepancy action queue and the activity log.
 *
 * The district-overview call already ran on mount, but its result was written to
 * a `dbOverview` state nothing ever read, so the live figures were fetched and
 * thrown away while the cards showed a nested ternary of per-tehsil constants.
 * The response now drives the counters when it arrives -- the endpoint returns a
 * `tehsils` array whose entries carry that jurisdiction's totals -- and the
 * bundled caseload is the fallback, with the offline notice every other screen
 * shows. `verifiedPct` was a hardcoded "89%" beside a `Math.round(total * 0.89)`;
 * one share constant now feeds both, and `toLocaleString("en-IN")` gives way to
 * formatNumber so Hindi groups the same way.
 *
 * Each queue card was a clickable div, so none of the three could be reached
 * from the keyboard; they are buttons now, built from one fixture instead of
 * three near-identical blocks, and their figures are computed from the two areas
 * rather than typed into the prose ("12.50 ha vs 14.68 ha (-2.18 ha)"). The card
 * reference read "CASE P-1026 (ख. 413)" -- Devanagari inside the English UI --
 * which is common.fields.khasra now. "2 hours ago" and its siblings come from
 * common.time.
 *
 * "View All Open Cases" assigned window.location.href, reloading the whole SPA
 * on a route the router already owns; the activity log's "Filter" button had no
 * handler at all and is gone, while "Export Report" now writes a real CSV from
 * the rows on screen. The log's statuses were "COMPLETED" / "NEW" /
 * "IN PROGRESS" in capitals; they are domain labels. The table gained a caption
 * and column scopes, the selects gained labels, and `custom-scrollbar` -- a class
 * this build does not generate -- is dropped.
 */

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ParcelMapViewer from "../../components/ParcelMapViewer";
import { GHAZIABAD_ADMINISTRATIVE_DATA } from "../../data/administrativeDivisions";
import { useI18n } from "../../i18n";
import { MAIN_ROUTES, REVENUE_ROUTES } from "../../routes";
import { api } from "../../services/api";
import { logFallback } from "../../utils/log";

// Share of parcels the demo district has finished verifying. One constant so the
// count and the percentage can never disagree.
const VERIFIED_SHARE = 0.89;

// The caseload the demo carries for the three tehsils that have one, and the
// figures every other tehsil falls back to.
const CASELOAD = {
  Modinagar: { pendingMutations: 156, openDiscrepancies: 42, highPriority: 12, awaitingSurvey: 18 },
  Loni: { pendingMutations: 194, openDiscrepancies: 64, highPriority: 19, awaitingSurvey: 24 },
  "Ghaziabad Sadar": {
    pendingMutations: 218,
    openDiscrepancies: 58,
    highPriority: 16,
    awaitingSurvey: 22,
  },
};
const DEFAULT_CASELOAD = {
  pendingMutations: 112,
  openDiscrepancies: 28,
  highPriority: 7,
  awaitingSurvey: 11,
};

const KPIS = [
  { key: "totalParcels", icon: "map", accent: "border-surface-variant", glow: "bg-surface-variant/20" },
  { key: "verifiedParcels", icon: "verified", accent: "border-primary", glow: "bg-primary-fixed/20", iconTone: "text-primary", showPct: true },
  { key: "pendingMutations", icon: "pending_actions", accent: "border-tertiary-fixed", glow: "bg-tertiary-fixed/20", iconTone: "text-on-tertiary-fixed-variant" },
  { key: "openDiscrepancies", icon: "warning", accent: "border-error", glow: "bg-error-container/40", iconTone: "text-error" },
  // The one card that inverts, because it is the only figure an officer is
  // expected to act on today.
  { key: "highPriority", icon: "priority_high", emphasis: true },
  { key: "awaitingSurvey", icon: "architecture", accent: "border-secondary", glow: "bg-secondary-fixed/30", iconTone: "text-secondary" },
];

// The three cases the queue shows, with their areas as numbers so the shortfall
// is derived rather than restated.
const QUEUE = [
  {
    ulpin: "09-0824-0014-1026",
    parcelId: "P-1026",
    khasra: "413",
    type: "Area Mismatch",
    note: "areaMismatch",
    owner: "Rajesh Kumar",
    claimedHa: 12.5,
    recordedHa: 14.68,
    mutation: "M-2026-018",
    hoursAgo: 2,
    tone: "text-error bg-error-container/60",
  },
  {
    ulpin: "09-0824-0014-1027",
    parcelId: "P-1027",
    khasra: "414",
    type: "Boundary Overlap",
    note: "roadOverlap",
    owner: "Manoj Tyagi",
    overlapMetres: 1.2,
    hoursAgo: 5,
    tone: "text-on-tertiary-fixed-variant bg-tertiary-fixed/60",
  },
  {
    ulpin: "09-0824-0014-1024",
    parcelId: "P-1024",
    khasra: "412/1",
    type: "Verified",
    typeDomain: "verification_status",
    note: "verified",
    owner: "Rahul Sharma",
    areaHa: 2,
    daysAgo: 1,
    tone: "text-secondary bg-secondary/10",
  },
];

// The last three audit rows. Types and statuses are stored English values that
// the domain catalogs translate; timestamps are ISO so they format per locale.
const ACTIVITY = [
  {
    ref: "MUT-2026-8891",
    type: "Mutation Approved",
    icon: "swap_horiz",
    tone: "text-primary",
    entry: "mutation",
    vars: { ulpin: "09-0824-0014-1024" },
    statusDomain: "stage_state",
    status: "completed",
    statusStyle: "bg-primary-fixed/30 text-on-primary-fixed",
    dot: "bg-primary",
    at: "2026-08-30T14:30:00",
  },
  {
    ref: "DIS-2026-0442",
    type: "Discrepancy Flagged",
    icon: "flag",
    tone: "text-error",
    entry: "discrepancy",
    vars: { survey: "143/A", number: "413" },
    statusDomain: "discrepancy_status",
    status: "Open",
    statusStyle: "bg-error-container text-on-error-container",
    dot: "bg-error",
    at: "2026-08-30T11:15:00",
  },
  {
    ref: "SRV-2026-1102",
    type: "Field Survey Scheduled",
    icon: "architecture",
    tone: "text-secondary",
    entry: "survey",
    vars: { officer: "J. Doe", number: "414" },
    statusDomain: "stage_state",
    status: "in_progress",
    statusStyle: "bg-secondary-fixed/30 text-on-secondary-fixed",
    dot: "bg-secondary",
    at: "2026-08-29T09:45:00",
  },
];

export default function RevenueOverview() {
  const { t, label, formatNumber, formatArea, formatDateTime, locale } = useI18n();
  const p = (key, vars) => t(`pages.revenueOverview.${key}`, vars);

  const [selectedTehsil, setSelectedTehsil] = useState("Modinagar");
  const [selectedVillage, setSelectedVillage] = useState("Sikandrabad");
  const [selectedParcelId, setSelectedParcelId] = useState("09-0824-0014-1024");
  const [overview, setOverview] = useState(null);
  const [offline, setOffline] = useState(false);

  const tehsils = Object.entries(GHAZIABAD_ADMINISTRATIVE_DATA).map(([name, entry]) => ({
    name,
    nameHindi: entry.nameHindi,
  }));
  const villages = GHAZIABAD_ADMINISTRATIVE_DATA[selectedTehsil]?.villages ?? [];

  useEffect(() => {
    let cancelled = false;
    async function loadOverview() {
      try {
        const data = await api.analytics.getDistrictOverview();
        if (!cancelled && data) setOverview(data);
      } catch (error) {
        if (cancelled) return;
        logFallback("revenue district overview", error);
        setOffline(true);
      }
    }
    loadOverview();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleTehsilChange(tehsilName) {
    setSelectedTehsil(tehsilName);
    setSelectedVillage(GHAZIABAD_ADMINISTRATIVE_DATA[tehsilName]?.villages[0]?.name ?? "");
  }

  // The place name in the reading locale, with the English name as the fallback.
  const placeName = (entry) => (locale === "en" ? entry.name : entry.nameHindi || entry.name);

  const metrics = useMemo(() => {
    const bundledTotal = villages.reduce((sum, village) => sum + (village.parcelsCount || 0), 0);
    const caseload = CASELOAD[selectedTehsil] ?? DEFAULT_CASELOAD;
    // The endpoint reports each tehsil separately, so the live row for the
    // selected jurisdiction wins over the bundled fixture.
    const live = overview?.tehsils?.find((entry) => entry.name === selectedTehsil) ?? null;
    const total = live?.total_parcels ?? bundledTotal;
    const verifiedPct = live?.verified_pct ?? VERIFIED_SHARE * 100;
    return {
      totalParcels: total,
      verifiedParcels: Math.round((total * verifiedPct) / 100),
      verifiedPct,
      pendingMutations: live?.pending_mutations ?? caseload.pendingMutations,
      openDiscrepancies: live?.open_discrepancies ?? caseload.openDiscrepancies,
      highPriority: overview?.high_priority_discrepancies ?? caseload.highPriority,
      awaitingSurvey: overview?.scheduled_field_surveys ?? caseload.awaitingSurvey,
    };
  }, [overview, selectedTehsil, villages]);

  const queueVars = (item) => {
    if (item.note === "areaMismatch") {
      return {
        claimed: formatArea(item.claimedHa),
        recorded: formatArea(item.recordedHa),
        difference: formatArea(Math.abs(item.recordedHa - item.claimedHa)),
        mutation: item.mutation,
      };
    }
    if (item.note === "roadOverlap") {
      return {
        overlap: `${formatNumber(item.overlapMetres, { maximumFractionDigits: 1 })} ${t("common.units.metre")}`,
      };
    }
    return { area: formatArea(item.areaHa) };
  };

  const queueWhen = (item) =>
    item.daysAgo
      ? t("common.time.daysAgo", { count: item.daysAgo })
      : t("common.time.hoursAgo", { count: item.hoursAgo });

  const caseRef = (item) =>
    p("queue.caseRef", {
      parcel: item.parcelId,
      khasra: t("common.fields.khasra"),
      number: item.khasra,
    });

  // Built in the browser from the rows on screen, so the button does what it
  // says without a server round trip.
  function exportLog() {
    const header = [p("activity.reference"), p("activity.type"), p("activity.details"), t("common.fields.status"), t("common.fields.timestamp")];
    const rows = ACTIVITY.map((item) => [
      item.ref,
      label("action_type", item.type),
      p(`activity.entries.${item.entry}`, { ...item.vars, khasra: t("common.fields.khasra") }),
      label(item.statusDomain, item.status),
      formatDateTime(item.at),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `bhuniti-activity-${selectedTehsil.toLowerCase().replace(/\s+/g, "-")}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="relative pt-16 min-h-screen bg-background">
      <nav
        aria-label={t("common.a11y.breadcrumb")}
        className="px-6 lg:px-8 py-4 flex items-center gap-2 font-label-md text-xs text-on-surface-variant"
      >
        <Link to={MAIN_ROUTES.home} className="hover:text-primary transition-colors">
          {t("common.app.name")}
        </Link>
        <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
          chevron_right
        </span>
        <span aria-current="page" className="text-on-surface font-semibold">
          {p("breadcrumb")}
        </span>
      </nav>

      <div className="flex flex-col w-full h-full px-6 lg:px-8 pb-8 gap-6 max-w-[1920px] mx-auto">
        <h1 className="sr-only">{p("title")}</h1>
        {offline ? (
          <p
            role="status"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-tertiary-fixed/30 text-on-tertiary-fixed-variant font-body-md text-xs font-semibold"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
              cloud_off
            </span>
            {t("common.state.offline")}
          </p>
        ) : null}

        <section aria-labelledby="kpi-heading">
          <h2 id="kpi-heading" className="sr-only">
            {p("kpi.heading")}
          </h2>
          <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
            {KPIS.map((card) => {
              const value = formatNumber(metrics[card.key]);
              return (
                <div
                  key={card.key}
                  className={`rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow ${
                    card.emphasis
                      ? "bg-error-container text-on-error-container"
                      : `bg-surface border-l-4 ${card.accent}`
                  }`}
                >
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <dt
                      className={`font-label-md text-[11px] uppercase tracking-wider font-bold ${
                        card.emphasis ? "text-on-error-container" : "text-on-surface-variant"
                      }`}
                    >
                      {p(`kpi.${card.key}`)}
                    </dt>
                    <span
                      aria-hidden="true"
                      className={`material-symbols-outlined text-[20px] shrink-0 ${
                        card.emphasis ? "text-on-error-container" : card.iconTone ?? "text-on-surface-variant"
                      }`}
                    >
                      {card.icon}
                    </span>
                  </div>
                  <dd className="flex items-baseline gap-2 flex-wrap">
                    {/* The dt/dd pairing is the accessible name here, so the
                        figure needs no tooltip of its own. */}
                    <span className="font-display text-2xl xl:text-3xl font-bold tracking-tight font-tabular-nums">
                      {value}
                    </span>
                    {card.showPct ? (
                      <span className="inline-flex items-center font-label-md text-[11px] font-bold text-primary bg-primary-fixed/50 px-1.5 py-0.5 rounded">
                        <span aria-hidden="true" className="material-symbols-outlined text-[12px] mr-0.5">
                          arrow_upward
                        </span>
                        {formatNumber(metrics.verifiedPct, { maximumFractionDigits: 0 })}
                        {t("common.units.percent")}
                      </span>
                    ) : null}
                    {card.emphasis ? (
                      <span className="font-body-md text-[11px] font-semibold text-on-error-container/80">
                        {p("kpi.immediateAction")}
                      </span>
                    ) : null}
                  </dd>
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-xl ${
                      card.emphasis ? "bg-error/10" : card.glow
                    }`}
                  />
                </div>
              );
            })}
          </dl>
        </section>

        <div className="flex flex-col lg:flex-row gap-6 h-[640px] xl:h-[720px] w-full">
          <section
            aria-labelledby="map-heading"
            className="flex-1 bg-surface-container rounded-2xl shadow-sm relative overflow-hidden flex flex-col border border-outline-variant/30"
          >
            <div className="px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center bg-surface/95 backdrop-blur-md z-10 border-b border-outline-variant/20 gap-3">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="material-symbols-outlined text-primary">
                  explore
                </span>
                <h2 id="map-heading" className="font-display text-base sm:text-lg text-on-surface font-bold">
                  {p("map.heading")}
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 bg-primary/10 text-primary font-label-md font-bold text-[10px] rounded-full uppercase tracking-wide">
                  {p("map.source")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1 rounded-xl border border-outline-variant/40">
                  <label
                    htmlFor="tehsil-select"
                    className="font-label-md text-[10px] font-bold text-on-surface-variant uppercase"
                  >
                    {p("map.tehsil")}
                  </label>
                  <select
                    id="tehsil-select"
                    value={selectedTehsil}
                    onChange={(event) => handleTehsilChange(event.target.value)}
                    className="bg-transparent font-body-md text-xs font-bold text-on-surface outline-none cursor-pointer"
                  >
                    {tehsils.map((entry) => (
                      <option key={entry.name} value={entry.name}>
                        {p("map.optionWithLocal", {
                          name: placeName(entry),
                          local: locale === "en" ? entry.nameHindi : entry.name,
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1 rounded-xl border border-outline-variant/40">
                  <label
                    htmlFor="village-select"
                    className="font-label-md text-[10px] font-bold text-on-surface-variant uppercase"
                  >
                    {p("map.village")}
                  </label>
                  <select
                    id="village-select"
                    value={selectedVillage}
                    onChange={(event) => setSelectedVillage(event.target.value)}
                    className="bg-transparent font-body-md text-xs font-bold text-on-surface outline-none cursor-pointer max-w-[130px] truncate"
                  >
                    {villages.map((village) => (
                      <option key={village.name} value={village.name}>
                        {p("map.optionWithLocal", {
                          name: placeName(village),
                          local: locale === "en" ? village.nameHindi : village.name,
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full h-full">
              <ParcelMapViewer
                selectedParcelId={selectedParcelId}
                onSelectParcel={(parcel) => setSelectedParcelId(parcel ? parcel.ulpin || parcel.id : null)}
                showControls
              />
            </div>
          </section>

          <section
            aria-labelledby="queue-heading"
            className="w-full lg:w-96 shrink-0 bg-surface rounded-2xl shadow-sm flex flex-col border border-outline-variant/20 relative overflow-hidden"
          >
            <span
              aria-hidden="true"
              className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-error-container/30 to-transparent rounded-bl-full pointer-events-none"
            />
            <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center gap-2 bg-surface relative z-10">
              <h2
                id="queue-heading"
                className="font-display text-base text-on-surface flex items-center gap-2 font-bold"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-error">
                  warning
                </span>
                {p("queue.heading")}
              </h2>
              <span className="bg-error-container text-on-error-container font-label-md px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap">
                {p("queue.highPriorityCount", { count: metrics.highPriority })}
              </span>
            </div>

            <ul className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
              {QUEUE.map((item) => {
                const active = selectedParcelId === item.ulpin;
                const typeLabel = label(item.typeDomain ?? "discrepancy_type", item.type);
                return (
                  <li key={item.ulpin}>
                    <button
                      type="button"
                      aria-pressed={active}
                      aria-label={p("queue.cardSummary", {
                        ref: caseRef(item),
                        type: typeLabel,
                        owner: item.owner,
                        place: p("queue.place", {
                          village: t("common.place.village"),
                          tehsil: t("common.place.tehsil"),
                        }),
                        when: queueWhen(item),
                      })}
                      onClick={() => setSelectedParcelId(item.ulpin)}
                      className={`w-full text-left p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all group border ${
                        active ? "border-primary bg-primary/5 shadow-sm" : "border-outline-variant/30"
                      }`}
                    >
                      <span className="flex justify-between items-start gap-2 mb-1.5">
                        <span className="font-mono text-[11px] font-bold text-on-surface">
                          {caseRef(item)}
                        </span>
                        <span
                          className={`font-label-md text-[10px] font-bold px-2 py-0.5 rounded tracking-wide whitespace-nowrap ${item.tone}`}
                        >
                          {typeLabel}
                        </span>
                      </span>
                      <span className="block font-body-md text-xs text-on-surface font-semibold mb-1">
                        {item.owner}
                      </span>
                      <span className="block font-body-md text-[11px] text-on-surface-variant mb-2 leading-relaxed">
                        {p(`queue.notes.${item.note}`, queueVars(item))}
                      </span>
                      <span className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1 font-label-md text-[10px] text-on-surface-variant font-medium">
                          <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                            schedule
                          </span>
                          {queueWhen(item)}
                        </span>
                        <span
                          aria-hidden="true"
                          className="flex items-center font-label-md text-[11px] font-bold text-primary group-hover:translate-x-1 transition-transform"
                        >
                          {t("common.actions.viewOnMap")}
                          <span className="material-symbols-outlined text-[14px] ml-0.5">
                            arrow_forward
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="p-3 border-t border-outline-variant/20 bg-surface">
              {/* The router owns this route, so it is a Link -- the old handler
                  assigned window.location.href and reloaded the SPA. */}
              <Link
                to={REVENUE_ROUTES.discrepancyCases}
                className="w-full py-2 bg-surface-container hover:bg-surface-variant text-on-surface font-label-md text-xs font-bold rounded-xl transition-colors flex justify-center items-center gap-2"
              >
                {p("queue.viewAll")}
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                  launch
                </span>
              </Link>
            </div>
          </section>
        </div>

        <section
          aria-labelledby="activity-heading"
          className="bg-surface rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center gap-3 bg-surface-container-lowest">
            <h2
              id="activity-heading"
              className="font-display text-base text-on-surface flex items-center gap-2 font-bold"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant">
                history
              </span>
              {p("activity.heading")}
            </h2>
            {/* The "Filter" button beside this one had no handler at all, so it
                is gone rather than left looking operable. */}
            <button
              type="button"
              onClick={exportLog}
              className="px-3 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary/90 transition-colors font-label-md text-xs font-bold shadow-sm inline-flex items-center gap-1.5"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                download
              </span>
              {p("activity.exportCsv")}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <caption className="sr-only">{p("activity.caption")}</caption>
              <thead>
                <tr className="bg-surface-container-low font-label-md text-on-surface-variant uppercase tracking-wider text-[11px] font-bold">
                  <th scope="col" className="px-6 py-4 sticky left-0 bg-surface-container-low w-48">
                    {p("activity.reference")}
                  </th>
                  <th scope="col" className="px-6 py-4">
                    {p("activity.type")}
                  </th>
                  <th scope="col" className="px-6 py-4">
                    {p("activity.details")}
                  </th>
                  <th scope="col" className="px-6 py-4">
                    {t("common.fields.status")}
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    {t("common.fields.timestamp")}
                  </th>
                </tr>
              </thead>
              <tbody className="font-body-md text-xs align-middle">
                {ACTIVITY.map((item) => (
                  <tr
                    key={item.ref}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors"
                  >
                    <th
                      scope="row"
                      className="px-6 py-3 font-mono text-on-surface sticky left-0 bg-surface font-bold text-left"
                    >
                      {item.ref}
                    </th>
                    <td className="px-6 py-3">
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={`material-symbols-outlined text-[18px] ${item.tone}`}
                        >
                          {item.icon}
                        </span>
                        <span className="text-on-surface font-semibold">
                          {label("action_type", item.type)}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-3 text-on-surface-variant max-w-xs">
                      {p(`activity.entries.${item.entry}`, {
                        ...item.vars,
                        khasra: t("common.fields.khasra"),
                      })}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-md text-[11px] font-bold ${item.statusStyle}`}
                      >
                        <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                        {label(item.statusDomain, item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right text-on-surface-variant font-tabular-nums font-medium whitespace-nowrap">
                      {formatDateTime(item.at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
