/*
 * Revenue officer oversight for the district administration.
 *
 * The page used to hardcode every number twice over. Each KPI card carried a
 * value beside a hand-typed delta chip ("42" next to "+3", "14.2 days" next to
 * "-1.5 days"), and the tab strip advertised "All Officers (42) / Needs
 * Attention (8) / Top Performers (5)" above a table of four fixed rows. Nothing
 * agreed with anything else, and none of the controls worked: the tabs did not
 * switch, the search box did not filter, and the page buttons paged nothing.
 * Both the deltas and the tab counts are now derived, so the roster is the only
 * source for the figures that describe it.
 *
 * The status column was three raw hexes (#166534, #ca8a04 and bg-error)
 * explained only by a `title` tooltip on a non-interactive <div>, which no
 * screen reader announces and no keyboard reaches. Status is now derived from
 * the caseload and the resolution rate and read out through
 * domain.officer_status -- the same Optimal / Action Needed / Overloaded
 * vocabulary TehsilAnalytics reports against -- with the theme's status-*
 * tokens carrying the colour.
 *
 * Two rows also held <img src="/src/assets/logo.jpeg"> avatars. That is a dev
 * server path rather than a public/ asset, so the request 404s in a built
 * bundle, and each one still carried a leftover image-generation prompt in a
 * `data-alt` attribute. They are replaced by initials, which is what the other
 * two rows already showed.
 */

import { useMemo, useState } from "react";
import { useI18n } from "../../i18n";

/*
 * Below this resolution rate an officer needs attention whatever the load;
 * above this caseload the officer is overloaded even while keeping the rate up.
 * The thresholds reproduce the four dots the original drew by hand -- RO-024 at
 * 42% was the red row, RO-031 at 510 cases the amber one.
 */
const LOW_RESOLUTION_RATE = 50;
const HIGH_CASELOAD = 500;
// A top performer clears the district's own resolution bar comfortably.
const TOP_PERFORMER_RATE = 85;

/*
 * `value` is the English domain string, so label("officer_status", …) resolves
 * it in either locale instead of the page inventing a second set of names.
 */
const STATUS = {
  actionNeeded: { value: "Action Needed", dot: "bg-status-error", bar: "bg-status-error", tone: "text-status-error" },
  overloaded: { value: "Overloaded", dot: "bg-status-warning", bar: "bg-status-warning", tone: "text-on-surface" },
  optimal: { value: "Optimal", dot: "bg-status-success", bar: "bg-status-success", tone: "text-on-surface" },
};

function officerStatus(officer) {
  if (officer.resolutionRate < LOW_RESOLUTION_RATE) return STATUS.actionNeeded;
  if (officer.assignedCases > HIGH_CASELOAD) return STATUS.overloaded;
  return STATUS.optimal;
}

/*
 * The district establishment plus last month's reading for the same three
 * measures. `betterWhen` says which direction counts as good news, which is
 * what decides both the trending arrow and the green/red chip: three more
 * officers on the rolls and fourteen more flagged cases are not the same kind
 * of movement. `display` says how the change should read -- the flagged-cases
 * chip was a percentage in the original, the other two were absolute.
 */
const DISTRICT = {
  establishment: 42,
  activeOfficers: { current: 42, previous: 39, betterWhen: "up", display: "count" },
  resolutionDays: { current: 14.2, previous: 15.7, target: 15, betterWhen: "down", display: "days" },
  casesFlagged: { current: 128, previous: 114, betterWhen: "down", display: "percent" },
};

/*
 * `tehsil` keys into common.place.tehsils, shared with the three other admin
 * screens that list the same jurisdictions. The original spelled one of them
 * "Ghaziabad Sadar", a name no other page uses.
 */
const OFFICERS = [
  { id: "RO-018", name: "Amit Sharma", tehsil: "loni", assignedCases: 450, resolutionRate: 88 },
  { id: "RO-024", name: "Priya Patel", tehsil: "ghaziabad", assignedCases: 612, resolutionRate: 42 },
  { id: "RO-007", name: "Rajesh Kumar", tehsil: "modinagar", assignedCases: 280, resolutionRate: 95 },
  { id: "RO-031", name: "Sanjay Nath", tehsil: "loni", assignedCases: 510, resolutionRate: 68 },
];

