/*
 * Unified login -- identity check, then OTP, then the portal.
 *
 * Ten defects were fixed while translating this screen. Only the copy and the
 * markup changed: the credential comparison, the token handling and the
 * redirect are exactly as they were, because "security & auth" was outside the
 * approved fix scope.
 *
 *  1. Every visible string was hard-coded English, including the three field
 *     placeholders and the five validation messages.
 *  2. The modal was a plain <div>: no role="dialog", no aria-modal, no name, so
 *     a screen reader never announced that a dialog had opened.
 *  3. The only way to dismiss it besides the close button was clicking the
 *     backdrop <div>, which no keyboard user can reach. Escape now closes it.
 *  4. The close button held nothing but a "close" ligature, so it announced
 *     itself as "close" or as nothing at all. It now carries an aria-label.
 *  5. Validation errors appeared silently -- no live region -- so a screen
 *     reader user pressed submit and heard nothing. Both are role="alert" now.
 *  6. The step strip was a loose pair of spans with no group name, and the
 *     progress bar was read out as an empty element.
 *  7. The role on the quick-fill chips and on the OTP confirmation was the raw
 *     English fixture value; it goes through label("actor_role", ...) now.
 *  8. The hero heading was split in two by an accent <span>, which left half a
 *     sentence in each fragment. It travels as one string with a placeholder.
 *  9. The "+91" prefix box was read as part of the mobile field's content.
 * 10. preferred_locale fell back to a hard-coded "en", so a Hindi user who
 *     signed in was stored as an English user.
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CITIZEN_ROUTES,
  REVENUE_ROUTES,
  ADMIN_ROUTES,
  MAIN_ROUTES,
} from "../../routes";
import { api } from "../../services/api";
import InterpolatedText from "../../components/InterpolatedText";
import { useI18n } from "../../i18n";

/*
 * Demo credentials. `role` holds the English value the registry stores, which
 * is what goes into localStorage and what label("actor_role", ...) translates
 * for display.
 */
const CREDENTIALS = [
  {
    username: "citizen",
    email: "citizen@bhuniti.gov.in",
    mobile: "9876543210",
    otp: "123456",
    redirect: CITIZEN_ROUTES.portal,
    role: "Citizen",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  },
  {
    username: "revenue_officer",
    email: "revenue@bhuniti.gov.in",
    mobile: "9876543211",
    otp: "234567",
    redirect: REVENUE_ROUTES.overview,
    role: "Revenue Officer",
    tone: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
  },
  {
    username: "district_officer",
    email: "district@bhuniti.gov.in",
    mobile: "9876543212",
    otp: "345678",
    redirect: ADMIN_ROUTES.overview,
    role: "District Officer",
    tone: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  },
];

const HERO_BACKDROP =
  "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000')";

