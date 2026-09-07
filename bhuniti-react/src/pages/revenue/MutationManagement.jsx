import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { MAIN_ROUTES, REVENUE_ROUTES } from "../../routes";
import { api } from "../../services/api";
import { logFallback } from "../../utils/log";

/*
 * Mutation queue for the revenue officer.
 *
 * Three things were wrong beyond the missing translations. The queue was fetched
 * and then discarded -- `mutations` was written to state and never rendered, so
 * only the first row could ever be decided and the rest of the tehsil's cases
 * were invisible. The offline fixture described parcel "P-1024" while quoting the
 * 12.50 / 14.68 ha figures that belong to ULPIN 09-0824-0014-1026 elsewhere in
 * the build, and its submission date was the pre-formatted string "Oct 12, 2023",
 * which no locale could reformat. And both failure paths went to console.log,
 * one of them announcing the storage vendor to the officer.
 */

const FALLBACK_STATS = {
  pending_count: 142,
  under_verification_count: 87,
  awaiting_docs_count: 34,
  approved_today_count: 28,
};

/*
 * Offline queue. The first case is the open area mismatch the dispute, evidence
 * and audit screens all quote, so the figures here are the same ones: claimed
 * 12.50 ha against 14.68 ha in the record of rights.
 */
const FALLBACK_QUEUE = [
  {
    id: "mut-018",
    number: "M-2026-018",
    ulpin: "09-0824-0014-1026",
    type: "Sale Mutation",
    applicant: "Rajesh Kumar",
    submittedOn: "2026-08-28",
    claimedHa: 12.5,
    recordHa: 14.68,
    status: "Pending",
    hasDiscrepancy: true,
    detailsKey: "areaMismatch",
  },
  {
    id: "mut-019",
    number: "M-2026-019",
    ulpin: "09-0824-0014-1024",
    type: "Inheritance Mutation",
    applicant: "Rahul Sharma",
    submittedOn: "2026-08-30",
    claimedHa: 2,
    recordHa: 2,
    status: "Under Verification",
    hasDiscrepancy: false,
  },
  {
    id: "mut-020",
    number: "M-2026-020",
    ulpin: "09-0824-0014-1027",
    type: "Partition",
    applicant: "Manoj Tyagi",
    submittedOn: "2026-09-01",
    claimedHa: 3.2,
    recordHa: 3.2,
    status: "Awaiting Docs",
    hasDiscrepancy: false,
  },
];

const fromServer = (row) => ({
  id: row.id || row.mutation_number,
  number: row.mutation_number,
  ulpin: row.ulpin,
  type: row.mutation_type,
  typeLabel: row.mutation_type_label,
  applicant: row.applicant_name,
  submittedOn: row.submission_date,
  claimedHa: row.claimed_area_ha,
  recordHa: row.record_area_ha,
  status: row.status,
  statusLabel: row.status_label,
  hasDiscrepancy: Boolean(row.has_discrepancy),
  details: row.discrepancy_details || null,
});

