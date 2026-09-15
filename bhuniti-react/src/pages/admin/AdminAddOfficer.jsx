/*
 * District Officer / Admin page to provision new Revenue Officer accounts.
 *
 * Features:
 *  - Auto-generated secure temporary password dispatched to the officer's email.
 *  - Salted SHA-256 hashing for government ID references (zero raw ID stored).
 *  - Account created with force_password_change=True.
 *  - Follows BHUNITI admin portal tokens and theme.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "../../routes";
import { api } from "../../services/api";
import InterpolatedText from "../../components/InterpolatedText";
import { useI18n } from "../../i18n";

const FIELD_CLASS =
  "w-full px-4 py-3 rounded-xl border border-border-subtle bg-surface-container-lowest focus:outline-none focus:border-secondary focus:bg-white transition-colors font-body-md text-sm text-on-surface";

export default function AdminAddOfficer() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const p = (key, vars) => t(`pages.adminAddOfficer.${key}`, vars);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("Revenue Officer");
  const [district, setDistrict] = useState("Ghaziabad");
  const [tehsil, setTehsil] = useState("Modinagar");
  const [govIdType, setGovIdType] = useState("Employee ID");
  const [govIdNumber, setGovIdNumber] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const cleanFullName = fullName.trim();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, "");
    const cleanGovId = govIdNumber.trim();

    if (!cleanFullName || !cleanUsername || !cleanEmail || !cleanPhone || !cleanGovId) {
      setError(p("errors.incomplete"));
      return;
    }

    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError(p("errors.emailInvalid"));
      return;
    }

    if (cleanPhone.length !== 10) {
      setError(p("errors.phoneInvalid"));
      return;
    }

    setLoading(true);
    try {
      const res = await api.admin.createOfficer({
        username: cleanUsername,
        email: cleanEmail,
        full_name: cleanFullName,
        phone: cleanPhone,
        designation: designation.trim(),
        district: district.trim(),
        tehsil: tehsil.trim(),
        gov_id_type: govIdType.trim(),
        gov_id_number: cleanGovId,
      });
      setSuccessData(res);
    } catch (err) {
      setError(err.message || "Failed to create officer account.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFullName("");
    setUsername("");
    setEmail("");
    setPhone("");
    setGovIdNumber("");
    setSuccessData(null);
    setError("");
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 font-body-md text-on-surface">

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
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

          <p className="text-xs md:text-sm text-on-surface-variant mt-1 max-w-2xl">
            {p("subheading")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(ADMIN_ROUTES.overview)}
          className="px-4 py-2.5 bg-surface-container hover:bg-surface-container-high border border-border-subtle rounded-xl text-xs font-bold text-on-surface flex items-center gap-2 cursor-pointer transition-colors w-fit"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Back to Overview
        </button>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div
          role="alert"
          className="p-4 bg-status-error/10 border border-status-error/20 rounded-2xl text-status-error text-xs font-bold flex items-center gap-3"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
            error
          </span>
          <span>{error}</span>
        </div>
      )}

      {/* FORM CARD */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border-subtle">
        <form className="space-y-8" onSubmit={handleSubmit}>

          {/* SECTION 1: PERSONAL & CONTACT */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border-subtle">
              <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[22px]">
                badge
              </span>
              <h2 className="font-display font-bold text-base text-on-surface">
                {p("form.sectionPersonal")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="officer-name">
                  {p("form.fullName")} *
                </label>
                <input
                  id="officer-name"
                  type="text"
                  required
                  placeholder={p("form.fullNamePlaceholder")}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (!username && e.target.value) {
                      const autoUser = "ro_" + e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 12);
                      setUsername(autoUser);
                    }
                  }}
                  className={FIELD_CLASS}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="officer-username">
                  {p("form.username")} *
                </label>
                <input
                  id="officer-username"
                  type="text"
                  required
                  placeholder={p("form.usernamePlaceholder")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="officer-email">
                  {p("form.email")} *
                </label>
                <input
                  id="officer-email"
                  type="email"
                  required
                  placeholder={p("form.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="officer-phone">
                  {p("form.phone")} *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-on-surface-variant select-none">
                    +91
                  </span>
                  <input
                    id="officer-phone"
                    type="tel"
                    maxLength={10}
                    required
                    placeholder={p("form.phonePlaceholder")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className={`${FIELD_CLASS} pl-12`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: JURISDICTION & POSTING */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border-subtle">
              <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[22px]">
                location_on
              </span>
              <h2 className="font-display font-bold text-base text-on-surface">
                {p("form.sectionPosting")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="officer-designation">
                  {p("form.designation")}
                </label>
                <input
                  id="officer-designation"
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="officer-district">
                  {p("form.district")}
                </label>
                <input
                  id="officer-district"
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="officer-tehsil">
                  {p("form.tehsil")}
                </label>
                <select
                  id="officer-tehsil"
                  value={tehsil}
                  onChange={(e) => setTehsil(e.target.value)}
                  className={`${FIELD_CLASS} cursor-pointer`}
                >
                  <option value="Modinagar">Modinagar</option>
                  <option value="Ghaziabad">Ghaziabad (Sadar)</option>
                  <option value="Loni">Loni</option>
                  <option value="Muradnagar">Muradnagar</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: GOVERNMENT ID VERIFICATION */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border-subtle">
              <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[22px]">
                security
              </span>
              <h2 className="font-display font-bold text-base text-on-surface">
                {p("form.sectionGovId")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="officer-govid-type">
                  {p("form.govIdType")} *
                </label>
                <select
                  id="officer-govid-type"
                  value={govIdType}
                  onChange={(e) => setGovIdType(e.target.value)}
                  className={`${FIELD_CLASS} cursor-pointer`}
                >
                  <option value="Employee ID">Official Employee ID</option>
                  <option value="Aadhaar">Aadhaar Card Reference</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Service Badge">Revenue Service Badge</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-caps text-xs font-bold uppercase tracking-wider" htmlFor="officer-govid-number">
                  {p("form.govIdNumber")} *
                </label>
                <input
                  id="officer-govid-number"
                  type="text"
                  required
                  placeholder={p("form.govIdPlaceholder")}
                  value={govIdNumber}
                  onChange={(e) => setGovIdNumber(e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>
            </div>

            <p className="text-[11px] text-on-surface-variant bg-surface-container-low p-3 rounded-xl mt-3">
              🔒 {p("form.govIdPrivacyNote")}
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 border-t border-border-subtle flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-secondary hover:bg-secondary-container text-on-primary font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span aria-hidden="true" className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  {p("form.submitting")}
                </>
              ) : (
                <>
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                    person_add
                  </span>
                  {p("form.submit")}
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* SUCCESS MODAL */}
      {successData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm cursor-pointer"
            onClick={handleReset}
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-border-subtle overflow-hidden animate-scaleUp text-on-surface p-8"
          >
            <div className="flex items-center gap-4 pb-4 border-b border-border-subtle">
              <div className="w-12 h-12 rounded-2xl bg-status-success/10 text-status-success flex items-center justify-center flex-shrink-0">
                <span aria-hidden="true" className="material-symbols-outlined text-[32px]">
                  check_circle
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-on-surface">{p("modal.title")}</h3>
                <p className="text-xs text-on-surface-variant">{p("modal.subtitle")}</p>
              </div>
            </div>

            <div className="my-6 bg-surface-container-lowest p-4 rounded-2xl border border-border-subtle space-y-2 text-xs">
              <h4 className="font-bold text-on-surface uppercase tracking-wider text-[10px] text-secondary">
                {p("modal.officerDetails")}
              </h4>
              <div className="flex justify-between py-1 border-b border-border-subtle/50">
                <span className="text-on-surface-variant">{p("modal.name")}:</span>
                <span className="font-bold text-on-surface">{successData.full_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle/50">
                <span className="text-on-surface-variant">{p("modal.username")}:</span>
                <span className="font-mono font-bold text-secondary">{successData.username}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle/50">
                <span className="text-on-surface-variant">{p("modal.email")}:</span>
                <span className="font-bold text-on-surface">{successData.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle/50">
                <span className="text-on-surface-variant">{p("modal.jurisdiction")}:</span>
                <span className="font-bold text-on-surface">{successData.tehsil}, {successData.district}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-on-surface-variant">{p("modal.govId")}:</span>
                <span className="font-bold text-on-surface">{successData.gov_id_type} (****{successData.gov_id_last4})</span>
              </div>
            </div>

            <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-xl text-xs text-secondary-dark flex items-start gap-2 mb-6">
              <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[18px] flex-shrink-0 mt-0.5">
                mark_email_read
              </span>
              <p className="leading-relaxed">{p("modal.notice")}</p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                {p("modal.addAnother")}
              </button>

              <button
                type="button"
                onClick={() => navigate(ADMIN_ROUTES.overview)}
                className="px-6 py-2.5 bg-secondary hover:bg-secondary-container text-on-primary font-bold text-xs rounded-xl transition-colors shadow-md cursor-pointer"
              >
                {p("modal.done")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
