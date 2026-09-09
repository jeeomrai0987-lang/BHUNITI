/*
 * The governance model page: four operational tiers, the RBAC decision tree and
 * three strategic-alignment notes.
 *
 * Six defects were fixed while translating it:
 *
 *  1. Every string was hard-coded English, including the five captions inside
 *     the SVG decision tree.
 *  2. The decision tree was an unlabelled <svg>, so a screen reader announced
 *     nothing at all where the diagram sits. It is role="img" with a name now.
 *  3. `patternunits` was misspelt -- SVG in JSX needs the camelCase
 *     `patternUnits` -- so the grid pattern fell back to objectBoundingBox
 *     units and never tiled.
 *  4. The four tier cards were `cursor-pointer` but had no click handler and no
 *     destination, promising an interaction that does not exist.
 *  5. The watermark icons, tier ordinals, the gradient scrim and the photo
 *     backdrop were all exposed to assistive tech as content.
 *  6. Each capability bullet repeated a "check_circle" ligature that was read
 *     out as literal text before the capability itself.
 *
 * The four cards and the three alignment notes were four and three copies of
 * the same markup; both are generated from a list now.
 */

import { useI18n } from "../../i18n";

const TIERS = [
  {
    key: "citizen",
    ordinal: "1",
    icon: "person",
    watermark: "text-primary",
    badge: "bg-primary-fixed",
    ordinalColour: "text-on-primary-fixed",
  },
  {
    key: "revenue",
    ordinal: "2",
    icon: "edit_document",
    watermark: "text-secondary",
    badge: "bg-secondary-fixed",
    ordinalColour: "text-on-secondary-fixed",
  },
  {
    key: "district",
    ordinal: "3",
    icon: "gavel",
    watermark: "text-tertiary",
    badge: "bg-tertiary-fixed",
    ordinalColour: "text-on-tertiary-fixed",
  },
  {
    key: "administration",
    ordinal: "4",
    icon: "admin_panel_settings",
    watermark: "text-primary",
    badge: "bg-primary-fixed",
    ordinalColour: "text-on-primary-fixed",
  },
];

const ALIGNMENT = [
  { key: "dilrmp", icon: "domain_verification" },
  { key: "sovereignty", icon: "security" },
  { key: "transparency", icon: "handshake" },
];

const ALIGNMENT_PHOTO =
  "url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200')";

