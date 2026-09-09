/*
 * Step one of the citizen mutation wizard: pick a service type.
 *
 * The four cards were `<div className="cursor-pointer">` wrappers with a
 * "START APPLICATION" <button> nested inside, so the part that looked clickable
 * was not the part that was, and neither did anything -- the page had no state
 * at all. Each card is now the button, and choosing one drives the
 * required-documents panel beside it.
 *
 * That panel was also a second, shorter copy of the same list: three <details>
 * sections (Sale / Transfer, Inheritance, Correction) against four cards, so
 * Gift/Partition had no documented requirements anywhere. Both now read from one
 * SERVICES fixture. The first section carried `open=""` as well, which is the
 * empty string and therefore falsy in JSX -- it was never actually open.
 *
 * The profile card asked for <img src="/src/assets/logo.jpeg">: a dev-server
 * path rather than a public/ asset, so it 404s in a built bundle. It shows
 * initials instead, as the officer roster does.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InterpolatedText from "../../components/InterpolatedText";
import { useI18n } from "../../i18n";
import { registryServicePath } from "../../registry/routes.js";

/* Same citizen the navbar and My Applications already name. */
const CITIZEN = { name: "Priya Sharma", id: "29481-C" };

// The wizard's remaining four steps are not built, so the counter states where
// this page sits rather than pretending to navigate.
const STEP = { current: 1, total: 5 };
const MAX_UPLOAD_MB = 5;

/*
 * `docs` lists which document keys to read out of the service's catalog entry.
 * The catalogs hold them as a named map because t() resolves strings only, so
 * the order lives here and the wording lives there. `hasBadge` is a flag rather
 * than a probe for the key, so a service without one does not look like a
 * missing translation in the console.
 */
const SERVICES = [
  {
    key: "sale",
    icon: "handshake",
    docs: ["deed", "tax", "identity", "photo"],
    hasBadge: true,
    tint: "bg-primary-container text-on-primary-container",
    ring: "hover:border-primary-fixed",
    selectedRing: "border-primary ring-2 ring-primary/30",
    corner: "absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full",
  },
  {
    key: "inheritance",
    icon: "family_history",
    docs: ["death", "heir", "affidavit"],
    tint: "bg-tertiary-container text-on-tertiary-container",
    ring: "hover:border-tertiary-fixed",
    selectedRing: "border-tertiary-container ring-2 ring-tertiary-container/30",
    corner: "absolute right-0 bottom-0 w-40 h-40 bg-tertiary-fixed/10 rounded-tl-full",
  },
  {
    key: "giftPartition",
    icon: "pie_chart",
    docs: ["deed", "consent", "identity"],
    tint: "bg-secondary-container text-on-secondary-container",
    ring: "hover:border-secondary-fixed",
    selectedRing: "border-secondary-container ring-2 ring-secondary-container/30",
    corner: "absolute left-0 bottom-0 w-24 h-48 bg-secondary-fixed/20 blur-xl",
  },
  {
    key: "correction",
    icon: "edit_document",
    docs: ["records", "order", "application"],
    hasBadge: true,
    tint: "bg-error-container text-on-error-container",
    ring: "hover:border-error-container",
    selectedRing: "border-error-container ring-2 ring-error-container/40",
    corner: "absolute left-0 top-0 bottom-0 w-1 bg-error-container opacity-50",
  },
];

