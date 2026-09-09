/*
 * The institution profile: the mission statement, the fragmentation argument,
 * the technology stack and the administrative contact form.
 *
 * Seven defects were fixed while translating it:
 *
 *  1. Every string was hard-coded English. This was the last page in the app
 *     still readable in one language only.
 *  2. The banner photograph was a bare background div, so it announced nothing
 *     at all; it carries role="img" and a name now.
 *  3. Both argument sketches were an <svg> with no accessible name, so the
 *     point each one makes was available to sighted readers only.
 *  4. The two facing cards carried cursor-pointer while being plain <div>s,
 *     promising a click that was never wired to anything.
 *  5. The 120px watermark icons, the rules, the scrim and the gradient washes
 *     were all exposed to a screen reader as stray ligature words.
 *  6. "Submit administrative request" had no handler, and the <form>'s only job
 *     was to swallow its own submit. The button submits the form now, Enter
 *     works, and the live region says plainly that this build routes nothing.
 *  7. The three input placeholders were the only copy on the page the
 *     translator could not reach, because they were attributes.
 */

import { useEffect, useState } from "react";
import { useI18n } from "../../i18n";

const BANNER =
  "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-k25vXHNHetwYNwwybT0Zk-uQLrkZ42yk88JdIWhLCf4hXEP1kPnSh8Y&s=10')";

/* An address is not translatable text, so it stays here and not in a catalog. */
const CONTACT_EMAIL = "governance@bhuniti.gov.in";

/* How long the confirmation stays up, matching the officer portals. */
const TOAST_MS = 4000;

/* The processing gain quoted in the governance objective. */
const PROCESSING_GAIN = 60;

const LABEL_CLASS =
  "font-label-caps text-label-caps text-on-surface uppercase font-bold";
const FIELD_CLASS =
  "bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-3 text-body-md focus:outline-none focus:border-primary transition-colors text-on-surface";
const CARD_CLASS =
  "bg-surface-white rounded-3xl p-8 md:p-10 border border-border-subtle shadow-sm hover:shadow-2xl hover:scale-[1.02] hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group";
const PILLAR_CLASS =
  "bg-surface-white rounded-2xl p-8 flex flex-col shadow-md relative overflow-hidden group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-border-subtle";

/* The three technology pillars, so the copy comes from one place. */
const PILLARS = [
  { key: "spatial", icon: "layers", watermark: "satellite_alt" },
  { key: "algorithmic", icon: "memory", watermark: "analytics" },
  { key: "resilient", icon: "dns", watermark: "cloud_done" },
];

/* The three single-line fields; the statement textarea is spelt out below. */
const FIELDS = [
  { key: "department", id: "about-department", wide: false },
  { key: "designation", id: "about-designation", wide: false },
  { key: "subject", id: "about-subject", wide: true },
];