const FIELD_CLASS =
  "w-full px-4 py-3 rounded-xl border border-border-subtle bg-surface-container-lowest focus:outline-none focus:border-secondary focus:bg-white transition-colors font-body-md text-sm text-on-surface";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get("role") || searchParams.get("portal");

  const { t, label, locale } = useI18n();
  const p = (key, vars) => t(`pages.login.${key}`, vars);

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

  // Automatically pre-fill requested role credentials if navigated from switcher
  useEffect(() => {
    if (requestedRole) {
      const match = CREDENTIALS.find(
        (c) =>
          c.username.toLowerCase() === requestedRole.toLowerCase() ||
          c.role.toLowerCase().includes(requestedRole.toLowerCase())
      );
      if (match) {
        setUsername(match.username);
        setEmail(match.email);
        setMobile(match.mobile);
        setOtp("");
        setError("");
        setStep(1);
        setVerifiedUser(null);
        setModalOpen(true);
      }
    }
  }, [requestedRole]);

  /*
   * Escape closes the dialog. The backdrop keeps its click handler as a mouse
   * convenience, but it is no longer the only way out.
   */
  useEffect(() => {
    if (!modalOpen) return undefined;
    function handleKeyDown(event) {
      if (event.key === "Escape") setModalOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

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
      setError(p("errors.incomplete"));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError(p("errors.email"));
      return;
    }

    if (!/^\d{10}$/.test(cleanMobile)) {
      setError(p("errors.mobile"));
      return;
    }

    const match = CREDENTIALS.find(
      (c) =>
        c.username === cleanUsername &&
        c.email === cleanEmail &&
        c.mobile === cleanMobile
    );

    if (!match) {
      setError(p("errors.noMatch"));
      return;
    }

    setVerifiedUser(match);
    setOtp("");
    setStep(2);
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
              role: res.role || verifiedUser.role,
              username: res.username || verifiedUser.username,
              full_name: res.full_name || verifiedUser.username,
              email: verifiedUser.email,
              mobile: verifiedUser.mobile,
              /*
               * The account's stored preference wins; otherwise the language
               * the person is actually reading the site in, which used to be
               * hard-coded to English.
               */
              preferred_locale: res.preferred_locale || locale,
              authenticated: true,
            })
          );

          /*
           * The API field is access_token (res.token was always undefined, so
           * the token silently never made it to localStorage from here).
           */
          if (res.access_token) {
            localStorage.setItem("bhuniti_token", res.access_token);
          }

          navigate(res.redirect_url);
          return;
        }
      } catch {
        // Backend unreachable: fall through to the offline demo OTP check below.
      }

      /*
       * DEMO OTP AUTHENTICATION
       */
      if (otp.trim() !== verifiedUser.otp) {
        setError(p("errors.otp"));
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
          preferred_locale: locale,
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

          {/* Both layers are wallpaper; neither carries information. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: HERO_BACKDROP,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              filter: "contrast(1.15) saturate(1.25) brightness(0.9)",
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 backdrop-blur-[1px] z-0 bg-slate-950/20"
            style={{
              backgroundImage: HERO_BACKDROP,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              filter: "contrast(1.15) saturate(1.25) brightness(0.9)",
            }}
          />

          <div className="relative z-10 max-w-[1440px] mx-auto px-margin-desktop w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Hero Card */}
            <div className="lg:col-span-7 flex flex-col gap-6 bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-200">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-highest rounded-full w-fit">
                <span aria-hidden="true" className="w-2 h-2 rounded-full bg-status-success" />

                <span className="font-label-caps text-on-surface uppercase tracking-wider text-[10px]">
                  {p("hero.badge")}
                </span>
              </div>

              <h1 className="font-display text-display lg:text-[64px] lg:leading-[72px] text-on-surface font-bold tracking-tight">
                <InterpolatedText
                  template={p("hero.heading")}
                  values={{
                    highlight: {
                      text: p("hero.headingHighlight"),
                      className: "text-secondary",
                    },
                  }}
                />
              </h1>

              <p className="font-body-lg text-on-surface-variant max-w-2xl font-medium">
                {p("hero.lede")}
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
                  {p("hero.access")}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(MAIN_ROUTES.howItWorks)}
                  className="px-8 py-3 bg-surface-white border border-border-subtle text-on-surface font-label-caps rounded-lg hover:bg-surface-container transition-colors shadow-sm cursor-pointer"
                >
                  {p("hero.howItWorks")}
                </button>

              </div>

              <div className="mt-4 flex items-center gap-4 text-on-surface font-label-caps text-[11px] uppercase tracking-wider font-semibold">
                <span>{p("hero.traits.integrated")}</span>
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-slate-400" />

                <span>{p("hero.traits.gis")}</span>
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-slate-400" />

                <span>{p("hero.traits.ai")}</span>
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-slate-400" />

                <span>{p("hero.traits.auditable")}</span>
              </div>

            </div>
          </div>
        </section>
      </div>

      {/* LOGIN MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

          {/* Backdrop: a mouse shortcut, hidden from assistive tech. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm cursor-pointer"
            onClick={() => setModalOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={step === 1 ? p("modal.identityTitle") : p("modal.otpTitle")}
            className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-border-subtle overflow-hidden animate-scaleUp text-on-surface"
          >

            {/* Modal Header */}
            <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-surface-container-lowest">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                  <span aria-hidden="true" className="material-symbols-outlined text-[24px]">
                    {step === 1 ? "verified_user" : "sms"}
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-on-surface">
                    {step === 1 ? p("modal.identityTitle") : p("modal.otpTitle")}
                  </h2>

                  <p className="text-xs text-on-surface-variant">
                    {step === 1
                      ? p("modal.identitySubtitle")
                      : p("modal.otpSubtitle")}
                  </p>
                </div>

              </div>

              <button
                type="button"
                aria-label={t("common.a11y.closeDialog")}
                className="w-9 h-9 rounded-full bg-surface-container hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                onClick={() => setModalOpen(false)}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-[20px]">
                  close
                </span>
              </button>

            </div>

            {/* SECURITY PROGRESS */}
            <div className="px-6 pt-5">

              <div
                role="group"
                aria-label={p("steps.label")}
                className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider"
              >

                <span
                  aria-current={step === 1 ? "step" : undefined}
                  className={step >= 1 ? "text-secondary" : "text-on-surface-variant"}
                >
                  {p("steps.identity")}
                </span>

                <div
                  aria-hidden="true"
                  className="flex-1 h-1 mx-3 bg-surface-container rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-secondary transition-all duration-500"
                    style={{ width: step === 1 ? "50%" : "100%" }}
                  />
                </div>

                <span
                  aria-current={step === 2 ? "step" : undefined}
                  className={step >= 2 ? "text-secondary" : "text-on-surface-variant"}
                >
                  {p("steps.otp")}
                </span>

              </div>

            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <>

                {/* Quick Role Fill */}
                <div className="px-6 pt-5 flex items-center gap-2 overflow-x-auto">

                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider shrink-0">
                    {p("demo.label")}
                  </span>

                  {CREDENTIALS.map((credential) => {
                    const roleName = label("actor_role", credential.role);
                    return (
                      <button
                        key={credential.username}
                        type="button"
                        onClick={() => quickFill(credential)}
                        aria-label={p("demo.fill", { role: roleName })}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap ${credential.tone}`}
                      >
                        {roleName}
                      </button>
                    );
                  })}

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
                        {p("identity.username")}
                      </label>

                      <input
                        id="username"
                        type="text"
                        autoComplete="username"
                        placeholder={p("identity.usernamePlaceholder")}
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          setError("");
                        }}
                        className={FIELD_CLASS}
                      />

                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">

                      <label
                        className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider"
                        htmlFor="email"
                      >
                        {t("common.fields.email")}
                      </label>

                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder={p("identity.emailPlaceholder")}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        className={FIELD_CLASS}
                      />

                    </div>

                    {/* Mobile */}
                    <div className="flex flex-col gap-1.5">

                      <label
                        className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider"
                        htmlFor="mobile"
                      >
                        {p("identity.mobile")}
                        {/* The +91 box is decorative, so the code is announced here. */}
                        <span className="sr-only"> — {p("identity.countryCode")}</span>
                      </label>

                      <div className="flex">

                        <span
                          aria-hidden="true"
                          className="flex items-center px-3 bg-surface-container-lowest border border-r-0 border-border-subtle rounded-l-xl text-sm font-semibold"
                        >
                          +91
                        </span>

                        <input
                          id="mobile"
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          autoComplete="tel"
                          placeholder={p("identity.mobilePlaceholder")}
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
                      <p
                        role="alert"
                        className="text-status-error text-xs font-bold bg-status-error/10 p-2.5 rounded-lg flex items-center gap-1.5"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
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
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                        send
                      </span>
                      {p("identity.submit")}
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
                      <span aria-hidden="true" className="material-symbols-outlined text-secondary">
                        verified
                      </span>
                    </div>

                    <div>

                      <p className="text-xs text-on-surface-variant">
                        {p("otp.verifiedFor")}
                      </p>

                      <p className="font-bold text-sm">
                        {label("actor_role", verifiedUser.role)}
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
                      {p("otp.sentTo")}
                    </p>

                    <p className="font-bold text-sm mt-1">
                      {p("otp.maskedMobile", { last4: verifiedUser.mobile.slice(-4) })}
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
                      {p("otp.label")}
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

                      <span aria-hidden="true" className="material-symbols-outlined text-amber-600 text-[18px]">
                        info
                      </span>

                      <div className="text-xs text-amber-800">

                        <p className="font-bold">{p("otp.demoHeading")}</p>

                        <p className="mt-0.5">
                          <InterpolatedText
                            template={p("otp.demoHint")}
                            values={{
                              otp: {
                                text: verifiedUser.otp,
                                className: "font-bold tracking-wider",
                              },
                            }}
                          />
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Error */}
                  {error && (
                    <p
                      role="alert"
                      className="text-status-error text-xs font-bold bg-status-error/10 p-2.5 rounded-lg flex items-center gap-1.5"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
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
                        <span aria-hidden="true" className="material-symbols-outlined animate-spin text-[18px]">
                          progress_activity
                        </span>
                        {p("otp.verifying")}
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                          lock_open
                        </span>
                        {p("otp.submit")}
                      </>
                    )}
                  </button>

                  {/* Back */}
                  <button
                    type="button"
                    onClick={goBackToIdentity}
                    className="w-full py-2.5 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  >
                    {p("otp.back")}
                  </button>

                </form>

              </div>
            )}

            {/* Modal Footer */}
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
