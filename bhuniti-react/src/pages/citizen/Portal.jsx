import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n";
import { CITIZEN_ROUTES } from "../../routes";

/*
 * Citizen dashboard.
 *
 * Beyond the hard-coded English, three things were wrong. The two application
 * cards were plain <div onClick> -- clickable with a mouse and invisible to the
 * keyboard -- while the row underneath them was already a real button. The first
 * card described the citizen's live case as "MUT-2026-8941 / In Review", but the
 * application it opens is MUT-2023-8941 and its status is Action Required, and
 * the same number is quoted on the parcel viewer; the progress bar beside it was
 * a fixed w-2/3 that agreed with neither. And "2.00 ha (7.90 Bigha)" was one
 * frozen string: the hectare figure, its bigha conversion and the decimal comma
 * all baked into English.
 *
 * The record card deliberately mirrors P-1024 in SearchRecords, which is the page
 * it links to, rather than the disputed variant of the same parcel on the public
 * home page.
 */

// Typing nothing and pressing Search opens the showcase parcel.
const SEARCH_FALLBACK = "1024";

// 1 ha reads as 3.95 bigha across the citizen screens.
const BIGHA_PER_HECTARE = 3.95;

const RECENT_PARCEL = {
  parcelNumber: "P-1024",
  ulpin: "09-0824-0014-1024",
  khasra: "412/1",
  owner: "Rahul Sharma",
  areaHa: 2,
  landType: "Agricultural (Zamin)",
  verificationStatus: "Verified",
  encumbranceStatus: "Clean (Nishkank)",
  lastAccessed: "2026-09-04T09:42:00",
  imageUrl:
    "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600",
};

const QUICK_ACTIONS = [
  {
    id: "downloadTitle",
    icon: "description",
    to: `${CITIZEN_ROUTES.searchRecords}?q=${SEARCH_FALLBACK}&tab=details`,
    wash: "from-primary/0 via-primary/5 to-transparent",
    chip: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary",
  },
  {
    id: "initiateMutation",
    icon: "edit_document",
    to: CITIZEN_ROUTES.landServices,
    wash: "from-secondary/0 via-secondary/5 to-transparent",
    chip: "bg-secondary-container text-on-secondary-container group-hover:bg-secondary group-hover:text-on-secondary",
  },
  {
    id: "viewMaps",
    icon: "map",
    to: `${CITIZEN_ROUTES.searchRecords}?q=${SEARCH_FALLBACK}&tab=map`,
    wash: "from-tertiary-fixed-dim/0 via-tertiary-fixed-dim/20 to-transparent",
    chip: "bg-tertiary-fixed text-on-tertiary-fixed group-hover:bg-tertiary group-hover:text-on-tertiary",
  },
];

/*
 * The first row is the case tracked on MyApplications -- same number, same
 * status, and the stage count the timeline there shows (Submitted and Verified
 * done, Field Survey open, RO Review and Approval to come).
 */
const APPLICATIONS = [
  {
    id: "app-8941",
    number: "MUT-2023-8941",
    serviceType: "Title Transfer",
    status: "Action Required",
    parcel: "P-1024",
    stagesDone: 3,
    stagesTotal: 5,
    live: true,
  },
  {
    id: "app-3310",
    number: "MUT-2025-3310",
    serviceType: "Demarcation",
    status: "Completed",
    noteKey: "closed",
    stagesDone: 5,
    stagesTotal: 5,
    live: false,
  },
];

