import { useI18n } from "../../i18n";
import InterpolatedText from "../../components/InterpolatedText";

/*
 * The audit log the officer sees. Rows are demo fixtures -- the real feed is a
 * backend endpoint that does not exist yet -- but they are shaped exactly like
 * the API's audit rows: ISO timestamps, English domain values in `action` /
 * `role`, and a `detail` object naming a template in the page catalog. Nothing
 * here is a pre-formatted display string, so the whole table re-renders in the
 * chosen language without touching the data.
 *
 * `role` / `action`: `{ domain: "..." }` means a registry value that goes
 * through label(); `{ key: "..." }` means a page-catalog key.
 */
const ENTRIES = [
  {
    id: "M-2026-018",
    timestamp: "2023-10-24T10:45:22+05:30",
    actor: "K. Sharma",
    role: { domain: "Revenue Officer" },
    origin: { key: "ip", vars: { address: "192.168.1.45" } },
    action: { domain: "Mutation Approved" },
    dotClass: "bg-secondary",
    target: { text: "M-2026-018" },
    detail: {
      kind: "statusChange",
      domain: "mutation_status",
      from: "Pending",
      to: "Approved",
    },
    verification: "signed",
  },
  {
    id: "P-1024",
    timestamp: "2023-10-24T09:12:04+05:30",
    actor: "NAKSHA GIS",
    actorIcon: "smart_toy",
    role: { key: "systemAutomated" },
    origin: { key: "node", vars: { name: "GIS-SYNC-04" } },
    action: { key: "discrepancyDetected" },
    dotClass: "bg-error animate-pulse",
    flagged: true,
    target: { key: "parcel", vars: { id: "P-1024" } },
    detail: { kind: "areaMismatch", previous: 2, next: 2.18 },
    verification: "chainVerified",
  },
  {
    id: "D-7729",
    timestamp: "2023-10-23T16:30:00+05:30",
    actor: "A. Patel",
    role: { key: "documentVerifier" },
    origin: { key: "ip", vars: { address: "10.0.4.22" } },
    action: { domain: "Document Uploaded" },
    dotClass: "bg-primary-fixed-dim",
    target: { key: "deed", vars: { id: "D-7729" } },
    detail: { kind: "documentAttached" },
    verification: "signed",
  },
  {
    id: "SYS-BKP-Daily",
    timestamp: "2023-10-23T14:05:11+05:30",
    actor: "System",
    role: { key: "automatedTask" },
    origin: { key: "node", vars: { name: "DB-MAINT-01" } },
    action: { key: "backupCompleted" },
    dotClass: "bg-outline-variant",
    target: { text: "SYS-BKP-Daily" },
    detail: { kind: "backupCompleted", size: "4.2 TB" },
    verification: "chainVerified",
  },
];

const DATE_ONLY = { day: "numeric", month: "short", year: "numeric" };
const TIME_ONLY = { timeStyle: "long", timeZone: "Asia/Kolkata" };
const TWO_DECIMALS = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

const FILTER_GROUPS = [
  { label: "dateRange", options: ["allDates", "last24Hours", "last7Days", "last30Days"] },
  { label: "actor", options: ["allActors", "revenueOfficers", "citizens", "systemAutomated"] },
  {
    label: "category",
    options: ["allCategories", "administrative", "geospatial", "document", "system"],
  },
];

/*
 * Renders one translated template with its {{placeholders}} replaced by styled
 * spans -- see components/InterpolatedText.jsx for why the sentence is kept
 * whole instead of being glued together from two t() calls.
 */

