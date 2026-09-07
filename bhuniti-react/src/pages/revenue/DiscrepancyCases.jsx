/*
 * The revenue officer's discrepancy register: the case list on the left, the
 * selected case's dossier on the right.
 *
 * Both the breadcrumb chip and the h1 badge announced "14 Action Required"
 * above a table of four cases, and neither number moved when a tab filtered the
 * list; the five tabs themselves carried no counts at all. Every figure is now
 * counted from the caseload, and the "Filter" button -- which flipped a
 * `filterOpen` boolean nothing ever read -- opens a severity filter that really
 * does narrow the rows.
 *
 * Each row was a clickable div wrapping a nested chevron button, so the row
 * could not be reached from the keyboard and the one control it did contain did
 * nothing. The row is now the button and the chevron is decoration. The mobile
 * dismiss backdrop was a bare clickable div as well.
 *
 * The dossier held its measurements twice over: a `variance` field reading
 * "65.50 sq.m (5.5%)" that was never rendered, and the same two figures typed
 * again inside the English `variance_note` prose. Areas are numbers now, the
 * variance and its percentage are computed from them, and the notes take the
 * figures as placeholders. The three-step progress bar was fixed markup whatever
 * the case, so its stages are derived from the case status.
 *
 * Case types and statuses were free text invented here ("Area Mismatch (over
 * 5%)", "Ownership Dispute") rather than the vocabulary the API serves; they now
 * use domain.discrepancy_type and domain.discrepancy_status, with the four
 * states only this demo caseload needs registered in
 * tools/gen_domain_catalog.py.
 *
 * Smaller repairs: React does not pass `patternunits` through (`patternUnits`);
 * `animate-in`, `animate-spin-slow`, `no-scrollbar`, `custom-scrollbar` and
 * `backdrop-blur-xs` are not classes this Tailwind 3 build generates -- there is
 * no animation plugin and no such keyframes -- and a spinner over a "Legal Hold"
 * gavel was misleading anyway; the icon-only buttons carried a `title` tooltip
 * in place of an accessible name; the breadcrumb used a bare anchor that reloads
 * the whole SPA; the toast had no live region and its timer was never cleared,
 * so a message raised just before unmount set state on a dead component; and the
 * modal was a plain div with no dialog role, no Escape key and no way out by
 * clicking the backdrop.
 */

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { REVENUE_ROUTES } from "../../routes";

const TOAST_MS = 3500;

/*
 * `type`, `status` and `severity` hold the exact English domain values, so
 * label() renders them in either locale. Areas are numbers in square metres --
 * the variance, its percentage and the tolerance verdict are all derived from
 * them. `noteVars` carries the identifiers a note quotes that no measurement can
 * produce.
 */
const CASES = [
  {
    key: "d1024",
    id: "D-1024",
    parcelId: "P-1024",
    type: "Area Mismatch",
    category: "area",
    severity: "High",
    status: "In Review",
    statusIcon: "sync",
    gisArea: 1245.5,
    rorArea: 1180,
    tolerancePercent: 2,
    reportedOn: "2026-08-28",
    lat: 28.835,
    lng: 77.5825,
    documents: [
      { name: "Original_RoR_Scan_1998.pdf", kind: "pdf", uploadedDaysAgo: 2, sizeKb: 1229 },
      { name: "Field_Sketch_Map.jpg", kind: "image", systemGenerated: true, sizeKb: 345 },
    ],
  },
  {
    key: "d1025",
    id: "D-1025",
    parcelId: "P-2281",
    type: "Boundary Overlap",
    category: "boundary",
    severity: "Medium",
    status: "Pending Evidence",
    statusIcon: "assignment_late",
    gisArea: 2410,
    rorArea: 2380,
    tolerancePercent: 2,
    reportedOn: "2026-08-27",
    lat: 28.8372,
    lng: 77.5825,
    // Measured along the western edge, so it is not a function of the two areas.
    overlapMetres: 1.4,
    noteVars: { survey: "142/C" },
    documents: [
      { name: "Boundary_DGPS_Survey.pdf", kind: "pdf", uploadedDaysAgo: 3, sizeKb: 2458 },
    ],
  },
  {
    key: "d1026",
    id: "D-1026",
    parcelId: "P-0933",
    type: "Ownership Conflict",
    category: "ownership",
    severity: "High",
    status: "Legal Hold",
    statusIcon: "gavel",
    gisArea: 14680,
    rorArea: 12500,
    tolerancePercent: 2,
    reportedOn: "2026-08-26",
    lat: 28.8327,
    lng: 77.5837,
    noteVars: { mutation: "M-2026-018" },
    documents: [
      { name: "Sub_Registrar_Injunction_Order.pdf", kind: "pdf", uploadedDaysAgo: 1, sizeKb: 890 },
      { name: "Khatauni_Copy_2026.pdf", kind: "pdf", uploadedDaysAgo: 4, sizeKb: 1126 },
    ],
  },
  {
    key: "d1027",
    id: "D-1027",
    parcelId: "P-5542",
    type: "Missing Survey Point",
    category: "boundary",
    severity: "Low",
    status: "Assigned Surveyor",
    statusIcon: "person_search",
    gisArea: 3200,
    rorArea: 3200,
    tolerancePercent: 2,
    reportedOn: "2026-08-25",
    lat: 28.835,
    lng: 77.588,
    noteVars: { benchmark: "BM-44" },
    documents: [
      { name: "CORS_Reference_Log.csv", kind: "sheet", uploadedDaysAgo: 5, sizeKb: 120 },
    ],
  },
];