export default function CitizenPortal() {
  const navigate = useNavigate();
  const { t, label, formatNumber, formatDateTime, formatArea } = useI18n();
  const p = (key, vars) => t(`pages.citizenPortal.${key}`, vars);
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e) {
    if (e) e.preventDefault();
    const clean = searchQuery.trim() || SEARCH_FALLBACK;
    navigate(`${CITIZEN_ROUTES.searchRecords}?q=${encodeURIComponent(clean)}`);
  }

  const areaWithBigha = p("recent.areaWithBigha", {
    area: formatArea(RECENT_PARCEL.areaHa, "common.units.hectare"),
    bigha: formatNumber(RECENT_PARCEL.areaHa * BIGHA_PER_HECTARE, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  });

  return (
    <main className="w-full pt-16 bg-surface min-h-screen">
      <div className="flex flex-col w-full relative">
        <section className="w-full relative px-margin-mobile lg:px-margin-desktop py-16 lg:py-24 bg-surface-container-lowest">
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"
          />
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
            <span className="text-label-md text-primary tracking-[0.1em] uppercase mb-4 bg-primary/10 px-3 py-1 rounded-full">
              {p("eyebrow")}
            </span>
            <h1 className="font-display text-[40px] md:text-[56px] leading-[1.1] tracking-tight text-on-surface mb-6 max-w-3xl">
              {p("titleLead")} <br />
              <span className="text-on-surface-variant">{p("titleAccent")}</span>
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-2xl mb-10">{p("intro")}</p>

            <form
              onSubmit={handleSearch}
              className="w-full max-w-2xl bg-surface-container-lowest shadow-xl shadow-on-surface/5 rounded-2xl p-2 flex items-center group relative overflow-hidden transition-all duration-300 focus-within:shadow-2xl focus-within:shadow-primary/10 border border-border-subtle"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity"
              />
              <div aria-hidden="true" className="pl-4 pr-2 text-on-surface-variant relative z-10">
                <span className="material-symbols-outlined text-[24px]">search</span>
              </div>
              {/* A placeholder is not an accessible name, so the field carries a
                  visually hidden label of its own. */}
              <label className="sr-only" htmlFor="portal-search">
                {p("search.label")}
              </label>
              <input
                id="portal-search"
                className="w-full bg-transparent border-none outline-none font-body-lg text-on-surface placeholder:text-on-surface-variant/50 py-4 px-2 relative z-10"
                placeholder={p("search.placeholder")}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary text-on-primary font-label-md px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors relative z-10 shrink-0 cursor-pointer font-bold"
              >
                {p("search.submit")}
              </button>
            </form>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop w-full grid grid-cols-1 lg:grid-cols-12 gap-gutter py-8 relative z-20">
          <div className="lg:col-span-8 flex flex-col gap-gutter">
            <section aria-label={p("actions.sectionLabel")} className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => navigate(action.to)}
                  className="bg-surface-container-lowest shadow-sm rounded-xl p-6 text-left hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[160px] group relative overflow-hidden cursor-pointer"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-br ${action.wash} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <span
                    aria-hidden="true"
                    className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${action.chip}`}
                  >
                    <span className="material-symbols-outlined text-[24px]">{action.icon}</span>
                  </span>
                  <span className="block">
                    <span className="block font-headline-md text-on-surface font-bold">
                      {p(`actions.items.${action.id}.title`)}
                    </span>
                    <span className="block font-body-sm text-on-surface-variant mt-1">
                      {p(`actions.items.${action.id}.body`)}
                    </span>
                  </span>
                </button>
              ))}
            </section>

            <section
              aria-labelledby="recent-heading"
              className="bg-surface-container-lowest shadow-sm rounded-2xl p-6 lg:p-8 flex flex-col h-full relative overflow-hidden"
            >
              <div
                aria-hidden="true"
                className="absolute -right-20 -top-20 w-64 h-64 bg-surface-container-high rounded-full blur-3xl opacity-50"
              />
              <div className="flex items-center justify-between mb-8 relative z-10 gap-4">
                <div>
                  <h2 id="recent-heading" className="font-headline-lg text-on-surface font-bold">
                    {p("recent.heading")}
                  </h2>
                  <p className="font-body-md text-on-surface-variant">
                    {p("recent.lastAccessed", { when: formatDateTime(RECENT_PARCEL.lastAccessed) })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`${CITIZEN_ROUTES.searchRecords}?q=${encodeURIComponent(SEARCH_FALLBACK)}`)
                  }
                  aria-label={p("recent.viewFullNamed", { parcel: RECENT_PARCEL.parcelNumber })}
                  className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors flex items-center gap-2 font-label-md font-bold cursor-pointer shrink-0"
                >
                  {p("recent.viewFull")}
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6 bg-surface-container p-4 rounded-xl relative z-10">
                <div className="w-full md:w-[240px] h-[160px] rounded-lg overflow-hidden shadow-inner flex-shrink-0 relative group">
                  {/* Remote basemap tile. It carries the parcel's name so the card
                      is not a nameless image to a screen reader. */}
                  <div
                    role="img"
                    aria-label={p("recent.imageAlt", { parcel: RECENT_PARCEL.parcelNumber })}
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${RECENT_PARCEL.imageUrl}')` }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-surface/20 group-hover:bg-surface/0 transition-colors"
                  />
                  <p className="absolute bottom-2 right-2 bg-surface/90 backdrop-blur text-on-surface text-[10px] px-2 py-1 rounded shadow font-bold uppercase">
                    {p("recent.gisLayer")}
                  </p>
                </div>

                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="bg-primary-container text-on-primary-container font-label-md px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        {label("verification_status", RECENT_PARCEL.verificationStatus)}
                      </span>
                      <span className="font-tabular-nums text-on-surface-variant text-sm tracking-wider font-semibold">
                        {p("recent.ulpinLabel")}: {RECENT_PARCEL.ulpin}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-on-surface mb-4 font-bold">
                      {p("recent.parcelHeading", {
                        parcel: RECENT_PARCEL.parcelNumber,
                        khasra: RECENT_PARCEL.khasra,
                      })}
                    </h3>
                    <dl className="grid grid-cols-2 gap-y-4 gap-x-8">
                      {[
                        { key: "owner", value: RECENT_PARCEL.owner, numeric: false },
                        { key: "area", value: areaWithBigha, numeric: true },
                        {
                          key: "landType",
                          value: label("land_type", RECENT_PARCEL.landType),
                          numeric: false,
                        },
                        {
                          key: "encumbrances",
                          value: label("encumbrance_status", RECENT_PARCEL.encumbranceStatus),
                          numeric: false,
                          tone: "text-status-success font-semibold",
                        },
                      ].map((field) => (
                        <div key={field.key}>
                          <dt className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider mb-1 font-bold">
                            {p(`recent.${field.key}`)}
                          </dt>
                          <dd
                            className={`font-body-md text-on-surface ${
                              field.numeric ? "font-tabular-nums font-semibold" : ""
                            } ${field.tone || ""}`}
                          >
                            {field.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-gutter">
            <section
              aria-labelledby="apps-heading"
              className="bg-surface-container-lowest shadow-sm rounded-2xl p-6 relative overflow-hidden"
            >
              <div
                aria-hidden="true"
                className="absolute -left-10 -bottom-10 w-40 h-40 bg-secondary-container rounded-full blur-3xl opacity-30"
              />
              <div className="flex items-center justify-between mb-6 relative z-10 gap-3">
                <h2
                  id="apps-heading"
                  className="font-headline-md text-on-surface flex items-center gap-2 font-bold"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">
                    folder_open
                  </span>
                  {p("applications.heading")}
                </h2>
                <button
                  type="button"
                  onClick={() => navigate(CITIZEN_ROUTES.myApplications)}
                  aria-label={p("applications.more")}
                  className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer shrink-0"
                >
                  <span aria-hidden="true" className="material-symbols-outlined">
                    more_horiz
                  </span>
                </button>
              </div>

              <ul className="flex flex-col gap-4 relative z-10">
                {APPLICATIONS.map((app) => {
                  const statusName = label("application_status", app.status);
                  const serviceName = label("service_type", app.serviceType);
                  return (
                    <li key={app.id}>
                      <button
                        type="button"
                        onClick={() => navigate(CITIZEN_ROUTES.myApplications)}
                        className="w-full text-left p-4 rounded-xl bg-surface hover:bg-surface-container transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/30"
                      >
                        <span className="flex justify-between items-start mb-2 gap-3">
                          <span className="font-tabular-nums text-[12px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
                            {app.number}
                          </span>
                          <span
                            className={`flex items-center gap-1.5 text-label-md px-2 py-1 rounded-full text-xs font-bold shrink-0 ${
                              app.live
                                ? "text-secondary bg-secondary/10"
                                : "text-status-success bg-status-success/10"
                            }`}
                          >
                            {app.live ? (
                              <span
                                aria-hidden="true"
                                className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"
                              />
                            ) : (
                              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                                check_circle
                              </span>
                            )}
                            {statusName}
                          </span>
                        </span>
                        <span className="block font-headline-md text-on-surface text-[16px] mb-1 group-hover:text-primary transition-colors font-bold">
                          {serviceName}
                        </span>
                        <span className="block font-body-sm text-on-surface-variant mb-3">
                          {app.noteKey
                            ? p(`applications.${app.noteKey}`)
                            : p("applications.submittedFor", { parcel: app.parcel })}
                        </span>
                        {app.live ? (
                          <span aria-hidden="true" className="block w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                            <span
                              className="block h-full bg-primary rounded-full"
                              style={{ width: `${(app.stagesDone / app.stagesTotal) * 100}%` }}
                            />
                          </span>
                        ) : null}
                        <span className="sr-only">
                          {p("applications.rowSummary", {
                            number: app.number,
                            type: serviceName,
                            status: statusName,
                          })}
                          {app.live
                            ? ` ${p("applications.progress", {
                                done: formatNumber(app.stagesDone),
                                total: formatNumber(app.stagesTotal),
                              })}`
                            : ""}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={() => navigate(CITIZEN_ROUTES.myApplications)}
                className="relative z-10 w-full py-3 mt-4 font-label-md text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors flex items-center justify-center gap-2 font-bold cursor-pointer"
              >
                {p("applications.viewAll")}
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </section>

            <section
              aria-labelledby="help-heading"
              className="bg-surface-container-lowest shadow-sm rounded-2xl p-6 mt-auto overflow-hidden relative group"
            >
              <div
                aria-hidden="true"
                className="absolute right-0 top-0 w-32 h-32 bg-primary text-on-primary rounded-bl-[100px] flex items-start justify-end p-4 transition-transform duration-500 group-hover:scale-110 origin-top-right"
              >
                <span className="material-symbols-outlined text-[40px] opacity-20">help</span>
              </div>
              <div className="relative z-10 w-3/4">
                <h2 id="help-heading" className="font-headline-md text-on-surface mb-2 font-bold">
                  {p("help.heading")}
                </h2>
                <p className="font-body-sm text-on-surface-variant mb-6 leading-relaxed">{p("help.body")}</p>
                <button
                  type="button"
                  onClick={() => navigate(CITIZEN_ROUTES.helpSupport)}
                  className="text-primary font-label-md flex items-center gap-2 hover:underline underline-offset-4 decoration-primary/50 font-bold cursor-pointer uppercase"
                >
                  {p("help.cta")}
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                    open_in_new
                  </span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
