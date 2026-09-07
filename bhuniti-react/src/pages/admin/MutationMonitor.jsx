import { useEffect, useState } from "react";
import { useI18n } from "../../i18n";

/*
 * District mutation funnel, demo figures.
 *
 * The original typed every number twice -- a count inside each bar and a
 * percentage in the hover column beside it -- and a third time as "12.4k" in the
 * middle of the donut, so nothing stopped the three from drifting apart. Counts
 * are the single fixture now and every share is computed from them, which is why
 * the donut arcs and the legend cannot disagree either: the arcs used to carry
 * hand-written dash offsets (100.48, 200.96) and a 216-degree rotation that bore
 * no relation to the 60/25/15 split in the list underneath, and the third arc had
 * no stroke colour at all, so it never rendered.
 *
 * The three type names are the real `mutation_type` vocabulary rather than the
 * "Sale Deed / Inheritance / Correction" mix the markup invented, so they
 * translate through the shared domain catalog like every other status on the
 * district screens.
 */

const TOAST_MS = 4000;
const PERIOD_DAYS = 30;

// Applications that entered the pipeline in the period; the denominator for
// every share on the page.
const SUBMITTED_TOTAL = 12450;

const FUNNEL_STAGES = [
  {
    key: "submitted",
    count: SUBMITTED_TOTAL,
    barClass: "bg-surface-variant",
    inkClass: "text-on-surface-variant",
    labelClass: "text-on-surface-variant",
    shareClass: "text-on-surface-variant",
    tall: true,
  },
  {
    key: "verified",
    count: 9711,
    barClass: "bg-primary-fixed-dim",
    inkClass: "text-on-primary-fixed-variant",
    labelClass: "text-on-surface-variant",
    shareClass: "text-primary",
    tall: true,
  },
  {
    key: "notice",
    count: 7719,
    barClass: "bg-primary-fixed",
    inkClass: "text-on-primary-fixed",
    labelClass: "text-on-surface-variant",
    shareClass: "text-primary",
    tall: true,
  },
  {
    key: "approved",
    count: 6847,
    barClass: "bg-tertiary-fixed",
    inkClass: "text-on-tertiary-fixed",
    labelClass: "text-on-surface-variant",
    shareClass: "text-tertiary",
    tall: true,
  },
  {
    key: "rejected",
    count: 1494,
    barClass: "bg-error-container",
    inkClass: "text-on-error-container",
    labelClass: "text-error",
    shareClass: "text-error",
    tall: false,
  },
];

// Shares of SUBMITTED_TOTAL; the three counts add up to it exactly.
const MUTATION_TYPES = [
  { value: "Sale Mutation", count: 7470, dotClass: "bg-primary", arcClass: "stroke-primary", shareClass: "text-primary" },
  {
    value: "Inheritance Mutation",
    count: 3112,
    dotClass: "bg-surface-variant",
    arcClass: "stroke-surface-variant",
    shareClass: "text-on-surface-variant",
  },
  {
    value: "Partition",
    count: 1868,
    dotClass: "bg-tertiary-fixed",
    arcClass: "stroke-tertiary-fixed",
    shareClass: "text-on-tertiary-fixed-variant",
  },
];

const AVG_PROCESSING_DAYS = 4.2;
const PROCESSING_TREND = -12;

const OLDEST_PENDING = { id: "MUT-2026-0417", days: 17 };

/* Donut geometry: r=40 inside a 100-unit box, stroked at 20 units wide. */
const DONUT_RADIUS = 40;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