// The order the "New case" form offers, and the only types this register knows.
const DISCREPANCY_TYPES = [
  "Area Mismatch",
  "Boundary Overlap",
  "Ownership Conflict",
  "Missing Survey Point",
];

const SEVERITIES = ["High", "Medium", "Low"];

const SEVERITY_STYLE = {
  High: {
    icon: "text-error",
    dot: "bg-error-container border-error",
    badge: "bg-error/10 text-error border-error/20",
  },
  Medium: {
    icon: "text-on-tertiary-fixed-variant",
    dot: "bg-tertiary-fixed border-tertiary-fixed-dim",
    badge:
      "bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant border-on-tertiary-fixed-variant/20",
  },
  Low: {
    icon: "text-on-surface-variant",
    dot: "bg-surface-variant border-outline",
    badge: "bg-surface-variant text-on-surface-variant border-outline-variant/30",
  },
};

const TABS = [
  { key: "all", match: () => true },
  { key: "high", match: (item) => item.severity === "High" },
  { key: "area", match: (item) => item.category === "area" },
  { key: "boundary", match: (item) => item.category === "boundary" },
  { key: "ownership", match: (item) => item.category === "ownership" },
];

/*
 * The stepper drew Reported as done and Review as current no matter which case
 * was open. The stage is a function of the status instead, which is the only
 * thing that actually moves.
 */
const STEPS = ["reported", "review", "resolution"];
const STAGE_BY_STATUS = {
  Open: 1,
  "In Review": 2,
  "Pending Evidence": 2,
  "Assigned Surveyor": 2,
  "Legal Hold": 2,
  Resolved: 3,
  Dismissed: 3,
};

const DOC_ICON = { image: "image", sheet: "table_view", pdf: "description" };

// A file listed in kilobytes past this point reads better in megabytes.
const KB_PER_MB = 1024;

