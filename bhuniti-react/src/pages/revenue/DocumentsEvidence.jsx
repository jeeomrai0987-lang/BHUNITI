import { useState } from "react";

export default function DocumentsEvidence() {
  const [selectedDoc, setSelectedDoc] = useState("reg_deed");
  const [selectedFilter, setSelectedFilter] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 70));
  const handleResetZoom = () => setZoomLevel(100);

  const documents = [
    {
      id: "reg_deed",
      title: "Reg_Deed_A45-992.pdf",
      tag: "SALE DEED",
      date: "Oct 12, 2023",
      ulpin: "Associated with ULPIN: 99482-110-33",
      icon: "description",
      hasWarning: true,
      category: "Sale Deed",
    },
    {
      id: "survey_map",
      title: "Survey_Map_Sector4.tiff",
      tag: "SURVEY REPORT",
      date: "Sep 28, 2023",
      ulpin: "Associated with Survey No: 402/A",
      icon: "architecture",
      verified: true,
      category: "Survey Report",
    },
    {
      id: "court_order",
      title: "Court_Order_Dispute_99.pdf",
      tag: "REGISTRATION",
      date: "Aug 05, 2023",
      ulpin: "Associated with ULPIN: 99482-110-33",
      icon: "gavel",
      verified: true,
      category: "Registration",
    },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesFilter =
      selectedFilter === "All Types" || doc.category === selectedFilter;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.ulpin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="relative pt-16 min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-label-md text-on-surface-variant">
        <a className="hover:text-primary transition-colors" href="#">
          System
        </a>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Dashboard</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Documents & Evidence</span>
      </div>

      <div className="flex flex-col w-full h-full max-w-[1700px] mx-auto">
        {/* Page Header */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-on-background">
              Document & Evidence Center
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
              Secure repository for legal instruments, survey records, and
              registration documents. All uploaded artifacts are cross-verified
              against the master land registry via automated OCR extraction.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-5 py-2.5 sm:px-6 sm:py-3 rounded-full flex items-center gap-2 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filter Records
            </button>
            <button className="bg-primary hover:bg-on-surface text-on-primary font-label-md text-label-md px-5 py-2.5 sm:px-6 sm:py-3 rounded-full flex items-center gap-2 shadow-sm transition-colors">
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              Upload Evidence
            </button>
          </div>
        </div>

        {/* Responsive 3-Container Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 sm:px-6 lg:px-8 pb-8 items-start">
          
          {/* CONTAINER 1: Document Repository */}
          <section className="lg:col-span-4 2xl:col-span-3 flex flex-col bg-surface rounded-2xl shadow-sm border border-surface-container-high overflow-hidden">
            <div className="p-4 border-b border-surface-container-high bg-surface-bright flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  folder_open
                </span>
                <span className="font-headline-md text-headline-md text-on-surface">
                  Repository
                </span>
              </div>
              <span className="bg-surface-container-high text-on-surface-variant font-tabular-nums text-tabular-nums px-2.5 py-1 rounded-full text-xs font-semibold">
                1,204
              </span>
            </div>

            <div className="p-4 bg-surface-bright border-b border-surface-container-highest space-y-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">
                  search
                </span>
                <input
                  className="w-full bg-surface pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-sm text-body-sm text-on-surface transition-all placeholder:text-on-surface-variant/60"
                  placeholder="Search by Document ID or Name..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {["All Types", "Sale Deed", "Survey Report", "Registration"].map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`whitespace-nowrap font-label-md text-label-md px-3 py-1.5 rounded-md flex-shrink-0 transition-colors ${
                        selectedFilter === filter
                          ? "bg-secondary-container text-on-secondary-container shadow-sm border border-secondary-fixed/50"
                          : "bg-surface hover:bg-surface-container text-on-surface-variant border border-outline-variant/30"
                      }`}
                    >
                      {filter}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="overflow-y-auto max-h-[520px] 2xl:max-h-[calc(100vh-320px)] divide-y divide-surface-container-highest">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => {
                  const isSelected = selectedDoc === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc.id)}
                      className={`p-4 cursor-pointer transition-colors border-l-4 ${
                        isSelected
                          ? "border-l-primary bg-primary-fixed/30"
                          : "border-l-transparent hover:bg-surface-container-low"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? "bg-surface text-primary shadow-sm border border-outline-variant/20"
                              : "bg-surface-container-high text-on-surface-variant"
                          }`}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={
                              isSelected
                                ? { fontVariationSettings: "'FILL' 1" }
                                : undefined
                            }
                          >
                            {doc.icon}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1 gap-1">
                            <h3 className="font-headline-md text-body-lg font-semibold text-on-surface truncate">
                              {doc.title}
                            </h3>
                            {doc.hasWarning && (
                              <span
                                className="material-symbols-outlined text-error text-[16px] flex-shrink-0"
                                title="Mismatch Detected"
                              >
                                warning
                              </span>
                            )}
                            {doc.verified && (
                              <span
                                className="material-symbols-outlined text-primary text-[16px] flex-shrink-0"
                                title="Verified"
                              >
                                check_circle
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="bg-surface text-on-surface-variant font-label-md text-[10px] px-1.5 py-0.5 rounded border border-outline-variant/40">
                              {doc.tag}
                            </span>
                            <span className="font-tabular-nums text-label-md text-on-surface-variant">
                              {doc.date}
                            </span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                            {doc.ulpin}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-on-surface-variant font-body-sm">
                  No documents found matching the filter.
                </div>
              )}
            </div>
          </section>

          {/* CONTAINER 2: Document Inspection / Preview Viewer */}
          <section className="lg:col-span-8 2xl:col-span-6 flex flex-col bg-surface-bright rounded-2xl shadow-sm border border-surface-container-high overflow-hidden relative min-h-[600px]">
            {/* Viewer Header / Toolbar */}
            <div className="min-h-16 py-3 border-b border-surface-container-highest bg-surface/90 backdrop-blur-md flex flex-wrap sm:flex-nowrap items-center justify-between px-4 sm:px-6 gap-3 z-20">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="material-symbols-outlined text-on-surface-variant bg-surface-container p-2 rounded-lg flex-shrink-0">
                  description
                </span>
                <div className="min-w-0">
                  <h2 className="font-headline-md text-base sm:text-headline-md text-on-surface font-semibold truncate sm:whitespace-normal">
                    Sale Deed: Reg_Deed_A45-992
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-error animate-pulse flex-shrink-0"></span>
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      Verification Alert
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={handleZoomIn}
                  className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                </button>
                <button
                  onClick={handleZoomOut}
                  className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-[20px]">zoom_out</span>
                </button>
                {zoomLevel !== 100 && (
                  <button
                    onClick={handleResetZoom}
                    className="text-xs px-2 py-1 bg-surface-container text-on-surface rounded font-tabular-nums hover:bg-surface-container-high"
                    title="Reset Zoom"
                  >
                    {zoomLevel}%
                  </button>
                )}
                <button
                  className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
                  title="Download Original"
                >
                  <span className="material-symbols-outlined text-[20px]">download</span>
                </button>
                <button
                  className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
                  title="Print"
                >
                  <span className="material-symbols-outlined text-[20px]">print</span>
                </button>
              </div>
            </div>

            {/* Document Canvas with Zoom Support */}
            <div className="flex-1 bg-surface-container-low overflow-auto relative p-4 sm:p-6 md:p-8 flex items-start justify-center max-h-[700px] 2xl:max-h-[calc(100vh-320px)]">
              <div
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "top center",
                  transition: "transform 0.15s ease-out",
                }}
                className="w-full max-w-[760px] bg-white shadow-xl min-h-[850px] p-6 sm:p-10 md:p-12 relative mx-auto rounded-lg border border-outline-variant/20"
              >
                {/* Document Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-on-surface/20 pb-4 mb-8 gap-3">
                  <div>
                    <div className="font-display text-headline-lg text-on-surface font-bold uppercase tracking-widest">
                      Sale Deed
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Instrument of Transfer
                    </div>
                  </div>
                  <div className="sm:text-right font-tabular-nums text-body-sm text-on-surface-variant">
                    Reg No. <strong className="text-on-surface">A45-992/2023</strong>
                    <br />
                    Date: <strong className="text-on-surface">12 Oct 2023</strong>
                  </div>
                </div>

                {/* Document Body */}
                <div className="space-y-6 font-body-lg text-body-lg text-on-surface/80 leading-relaxed max-w-prose">
                  <p>
                    This DEED OF ABSOLUTE SALE executed at{" "}
                    <span className="bg-surface-container-highest px-1.5 py-0.5 rounded font-semibold text-on-surface">
                      Mumbai District Registry
                    </span>{" "}
                    on this 12th day of October, 2023.
                  </p>
                  <p>
                    <strong>BETWEEN</strong>
                    <br />
                    Mr.{" "}
                    <span
                      className="inline-flex items-center gap-1.5 border-2 border-primary bg-primary/10 text-on-surface font-semibold px-2 py-0.5 rounded cursor-pointer transition-all hover:bg-primary/20 shadow-sm"
                      title="OCR Extracted: Ramesh Kumar (Matches MLR - Confidence 99.8%)"
                    >
                      <span>Ramesh Kumar</span>
                      <span className="text-[10px] bg-primary text-on-primary font-medium px-1.5 py-0.2 rounded">
                        OCR
                      </span>
                    </span>
                    , aged 45 years, residing at Plot 12, Sector 4, hereinafter referred to as the VENDOR.
                  </p>
                  <p>
                    <strong>AND</strong>
                    <br />
                    Mrs. Sunita Desai, aged 38 years, residing at Flat 402, Building A, hereinafter referred to as the PURCHASER.
                  </p>
                  <p>
                    <strong>SCHEDULE OF PROPERTY</strong>
                    <br />
                    All that piece and parcel of land bearing Survey No.{" "}
                    <span
                      className="inline-flex items-center gap-1.5 border-2 border-primary bg-primary/10 text-on-surface font-semibold px-2 py-0.5 rounded cursor-pointer transition-all hover:bg-primary/20 shadow-sm"
                      title="OCR Extracted: Survey No. 402/A (Matches MLR - Confidence 98.5%)"
                    >
                      <span>402/A</span>
                      <span className="text-[10px] bg-primary text-on-primary font-medium px-1.5 py-0.2 rounded">
                        OCR
                      </span>
                    </span>
                    , corresponding to ULPIN 99482-110-33, situated in the revenue village of North District.
                  </p>
                  <p>
                    The total extent of the aforementioned property is{" "}
                    <span
                      className="inline-flex items-center gap-1.5 border-2 border-error bg-error-container text-on-error-container font-bold px-2.5 py-0.5 rounded animate-pulse cursor-pointer transition-all hover:bg-error-container/80 shadow-sm"
                      title="OCR Mismatch Detected: Extracted 2.4 Hectares vs MLR 2.2 Hectares"
                    >
                      <span className="underline decoration-error decoration-2 underline-offset-4">
                        2.4 Hectares
                      </span>
                      <span className="text-[10px] bg-error text-on-error font-medium px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[11px]">warning</span>
                        Mismatch
                      </span>
                    </span>
                    , bounded as follows:
                  </p>
                  <ul className="list-disc pl-8 space-y-2 text-body-md text-on-surface-variant">
                    <li>North by: Survey No 401</li>
                    <li>South by: Public Road</li>
                    <li>East by: Canal</li>
                    <li>West by: Survey No 403</li>
                  </ul>
                </div>

                {/* Stamp / Signature Box */}
                <div className="mt-12 sm:mt-16 text-right flex flex-col items-end">
                  <div
                    className="w-48 h-24 border-2 border-dashed border-primary/50 bg-primary/5 rounded-lg flex flex-col items-center justify-center rotate-[-1deg] transition-all hover:bg-primary/10 cursor-pointer p-2"
                    title="OCR Verified: Authorized Signatory Stamp"
                  >
                    <div className="font-display text-headline-md text-primary/70 italic font-semibold">
                      Signature / Stamp
                    </div>
                    <span className="mt-1 text-[10px] bg-primary text-on-primary font-medium px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[11px]">verified</span>
                      Verified
                    </span>
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant mt-2 text-center w-48 font-medium">
                    Authorized Signatory
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CONTAINER 3: OCR Extraction & Discrepancy Verification */}
          <section className="lg:col-span-12 2xl:col-span-3 flex flex-col bg-surface rounded-2xl shadow-sm border border-surface-container-high overflow-hidden z-30">
            <div className="p-4 sm:p-6 border-b border-surface-container-high bg-surface-bright flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  document_scanner
                </span>
                <span className="font-headline-md text-headline-md text-on-surface">
                  OCR Extraction
                </span>
              </div>
              <div className="bg-error-container text-on-error-container px-3 py-1 rounded-full font-label-md text-label-md flex items-center gap-1.5 shadow-sm flex-shrink-0">
                <span className="material-symbols-outlined text-[14px]">gavel</span>
                Discrepancy
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-surface max-h-[520px] 2xl:max-h-[calc(100vh-380px)]">
              <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/20 shadow-sm leading-relaxed">
                Data has been automatically extracted via AI vision models and
                cross-referenced with Master Land Registry (MLR) records for
                ULPIN: <strong className="text-on-surface">99482-110-33</strong>.
              </p>

              {/* Field 1: Current Owner */}
              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Current Owner
                  </span>
                  <div className="flex items-center gap-1 text-primary bg-primary-fixed/50 px-2 py-0.5 rounded font-label-md text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">
                      verified
                    </span>{" "}
                    Matches MLR
                  </div>
                </div>
                <div className="bg-surface-bright border border-surface-container-highest rounded-xl p-4 shadow-sm group-hover:border-primary/50 transition-colors">
                  <div className="font-headline-md text-headline-md text-on-surface mb-1">
                    Ramesh Kumar
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>{" "}
                    Extracted Confidence: 99.8%
                  </div>
                </div>
              </div>

              {/* Field 2: Survey Number */}
              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Survey Number
                  </span>
                  <div className="flex items-center gap-1 text-primary bg-primary-fixed/50 px-2 py-0.5 rounded font-label-md text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">
                      verified
                    </span>{" "}
                    Matches MLR
                  </div>
                </div>
                <div className="bg-surface-bright border border-surface-container-highest rounded-xl p-4 shadow-sm group-hover:border-primary/50 transition-colors">
                  <div className="font-headline-md text-headline-md text-on-surface mb-1">
                    402/A
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>{" "}
                    Extracted Confidence: 98.5%
                  </div>
                </div>
              </div>

              {/* Field 3: Total Area (Mismatch) */}
              <div className="group relative">
                <div className="hidden 2xl:block absolute -left-3 top-1/2 w-3 border-t-2 border-dashed border-error/50"></div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-md text-label-md text-error uppercase tracking-wider font-bold">
                    Total Area
                  </span>
                  <div className="flex items-center gap-1 text-on-error-container bg-error-container px-2 py-0.5 rounded font-label-md text-[10px] animate-pulse shadow-sm">
                    <span className="material-symbols-outlined text-[12px]">
                      warning
                    </span>{" "}
                    Mismatch Detected
                  </div>
                </div>
                <div className="bg-error-container/10 border-2 border-error/40 rounded-xl p-0 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-error/20 bg-surface-bright">
                    <div className="font-label-md text-label-md text-on-surface-variant mb-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">
                        description
                      </span>{" "}
                      Extracted from Document
                    </div>
                    <div className="font-headline-md text-headline-md text-error font-bold">
                      2.4 Hectares
                    </div>
                  </div>

                  <div className="p-4 bg-surface-container-lowest">
                    <div className="font-label-md text-label-md text-on-surface-variant mb-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">
                        database
                      </span>{" "}
                      Master Land Registry
                    </div>
                    <div className="font-headline-md text-headline-md text-on-surface">
                      2.2 Hectares
                    </div>
                    <div className="mt-3 text-body-sm font-body-sm text-on-surface-variant bg-surface p-2 rounded border border-outline-variant/30 flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary mt-0.5 flex-shrink-0">
                        info
                      </span>
                      <span>
                        Discrepancy of +0.2 Hectares. Requires manual surveyor
                        verification before mutation approval.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 sm:p-6 border-t border-surface-container-highest bg-surface-bright flex flex-col gap-3">
              <button className="w-full bg-primary hover:bg-on-surface text-on-primary font-label-md text-label-md py-3.5 rounded-xl shadow-md transition-all flex justify-center items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">flag</span>
                Flag for Physical Survey
              </button>
              <button className="w-full bg-surface hover:bg-surface-container border-2 border-outline-variant/50 text-on-surface font-label-md text-label-md py-3 rounded-xl transition-all">
                Override & Accept Document Value
              </button>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