const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export default function LandServices() {
  const navigate = useNavigate();
  const { t, formatNumber } = useI18n();
  const p = (key, vars) => t(`pages.landServices.${key}`, vars);

  // Sale/Transfer is preselected because it is the common case, and because the
  // documents panel would otherwise open empty.
  const [selectedKey, setSelectedKey] = useState(SERVICES[0].key);
  const selected = SERVICES.find((service) => service.key === selectedKey) ?? SERVICES[0];
  const title = (service) => p(`services.${service.key}.title`);

  return (
    <main className="w-full pt-16 bg-surface min-h-screen">
      <div className="flex flex-col w-full relative">
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-fixed/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-secondary-fixed/30 rounded-full blur-[120px] mix-blend-multiply opacity-70" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop py-8 lg:py-12 flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:flex-1 flex flex-col gap-8">
            <div className="flex flex-col gap-2 mb-2">
              <div className="inline-flex items-center gap-2 bg-surface-container-high w-max px-3 py-1 rounded-full shadow-sm">
                <span aria-hidden="true" className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-label-md text-on-surface uppercase tracking-wider text-[10px]">
                  {p("step", {
                    current: formatNumber(STEP.current),
                    total: formatNumber(STEP.total),
                  })}
                </span>
              </div>
              <h1 className="font-display text-display text-on-surface">{p("title")}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">
                {p("intro")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {SERVICES.map((service) => {
                const active = service.key === selected.key;
                return (
                  <button
                    key={service.key}
                    type="button"
                    aria-pressed={active}
                    aria-label={p("selectService", { title: title(service) })}
                    onClick={() => setSelectedKey(service.key)}
                    className={`group relative flex flex-col justify-between text-left bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full min-h-[240px] border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      active ? service.selectedRing : `border-transparent ${service.ring}`
                    }`}
                  >
                    <div
                      aria-hidden="true"
                      className={`${service.corner} transition-transform group-hover:scale-110`}
                    />
                    <div className="relative z-10 flex flex-col gap-4">
                      <div
                        aria-hidden="true"
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${service.tint}`}
                      >
                        <span
                          className="material-symbols-outlined text-[28px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {service.icon}
                        </span>
                      </div>
                      <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-1">
                          {title(service)}
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          {p(`services.${service.key}.description`)}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 mt-6 pt-4 flex items-center justify-between gap-2 border-t border-outline-variant/30 group-hover:border-primary/20 transition-colors">
                      <span
                        aria-hidden="true"
                        className={`inline-flex items-center gap-2 font-label-md ${
                          active ? "text-primary" : "text-on-surface"
                        }`}
                      >
                        {active ? p("selectedService") : t("common.actions.continueAction")}
                        <span className="material-symbols-outlined text-[16px]">
                          {active ? "check_circle" : "arrow_forward"}
                        </span>
                      </span>
                      {service.hasBadge ? (
                        <span className="font-label-md text-on-surface-variant bg-surface-container px-2 py-0.5 rounded text-[10px]">
                          {p(`services.${service.key}.badge`)}
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex items-center gap-4 relative overflow-hidden hover:shadow-md transition-shadow">
              <div
                aria-hidden="true"
                className="w-16 h-16 rounded-full shrink-0 border-2 border-surface bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg shadow-sm"
              >
                {initials(CITIZEN.name)}
              </div>
              <div className="flex flex-col">
                <h2 className="font-headline-md text-body-lg font-semibold text-on-surface">
                  {CITIZEN.name}
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant font-tabular-nums">
                  {p("profile.citizenId", { id: CITIZEN.id })}
                </p>
                <p className="mt-1 flex items-center gap-1 text-[10px] text-primary font-medium bg-primary-fixed/30 px-2 py-0.5 rounded w-max">
                  <span aria-hidden="true" className="material-symbols-outlined text-[12px]">
                    verified
                  </span>
                  {p("profile.kycVerified")}
                </p>
              </div>
            </div>

            {/*
              * One panel driven by the selected card, in place of the three
              * hand-written <details> sections that covered only three of the
              * four services. aria-live tells a screen reader the contents
              * changed when a different card is chosen.
              */}
            <div
              aria-live="polite"
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm sticky top-24"
            >
              <div className="flex items-center gap-3 mb-2">
                <span aria-hidden="true" className="material-symbols-outlined text-primary">
                  folder_open
                </span>
                <h2 className="font-headline-md text-[18px] text-on-surface">
                  {p("documents.heading")}
                </h2>
              </div>
              <p className="font-label-md text-label-md text-primary uppercase tracking-wider mb-4">
                {p("documents.forService", { title: title(selected) })}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                {p("documents.intro", {
                  size: `${formatNumber(MAX_UPLOAD_MB)} ${t("common.units.megabyte")}`,
                })}
              </p>

              <ul className="space-y-2">
                {selected.docs.map((doc) => (
                  <li key={doc} className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[16px] text-on-surface-variant mt-0.5"
                    >
                      description
                    </span>
                    {p(`services.${selected.key}.docs.${doc}`)}
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-surface-container rounded-xl flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-on-surface-variant text-[20px] mt-0.5"
                >
                  info
                </span>
                <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                  {/*
                    * The help centre is not a route this build ships, so the
                    * sentence keeps its link shape as a button rather than an
                    * href="#" that scrolls the page to the top.
                    */}
                  <InterpolatedText
                    template={p("documents.help")}
                    values={{
                      link: (
                        <button
                          type="button"
                          className="text-primary underline hover:text-on-surface transition-colors"
                        >
                          {p("documents.helpCentre")}
                        </button>
                      ),
                    }}
                  />
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(registryServicePath(selected.key, "parcel"))}
                className="mt-5 w-full bg-primary text-on-primary rounded-xl px-5 py-3 font-label-caps text-label-caps uppercase tracking-wide hover:opacity-90 transition-opacity"
              >
                {t("common.actions.continueAction")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
