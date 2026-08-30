export default function DocumentsEvidence() {
  return (
    <main className="relative pt-16 min-h-screen bg-background"><div className="px-8 py-4 flex items-center gap-2 text-label-md text-on-surface-variant"><a className="hover:text-primary" href="#">System</a><span className="material-symbols-outlined text-[14px]">chevron_right</span><span className="text-on-surface font-semibold">Dashboard</span></div><div className="flex flex-col w-full h-full max-w-[1600px] mx-auto">

    <div className="px-8 py-6 mb-4 flex items-center justify-between">
    <div>
    <h1 className="font-display text-display text-on-background">Document & Evidence Center</h1>
    <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
                    Secure repository for legal instruments, survey records, and registration documents. All uploaded artifacts are cross-verified against the master land registry via automated OCR extraction.
                </p>
    </div>
    <div className="flex gap-4">
    <button className="bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 transition-colors">
    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    Filter Records
                </button>
    <button className="bg-primary hover:bg-on-surface text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 shadow-sm transition-colors">
    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                    Upload Evidence
                </button>
    </div>
    </div>

    <div className="flex-1 flex gap-6 px-8 pb-8 overflow-hidden">

    <div className="w-[380px] flex-shrink-0 flex flex-col bg-surface rounded-2xl shadow-sm border border-surface-container-high overflow-hidden">
    <div className="p-4 border-b border-surface-container-high bg-surface-bright flex items-center justify-between sticky top-0 z-10">
    <span className="font-headline-md text-headline-md text-on-surface">Repository</span>
    <span className="bg-surface-container-high text-on-surface-variant font-tabular-nums text-tabular-nums px-2.5 py-1 rounded-full">1,204</span>
    </div>

    <div className="p-4 bg-surface-bright border-b border-surface-container-highest">
    <div className="relative mb-3">
    <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant">search</span>
    <input className="w-full bg-surface pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-sm text-body-sm text-on-surface transition-all placeholder:text-on-surface-variant/60" placeholder="Search by Document ID or Name..." type="text" />
    </div>
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-hide">
    <button className="whitespace-nowrap bg-secondary-container text-on-secondary-container font-label-md text-label-md px-3 py-1.5 rounded-md flex-shrink-0 shadow-sm border border-secondary-fixed/50">All Types</button>
    <button className="whitespace-nowrap bg-surface hover:bg-surface-container text-on-surface-variant font-label-md text-label-md px-3 py-1.5 rounded-md flex-shrink-0 transition-colors border border-outline-variant/30">Sale Deed</button>
    <button className="whitespace-nowrap bg-surface hover:bg-surface-container text-on-surface-variant font-label-md text-label-md px-3 py-1.5 rounded-md flex-shrink-0 transition-colors border border-outline-variant/30">Survey Report</button>
    <button className="whitespace-nowrap bg-surface hover:bg-surface-container text-on-surface-variant font-label-md text-label-md px-3 py-1.5 rounded-md flex-shrink-0 transition-colors border border-outline-variant/30">Registration</button>
    </div>
    </div>

    <div className="flex-1 overflow-y-auto">

    <div className="p-4 border-l-4 border-l-primary bg-primary-fixed/30 cursor-pointer border-b border-surface-container-highest">
    <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-primary shadow-sm border border-outline-variant/20 flex-shrink-0">
    <span className="material-symbols-outlined" style={{fontVariationSettings: '\'FILL\' 1'}}>description</span>
    </div>
    <div className="flex-1 min-w-0">
    <div className="flex justify-between items-start mb-1">
    <h3 className="font-headline-md text-body-lg font-semibold text-on-surface truncate">Reg_Deed_A45-992.pdf</h3>
    <span className="material-symbols-outlined text-error text-[16px]" title="Mismatch Detected">warning</span>
    </div>
    <div className="flex items-center gap-2 mb-2">
    <span className="bg-surface text-on-surface-variant font-label-md text-[10px] px-1.5 py-0.5 rounded border border-outline-variant/40">SALE DEED</span>
    <span className="font-tabular-nums text-label-md text-on-surface-variant">Oct 12, 2023</span>
    </div>
    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Associated with ULPIN: 99482-110-33</p>
    </div>
    </div>
    </div>

    <div className="p-4 hover:bg-surface-container-low cursor-pointer transition-colors border-b border-surface-container-highest border-l-4 border-l-transparent">
    <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant flex-shrink-0">
    <span className="material-symbols-outlined">architecture</span>
    </div>
    <div className="flex-1 min-w-0">
    <div className="flex justify-between items-start mb-1">
    <h3 className="font-headline-md text-body-lg font-medium text-on-surface truncate">Survey_Map_Sector4.tiff</h3>
    <span className="material-symbols-outlined text-primary text-[16px] animate-pulse" title="Verified">check_circle</span>
    </div>
    <div className="flex items-center gap-2 mb-2">
    <span className="bg-surface text-on-surface-variant font-label-md text-[10px] px-1.5 py-0.5 rounded border border-outline-variant/40">SURVEY REPORT</span>
    <span className="font-tabular-nums text-label-md text-on-surface-variant">Sep 28, 2023</span>
    </div>
    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Associated with Survey No: 402/A</p>
    </div>
    </div>
    </div>

    <div className="p-4 hover:bg-surface-container-low cursor-pointer transition-colors border-b border-surface-container-highest border-l-4 border-l-transparent">
    <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant flex-shrink-0">
    <span className="material-symbols-outlined">gavel</span>
    </div>
    <div className="flex-1 min-w-0">
    <div className="flex justify-between items-start mb-1">
    <h3 className="font-headline-md text-body-lg font-medium text-on-surface truncate">Court_Order_Dispute_99.pdf</h3>
    <span className="material-symbols-outlined text-primary text-[16px]" title="Verified">check_circle</span>
    </div>
    <div className="flex items-center gap-2 mb-2">
    <span className="bg-surface text-on-surface-variant font-label-md text-[10px] px-1.5 py-0.5 rounded border border-outline-variant/40">REGISTRATION</span>
    <span className="font-tabular-nums text-label-md text-on-surface-variant">Aug 05, 2023</span>
    </div>
    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Associated with ULPIN: 99482-110-33</p>
    </div>
    </div>
    </div>
    </div>
    </div>

    <div className="flex-1 flex flex-col bg-surface-bright rounded-2xl shadow-sm border border-surface-container-high overflow-hidden relative">

    <div className="h-16 border-b border-surface-container-highest bg-surface/90 backdrop-blur-md flex items-center justify-between px-6 z-20">
    <div className="flex items-center gap-4">
    <span className="material-symbols-outlined text-on-surface-variant bg-surface-container p-2 rounded-lg">description</span>
    <div>
    <h2 className="font-headline-md text-headline-md text-on-surface">Sale Deed: Reg_Deed_A45-992</h2>
    <div className="flex items-center gap-2 mt-0.5">
    <span className="w-2 h-2 rounded-full bg-error"></span>
    <span className="font-label-md text-label-md text-on-surface-variant uppercase">Verification Alert</span>
    </div>
    </div>
    </div>
    <div className="flex gap-2">
    <button className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" title="Zoom In">
    <span className="material-symbols-outlined">zoom_in</span>
    </button>
    <button className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" title="Zoom Out">
    <span className="material-symbols-outlined">zoom_out</span>
    </button>
    <button className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" title="Download Original">
    <span className="material-symbols-outlined">download</span>
    </button>
    <button className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" title="Print">
    <span className="material-symbols-outlined">print</span>
    </button>
    </div>
    </div>

    <div className="flex-1 bg-surface-container-low overflow-auto relative p-8 flex items-start justify-center">

    <div className="w-[800px] bg-white shadow-xl min-h-[1000px] p-12 relative">

    <div className="absolute border-2 border-primary bg-primary/10 rounded" style={{top: '15%', left: '10%', width: '30%', height: '3%', cursor: 'pointer'}} title="Extracted: Ramesh Kumar"></div>
    <div className="absolute border-2 border-primary bg-primary/10 rounded" style={{top: '22%', left: '10%', width: '20%', height: '3%', cursor: 'pointer'}} title="Extracted: 402/A"></div>
    <div className="absolute border-2 border-error bg-error/20 rounded animate-pulse" style={{top: '29%', left: '10%', width: '25%', height: '3%', cursor: 'pointer'}} title="Mismatch Detected: 2.4 Hectares"></div>
    <div className="absolute border-2 border-primary bg-primary/10 rounded" style={{top: '85%', left: '60%', width: '25%', height: '8%', cursor: 'pointer'}} title="Extracted Signature"></div>

    <div className="flex justify-between items-end border-b-2 border-on-surface/20 pb-4 mb-8">
    <div>
    <div className="font-display text-headline-lg text-on-surface font-bold uppercase tracking-widest">Sale Deed</div>
    <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Instrument of Transfer</div>
    </div>
    <div className="text-right font-tabular-nums text-body-sm text-on-surface-variant">
                                Reg No. <strong className="text-on-surface">A45-992/2023</strong><br />
                                Date: <strong className="text-on-surface">12 Oct 2023</strong>
    </div>
    </div>
    <div className="space-y-6 font-body-lg text-body-lg text-on-surface/80 leading-relaxed max-w-prose">
    <p>This DEED OF ABSOLUTE SALE executed at <span className="bg-surface-container-highest px-1 font-semibold text-on-surface">Mumbai District Registry</span> on this 12th day of October, 2023.</p>
    <p><strong>BETWEEN</strong><br />
                            Mr. <span className="bg-surface-container-highest px-1 font-semibold text-on-surface">Ramesh Kumar</span>, aged 45 years, residing at Plot 12, Sector 4, hereinafter referred to as the VENDOR.</p>
    <p><strong>AND</strong><br />
                            Mrs. Sunita Desai, aged 38 years, residing at Flat 402, Building A, hereinafter referred to as the PURCHASER.</p>
    <p><strong>SCHEDULE OF PROPERTY</strong><br />
                            All that piece and parcel of land bearing Survey No. <span className="bg-surface-container-highest px-1 font-semibold text-on-surface">402/A</span>, corresponding to ULPIN 99482-110-33, situated in the revenue village of North District.</p>
    <p>The total extent of the aforementioned property is <span className="bg-error-container text-on-error-container px-1 font-bold underline decoration-error decoration-2 underline-offset-4">2.4 Hectares</span>, bounded as follows:</p>
    <ul className="list-disc pl-8 space-y-2 text-body-md text-on-surface-variant">
    <li>North by: Survey No 401</li>
    <li>South by: Public Road</li>
    <li>East by: Canal</li>
    <li>West by: Survey No 403</li>
    </ul>
    </div>
    <div className="absolute bottom-12 right-12 text-center">
    <div className="w-48 h-24 border border-outline-variant/30 flex items-center justify-center bg-surface-bright/50 rotate-[-2deg] font-display text-headline-md text-on-surface/40 italic">Signature / Stamp</div>
    <div className="font-body-sm text-body-sm text-on-surface-variant mt-2">Authorized Signatory</div>
    </div>
    </div>
    </div>
    </div>

    <div className="w-[420px] flex-shrink-0 flex flex-col bg-surface rounded-2xl shadow-sm border border-surface-container-high overflow-hidden z-30">
    <div className="p-6 border-b border-surface-container-high bg-surface-bright flex items-center justify-between">
    <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-primary">document_scanner</span>
    <span className="font-headline-md text-headline-md text-on-surface">OCR Extraction</span>
    </div>
    <div className="bg-error-container text-on-error-container px-3 py-1 rounded-full font-label-md text-label-md flex items-center gap-1.5 shadow-sm">
    <span className="material-symbols-outlined text-[14px]">gavel</span>
                        Discrepancy
                    </div>
    </div>
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface">
    <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/20 shadow-sm leading-relaxed">
                        Data has been automatically extracted via AI vision models and cross-referenced with Master Land Registry (MLR) records for ULPIN: <strong className="text-on-surface">99482-110-33</strong>.
                    </p>

    <div className="group">
    <div className="flex justify-between items-center mb-2">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Current Owner</span>
    <div className="flex items-center gap-1 text-primary bg-primary-fixed/50 px-2 py-0.5 rounded font-label-md text-[10px]">
    <span className="material-symbols-outlined text-[12px]">verified</span> Matches MLR
                            </div>
    </div>
    <div className="bg-surface-bright border border-surface-container-highest rounded-xl p-4 shadow-sm group-hover:border-primary/50 transition-colors">
    <div className="font-headline-md text-headline-md text-on-surface mb-1">Ramesh Kumar</div>
    <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Extracted Confidence: 99.8%
                            </div>
    </div>
    </div>

    <div className="group">
    <div className="flex justify-between items-center mb-2">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Survey Number</span>
    <div className="flex items-center gap-1 text-primary bg-primary-fixed/50 px-2 py-0.5 rounded font-label-md text-[10px]">
    <span className="material-symbols-outlined text-[12px]">verified</span> Matches MLR
                            </div>
    </div>
    <div className="bg-surface-bright border border-surface-container-highest rounded-xl p-4 shadow-sm group-hover:border-primary/50 transition-colors">
    <div className="font-headline-md text-headline-md text-on-surface mb-1">402/A</div>
    <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Extracted Confidence: 98.5%
                            </div>
    </div>
    </div>

    <div className="group relative">

    <div className="absolute -left-3 top-1/2 w-3 border-t-2 border-dashed border-error/50"></div>
    <div className="flex justify-between items-center mb-2">
    <span className="font-label-md text-label-md text-error uppercase tracking-wider font-bold">Total Area</span>
    <div className="flex items-center gap-1 text-on-error-container bg-error-container px-2 py-0.5 rounded font-label-md text-[10px] animate-pulse shadow-sm">
    <span className="material-symbols-outlined text-[12px]">warning</span> Mismatch Detected
                            </div>
    </div>
    <div className="bg-error-container/10 border-2 border-error/40 rounded-xl p-0 shadow-sm overflow-hidden flex flex-col">

    <div className="p-4 border-b border-error/20 bg-surface-bright">
    <div className="font-label-md text-label-md text-on-surface-variant mb-1 flex items-center gap-2">
    <span className="material-symbols-outlined text-[14px]">description</span> Extracted from Document
                                </div>
    <div className="font-headline-md text-headline-md text-error font-bold">2.4 Hectares</div>
    </div>

    <div className="p-4 bg-surface-container-lowest">
    <div className="font-label-md text-label-md text-on-surface-variant mb-1 flex items-center gap-2">
    <span className="material-symbols-outlined text-[14px]">database</span> Master Land Registry
                                </div>
    <div className="font-headline-md text-headline-md text-on-surface">2.2 Hectares</div>
    <div className="mt-3 text-body-sm font-body-sm text-on-surface-variant bg-surface p-2 rounded border border-outline-variant/30 flex items-start gap-2">
    <span className="material-symbols-outlined text-[16px] text-primary mt-0.5">info</span>
    <span>Discrepancy of +0.2 Hectares. Requires manual surveyor verification before mutation approval.</span>
    </div>
    </div>
    </div>
    </div>
    </div>

    <div className="p-6 border-t border-surface-container-highest bg-surface-bright flex flex-col gap-3">
    <button className="w-full bg-primary hover:bg-on-surface text-on-primary font-label-md text-label-md py-3.5 rounded-xl shadow-md transition-all flex justify-center items-center gap-2">
    <span className="material-symbols-outlined">flag</span>
                        Flag for Physical Survey
                    </button>
    <button className="w-full bg-surface hover:bg-surface-container border-2 border-outline-variant/50 text-on-surface font-label-md text-label-md py-3 rounded-xl transition-all">
                        Override & Accept Document Value
                    </button>
    </div>
    </div>
    </div>
    </div></main>
  );
}