export default function MutationMonitor() {
  const { t, label, formatNumber } = useI18n();
  const p = (key, vars) => t(`pages.mutationMonitor.${key}`, vars);

  const [toast, setToast] = useState(null);
  const showToast = (text) => setToast({ text, at: Date.now() });

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const share = (count) => (count / SUBMITTED_TOTAL) * 100;
  const percent = (value) =>
    `${formatNumber(value, { maximumFractionDigits: 1 })}${t("common.units.percent")}`;
  const typeLabel = (value) => label("mutation_type", value);

  let sweptAngle = 0;
  const arcs = MUTATION_TYPES.map((type) => {
    const rotation = sweptAngle;
    const length = (DONUT_CIRCUMFERENCE * share(type.count)) / 100;
    sweptAngle += (360 * share(type.count)) / 100;
    return { ...type, rotation, length };
  });

  const breakdown = MUTATION_TYPES.map((type) =>
    p("types.breakdownItem", { type: typeLabel(type.value), share: percent(share(type.count)) })
  ).join(", ");

  return (
    <main className="pt-16 min-h-screen bg-surface">
      <div className="flex flex-col w-full px-8 pb-12 gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between pt-8 gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-display text-on-surface">{p("title")}</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">{p("intro")}</p>
          </div>
          <div className="flex items-center gap-4">
            {/* The range used to be a dropdown with no menu and no state behind
                it. It states the reporting window instead of pretending to
                change it. */}
            <p className="bg-surface-container text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md flex items-center gap-2">
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                calendar_month
              </span>
              {p("period", { days: formatNumber(PERIOD_DAYS) })}
            </p>
            <button
              type="button"
              onClick={() => showToast(p("toast.exporting", { days: formatNumber(PERIOD_DAYS) }))}
              className="bg-primary text-on-primary hover:bg-primary/90 transition-colors px-4 py-2 rounded-lg font-label-md text-label-md flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                download
              </span>
              {p("export")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <section
              aria-labelledby="funnel-heading"
              className="bg-surface-container-lowest shadow-sm rounded-xl p-6 relative overflow-hidden"
            >
              <div
                aria-hidden="true"
                className="absolute -right-24 -top-24 w-64 h-64 bg-primary-fixed-dim/20 rounded-full blur-3xl mix-blend-multiply pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute -left-12 -bottom-12 w-48 h-48 bg-tertiary-fixed-dim/20 rounded-full blur-2xl mix-blend-multiply pointer-events-none"
              />
              <div className="flex items-center justify-between gap-4 mb-8 relative z-10">
                <h2 id="funnel-heading" className="font-headline-md text-headline-md text-on-surface">
                  {p("funnel.heading")}
                </h2>
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md uppercase tracking-wider">
                  {p("funnel.live")}
                </span>
              </div>

              <ul className="relative z-10 flex flex-col gap-4">
                {FUNNEL_STAGES.map((stage) => {
                  const stageName = p(`funnel.stages.${stage.key}`);
                  const stageShare = share(stage.count);
                  return (
                    <li
                      key={stage.key}
                      className={`flex items-center gap-6 group ${
                        stage.tall ? "" : "mt-2 pt-4 border-t border-outline-variant/30"
                      }`}
                    >
                      <span
                        className={`w-32 font-label-md text-label-md uppercase text-right shrink-0 ${stage.labelClass}`}
                      >
                        {stageName}
                      </span>
                      <span className="flex-1 flex items-center">
                        <span
                          className={`${stage.tall ? "h-12" : "h-8"} ${
                            stage.barClass
                          } rounded-r-full transition-all duration-700 ease-out flex items-center px-4`}
                          style={{ width: `${stageShare}%` }}
                        >
                          <span
                            className={`font-tabular-nums ${
                              stage.tall ? "text-headline-md" : "text-body-md"
                            } ${stage.inkClass} font-bold ml-auto`}
                          >
                            {formatNumber(stage.count)}
                          </span>
                        </span>
                      </span>
                      {/* The share only fades in on hover, so the same sentence
                          is also given to assistive tech unconditionally. */}
                      <span
                        aria-hidden="true"
                        className="w-16 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-end shrink-0"
                      >
                        <span className={`font-label-md text-label-md ${stage.shareClass}`}>
                          {percent(stageShare)}
                        </span>
                      </span>
                      <span className="sr-only">
                        {p("funnel.stageSummary", {
                          stage: stageName,
                          count: formatNumber(stage.count),
                          total: formatNumber(SUBMITTED_TOTAL),
                          share: percent(stageShare),
                        })}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <section className="bg-surface-container-lowest shadow-sm rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">
                    {p("processing.heading")}
                  </h2>
                  <p className="flex items-baseline gap-2">
                    <span className="font-display text-display text-on-surface">
                      {formatNumber(AVG_PROCESSING_DAYS, { minimumFractionDigits: 1 })}
                    </span>
                    <span className="font-body-lg text-body-lg text-on-surface-variant">
                      {p("processing.days")}
                    </span>
                  </p>
                </div>
                <p className="mt-6 flex items-center gap-2 text-primary">
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                    trending_down
                  </span>
                  <span className="font-label-md text-label-md">
                    {p("processing.trend", { value: percent(PROCESSING_TREND) })}
                  </span>
                </p>
              </section>

              <section className="bg-error-container text-on-error-container shadow-sm rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h2 className="font-label-md text-label-md uppercase tracking-wider mb-2 opacity-80">
                    {p("oldest.heading")}
                  </h2>
                  <p className="flex items-baseline gap-2">
                    <span className="font-display text-display">{formatNumber(OLDEST_PENDING.days)}</span>
                    <span className="font-body-lg text-body-lg opacity-80">{p("oldest.days")}</span>
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <span className="font-label-md text-label-md">
                    {p("oldest.idLabel")} {OLDEST_PENDING.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => showToast(p("toast.escalated", { id: OLDEST_PENDING.id }))}
                    aria-label={p("oldest.escalateNamed", { id: OLDEST_PENDING.id })}
                    className="bg-on-error-container text-error-container hover:bg-on-error-container/90 px-3 py-1.5 rounded font-label-md text-label-md transition-colors cursor-pointer shrink-0"
                  >
                    {p("oldest.escalate")}
                  </button>
                </div>
              </section>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <section
              aria-labelledby="types-heading"
              className="bg-surface-container shadow-sm rounded-xl p-6 h-full flex flex-col"
            >
              <h2 id="types-heading" className="font-headline-md text-headline-md text-on-surface mb-6">
                {p("types.heading")}
              </h2>

              <div className="relative flex-1 flex flex-col items-center justify-center mb-8 min-h-[200px]">
                <svg
                  role="img"
                  aria-label={p("types.chart", {
                    total: formatNumber(SUBMITTED_TOTAL),
                    breakdown,
                  })}
                  className="w-48 h-48 -rotate-90 transform drop-shadow-md"
                  viewBox="0 0 100 100"
                >
                  {arcs.map((arc) => (
                    <circle
                      key={arc.value}
                      className={arc.arcClass}
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r={DONUT_RADIUS}
                      strokeWidth="20"
                      strokeDasharray={`${arc.length} ${DONUT_CIRCUMFERENCE - arc.length}`}
                      style={{ transform: `rotate(${arc.rotation}deg)`, transformOrigin: "50% 50%" }}
                    />
                  ))}
                </svg>
                <p
                  aria-hidden="true"
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                >
                  <span className="font-display text-headline-lg text-on-surface">
                    {formatNumber(SUBMITTED_TOTAL)}
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                    {p("types.total")}
                  </span>
                </p>
              </div>

              <ul className="flex flex-col gap-4 mt-auto">
                {MUTATION_TYPES.map((type) => (
                  <li
                    key={type.value}
                    className="flex items-center justify-between gap-3 p-3 bg-surface-container-lowest rounded-lg"
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span aria-hidden="true" className={`w-3 h-3 rounded-full shrink-0 ${type.dotClass}`} />
                      <span className="font-body-md text-body-md text-on-surface font-semibold truncate">
                        {typeLabel(type.value)}
                      </span>
                    </span>
                    <span className="flex items-center gap-4 shrink-0">
                      <span className="font-tabular-nums text-body-md text-on-surface-variant">
                        {formatNumber(type.count)}
                      </span>
                      <span className={`font-label-md text-label-md w-10 text-right ${type.shareClass}`}>
                        {percent(share(type.count))}
                      </span>
                    </span>
                    <span className="sr-only">
                      {p("types.rowSummary", {
                        type: typeLabel(type.value),
                        count: formatNumber(type.count),
                        share: percent(share(type.count)),
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* One live region for both actions on the screen. */}
      <div role="status" aria-live="polite" className="fixed bottom-4 right-4 z-[70] pointer-events-none">
        {toast ? (
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-2xl max-w-xs">
            <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary-fixed">
              info
            </span>
            <p className="font-body-md text-[12px] leading-snug">{toast.text}</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
