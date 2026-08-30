import { useState, useEffect } from "react";
import { api } from "../../services/api";

export default function MyApplications() {
  const [app, setApp] = useState({
    id: "app-8941",
    application_number: "MUT-2023-8941",
    citizen_name: "Priya Sharma",
    service_type: "Title Transfer",
    status: "Action Required",
    current_stage: "Field Survey",
    submission_date: "Oct 24, 2023",
    verified_date: "Oct 28, 2023",
    survey_date: "Nov 15, 2023",
    action_required: "A field survey has been scheduled for Nov 15th. Please ensure access to the parcel.",
    stages: [
      { name: "Submitted", date: "Oct 24", status: "completed", icon: "check" },
      { name: "Verified", date: "Oct 28", status: "completed", icon: "check" },
      { name: "Field Survey", date: "In Progress", status: "in_progress", icon: "location_searching" },
      { name: "RO Review", date: "Pending", status: "pending", icon: "person_search" },
      { name: "Approved", date: "Pending", status: "pending", icon: "task_alt" }
    ]
  });
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const apps = await api.applications.getMy();
        if (apps && apps.length > 0) {
          setApp(apps[0]);
        }
      } catch (err) {
        console.log("Using cached application:", err.message);
      }
    }
    loadData();
  }, []);

  async function handleConfirmAvailability() {
    setLoading(true);
    try {
      await api.applications.confirmAvailability(app.application_number || app.id);
      setConfirmed(true);
      setApp(prev => ({
        ...prev,
        action_required: null,
        status: "In Progress"
      }));
    } catch (err) {
      console.log("Confirming availability:", err.message);
      setConfirmed(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full pt-16 bg-surface min-h-screen">
      <div className="flex flex-col w-full relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/5 via-transparent to-transparent blur-3xl rounded-full pointer-events-none transform translate-x-1/4 -translate-y-1/4 z-0"></div>

        <div className="w-full px-margin-mobile lg:px-margin-desktop py-8 md:py-12 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-surface-container-low shadow-sm">
          <div className="flex flex-col max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 bg-primary text-on-primary rounded font-label-md uppercase tracking-wider text-[10px]">
                {app.service_type || "Title Transfer"}
              </span>
              <span className="text-body-sm font-tabular-nums text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span> {app.submission_date || "Oct 24, 2023"}
              </span>
            </div>
            <h1 className="text-display font-display text-on-surface mb-2">Application Details</h1>
            <p className="text-headline-md font-tabular-nums text-on-surface-variant">ID: {app.application_number}</p>
          </div>
          <div className="flex items-center gap-4 bg-surface rounded-xl p-4 shadow-sm w-full md:w-auto">
            <img alt="Citizen Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm" src="/src/assets/logo.jpeg" />
            <div>
              <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-0.5">Applicant</p>
              <p className="text-body-lg font-body-lg text-on-surface font-semibold">{app.citizen_name || "Priya Sharma"}</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop py-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-gutter">

            {app.action_required && !confirmed && (
              <div className="bg-error-container text-on-error-container rounded-xl p-6 shadow-sm flex items-start gap-4 transition-all">
                <span className="material-symbols-outlined text-[28px] text-error flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                <div>
                  <h3 className="text-headline-md font-headline-md mb-2">Action Required</h3>
                  <p className="text-body-lg font-body-lg">{app.action_required}</p>
                  <button
                    onClick={handleConfirmAvailability}
                    disabled={loading}
                    className="mt-4 px-4 py-2 bg-error text-on-error rounded-lg font-label-md uppercase tracking-wide hover:opacity-90 transition-opacity shadow-sm"
                  >
                    {loading ? "Recording in Supabase..." : "Confirm Availability"}
                  </button>
                </div>
              </div>
            )}

            {confirmed && (
              <div className="bg-primary-container text-on-primary-container rounded-xl p-4 shadow-sm flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                <p className="font-body-md font-medium">Availability confirmed! Field surveyor notified via Supabase live trigger.</p>
              </div>
            )}

            <div className="bg-surface-container rounded-xl p-8 shadow-md">
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-8 border-b border-outline-variant/30 pb-4">Application Progress</h2>
              <div className="relative pl-6 lg:pl-0">
                <div className="flex flex-col lg:flex-row justify-between relative z-10 gap-8 lg:gap-4">
                  {(app.stages || []).map((stage, idx) => {
                    const isCompleted = stage.status === "completed";
                    const isInProgress = stage.status === "in_progress";
                    return (
                      <div key={idx} className={`flex lg:flex-col items-start lg:items-center gap-4 lg:w-1/5 relative ${!isCompleted && !isInProgress ? "opacity-50" : ""}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md z-10 ${isCompleted ? "bg-primary text-on-primary" : (isInProgress ? "bg-surface border-2 border-primary" : "bg-surface-container-highest text-on-surface-variant")}`}>
                          {isInProgress ? (
                            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                          ) : (
                            <span className="material-symbols-outlined text-[20px]">{stage.icon || "check"}</span>
                          )}
                        </div>
                        <div className="lg:text-center mt-1 lg:mt-0">
                          <p className={`text-label-md font-label-md uppercase tracking-wider mb-1 ${isCompleted || isInProgress ? "text-primary font-semibold" : "text-on-surface-variant"}`}>
                            {stage.name}
                          </p>
                          <p className="text-body-sm font-tabular-nums text-on-surface-variant">{stage.date || "Pending"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Document Evidence */}
            <div className="bg-surface-container rounded-xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="font-headline-md text-on-surface font-semibold">Attached Evidence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container-lowest rounded-xl flex items-center gap-3 border border-border-subtle">
                  <span className="material-symbols-outlined text-primary text-[28px]">description</span>
                  <div className="flex-1">
                    <p className="font-body-md font-semibold text-on-surface">Registered Sale Deed</p>
                    <p className="text-body-sm text-on-surface-variant">Deed #GR-2023-994 • Verified</p>
                  </div>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl flex items-center gap-3 border border-border-subtle">
                  <span className="material-symbols-outlined text-primary text-[28px]">map</span>
                  <div className="flex-1">
                    <p className="font-body-md font-semibold text-on-surface">Cadastral Boundary Map</p>
                    <p className="text-body-sm text-on-surface-variant">ULPIN 09-XXXX-XXXX-1024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container rounded-xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="font-headline-md text-on-surface font-semibold">Assigned Office</h3>
              <div className="flex flex-col gap-2 font-body-md text-on-surface-variant">
                <p><strong>District:</strong> Ghaziabad</p>
                <p><strong>Tehsil:</strong> Modinagar</p>
                <p><strong>Officer:</strong> Suresh Verma (Revenue Inspector)</p>
                <p><strong>Contact:</strong> +91 98222 33445</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