export default function AuditTrail() {
  const { t, label, formatDate, formatNumber } = useI18n();

  const p = (key, vars) => t(`pages.auditTrail.${key}`, vars);
  const actionText = (action) =>
    action.domain ? label("action_type", action.domain) : p(`events.${action.key}`);
  const roleText = (role) =>
    role.domain ? label("actor_role", role.domain) : p(`roles.${role.key}`);
  const targetText = (target) =>
    target.text ? target.text : p(`target.${target.key}`, target.vars);
  const hectares = (value) =>
    `${formatNumber(value, TWO_DECIMALS)} ${t("common.units.hectare")}`;

  // The one row whose detail is a two-value comparison gets the grid; the rest
  // are a single sentence.
  const renderDetail = (detail) => {
    if (detail.kind === "statusChange") {
      return (
        <div
          className="text-on-surface truncate"
          title={p("detail.statusChange", {
            from: label(detail.domain, detail.from),
            to: label(detail.domain, detail.to),
          })}
        >
          <InterpolatedText
            template={p("detail.statusChange")}
            values={{
              from: {
                text: label(detail.domain, detail.from),
                className: "line-through text-on-surface-variant",
              },
              to: {
                text: label(detail.domain, detail.to),
                className: "font-medium text-primary",
              },
            }}
          />
        </div>
      );
    }

    if (detail.kind === "areaMismatch") {
      return (
        <>
          <div className="text-on-surface mb-2 font-medium">{p("detail.areaMismatch")}</div>
          <div className="grid grid-cols-2 gap-2 text-[11px] bg-surface-container-lowest p-2 rounded border border-outline-variant/20">
            <div>
              <span className="text-on-surface-variant block mb-0.5">
                {p("detail.previousValue")}
              </span>
              <span className="font-tabular-nums text-on-surface font-medium">
                {hectares(detail.previous)}
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant block mb-0.5">
                {p("detail.newValue")}
              </span>
              <span className="font-tabular-nums text-error font-medium">
                {hectares(detail.next)}
              </span>
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="text-on-surface truncate">
        {p(`detail.${detail.kind}`, { size: detail.size })}
      </div>
    );
  };

  return (
    <main className="w-full pt-16 bg-surface min-h-screen"><div className="flex flex-col w-full h-full pb-16">
    <div className="px-margin-mobile lg:px-margin-desktop py-8 max-w-7xl mx-auto w-full flex-grow">
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
    <div>
    <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">{p("title")}</h1>
    <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">{p("intro")}</p>
    </div>
    <div className="flex gap-3">
    <button className="bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md text-label-md px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
    <span className="material-symbols-outlined text-[18px]">download</span> {p("exportLog")}
            </button>
    <button className="bg-primary hover:bg-primary/90 text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
    <span className="material-symbols-outlined text-[18px]">verified_user</span> {p("verifyChain")}
            </button>
    </div>
    </header>
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border-none mb-6">
    <div className="p-4 border-b border-outline-variant/30 flex flex-col lg:flex-row gap-4 items-center justify-between">
    <div className="relative w-full lg:w-96">
    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
    <input className="w-full bg-surface-container pl-10 pr-4 py-2 rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder={p("searchPlaceholder")} aria-label={p("searchPlaceholder")} type="text" />
    </div>
    <div className="flex flex-wrap gap-3 w-full lg:w-auto">
    {FILTER_GROUPS.map((group) => (
    <div className="relative" key={group.label}>
    <select className="appearance-none bg-surface-container pl-4 pr-10 py-2 rounded-lg font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer" aria-label={p(`filters.${group.label}`)}>
    {group.options.map((option) => (
    <option key={option} value={option}>{p(`filters.${option}`)}</option>
    ))}
    </select>
    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
    </div>
    ))}
    </div>
    </div>
    <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
    <thead>
    <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
    <th className="py-3 px-4 font-semibold whitespace-nowrap">{p("columns.timestamp")}</th>
    <th className="py-3 px-4 font-semibold">{p("columns.actor")}</th>
    <th className="py-3 px-4 font-semibold">{p("columns.actionTarget")}</th>
    <th className="py-3 px-4 font-semibold">{p("columns.changeDetail")}</th>
    <th className="py-3 px-4 font-semibold text-right">{p("columns.verification")}</th>
    </tr>
    </thead>
    <tbody className="font-body-sm text-body-sm align-top">
    {ENTRIES.map((entry) => (
    <tr key={entry.id} className={entry.flagged
      ? "border-b border-outline-variant/20 bg-error-container/10 hover:bg-error-container/20 transition-colors group relative"
      : "border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors group"}>
    <td className={`py-4 px-4 whitespace-nowrap${entry.flagged ? " border-l-2 border-error" : ""}`}>
    <div className="font-tabular-nums text-on-surface">{formatDate(entry.timestamp, DATE_ONLY)}</div>
    <div className="font-tabular-nums text-on-surface-variant text-[11px] mt-1">{formatDate(entry.timestamp, TIME_ONLY)}</div>
    </td>
    <td className="py-4 px-4">
    <div className="font-medium text-on-surface flex items-center gap-1">
    {entry.actorIcon && <span className="material-symbols-outlined text-[14px] text-error">{entry.actorIcon}</span>}
    {entry.actor}
    </div>
    <div className="text-on-surface-variant text-[11px] mt-1">{roleText(entry.role)}</div>
    <div className="font-tabular-nums text-on-surface-variant text-[10px] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">{p(`origin.${entry.origin.key}`, entry.origin.vars)}</div>
    </td>
    <td className="py-4 px-4">
    <div className="flex items-center gap-2 mb-1">
    <span className={`w-2 h-2 rounded-full ${entry.dotClass}`}></span>
    <span className={entry.flagged ? "font-medium text-on-error-container" : "font-medium text-on-surface"}>{actionText(entry.action)}</span>
    </div>
    <div className="font-tabular-nums text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded text-[11px] inline-block">{targetText(entry.target)}</div>
    </td>
    <td className={`py-4 px-4 ${entry.flagged ? "max-w-md" : "max-w-xs"}`}>
    {renderDetail(entry.detail)}
    </td>
    <td className="py-4 px-4 text-right">
    <div className="inline-flex items-center gap-1 bg-surface-container px-2 py-1 rounded text-[10px] font-label-md text-on-surface-variant">
    <span className="material-symbols-outlined text-[14px]">{entry.verification === "signed" ? "vpn_key" : "link"}</span> {p(`verification.${entry.verification}`)}
                    </div>
    </td>
    </tr>
    ))}
    </tbody>
    </table>
    </div>
    <div className="p-4 border-t border-outline-variant/30 flex items-center justify-between">
    <span className="font-body-sm text-body-sm text-on-surface-variant">{t("common.state.showingRange", { from: formatNumber(1), to: formatNumber(ENTRIES.length), total: formatNumber(1248) })}</span>
    <div className="flex gap-1">
    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant disabled:opacity-50" disabled aria-label={p("pagination.previousPage")}><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
    {[1, 2, 3].map((page) => (
    <button key={page} className={page === 1
      ? "w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-label-md text-label-md"
      : "w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant font-label-md text-label-md"}
      aria-label={p("pagination.goToPage", { page: formatNumber(page) })} aria-current={page === 1 ? "page" : undefined}>{formatNumber(page)}</button>
    ))}
    <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant" title={p("pagination.morePages")}>…</span>
    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant" aria-label={p("pagination.nextPage")}><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
    </div>
    </div>
    </div>
    </div>
    </div></main>
  );
}