const TABS = [
  { key: "all", match: () => true },
  { key: "actionNeeded", match: (officer) => officerStatus(officer) === STATUS.actionNeeded },
  { key: "topPerformers", match: (officer) => officer.resolutionRate >= TOP_PERFORMER_RATE },
];

// 14.2 - 15.7 lands on -1.5000000000000018 in binary floating point, and that
// difference then feeds the percentage, so it is rounded once at the source.
const round = (value) => Math.round(value * 10) / 10;

// "Amit Sharma" -> "AS". Two rows already showed initials; the other two asked
// for a photograph this project does not ship.
const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export default function OfficerPerformance() {
  const { t, label, formatNumber } = useI18n();
  const p = (key, vars) => t(`pages.officerPerformance.${key}`, vars);

  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");

  const percent = (value) =>
    `${formatNumber(value, { maximumFractionDigits: 0 })}${t("common.units.percent")}`;

  /*
   * A signed chip for one metric: the number, whether it is good news, and the
   * arrow. `improved` is not "went up" -- for resolution time and flagged cases
   * the good direction is down.
   */
  const delta = (metric) => {
    const change = round(metric.current - metric.previous);
    const improved = metric.betterWhen === "up" ? change > 0 : change < 0;
    let text;
    if (metric.display === "percent") {
      text = `${formatNumber((change / metric.previous) * 100, {
        signDisplay: "always",
        maximumFractionDigits: 0,
      })}${t("common.units.percent")}`;
    } else if (metric.display === "days") {
      text = `${formatNumber(change, { signDisplay: "always", maximumFractionDigits: 1 })} ${t(
        "common.units.days",
      )}`;
    } else {
      text = formatNumber(change, { signDisplay: "always" });
    }
    return { text, improved, icon: change > 0 ? "trending_up" : "trending_down" };
  };

  const counts = useMemo(
    () => Object.fromEntries(TABS.map((tab) => [tab.key, OFFICERS.filter(tab.match).length])),
    [],
  );

  // The id and the name are proper nouns held outside the catalogs, so the
  // search matches them as written in either locale.
  const rows = useMemo(() => {
    const tab = TABS.find((entry) => entry.key === activeTab) ?? TABS[0];
    const needle = query.trim().toLowerCase();
    return OFFICERS.filter(tab.match).filter(
      (officer) =>
        needle === "" ||
        officer.id.toLowerCase().includes(needle) ||
        officer.name.toLowerCase().includes(needle),
    );
  }, [activeTab, query]);

  const cards = [
    {
      key: "activeOfficers",
      metric: DISTRICT.activeOfficers,
      icon: "badge",
      accent: "bg-primary",
      chip: "bg-primary-container/10 text-primary",
      value: formatNumber(DISTRICT.activeOfficers.current),
      caption: p("kpi.vsLastMonth"),
    },
    {
      key: "avgResolutionTime",
      metric: DISTRICT.resolutionDays,
      icon: "schedule",
      accent: "bg-tertiary-container",
      chip: "bg-tertiary-container/10 text-tertiary-container",
      value: formatNumber(DISTRICT.resolutionDays.current, { minimumFractionDigits: 1 }),
      unit: t("common.units.days"),
      caption: p("kpi.districtTarget", { value: formatNumber(DISTRICT.resolutionDays.target) }),
    },
    {
      key: "casesFlagged",
      metric: DISTRICT.casesFlagged,
      icon: "warning",
      accent: "bg-error",
      chip: "bg-error-container/30 text-error",
      value: formatNumber(DISTRICT.casesFlagged.current),
      caption: p("kpi.requiringEscalation"),
    },
  ];

  return (
    <main className="pt-16 min-h-screen bg-surface">
      <div className="flex flex-col w-full h-full relative overflow-hidden bg-background">
        <div
          aria-hidden="true"
          className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-gradient-radial from-primary/5 via-primary-fixed/5 to-transparent blur-[120px] rounded-full pointer-events-none mix-blend-multiply"
        />
        <div
          aria-hidden="true"
          className="absolute top-[40%] -left-[15%] w-[40%] h-[40%] bg-gradient-radial from-tertiary-fixed/5 via-tertiary-fixed-dim/5 to-transparent blur-[100px] rounded-full pointer-events-none mix-blend-multiply"
        />

        <div className="px-8 py-10 w-full max-w-7xl mx-auto relative z-10 flex-1 flex flex-col">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div aria-hidden="true" className="w-1 h-6 bg-primary rounded-full" />
                <p className="font-label-md text-label-md tracking-[0.15em] text-on-surface-variant uppercase">
                  {p("eyebrow")}
                </p>
              </div>
              <h1 className="font-display text-display text-on-surface">{p("title")}</h1>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                className="h-10 px-6 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-2 hover:bg-surface-container-high transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                  filter_list
                </span>
                {p("actions.filterRegion")}
              </button>
              <button
                type="button"
                className="h-10 px-6 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                  download
                </span>
                {p("actions.exportReport")}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {cards.map((card) => {
              const change = delta(card.metric);
              return (
                <div
                  key={card.key}
                  className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col relative overflow-hidden group"
                >
                  <div
                    aria-hidden="true"
                    className={`absolute top-0 left-0 w-1 h-full ${card.accent} group-hover:w-2 transition-all duration-300`}
                  />
                  <div className="flex justify-between items-start mb-4 pl-2">
                    <p className="font-label-md text-label-md text-on-surface-variant">
                      {p(`kpi.${card.key}`)}
                    </p>
                    <div
                      aria-hidden="true"
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${card.chip}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{card.icon}</span>
                    </div>
                  </div>
                  <div className="pl-2">
                    <p className="font-display font-tabular-nums text-[32px] leading-tight font-bold text-on-surface">
                      {card.value}
                      {card.unit ? (
                        <span className="text-[18px] text-on-surface-variant font-medium ml-1">
                          {card.unit}
                        </span>
                      ) : null}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {/*
                        * The chip's tone follows the metric's own good
                        * direction, so a fall in resolution days reads as green
                        * while a rise in flagged cases reads as red. The
                        * original painted both in the same raw #166534.
                        */}
                      <span
                        className={`flex items-center font-tabular-nums text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          change.improved
                            ? "text-status-success bg-status-success/10"
                            : "text-error bg-error-container"
                        }`}
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[12px] mr-1">
                          {change.icon}
                        </span>
                        {change.text}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {card.caption}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex-1 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col min-h-0">
            <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-surface-variant bg-surface-container-lowest rounded-t-xl z-10 sticky top-0">
              <div className="flex gap-6" role="tablist" aria-label={p("title")}>
                {TABS.map((tab) => {
                  const selected = tab.key === activeTab;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      id={`tab-${tab.key}`}
                      aria-selected={selected}
                      aria-controls="officer-roster"
                      onClick={() => setActiveTab(tab.key)}
                      className={`font-label-md text-label-md pb-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm ${
                        selected
                          ? "text-primary border-b-2 border-primary"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {p("tabs.withCount", {
                        label: p(`tabs.${tab.key}`),
                        count: formatNumber(counts[tab.key]),
                      })}
                    </button>
                  );
                })}
              </div>

              <div className="relative">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]"
                >
                  search
                </span>
                <input
                  type="search"
                  aria-label={p("search.label")}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={p("search.placeholder")}
                  className="pl-10 pr-4 py-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface w-64 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant transition-shadow"
                />
              </div>
            </div>

            <div className="overflow-auto flex-1" id="officer-roster" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider w-16">
                      {p("table.status")}
                    </th>
                    <th scope="col" className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      {p("table.officer")}
                    </th>
                    <th scope="col" className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      {p("table.jurisdiction")}
                    </th>
                    <th scope="col" className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">
                      {p("table.assignedCases")}
                    </th>
                    <th scope="col" className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      {p("table.resolutionRate")}
                    </th>
                    <th scope="col" className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">
                      {p("table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md">
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-6 text-center text-on-surface-variant">
                        {t("common.state.noResults")}
                      </td>
                    </tr>
                  ) : null}

                  {rows.map((officer) => {
                    const status = officerStatus(officer);
                    const flagged = status === STATUS.actionNeeded;
                    return (
                      <tr
                        key={officer.id}
                        className={`transition-colors group ${
                          flagged
                            ? "bg-error-container/5 hover:bg-error-container/10"
                            : "hover:bg-surface-container/50"
                        }`}
                      >
                        <td className="py-4 px-6 border-b border-surface-variant align-middle">
                          {/*
                            * The dot carried the entire status as a `title`
                            * tooltip, which is announced by nothing. The name
                            * is now spelled out for assistive technology and
                            * the dot is decorative.
                            */}
                          <span className="sr-only">
                            {p("table.statusOf", {
                              id: officer.id,
                              status: label("officer_status", status.value),
                            })}
                          </span>
                          <div
                            aria-hidden="true"
                            className={`w-3 h-3 rounded-full m-auto ${status.dot}`}
                          />
                        </td>

                        <td className="py-4 px-6 border-b border-surface-variant">
                          <div className="flex items-center gap-3">
                            <div
                              aria-hidden="true"
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                                flagged
                                  ? "bg-error-container text-on-error-container"
                                  : "bg-surface-container-highest text-on-surface"
                              }`}
                            >
                              {initials(officer.name)}
                            </div>
                            <div>
                              <p className={`font-bold ${flagged ? "text-error" : "text-on-surface"}`}>
                                {officer.id}
                              </p>
                              <p className="text-[12px] text-on-surface-variant">{officer.name}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 border-b border-surface-variant">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary-container/50 text-on-secondary-container text-xs font-semibold">
                            <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                              map
                            </span>
                            {t(`common.place.tehsils.${officer.tehsil}`)}
                          </span>
                        </td>

                        <td className="py-4 px-6 border-b border-surface-variant text-right font-tabular-nums text-on-surface font-medium">
                          {formatNumber(officer.assignedCases)}
                        </td>

                        <td className="py-4 px-6 border-b border-surface-variant">
                          <div className="flex items-center gap-3">
                            <div
                              aria-hidden="true"
                              className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden"
                            >
                              {/*
                                * Inline width: a class built from a template
                                * literal never reaches the Tailwind scanner.
                                */}
                              <div
                                className={`h-full rounded-full ${status.bar}`}
                                style={{ width: `${officer.resolutionRate}%` }}
                              />
                            </div>
                            <span
                              className={`font-tabular-nums font-bold w-12 text-right ${
                                flagged ? "text-error" : "text-on-surface"
                              }`}
                            >
                              {percent(officer.resolutionRate)}
                            </span>
                          </div>
                          {flagged ? (
                            <p className="text-[10px] text-error mt-1 font-medium tracking-wide uppercase">
                              {p("table.backlogAlert")}
                            </p>
                          ) : null}
                        </td>

                        <td className="py-4 px-6 border-b border-surface-variant text-right">
                          {/*
                            * No per-officer route exists, so this stays a
                            * button with an accessible name rather than becoming
                            * a link to nowhere. The chevron-only version was
                            * also invisible until hover, which hides it from
                            * anyone tabbing through -- focus now reveals it.
                            */}
                          <button
                            type="button"
                            aria-label={
                              flagged
                                ? p("table.escalate", { id: officer.id })
                                : p("table.openOfficer", { id: officer.id })
                            }
                            className={`p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                              flagged
                                ? "text-error hover:bg-error-container/30"
                                : "text-on-surface-variant hover:text-primary hover:bg-primary-container/10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                            }`}
                          >
                            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                              {flagged ? "assignment_late" : "chevron_right"}
                            </span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/*
              * The footer used to read "Showing 1 to 4 of 42 Officers" beside
              * page buttons 1, 2, 3 and an ellipsis, none of which paged
              * anything -- the demo ships a single sample of the roster. The
              * range now describes the rows actually rendered, and the
              * establishment figure moves into a note that does not pretend to
              * be navigation.
              */}
            <div className="px-6 py-3 border-t border-surface-variant flex flex-wrap items-center justify-between gap-2 bg-surface-container-lowest rounded-b-xl">
              <p className="font-body-sm text-body-sm text-on-surface-variant font-tabular-nums">
                {t("common.state.showingRange", {
                  from: formatNumber(rows.length === 0 ? 0 : 1),
                  to: formatNumber(rows.length),
                  total: formatNumber(counts[activeTab]),
                })}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {p("rosterNote", { total: formatNumber(DISTRICT.establishment) })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
