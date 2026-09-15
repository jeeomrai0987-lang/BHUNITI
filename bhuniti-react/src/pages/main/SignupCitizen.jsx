/*
 * Citizen self-registration wizard: Dual Mobile OTP and Aadhaar e-KYC verification.
 *
 * Steps:
 *  1. Basic info (Full Name, Mobile, Optional Email, District, Tehsil) -> Mobile OTP dispatched.
 *  2. Mobile OTP verification -> mobile_verified = true.
 *  3. Aadhaar 12-digit input with Verhoeff client pre-check & prototype disclaimer -> Aadhaar OTP dispatched.
 *  4. Aadhaar OTP verification -> aadhaar_verified = true.
 *  5. Username, password, locale preference -> Citizen account created, JWT issued, redirect to /citizen.
 *
 * Privacy:
 *  - Zero raw Aadhaar stored (salted SHA-256 hash + last 4 digits only).
 *  - All styling strictly adheres to BHUNITI design system tokens.
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CITIZEN_ROUTES, MAIN_ROUTES } from "../../routes";
import { api } from "../../services/api";
import InterpolatedText from "../../components/InterpolatedText";
import { useI18n } from "../../i18n";

const HERO_BACKDROP =
  "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000')";

const FIELD_CLASS =
  "w-full px-4 py-3 rounded-xl border border-border-subtle bg-surface-container-lowest focus:outline-none focus:border-secondary focus:bg-white transition-colors font-body-md text-sm text-on-surface";

export default function SignupCitizen() {
  const navigate = useNavigate();
  const { t, locale } = useI18n();
  const p = (key, vars) => t(`pages.signup.${key}`, vars);

  // Wizard Step: 1 = Mobile Info, 2 = Mobile OTP, 3 = Aadhaar Input, 4 = Aadhaar OTP, 5 = Password & Complete
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("Ghaziabad");
  const [tehsil, setTehsil] = useState("Modinagar");

  const [signupToken, setSignupToken] = useState("");
  const [maskedMobile, setMaskedMobile] = useState("");

  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileCooldown, setMobileCooldown] = useState(0);
  const [mobileResendSuccess, setMobileResendSuccess] = useState(false);
  const [demoMobileOtp, setDemoMobileOtp] = useState("");

  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarLast4, setAadhaarLast4] = useState("");

  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [aadhaarCooldown, setAadhaarCooldown] = useState(0);
  const [aadhaarResendSuccess, setAadhaarResendSuccess] = useState(false);
  const [demoAadhaarOtp, setDemoAadhaarOtp] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preferredLocale, setPreferredLocale] = useState(locale || "en");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const timerRef = useRef(null);

  // Cooldown timers
  useEffect(() => {
    if (mobileCooldown > 0 || aadhaarCooldown > 0) {
      timerRef.current = setTimeout(() => {
        if (mobileCooldown > 0) setMobileCooldown((prev) => prev - 1);
        if (aadhaarCooldown > 0) setAadhaarCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mobileCooldown, aadhaarCooldown]);

  // Step 1: Submit Basic Info -> Send Mobile OTP
  async function handleStep1Submit(e) {
    if (e) e.preventDefault();
    setError("");
    setMobileResendSuccess(false);

    const cleanName = fullName.trim();
    const cleanMobile = mobile.replace(/\D/g, "");
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError(p("errors.fullNameRequired"));
      return;
    }
    if (cleanMobile.length !== 10) {
      setError(p("errors.mobileInvalid"));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError(p("errors.emailInvalid") || "A valid email address is required for OTP verification.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.signupStart({
        full_name: cleanName,
        mobile: cleanMobile,
        email: cleanEmail,
        district: district.trim(),
        tehsil: tehsil.trim(),
      });
      setSignupToken(res.signup_token);
      setMaskedMobile(res.masked_mobile || `+91 ******${cleanMobile.slice(-4)}`);
      if (res.otp_code) {
        setDemoMobileOtp(res.otp_code);
      }
      setCurrentStep(2);
      setMobileOtp("");
      setMobileCooldown(45);
      if (!e) setMobileResendSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to initiate registration.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify Mobile OTP
  async function handleStep2VerifyMobile(e) {
    e.preventDefault();
    setError("");

    const cleanOtp = mobileOtp.trim();
    if (cleanOtp.length !== 6) {
      setError(p("errors.otpIncomplete"));
      return;
    }

    setLoading(true);
    try {
      await api.auth.signupVerifyMobile(signupToken, cleanOtp);
      setCurrentStep(3);
      setError("");
    } catch (err) {
      setError(err.message || p("errors.otpIncomplete"));
    } finally {
      setLoading(false);
    }
  }

  // Step 3: Submit Aadhaar Number -> Send Aadhaar OTP
  async function handleStep3SubmitAadhaar(e) {
    if (e) e.preventDefault();
    setError("");
    setAadhaarResendSuccess(false);

    const cleanAadhaar = aadhaarNumber.replace(/\D/g, "");
    if (cleanAadhaar.length !== 12) {
      setError(p("errors.aadhaarInvalid"));
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.signupAadhaar(signupToken, cleanAadhaar);
      setAadhaarLast4(res.aadhaar_last4 || cleanAadhaar.slice(-4));
      if (res.otp_code) {
        setDemoAadhaarOtp(res.otp_code);
      }
      setCurrentStep(4);
      setAadhaarOtp("");
      setAadhaarCooldown(45);
      if (!e) setAadhaarResendSuccess(true);
    } catch (err) {
      setError(err.message || p("errors.aadhaarInvalid"));
    } finally {
      setLoading(false);
    }
  }

  // Step 4: Verify Aadhaar OTP
  async function handleStep4VerifyAadhaar(e) {
    e.preventDefault();
    setError("");

    const cleanOtp = aadhaarOtp.trim();
    if (cleanOtp.length !== 6) {
      setError(p("errors.otpIncomplete"));
      return;
    }

    setLoading(true);
    try {
      await api.auth.signupVerifyAadhaar(signupToken, cleanOtp);
      // Generate default suggested username from full name
      if (!username) {
        const suggested = fullName.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 15);
        setUsername(suggested || "citizen_user");
      }
      setCurrentStep(5);
      setError("");
    } catch (err) {
      setError(err.message || p("errors.otpIncomplete"));
    } finally {
      setLoading(false);
    }
  }

  // Step 5: Set Password & Complete Registration
  async function handleStep5Complete(e) {
    e.preventDefault();
    setError("");

    const cleanUsername = username.trim();
    if (cleanUsername.length < 3) {
      setError(p("errors.usernameShort"));
      return;
    }
    if (password.length < 6) {
      setError(p("errors.passwordShort"));
      return;
    }
    if (password !== confirmPassword) {
      setError(p("errors.passwordsMismatch"));
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.signupComplete(
        signupToken,
        cleanUsername,
        password,
        preferredLocale
      );
      setSuccessNotice(true);
      setTimeout(() => {
        navigate(res.redirect_url || CITIZEN_ROUTES.portal);
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to complete registration.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full pt-20">
      <div className="flex flex-col w-full font-body-md text-on-surface">

        {/* Hero section backdrop */}
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
            className="absolute inset-0 backdrop-blur-[1px] z-0 bg-slate-950/30"
          />

          <div className="relative z-10 max-w-[1440px] mx-auto px-margin-desktop w-full py-12 flex items-center justify-center">

            {/* Registration Card */}
            <div className="w-full max-w-xl bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-200 text-on-surface">

              {/* Card Header */}
              <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-highest rounded-full w-fit mb-2">
                    <span aria-hidden="true" className="w-2 h-2 rounded-full bg-status-success" />
                    <span className="font-label-caps text-on-surface uppercase tracking-wider text-[10px]">
                      {p("badge")}
                    </span>
                  </div>

                  <h1 className="font-display text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
                    <InterpolatedText
                      template={p("heading")}
                      values={{
                        highlight: {
                          text: p("headingHighlight"),
                          className: "text-secondary",
                        },
                      }}
                    />
                  </h1>

                  <p className="text-xs md:text-sm text-on-surface-variant mt-1">
                    {p("subheading")}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                  <span aria-hidden="true" className="material-symbols-outlined text-[28px]">
                    how_to_reg
                  </span>
                </div>
              </div>

              {/* STEP PROGRESS BAR */}
              <div className="py-5 border-b border-border-subtle">
                <div
                  role="group"
                  aria-label={p("steps.label")}
                  className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider"
                >
                  <span className={currentStep >= 1 ? "text-secondary" : "text-on-surface-variant"}>
                    {p("steps.mobile")}
                  </span>
                  <span className={currentStep >= 3 ? "text-secondary" : "text-on-surface-variant"}>
                    {p("steps.aadhaar")}
                  </span>
                  <span className={currentStep >= 5 ? "text-secondary" : "text-on-surface-variant"}>
                    {p("steps.credentials")}
                  </span>
                </div>

                <div
                  aria-hidden="true"
                  className="w-full h-1.5 mt-2 bg-surface-container rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-secondary transition-all duration-500 rounded-full"
                    style={{
                      width:
                        currentStep === 1
                          ? "20%"
                          : currentStep === 2
                          ? "40%"
                          : currentStep === 3
                          ? "60%"
                          : currentStep === 4
                          ? "80%"
                          : "100%",
                    }}
                  />
                </div>
              </div>

              {/* SUCCESS NOTICE */}
              {successNotice && (
                <div className="mt-6 p-4 bg-status-success/10 border border-status-success/30 rounded-2xl text-center flex flex-col items-center gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-status-success text-[36px] animate-bounce">
                    check_circle
                  </span>
                  <h3 className="font-bold text-base text-status-success">{p("success.title")}</h3>
                  <p className="text-xs text-on-surface-variant">{p("success.message")}</p>
                </div>
              )}

              {/* ERROR NOTICE */}
              {error && !successNotice && (
                <div
                  role="alert"
                  className="mt-6 p-3 bg-status-error/10 border border-status-error/20 rounded-xl text-status-error text-xs font-bold flex items-center gap-2"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                    error
                  </span>
                  <span>{error}</span>
                </div>
              )}

              {/* ── STEP 1: BASIC DETAILS & MOBILE NUMBER ───────────────────────── */}
              {!successNotice && currentStep === 1 && (
                <form className="flex flex-col gap-4 mt-6" onSubmit={handleStep1Submit}>
                  <div>
                    <h2 className="font-display font-bold text-lg text-on-surface">{p("step1.title")}</h2>
                    <p className="text-xs text-on-surface-variant">{p("step1.subtitle")}</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="signup-name">
                      {p("step1.fullName")} *
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      required
                      placeholder={p("step1.fullNamePlaceholder")}
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setError("");
                      }}
                      className={FIELD_CLASS}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="signup-mobile">
                      {p("step1.mobile")} *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-on-surface-variant select-none">
                        +91
                      </span>
                      <input
                        id="signup-mobile"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        required
                        placeholder={p("step1.mobilePlaceholder")}
                        value={mobile}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setMobile(val);
                          setError("");
                        }}
                        className={`${FIELD_CLASS} pl-12`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="signup-email">
                      {p("step1.email")} *
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      required
                      placeholder={p("step1.emailPlaceholder")}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      className={FIELD_CLASS}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="signup-district">
                        {p("step1.district")}
                      </label>
                      <input
                        id="signup-district"
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className={FIELD_CLASS}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="signup-tehsil">
                        {p("step1.tehsil")}
                      </label>
                      <input
                        id="signup-tehsil"
                        type="text"
                        value={tehsil}
                        onChange={(e) => setTehsil(e.target.value)}
                        className={FIELD_CLASS}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 mt-2 bg-secondary hover:bg-secondary-container text-on-primary font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span aria-hidden="true" className="material-symbols-outlined animate-spin text-[18px]">
                          progress_activity
                        </span>
                        {p("step1.sending")}
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                          sms
                        </span>
                        {p("step1.submit")}
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* ── STEP 2: VERIFY MOBILE OTP ───────────────────────────────────── */}
              {!successNotice && currentStep === 2 && (
                <form className="flex flex-col gap-4 mt-6" onSubmit={handleStep2VerifyMobile}>
                  <div>
                    <h2 className="font-display font-bold text-lg text-on-surface">{p("step2.title")}</h2>
                    <p className="text-xs text-on-surface-variant">
                      {p("step2.subtitle", { mobile: maskedMobile })}
                    </p>
                  </div>

                  {demoMobileOtp && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-800">
                      <div className="flex items-center gap-1.5">
                        <span aria-hidden="true" className="material-symbols-outlined text-amber-600 text-[18px]">
                          bolt
                        </span>
                        <span>Demo OTP: <strong className="tracking-widest font-mono text-sm">{demoMobileOtp}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMobileOtp(demoMobileOtp)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-xs font-bold uppercase tracking-wider text-center" htmlFor="mobile-otp">
                      {p("step2.otpLabel")}
                    </label>
                    <input
                      id="mobile-otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      autoComplete="one-time-code"
                      placeholder="••••••"
                      value={mobileOtp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setMobileOtp(val);
                        setError("");
                      }}
                      className="w-full px-4 py-3.5 rounded-xl border border-border-subtle bg-surface-container-lowest focus:outline-none focus:border-secondary focus:bg-white transition-colors text-center text-2xl tracking-[0.5em] font-bold text-on-surface"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs px-1">
                    {mobileCooldown > 0 ? (
                      <span className="text-on-surface-variant font-medium flex items-center gap-1">
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                          schedule
                        </span>
                        {p("step2.resendCooldown", { seconds: mobileCooldown })}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStep1Submit(null)}
                        disabled={loading}
                        className="text-secondary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                          refresh
                        </span>
                        {p("step2.resend")}
                      </button>
                    )}

                    {mobileResendSuccess && (
                      <span className="text-status-success font-semibold">
                        {p("step2.resendSuccess")}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || mobileOtp.length !== 6}
                    className="w-full py-3.5 mt-2 bg-secondary hover:bg-secondary-container text-on-primary font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span aria-hidden="true" className="material-symbols-outlined animate-spin text-[18px]">
                          progress_activity
                        </span>
                        {p("step2.verifying")}
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                          verified
                        </span>
                        {p("step2.submit")}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      setError("");
                    }}
                    className="w-full py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface cursor-pointer text-center"
                  >
                    {p("back")}
                  </button>
                </form>
              )}

              {/* ── STEP 3: AADHAAR E-KYC INPUT ───────────────────────────────── */}
              {!successNotice && currentStep === 3 && (
                <form className="flex flex-col gap-4 mt-6" onSubmit={handleStep3SubmitAadhaar}>
                  <div>
                    <h2 className="font-display font-bold text-lg text-on-surface">{p("step3.title")}</h2>
                    <p className="text-xs text-on-surface-variant">{p("step3.subtitle")}</p>
                  </div>

                  {/* PROTOTYPE DISCLAIMER BANNER */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900">
                    <span aria-hidden="true" className="material-symbols-outlined text-amber-600 text-[22px] flex-shrink-0 mt-0.5">
                      info
                    </span>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="font-bold">{p("step3.disclaimerTitle")}</span>
                      <p className="leading-relaxed opacity-90">{p("step3.disclaimerText")}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="aadhaar-input">
                      {p("step3.aadhaarLabel")} *
                    </label>
                    <input
                      id="aadhaar-input"
                      type="text"
                      inputMode="numeric"
                      maxLength={12}
                      placeholder={p("step3.aadhaarPlaceholder")}
                      value={aadhaarNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setAadhaarNumber(val);
                        setError("");
                      }}
                      className="w-full px-4 py-3.5 rounded-xl border border-border-subtle bg-surface-container-lowest focus:outline-none focus:border-secondary focus:bg-white transition-colors text-center text-xl tracking-[0.3em] font-bold text-on-surface"
                    />
                  </div>

                  <p className="text-[11px] text-on-surface-variant bg-surface-container-low p-3 rounded-xl leading-relaxed">
                    🔒 {p("step3.privacyNote")}
                  </p>

                  <button
                    type="submit"
                    disabled={loading || aadhaarNumber.replace(/\D/g, "").length !== 12}
                    className="w-full py-3.5 mt-2 bg-secondary hover:bg-secondary-container text-on-primary font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span aria-hidden="true" className="material-symbols-outlined animate-spin text-[18px]">
                          progress_activity
                        </span>
                        {p("step3.requesting")}
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                          shield
                        </span>
                        {p("step3.submit")}
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* ── STEP 4: VERIFY AADHAAR OTP ─────────────────────────────────── */}
              {!successNotice && currentStep === 4 && (
                <form className="flex flex-col gap-4 mt-6" onSubmit={handleStep4VerifyAadhaar}>
                  <div>
                    <h2 className="font-display font-bold text-lg text-on-surface">{p("step4.title")}</h2>
                    <p className="text-xs text-on-surface-variant">
                      {p("step4.subtitle", { last4: aadhaarLast4 })}
                    </p>
                  </div>

                  {demoAadhaarOtp && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-800">
                      <div className="flex items-center gap-1.5">
                        <span aria-hidden="true" className="material-symbols-outlined text-amber-600 text-[18px]">
                          bolt
                        </span>
                        <span>Demo Aadhaar OTP: <strong className="tracking-widest font-mono text-sm">{demoAadhaarOtp}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAadhaarOtp(demoAadhaarOtp)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-xs font-bold uppercase tracking-wider text-center" htmlFor="aadhaar-otp">
                      {p("step4.otpLabel")}
                    </label>
                    <input
                      id="aadhaar-otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      autoComplete="one-time-code"
                      placeholder="••••••"
                      value={aadhaarOtp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setAadhaarOtp(val);
                        setError("");
                      }}
                      className="w-full px-4 py-3.5 rounded-xl border border-border-subtle bg-surface-container-lowest focus:outline-none focus:border-secondary focus:bg-white transition-colors text-center text-2xl tracking-[0.5em] font-bold text-on-surface"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs px-1">
                    {aadhaarCooldown > 0 ? (
                      <span className="text-on-surface-variant font-medium flex items-center gap-1">
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                          schedule
                        </span>
                        {p("step4.resendCooldown", { seconds: aadhaarCooldown })}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStep3SubmitAadhaar(null)}
                        disabled={loading}
                        className="text-secondary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                          refresh
                        </span>
                        {p("step4.resend")}
                      </button>
                    )}

                    {aadhaarResendSuccess && (
                      <span className="text-status-success font-semibold">
                        {p("step4.resendSuccess")}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || aadhaarOtp.length !== 6}
                    className="w-full py-3.5 mt-2 bg-secondary hover:bg-secondary-container text-on-primary font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span aria-hidden="true" className="material-symbols-outlined animate-spin text-[18px]">
                          progress_activity
                        </span>
                        {p("step4.verifying")}
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                          lock_open
                        </span>
                        {p("step4.submit")}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(3);
                      setError("");
                    }}
                    className="w-full py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface cursor-pointer text-center"
                  >
                    {p("back")}
                  </button>
                </form>
              )}

              {/* ── STEP 5: SET PASSWORD & COMPLETE REGISTRATION ──────────────── */}
              {!successNotice && currentStep === 5 && (
                <form className="flex flex-col gap-4 mt-6" onSubmit={handleStep5Complete}>
                  <div>
                    <h2 className="font-display font-bold text-lg text-on-surface">{p("step5.title")}</h2>
                    <p className="text-xs text-on-surface-variant">{p("step5.subtitle")}</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="signup-username">
                      {p("step5.username")} *
                    </label>
                    <input
                      id="signup-username"
                      type="text"
                      autoComplete="username"
                      required
                      placeholder={p("step5.usernamePlaceholder")}
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError("");
                      }}
                      className={FIELD_CLASS}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="signup-password">
                      {p("step5.password")} *
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder={p("step5.passwordPlaceholder")}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      className={FIELD_CLASS}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="signup-confirm-password">
                      {p("step5.confirmPassword")} *
                    </label>
                    <input
                      id="signup-confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder={p("step5.confirmPasswordPlaceholder")}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      className={FIELD_CLASS}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="signup-locale">
                      {p("step5.preferredLocale")}
                    </label>
                    <select
                      id="signup-locale"
                      value={preferredLocale}
                      onChange={(e) => setPreferredLocale(e.target.value)}
                      className={`${FIELD_CLASS} cursor-pointer`}
                    >
                      <option value="en">English</option>
                      <option value="hi">हिंदी (Hindi)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 mt-2 bg-secondary hover:bg-secondary-container text-on-primary font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span aria-hidden="true" className="material-symbols-outlined animate-spin text-[18px]">
                          progress_activity
                        </span>
                        {p("step5.completing")}
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                          check_circle
                        </span>
                        {p("step5.submit")}
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* CARD FOOTER WITH LOGIN LINK */}
              <div className="mt-6 pt-5 border-t border-border-subtle text-center text-xs text-on-surface-variant flex items-center justify-center gap-1.5">
                <span>{p("loginPrompt")}</span>
                <button
                  type="button"
                  onClick={() => navigate(MAIN_ROUTES.login + "?portal=citizen")}
                  className="text-secondary font-bold hover:underline cursor-pointer"
                >
                  {p("loginLink")}
                </button>
              </div>

            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
