import { useState } from "react";

const DISCREPANCY_CASES = [
  {
    id: "D-1024",
    parcel_id: "P-1024",
    issue_type: "Area Mismatch (>5%)",
    category: "area",
    severity: "High",
    status: "Under Review",
    status_icon: "sync",
    gis_area: "1,245.50",
    ror_area: "1,180.00",
    variance: "65.50 sq.m (5.5%)",
    tolerance: "2.0%",
    variance_note: "Variance of 65.50 sq.m (5.5%) exceeds allowable tolerance of 2.0%. Investigation required to determine if discrepancy is due to digitizing error or physical encroachment.",
    reported_date: "Aug 28, 2026",
    step: 2,
    lat: "28.8350",
    lng: "77.5825",
    village: "Sikandrabad",
    tehsil: "Modinagar",
    documents: [
      { name: "Original_RoR_Scan_1998.pdf", meta: "Uploaded 2 days ago • 1.2 MB", type: "pdf" },
      { name: "Field_Sketch_Map.jpg", meta: "System Gen • 345 KB", type: "img" }
    ]
  },
  {
    id: "D-1025",
    parcel_id: "P-2281",
    issue_type: "Boundary Overlap",
    category: "boundary",
    severity: "Medium",
    status: "Pending Evidence",
    status_icon: "assignment_late",
    gis_area: "2,410.00",
    ror_area: "2,380.00",
    variance: "30.00 sq.m (1.2%)",
    tolerance: "2.0%",
    variance_note: "Boundary conflict of 1.4m overlap along Western edge with survey number 142/C. Surveyor ground inspection recommended.",
    reported_date: "Aug 27, 2026",
    step: 1,
    lat: "28.8372",
    lng: "77.5825",
    village: "Sikandrabad",
    tehsil: "Modinagar",
    documents: [
      { name: "Boundary_DGPS_Survey.pdf", meta: "Uploaded 3 days ago • 2.4 MB", type: "pdf" }
    ]
  },
  {
    id: "D-1026",
    parcel_id: "P-0933",
    issue_type: "Ownership Dispute",
    category: "ownership",
    severity: "High",
    status: "Legal Hold",
    status_icon: "gavel",
    gis_area: "14,680.00",
    ror_area: "12,500.00",
    variance: "2,180.00 sq.m (17.4%)",
    tolerance: "2.0%",
    variance_note: "Claimed transfer in Mutation M-2026-018 diverges significantly from revenue registry records. Injunction registered on Sub-Registrar portal.",
    reported_date: "Aug 26, 2026",
    step: 2,
    lat: "28.8327",
    lng: "77.5837",
    village: "Sikandrabad",
    tehsil: "Modinagar",
    documents: [
      { name: "Sub_Registrar_Injunction_Order.pdf", meta: "Uploaded yesterday • 890 KB", type: "pdf" },
      { name: "Khatauni_Copy_2026.pdf", meta: "Uploaded 4 days ago • 1.1 MB", type: "pdf" }
    ]
  },
  {
    id: "D-1027",
    parcel_id: "P-5542",
    issue_type: "Missing Survey Point",
    category: "boundary",
    severity: "Low",
    status: "Assigned Surveyor",
    status_icon: "person_search",
    gis_area: "3,200.00",
    ror_area: "3,200.00",
    variance: "0.00 sq.m (0.0%)",
    tolerance: "2.0%",
    variance_note: "Benchmark stone #BM-44 removed during highway widening. Resection required using CORS network station.",
    reported_date: "Aug 25, 2026",
    step: 1,
    lat: "28.8350",
    lng: "77.5880",
    village: "Sikandrabad",
    tehsil: "Modinagar",
    documents: [
      { name: "CORS_Reference_Log.csv", meta: "Uploaded 5 days ago • 120 KB", type: "pdf" }
    ]
  }
];