export default function DiscrepancyCases() {
  const { t, label, formatNumber, formatDate } = useI18n();
  const p = (key, vars) => t(`pages.discrepancyCases.${key}`, vars);

  const [activeTab, setActiveTab] = useState("all");
  const [severities, setSeverities] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(CASES[0].id);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ parcel: "", type: DISCREPANCY_TYPES[0], observation: "" });
  const [note, setNote] = useState("");
  // Held as an object so raising the same message twice restarts the timer.
  const [toast, setToast] = useState(null);
  const showToast = (text) => setToast({ text, at: Date.now() });

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!modalOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  const sqm = (value) =>
    `${formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${t("common.units.sqm")}`;
  const percent = (value) =>
    `${formatNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}${t("common.units.percent")}`;
  const fileSize = (sizeKb) =>
    sizeKb >= KB_PER_MB
      ? `${formatNumber(sizeKb / KB_PER_MB, { maximumFractionDigits: 1 })} ${t("common.units.megabyte")}`
      : `${formatNumber(sizeKb)} ${t("common.units.kilobyte")}`;

  const variance = (item) => Math.abs(item.gisArea - item.rorArea);
  const variancePercent = (item) =>
    item.rorArea === 0 ? 0 : (variance(item) / item.rorArea) * 100;
  const exceedsTolerance = (item) => variancePercent(item) > item.tolerancePercent;

  // The note quotes the derived measurements, so they are supplied on every case
  // and the fixture only adds what it alone knows.
  const noteVars = (item) => ({
    area: sqm(variance(item)),
    percent: percent(variancePercent(item)),
    tolerance: percent(item.tolerancePercent),
    ...(item.overlapMetres
      ? {
          overlap: `${formatNumber(item.overlapMetres, { maximumFractionDigits: 1 })} ${t("common.units.metre")}`,
        }
      : {}),
    ...(item.noteVars ?? {}),
  });

  const documentMeta = (doc) => {
    const origin = doc.systemGenerated
      ? p("evidence.systemGenerated")
      : p("evidence.uploaded", {
          when:
            doc.uploadedDaysAgo === 1
              ? t("common.time.yesterday")
              : t("common.time.daysAgo", { count: doc.uploadedDaysAgo }),
        });
    return p("evidence.meta", { origin, size: fileSize(doc.sizeKb) });
  };

  const tabCounts = useMemo(
    () => Object.fromEntries(TABS.map((tab) => [tab.key, CASES.filter(tab.match).length])),
    [],
  );
  const severityCounts = useMemo(
    () =>
      Object.fromEntries(
        SEVERITIES.map((value) => [value, CASES.filter((item) => item.severity === value).length]),
      ),
    [],
  );

  const rows = useMemo(() => {
    const tab = TABS.find((entry) => entry.key === activeTab) ?? TABS[0];
    return CASES.filter(tab.match).filter(
      (item) => severities.length === 0 || severities.includes(item.severity),
    );
  }, [activeTab, severities]);

  const selected = CASES.find((item) => item.id === selectedId) ?? null;
  // The original markup drew the same three-dot bar for every case; the stage
  // now follows the case status so one field drives both.
  const stage = selected ? STAGE_BY_STATUS[selected.status] ?? 1 : 1;

  const toggleSeverity = (value) =>
    setSeverities((current) =>
      current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value],
    );

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.parcel.trim()) return;
    // Nothing is persisted, so the reference only has to look like one.
    const ref = `D-${1000 + Math.floor(Math.random() * 9000)}`;
    showToast(p("toast.created", { ref, parcel: form.parcel.trim() }));
    setModalOpen(false);
    setForm({ parcel: "", type: DISCREPANCY_TYPES[0], observation: "" });
  }

  return (
    <main className="relative pt-16 min-h-screen bg-background flex flex-col">
      <nav
        className="px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-outline-variant/20 bg-surface font-label-md text-label-md text-on-surface-variant"
        aria-label={t("common.a11y.breadcrumb")}
      >
        <span className="flex items-center gap-2">
          <Link className="hover:text-primary transition-colors" to={REVENUE_ROUTES.overview}>
            {t("common.portals.revenue")}
          </Link>
          <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
            chevron_right
          </span>
          <span className="text-on-surface font-semibold" aria-current="page">
            {p("breadcrumb")}
          </span>
        </span>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-error font-bold bg-error-container/30 px-2.5 py-1 rounded-full">
          <span aria-hidden="true" className="w-2 h-2 rounded-full bg-error animate-pulse" />
          {p("actionRequired", { count: severityCounts.High })}
        </span>
      </nav>

      <div className="flex-1 flex flex-col w-full relative overflow-hidden bg-background">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-error-container/20 blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-fixed/20 blur-[150px]" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* patternUnits, not patternunits -- React forwards the DOM name. */}
              <pattern height="40" id="grid-pattern" patternUnits="userSpaceOnUse" width="40">
                <path
                  className="text-on-background"
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect fill="url(#grid-pattern)" height="100%" width="100%" />
          </svg>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row w-full relative z-10 overflow-hidden">
          <div className="flex-1 flex flex-col h-full bg-surface/60 backdrop-blur-md relative shadow-[4px_0_24px_rgba(11,28,48,0.03)] z-20 overflow-y-auto">
            <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 flex flex-col gap-5 sticky top-0 bg-surface/95 backdrop-blur-xl z-30 border-b border-outline-variant/20">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface mb-1 flex items-center gap-3 flex-wrap">
                    {p("title")}
                    <span className="inline-flex items-center bg-error/10 text-error rounded-full px-3 py-0.5 font-label-md text-xs font-bold">
                      {p("actionRequired", { count: severityCounts.High })}
                    </span>
                  </h1>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                    {p("intro")}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="relative">
                    <button
                      type="button"
                      aria-expanded={filterOpen}
                      onClick={() => setFilterOpen(!filterOpen)}
                      className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest transition-colors rounded-xl font-label-md text-xs font-bold text-on-surface border border-outline-variant/30 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                        filter_list
                      </span>
                      {t("common.actions.filter")}
                      {severities.length > 0 ? (
                        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-on-primary text-[10px]">
                          {formatNumber(severities.length)}
                        </span>
                      ) : null}
                    </button>
                    {filterOpen ? (
                      <div
                        role="group"
                        aria-label={p("toolbar.filterHeading")}
                        className="absolute right-0 top-full mt-2 w-60 p-3 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 z-40 flex flex-col gap-1"
                      >
                        <p className="font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant px-1 pb-1">
                          {p("toolbar.filterHeading")}
                        </p>
                        {SEVERITIES.map((value) => (
                          <label
                            key={value}
                            className="flex items-center gap-2 px-1 py-1.5 rounded-lg hover:bg-surface-container font-body-sm text-xs text-on-surface cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={severities.includes(value)}
                              onChange={() => toggleSeverity(value)}
                              className="accent-primary"
                            />
                            {p("toolbar.filterCount", {
                              label: label("severity", value),
                              count: formatNumber(severityCounts[value]),
                            })}
                          </label>
                        ))}
                        <button
                          type="button"
                          onClick={() => setSeverities([])}
                          className="mt-1 px-1 py-1 text-left font-label-md text-xs font-bold text-primary hover:underline"
                        >
                          {t("common.actions.clearFilters")}
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-primary text-on-primary hover:bg-primary/90 transition-colors rounded-xl font-label-md text-xs font-bold shadow-md shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                      add
                    </span>
                    {p("toolbar.newCase")}
                  </button>
                </div>
              </div>

              <div
                role="tablist"
                aria-label={p("title")}
                className="flex items-center gap-1 overflow-x-auto pb-1 border-b-2 border-surface-container-high"
              >
                {TABS.map((tab) => {
                  const active = tab.key === activeTab;
                  const danger = tab.key === "high";
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      id={`tab-${tab.key}`}
                      aria-selected={active}
                      aria-controls="case-list"
                      onClick={() => setActiveTab(tab.key)}
                      className={`relative px-4 py-2 font-label-md text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t ${
                        danger
                          ? active
                            ? "text-error"
                            : "text-error/80 hover:text-error"
                          : active
                          ? "text-primary"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {danger ? (
                        <span
                          aria-hidden="true"
                          className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"
                        />
                      ) : null}
                      {p("tabs.withCount", {
                        label: p(`tabs.${tab.key}`),
                        count: formatNumber(tabCounts[tab.key]),
                      })}
                      {active ? (
                        <span
                          aria-hidden="true"
                          className={`absolute bottom-[-2px] left-0 w-full h-[2px] rounded-t-full ${
                            danger ? "bg-error" : "bg-primary"
                          }`}
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              id="case-list"
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
              className="flex-1 px-4 sm:px-8 py-6 space-y-2.5"
            >
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 bg-surface-container-low rounded-xl font-label-md text-[11px] font-bold text-on-surface-variant uppercase tracking-wider shadow-sm border border-outline-variant/20">
                <span className="col-span-2">{t("common.fields.caseId")}</span>
                <span className="col-span-2">{t("common.fields.parcelId")}</span>
                <span className="col-span-3">{p("table.issueType")}</span>
                <span className="col-span-2">{t("common.fields.severity")}</span>
                <span className="col-span-2">{t("common.fields.status")}</span>
                <span className="col-span-1 text-right">{t("common.fields.action")}</span>
              </div>

              {rows.map((item) => {
                const active = item.id === selectedId;
                const tone = SEVERITY_STYLE[item.severity] ?? SEVERITY_STYLE.Low;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    aria-label={p("table.rowSummary", {
                      id: item.id,
                      parcel: item.parcelId,
                      type: label("discrepancy_type", item.type),
                      severity: label("severity", item.severity),
                      status: label("discrepancy_status", item.status),
                    })}
                    onClick={() => setSelectedId(item.id)}
                    className={`group w-full grid grid-cols-12 gap-2 sm:gap-4 px-4 py-3.5 rounded-xl items-center text-left transition-all duration-200 relative overflow-hidden border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      active
                        ? "bg-primary-fixed/30 border-primary/50 shadow-md shadow-primary/5"
                        : "bg-surface hover:bg-surface-container-low hover:border-primary/40 hover:shadow-md border-outline-variant/30"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-0 bottom-0 w-1.5 bg-primary transition-opacity duration-200 ${
                        active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    />
                    <span className="col-span-6 md:col-span-2 font-tabular-nums text-xs font-bold text-on-surface flex items-center gap-2">
                      {/* The severity is what the icon is coloured by, and the
                          row's aria-label spells it out. */}
                      <span
                        aria-hidden="true"
                        className={`material-symbols-outlined text-[18px] ${tone.icon}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        warning
                      </span>
                      <span className="group-hover:text-primary transition-colors">{item.id}</span>
                    </span>

                    <span className="col-span-6 md:col-span-2 font-tabular-nums text-xs font-semibold text-on-surface-variant group-hover:text-primary transition-colors text-right md:text-left">
                      {item.parcelId}
                    </span>

                    <span className="col-span-12 md:col-span-3 font-body-sm text-xs text-on-surface flex items-center gap-2 font-medium mt-1 md:mt-0">
                      <span aria-hidden="true" className={`w-2 h-2 rounded-full border shrink-0 ${tone.dot}`} />
                      <span className="truncate">{label("discrepancy_type", item.type)}</span>
                    </span>

                    <span className="col-span-4 md:col-span-2 mt-1 md:mt-0">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded font-label-md text-[10px] font-bold uppercase tracking-wider border ${tone.badge}`}
                      >
                        {label("severity", item.severity)}
                      </span>
                    </span>

                    <span className="col-span-6 md:col-span-2 mt-1 md:mt-0 min-w-0">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-surface-container text-on-surface-variant rounded-full font-label-md text-[11px] font-semibold border border-outline-variant/30 max-w-full">
                        <span aria-hidden="true" className="material-symbols-outlined text-[13px] shrink-0">
                          {item.statusIcon}
                        </span>
                        <span className="truncate">{label("discrepancy_status", item.status)}</span>
                      </span>
                    </span>

                    <span className="col-span-2 md:col-span-1 text-right mt-1 md:mt-0">
                      {/* Was a nested <button> inside the row's click handler: two
                          controls, one of them dead. */}
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-all group-hover:translate-x-1"
                      >
                        {active ? "check_circle" : "chevron_right"}
                      </span>
                    </span>
                  </button>
                );
              })}

              {rows.length === 0 ? (
                <p className="py-12 text-center font-body-md text-sm text-on-surface-variant">
                  {t("common.state.noResults")}
                </p>
              ) : null}
            </div>
          </div>

          {/* Dismisses the sheet on a phone, where the dossier covers the list.
              It was a bare <div onClick>, so it existed for pointers only. */}
          {selected ? (
            <button
              type="button"
              aria-label={p("details.close")}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
          ) : null}

          <div
            className={`w-full sm:w-[480px] lg:w-[440px] xl:w-[490px] 2xl:w-[540px] shrink-0 h-full bg-surface-bright shadow-2xl lg:shadow-xl z-50 lg:z-30 flex-col transition-all duration-300 border-l border-outline-variant/30 overflow-hidden fixed inset-y-0 right-0 lg:static ${
              selected ? "translate-x-0 opacity-100 flex" : "translate-x-full lg:translate-x-0 hidden lg:flex"
            }`}
          >
            {selected ? (
              <div className="flex-1 flex flex-col h-full overflow-y-auto p-3 sm:p-4 gap-3.5">
                <div className="p-5 sm:p-6 bg-primary-container text-on-primary-container rounded-2xl border border-white/10 relative overflow-hidden shrink-0 shadow-md">
                  <div
                    aria-hidden="true"
                    className="absolute -right-12 -top-12 w-48 h-48 bg-primary-fixed/10 rounded-full blur-2xl pointer-events-none"
                  />

                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={p("details.close")}
                        onClick={() => setSelectedId(null)}
                        className="text-on-primary-container hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 -ml-2"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
                          close
                        </span>
                      </button>
                      <span className="font-label-md text-[11px] uppercase tracking-widest text-primary-fixed-dim font-bold">
                        {p("details.eyebrow")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label={p("details.print")}
                        onClick={() => showToast(p("toast.printing", { id: selected.id }))}
                        className="text-on-primary-container hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                          print
                        </span>
                      </button>
                      <button
                        type="button"
                        aria-label={p("details.export")}
                        onClick={() => showToast(p("toast.exporting", { id: selected.id }))}
                        className="text-on-primary-container hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                          download
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col gap-1 mt-1">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight font-tabular-nums">
                      {selected.id}
                    </h2>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-body-md text-xs sm:text-sm text-primary-fixed font-semibold">
                        {p("details.parcel", { id: selected.parcelId })}
                      </span>
                      <span aria-hidden="true" className="w-1 h-1 bg-primary-fixed-dim rounded-full" />
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-error/20 text-error-container rounded font-label-md text-[10px] uppercase tracking-wider font-bold">
                        <span
                          aria-hidden="true"
                          className="w-1.5 h-1.5 rounded-full bg-error-container animate-pulse"
                        />
                        {p("details.severityChip", { severity: label("severity", selected.severity) })}
                      </span>
                      <span className="font-label-md text-[10px] text-primary-fixed-dim">
                        {p("details.reported", { date: formatDate(selected.reportedOn) })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3.5 border-t border-white/10 relative z-10">
                    <h3 className="sr-only">{p("workflow.heading")}</h3>
                    <ol className="flex items-center justify-between relative px-2">
                      <li aria-hidden="true" className="absolute top-3 left-6 right-6 h-[2px] z-0">
                        {/* The fill is a child of the track so its width is a
                            straight percentage of the distance between the
                            first and last dot. */}
                        <span className="block w-full h-full bg-white/15">
                          <span
                            className="block h-full bg-primary-fixed transition-all duration-300"
                            style={{ width: `${((stage - 1) / (STEPS.length - 1)) * 100}%` }}
                          />
                        </span>
                      </li>
                      {STEPS.map((step, index) => {
                        const state =
                          index + 1 < stage ? "completed" : index + 1 === stage ? "in_progress" : "pending";
                        return (
                          <li key={step} className="flex flex-col items-center gap-1.5 z-10 relative">
                            <span
                              aria-hidden="true"
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                state === "pending"
                                  ? "bg-primary-fixed-dim/20 border-white/25"
                                  : "bg-primary-fixed border-primary-fixed"
                              }`}
                            >
                              {state === "completed" ? (
                                <span className="material-symbols-rounded text-[14px] text-on-primary-fixed">
                                  check
                                </span>
                              ) : (
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    state === "in_progress"
                                      ? "bg-on-primary-fixed animate-pulse"
                                      : "bg-white/30"
                                  }`}
                                />
                              )}
                            </span>
                            <span
                              aria-hidden="true"
                              className={`font-label-md text-[10px] uppercase tracking-wider ${
                                state === "pending" ? "text-primary-fixed-dim/60" : "text-primary-fixed"
                              }`}
                            >
                              {p(`workflow.${step}`)}
                            </span>
                            {/* The dots and the connector carry no text, so each
                                step's state is spelled out for a screen reader. */}
                            <span className="sr-only">
                              {p("workflow.stepState", {
                                step: p(`workflow.${step}`),
                                state: label("stage_state", state),
                              })}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>

                <section className="bg-surface-container-low rounded-2xl border border-outline-variant/40 p-4 shrink-0">
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-3">
                    <div className="flex flex-col gap-0.5">
                      <dt className="font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant">
                        {p("measurement.gisArea")}
                      </dt>
                      <dd className="font-display text-base font-bold text-on-surface font-tabular-nums">
                        {sqm(selected.gisArea)}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-0.5 sm:items-end">
                      <dt className="font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant">
                        {p("measurement.recordArea")}
                      </dt>
                      <dd className="font-display text-base font-bold text-on-surface font-tabular-nums">
                        {sqm(selected.rorArea)}
                      </dd>
                    </div>
                    <div className="col-span-2 pt-3 border-t border-outline-variant/40 flex items-end justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <dt className="font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant">
                          {p("measurement.variance")}
                        </dt>
                        <dd
                          className={`font-display text-lg font-bold font-tabular-nums ${
                            exceedsTolerance(selected) ? "text-error" : "text-on-surface"
                          }`}
                        >
                          {p("measurement.varianceValue", {
                            area: sqm(variance(selected)),
                            percent: percent(variancePercent(selected)),
                          })}
                        </dd>
                      </div>
                      <div className="flex flex-col gap-0.5 items-end">
                        <dt className="font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant">
                          {p("measurement.tolerance")}
                        </dt>
                        <dd className="font-body-md text-sm font-semibold text-on-surface-variant font-tabular-nums">
                          {percent(selected.tolerancePercent)}
                        </dd>
                      </div>
                    </div>
                  </dl>
                  <p
                    className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-label-md text-[11px] font-bold border ${
                      exceedsTolerance(selected)
                        ? "bg-error/10 text-error border-error/20"
                        : "bg-primary/10 text-primary border-primary/20"
                    }`}
                  >
                    <span aria-hidden="true" className="material-symbols-rounded text-[14px]">
                      {exceedsTolerance(selected) ? "priority_high" : "check_circle"}
                    </span>
                    {exceedsTolerance(selected)
                      ? p("measurement.exceedsTolerance")
                      : p("measurement.withinTolerance")}
                  </p>
                  <p className="mt-3 font-body-md text-[13px] leading-relaxed text-on-surface-variant">
                    {p(`caseNotes.${selected.key}`, noteVars(selected))}
                  </p>
                </section>

                <section className="bg-surface-container-low rounded-2xl border border-outline-variant/40 overflow-hidden shrink-0">
                  <div className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-2.5">
                    <h3 className="font-label-md text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">
                      {p("spatial.heading")}
                    </h3>
                    <span className="font-body-md text-[11px] text-on-surface-variant">
                      {p("spatial.place", {
                        village: t("common.place.village"),
                        tehsil: t("common.place.tehsil"),
                      })}
                    </span>
                  </div>
                  <div className="relative h-44 sm:h-52 mx-3 rounded-xl overflow-hidden border border-outline-variant/40">
                    {/* Stands in for the cadastral tile service, so it is a
                        labelled image rather than a decorative background. */}
                    <div
                      role="img"
                      aria-label={p("spatial.basemap", { id: selected.parcelId })}
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage:
                          'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600")',
                      }}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-scrim/70 via-transparent to-transparent"
                    />
                    <span className="absolute top-2 left-2 px-2 py-1 bg-surface-bright/90 rounded-lg font-label-md text-[10px] font-bold text-on-surface">
                      {p("spatial.layer")}
                    </span>
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      <button
                        type="button"
                        aria-label={p("spatial.zoomIn")}
                        onClick={() => showToast(p("toast.zoomed", { id: selected.parcelId }))}
                        className="w-7 h-7 bg-surface-bright/90 hover:bg-surface-bright rounded-lg flex items-center justify-center text-on-surface shadow-sm transition-colors"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                          add
                        </span>
                      </button>
                      <button
                        type="button"
                        aria-label={p("spatial.zoomOut")}
                        onClick={() => showToast(p("toast.zoomReset", { id: selected.parcelId }))}
                        className="w-7 h-7 bg-surface-bright/90 hover:bg-surface-bright rounded-lg flex items-center justify-center text-on-surface shadow-sm transition-colors"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                          remove
                        </span>
                      </button>
                    </div>
                  </div>
                  <p className="px-4 py-2.5 font-body-md text-[11px] text-on-surface-variant font-tabular-nums">
                    {p("spatial.coordinates", {
                      lat: formatNumber(selected.lat, { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
                      lng: formatNumber(selected.lng, { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
                    })}
                  </p>
                </section>

                <section className="bg-surface-container-low rounded-2xl border border-outline-variant/40 p-4 shrink-0">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <h3 className="font-label-md text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">
                      {p("evidence.heading")}
                    </h3>
                    <button
                      type="button"
                      onClick={() => showToast(p("toast.uploadDialog"))}
                      className="inline-flex items-center gap-1 font-label-md text-[11px] font-bold text-primary hover:underline"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-[15px]">
                        add
                      </span>
                      {p("evidence.add")}
                    </button>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {selected.documents.map((doc) => (
                      <li key={doc.name}>
                        <button
                          type="button"
                          aria-label={p("evidence.open", { name: doc.name })}
                          onClick={() => showToast(p("toast.viewingDocument", { name: doc.name }))}
                          className="w-full flex items-center gap-2.5 p-2 rounded-xl border border-outline-variant/40 bg-surface-bright hover:border-primary/40 hover:bg-primary/5 transition-colors text-left"
                        >
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[20px] text-on-surface-variant shrink-0"
                          >
                            {DOC_ICON[doc.kind] ?? "description"}
                          </span>
                          <span className="flex-1 min-w-0 flex flex-col">
                            <span className="font-body-md text-[13px] font-semibold text-on-surface truncate">
                              {doc.name}
                            </span>
                            <span className="font-label-md text-[10px] text-on-surface-variant">
                              {documentMeta(doc)}
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[18px] text-outline shrink-0"
                          >
                            open_in_new
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="bg-surface-container-low rounded-2xl border border-outline-variant/40 p-4 shrink-0">
                  <h3
                    id="investigation-heading"
                    className="font-label-md text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-2.5"
                  >
                    {p("investigation.heading")}
                  </h3>
                  <textarea
                    aria-label={p("investigation.label", { id: selected.id })}
                    placeholder={p("investigation.placeholder")}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={3}
                    className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-bright font-body-md text-[13px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-y"
                  />
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => showToast(p("toast.uploadDialog"))}
                      className="inline-flex items-center gap-1 font-label-md text-[11px] font-semibold text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-[15px]">
                        attach_file
                      </span>
                      {p("investigation.attach")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNote(p("investigation.template"))}
                      className="font-label-md text-[11px] font-bold text-primary hover:underline"
                    >
                      {p("investigation.insertTemplate")}
                    </button>
                  </div>
                </section>

                <div className="flex flex-col sm:flex-row gap-2 shrink-0 pb-1">
                  <button
                    type="button"
                    onClick={() => showToast(p("toast.resolved", { id: selected.id }))}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-[12px] font-bold hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <span aria-hidden="true" className="material-symbols-rounded text-[17px]">
                      task_alt
                    </span>
                    {p("actions.resolve")}
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast(p("toast.surveyRequested", { id: selected.parcelId }))}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-[12px] font-bold hover:bg-surface-container-highest transition-colors border border-outline-variant/40"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[17px]">
                      straighten
                    </span>
                    {p("actions.requestSurvey")}
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast(p("toast.escalated", { id: selected.id }))}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-transparent text-error font-label-md text-[12px] font-bold hover:bg-error/10 transition-colors border border-error/30"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[17px]">
                      arrow_upward
                    </span>
                    {p("actions.escalate")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-on-surface-variant">
                <span aria-hidden="true" className="material-symbols-outlined text-4xl mb-2 text-outline">
                  description
                </span>
                <p className="font-body-md text-sm font-semibold">{p("details.empty")}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* The backdrop dismisses the dialog, so it is a real button with an
              accessible name rather than a <div onClick>. */}
          <button
            type="button"
            aria-label={t("common.actions.close")}
            onClick={() => setModalOpen(false)}
            className="absolute inset-0 bg-scrim/50 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-case-title"
            className="relative w-full sm:max-w-md bg-surface-bright rounded-t-3xl sm:rounded-2xl border border-outline-variant/40 shadow-2xl p-5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 id="new-case-title" className="font-display text-lg font-bold text-on-surface">
                {p("modal.title")}
              </h2>
              <button
                type="button"
                aria-label={t("common.actions.close")}
                onClick={() => setModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high transition-colors -mr-1 -mt-1"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                  {p("modal.parcel")}
                  <span className="text-error"> *</span>
                </span>
                <input
                  required
                  value={form.parcel}
                  onChange={(event) => setForm((current) => ({ ...current, parcel: event.target.value }))}
                  placeholder={p("modal.parcelPlaceholder")}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface font-body-md text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                  {p("modal.type")}
                </span>
                <select
                  value={form.type}
                  onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface font-body-md text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                >
                  {DISCREPANCY_TYPES.map((value) => (
                    <option key={value} value={value}>
                      {label("discrepancy_type", value)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                  {p("modal.observation")}
                </span>
                <textarea
                  rows={3}
                  value={form.observation}
                  onChange={(event) => setForm((current) => ({ ...current, observation: event.target.value }))}
                  placeholder={p("modal.observationPlaceholder")}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface font-body-md text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-y"
                />
              </label>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-[12px] font-bold hover:bg-surface-container-highest transition-colors"
                >
                  {t("common.actions.cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-[12px] font-bold hover:bg-primary/90 transition-colors shadow-sm"
                >
                  {p("modal.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* One live region for every action on the screen, so the announcement
          does not depend on the toast being visible when it mounts. */}
      <div role="status" aria-live="polite" className="fixed bottom-4 right-4 z-[70] pointer-events-none">
        {toast ? (
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-2xl max-w-xs">
            <span aria-hidden="true" className="material-symbols-rounded text-[18px] text-primary-fixed">
              info
            </span>
            <p className="font-body-md text-[12px] leading-snug">{toast.text}</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
