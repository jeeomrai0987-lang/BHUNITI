import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CITIZEN_ROUTES, REVENUE_ROUTES, ADMIN_ROUTES, MAIN_ROUTES } from "../../routes";
import { api } from "../../services/api";

const CREDENTIALS = [
  { username: "citizen", password: "1234", redirect: CITIZEN_ROUTES.portal },
  { username: "revenue_officer", password: "1234", redirect: REVENUE_ROUTES.overview },
  { username: "district_officer", password: "1234", redirect: ADMIN_ROUTES.overview },
];

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 1. Try real backend API authentication
      const res = await api.auth.login(username.trim(), password);
      if (res && res.redirect_url) {
        navigate(res.redirect_url);
        return;
      }
    } catch (err) {
      console.log("Backend login attempt:", err.message);
    } finally {
      setLoading(false);
    }

    // 2. Fallback to client demo credentials if backend is unreachable or local
    const match = CREDENTIALS.find(
      (c) => c.username === username.trim() && c.password === password
    );
    if (match) {
      localStorage.setItem("bhuniti_token", "demo-token-" + match.username);
      localStorage.setItem(
        "bhuniti_user",
        JSON.stringify({ role: match.username, username: match.username, full_name: match.username })
      );
      navigate(match.redirect);
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <main className="w-full pt-20">
      <div className="flex flex-col w-full font-body-md text-on-surface">
        {/* Hero section */}
        <section className="relative w-full min-h-[90vh] flex items-center justify-center -mt-20 pt-20 overflow-hidden bg-surface">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000')",
              backgroundSize: "cover",
              backgroundPosition: "center center",
              filter: "contrast(1.15) saturate(1.25) brightness(0.9)",
            }}
          />
          <div
            className="absolute inset-0 backdrop-blur-[1px] z-0 bg-slate-950/20"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000')",
              backgroundSize: "cover",
              backgroundPosition: "center center",
              filter: "contrast(1.15) saturate(1.25) brightness(0.9)",
            }}
          />

          <div className="relative z-10 max-w-[1440px] mx-auto px-margin-desktop w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Pure Solid White Hero Card - Completely Visible & High Contrast */}
            <div className="lg:col-span-7 flex flex-col gap-6 bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-200">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-highest rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-status-success"></span>
                <span className="font-label-caps text-on-surface uppercase tracking-wider text-[10px]">
                  National Infrastructure Initiative
                </span>
              </div>
              <h1 className="font-display text-display lg:text-[64px] lg:leading-[72px] text-on-surface font-bold tracking-tight">
                Building a Trusted Digital Foundation for <span className="text-secondary">Land Governance</span>
              </h1>
              <p className="font-body-lg text-on-surface-variant max-w-2xl font-medium">
                BHUNITI integrates land records, GIS, registration, mutation, and historical data into one intelligent, parcel-centric governance platform.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="px-8 py-3 bg-secondary text-on-primary font-label-caps rounded-lg hover:bg-secondary-container transition-colors shadow-md cursor-pointer"
                >
                  Access BHUNITI
                </button>
                <button
                  type="button"
                  onClick={() => navigate(MAIN_ROUTES.howItWorks)}
                  className="px-8 py-3 bg-surface-white border border-border-subtle text-on-surface font-label-caps rounded-lg hover:bg-surface-container transition-colors shadow-sm cursor-pointer"
                >
                  Explore How It Works
                </button>
              </div>
              <div className="mt-4 flex items-center gap-4 text-on-surface font-label-caps text-[11px] uppercase tracking-wider font-semibold">
                <span>Integrated</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>GIS-enabled</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>AI-assisted</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>Auditable</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Login modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm cursor-pointer"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-border-subtle overflow-hidden animate-scaleUp text-on-surface">
            {/* Modal header */}
            <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">login</span>
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-on-surface">Sign In to BHUNITI</h2>
                  <p className="text-xs text-on-surface-variant">Single Sign-On (SSO) &amp; RBAC Access</p>
                </div>
              </div>
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-surface-container hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                onClick={() => setModalOpen(false)}
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">close</span>
              </button>
            </div>

            {/* Quick Role Fill Buttons */}
            <div className="px-6 pt-5 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider shrink-0">
                Quick Fill:
              </span>
              <button
                type="button"
                onClick={() => { setUsername("citizen"); setPassword("1234"); setError(""); }}
                className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => { setUsername("revenue_officer"); setPassword("1234"); setError(""); }}
                className="px-2.5 py-1 text-xs bg-sky-50 text-sky-700 font-bold rounded-lg border border-sky-200 hover:bg-sky-100 transition-colors"
              >
                Revenue Officer
              </button>
              <button
                type="button"
                onClick={() => { setUsername("district_officer"); setPassword("1234"); setError(""); }}
                className="px-2.5 py-1 text-xs bg-purple-50 text-purple-700 font-bold rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
              >
                District Admin
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6">
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider"
                    htmlFor="username"
                  >
                    Official Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="e.g. citizen or revenue_officer"
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
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter password (default: 1234)"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-surface-container-lowest focus:outline-none focus:border-secondary focus:bg-white transition-colors font-body-md text-sm text-on-surface"
                  />
                </div>

                {error && (
                  <p className="text-status-error text-xs font-bold bg-status-error/10 p-2.5 rounded-lg flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-secondary hover:bg-secondary-container text-on-primary font-bold text-sm rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">lock_open</span>
                  )}
                  Authenticate &amp; Launch Portal
                </button>
              </form>
            </div>

            {/* Modal footer */}
            <div className="p-4 bg-surface-container-lowest border-t border-border-subtle text-center text-xs text-on-surface-variant">
              <span>Secure Gov-ID Access • 256-Bit TLS Encrypted</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