export default function DiscrepancyCases() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCase, setSelectedCase] = useState(DISCREPANCY_CASES[0]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [newCaseModalOpen, setNewCaseModalOpen] = useState(false);
  const [newCaseData, setNewCaseData] = useState({ ulpin: "", type: "Area Mismatch (>5%)", description: "" });
  const [noteText, setNoteText] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  }

  const filteredCases = DISCREPANCY_CASES.filter((c) => {
    if (activeTab === "all") return true;
    if (activeTab === "high") return c.severity.toLowerCase() === "high";
    if (activeTab === "area") return c.category === "area";
    if (activeTab === "boundary") return c.category === "boundary";
    if (activeTab === "ownership") return c.category === "ownership";
    return true;
  });

  function handleCreateCase(e) {
    e.preventDefault();
    if (!newCaseData.ulpin) return;
    showToast(`Discrepancy case created for ${newCaseData.ulpin}. Ref ID: D-${Math.floor(1000 + Math.random() * 9000)}`);
    setNewCaseModalOpen(false);
    setNewCaseData({ ulpin: "", type: "Area Mismatch (>5%)", description: "" });
  }

  return (
    <main className="relative pt-16 min-h-screen bg-background flex flex-col">
      {/* Breadcrumb Header */}
      <div className="px-4 sm:px-8 py-3.5 flex items-center justify-between text-label-md text-on-surface-variant border-b border-outline-variant/20 bg-surface text-xs">
        <div className="flex items-center gap-2">
          <a className="hover:text-primary transition-colors" href="/revenue-officer">Revenue Officer</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">Discrepancy Cases</span>
        </div>
        <span className="hidden sm:flex items-center gap-1.5 text-error font-bold bg-error-container/30 px-2.5 py-1 rounded-full text-[11px]">
          <span className="w-2 h-2 rounded-full bg-error animate-pulse" /> 14 Action Required
        </span>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col w-full relative overflow-hidden bg-background">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-error-container/20 blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-fixed/20 blur-[150px]" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="40" id="grid-pattern" patternunits="userSpaceOnUse" width="40">
                <path className="text-on-background" d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect fill="url(#grid-pattern)" height="100%" width="100%" />
          </svg>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex flex-col lg:flex-row w-full relative z-10 overflow-hidden">
          {/* Left Table / List Panel */}
          <div className="flex-1 flex flex-col h-full bg-surface/60 backdrop-blur-md relative shadow-[4px_0_24px_rgba(11,28,48,0.03)] z-20 overflow-y-auto">
            {/* Top Toolbar */}
            <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 flex flex-col gap-5 sticky top-0 bg-surface/95 backdrop-blur-xl z-30 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-b border-outline-variant/20">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface mb-1 flex items-center gap-3">
                    Discrepancy Cases
                    <span className="inline-flex items-center justify-center bg-error/10 text-error rounded-full px-3 py-0.5 font-label-md text-xs font-bold">
                      14 Action Required
                    </span>
                  </h1>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                    Manage and resolve geometric, topological, and ownership conflicts identified during GIS-Record reconciliation.
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest transition-colors rounded-xl font-label-md text-xs font-bold text-on-surface border border-outline-variant/30 cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCaseModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-primary text-on-primary hover:bg-primary/90 transition-colors rounded-xl font-label-md text-xs font-bold shadow-md shadow-primary/20 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span> New Case
                  </button>
                </div>
              </div>

              {/* Tabs with Smooth Underline */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar border-b-2 border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`relative px-4 py-2 font-label-md text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === "all" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  All Cases
                  {activeTab === "all" && (
                    <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-primary rounded-t-full" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("high")}
                  className={`relative px-4 py-2 font-label-md text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "high" ? "text-error font-extrabold" : "text-error/80 hover:text-error"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                  High Priority
                  {activeTab === "high" && (
                    <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-error rounded-t-full" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("area")}
                  className={`relative px-4 py-2 font-label-md text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === "area" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Area Conflicts
                  {activeTab === "area" && (
                    <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-primary rounded-t-full" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("boundary")}
                  className={`relative px-4 py-2 font-label-md text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === "boundary" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Boundary Overlaps
                  {activeTab === "boundary" && (
                    <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-primary rounded-t-full" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ownership")}
                  className={`relative px-4 py-2 font-label-md text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === "ownership" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Ownership Disputes
                  {activeTab === "ownership" && (
                    <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-primary rounded-t-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Case List in Interactive Hover Mode */}
            <div className="flex-1 px-4 sm:px-8 py-6 space-y-2.5">
              {/* Header Row */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 bg-surface-container-low rounded-xl font-label-md text-[11px] font-bold text-on-surface-variant uppercase tracking-wider shadow-sm border border-outline-variant/20">
                <div className="col-span-2">Case ID</div>
                <div className="col-span-2">Parcel</div>
                <div className="col-span-3">Issue Type</div>
                <div className="col-span-2">Severity</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              {/* Data Rows with Smooth Hover Mode */}
              {filteredCases.map((item) => {
                const isSelected = selectedCase?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCase(item)}
                    className={`
                      group grid grid-cols-12 gap-2 sm:gap-4 px-4 py-3.5 rounded-xl items-center cursor-pointer transition-all duration-200 relative overflow-hidden border
                      ${
                        isSelected
                          ? "bg-primary-fixed/30 border-primary/50 shadow-md shadow-primary/5"
                          : "bg-surface hover:bg-surface-container-low hover:border-primary/40 hover:shadow-md border-outline-variant/30"
                      }
                    `}
                  >
                    {/* Left Accent Bar on Hover / Active */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-200 ${
                        isSelected
                          ? "bg-primary opacity-100"
                          : "bg-primary opacity-0 group-hover:opacity-100"
                      }`}
                    />

                    {/* Case ID */}
                    <div className="col-span-6 md:col-span-2 font-tabular-nums text-xs font-bold text-on-surface flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-[18px] text-error"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        warning
                      </span>
                      <span className="group-hover:text-primary transition-colors">{item.id}</span>
                    </div>

                    {/* Parcel ID */}
                    <div className="col-span-6 md:col-span-2 font-tabular-nums text-xs font-semibold text-on-surface-variant group-hover:text-primary transition-colors text-right md:text-left">
                      {item.parcel_id}
                    </div>

                    {/* Issue Type */}
                    <div className="col-span-12 md:col-span-3 font-body-sm text-xs text-on-surface flex items-center gap-2 font-medium mt-1 md:mt-0">
                      <span
                        className={`w-2 h-2 rounded-full border ${
                          item.severity === "High"
                            ? "bg-error-container border-error"
                            : item.severity === "Medium"
                            ? "bg-tertiary-fixed border-tertiary-fixed-dim"
                            : "bg-surface-variant border-outline"
                        }`}
                      />
                      <span className="truncate">{item.issue_type}</span>
                    </div>

                    {/* Severity Badge */}
                    <div className="col-span-4 md:col-span-2 mt-1 md:mt-0">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded font-label-md text-[10px] font-bold uppercase tracking-wider ${
                          item.severity === "High"
                            ? "bg-error/10 text-error border border-error/20"
                            : item.severity === "Medium"
                            ? "bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant border border-on-tertiary-fixed-variant/20"
                            : "bg-surface-variant text-on-surface-variant border border-outline-variant/30"
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="col-span-6 md:col-span-2 mt-1 md:mt-0">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-surface-container text-on-surface-variant rounded-full font-label-md text-[11px] font-semibold border border-outline-variant/30 truncate max-w-full">
                        <span className="material-symbols-outlined text-[13px] animate-spin-slow">{item.status_icon}</span>
                        <span className="truncate">{item.status}</span>
                      </span>
                    </div>

                    {/* Action Chevron */}
                    <div className="col-span-2 md:col-span-1 text-right mt-1 md:mt-0">
                      <button
                        type="button"
                        className="p-1.5 text-on-surface-variant group-hover:text-primary group-hover:bg-primary/10 rounded-lg transition-all group-hover:translate-x-1"
                      >
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Overlay Backdrop */}
          {selectedCase && (
            <div
              onClick={() => setSelectedCase(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
            />
          )}

          {/* Right Case Details Panel in Responsive Container */}
          <div
            className={`
              w-full sm:w-[480px] lg:w-[440px] xl:w-[490px] 2xl:w-[540px] shrink-0 h-full bg-surface-bright shadow-2xl lg:shadow-xl z-50 lg:z-30 flex flex-col transition-all duration-300 border-l border-outline-variant/30 overflow-hidden
              fixed inset-y-0 right-0 lg:static
              ${selectedCase ? "translate-x-0 opacity-100 flex" : "translate-x-full lg:translate-x-0 hidden lg:flex"}
            `}
          >
            {selectedCase ? (
              <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar p-3 sm:p-4 gap-3.5">
                {/* 1. Case Details Header Box Container */}
                <div className="p-5 sm:p-6 bg-primary-container text-on-primary-container rounded-2xl border border-white/10 relative overflow-hidden shrink-0 shadow-md">
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-fixed/10 rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Top Bar with Close & Print */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCase(null)}
                        className="text-on-primary-container hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 -ml-2 cursor-pointer"
                        title="Close details"
                      >
                        <span className="material-symbols-outlined text-[22px]">close</span>
                      </button>
                      <span className="font-label-md text-[11px] uppercase tracking-widest text-primary-fixed-dim font-bold">
                        Case Details
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => showToast(`Printing case brief for ${selectedCase.id}`)}
                        className="text-on-primary-container hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
                        title="Print case report"
                      >
                        <span className="material-symbols-outlined text-[18px]">print</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast(`Exporting audit log for ${selectedCase.id}`)}
                        className="text-on-primary-container hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
                        title="More options"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </div>

                  {/* Case Identifier */}
                  <div className="relative z-10 flex flex-col gap-1 mt-1">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {selectedCase.id}
                    </h2>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-body-md text-xs sm:text-sm text-primary-fixed font-semibold">
                        Parcel: {selectedCase.parcel_id}
                      </span>
                      <span className="w-1 h-1 bg-primary-fixed-dim rounded-full" />
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-error/20 text-error-container rounded font-label-md text-[10px] uppercase tracking-wider font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-error-container animate-pulse" />
                        {selectedCase.severity} Severity
                      </span>
                    </div>
                  </div>

                  {/* Responsive Workflow Progress Stepper */}
                  <div className="mt-3 pt-3.5 border-t border-white/10 relative z-10">
                    <div className="flex items-center justify-between relative px-2">
                      <div className="absolute top-1/2 left-6 right-6 h-[2px] bg-white/15 -translate-y-1/2 z-0" />
                      <div
                        className="absolute top-1/2 left-6 h-[2px] bg-primary-fixed -translate-y-1/2 z-0 transition-all duration-300"
                        style={{ width: selectedCase.step === 1 ? "0%" : selectedCase.step === 2 ? "50%" : "100%" }}
                      />
                      
                      <div className="flex flex-col items-center gap-1.5 z-10 relative">
                        <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center text-xs font-bold shadow-sm">
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        </div>
                        <span className="font-label-md text-[10px] text-primary-fixed font-bold">Reported</span>
                      </div>

                      <div className="flex flex-col items-center gap-1.5 z-10 relative">
                        <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center shadow-[0_0_12px_rgba(218,226,253,0.4)]">
                          <span className="w-2 h-2 rounded-full bg-primary-container" />
                        </div>
                        <span className="font-label-md text-[10px] text-white font-bold">Review</span>
                      </div>

                      <div className="flex flex-col items-center gap-1.5 z-10 relative">
                        <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-outline-variant" />
                        </div>
                        <span className="font-label-md text-[10px] text-on-primary-container font-medium">Resolution</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Area Mismatch Metric Container Box */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-outline-variant/30 shadow-sm space-y-3.5">
                  <h3 className="font-headline-md text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-error">straighten</span>
                    {selectedCase.issue_type}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
                      <div className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-1">
                        GIS Calculated Area
                      </div>
                      <div className="font-tabular-nums text-lg text-on-surface font-bold">
                        {selectedCase.gis_area} <span className="text-xs text-on-surface-variant font-normal">sq.m</span>
                      </div>
                    </div>
                    <div className="p-3.5 bg-error-container/20 rounded-xl border border-error/20">
                      <div className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-1">
                        Record Area (RoR)
                      </div>
                      <div className="font-tabular-nums text-lg text-error font-bold">
                        {selectedCase.ror_area} <span className="text-xs text-error/70 font-normal">sq.m</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3.5 bg-tertiary-fixed/15 rounded-xl border border-tertiary-fixed-dim/20">
                    <span className="material-symbols-outlined text-on-tertiary-fixed-variant text-[18px] shrink-0 mt-0.5">
                      info
                    </span>
                    <p className="font-body-sm text-xs text-on-tertiary-fixed-variant leading-relaxed">
                      {selectedCase.variance_note}
                    </p>
                  </div>
                </div>

                {/* 3. Spatial Context Container Box */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-outline-variant/30 shadow-sm relative space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-label-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Spatial Context ({selectedCase.village}, {selectedCase.tehsil})
                    </h4>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary font-bold text-[10px] rounded-full uppercase">
                      PostGIS Cadastral Layer
                    </span>
                  </div>

                  <div className="w-full h-44 sm:h-48 rounded-xl overflow-hidden relative shadow-inner group border border-outline-variant/30">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600')"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />
                    
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => showToast(`Zooming map on ${selectedCase.parcel_id}`)}
                        className="w-7 h-7 bg-white/95 backdrop-blur rounded-lg shadow flex items-center justify-center text-on-surface hover:bg-white transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast(`Reset zoom for ${selectedCase.parcel_id}`)}
                        className="w-7 h-7 bg-white/95 backdrop-blur rounded-lg shadow flex items-center justify-center text-on-surface hover:bg-white transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">zoom_out</span>
                      </button>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-surface-container-highest/90 backdrop-blur rounded-lg font-tabular-nums text-[10px] text-on-surface shadow-sm font-semibold border border-outline-variant/20">
                      Lat: {selectedCase.lat}, Lng: {selectedCase.lng}
                    </div>
                  </div>
                </div>

                {/* 4. Evidence & Documents Container Box */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-outline-variant/30 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-label-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Evidence &amp; Documents
                    </h4>
                    <button
                      type="button"
                      onClick={() => showToast(`Opening document upload wizard for ${selectedCase.id}`)}
                      className="text-primary hover:text-primary/80 font-label-md text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">upload_file</span> Add
                    </button>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {selectedCase.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        onClick={() => showToast(`Viewing verified document: ${doc.name}`)}
                        className="flex items-center gap-3 p-3 bg-surface hover:bg-surface-container-low rounded-xl transition-all border border-outline-variant/20 cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary-container text-primary-fixed flex items-center justify-center shadow-sm shrink-0">
                          <span className="material-symbols-outlined text-[18px]">
                            {doc.type === "img" ? "image" : "description"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-body-md text-xs text-on-surface font-bold truncate">
                            {doc.name}
                          </div>
                          <div className="font-label-md text-[10px] text-on-surface-variant">
                            {doc.meta}
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity text-[18px]">
                          download
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Investigation Notes Container Box */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-outline-variant/30 shadow-sm space-y-3">
                  <h4 className="font-label-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Investigation Notes
                  </h4>
                  <div className="relative group">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="w-full min-h-[90px] p-3 bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl font-body-md text-xs text-on-surface placeholder:text-on-surface-variant/50 resize-none outline-none transition-all shadow-inner"
                      placeholder="Enter findings from record review..."
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => showToast("Attachment dialog ready")}
                        className="p-1 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded transition-colors cursor-pointer"
                        title="Attach file to note"
                      >
                        <span className="material-symbols-outlined text-[16px]">attach_file</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNoteText("DGPS verified on ground. Boundary discrepancy confirmed with adjacent parcel.")}
                        className="p-1 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded transition-colors cursor-pointer"
                        title="Insert template"
                      >
                        <span className="material-symbols-outlined text-[16px]">data_object</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 6. Action Buttons Container Box */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-outline-variant/30 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => showToast(`Case ${selectedCase.id} resolved and logged to Audit Trail`)}
                      className="flex-1 py-2.5 px-3 bg-primary text-on-primary hover:bg-primary/90 rounded-xl font-label-md text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">task_alt</span> Resolve Case
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast(`Field survey request created for ${selectedCase.parcel_id}`)}
                      className="flex-1 py-2.5 px-3 bg-surface-container-highest hover:bg-surface-variant text-on-surface rounded-xl font-label-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">architecture</span> Req. Survey
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast(`Case ${selectedCase.id} escalated to District Officer`)}
                      className="py-2.5 px-3 bg-error-container hover:bg-error-container/80 text-on-error-container rounded-xl font-label-md text-xs font-bold transition-all flex items-center justify-center cursor-pointer shrink-0"
                      title="Escalate to higher authority"
                    >
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2 text-outline">description</span>
                <p className="text-sm font-semibold">Select a discrepancy case to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Case Modal */}
      {newCaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface rounded-3xl p-6 shadow-2xl border border-outline-variant/30 max-w-md w-full space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
              <h3 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                File New Discrepancy Case
              </h3>
              <button
                type="button"
                onClick={() => setNewCaseModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateCase} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface-variant uppercase">Parcel ULPIN / ID</label>
                <input
                  type="text"
                  required
                  value={newCaseData.ulpin}
                  onChange={(e) => setNewCaseData({ ...newCaseData, ulpin: e.target.value })}
                  placeholder="e.g. 09-0824-0014-1024 or P-1024"
                  className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant/50 rounded-xl text-xs text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface-variant uppercase">Discrepancy Type</label>
                <select
                  value={newCaseData.type}
                  onChange={(e) => setNewCaseData({ ...newCaseData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant/50 rounded-xl text-xs text-on-surface outline-none focus:border-primary cursor-pointer"
                >
                  <option value="Area Mismatch (>5%)">Area Mismatch (&gt;5%)</option>
                  <option value="Boundary Overlap">Boundary Overlap</option>
                  <option value="Ownership Dispute">Ownership Dispute</option>
                  <option value="Missing Survey Point">Missing Survey Point</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface-variant uppercase">Initial Observation / Notes</label>
                <textarea
                  rows={3}
                  value={newCaseData.description}
                  onChange={(e) => setNewCaseData({ ...newCaseData, description: e.target.value })}
                  placeholder="Describe the discrepancy..."
                  className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant/50 rounded-xl text-xs text-on-surface outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setNewCaseModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-md hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Submit Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom duration-200">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
}