export default function MutationManagement() {
  const { t, label, formatNumber, formatDate, formatArea } = useI18n();
  const p = (key, vars) => t(`pages.mutationManagement.${key}`, vars);

  const [stats, setStats] = useState(FALLBACK_STATS);
  const [queue, setQueue] = useState(FALLBACK_QUEUE);
  const [selectedId, setSelectedId] = useState(FALLBACK_QUEUE[0].id);
  const [offline, setOffline] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [statsData, list] = await Promise.all([
        api.mutations.getStats().catch((error) => {
          logFallback("mutation statistics", error);
          return null;
        }),
        api.mutations.list().catch((error) => {
          logFallback("mutation queue", error);
          return null;
        }),
      ]);
      if (cancelled) return;

      if (statsData) setStats(statsData);
      if (Array.isArray(list) && list.length > 0) {
        const rows = list.map(fromServer);
        setQueue(rows);
        setSelectedId(rows[0].id);
      }
      setOffline(!statsData || !Array.isArray(list) || list.length === 0);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Cases carrying a discrepancy are decided first; the original relied on
  // whatever order the API happened to return.
  const ordered = useMemo(
    () => [...queue].sort((a, b) => Number(b.hasDiscrepancy) - Number(a.hasDiscrepancy)),
    [queue]
  );
  const selected = ordered.find((row) => row.id === selectedId) ?? ordered[0] ?? null;

  const typeName = (row) => label("mutation_type", row.type, row.typeLabel);
  const statusName = (row) => label("mutation_status", row.status, row.statusLabel);
  const percent = (value) =>
    `${formatNumber(Math.abs(value), { maximumFractionDigits: 0 })}${t("common.units.percent")}`;

  const detailsOf = (row) => {
    if (!row) return null;
    if (row.details) return row.details;
    if (row.detailsKey !== "areaMismatch") return null;
    return p("fixture.areaMismatch", {
      claimed: formatArea(row.claimedHa),
      recorded: formatArea(row.recordHa),
      difference: formatArea(Math.abs(row.claimedHa - row.recordHa)),
    });
  };

  async function handleAction(actionType) {
    if (!selected) return;
    setLoading(true);
    setMessage(null);
    try {
      const updated = await api.mutations.takeAction(selected.id, actionType, p("actions.note"));
      const row = fromServer(updated);
      setQueue((prev) => prev.map((item) => (item.id === selected.id ? row : item)));
      setSelectedId(row.id);
      setMessage({
        tone: "ok",
        text: p("result.recorded", { number: row.number, status: statusName(row) }),
      });

      const refreshed = await api.mutations.getStats().catch((error) => {
        logFallback("mutation statistics", error);
        return null;
      });
      if (refreshed) setStats(refreshed);
    } catch (error) {
      logFallback(`mutation action ${actionType}`, error);
      setMessage({ tone: "warn", text: p("result.offline", { number: selected.number }) });
    } finally {
      setLoading(false);
    }
  }

  const KPIS = [
    {
      key: "pending",
      value: stats.pending_count,
      icon: "pending_actions",
      iconClass: "text-primary",
      trend: { key: "up", value: 12, icon: "arrow_upward", className: "text-error" },
    },
    {
      key: "underVerification",
      value: stats.under_verification_count,
      icon: "verified_user",
      iconClass: "text-secondary",
      trend: { key: "down", value: 5, icon: "arrow_downward", className: "text-primary" },
    },
    {
      key: "awaitingDocs",
      value: stats.awaiting_docs_count,
      icon: "folder_open",
      iconClass: "text-on-tertiary-fixed-variant",
      trend: { key: "flat", icon: "horizontal_rule", className: "text-primary" },
    },
  ];

  return (
    <main className="relative pt-16 min-h-screen bg-background">
      <nav
        aria-label={t("common.a11y.breadcrumb")}
        className="px-8 py-4 flex items-center gap-2 text-label-md text-on-surface-variant"
      >
        <Link className="hover:text-primary" to={MAIN_ROUTES.home}>
          {t("common.app.name")}
        </Link>
        <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
          chevron_right
        </span>
        <Link className="hover:text-primary" to={REVENUE_ROUTES.overview}>
          {t("pages.revenueOverview.breadcrumb")}
        </Link>
        <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
          chevron_right
        </span>
        <span aria-current="page" className="text-on-surface font-semibold">
          {p("breadcrumb")}
        </span>
      </nav>

      <div className="px-8 pb-12 flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-display text-on-surface">{p("title")}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">{p("intro")}</p>
        </header>

        <section aria-label={p("kpi.sectionLabel")} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {KPIS.map((card) => (
            <article
              key={card.key}
              className="bg-surface-container-lowest shadow-sm rounded-xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  {p(`kpi.${card.key}`)}
                </h2>
                <span
                  aria-hidden="true"
                  className={`material-symbols-outlined text-[24px] ${card.iconClass}`}
                >
                  {card.icon}
                </span>
              </div>
              <p className="font-display text-display text-on-surface font-tabular-nums">
                {formatNumber(card.value)}
              </p>
              <p className={`flex items-center gap-1.5 font-label-md text-label-md ${card.trend.className}`}>
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                  {card.trend.icon}
                </span>
                {p(
                  `kpi.${card.trend.key}`,
                  card.trend.value === undefined ? undefined : { value: percent(card.trend.value) }
                )}
              </p>
            </article>
          ))}
        </section>

        <p className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
          <span
            aria-hidden="true"
            className={`material-symbols-outlined text-[16px] ${offline ? "text-error" : "text-primary"}`}
          >
            {offline ? "cloud_off" : "cloud_done"}
          </span>
          {offline ? p("kpi.sampleData") : p("kpi.liveSynced")}
        </p>

        {/* One live region for every decision recorded on this screen. */}
        <div role="status" aria-live="polite">
          {message ? (
            <p
              className={`flex items-start gap-2 px-4 py-3 rounded-lg font-body-md text-body-md ${
                message.tone === "ok"
                  ? "bg-secondary-container text-on-secondary-container"
                  : "bg-error-container text-on-error-container"
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px] shrink-0">
                {message.tone === "ok" ? "task_alt" : "cloud_off"}
              </span>
              {message.text}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-12 gap-6 items-start">
          <section
            aria-labelledby="queue-heading"
            className="col-span-12 lg:col-span-5 bg-surface-container-lowest shadow-sm rounded-xl p-6 flex flex-col gap-4"
          >
            <h2 id="queue-heading" className="font-headline-md text-headline-md text-on-surface">
              {p("queue.heading")}
            </h2>

            {ordered.length === 0 ? (
              <div className="py-10 flex flex-col items-center text-center gap-2">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-[40px] text-on-surface-variant"
                >
                  inbox
                </span>
                <p className="font-body-lg text-body-lg text-on-surface">{p("queue.empty")}</p>
                <p className="font-body-md text-body-md text-on-surface-variant">{p("queue.emptyHint")}</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {ordered.map((row) => {
                  const isOpen = selected && row.id === selected.id;
                  return (
                    <li key={row.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(row.id)}
                        aria-pressed={Boolean(isOpen)}
                        className={`w-full text-left rounded-lg border p-4 flex flex-col gap-2 transition-colors cursor-pointer ${
                          isOpen
                            ? "border-primary bg-primary-fixed/20"
                            : "border-outline-variant hover:bg-surface-container"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-body-md text-body-md text-on-surface font-semibold font-tabular-nums">
                            {row.number}
                          </span>
                          <span className="bg-surface-container text-on-surface-variant px-2.5 py-0.5 rounded-full font-label-md text-label-md shrink-0">
                            {statusName(row)}
                          </span>
                        </span>
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          {typeName(row)} · {row.applicant}
                        </span>
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-label-md text-label-md text-on-surface-variant font-tabular-nums">
                            {formatDate(row.submittedOn)}
                          </span>
                          {row.hasDiscrepancy ? (
                            <span className="bg-error-container text-on-error-container px-2.5 py-0.5 rounded-full font-label-md text-label-md flex items-center gap-1 shrink-0">
                              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                                warning
                              </span>
                              {p("queue.discrepancy")}
                            </span>
                          ) : null}
                        </span>
                        <span className="sr-only">
                          {p("queue.rowSummary", {
                            number: row.number,
                            type: typeName(row),
                            applicant: row.applicant,
                            status: statusName(row),
                          })}
                          {isOpen ? ` ${p("queue.selected")}` : ""}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {selected ? (
            <section
              aria-labelledby="detail-heading"
              className="col-span-12 lg:col-span-7 bg-surface-container-lowest shadow-sm rounded-xl p-6 flex flex-col gap-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2
                    id="detail-heading"
                    className="font-headline-md text-headline-md text-on-surface font-tabular-nums"
                  >
                    {selected.number}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">{typeName(selected)}</p>
                  <p className="font-label-md text-label-md text-on-surface-variant">
                    {p("detail.linkedParcel")}{" "}
                    <span className="font-tabular-nums text-on-surface">{selected.ulpin}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="bg-surface-container text-on-surface px-3 py-1 rounded-full font-label-md text-label-md">
                    {p("detail.statusLabel")}: {statusName(selected)}
                  </span>
                  {selected.hasDiscrepancy ? (
                    <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full font-label-md text-label-md flex items-center gap-1">
                      <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                        warning
                      </span>
                      {p("detail.discrepancyFlag")}
                    </span>
                  ) : null}
                </div>
              </div>

              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { key: "applicant", value: selected.applicant, numeric: false },
                  { key: "submittedOn", value: formatDate(selected.submittedOn), numeric: true },
                  { key: "claimedArea", value: formatArea(selected.claimedHa), numeric: true },
                  { key: "recordArea", value: formatArea(selected.recordHa), numeric: true },
                ].map((field) => (
                  <div key={field.key} className="bg-surface-container rounded-lg p-4 flex flex-col gap-1">
                    <dt className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      {p(`detail.${field.key}`)}
                    </dt>
                    <dd
                      className={`font-body-lg text-body-lg text-on-surface ${
                        field.numeric ? "font-tabular-nums" : ""
                      }`}
                    >
                      {field.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {selected.claimedHa !== selected.recordHa ? (
                <p className="flex items-baseline gap-2 font-body-md text-body-md">
                  <span className="text-on-surface-variant">{p("detail.variance")}:</span>
                  <span className="text-error font-tabular-nums font-semibold">
                    {formatArea(Math.abs(selected.claimedHa - selected.recordHa))}
                  </span>
                </p>
              ) : null}

              {detailsOf(selected) ? (
                <div className="bg-error-container text-on-error-container rounded-lg p-4 flex items-start gap-3">
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px] shrink-0">
                    report
                  </span>
                  <p className="font-body-md text-body-md">{detailsOf(selected)}</p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3 pt-2 border-t border-outline-variant">
                {[
                  {
                    action: "approve",
                    named: "approveNamed",
                    icon: "check_circle",
                    className: "bg-primary text-on-primary hover:bg-primary/90",
                  },
                  {
                    action: "reject",
                    named: "rejectNamed",
                    icon: "cancel",
                    className: "bg-error-container text-on-error-container hover:bg-error-container/80",
                  },
                  {
                    action: "clarify",
                    named: "clarifyNamed",
                    icon: "help",
                    className: "bg-surface-container text-on-surface hover:bg-surface-variant",
                  },
                ].map((verb) => (
                  <button
                    key={verb.action}
                    type="button"
                    disabled={loading}
                    onClick={() => handleAction(verb.action)}
                    aria-label={p(`actions.${verb.named}`, { number: selected.number })}
                    className={`px-4 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${verb.className}`}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                      {verb.icon}
                    </span>
                    {loading ? p("actions.working") : p(`actions.${verb.action}`)}
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
