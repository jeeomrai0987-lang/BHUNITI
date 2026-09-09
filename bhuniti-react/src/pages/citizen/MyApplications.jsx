import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useI18n } from "../../i18n";
import { logFallback } from "../../utils/log";

/*
 * Offline fixture. Dates are ISO so formatDate() can render them in the active
 * locale; a stage with no date is described by its `status` instead. Status and
 * type values stay as the exact English strings the database stores, and are put
 * through label() at render time.
 */
const FALLBACK_APPLICATION = {
  id: "app-8941",
  application_number: "MUT-2023-8941",
  citizen_name: "Priya Sharma",
  service_type: "Title Transfer",
  status: "Action Required",
  current_stage: "Field Survey",
  submission_date: "2023-10-24",
  verified_date: "2023-10-28",
  survey_date: "2023-11-15",
  action_required: true,
  stages: [
    { name: "Submitted", date: "2023-10-24", status: "completed", icon: "check" },
    { name: "Verified", date: "2023-10-28", status: "completed", icon: "check" },
    { name: "Field Survey", date: null, status: "in_progress", icon: "location_searching" },
    { name: "RO Review", date: null, status: "pending", icon: "person_search" },
    { name: "Approved", date: null, status: "pending", icon: "task_alt" },
  ],
};

export default function MyApplications() {
  const { t, label, formatDate } = useI18n();
  const [app, setApp] = useState(FALLBACK_APPLICATION);
  const [offline, setOffline] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const apps = await api.applications.getMy();
        if (apps && apps.length > 0) {
          setApp(apps[0]);
          setOffline(false);
        }
      } catch (err) {
        logFallback("citizen applications", err);
        setOffline(true);
      }
    }
    loadData();
  }, []);

  async function handleConfirmAvailability() {
    setLoading(true);
    try {
      await api.applications.confirmAvailability(app.application_number || app.id);
      setConfirmed(true);
      setApp((prev) => ({ ...prev, action_required: null, status: "In Progress" }));
    } catch (err) {
      logFallback("confirming survey availability", err);
      setConfirmed(true);
    } finally {
      setLoading(false);
    }
  }

  /* A stage shows its date once it has one, and its state until then. */
  const stageDetail = (stage) =>
    stage.date
      ? formatDate(stage.date, { day: "numeric", month: "short" })
      : label("stage_state", stage.status, stage.status_label);

  return (
    <main className="w-full pt-16 bg-surface min-h-screen">
      <div className="flex flex-col w-full relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/5 via-transparent to-transparent blur-3xl rounded-full pointer-events-none transform translate-x-1/4 -translate-y-1/4 z-0"></div>

        <div className="w-full px-margin-mobile lg:px-margin-desktop py-8 md:py-12 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-surface-container-low shadow-sm">
          <div className="flex flex-col max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 bg-primary text-on-primary rounded font-label-md uppercase tracking-wider text-[10px]">
                {label("service_type", app.service_type, app.service_type_label)}
              </span>
              <span className="text-body-sm font-tabular-nums text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>{" "}
                {formatDate(app.submission_date)}
              </span>
              {offline && (
                <span className="px-2 py-1 rounded bg-surface-container-high text-on-surface-variant text-[10px] uppercase tracking-wider">
                  {t("common.state.offlineShort")}
                </span>
              )}
            </div>
            <h1 className="text-display font-display text-on-surface mb-2">
              {t("pages.myApplications.title")}
            </h1>
            <p className="text-headline-md font-tabular-nums text-on-surface-variant">
              {t("pages.myApplications.idLabel", { id: app.application_number })}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-surface rounded-xl p-4 shadow-sm w-full md:w-auto">
            <img
              alt={t("pages.myApplications.applicant")}
              className="w-12 h-12 rounded-full object-cover shadow-sm"
              src="/src/assets/logo.jpeg"
            />
            <div>
              <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-0.5">
                {t("pages.myApplications.applicant")}
              </p>
              <p className="text-body-lg font-body-lg text-on-surface font-semibold">
                {app.citizen_name}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop py-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-gutter">
            {app.action_required && !confirmed && (
              <div className="bg-error-container text-on-error-container rounded-xl p-6 shadow-sm flex items-start gap-4 transition-all">
                <span
                  className="material-symbols-outlined text-[28px] text-error flex-shrink-0"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  warning
                </span>
                <div>
                  <h3 className="text-headline-md font-headline-md mb-2">
                    {t("pages.myApplications.actionRequired.heading")}
                  </h3>
                  <p className="text-body-lg font-body-lg">
                    {typeof app.action_required === "string"
                      ? app.action_required
                      : t("pages.myApplications.actionRequired.surveyScheduled", {
                          date: formatDate(app.survey_date),
                        })}
                  </p>
                  <button
                    onClick={handleConfirmAvailability}
                    disabled={loading}
                    className="mt-4 px-4 py-2 bg-error text-on-error rounded-lg font-label-md uppercase tracking-wide hover:opacity-90 transition-opacity shadow-sm"
                  >
                    {loading
                      ? t("pages.myApplications.actionRequired.recording")
                      : t("pages.myApplications.actionRequired.confirmAvailability")}
                  </button>
                </div>
              </div>
            )}

            {confirmed && (
              <div className="bg-primary-container text-on-primary-container rounded-xl p-4 shadow-sm flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                <p className="font-body-md font-medium">
                  {t("pages.myApplications.actionRequired.confirmed")}
                </p>
              </div>
            )}

            <div className="bg-surface-container rounded-xl p-8 shadow-md">
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-8 border-b border-outline-variant/30 pb-4">
                {t("pages.myApplications.progress.heading")}
              </h2>
              <div className="relative pl-6 lg:pl-0">
                <div className="flex flex-col lg:flex-row justify-between relative z-10 gap-8 lg:gap-4">
                  {(app.stages || []).map((stage, idx) => {
                    const isCompleted = stage.status === "completed";
                    const isInProgress = stage.status === "in_progress";
                    return (
                      <div
                        key={idx}
                        className={`flex lg:flex-col items-start lg:items-center gap-4 lg:w-1/5 relative ${!isCompleted && !isInProgress ? "opacity-50" : ""}`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md z-10 ${isCompleted ? "bg-primary text-on-primary" : isInProgress ? "bg-surface border-2 border-primary" : "bg-surface-container-highest text-on-surface-variant"}`}
                        >
                          {isInProgress ? (
                            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                          ) : (
                            <span className="material-symbols-outlined text-[20px]">
                              {stage.icon || "check"}
                            </span>
                          )}
                        </div>
                        <div className="lg:text-center mt-1 lg:mt-0">
                          <p
                            className={`text-label-md font-label-md uppercase tracking-wider mb-1 ${isCompleted || isInProgress ? "text-primary font-semibold" : "text-on-surface-variant"}`}
                          >
                            {label("stage", stage.name, stage.name_label)}
                          </p>
                          <p className="text-body-sm font-tabular-nums text-on-surface-variant">
                            {stageDetail(stage)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Document Evidence */}
            <div className="bg-surface-container rounded-xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="font-headline-md text-on-surface font-semibold">
                {t("pages.myApplications.evidence.heading")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container-lowest rounded-xl flex items-center gap-3 border border-border-subtle">
                  <span className="material-symbols-outlined text-primary text-[28px]">
                    description
                  </span>
                  <div className="flex-1">
                    <p className="font-body-md font-semibold text-on-surface">
                      {t("pages.myApplications.evidence.saleDeed")}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      {t("pages.myApplications.evidence.saleDeedMeta", {
                        number: "GR-2023-994",
                        status: label("verification_status", "Verified"),
                      })}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl flex items-center gap-3 border border-border-subtle">
                  <span className="material-symbols-outlined text-primary text-[28px]">map</span>
                  <div className="flex-1">
                    <p className="font-body-md font-semibold text-on-surface">
                      {t("pages.myApplications.evidence.boundaryMap")}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      {t("common.fields.ulpin")} 09-XXXX-XXXX-1024
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container rounded-xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="font-headline-md text-on-surface font-semibold">
                {t("pages.myApplications.office.heading")}
              </h3>
              <dl className="flex flex-col gap-2 font-body-md text-on-surface-variant">
                <div className="flex gap-2">
                  <dt className="font-semibold">{t("common.fields.district")}:</dt>
                  <dd>{t("common.place.district")}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold">{t("common.fields.tehsil")}:</dt>
                  <dd>{t("common.place.tehsil")}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold">{t("pages.myApplications.office.officer")}:</dt>
                  <dd>{t("pages.myApplications.office.officerValue")}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold">{t("pages.myApplications.office.contact")}:</dt>
                  <dd className="font-tabular-nums">+91 98222 33445</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
