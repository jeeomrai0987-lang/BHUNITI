/*
 * Unified login -- Citizen password login and Officer MFA OTP login.
 *
 * Architecture:
 *  - Citizen tab: Username and password direct login.
 *  - Officer tab: Role selection, username, password -> OTP request -> 6-digit OTP verification with resend cooldown.
 *  - All styling strictly adheres to BHUNITI design system tokens (secondary emerald, surface containers, typography).
 */

import { useState, useEffect, useRef } from "react";
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

  // Tabs: "citizen" | "officer"
  const [activeTab, setActiveTab] = useState("citizen");

  // Identifier Mode: "username" | "email" | "mobile"
  const [identifierMode, setIdentifierMode] = useState("username");

  // Form Fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [officerRole, setOfficerRole] = useState("revenue_officer");
  const [otp, setOtp] = useState("");


  // Officer OTP Flow State
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
  const [maskedEmail, setMaskedEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [demoOtpCode, setDemoOtpCode] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  // Forced Password Change Modal State
  const [forcePasswordModalOpen, setForcePasswordModalOpen] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState("");
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState("");

  const timerRef = useRef(null);

  // Sync role parameter from navigation
  useEffect(() => {
    if (requestedRole) {
      const lower = requestedRole.toLowerCase();
      if (lower.includes("revenue")) {
        setActiveTab("officer");
        setOfficerRole("revenue_officer");
        setUsername("revenue_officer");
        setStep(1);
        setModalOpen(true);
      } else if (lower.includes("admin") || lower.includes("district")) {
        setActiveTab("officer");
        setOfficerRole("district_officer");
        setUsername("district_officer");
        setStep(1);
        setModalOpen(true);
      } else if (lower.includes("citizen")) {
        setActiveTab("citizen");
        setUsername("citizen");
        setStep(1);
        setModalOpen(true);
      }
    }
  }, [requestedRole]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      timerRef.current = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resendCooldown]);

  // Escape key closes modal
  useEffect(() => {
    if (!modalOpen) return undefined;
    function handleKeyDown(event) {
      if (event.key === "Escape" && !forcePasswordModalOpen) setModalOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen, forcePasswordModalOpen]);

  function validateIdentifier(value, mode) {
    const clean = value.trim();
    if (!clean) return p("errors.incomplete");
    if (mode === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(clean)) return p("errors.invalidEmail");
    } else if (mode === "mobile") {
      const digits = clean.replace(/\D/g, "");
      if (digits.length < 10) return p("errors.invalidMobile");
    }
    return "";
  }

  /*
   * Handle Citizen Direct Password Login
   */
  async function handleCitizenLogin(e) {
    e.preventDefault();
    setError("");

    const cleanIdentifier = username.trim();
    const cleanPassword = password.trim();

    if (!cleanIdentifier || !cleanPassword) {
      setError(p("errors.incomplete"));
      return;
    }

    const valErr = validateIdentifier(cleanIdentifier, identifierMode);
    if (valErr) {
      setError(valErr);
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.login(cleanIdentifier, cleanPassword);
      if (res && res.force_password_change) {
        setCurrentPasswordInput(cleanPassword);
        setPendingRedirectUrl(res.redirect_url || CITIZEN_ROUTES.portal);
        setForcePasswordModalOpen(true);
        return;
      }
      if (res && res.redirect_url) {
        navigate(res.redirect_url);
      } else {
        navigate(CITIZEN_ROUTES.portal);
      }
    } catch (err) {
      setError(err.message || p("errors.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  }

  /*
   * Handle Officer Request OTP (Step 1)
   */
  async function handleOfficerRequestOtp(e) {
    if (e) e.preventDefault();
    setError("");
    setResendSuccess(false);

    const cleanIdentifier = username.trim();
    const cleanPassword = password.trim();

    if (!cleanIdentifier || !cleanPassword) {
      setError(p("errors.incomplete"));
      return;
    }

    const valErr = validateIdentifier(cleanIdentifier, identifierMode);
    if (valErr) {
      setError(valErr);
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.requestOtp(cleanIdentifier, cleanPassword, officerRole);
      setMaskedEmail(res.masked_email || "registered email");
      if (res.otp_code) {
        setDemoOtpCode(res.otp_code);
      }
      setStep(2);
      setOtp("");
      setResendCooldown(45); // 45-second cooldown
      if (!e) setResendSuccess(true);
    } catch (err) {
      setError(err.message || p("errors.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  }

  /*
   * Handle Officer Verify OTP (Step 2)
   */
  async function handleOfficerVerifyOtp(e) {
    e.preventDefault();
    setError("");

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setError(p("errors.otpIncomplete"));
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.verifyOtp(username.trim(), cleanOtp);
      const defaultTarget =
        officerRole === "district_officer"
          ? ADMIN_ROUTES.overview
          : REVENUE_ROUTES.overview;
      const targetUrl = res.redirect_url || defaultTarget;

      if (res && res.force_password_change) {
        setCurrentPasswordInput(password.trim());
        setPendingRedirectUrl(targetUrl);
        setForcePasswordModalOpen(true);
        return;
      }

      navigate(targetUrl);
    } catch (err) {
      setError(err.message || p("errors.otpInvalid"));
    } finally {
      setLoading(false);
    }
  }

  /*
   * Handle Forced Password Change on First Login
   */
  async function handleForcePasswordChange(e) {
    e.preventDefault();
    setPasswordChangeError("");

    if (!currentPasswordInput) {
      setPasswordChangeError(p("errors.incomplete"));
      return;
    }
    if (newPasswordInput.length < 8) {
      setPasswordChangeError(p("errors.newPasswordShort"));
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError(p("errors.passwordsMismatch"));
      return;
    }

    setPasswordChangeLoading(true);
    try {
      const res = await api.auth.changePassword(currentPasswordInput, newPasswordInput);
      setForcePasswordModalOpen(false);
      navigate(pendingRedirectUrl || res.redirect_url || CITIZEN_ROUTES.portal);
    } catch (err) {
      setPasswordChangeError(err.message || p("errors.passwordChangeFailed"));
    } finally {
      setPasswordChangeLoading(false);
    }
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    setError("");
    setPassword("");
    setOtp("");
    setStep(1);
    setResendSuccess(false);
    setIdentifierMode("username");
  }

  function goBackToCredentials() {
    setStep(1);
    setOtp("");
    setError("");
    setResendSuccess(false);
  }

  return (
    <main className="w-full pt-20">
      <div className="flex flex-col w-full font-body-md text-on-surface">

        {/* Hero section */}
        <section className="relative w-full min-h-[90vh] flex items-center justify-center -mt-20 pt-20 overflow-hidden bg-surface">

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

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm cursor-pointer"
            onClick={() => setModalOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={
              activeTab === "citizen"
                ? p("modal.citizenTitle")
                : step === 1
                ? p("modal.officerTitle")
                : p("modal.otpTitle")
            }
            className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-border-subtle overflow-hidden animate-scaleUp text-on-surface"
          >

            {/* Modal Header */}
            <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                  <span aria-hidden="true" className="material-symbols-outlined text-[24px]">
                    {activeTab === "citizen"
                      ? "person"
                      : step === 1
                      ? "admin_panel_settings"
                      : "sms"}
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-on-surface">
                    {activeTab === "citizen"
                      ? p("modal.citizenTitle")
                      : step === 1
                      ? p("modal.officerTitle")
                      : p("modal.otpTitle")}
                  </h2>

                  <p className="text-xs text-on-surface-variant">
                    {activeTab === "citizen"
                      ? p("modal.citizenSubtitle")
                      : step === 1
                      ? p("modal.officerSubtitle")
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

            {/* TAB SELECTOR */}
            {step === 1 && (
              <div
                role="tablist"
                aria-label="Login Mode"
                className="grid grid-cols-2 border-b border-border-subtle bg-surface-container-lowest"
              >
                <button
                  type="button"
                  role="tab"
                  id="tab-citizen"
                  aria-selected={activeTab === "citizen"}
                  aria-controls="panel-citizen"
                  onClick={() => handleTabChange("citizen")}
                  className={`py-3.5 px-4 font-label-caps text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === "citizen"
                      ? "border-secondary text-secondary bg-white shadow-sm"
                      : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                    person
                  </span>
                  {p("tabs.citizen")}
                </button>

                <button
                  type="button"
                  role="tab"
                  id="tab-officer"
                  aria-selected={activeTab === "officer"}
                  aria-controls="panel-officer"
                  onClick={() => handleTabChange("officer")}
                  className={`py-3.5 px-4 font-label-caps text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === "officer"
                      ? "border-secondary text-secondary bg-white shadow-sm"
                      : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                    shield_person
                  </span>
                  {p("tabs.officer")}
                </button>
              </div>
            )}

            {/* OFFICER STEP PROGRESS */}
            {activeTab === "officer" && (
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
                    {p("steps.credentials")}
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
            )}

            {/* TAB 1: CITIZEN LOGIN */}
            {activeTab === "citizen" && (
              <div id="panel-citizen" role="tabpanel" aria-labelledby="tab-citizen" className="p-6">
                <form className="flex flex-col gap-4" onSubmit={handleCitizenLogin}>

                  {/* Identifier Type Selector & Input */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider"
                        htmlFor="citizen-username"
                      >
                        {identifierMode === "email"
                          ? p("identity.email")
                          : identifierMode === "mobile"
                          ? p("identity.mobile")
                          : p("identity.username")}
                      </label>
                    </div>

                    {/* Segmented Control */}
                    <div
                      role="radiogroup"
                      aria-label="Identifier Type"
                      className="grid grid-cols-3 p-1 bg-surface-container rounded-xl border border-border-subtle text-xs font-semibold mb-1"
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={identifierMode === "username"}
                        onClick={() => {
                          setIdentifierMode("username");
                          setError("");
                        }}
                        className={`py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                          identifierMode === "username"
                            ? "bg-white text-secondary shadow-sm font-bold"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[15px]">
                          account_circle
                        </span>
                        {p("identifierMode.username")}
                      </button>

                      <button
                        type="button"
                        role="radio"
                        aria-checked={identifierMode === "email"}
                        onClick={() => {
                          setIdentifierMode("email");
                          setError("");
                        }}
                        className={`py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                          identifierMode === "email"
                            ? "bg-white text-secondary shadow-sm font-bold"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[15px]">
                          mail
                        </span>
                        {p("identifierMode.email")}
                      </button>

                      <button
                        type="button"
                        role="radio"
                        aria-checked={identifierMode === "mobile"}
                        onClick={() => {
                          setIdentifierMode("mobile");
                          setError("");
                        }}
                        className={`py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                          identifierMode === "mobile"
                            ? "bg-white text-secondary shadow-sm font-bold"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[15px]">
                          phone_iphone
                        </span>
                        {p("identifierMode.mobile")}
                      </button>
                    </div>

                    <input
                      id="citizen-username"
                      type={identifierMode === "email" ? "email" : "text"}
                      inputMode={
                        identifierMode === "email"
                          ? "email"
                          : identifierMode === "mobile"
                          ? "tel"
                          : "text"
                      }
                      autoComplete={identifierMode === "email" ? "email" : "username"}
                      placeholder={
                        identifierMode === "email"
                          ? p("identity.emailPlaceholder")
                          : identifierMode === "mobile"
                          ? p("identity.mobilePlaceholder")
                          : p("identity.usernamePlaceholder")
                      }
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError("");
                      }}
                      className={FIELD_CLASS}
                    />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider"
                      htmlFor="citizen-password"
                    >
                      {p("identity.password")}
                    </label>
                    <input
                      id="citizen-password"
                      type="password"
                      autoComplete="current-password"
                      placeholder={p("identity.passwordPlaceholder")}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      className={FIELD_CLASS}
                    />
                  </div>

                  {/* Error Alert */}
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-secondary hover:bg-secondary-container text-on-primary font-bold text-sm rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span aria-hidden="true" className="material-symbols-outlined animate-spin text-[18px]">
                          progress_activity
                        </span>
                        {p("identity.loggingIn")}
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                          login
                        </span>
                        {p("identity.submitCitizen")}
                      </>
                    )}
                  </button>

                  {/* Citizen Self-Signup Link */}
                  <div className="pt-2 text-center text-xs text-on-surface-variant flex items-center justify-center gap-1.5">
                    <span>{p("signupPrompt")}</span>
                    <button
                      type="button"
                      onClick={() => navigate(MAIN_ROUTES.signup)}
                      className="text-secondary font-bold hover:underline cursor-pointer"
                    >
                      {p("signupLink")}
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* TAB 2: OFFICER LOGIN - STEP 1 (Credentials & Role Selector) */}
            {activeTab === "officer" && step === 1 && (
              <div id="panel-officer" role="tabpanel" aria-labelledby="tab-officer" className="p-6">
                <form className="flex flex-col gap-4" onSubmit={handleOfficerRequestOtp}>

                  {/* Role Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider"
                      htmlFor="officer-role"
                    >
                      {p("identity.roleSelectLabel")}
                    </label>
                    <select
                      id="officer-role"
                      value={officerRole}
                      onChange={(e) => {
                        setOfficerRole(e.target.value);
                        setError("");
                      }}
                      className={`${FIELD_CLASS} cursor-pointer font-semibold`}
                    >
                      <option value="revenue_officer">{p("roles.revenueOfficer")}</option>
                      <option value="district_officer">{p("roles.districtOfficer")}</option>
                    </select>
                  </div>

                  {/* Identifier Type Selector & Input */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider"
                        htmlFor="officer-username"
                      >
                        {identifierMode === "email"
                          ? p("identity.email")
                          : identifierMode === "mobile"
                          ? p("identity.mobile")
                          : p("identity.username")}
                      </label>
                    </div>

                    {/* Segmented Control */}
                    <div
                      role="radiogroup"
                      aria-label="Officer Identifier Type"
                      className="grid grid-cols-3 p-1 bg-surface-container rounded-xl border border-border-subtle text-xs font-semibold mb-1"
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={identifierMode === "username"}
                        onClick={() => {
                          setIdentifierMode("username");
                          setError("");
                        }}
                        className={`py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                          identifierMode === "username"
                            ? "bg-white text-secondary shadow-sm font-bold"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[15px]">
                          account_circle
                        </span>
                        {p("identifierMode.username")}
                      </button>

                      <button
                        type="button"
                        role="radio"
                        aria-checked={identifierMode === "email"}
                        onClick={() => {
                          setIdentifierMode("email");
                          setError("");
                        }}
                        className={`py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                          identifierMode === "email"
                            ? "bg-white text-secondary shadow-sm font-bold"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[15px]">
                          mail
                        </span>
                        {p("identifierMode.email")}
                      </button>

                      <button
                        type="button"
                        role="radio"
                        aria-checked={identifierMode === "mobile"}
                        onClick={() => {
                          setIdentifierMode("mobile");
                          setError("");
                        }}
                        className={`py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                          identifierMode === "mobile"
                            ? "bg-white text-secondary shadow-sm font-bold"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[15px]">
                          phone_iphone
                        </span>
                        {p("identifierMode.mobile")}
                      </button>
                    </div>

                    <input
                      id="officer-username"
                      type={identifierMode === "email" ? "email" : "text"}
                      inputMode={
                        identifierMode === "email"
                          ? "email"
                          : identifierMode === "mobile"
                          ? "tel"
                          : "text"
                      }
                      autoComplete={identifierMode === "email" ? "email" : "username"}
                      placeholder={
                        identifierMode === "email"
                          ? p("identity.emailPlaceholder")
                          : identifierMode === "mobile"
                          ? p("identity.mobilePlaceholder")
                          : p("identity.usernamePlaceholder")
                      }
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError("");
                      }}
                      className={FIELD_CLASS}
                    />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider"
                      htmlFor="officer-password"
                    >
                      {p("identity.password")}
                    </label>
                    <input
                      id="officer-password"
                      type="password"
                      autoComplete="current-password"
                      placeholder={p("identity.passwordPlaceholder")}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      className={FIELD_CLASS}
                    />
                  </div>

                  {/* Error Alert */}
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

                  {/* Request OTP Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-secondary hover:bg-secondary-container text-on-primary font-bold text-sm rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span aria-hidden="true" className="material-symbols-outlined animate-spin text-[18px]">
                          progress_activity
                        </span>
                        {p("identity.sendingOtp")}
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                          send
                        </span>
                        {p("identity.submitOfficer")}
                      </>
                    )}
                  </button>

                </form>
              </div>
            )}

            {/* TAB 2: OFFICER LOGIN - STEP 2 (OTP Entry & Resend Cooldown) */}
            {activeTab === "officer" && step === 2 && (
              <div className="p-6">

                {/* Verified Header Notice */}
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
                        {officerRole === "district_officer"
                          ? p("roles.districtOfficer")
                          : p("roles.revenueOfficer")}
                      </p>
                    </div>
                  </div>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleOfficerVerifyOtp}>

                  <div className="text-center">
                    <p className="text-sm text-on-surface-variant">
                      {p("otp.sentTo")}
                    </p>
                    <p className="font-bold text-sm mt-1 text-secondary">
                      {maskedEmail}
                    </p>
                  </div>

                  {demoOtpCode && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-800">
                      <div className="flex items-center gap-1.5">
                        <span aria-hidden="true" className="material-symbols-outlined text-amber-600 text-[18px]">
                          bolt
                        </span>
                        <span>Demo OTP: <strong className="tracking-widest font-mono text-sm">{demoOtpCode}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtp(demoOtpCode)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  {/* OTP Digits Input */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider text-center"
                      htmlFor="officer-otp"
                    >
                      {p("otp.label")}
                    </label>

                    <input
                      id="officer-otp"
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

                  {/* Resend Cooldown Section */}
                  <div className="flex items-center justify-between px-1 text-xs">
                    {resendCooldown > 0 ? (
                      <span className="text-on-surface-variant font-medium flex items-center gap-1">
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                          schedule
                        </span>
                        {p("otp.resendCooldown", { seconds: resendCooldown })}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOfficerRequestOtp(null)}
                        disabled={loading}
                        className="text-secondary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                          refresh
                        </span>
                        {p("otp.resend")}
                      </button>
                    )}

                    {resendSuccess && (
                      <span className="text-status-success font-semibold">
                        {p("otp.resendSuccess")}
                      </span>
                    )}
                  </div>

                  {/* Error Alert */}
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

                  {/* Verify & Launch Button */}
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

                  {/* Back to Credentials */}
                  <button
                    type="button"
                    onClick={goBackToCredentials}
                    className="w-full py-2.5 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  >
                    {p("otp.back")}
                  </button>

                </form>
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-4 bg-surface-container-lowest border-t border-border-subtle text-center">
              <p className="text-[11px] text-on-surface-variant font-medium">
                {p("modal.footer")}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ── FORCED PASSWORD CHANGE MODAL (FIRST-TIME LOGIN) ──────────────── */}
      {forcePasswordModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={p("forcePasswordChange.title")}
            className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-border-subtle overflow-hidden animate-scaleUp text-on-surface"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-border-subtle flex items-center gap-3 bg-surface-container-lowest">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center">
                <span aria-hidden="true" className="material-symbols-outlined text-[24px]">
                  lock_reset
                </span>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-100 rounded-full w-fit mb-1">
                  <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span className="font-label-caps text-amber-800 uppercase tracking-wider text-[9px]">
                    {p("forcePasswordChange.badge")}
                  </span>
                </div>
                <h2 className="font-display text-xl font-bold text-on-surface">
                  {p("forcePasswordChange.title")}
                </h2>
                <p className="text-xs text-on-surface-variant">
                  {p("forcePasswordChange.subtitle")}
                </p>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6">
              <form className="flex flex-col gap-4" onSubmit={handleForcePasswordChange}>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider"
                    htmlFor="current-temp-password"
                  >
                    {p("forcePasswordChange.currentPassword")} *
                  </label>
                  <input
                    id="current-temp-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder={p("forcePasswordChange.currentPasswordPlaceholder")}
                    value={currentPasswordInput}
                    onChange={(e) => {
                      setCurrentPasswordInput(e.target.value);
                      setPasswordChangeError("");
                    }}
                    className={FIELD_CLASS}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider"
                    htmlFor="new-permanent-password"
                  >
                    {p("forcePasswordChange.newPassword")} *
                  </label>
                  <input
                    id="new-permanent-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder={p("forcePasswordChange.newPasswordPlaceholder")}
                    value={newPasswordInput}
                    onChange={(e) => {
                      setNewPasswordInput(e.target.value);
                      setPasswordChangeError("");
                    }}
                    className={FIELD_CLASS}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-caps text-on-surface text-xs font-bold uppercase tracking-wider"
                    htmlFor="confirm-permanent-password"
                  >
                    {p("forcePasswordChange.confirmPassword")} *
                  </label>
                  <input
                    id="confirm-permanent-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder={p("forcePasswordChange.confirmPasswordPlaceholder")}
                    value={confirmPasswordInput}
                    onChange={(e) => {
                      setConfirmPasswordInput(e.target.value);
                      setPasswordChangeError("");
                    }}
                    className={FIELD_CLASS}
                  />
                </div>

                {/* Error Alert */}
                {passwordChangeError && (
                  <p
                    role="alert"
                    className="text-status-error text-xs font-bold bg-status-error/10 p-2.5 rounded-lg flex items-center gap-1.5"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                      error
                    </span>
                    {passwordChangeError}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={passwordChangeLoading}
                  className="w-full py-3.5 bg-secondary hover:bg-secondary-container text-on-primary font-bold text-sm rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {passwordChangeLoading ? (
                    <>
                      <span aria-hidden="true" className="material-symbols-outlined animate-spin text-[18px]">
                        progress_activity
                      </span>
                      {p("forcePasswordChange.submitting")}
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                        verified_user
                      </span>
                      {p("forcePasswordChange.submit")}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
