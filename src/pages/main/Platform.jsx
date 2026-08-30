import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CITIZEN_ROUTES, REVENUE_ROUTES, ADMIN_ROUTES, MAIN_ROUTES } from "../../routes";
import { api } from "../../services/api";

const MODULE_ROLE_ROUTES = {
  "High-Precision GIS": {
    revenue_officer: REVENUE_ROUTES.gisExplorer,
    district_officer: ADMIN_ROUTES.districtGis,
    citizen: CITIZEN_ROUTES.searchRecords,
  },
  "Digital Registry": {
    citizen: CITIZEN_ROUTES.searchRecords,
    revenue_officer: REVENUE_ROUTES.overview,
    district_officer: ADMIN_ROUTES.tehsilAnalytics,
  },
  "AI Dispute Resolution": {
    revenue_officer: REVENUE_ROUTES.discrepancyCases,
    district_officer: ADMIN_ROUTES.reconciliationMonitor,
    citizen: CITIZEN_ROUTES.portal,
  },
  "Immutable Audit Trail": {
    revenue_officer: REVENUE_ROUTES.auditTrail,
    district_officer: ADMIN_ROUTES.overview,
    citizen: CITIZEN_ROUTES.portal,
  },
};

export default function Platform() {
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeModuleName, setActiveModuleName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleViewModule(moduleName) {
    setActiveModuleName(moduleName);
    setError("");
    setAuthModalOpen(true);
  }

  async function handleRoleLogin(roleKey, defaultPassword = "1234") {
    setError("");
    setLoading(true);
    try {
      const res = await api.auth.login(roleKey, defaultPassword);
      if (res && res.token) {
        setAuthModalOpen(false);
        const target = MODULE_ROLE_ROUTES[activeModuleName]?.[roleKey] || res.redirect_url || CITIZEN_ROUTES.portal;
        navigate(target);
        return;
      }
    } catch (err) {
      console.log("Live login attempt:", err.message);
    } finally {
      setLoading(false);
    }

    // Client fallback demo auth
    localStorage.setItem("bhuniti_token", "demo-token-" + roleKey);
    localStorage.setItem(
      "bhuniti_user",
      JSON.stringify({ role: roleKey, username: roleKey, full_name: roleKey.replace("_", " ").toUpperCase() })
    );
    setAuthModalOpen(false);
    const target = MODULE_ROLE_ROUTES[activeModuleName]?.[roleKey] || CITIZEN_ROUTES.portal;
    navigate(target);
  }

  async function handleCustomFormLogin(e) {
    e.preventDefault();
    if (!username) {
      setError("Please enter a username or select a role above.");
      return;
    }
    const u = username.trim().toLowerCase();
    const roleKey = u.includes("revenue") ? "revenue_officer" : u.includes("district") || u.includes("admin") ? "district_officer" : "citizen";
    await handleRoleLogin(roleKey, password || "1234");
  }

  return (
    <main className="w-full pt-20">
      <div className="flex flex-col w-full relative overflow-hidden bg-background">
        {/* Glowing Blurred Earth Background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-cover bg-center filter blur-[2px] scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=2000')",
            backgroundPosition: "center 40%",
          }}
        />
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-background/40 via-background/80 to-background" />

        {/* Section 1: Hero */}
        <section className="relative z-10 w-full max-w-[1440px] mx-auto px-margin-desktop pt-24 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-px bg-primary" />
                <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase">
                  System Architecture
                </span>
              </div>
              <h1 className="font-display text-display text-on-surface">
                Institutional Intelligence for National Land Administration.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4 leading-relaxed">
                The BHUNITI platform unifies fragmented land administration into a cohesive, interoperable ecosystem. By integrating high-precision GIS with immutable ledger technology, we establish a single source of truth for property rights, spatial planning, and civic administration.
              </p>
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("interoperability-specs");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-caps text-label-caps uppercase hover:bg-surface-tint transition-all shadow-md cursor-pointer"
                >
                  View Technical Specs
                </button>
                <button
                  type="button"
                  onClick={() => navigate(MAIN_ROUTES.howItWorks)}
                  className="bg-surface-white border border-border-subtle text-on-surface px-8 py-4 rounded-xl font-label-caps text-label-caps uppercase hover:bg-surface-container transition-all cursor-pointer"
                >
                  Access Developer Portal
                </button>
              </div>
            </div>

            {/* Architecture Orb Visual */}
            <div className="lg:col-span-5 relative h-[500px] flex items-center justify-center">
              <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-secondary-fixed/30 to-primary-fixed/30 rounded-full blur-3xl opacity-50" />
              <div className="relative w-full max-w-[400px] aspect-square rounded-2xl bg-surface-white border border-border-subtle shadow-xl overflow-hidden flex flex-col p-6">
                <div className="flex justify-between items-center mb-6 border-b border-border-subtle pb-4">
                  <span className="font-label-caps text-label-caps text-on-surface">Live Ecosystem Flow</span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                    <span className="font-tabular-nums text-tabular-nums text-on-surface-variant text-[10px]">
                      SYNC_ACTIVE
                    </span>
                  </span>
                </div>

                <div className="flex-1 relative">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <line className="text-border-subtle" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" x1="100" x2="160" y1="40" y2="100" />
                    <line className="text-border-subtle" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" x1="160" x2="100" y1="100" y2="160" />
                    <line className="text-border-subtle" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" x1="100" x2="40" y1="160" y2="100" />
                    <line className="text-border-subtle" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" x1="40" x2="100" y1="100" y2="40" />

                    <line className="text-border-subtle" stroke="currentColor" strokeWidth="1" x1="100" x2="100" y1="100" y2="40" />
                    <line className="text-border-subtle" stroke="currentColor" strokeWidth="1" x1="100" x2="160" y1="100" y2="100" />
                    <line className="text-border-subtle" stroke="currentColor" strokeWidth="1" x1="100" x2="100" y1="100" y2="160" />
                    <line className="text-border-subtle" stroke="currentColor" strokeWidth="1" x1="100" x2="40" y1="100" y2="100" />

                    <circle className="fill-surface-white stroke-secondary" cx="100" cy="40" r="14" strokeWidth="2" />
                    <text className="fill-secondary font-semibold" fontFamily="Inter" fontSize="8" textAnchor="middle" x="100" y="44">
                      GIS
                    </text>

                    <circle className="fill-surface-white stroke-primary" cx="160" cy="100" r="14" strokeWidth="2" />
                    <text className="fill-primary font-semibold" fontFamily="Inter" fontSize="8" textAnchor="middle" x="160" y="104">
                      AI
                    </text>

                    <circle className="fill-surface-white stroke-primary" cx="100" cy="160" r="14" strokeWidth="2" />
                    <text className="fill-primary font-semibold" fontFamily="Inter" fontSize="6" textAnchor="middle" x="100" y="164">
                      LEDGER
                    </text>

                    <circle className="fill-surface-white stroke-primary" cx="40" cy="100" r="14" strokeWidth="2" />
                    <text className="fill-primary font-semibold" fontFamily="Inter" fontSize="8" textAnchor="middle" x="40" y="104">
                      REG
                    </text>

                    <circle className="fill-primary" cx="100" cy="100" r="22" />
                    <text className="fill-surface-white font-bold tracking-widest" fontFamily="Inter" fontSize="8" textAnchor="middle" x="100" y="103">
                      CORE
                    </text>
                  </svg>

                  <div className="absolute w-1.5 h-1.5 bg-secondary rounded-full top-[38px] left-[100px] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                  <div className="absolute w-1.5 h-1.5 bg-primary rounded-full top-[100px] left-[160px] animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Integrated Modules Grid (Photo 2 & Photo 3 Requirements) */}
        <section className="relative z-10 w-full bg-surface-container-low border-y border-border-subtle py-24">
          <div className="max-w-[1440px] mx-auto px-margin-desktop">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase mb-4 block">
                  Infrastructure Overview
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  Integrated Modules for Comprehensive Governance
                </h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                Each module operates independently while maintaining strict synchronicity with the central platform ledger.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Module 1: High-Precision GIS (Photo 2 Fix: Clean side-by-side box with clearly visible photo & no overlapping text) */}
              <div className="md:col-span-8 bg-surface-white border border-border-subtle rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-stretch justify-between shadow-sm hover:shadow-md transition-all group min-h-[300px]">
                {/* Left Text Container (Inside its own box) */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-secondary-fixed text-on-secondary-fixed rounded-lg flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-[24px]">map</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-3">High-Precision GIS</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Sub-meter accuracy spatial data mapping overlapping cadastral boundaries, infrastructure networks, and environmental constraints in real-time.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleViewModule("High-Precision GIS")}
                    className="flex items-center gap-2 text-secondary font-bold font-label-caps text-label-caps uppercase hover:underline hover:text-primary transition-all mt-6 cursor-pointer w-fit"
                  >
                    <span>View Module</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1.5 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>

                {/* Right Photo: Clearly Visible, Full Definition (Not Faded) */}
                <div className="w-full md:w-[46%] h-48 md:h-auto rounded-xl overflow-hidden border border-border-subtle bg-surface-container shrink-0 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000"
                    alt="High-Precision GIS Map"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Module 2: Digital Registry */}
              <div className="md:col-span-4 bg-surface-white border border-border-subtle rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group min-h-[300px]">
                <div>
                  <div className="w-12 h-12 bg-surface-container-highest text-on-surface rounded-lg flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[24px]">history_edu</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Digital Registry</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Digitized property records linked directly to spatial identifiers, eliminating ambiguity in ownership.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleViewModule("Digital Registry")}
                  className="flex items-center gap-2 text-primary font-bold font-label-caps text-label-caps uppercase hover:underline transition-all mt-6 cursor-pointer w-fit"
                >
                  <span>View Module</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1.5 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>

              {/* Module 3: AI Dispute Resolution */}
              <div className="md:col-span-4 bg-primary text-on-primary border border-primary rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-md hover:shadow-lg transition-all min-h-[300px]">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[bg-pan_4s_linear_infinite]" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-12 h-12 bg-on-primary/10 rounded-lg flex items-center justify-center mb-6 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-[24px] text-on-primary">psychology</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-primary mb-3">AI Dispute Resolution</h3>
                    <p className="font-body-sm text-body-sm text-on-primary/80 leading-relaxed">
                      Machine learning models analyze historical land records to flag anomalies and predict potential boundary disputes before registration.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleViewModule("AI Dispute Resolution")}
                    className="flex items-center gap-2 text-on-primary font-bold font-label-caps text-label-caps uppercase hover:underline transition-all mt-6 cursor-pointer w-fit"
                  >
                    <span>View Module</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1.5 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>

              {/* Module 4: Immutable Audit Trail */}
              <div className="md:col-span-8 bg-surface-white border border-border-subtle rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between shadow-sm hover:shadow-md transition-all group min-h-[300px]">
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 bg-surface-container-highest text-on-surface rounded-lg flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-[24px]">verified_user</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Immutable Audit Trail</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md leading-relaxed">
                      Every transaction, modification, and query is logged on a distributed ledger, ensuring cryptographic proof of provenance and absolute data integrity.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleViewModule("Immutable Audit Trail")}
                    className="flex items-center gap-2 text-primary font-bold font-label-caps text-label-caps uppercase hover:underline transition-all mt-6 cursor-pointer w-fit"
                  >
                    <span>View Module</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1.5 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>

                <div className="w-full sm:w-56 h-36 bg-surface-container rounded-xl border border-border-subtle relative overflow-hidden p-3.5 flex flex-col gap-2 shrink-0 shadow-inner">
                  <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant">lock</span>
                    <span className="font-tabular-nums text-[10px] text-on-surface-variant font-bold">BLOCK HASH</span>
                  </div>
                  <div className="font-tabular-nums text-[11px] text-on-surface-variant font-mono truncate">
                    0x7F8B9C...2D4E
                  </div>
                  <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden mt-0.5">
                    <div className="w-3/4 h-full bg-status-success" />
                  </div>
                  <div className="font-tabular-nums text-[11px] text-on-surface-variant font-mono truncate mt-1">
                    0x3A2F1D...9B8C
                  </div>
                  <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden mt-0.5">
                    <div className="w-full h-full bg-status-success" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Technical Interoperability & Scalability (Photo 1 Fix: Placed into container boxes with shadow) */}
        <section id="interoperability-specs" className="relative z-10 w-full py-24 bg-surface-white overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-margin-desktop relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
              {/* Detail 01 Container Box with Shadow */}
              <div className="bg-surface-white border border-border-subtle rounded-3xl p-8 md:p-10 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <span className="font-tabular-nums text-tabular-nums text-on-surface-variant tracking-widest border-b border-border-subtle pb-2 w-12 font-bold block mb-4">
                    01
                  </span>
                  <h3 className="font-display text-[26px] sm:text-[32px] leading-tight text-on-surface font-bold mb-4">
                    Seamless Interoperability with State Systems
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                    Designed for the Indian administrative context, BHUNITI provides standardized RESTful APIs and spatial data services (WMS/WFS) conforming to OGC standards. This allows immediate integration with existing state revenue department portals, municipal databases, and central infrastructural planning tools without disrupting legacy workflows.
                  </p>
                </div>

                <div className="bg-surface-container rounded-2xl p-6 border border-border-subtle mt-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">
                      API Endpoint
                    </span>
                    <span className="px-2.5 py-0.5 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold rounded-md">
                      GET
                    </span>
                  </div>
                  <code className="font-tabular-nums text-body-sm text-on-surface block truncate font-mono bg-white/60 p-2.5 rounded-lg border border-border-subtle">
                    https://api.bhuniti.gov.in/v1/cadastral/parcel/&#123;id&#125;
                  </code>
                  <div className="w-full h-px bg-border-subtle my-4" />
                  <div className="flex gap-4">
                    <span className="font-label-caps text-[10px] text-on-surface-variant font-bold">
                      <span className="text-status-success">●</span> 99.9% UPTIME
                    </span>
                    <span className="font-label-caps text-[10px] text-on-surface-variant font-bold">
                      JSON / GeoJSON
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail 02 Container Box with Shadow */}
              <div className="bg-surface-white border border-border-subtle rounded-3xl p-8 md:p-10 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <span className="font-tabular-nums text-tabular-nums text-on-surface-variant tracking-widest border-b border-border-subtle pb-2 w-12 font-bold block mb-4">
                    02
                  </span>
                  <h3 className="font-display text-[26px] sm:text-[32px] leading-tight text-on-surface font-bold mb-4">
                    Elastic Scalability for a Subcontinent
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                    Built on a containerized microservices architecture deployed across geographically redundant government cloud nodes. The platform scales dynamically to handle millions of simultaneous queries during peak administrative periods, ensuring low-latency access to heavy vector and raster spatial datasets regardless of user location.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="border border-border-subtle p-6 rounded-2xl bg-surface shadow-sm">
                    <div className="font-display text-[32px] text-primary mb-1 font-bold">~50ms</div>
                    <div className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">
                      Avg Query Latency
                    </div>
                  </div>
                  <div className="border border-border-subtle p-6 rounded-2xl bg-surface shadow-sm">
                    <div className="font-display text-[32px] text-primary mb-1 font-bold">1.2B+</div>
                    <div className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">
                      Parcels Indexable
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: CTA */}
        <section className="w-full bg-primary py-16 text-on-primary">
          <div className="max-w-[1440px] mx-auto px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-headline-lg text-headline-lg mb-2 font-bold">Ready to explore the platform?</h2>
              <p className="font-body-md text-on-primary/80">Access technical documentation or request sandbox access.</p>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(MAIN_ROUTES.howItWorks)}
                className="bg-surface-white text-primary px-8 py-3 rounded-lg font-label-caps text-label-caps uppercase hover:bg-surface-container transition-all shadow-sm font-bold cursor-pointer"
              >
                Documentation
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Role-Based Authentication Prompt Modal (Photo 3 Feature) */}
      {authModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setAuthModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-border-subtle overflow-hidden text-on-surface animate-scaleUp">
            {/* Header */}
            <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">lock</span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-on-surface">Authentication Required</h3>
                  <p className="text-xs text-on-surface-variant">Choose your role to access {activeModuleName}</p>
                </div>
              </div>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                onClick={() => setAuthModalOpen(false)}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Role Options */}
            <div className="p-6 space-y-5">
              <div>
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-3">
                  Select Authorized Role to Launch:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Revenue Officer Role Card */}
                  <button
                    type="button"
                    onClick={() => handleRoleLogin("revenue_officer")}
                    className="p-3.5 bg-sky-50 hover:bg-sky-100 text-sky-900 rounded-2xl border border-sky-200 flex flex-col items-center justify-center text-center gap-1.5 transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[24px] text-sky-700">shield_person</span>
                    <span className="font-bold text-xs">Revenue Officer</span>
                    <span className="text-[9px] text-sky-600 font-mono">RO / Kanungo</span>
                  </button>

                  {/* District Admin Role Card */}
                  <button
                    type="button"
                    onClick={() => handleRoleLogin("district_officer")}
                    className="p-3.5 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-2xl border border-purple-200 flex flex-col items-center justify-center text-center gap-1.5 transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[24px] text-purple-700">admin_panel_settings</span>
                    <span className="font-bold text-xs">District Admin</span>
                    <span className="text-[9px] text-purple-600 font-mono">DM / ADM</span>
                  </button>

                  {/* Citizen Role Card */}
                  <button
                    type="button"
                    onClick={() => handleRoleLogin("citizen")}
                    className="p-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-2xl border border-emerald-200 flex flex-col items-center justify-center text-center gap-1.5 transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[24px] text-emerald-700">person</span>
                    <span className="font-bold text-xs">Citizen</span>
                    <span className="text-[9px] text-emerald-600 font-mono">Landowner</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border-subtle" />
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">Or Sign In With Gov-ID</span>
                <span className="h-px flex-1 bg-border-subtle" />
              </div>

              {/* Login Form */}
              <form onSubmit={handleCustomFormLogin} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Enter Username (e.g. revenue_officer)"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password (default: 1234)"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-secondary"
                  />
                </div>

                {error && (
                  <p className="text-status-error text-xs font-bold bg-status-error/10 p-2 rounded-lg flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-secondary hover:bg-secondary-container text-on-primary font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-[16px]">login</span>
                  )}
                  Sign In &amp; Launch {activeModuleName}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