export default function About() {
  const { t, formatNumber } = useI18n();
  const a = (key, vars) => t(`pages.about.${key}`, vars);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleSubmit(event) {
    event.preventDefault();
    setToast({ text: a("form.toast"), at: Date.now() });
  }

  const processingGain = `${formatNumber(PROCESSING_GAIN)}${t("common.units.percent")}`;

  return (
    <main className="w-full pt-20">
      <div className="flex flex-col w-full">
        {/* Hero */}
        <section className="w-full relative px-margin-mobile md:px-margin-desktop py-24 bg-surface-white">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 relative z-10">
            <div className="lg:col-span-12 flex flex-col items-center text-center mb-16">
              <div className="px-4 py-1 bg-primary/5 rounded-full inline-flex items-center justify-center mb-8">
                <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase font-bold">
                  {a("hero.badge")}
                </span>
              </div>
              <h1 className="font-display text-display text-on-surface mb-6 max-w-4xl mx-auto leading-tight font-bold">
                {a("hero.heading")}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                {a("hero.lede")}
              </p>
            </div>

            {/* The photograph is content, so it gets a name of its own. */}
            <div className="lg:col-span-12 w-full h-[614px] min-h-[400px] mb-24 rounded-3xl overflow-hidden relative shadow-lg border border-border-subtle group">
              <div
                role="img"
                aria-label={a("hero.banner")}
                className="w-full h-full bg-cover bg-center absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: BANNER, backgroundPosition: "center center" }}
              />
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-surface-white via-surface-white/40 to-transparent z-10"
              />
            </div>
          </div>
        </section>

        {/* The challenge, the two facing arguments and the pillars */}
        <section className="w-full px-margin-mobile md:px-margin-desktop py-24 bg-surface-container-lowest">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-4 flex flex-col gap-8 sticky top-32 h-fit">
              <div aria-hidden="true" className="w-16 h-1 bg-primary mb-2" />
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                {a("challenge.heading")}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {a("challenge.body")}
              </p>
              <div className="w-full bg-surface-container rounded-2xl p-6 mt-4 shadow-sm border border-border-subtle">
                <div className="flex items-center gap-4 mb-4">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-primary text-3xl"
                  >
                    account_balance
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    {a("challenge.objectiveHeading")}
                  </h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {a("challenge.objectiveBody", { share: processingGain })}
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 01. Fragmented reality */}
                <div className={CARD_CLASS}>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary mb-4 flex items-center gap-3 font-bold transition-colors">
                      <span className="text-primary font-tabular-nums text-headline-md">
                        {a("synthesis.fragmented.ordinal")}
                      </span>
                      {a("synthesis.fragmented.heading")}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-8">
                      {a("synthesis.fragmented.body")}
                    </p>
                  </div>

                  <div className="h-48 w-full rounded-2xl bg-surface-container flex items-center justify-center p-6 relative overflow-hidden shadow-inner group-hover:scale-[1.02] transition-transform duration-300 border border-border-subtle/50">
                    <svg
                      role="img"
                      aria-label={a("synthesis.fragmented.diagram")}
                      className="w-full h-full text-outline-variant/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 400 200"
                    >
                      <path d="M50 100 Q 150 50, 250 100 T 350 150" strokeDasharray="4 4" strokeWidth="2" />
                      <circle cx="50" cy="100" fill="currentColor" r="4" />
                      <circle cx="250" cy="100" fill="currentColor" r="4" />
                      <circle cx="350" cy="150" fill="currentColor" r="4" />
                      <path className="text-error/40" d="M50 150 L 150 150 L 150 50" strokeWidth="1.5" />
                      <path className="text-error/40" d="M250 50 L 350 50 L 350 150" strokeWidth="1.5" />
                    </svg>
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-r from-surface-container/60 via-transparent to-surface-container/60 pointer-events-none"
                    />
                  </div>
                </div>

                {/* 02. Unified synthesis */}
                <div className={CARD_CLASS}>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary mb-4 flex items-center gap-3 font-bold transition-colors">
                      <span className="text-primary font-tabular-nums text-headline-md">
                        {a("synthesis.unified.ordinal")}
                      </span>
                      {a("synthesis.unified.heading")}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-8">
                      {a("synthesis.unified.body")}
                    </p>
                  </div>

                  <div className="h-48 w-full rounded-2xl bg-primary/5 flex items-center justify-center p-6 relative overflow-hidden shadow-sm group-hover:scale-[1.02] transition-transform duration-300 border border-primary/20">
                    <svg
                      role="img"
                      aria-label={a("synthesis.unified.diagram")}
                      className="w-full h-full text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 400 200"
                    >
                      <path d="M50 100 L 350 100" strokeWidth="2.5" />
                      <circle className="text-secondary" cx="50" cy="100" fill="currentColor" r="6" />
                      <circle className="text-primary" cx="200" cy="100" fill="currentColor" r="8" />
                      <circle className="text-secondary" cx="350" cy="100" fill="currentColor" r="6" />
                      <path className="text-primary/40" d="M200 50 L 200 150" strokeWidth="2" />
                      <path className="text-primary/20" d="M150 100 L 250 100" strokeWidth="4" />
                    </svg>
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              <div aria-hidden="true" className="w-full h-[1px] bg-border-subtle my-4" />

              {/* Technological foundation */}
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4">
                  <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase font-bold">
                    {a("foundation.eyebrow")}
                  </span>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                    {a("foundation.heading")}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {PILLARS.map((pillar) => (
                    <div key={pillar.key} className={PILLAR_CLASS}>
                      <div
                        aria-hidden="true"
                        className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500"
                      >
                        <span className="material-symbols-outlined text-[120px] text-primary">
                          {pillar.watermark}
                        </span>
                      </div>
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-secondary text-4xl mb-6 relative z-10"
                      >
                        {pillar.icon}
                      </span>
                      <h4 className="font-headline-md text-headline-md text-on-surface mb-3 relative z-10 font-bold">
                        {a(`foundation.${pillar.key}.heading`)}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant relative z-10 leading-relaxed">
                        {a(`foundation.${pillar.key}.body`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Institutional contact */}
        <section className="w-full px-margin-mobile md:px-margin-desktop py-24 bg-surface">
          <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-16">
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                {a("contact.heading")}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {a("contact.body")}
              </p>
              <div className="flex flex-col gap-6 mt-4">
                <div className="flex items-start gap-4">
                  <div
                    aria-hidden="true"
                    className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-primary text-xl">
                      location_on
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 font-bold">
                      {a("contact.headquarters")}
                    </span>
                    <span className="font-body-md text-body-md text-on-surface">
                      {a("contact.headquartersValue")}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    aria-hidden="true"
                    className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-primary text-xl">
                      mail
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 font-bold">
                      {a("contact.communications")}
                    </span>
                    {/* The address was plain text, so it could not be used. */}
                    <a
                      className="font-body-md text-body-md text-on-surface hover:text-primary"
                      href={`mailto:${CONTACT_EMAIL}`}
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-2/3 bg-surface-white border border-border-subtle rounded-3xl p-8 md:p-12 shadow-sm">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-6 font-bold">
                {a("form.heading")}
              </h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                {FIELDS.map((field) => (
                  <div
                    key={field.key}
                    className={`flex flex-col gap-2 ${field.wide ? "md:col-span-2" : ""}`}
                  >
                    <label className={LABEL_CLASS} htmlFor={field.id}>
                      {a(`form.${field.key}`)}
                    </label>
                    <input
                      className={FIELD_CLASS}
                      id={field.id}
                      placeholder={a(`form.${field.key}Placeholder`)}
                      type="text"
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className={LABEL_CLASS} htmlFor="about-message">
                    {a("form.message")}
                  </label>
                  <textarea
                    className={`${FIELD_CLASS} resize-none`}
                    id="about-message"
                    placeholder={a("form.messagePlaceholder")}
                    rows={4}
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-4 bg-primary text-on-primary font-label-caps text-label-caps uppercase rounded-xl hover:bg-surface-tint transition-all shadow-md font-bold cursor-pointer"
                  >
                    {a("form.submit")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* The routing endpoint is not connected; the live region says so. */}
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 right-4 z-[70] pointer-events-none"
      >
        {toast ? (
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-2xl max-w-xs">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-[18px] text-primary-fixed"
            >
              info
            </span>
            <p className="font-body-md text-[12px] leading-snug">{toast.text}</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