export default function Governance() {
  const { t } = useI18n();
  const p = (key, vars) => t(`pages.governance.${key}`, vars);

  return (
    <main className="w-full pt-20">
      <div className="flex flex-col w-full bg-background min-h-full">
        {/* Header */}
        <section className="w-full max-w-[1440px] mx-auto px-margin-desktop py-16 lg:py-24">
          <div className="max-w-4xl">
            <h1 className="font-display text-display text-primary mb-6">
              {p("hero.titleLead")}
              <br />
              {p("hero.titleMain")}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">
              {p("hero.lede")}
            </p>
          </div>
        </section>

        {/* Section 01: Operational tiers */}
        <section className="w-full max-w-[1440px] mx-auto px-margin-desktop mb-24">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase font-bold">
              {p("sections.tiers")}
            </span>
            <div aria-hidden="true" className="h-[1px] flex-grow bg-border-subtle" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((tier) => (
              /*
               * A card, not a control: the hover treatment stays, the pointer
               * cursor does not, because there is nowhere to click through to.
               */
              <div
                key={tier.key}
                className="bg-surface-white rounded-2xl shadow-sm border border-border-subtle p-6 flex flex-col h-full transition-all duration-300 relative overflow-hidden group hover:bg-slate-950 hover:border-slate-800 hover:shadow-2xl hover:scale-[1.02]"
              >
                <div
                  aria-hidden="true"
                  className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
                >
                  <span
                    className={`material-symbols-outlined text-[64px] ${tier.watermark} group-hover:text-white transition-colors`}
                  >
                    {tier.icon}
                  </span>
                </div>

                <div
                  aria-hidden="true"
                  className={`w-10 h-10 rounded-full ${tier.badge} group-hover:bg-white/20 flex items-center justify-center mb-6 relative z-10 transition-colors`}
                >
                  <span
                    className={`font-tabular-nums text-tabular-nums ${tier.ordinalColour} group-hover:text-white font-bold`}
                  >
                    {tier.ordinal}
                  </span>
                </div>

                <h3 className="font-headline-md text-headline-md text-primary group-hover:text-white font-bold mb-3 relative z-10 transition-colors">
                  {p(`tiers.${tier.key}.name`)}
                </h3>

                <p className="font-body-md text-body-md text-on-surface-variant group-hover:text-slate-300 flex-grow relative z-10 transition-colors leading-relaxed">
                  {p(`tiers.${tier.key}.summary`)}
                </p>

                <div className="mt-6 pt-4 border-t border-border-subtle group-hover:border-slate-800 relative z-10 transition-colors">
                  <span className="font-label-caps text-label-caps text-secondary group-hover:text-emerald-400 font-bold uppercase block mb-2 transition-colors">
                    {p("capabilities")}
                  </span>
                  <ul className="space-y-1.5">
                    {["first", "second"].map((slot) => (
                      <li
                        key={slot}
                        className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-slate-200 flex items-center gap-2 transition-colors"
                      >
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[16px] text-status-success"
                        >
                          check_circle
                        </span>
                        {p(`tiers.${tier.key}.${slot}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 02: Architecture of trust (RBAC decision tree) */}
        <section className="w-full bg-surface-white py-24 border-y border-border-subtle">
          <div className="max-w-[1440px] mx-auto px-margin-desktop">
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="lg:w-1/3 flex flex-col justify-center">
                <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase mb-4 font-bold">
                  {p("sections.trust")}
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary mb-6">
                  {p("rbac.heading")}
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 leading-relaxed">
                  {p("rbac.body")}
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
                  {p("rbac.detail")}
                </p>
              </div>

              <div className="lg:w-2/3 bg-surface-container-lowest border border-border-subtle rounded-2xl p-8 shadow-sm relative overflow-hidden">
                {/*
                 * The node captions are real text, so the whole diagram is
                 * named once and the boxes are sized for the longer Hindi
                 * captions.
                 */}
                <svg
                  role="img"
                  aria-label={p("rbac.diagramLabel")}
                  className="w-full h-[400px]"
                  fill="none"
                  viewBox="0 0 800 400"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                    </pattern>
                    <linearGradient gradientUnits="userSpaceOnUse" id="flow" x1="0" x2="800" y1="0" y2="0">
                      <stop offset="0%" stopColor="#0058be" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#0058be" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0b1c30" />
                    </linearGradient>
                  </defs>
                  <rect fill="url(#grid)" height="400" width="800" />

                  <path className="animate-[dash_20s_linear_infinite]" d="M 150 200 C 300 200, 300 100, 450 100" fill="none" stroke="url(#flow)" strokeDasharray="6 6" strokeWidth="3" />
                  <path className="animate-[dash_20s_linear_infinite]" d="M 150 200 C 300 200, 300 300, 450 300" fill="none" stroke="url(#flow)" strokeDasharray="6 6" strokeWidth="3" />
                  <path d="M 450 100 C 550 100, 550 200, 650 200" fill="none" stroke="url(#flow)" strokeWidth="4" />
                  <path d="M 450 300 C 550 300, 550 200, 650 200" fill="none" stroke="url(#flow)" strokeWidth="4" />
                  <path d="M 650 200 L 750 200" fill="none" stroke="#0b1c30" strokeWidth="5" />

                  <circle cx="150" cy="200" fill="#ffffff" r="24" stroke="#e2e8f0" strokeWidth="2" />
                  <circle cx="150" cy="200" fill="#0058be" r="12" />
                  <text fill="#45464d" fontFamily="Inter" fontSize="12" fontWeight="600" textAnchor="middle" x="150" y="245">
                    {p("rbac.nodes.initiate")}
                  </text>

                  <rect fill="#ffffff" height="40" rx="4" stroke="#e2e8f0" strokeWidth="2" width="120" x="390" y="80" />
                  <text fill="#0058be" fontFamily="Inter" fontSize="12" fontWeight="600" textAnchor="middle" x="450" y="104">
                    {p("rbac.nodes.verifyGis")}
                  </text>

                  <rect fill="#ffffff" height="40" rx="4" stroke="#e2e8f0" strokeWidth="2" width="120" x="390" y="280" />
                  <text fill="#0058be" fontFamily="Inter" fontSize="12" fontWeight="600" textAnchor="middle" x="450" y="304">
                    {p("rbac.nodes.legalCheck")}
                  </text>

                  <polygon fill="#ffffff" points="650,170 680,200 650,230 620,200" stroke="#0b1c30" strokeWidth="2" />
                  <circle cx="650" cy="200" fill="#0b1c30" r="8" />
                  <text fill="#191c1d" fontFamily="Inter" fontSize="12" fontWeight="600" textAnchor="middle" x="650" y="250">
                    {p("rbac.nodes.approve")}
                  </text>

                  <rect fill="#000000" height="40" rx="4" width="78" x="720" y="180" />
                  <text fill="#ffffff" fontFamily="Inter" fontSize="12" fontWeight="600" textAnchor="middle" x="759" y="204">
                    {p("rbac.nodes.commit")}
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Section 03: Strategic alignment */}
        <section className="w-full max-w-[1440px] mx-auto px-margin-desktop py-24">
          <div className="flex items-center gap-4 mb-12">
            <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase font-bold">
              {p("sections.alignment")}
            </span>
            <div aria-hidden="true" className="h-[1px] flex-grow bg-border-subtle" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-lg border border-border-subtle">
              {/* Photography and scrim: the heading below carries the meaning. */}
              <div
                aria-hidden="true"
                className="bg-cover bg-center w-full h-full"
                style={{ backgroundImage: ALIGNMENT_PHOTO }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent"
              />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="inline-flex items-center gap-2 bg-surface-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-surface-white/30">
                  <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-surface-white">
                    flag
                  </span>
                  <span className="font-label-caps text-label-caps text-surface-white uppercase tracking-wider font-bold">
                    {p("alignment.badge")}
                  </span>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-surface-white mb-2 font-bold">
                  {p("alignment.imageHeading")}
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              {ALIGNMENT.map((item, index) => (
                <div key={item.key} className="flex flex-col gap-8">
                  {index > 0 && <div aria-hidden="true" className="w-full h-[1px] bg-border-subtle" />}
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary mb-3 flex items-center gap-3 font-bold">
                      <span aria-hidden="true" className="material-symbols-outlined text-secondary">
                        {item.icon}
                      </span>
                      {p(`alignment.${item.key}.heading`)}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      {p(`alignment.${item.key}.body`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
