import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CITIZEN_ROUTES,
  REVENUE_ROUTES,
  ADMIN_ROUTES,
  MAIN_ROUTES,
} from "../../routes";
import { api } from "../../services/api";

const CREDENTIALS = [
  {
    username: "citizen",
    email: "citizen@bhuniti.gov.in",
    mobile: "9876543210",
    otp: "123456",
    redirect: CITIZEN_ROUTES.portal,
    role: "Citizen",
  },
  {
    username: "revenue_officer",
    email: "revenue@bhuniti.gov.in",
    mobile: "9876543211",
    otp: "234567",
    redirect: REVENUE_ROUTES.overview,
    role: "Revenue Officer",
  },
  {
    username: "district_officer",
    email: "district@bhuniti.gov.in",
    mobile: "9876543212",
    otp: "345678",
    redirect: ADMIN_ROUTES.overview,
    role: "District Officer",
  },
];

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  // Authentication stages
  const [step, setStep] = useState(1);

  // Stores the matched user after verification
  const [verifiedUser, setVerifiedUser] = useState(null);

  /*
   * STEP 1
   * Verify username, email and mobile number
   */
  function handleIdentityVerification(e) {
    e.preventDefault();
    setError("");

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.trim();

    if (!cleanUsername || !cleanEmail || !cleanMobile) {
      setError("Please enter username, email ID and mobile number.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(cleanMobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const match = CREDENTIALS.find(
      (c) =>
        c.username === cleanUsername &&
        c.email === cleanEmail &&
        c.mobile === cleanMobile
    );

    if (!match) {
      setError(
        "The username, email ID and mobile number do not match our records."
      );
      return;
    }

    setVerifiedUser(match);
    setOtp("");
    setStep(2);

    // Demo OTP message
    console.log(`Demo OTP for ${match.role}: ${match.otp}`);
  }

  /*
   * STEP 2
   * Verify OTP and launch appropriate portal
   */
  async function handleOtpVerification(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      /*
       * Try real backend authentication first.
       * If backend supports OTP authentication, it can be
       * connected here later.
       */
      try {
        const res = await api.auth.login(
          verifiedUser.username,
          verifiedUser.otp
        );

        if (res && res.redirect_url) {
          localStorage.setItem(
            "bhuniti_user",
            JSON.stringify({
              role: verifiedUser.role,
              username: verifiedUser.username,
              email: verifiedUser.email,
              mobile: verifiedUser.mobile,
            })
          );

          if (res.token) {
            localStorage.setItem("bhuniti_token", res.token);
          }

          navigate(res.redirect_url);
          return;
        }
      } catch (backendError) {
        console.log(
          "Backend OTP authentication unavailable:",
          backendError.message
        );
      }

      /*
       * DEMO OTP AUTHENTICATION
       */
      if (otp.trim() !== verifiedUser.otp) {
        setError("Invalid OTP. Please enter the correct 6-digit OTP.");
        return;
      }

      // Save demo authentication information
      localStorage.setItem(
        "bhuniti_token",
        "secure-demo-token-" + verifiedUser.username
      );

      localStorage.setItem(
        "bhuniti_user",
        JSON.stringify({
          role: verifiedUser.role,
          username: verifiedUser.username,
          email: verifiedUser.email,
          mobile: verifiedUser.mobile,
          authenticated: true,
        })
      );

      // Launch appropriate dashboard
      navigate(verifiedUser.redirect);
    } finally {
      setLoading(false);
    }
  }

  /*
   * Quick Role Fill
   */
  function quickFill(user) {
    setUsername(user.username);
    setEmail(user.email);
    setMobile(user.mobile);
    setOtp("");
    setError("");
    setStep(1);
    setVerifiedUser(null);
  }

  /*
   * Go back from OTP screen
   */
  function goBackToIdentity() {
    setStep(1);
    setOtp("");
    setError("");
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

            {/* Hero Card */}
            <div className="lg:col-span-7 flex flex-col gap-6 bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-200">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-highest rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-status-success"></span>

                <span className="font-label-caps text-on-surface uppercase tracking-wider text-[10px]">
                  National Infrastructure Initiative
                </span>
              </div>

              <h1 className="font-display text-display lg:text-[64px] lg:leading-[72px] text-on-surface font-bold tracking-tight">
                Building a Trusted Digital Foundation for{" "}
                <span className="text-secondary">
                  Land Governance
                </span>
              </h1>

              <p className="font-body-lg text-on-surface-variant max-w-2xl font-medium">
                BHUNITI integrates land records, GIS, registration,
                mutation, and historical data into one intelligent,
                parcel-centric governance platform.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4">

                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(true);
                    setStep(1);
                  }}
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

      {/* LOGIN MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

          {/* Background */}
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm cursor-pointer"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-border-subtle overflow-hidden animate-scaleUp text-on-surface">

            {/* Modal Header */}
            <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-surface-container-lowest">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">
                    {step === 1 ? "verified_user" : "sms"}
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-on-surface">
                    {step === 1
                      ? "Secure Access to BHUNITI"
                      : "Verify One-Time Password"}
                  </h2>

                  <p className="text-xs text-on-surface-variant">
                    {step === 1
                      ? "Identity Verification & RBAC Access"
                      : "Multi-Factor Authentication"}
                  </p>
                </div>

              </div>

              <button
                type="button"
                className="w-9 h-9 rounded-full bg-surface-container hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                onClick={() => setModalOpen(false)}
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                  close
                </span>
              </button>

            </div>

            {/* SECURITY PROGRESS */}
            <div className="px-6 pt-5">

              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">

                <span
                  className={
                    step >= 1
                      ? "text-secondary"
                      : "text-on-surface-variant"
                  }
                >
                  1. Identity
                </span>

                <div className="flex-1 h-1 mx-3 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary transition-all duration-500"
                    style={{
                      width: step === 1 ? "50%" : "100%",
                    }}
                  />
                </div>

                <span
                  className={
                    step >= 2
                      ? "text-secondary"
                      : "text-on-surface-variant"
                  }
                >
                  2. OTP
                </span>

              </div>

            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <>

                {/* Quick Role Fill */}
                <div className="px-6 pt-5 flex items-center gap-2 overflow-x-auto">

                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider shrink-0">
                    Demo:
                  </span>

                  <button
                    type="button"
                    onClick={() => quickFill(CREDENTIALS[0])}
                    className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  >
                    Citizen
                  </button>

                  <button
                    type="button"
                    onClick={() => quickFill(CREDENTIALS[1])}
                    className="px-2.5 py-1 text-xs bg-sky-50 text-sky-700 font-bold rounded-lg border border-sky-200 hover:bg-sky-100 transition-colors"
                  >
                    Revenue Officer
                  </button>

                  <button
                    type="button"
                    onClick={() => quickFill(CREDENTIALS[2])}
                    className="px-2.5 py-1 text-xs bg-purple-50 text-purple-700 font-bold rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                  >
                    District Officer
                  </button>

                </div>

                {/* Identity Form */}
                <div className="p-6">

                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleIdentityVerification}
                  >

                    {/* Username */}
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
                        placeholder="e.g. citizen"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          setError("");
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-surface-container-lowest focus:outline-none focus:border-secondary focus:bg-white transition-colors font-body-md text-sm text-on-surface"
                      />

                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">

                      <label
                        className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider"
                        htmlFor="email"
                      >
                        Registered Email ID
                      </label>

                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="e.g. citizen@bhuniti.gov.in"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-surface-container-lowest focus:outline-none focus:border-secondary focus:bg-white transition-colors font-body-md text-sm text-on-surface"
                      />

                    </div>

                    {/* Mobile */}
                    <div className="flex flex-col gap-1.5">

                      <label
                        className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider"
                        htmlFor="mobile"
                      >
                        Registered Mobile Number
                      </label>

                      <div className="flex">

                        <span className="flex items-center px-3 bg-surface-container-lowest border border-r-0 border-border-subtle rounded-l-xl text-sm font-semibold">
                          +91
                        </span>

                        <input
                          id="mobile"
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          autoComplete="tel"
                          placeholder="10-digit mobile number"
                          value={mobile}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setMobile(value);
                            setError("");
                          }}
                          className="w-full px-4 py-3 rounded-r-xl border border-border-subtle bg-surface-container-lowest focus:outline-none focus:border-secondary focus:bg-white transition-colors font-body-md text-sm text-on-surface"
                        />

                      </div>

                    </div>

                    {/* Error */}
                    {error && (
                      <p className="text-status-error text-xs font-bold bg-status-error/10 p-2.5 rounded-lg flex items-center gap-1.5">

                        <span className="material-symbols-outlined text-[16px]">
                          error
                        </span>

                        {error}

                      </p>
                    )}

                    {/* Continue */}
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-secondary hover:bg-secondary-container text-on-primary font-bold text-sm rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
                    >

                      <span className="material-symbols-outlined text-[18px]">
                        send
                      </span>

                      Send Verification OTP

                    </button>

                  </form>

                </div>
              </>
            )}

            {/* STEP 2 - OTP */}
            {step === 2 && verifiedUser && (
              <div className="p-6">

                <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4 mb-5">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary">
                        verified
                      </span>
                    </div>

                    <div>

                      <p className="text-xs text-on-surface-variant">
                        Identity verified for
                      </p>

                      <p className="font-bold text-sm">
                        {verifiedUser.role}
                      </p>

                    </div>

                  </div>

                </div>

                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleOtpVerification}
                >

                  <div className="text-center">

                    <p className="text-sm text-on-surface-variant">
                      A 6-digit verification code has been sent to
                    </p>

                    <p className="font-bold text-sm mt-1">
                      +91 ******{verifiedUser.mobile.slice(-4)}
                    </p>

                    <p className="text-xs text-on-surface-variant mt-1">
                      {verifiedUser.email}
                    </p>

                  </div>

                  {/* OTP */}
                  <div className="flex flex-col gap-1.5">

                    <label
                      className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider text-center"
                      htmlFor="otp"
                    >
                      Enter 6-Digit OTP
                    </label>

                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setOtp(value);
                        setError("");
                      }}
                      className="w-full px-4 py-4 rounded-xl border border-border-subtle bg-surface-container-lowest focus:outline-none focus:border-secondary focus:bg-white transition-colors text-center text-2xl tracking-[0.6em] font-bold text-on-surface"
                    />

                  </div>

                  {/* Demo OTP Notice */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">

                    <div className="flex items-start gap-2">

                      <span className="material-symbols-outlined text-amber-600 text-[18px]">
                        info
                      </span>

                      <div className="text-xs text-amber-800">

                        <p className="font-bold">
                          Demo Mode
                        </p>

                        <p className="mt-0.5">
                          Use OTP:{" "}
                          <span className="font-bold tracking-wider">
                            {verifiedUser.otp}
                          </span>
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-status-error text-xs font-bold bg-status-error/10 p-2.5 rounded-lg flex items-center gap-1.5">

                      <span className="material-symbols-outlined text-[16px]">
                        error
                      </span>

                      {error}

                    </p>
                  )}

                  {/* Authenticate */}
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3.5 bg-secondary hover:bg-secondary-container disabled:opacity-50 disabled:cursor-not-allowed text-on-primary font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >

                    {loading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[18px]">
                          progress_activity
                        </span>

                        Verifying...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">
                          lock_open
                        </span>

                        Verify OTP & Launch Portal
                      </>
                    )}

                  </button>

                  {/* Back */}
                  <button
                    type="button"
                    onClick={goBackToIdentity}
                    className="w-full py-2.5 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  >
                    ← Change identity details
                  </button>

                </form>

              </div>
            )}

            {/* Modal Footer */}
            <div className="p-4 bg-surface-container-lowest border-t border-border-subtle text-center text-xs text-on-surface-variant">

              <div className="flex items-center justify-center gap-2">

                <span className="material-symbols-outlined text-[15px]">
                  shield
                </span>

                <span>
                  Secure Gov-ID Access • 256-Bit TLS Encrypted
                </span>

              </div>

            </div>

          </div>
        </div>
      )}
    </main>
  );
}
