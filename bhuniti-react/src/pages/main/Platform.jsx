import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n";
import {
  CITIZEN_ROUTES,
  REVENUE_ROUTES,
  ADMIN_ROUTES,
  MAIN_ROUTES,
  REGISTRY_ROUTES,
  registryServicePath,
} from "../../routes";
import { api } from "../../services/api";

const DEMO_ROLES = [
  {
    username: "citizen",
    roleKey: "citizen",
    roleName: "Citizen",
    defaultPassword: "1234",
  },
  {
    username: "revenue_officer",
    roleKey: "revenue_officer",
    roleName: "Revenue Officer",
    defaultPassword: "1234",
  },
  {
    username: "district_officer",
    roleKey: "district_officer",
    roleName: "District Officer",
    defaultPassword: "1234",
  },
];

/*
 * Chip colour per demo role, keyed on the username rather than the visible role
 * name so translating the label cannot lose the styling. Written out in full
 * because Tailwind only emits classes it can read as literals in the source.
 */
const CHIP_TONE = {
  citizen: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  revenue_officer: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
  district_officer: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
};

/*
 * Keyed on stable module ids, not on the visible titles. The titles are
 * translated copy now, and a route table keyed on English prose stops resolving
 * the moment the page is read in Hindi -- every module would have fallen back
 * to the citizen portal.
 */
const MODULE_ROUTES = {
  gis: {
    revenue_officer: REVENUE_ROUTES.gisExplorer,
    district_officer: ADMIN_ROUTES.districtGis,
    citizen: CITIZEN_ROUTES.searchRecords,
  },
  ai: {
    revenue_officer: REVENUE_ROUTES.discrepancyCases,
    district_officer: ADMIN_ROUTES.reconciliationMonitor,
    citizen: CITIZEN_ROUTES.portal,
  },
  audit: {
    revenue_officer: REVENUE_ROUTES.auditTrail,
    district_officer: ADMIN_ROUTES.overview,
    citizen: CITIZEN_ROUTES.portal,
  },
};

/*
 * Modules that are a real destination rather than a role-dependent dashboard
 * view. These skip the demo sign-in entirely: tapping the card opens the thing
 * itself.
 *
 * Digital Registry is the one such module. Its card used to send you to Search
 * Records, the revenue overview or Tehsil Analytics depending on which demo
 * account you picked -- three pages, none of which is a registry -- because at
 * the time there was nothing else to point at. The wizard now lives at
 * /registry, so the card points at the wizard. `registry` is deliberately
 * absent from MODULE_ROUTES above: it can no longer reach the modal, and a
 * fallback nobody can trigger is just a claim that rots.
 */
const DIRECT_MODULE_ROUTES = {
  registry: registryServicePath('sale', 'parcel'),
};

/*
 * The ecosystem orb is a schematic rather than a chart: the glyphs are Latin
 * acronyms sized to fit inside 28px circles, so they stay put in every language
 * and the meaning is carried by the description a screen reader hears instead.
 */
const ORB_NODES = [
  { id: "gis", glyph: "GIS", cx: 100, cy: 40, size: 8, ring: "stroke-secondary", ink: "fill-secondary" },
  { id: "ai", glyph: "AI", cx: 160, cy: 100, size: 8, ring: "stroke-primary", ink: "fill-primary" },
  { id: "ledger", glyph: "LEDGER", cx: 100, cy: 160, size: 6, ring: "stroke-primary", ink: "fill-primary" },
  { id: "registry", glyph: "REG", cx: 40, cy: 100, size: 8, ring: "stroke-primary", ink: "fill-primary" },
];

const ORB_CORE = "CORE";

// Two sample blocks behind the audit-trail card; `confirmed` drives the bar
// width, which the original hard-coded as w-3/4 and w-full.
const LEDGER_BLOCKS = [
  { hash: "0x7F8B9C...2D4E", confirmed: 0.75 },
  { hash: "0x3A2F1D...9B8C", confirmed: 1 },
];

const API_ENDPOINT = "https://api.bhuniti.gov.in/v1/cadastral/parcel/{id}";
const UPTIME = 0.999;
const LATENCY_MS = 50;
const PARCELS_BILLION = 1.2;
const OTP_LENGTH = 6;
const TOTAL_STEPS = 2;

