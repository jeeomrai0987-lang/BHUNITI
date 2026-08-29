import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CITIZEN_ROUTES, REVENUE_ROUTES, ADMIN_ROUTES } from "../../routes";

// Demo credentials from the original login.js — unchanged so testers
// can still use the same usernames/passwords as before.
const CREDENTIALS = [
  { username: "citizen",         password: "1234", redirect: CITIZEN_ROUTES.portal },
  { username: "revenue_officer", password: "1234", redirect: REVENUE_ROUTES.overview },
  { username: "district_officer",password: "1234", redirect: ADMIN_ROUTES.overview },
];

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername]   = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [modalOpen, setModalOpen] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();
    const match = CREDENTIALS.find(
      (c) => c.username === username.trim() && c.password === password
    );
    if (match) {
      navigate(match.redirect);
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    /* The Login "page" in the original design was the Home page content
       (identical markup) with the login modal layered on top via z-index.
       We replicate that here: hero background behind, modal in front. */
    <main className="w-full pt-20">
      <div className="flex flex-col w-full font-body-md text-on-surface">

        {/* ── Hero section (same as Home) ─────────────────────────────── */}
        <section className="relative w-full min-h-[90vh] flex items-center justify-center -mt-20 pt-20 overflow-hidden bg-surface">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC3UqUidDVyB4oiILh4TJU9FlLQyVETgWA1ZPR7Xl0l5ygn_m1l6690zV5ldrtMbsom5LcMZGhKDINEkrE3izyP8_kYRwpM71mIRPZVutn4cKGG9ImMhm27KqUO4Y_u1CmCmWPey8jqPouSog8IUNB_81KxLNlAAK8gQEu_R9U7K1_cIvhzbZgnRwetc83bmxJEl1KCyag6YIjOJlyg_bjSPJSSkyps5n1bJKKaUVvtJmwLCxqPvEI')",
              backgroundSize: "cover",
              backgroundPosition: "center center",
              filter: "contrast(1.2) saturate(1.3) brightness(0.85)",
            }}
          />
          <div
            className="absolute inset-0 backdrop-blur-[2px] z-0 bg-primary/20"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC3UqUidDVyB4oiILh4TJU9FlLQyVETgWA1ZPR7Xl0l5ygn_m1l6690zV5ldrtMbsom5LcMZGhKDINEkrE3izyP8_kYRwpM71mIRPZVutn4cKGG9ImMhm27KqUO4Y_u1CmCmWPey8jqPouSog8IUNB_81KxLNlAAK8gQEu_R9U7K1_cIvhzbZgnRwetc83bmxJEl1KCyag6YIjOJlyg_bjSPJSSkyps5n1bJKKaUVvtJmwLCxqPvEI')",
              backgroundSize: "cover",
              backgroundPosition: "center center",
              filter: "contrast(1.2) saturate(1.3) brightness(0.85)",
            }}
          />
          <div className="relative z-10 max-w-[1440px] mx-auto px-margin-desktop w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-6 bg-surface-white/95 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-xl border border-border-subtle">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-highest rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-status-success"></span>
                <span className="font-label-caps text-on-surface uppercase tracking-wider text-[10px]">National Infrastructure Initiative</span>
              </div>
              <h1 className="font-display text-display lg:text-[64px] lg:leading-[72px] text-on-surface font-bold tracking-tight">
                Building a Trusted Digital Foundation for{" "}
                <span className="text-secondary">Land Governance</span>
              </h1>
              <p className="font-body-lg text-on-surface-variant max-w-2xl">
                BHUNITI integrates land records, GIS, registration, mutation, and historical data into one intelligent, parcel-centric governance platform.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <button className="px-8 py-3 bg-secondary text-on-primary font-label-caps rounded-lg hover:bg-secondary-container transition-colors shadow-md">
                  Access BHUNITI
                </button>
                <button className="px-8 py-3 bg-surface-white border border-border-subtle text-on-surface font-label-caps rounded-lg hover:bg-surface-container transition-colors shadow-sm">
                  Explore How It Works
                </button>
              </div>
              <div className="mt-4 flex items-center gap-4 text-on-surface-variant font-label-caps text-[11px] uppercase tracking-wider">
                <span>Integrated</span>
                <span className="w-1 h-1 rounded-full bg-border-subtle"></span>
                <span>GIS-enabled</span>
                <span className="w-1 h-1 rounded-full bg-border-subtle"></span>
                <span>AI-assisted</span>
                <span className="w-1 h-1 rounded-full bg-border-subtle"></span>
                <span>Auditable</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ── Login modal ─────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-md" />
          <div className="relative bg-surface-white w-full max-w-2xl rounded-2xl shadow-2xl border border-border-subtle overflow-hidden">

            {/* Modal header */}
            <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary/10 rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[20px]">login</span>
                </div>
                <h2 className="font-headline-md text-on-surface">Login to BHUNITI</h2>
              </div>
              <button
                className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors"
                onClick={() => setModalOpen(false)}
              >
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            {/* Modal body */}
            <div className="p-8 grid grid-cols-1 gap-4">
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-caps text-on-surface-variant text-[11px] uppercase tracking-wider"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your official username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(""); }}
                    className="w-full px-4 py-3 rounded-lg border border-border-subtle bg-surface-container-lowest focus:outline-none focus:border-secondary transition-colors font-body-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-caps text-on-surface-variant text-[11px] uppercase tracking-wider"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="w-full px-4 py-3 rounded-lg border border-border-subtle bg-surface-container-lowest focus:outline-none focus:border-secondary transition-colors font-body-md"
                  />
                </div>

                {error && (
                  <p className="text-status-error font-body-sm">{error}</p>
                )}

                {/* Demo credentials hint for hackathon judges */}
                <div className="text-[11px] text-on-surface-variant bg-surface-container-low rounded-lg p-3 font-body-sm">
                  <p className="font-semibold mb-1">Demo credentials:</p>
                  <p>citizen / 1234 &nbsp;·&nbsp; revenue_officer / 1234 &nbsp;·&nbsp; district_officer / 1234</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-secondary text-on-primary font-label-caps rounded-lg hover:bg-secondary-container transition-colors shadow-md mt-2"
                >
                  Sign In
                </button>
              </form>
            </div>

            {/* Modal footer */}
            <div className="p-6 bg-surface-container-lowest border-t border-border-subtle text-center">
              <a className="font-body-sm text-secondary hover:underline" href="#">
                Trouble logging in? Contact Support
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
