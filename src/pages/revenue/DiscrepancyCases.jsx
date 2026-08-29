export default function DiscrepancyCases() {
  return (
    <main className="relative pt-16 min-h-screen bg-background"><div className="px-8 py-4 flex items-center gap-2 text-label-md text-on-surface-variant"><a className="hover:text-primary" href="#">System</a><span className="material-symbols-outlined text-[14px]">chevron_right</span><span className="text-on-surface font-semibold">Dashboard</span></div><div className="flex flex-col w-full h-full relative overflow-hidden bg-background">

    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-error-container/20 blur-[120px]"></div>
    <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-fixed/20 blur-[150px]"></div>
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
    <defs>
    <pattern height="40" id="grid-pattern" patternunits="userSpaceOnUse" width="40">
    <path className="text-on-background" d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
    </pattern>
    </defs>
    <rect fill="url(#grid-pattern)" height="100%" width="100%"></rect>
    </svg>
    </div>

    <div className="flex-1 flex w-full relative z-10 overflow-hidden">

    <div className="flex-1 flex flex-col h-full bg-surface/60 backdrop-blur-md relative shadow-[4px_0_24px_rgba(11,28,48,0.03)] z-20">

    <div className="px-8 pt-8 pb-4 flex flex-col gap-6 sticky top-0 bg-surface/90 backdrop-blur-xl z-30 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
    <div className="flex items-end justify-between">
    <div>
    <h1 className="font-display text-display text-on-surface mb-2 flex items-center gap-3">
                                Discrepancy Cases
                                <span className="inline-flex items-center justify-center bg-error/10 text-error rounded-full px-3 py-1 font-label-md text-label-md">14 Action Required</span>
    </h1>
    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Manage and resolve geometric, topological, and ownership conflicts identified during GIS-Record reconciliation.</p>
    </div>
    <div className="flex items-center gap-3">
    <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest transition-colors rounded-lg font-label-md text-label-md text-on-surface">
    <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
                            </button>
    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary hover:bg-primary/90 transition-colors rounded-lg font-label-md text-label-md shadow-md shadow-primary/20">
    <span className="material-symbols-outlined text-[18px]">add</span> New Case
                            </button>
    </div>
    </div>

    <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar border-b-2 border-surface-container-high">
    <button className="relative px-4 py-2 font-label-md text-label-md text-primary transition-colors whitespace-nowrap group">
                            All Cases
                            <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-primary rounded-t-full"></div>
    </button>
    <button className="relative px-4 py-2 font-label-md text-label-md text-error hover:text-error/80 transition-colors whitespace-nowrap group flex items-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                            High Priority
                            <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-transparent group-hover:bg-error/30 rounded-t-full transition-colors"></div>
    </button>
    <button className="relative px-4 py-2 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap group">
                            Area Conflicts
                            <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-transparent group-hover:bg-surface-container-highest rounded-t-full transition-colors"></div>
    </button>
    <button className="relative px-4 py-2 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap group">
                            Boundary Overlaps
                            <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-transparent group-hover:bg-surface-container-highest rounded-t-full transition-colors"></div>
    </button>
    <button className="relative px-4 py-2 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap group">
                            Ownership Disputes
                            <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-transparent group-hover:bg-surface-container-highest rounded-t-full transition-colors"></div>
    </button>
    </div>
    </div>

    <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">

    <div className="flex flex-col gap-2">

    <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-surface-container-low rounded-lg font-label-md text-label-md text-on-surface-variant uppercase tracking-wider sticky top-0 z-10 shadow-sm">
    <div className="col-span-2">Case ID</div>
    <div className="col-span-2">Parcel</div>
    <div className="col-span-3">Issue Type</div>
    <div className="col-span-2">Severity</div>
    <div className="col-span-2">Status</div>
    <div className="col-span-1 text-right">Action</div>
    </div>

    <div className="group grid grid-cols-12 gap-4 px-4 py-4 bg-primary-fixed/30 hover:bg-primary-fixed/40 transition-all rounded-lg items-center cursor-pointer shadow-sm relative overflow-hidden">
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
    <div className="col-span-2 font-tabular-nums text-tabular-nums text-on-surface font-semibold flex items-center gap-2">
    <span className="material-symbols-outlined text-[16px] text-error" style={{fontVariationSettings: '\'FILL\' 1'}}>warning</span>
                                D-1024
                            </div>
    <div className="col-span-2 font-tabular-nums text-tabular-nums text-on-surface-variant group-hover:text-primary transition-colors">P-1024</div>
    <div className="col-span-3 font-body-sm text-body-sm text-on-surface flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-error-container border border-error"></span>
                                Area Mismatch (&gt;5%)
                            </div>
    <div className="col-span-2">
    <span className="inline-flex px-2 py-0.5 bg-error/10 text-error rounded font-label-md text-[10px] uppercase">High</span>
    </div>
    <div className="col-span-2">
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container text-on-surface-variant rounded-full font-label-md text-[11px]">
    <span className="material-symbols-outlined text-[12px] animate-spin-slow">sync</span> Under Review
                                </span>
    </div>
    <div className="col-span-1 text-right">
    <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
    </button>
    </div>
    </div>

    <div className="group grid grid-cols-12 gap-4 px-4 py-4 bg-surface hover:bg-surface-container-low transition-all rounded-lg items-center cursor-pointer">
    <div className="col-span-2 font-tabular-nums text-tabular-nums text-on-surface font-medium">D-1025</div>
    <div className="col-span-2 font-tabular-nums text-tabular-nums text-on-surface-variant group-hover:text-primary transition-colors">P-2281</div>
    <div className="col-span-3 font-body-sm text-body-sm text-on-surface flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-tertiary-fixed border border-tertiary-fixed-dim"></span>
                                Boundary Overlap
                            </div>
    <div className="col-span-2">
    <span className="inline-flex px-2 py-0.5 bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant rounded font-label-md text-[10px] uppercase">Medium</span>
    </div>
    <div className="col-span-2">
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-error-container/50 text-on-error-container rounded-full font-label-md text-[11px]">
    <span className="material-symbols-outlined text-[12px]">assignment_late</span> Pending Evidence
                                </span>
    </div>
    <div className="col-span-1 text-right">
    <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-md transition-colors opacity-0 group-hover:opacity-100">
    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
    </button>
    </div>
    </div>

    <div className="group grid grid-cols-12 gap-4 px-4 py-4 bg-surface hover:bg-surface-container-low transition-all rounded-lg items-center cursor-pointer">
    <div className="col-span-2 font-tabular-nums text-tabular-nums text-on-surface font-medium">D-1026</div>
    <div className="col-span-2 font-tabular-nums text-tabular-nums text-on-surface-variant group-hover:text-primary transition-colors">P-0933</div>
    <div className="col-span-3 font-body-sm text-body-sm text-on-surface flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-error-container border border-error"></span>
                                Ownership Dispute
                            </div>
    <div className="col-span-2">
    <span className="inline-flex px-2 py-0.5 bg-error/10 text-error rounded font-label-md text-[10px] uppercase">High</span>
    </div>
    <div className="col-span-2">
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container text-on-surface-variant rounded-full font-label-md text-[11px]">
    <span className="material-symbols-outlined text-[12px]">gavel</span> Legal Hold
                                </span>
    </div>
    <div className="col-span-1 text-right">
    <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-md transition-colors opacity-0 group-hover:opacity-100">
    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
    </button>
    </div>
    </div>

    <div className="group grid grid-cols-12 gap-4 px-4 py-4 bg-surface hover:bg-surface-container-low transition-all rounded-lg items-center cursor-pointer">
    <div className="col-span-2 font-tabular-nums text-tabular-nums text-on-surface font-medium">D-1027</div>
    <div className="col-span-2 font-tabular-nums text-tabular-nums text-on-surface-variant group-hover:text-primary transition-colors">P-5542</div>
    <div className="col-span-3 font-body-sm text-body-sm text-on-surface flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-surface-variant border border-outline"></span>
                                Missing Survey Point
                            </div>
    <div className="col-span-2">
    <span className="inline-flex px-2 py-0.5 bg-surface-variant text-on-surface-variant rounded font-label-md text-[10px] uppercase">Low</span>
    </div>
    <div className="col-span-2">
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary-container/50 text-on-secondary-container rounded-full font-label-md text-[11px]">
    <span className="material-symbols-outlined text-[12px]">person_search</span> Assigned Surveyor
                                </span>
    </div>
    <div className="col-span-1 text-right">
    <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-md transition-colors opacity-0 group-hover:opacity-100">
    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
    </button>
    </div>
    </div>
    </div>
    </div>
    </div>

    <div className="w-[520px] shrink-0 h-full bg-surface shadow-xl z-30 flex flex-col transform transition-transform duration-300 translate-x-0 relative">

    <div className="p-6 bg-primary-container text-on-primary-container flex flex-col gap-4 relative overflow-hidden">
    <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-fixed/10 rounded-full blur-2xl"></div>
    <div className="flex items-center justify-between relative z-10">
    <div className="flex items-center gap-2">
    <button className="text-on-primary-container hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 -ml-2">
    <span className="material-symbols-outlined">close</span>
    </button>
    <span className="font-label-md text-label-md uppercase tracking-widest text-primary-fixed-dim">Case Details</span>
    </div>
    <div className="flex items-center gap-2">
    <button className="text-on-primary-container hover:text-white transition-colors p-1">
    <span className="material-symbols-outlined text-[20px]">print</span>
    </button>
    <button className="text-on-primary-container hover:text-white transition-colors p-1">
    <span className="material-symbols-outlined text-[20px]">more_vert</span>
    </button>
    </div>
    </div>
    <div className="relative z-10 flex flex-col gap-1">
    <h2 className="font-display text-display text-white">D-1024</h2>
    <div className="flex items-center gap-3">
    <span className="font-body-lg text-body-lg text-primary-fixed">Parcel: P-1024</span>
    <span className="w-1 h-1 bg-primary-fixed-dim rounded-full"></span>
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-error/20 text-error-container rounded font-label-md text-[11px] uppercase tracking-wider">
    <span className="w-1.5 h-1.5 rounded-full bg-error-container animate-pulse"></span>
                                High Severity
                            </span>
    </div>
    </div>

    <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
    <div className="flex items-center justify-between relative">
    <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-white/10 -translate-y-1/2 z-0"></div>
    <div className="absolute top-1/2 left-4 w-1/2 h-[2px] bg-primary-fixed -translate-y-1/2 z-0"></div>
    <div className="flex flex-col items-center gap-2 z-10 relative">
    <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center">
    <span className="material-symbols-outlined text-[14px]">check</span>
    </div>
    <span className="font-label-md text-[10px] text-primary-fixed">Reported</span>
    </div>
    <div className="flex flex-col items-center gap-2 z-10 relative">
    <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center shadow-[0_0_12px_rgba(218,226,253,0.4)]">
    <span className="w-2 h-2 rounded-full bg-primary-container"></span>
    </div>
    <span className="font-label-md text-[10px] text-white">Review</span>
    </div>
    <div className="flex flex-col items-center gap-2 z-10 relative">
    <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
    <span className="w-2 h-2 rounded-full bg-outline-variant"></span>
    </div>
    <span className="font-label-md text-[10px] text-on-primary-container">Resolution</span>
    </div>
    </div>
    </div>
    </div>

    <div className="flex-1 overflow-y-auto bg-surface-bright flex flex-col">

    <div className="p-6 border-b border-surface-container-high bg-white">
    <h3 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
    <span className="material-symbols-outlined text-error">straighten</span>
                            Area Mismatch
                        </h3>
    <div className="grid grid-cols-2 gap-4">
    <div className="p-3 bg-surface-container-low rounded-lg">
    <div className="font-label-md text-[11px] text-on-surface-variant uppercase mb-1">GIS Calculated Area</div>
    <div className="font-tabular-nums text-headline-md text-on-surface font-semibold">1,245.50 <span className="text-body-sm text-on-surface-variant font-normal">sq.m</span></div>
    </div>
    <div className="p-3 bg-error-container/20 rounded-lg">
    <div className="font-label-md text-[11px] text-on-surface-variant uppercase mb-1">Record Area (RoR)</div>
    <div className="font-tabular-nums text-headline-md text-error font-semibold">1,180.00 <span className="text-body-sm text-error/70 font-normal">sq.m</span></div>
    </div>
    </div>
    <div className="mt-4 flex items-start gap-3 p-3 bg-tertiary-fixed/10 rounded-lg">
    <span className="material-symbols-outlined text-on-tertiary-fixed-variant text-[20px]">info</span>
    <p className="font-body-sm text-body-sm text-on-tertiary-fixed-variant leading-relaxed">
                                Variance of <strong>65.50 sq.m (5.5%)</strong> exceeds allowable tolerance of 2.0%. Investigation required to determine if discrepancy is due to digitizing error or physical encroachment.
                            </p>
    </div>
    </div>

    <div className="p-6 border-b border-surface-container-high bg-surface-bright relative">
    <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4">Spatial Context</h4>
    <div className="w-full h-48 rounded-xl overflow-hidden relative shadow-inner group">
    <div className="absolute inset-0 bg-cover bg-center" data-location="Agricultural plots, rural India, high contrast satellite view with glowing parcel boundary overlay in red" style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuCUj8StR57KkGAr10iWLPQZbKBPzHBem9ldT8Tu48gyCq17Fr8krZx6N8aN5iGrKzfr_VzrMCBVxW551Q0dN_H47WdSjVNckzUoYNali-JR3v5QNFpvVTkn8gofBiKtqjsEF0HoUTl0ay3jev9NQi5ulTnPRoJjoVV3rABw52GFaxYe-AU6-BwnAUaA7vn4l7tgNAbvYeyYIpc6JS9GOlsvQIaUuc5QnKZrtJhQ588AGUeHhnkFWnM\')'}}></div>

    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
    <div className="absolute top-2 right-2 flex flex-col gap-1">
    <button className="w-8 h-8 bg-white/90 backdrop-blur rounded shadow flex items-center justify-center text-on-surface hover:bg-white transition-colors"><span className="material-symbols-outlined text-[18px]">zoom_in</span></button>
    <button className="w-8 h-8 bg-white/90 backdrop-blur rounded shadow flex items-center justify-center text-on-surface hover:bg-white transition-colors"><span className="material-symbols-outlined text-[18px]">zoom_out</span></button>
    </div>
    <div className="absolute bottom-2 left-2 px-2 py-1 bg-surface-container-highest/90 backdrop-blur rounded font-tabular-nums text-[10px] text-on-surface shadow-sm">
                                Lat: 28.6139, Lng: 77.2090
                            </div>
    </div>
    </div>

    <div className="p-6 border-b border-surface-container-high bg-white">
    <div className="flex items-center justify-between mb-4">
    <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Evidence & Documents</h4>
    <button className="text-primary hover:text-primary/80 font-label-md text-label-md flex items-center gap-1 transition-colors">
    <span className="material-symbols-outlined text-[16px]">upload_file</span> Add
                            </button>
    </div>
    <div className="flex flex-col gap-3">
    <div className="flex items-center gap-4 p-3 bg-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer group">
    <div className="w-10 h-10 rounded bg-primary-container text-primary-fixed flex items-center justify-center shadow-sm">
    <span className="material-symbols-outlined">description</span>
    </div>
    <div className="flex-1 min-w-0">
    <div className="font-body-md text-body-md text-on-surface font-medium truncate">Original_RoR_Scan_1998.pdf</div>
    <div className="font-label-md text-[11px] text-on-surface-variant">Uploaded 2 days ago • 1.2 MB</div>
    </div>
    <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">download</span>
    </div>
    <div className="flex items-center gap-4 p-3 bg-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer group">
    <div className="w-10 h-10 rounded overflow-hidden shadow-sm relative">
    <div className="absolute inset-0 bg-cover bg-center" data-alt="Scanned historical map showing property lines with faded ink and grid lines" style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuDQNSbheWT1frQGRTVfdRXozZPqKFV2XE5pjCPIVuYTXdz0ExkE18jKQazvOdiv4BeOBXQG6kpqIobZuKdkINM2wdBpgDW-7XdyWayKoScEnV36g1Gyi51y0nrG7ZlBmIl1QR7RQbxrL9RTEBOo7J0RjLN0rVj6K2_tyi-YV8NvJBYonmCBrKvv8ADr0ZXKKKViIrl6mdYOr6Xp4RRjg1URlqNPohZRdhn9SV7hnNyUDaSqBiss4hM\')'}}></div>
    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
    <span className="material-symbols-outlined text-white text-[16px]">image</span>
    </div>
    </div>
    <div className="flex-1 min-w-0">
    <div className="font-body-md text-body-md text-on-surface font-medium truncate">Field_Sketch_Map.jpg</div>
    <div className="font-label-md text-[11px] text-on-surface-variant">System Gen • 345 KB</div>
    </div>
    <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">visibility</span>
    </div>
    </div>
    </div>

    <div className="p-6 bg-surface-bright flex-1">
    <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4">Investigation Notes</h4>
    <div className="relative group">
    <textarea className="w-full min-h-[120px] p-4 bg-white border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg font-body-md text-body-md text-on-surface placeholder-on-surface-variant/50 resize-none outline-none transition-all shadow-sm group-hover:shadow" placeholder="Enter findings from record review..."></textarea>
    <div className="absolute bottom-3 right-3 flex items-center gap-2">
    <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded transition-colors" title="Attach file to note">
    <span className="material-symbols-outlined text-[18px]">attach_file</span>
    </button>
    <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded transition-colors" title="Insert template">
    <span className="material-symbols-outlined text-[18px]">data_object</span>
    </button>
    </div>
    </div>
    </div>
    </div>

    <div className="p-6 bg-white border-t border-surface-container-high shadow-[0_-4px_16px_rgba(0,0,0,0.02)] z-20">
    <div className="flex items-center gap-3">
    <button className="flex-1 py-3 px-4 bg-primary text-on-primary hover:bg-primary/90 rounded-lg font-label-md text-label-md transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2">
    <span className="material-symbols-outlined text-[18px]">task_alt</span> Resolve Case
                        </button>
    <button className="flex-1 py-3 px-4 bg-surface-container-highest hover:bg-surface-variant text-on-surface rounded-lg font-label-md text-label-md transition-colors flex items-center justify-center gap-2">
    <span className="material-symbols-outlined text-[18px]">architecture</span> Req. Survey
                        </button>
    <button className="py-3 px-4 bg-error-container hover:bg-error-container/80 text-on-error-container rounded-lg font-label-md text-label-md transition-colors flex items-center justify-center" title="Escalate to higher authority">
    <span className="material-symbols-outlined text-[18px]">trending_up</span>
    </button>
    </div>
    </div>
    </div>
    </div>
    </div>
    </main>
  );
}