export default function Platform() {
  const navigate = useNavigate();
  const { t, label, formatNumber } = useI18n();
  const p = (key, vars) => t(`pages.platform.${key}`, vars);

  const isDemoModeEnabled = import.meta.env.VITE_ENABLE_DEMO_MODE === "true";

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState("");

  const [username, setUsername] = useState("citizen");
  const [password, setPassword] = useState("1234");
  const [selectedRole, setSelectedRole] = useState("citizen");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // A modal that traps the eye must also answer to Escape.
  useEffect(() => {
    if (!authModalOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setAuthModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [authModalOpen]);

  const moduleTitle = activeModuleId ? p(`modules.${activeModuleId}.title`) : "";
  const percent = (value) =>
    `${formatNumber(value * 100, { maximumFractionDigits: 1 })}${t("common.units.percent")}`;

  /*
   * Four visually identical "View Module" buttons sit on this page, so each one
   * needs its own accessible name. `tone` is passed as a literal class string
   * from the call site because Tailwind only sees classes it can read in source.
   *
   * A module with a direct route opens the module itself rather than the demo
   * sign-in, so it says "Open" and gets an arrow that leaves the page instead
   * of one that implies a dialog.
   */
  const viewButton = (moduleId, tone) => {
    const direct = Boolean(DIRECT_MODULE_ROUTES[moduleId]);
    return (
      <button
        type="button"
        onClick={() => handleViewModule(moduleId)}
        aria-label={p(direct ? "modules.openNamed" : "modules.viewNamed", {
          module: p(`modules.${moduleId}.title`),
        })}
        className={`flex items-center gap-2 font-bold font-label-caps text-label-caps uppercase hover:underline transition-all mt-6 cursor-pointer w-fit ${tone}`}
      >
        <span>{p(direct ? "modules.open" : "modules.view")}</span>
        <span
          aria-hidden="true"
          className="material-symbols-outlined text-[16px] group-hover:translate-x-1.5 transition-transform"
        >
          arrow_forward
        </span>
      </button>
    );
  };

  function handleViewModule(moduleId) {
    const direct = DIRECT_MODULE_ROUTES[moduleId];
    if (direct) {
      navigate(direct);
      return;
    }

    // Check if user is already authenticated with real token
    const token = localStorage.getItem("bhuniti_token");
    let currentUser = null;
    try {
      currentUser = JSON.parse(localStorage.getItem("bhuniti_user") || "null");
    } catch {
      currentUser = null;
    }

    if (token && currentUser?.authenticated && currentUser?.role) {
      const target =
        MODULE_ROUTES[moduleId]?.[currentUser.role] ||
        MODULE_ROUTES[moduleId]?.citizen ||
        CITIZEN_ROUTES.portal;
      navigate(target);
      return;
    }

    // If demo mode is enabled via environment flag, open the explicit demo login modal
    if (isDemoModeEnabled) {
      setActiveModuleId(moduleId);
      setError("");
      setUsername("citizen");
      setPassword("1234");
      setSelectedRole("citizen");
      setAuthModalOpen(true);
      return;
    }

    // Otherwise redirect to the real login page
    navigate(`${MAIN_ROUTES.login}?portal=${moduleId}`);
  }

  function quickFill(user) {
    setUsername(user.username);
    setPassword(user.defaultPassword || "1234");
    setSelectedRole(user.roleKey);
    setError("");
  }

  async function handleDemoLogin(e) {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setError(p("modal.errors.missing") || "Please enter username and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.auth.login(cleanUsername, cleanPassword);
      if (res && res.access_token) {
        localStorage.setItem("bhuniti_token", res.access_token);
        localStorage.setItem(
          "bhuniti_user",
          JSON.stringify({
            role: res.role || cleanUsername,
            username: res.username || cleanUsername,
            full_name: res.full_name || cleanUsername,
            preferred_locale: res.preferred_locale || "en",
            authenticated: true,
          })
        );
        setAuthModalOpen(false);
        const target =
          MODULE_ROUTES[activeModuleId]?.[res.role || cleanUsername] ||
          res.redirect_url ||
          CITIZEN_ROUTES.portal;
        navigate(target);
      } else {
        throw new Error("Authentication response did not contain an access token.");
      }
    } catch (err) {
      setError(err.message || p("errors.invalidCredentials") || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full pt-20">
      <div className="flex flex-col w-full relative overflow-hidden bg-background">
        {/* Blurred earth backdrop: decoration only, so it stays out of the a11y tree. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-cover bg-center filter blur-[2px] scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=2000')",
            backgroundPosition: "center 40%",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-background/40 via-background/80 to-background"
        />

        {/* Section 1: hero */}
        <section className="relative z-10 w-full max-w-[1440px] mx-auto px-margin-desktop pt-24 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2">
                <span aria-hidden="true" className="w-8 h-px bg-primary" />
                <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase">
                  {p("hero.eyebrow")}
                </span>
              </div>
              <h1 className="font-display text-display text-on-surface">{p("hero.title")}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4 leading-relaxed">
                {p("hero.body")}
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("interoperability-specs");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-caps text-label-caps uppercase hover:bg-surface-tint transition-all shadow-md cursor-pointer"
                >
                  {p("hero.specs")}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(MAIN_ROUTES.howItWorks)}
                  className="bg-surface-white border border-border-subtle text-on-surface px-8 py-4 rounded-xl font-label-caps text-label-caps uppercase hover:bg-surface-container transition-all cursor-pointer"
                >
                  {p("hero.devPortal")}
                </button>
              </div>
            </div>

            {/*
             * Architecture orb. To assistive tech the whole schematic is one
             * image -- four Latin acronyms in 28px circles carry no meaning on
             * their own -- so the svg takes role="img" and the sentence in
             * orb.diagram says what it depicts.
             */}
            <div className="lg:col-span-5 relative h-[500px] flex items-center justify-center">
              <div
                aria-hidden="true"
                className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-secondary-fixed/30 to-primary-fixed/30 rounded-full blur-3xl opacity-50"
              />
              <div className="relative w-full max-w-[400px] aspect-square rounded-2xl bg-surface-white border border-border-subtle shadow-xl overflow-hidden flex flex-col p-6">
                <div className="flex justify-between items-center mb-6 border-b border-border-subtle pb-4">
                  <span className="font-label-caps text-label-caps text-on-surface">
                    {p("orb.heading")}
                  </span>
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                    <span className="font-tabular-nums text-tabular-nums text-on-surface-variant text-[10px] uppercase tracking-wider">
                      {p("orb.sync")}
                    </span>
                  </span>
                </div>

                <div className="flex-1 relative">
                  <svg role="img" aria-label={p("orb.diagram")} className="w-full h-full" viewBox="0 0 200 200">
                    {/* Ring: each node dashed to the next, closing the loop. */}
                    {ORB_NODES.map((node, index) => {
                      const next = ORB_NODES[(index + 1) % ORB_NODES.length];
                      return (
                        <line
                          key={`ring-${node.id}`}
                          className="text-border-subtle"
                          stroke="currentColor"
                          strokeDasharray="2 2"
                          strokeWidth="1"
                          x1={node.cx}
                          y1={node.cy}
                          x2={next.cx}
                          y2={next.cy}
                        />
                      );
                    })}
                    {/* Spokes from the core out to each service. */}
                    {ORB_NODES.map((node) => (
                      <line
                        key={`spoke-${node.id}`}
                        className="text-border-subtle"
                        stroke="currentColor"
                        strokeWidth="1"
                        x1="100"
                        y1="100"
                        x2={node.cx}
                        y2={node.cy}
                      />
                    ))}
                    {ORB_NODES.map((node) => (
                      <g key={node.id}>
                        <circle
                          className={`fill-surface-white ${node.ring}`}
                          cx={node.cx}
                          cy={node.cy}
                          r="14"
                          strokeWidth="2"
                        />
                        <text
                          className={`${node.ink} font-semibold`}
                          fontFamily="Inter"
                          fontSize={node.size}
                          textAnchor="middle"
                          x={node.cx}
                          y={node.cy + 4}
                        >
                          {node.glyph}
                        </text>
                      </g>
                    ))}
                    <circle className="fill-primary" cx="100" cy="100" r="22" />
                    <text
                      className="fill-surface-white font-bold tracking-widest"
                      fontFamily="Inter"
                      fontSize="8"
                      textAnchor="middle"
                      x="100"
                      y="103"
                    >
                      {ORB_CORE}
                    </text>
                    {/*
                     * Traffic pulse. The original drew these as absolutely
                     * positioned divs at top-[38px] left-[100px], reusing the
                     * 200-unit viewBox numbers as CSS pixels, so both dots
                     * landed in the corner of a ~350px box instead of on a
                     * node. Inside the svg they scale with the diagram.
                     */}
                    <circle
                      className="fill-secondary animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      cx="100"
                      cy="40"
                      r="2.5"
                    />
                    <circle
                      className="fill-primary animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      cx="160"
                      cy="100"
                      r="2.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Section 2: the four integrated modules */}
        <section className="relative z-10 w-full bg-surface-container-low border-y border-border-subtle py-24">
          <div className="max-w-[1440px] mx-auto px-margin-desktop">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase mb-4 block">
                  {p("modules.eyebrow")}
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  {p("modules.heading")}
                </h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                {p("modules.note")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* High-precision GIS */}
              <div className="md:col-span-8 bg-surface-white border border-border-subtle rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-stretch justify-between shadow-sm hover:shadow-md transition-all group min-h-[300px]">
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div
                      aria-hidden="true"
                      className="w-12 h-12 bg-secondary-fixed text-on-secondary-fixed rounded-lg flex items-center justify-center mb-6"
                    >
                      <span className="material-symbols-outlined text-[24px]">map</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-3">
                      {p("modules.gis.title")}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {p("modules.gis.body")}
                    </p>
                  </div>
                  {viewButton("gis", "text-secondary hover:text-primary")}
                </div>

                <div className="w-full md:w-[46%] h-48 md:h-auto rounded-xl overflow-hidden border border-border-subtle bg-surface-container shrink-0 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000"
                    alt={p("modules.gis.imageAlt")}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Digital registry */}
              <div className="md:col-span-4 bg-surface-white border border-border-subtle rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group min-h-[300px]">
                <div>
                  <div
                    aria-hidden="true"
                    className="w-12 h-12 bg-surface-container-highest text-on-surface rounded-lg flex items-center justify-center mb-6"
                  >
                    <span className="material-symbols-outlined text-[24px]">history_edu</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-3">
                    {p("modules.registry.title")}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {p("modules.registry.body")}
                  </p>
                </div>
                {viewButton("registry", "text-primary")}
              </div>

              {/* AI dispute resolution */}
              <div className="md:col-span-4 bg-primary text-on-primary border border-primary rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-md hover:shadow-lg transition-all min-h-[300px]">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[bg-pan_4s_linear_infinite]"
                />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div
                      aria-hidden="true"
                      className="w-12 h-12 bg-on-primary/10 rounded-lg flex items-center justify-center mb-6 backdrop-blur-sm"
                    >
                      <span className="material-symbols-outlined text-[24px] text-on-primary">psychology</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-primary mb-3">
                      {p("modules.ai.title")}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-primary/80 leading-relaxed">
                      {p("modules.ai.body")}
                    </p>
                  </div>
                  {viewButton("ai", "text-on-primary")}
                </div>
              </div>

              {/* Immutable audit trail */}
              <div className="md:col-span-8 bg-surface-white border border-border-subtle rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between shadow-sm hover:shadow-md transition-all group min-h-[300px]">
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div>
                    <div
                      aria-hidden="true"
                      className="w-12 h-12 bg-surface-container-highest text-on-surface rounded-lg flex items-center justify-center mb-6"
                    >
                      <span className="material-symbols-outlined text-[24px]">verified_user</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-3">
                      {p("modules.audit.title")}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md leading-relaxed">
                      {p("modules.audit.body")}
                    </p>
                  </div>
                  {viewButton("audit", "text-primary")}
                </div>

                {/* Ledger sample. The bars used to be w-3/4 and w-full literals,
                    which meant the confirmation figure and the bar could never
                    disagree because there was no figure. */}
                <div className="w-full sm:w-56 h-36 bg-surface-container rounded-xl border border-border-subtle relative overflow-hidden p-3.5 flex flex-col gap-2 shrink-0 shadow-inner">
                  <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
                    <span aria-hidden="true" className="material-symbols-outlined text-[14px] text-on-surface-variant">
                      lock
                    </span>
                    <span className="font-tabular-nums text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                      {p("modules.audit.blockHash")}
                    </span>
                  </div>
                  {LEDGER_BLOCKS.map((block) => (
                    <div key={block.hash}>
                      <p className="font-tabular-nums text-[11px] text-on-surface-variant font-mono truncate">
                        {block.hash}
                      </p>
                      <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-status-success" style={{ width: percent(block.confirmed) }} />
                      </div>
                      <span className="sr-only">
                        {p("modules.audit.confirmations", { value: percent(block.confirmed) })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Section 3: interoperability and scale */}
        <section id="interoperability-specs" className="relative z-10 w-full py-24 bg-surface-white overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-margin-desktop relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
              {/* 01 — interoperability */}
              <article className="bg-surface-white border border-border-subtle rounded-3xl p-8 md:p-10 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <span
                    aria-hidden="true"
                    className="font-tabular-nums text-tabular-nums text-on-surface-variant tracking-widest border-b border-border-subtle pb-2 w-12 font-bold block mb-4"
                  >
                    {p("interop.index")}
                  </span>
                  <h3 className="font-display text-[26px] sm:text-[32px] leading-tight text-on-surface font-bold mb-4">
                    {p("interop.heading")}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                    {p("interop.body")}
                  </p>
                </div>

                <div className="bg-surface-container rounded-2xl p-6 border border-border-subtle mt-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">
                      {p("interop.endpoint")}
                    </span>
                    <span className="px-2.5 py-0.5 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold rounded-md">
                      {p("interop.method")}
                    </span>
                  </div>
                  <code className="font-tabular-nums text-body-sm text-on-surface block truncate font-mono bg-white/60 p-2.5 rounded-lg border border-border-subtle">
                    {API_ENDPOINT}
                  </code>
                  <div aria-hidden="true" className="w-full h-px bg-border-subtle my-4" />
                  <div className="flex gap-4">
                    <span className="font-label-caps text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                      <span aria-hidden="true" className="text-status-success">
                        ●
                      </span>{" "}
                      {p("interop.uptime", { value: percent(UPTIME) })}
                    </span>
                    <span className="font-label-caps text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                      {p("interop.formats")}
                    </span>
                  </div>
                </div>
              </article>

              {/* 02 — elastic scale */}
              <article className="bg-surface-white border border-border-subtle rounded-3xl p-8 md:p-10 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <span
                    aria-hidden="true"
                    className="font-tabular-nums text-tabular-nums text-on-surface-variant tracking-widest border-b border-border-subtle pb-2 w-12 font-bold block mb-4"
                  >
                    {p("scale.index")}
                  </span>
                  <h3 className="font-display text-[26px] sm:text-[32px] leading-tight text-on-surface font-bold mb-4">
                    {p("scale.heading")}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                    {p("scale.body")}
                  </p>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="border border-border-subtle p-6 rounded-2xl bg-surface shadow-sm">
                    <dd className="font-display text-[32px] text-primary mb-1 font-bold">
                      {p("scale.latencyValue", { value: formatNumber(LATENCY_MS) })}
                    </dd>
                    <dt className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">
                      {p("scale.latency")}
                    </dt>
                  </div>
                  <div className="border border-border-subtle p-6 rounded-2xl bg-surface shadow-sm">
                    <dd className="font-display text-[32px] text-primary mb-1 font-bold">
                      {p("scale.parcelsValue", {
                        value: formatNumber(PARCELS_BILLION, { maximumFractionDigits: 1 }),
                      })}
                    </dd>
                    <dt className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">
                      {p("scale.parcels")}
                    </dt>
                  </div>
                </dl>
              </article>
            </div>
          </div>
        </section>

        {/* Section 4: closing call to action */}
        <section className="w-full bg-primary py-16 text-on-primary">
          <div className="max-w-[1440px] mx-auto px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-headline-lg text-headline-lg mb-2 font-bold">{p("cta.heading")}</h2>
              <p className="font-body-md text-on-primary/80">{p("cta.body")}</p>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(MAIN_ROUTES.howItWorks)}
                className="bg-surface-white text-primary px-8 py-3 rounded-lg font-label-caps text-label-caps uppercase hover:bg-surface-container transition-all shadow-sm font-bold cursor-pointer"
              >
                {p("cta.docs")}
              </button>
            </div>
          </div>
        </section>
      </div>
      {/*
       * Explicit Demo Access Modal -- active only when VITE_ENABLE_DEMO_MODE is true.
       * Authenticates directly via the real backend api.auth.login endpoint.
       * Displays genuine error messages on failure with zero fabricated sessions.
       */}
      {authModalOpen && isDemoModeEnabled && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="plat-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label={t("common.a11y.closeDialog")}
            onClick={() => setAuthModalOpen(false)}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm cursor-pointer"
          />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-border-subtle overflow-hidden animate-scaleUp text-on-surface">
            <div className="p-6 border-b border-border-subtle flex justify-between items-center gap-3 bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center shrink-0"
                >
                  <span className="material-symbols-outlined text-[24px]">
                    verified_user
                  </span>
                </div>
                <div>
                  <h2 id="plat-modal-title" className="font-display text-xl font-bold text-on-surface">
                    {p("modal.accessTitle", { module: moduleTitle })}
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    {p("modal.demoMode")} — {p("modal.accessSubtitle")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label={t("common.actions.close")}
                className="w-9 h-9 rounded-full bg-surface-container hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                onClick={() => setAuthModalOpen(false)}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-[20px]">
                  close
                </span>
              </button>
            </div>

            {/* Demo role selectors */}
            <div className="px-6 pt-5 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider shrink-0">
                {p("modal.demo")}
              </span>
              {DEMO_ROLES.map((user) => (
                <button
                  key={user.username}
                  type="button"
                  onClick={() => quickFill(user)}
                  aria-label={p("modal.quickFill", { role: label("actor_role", user.roleName) })}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors shrink-0 cursor-pointer ${
                    selectedRole === user.roleKey ? "ring-2 ring-secondary ring-offset-1 " : ""
                  }${CHIP_TONE[user.username]}`}
                >
                  {label("actor_role", user.roleName)}
                </button>
              ))}
            </div>

            <div className="p-6">
              <form className="flex flex-col gap-4" onSubmit={handleDemoLogin}>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider"
                    htmlFor="plat-username"
                  >
                    {p("modal.username")}
                  </label>
                  <input
                    id="plat-username"
                    type="text"
                    autoComplete="username"
                    placeholder={p("modal.usernameHint")}
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-surface-container-lowest focus:outline-none focus:border-secondary focus:bg-white transition-colors font-body-md text-sm text-on-surface"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider"
                    htmlFor="plat-password"
                  >
                    Password
                  </label>
                  <input
                    id="plat-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-surface-container-lowest focus:outline-none focus:border-secondary focus:bg-white transition-colors font-body-md text-sm text-on-surface"
                  />
                </div>

                {error ? (
                  <p
                    role="alert"
                    className="text-status-error text-xs font-bold bg-status-error/10 p-2.5 rounded-lg flex items-center gap-1.5"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                      error
                    </span>
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading || !username.trim() || !password.trim()}
                  className="w-full py-3.5 bg-secondary hover:bg-secondary-container disabled:opacity-50 disabled:cursor-not-allowed text-on-primary font-bold text-sm rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <span aria-hidden="true" className="material-symbols-outlined animate-spin text-[18px]">
                        progress_activity
                      </span>
                      {p("modal.verifying")}
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                        lock_open
                      </span>
                      {p("modal.launch", { module: moduleTitle })}
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="p-4 bg-surface-container-lowest border-t border-border-subtle text-center text-xs text-on-surface-variant">
              <div className="flex items-center justify-center gap-2">
                <span aria-hidden="true" className="material-symbols-outlined text-[15px]">
                  shield
                </span>
                <span>{p("modal.footer")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
