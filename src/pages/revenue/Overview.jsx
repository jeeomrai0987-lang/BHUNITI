export default function RevenueOverview() {
  return (
    <main className="relative pt-16 min-h-screen bg-background"><div className="px-8 py-4 flex items-center gap-2 text-label-md text-on-surface-variant"><a className="hover:text-primary" href="#">System</a><span className="material-symbols-outlined text-[14px]">chevron_right</span><span className="text-on-surface font-semibold">Dashboard</span></div><div className="flex flex-col w-full h-full p-6 lg:p-8 gap-6 max-w-[1920px] mx-auto">

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
    <div className="bg-surface rounded-xl p-4 flex flex-col justify-between shadow-sm border-l-4 border-surface-variant relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
    <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Total Parcels</span>
    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">map</span>
    </div>
    <div className="flex items-baseline gap-2">
    <span className="text-display text-on-surface tabular-nums tracking-tight">12,402</span>
    </div>
    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-surface-variant/20 rounded-full blur-xl group-hover:bg-primary-fixed/30 transition-colors"></div>
    </div>
    <div className="bg-surface rounded-xl p-4 flex flex-col justify-between shadow-sm border-l-4 border-primary relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
    <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Verified Parcels</span>
    <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
    </div>
    <div className="flex items-baseline gap-2">
    <span className="text-display text-on-surface tabular-nums tracking-tight">10,845</span>
    <span className="text-label-md text-primary bg-primary-fixed/50 px-1.5 py-0.5 rounded flex items-center"><span className="material-symbols-outlined text-[12px] mr-0.5">arrow_upward</span> 87%</span>
    </div>
    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-fixed/20 rounded-full blur-xl group-hover:bg-primary-fixed/40 transition-colors"></div>
    </div>
    <div className="bg-surface rounded-xl p-4 flex flex-col justify-between shadow-sm border-l-4 border-tertiary-fixed relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
    <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Pending Mutations</span>
    <span className="material-symbols-outlined text-on-tertiary-fixed-variant text-[20px]">pending_actions</span>
    </div>
    <div className="flex items-baseline gap-2">
    <span className="text-display text-on-surface tabular-nums tracking-tight">156</span>
    </div>
    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-tertiary-fixed/20 rounded-full blur-xl group-hover:bg-tertiary-fixed/40 transition-colors"></div>
    </div>
    <div className="bg-surface rounded-xl p-4 flex flex-col justify-between shadow-sm border-l-4 border-error relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
    <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Open Discrepancies</span>
    <span className="material-symbols-outlined text-error text-[20px]">warning</span>
    </div>
    <div className="flex items-baseline gap-2">
    <span className="text-display text-on-surface tabular-nums tracking-tight">42</span>
    </div>
    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-error-container/40 rounded-full blur-xl group-hover:bg-error-container/60 transition-colors"></div>
    </div>
    <div className="bg-error-container rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
    <span className="text-label-md text-on-error-container uppercase tracking-wider">High Priority Cases</span>
    <span className="material-symbols-outlined text-on-error-container text-[20px] animate-pulse">priority_high</span>
    </div>
    <div className="flex items-baseline gap-2">
    <span className="text-display text-on-error-container tabular-nums tracking-tight">12</span>
    <span className="text-body-sm text-on-error-container/80 ml-1">Requires immediate action</span>
    </div>
    <div className="absolute -top-10 -left-10 w-32 h-32 bg-error/10 rounded-full blur-2xl"></div>
    </div>
    <div className="bg-surface rounded-xl p-4 flex flex-col justify-between shadow-sm border-l-4 border-secondary relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
    <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Awaiting Field Survey</span>
    <span className="material-symbols-outlined text-secondary text-[20px]">architecture</span>
    </div>
    <div className="flex items-baseline gap-2">
    <span className="text-display text-on-surface tabular-nums tracking-tight">18</span>
    </div>
    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-secondary-fixed/30 rounded-full blur-xl group-hover:bg-secondary-fixed/50 transition-colors"></div>
    </div>
    </div>

    <div className="flex flex-col lg:flex-row gap-6 h-[600px] xl:h-[700px] w-full">

    <div className="flex-1 bg-surface-container rounded-2xl shadow-sm relative overflow-hidden flex flex-col">
    <div className="px-6 py-4 flex justify-between items-center bg-surface/90 backdrop-blur-md z-10">
    <div className="flex items-center gap-3">
    <span className="material-symbols-outlined text-primary">explore</span>
    <h2 className="text-headline-md text-on-surface">Cadastral GIS Overview</h2>
    </div>
    <div className="flex items-center gap-2 bg-surface-container-low rounded-lg p-1 shadow-sm">
    <button className="px-4 py-1.5 text-body-sm font-medium rounded-md bg-primary text-on-primary transition-colors">Cadastral</button>
    <button className="px-4 py-1.5 text-body-sm font-medium rounded-md text-on-surface-variant hover:bg-surface-variant transition-colors">Satellite</button>
    <button className="px-4 py-1.5 text-body-sm font-medium rounded-md text-on-surface-variant hover:bg-surface-variant transition-colors">Land Use</button>
    </div>
    </div>
    <div className="flex-1 relative w-full h-full bg-surface-container-highest">

    <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600')" }}></div>

    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 600">
    <defs>
    <pattern height="40" id="grid" patternunits="userSpaceOnUse" width="40">
    <path className="text-outline-variant/20" d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"></path>
    </pattern>
    <filter id="glow">
    <fegaussianblur result="coloredBlur" stddeviation="2.5"></fegaussianblur>
    <femerge>
    <femergenode in="coloredBlur"></femergenode>
    <femergenode in="SourceGraphic"></femergenode>
    </femerge>
    </filter>
    </defs>
    <rect fill="url(#grid)" height="100%" width="100%"></rect>

    <g className="transition-all duration-500 hover:opacity-80 cursor-pointer">
    <polygon className="text-primary-fixed/40" fill="currentColor" points="200,150 350,120 400,280 220,300" stroke="currentColor" strokeWidth="2"></polygon>
    <circle className="text-primary" cx="290" cy="210" fill="currentColor" r="4"></circle>
    </g>
    <g className="transition-all duration-500 hover:opacity-80 cursor-pointer">
    <polygon className="text-primary-fixed/40" fill="currentColor" points="420,100 580,140 550,260 410,230" stroke="currentColor" strokeWidth="2"></polygon>
    <circle className="text-primary" cx="490" cy="180" fill="currentColor" r="4"></circle>
    </g>

    <g className="transition-all duration-500 hover:opacity-80 cursor-pointer" filter="url(#glow)">
    <polygon className="text-tertiary-fixed/60" fill="currentColor" points="600,160 750,200 700,350 580,300" stroke="currentColor" strokeWidth="2"></polygon>
    <circle className="text-on-tertiary-fixed-variant" cx="660" cy="250" fill="currentColor" r="4"></circle>
    </g>

    <g className="transition-all duration-500 hover:opacity-80 cursor-pointer" filter="url(#glow)">
    <polygon className="text-error" fill="currentColor" points="250,350 450,310 500,480 300,520" stroke="currentColor" strokeWidth="2"></polygon>
    <circle className="text-error animate-ping" cx="375" cy="410" fill="currentColor" r="4"></circle>
    <circle className="text-error" cx="375" cy="410" fill="currentColor" r="4"></circle>
    </g>
    <g className="transition-all duration-500 hover:opacity-80 cursor-pointer">
    <polygon className="text-primary-fixed/40" fill="currentColor" points="780,100 900,120 920,250 760,220" stroke="currentColor" strokeWidth="2"></polygon>
    </g>
    </svg>

    <div className="absolute bottom-6 left-6 bg-surface/90 backdrop-blur-md rounded-xl p-3 shadow-md flex flex-col gap-2 border border-outline-variant/30">
    <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-container hover:bg-surface-variant text-on-surface transition-colors">
    <span className="material-symbols-outlined text-[20px]">add</span>
    </button>
    <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-container hover:bg-surface-variant text-on-surface transition-colors">
    <span className="material-symbols-outlined text-[20px]">remove</span>
    </button>
    <div className="w-8 h-px bg-outline-variant/30 my-1"></div>
    <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-container hover:bg-surface-variant text-on-surface transition-colors">
    <span className="material-symbols-outlined text-[20px]">my_location</span>
    </button>
    </div>

    <div className="absolute bottom-6 right-6 bg-surface/90 backdrop-blur-md rounded-xl p-4 shadow-md border border-outline-variant/30 min-w-[200px]">
    <h4 className="text-label-md text-on-surface-variant mb-3 uppercase tracking-wider">Parcel Status</h4>
    <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-primary-fixed border border-primary"></div>
    <span className="text-body-sm text-on-surface">Verified & Synced</span>
    </div>
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-tertiary-fixed border border-on-tertiary-fixed-variant"></div>
    <span className="text-body-sm text-on-surface">Pending Review</span>
    </div>
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-error-container border border-error"></div>
    <span className="text-body-sm text-on-surface">Active Discrepancy</span>
    </div>
    </div>
    </div>

    <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 bg-surface rounded-lg shadow-xl border border-outline-variant/30 p-3 w-64 pointer-events-none opacity-0 transition-opacity duration-300" id="map-tooltip">
    <div className="flex justify-between items-start mb-1">
    <span className="text-label-md text-on-surface-variant">ULPIN</span>
    <span className="text-label-md text-error bg-error-container px-1.5 py-0.5 rounded">Discrepancy</span>
    </div>
    <div className="text-body-md font-semibold text-on-surface font-tabular-nums mb-2">09283746152439</div>
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-body-sm">
    <span className="text-on-surface-variant">Survey No:</span>
    <span className="text-on-surface text-right">45/2A</span>
    <span className="text-on-surface-variant">Area (Hectares):</span>
    <span className="text-on-surface text-right font-medium text-error">1.24 (Record: 1.45)</span>
    </div>
    </div>
    </div>
    </div>

    <div className="w-full lg:w-96 flex flex-col gap-4">
    <div className="bg-surface rounded-xl shadow-sm h-full flex flex-col border border-outline-variant/20 relative overflow-hidden">

    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-error-container/30 to-transparent rounded-bl-full pointer-events-none"></div>
    <div className="p-5 border-b border-outline-variant/20 flex justify-between items-center bg-surface relative z-10">
    <h3 className="text-headline-md text-on-surface flex items-center gap-2">
    <span className="material-symbols-outlined text-error">warning</span>
                            Action Required
                        </h3>
    <span className="bg-error-container text-on-error-container text-label-md px-2 py-1 rounded-full">12 High Priority</span>
    </div>
    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">

    <div className="p-4 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/30 relative">
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r transition-all group-hover:h-8"></div>
    <div className="flex justify-between items-start mb-2">
    <span className="text-label-md font-mono text-on-surface-variant">CASE P-1024</span>
    <span className="text-[11px] font-semibold text-error bg-error-container/50 px-2 py-0.5 rounded tracking-wide">AREA MISMATCH</span>
    </div>
    <div className="text-body-md text-on-surface font-medium mb-1">Survey No. 112/4, Village Rampur</div>
    <div className="text-body-sm text-on-surface-variant mb-3 line-clamp-2">Spatial area calculation (2.4 Hectares) diverges from textual record (3.1 Hectares) by &gt;15% margin.</div>
    <div className="flex items-center justify-between">
    <div className="flex items-center gap-1 text-label-md text-on-surface-variant">
    <span className="material-symbols-outlined text-[16px]">schedule</span> 2 hours ago
                                </div>
    <button className="text-body-sm font-medium text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    Review <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
    </button>
    </div>
    </div>

    <div className="p-4 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/30 relative">
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r transition-all group-hover:h-8"></div>
    <div className="flex justify-between items-start mb-2">
    <span className="text-label-md font-mono text-on-surface-variant">CASE P-2048</span>
    <span className="text-[11px] font-semibold text-on-tertiary-fixed-variant bg-tertiary-fixed/50 px-2 py-0.5 rounded tracking-wide">OWNERSHIP</span>
    </div>
    <div className="text-body-md text-on-surface font-medium mb-1">ULPIN 98765432109876</div>
    <div className="text-body-sm text-on-surface-variant mb-3 line-clamp-2">Mutation record #M-449 conflicts with pending court injunction registered on sub-registrar portal.</div>
    <div className="flex items-center justify-between">
    <div className="flex items-center gap-1 text-label-md text-on-surface-variant">
    <span className="material-symbols-outlined text-[16px]">schedule</span> 5 hours ago
                                </div>
    <button className="text-body-sm font-medium text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    Review <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
    </button>
    </div>
    </div>

    <div className="p-4 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/30 relative">
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r transition-all group-hover:h-8"></div>
    <div className="flex justify-between items-start mb-2">
    <span className="text-label-md font-mono text-on-surface-variant">CASE P-3112</span>
    <span className="text-[11px] font-semibold text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded tracking-wide">FIELD SURVEY</span>
    </div>
    <div className="text-body-md text-on-surface font-medium mb-1">Khasra 45-B, Sector 9</div>
    <div className="text-body-sm text-on-surface-variant mb-3 line-clamp-2">Boundary dispute raised by adjacent parcel owner. Field surveyor report uploaded, awaiting RO validation.</div>
    <div className="flex items-center justify-between">
    <div className="flex items-center gap-1 text-label-md text-on-surface-variant">
    <span className="material-symbols-outlined text-[16px]">schedule</span> 1 day ago
                                </div>
    <button className="text-body-sm font-medium text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    Review <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
    </button>
    </div>
    </div>
    </div>
    <div className="p-4 border-t border-outline-variant/20 bg-surface">
    <button className="w-full py-2 bg-surface-container hover:bg-surface-variant text-on-surface text-body-sm font-medium rounded-lg transition-colors flex justify-center items-center gap-2">
                            View All Open Cases <span className="material-symbols-outlined text-[18px]">launch</span>
    </button>
    </div>
    </div>
    </div>
    </div>

    <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden mt-2">
    <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest">
    <h3 className="text-headline-md text-on-surface flex items-center gap-2">
    <span className="material-symbols-outlined text-on-surface-variant">history</span>
                    Recent Activity Log
                </h3>
    <div className="flex gap-2">
    <button className="px-3 py-1.5 text-label-md rounded border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container transition-colors">Filter</button>
    <button className="px-3 py-1.5 text-label-md rounded bg-primary text-on-primary hover:bg-primary/90 transition-colors">Export Report</button>
    </div>
    </div>
    <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
    <thead>
    <tr className="bg-surface-container-low text-label-md text-on-surface-variant uppercase tracking-wider">
    <th className="px-6 py-4 font-semibold sticky left-0 bg-surface-container-low w-48">Reference ID</th>
    <th className="px-6 py-4 font-semibold">Activity Type</th>
    <th className="px-6 py-4 font-semibold">Details</th>
    <th className="px-6 py-4 font-semibold">Status</th>
    <th className="px-6 py-4 font-semibold text-right">Timestamp</th>
    </tr>
    </thead>
    <tbody className="text-body-sm align-middle">
    <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
    <td className="px-6 py-3 font-mono text-on-surface sticky left-0 bg-surface group-hover:bg-surface-container-low/50">MUT-2023-8891</td>
    <td className="px-6 py-3">
    <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-[18px] text-primary">swap_horiz</span>
    <span className="text-on-surface font-medium">Mutation Approval</span>
    </div>
    </td>
    <td className="px-6 py-3 text-on-surface-variant truncate max-w-xs">Transfer of ownership recorded for ULPIN 1029384756.</td>
    <td className="px-6 py-3">
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary-fixed/30 text-on-primary-fixed text-[11px] font-semibold tracking-wide">
    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> COMPLETED
                                </span>
    </td>
    <td className="px-6 py-3 text-right text-on-surface-variant tabular-nums">Oct 24, 14:30</td>
    </tr>
    <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors bg-surface-container-low/20">
    <td className="px-6 py-3 font-mono text-on-surface sticky left-0 bg-surface group-hover:bg-surface-container-low/50">DIS-2023-0442</td>
    <td className="px-6 py-3">
    <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-[18px] text-error">flag</span>
    <span className="text-on-surface font-medium">Discrepancy Flagged</span>
    </div>
    </td>
    <td className="px-6 py-3 text-on-surface-variant truncate max-w-xs">Automated reconciliation detected area mismatch in Survey 22.</td>
    <td className="px-6 py-3">
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-error-container text-on-error-container text-[11px] font-semibold tracking-wide">
    <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span> NEW
                                </span>
    </td>
    <td className="px-6 py-3 text-right text-on-surface-variant tabular-nums">Oct 24, 11:15</td>
    </tr>
    <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
    <td className="px-6 py-3 font-mono text-on-surface sticky left-0 bg-surface group-hover:bg-surface-container-low/50">SRV-2023-1102</td>
    <td className="px-6 py-3">
    <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-[18px] text-secondary">architecture</span>
    <span className="text-on-surface font-medium">Field Survey Assigned</span>
    </div>
    </td>
    <td className="px-6 py-3 text-on-surface-variant truncate max-w-xs">Surveyor J. Doe assigned to verify Khasra 89 boundaries.</td>
    <td className="px-6 py-3">
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary-fixed/30 text-on-secondary-fixed text-[11px] font-semibold tracking-wide">
    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> IN PROGRESS
                                </span>
    </td>
    <td className="px-6 py-3 text-right text-on-surface-variant tabular-nums">Oct 23, 09:45</td>
    </tr>
    <tr className="hover:bg-surface-container-low/50 transition-colors bg-surface-container-low/20">
    <td className="px-6 py-3 font-mono text-on-surface sticky left-0 bg-surface group-hover:bg-surface-container-low/50">DOC-2023-9931</td>
    <td className="px-6 py-3">
    <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">description</span>
    <span className="text-on-surface font-medium">Evidence Uploaded</span>
    </div>
    </td>
    <td className="px-6 py-3 text-on-surface-variant truncate max-w-xs">Sale deed scanned and attached to ULPIN 4455667788.</td>
    <td className="px-6 py-3">
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-tertiary-fixed/30 text-on-tertiary-fixed-variant text-[11px] font-semibold tracking-wide">
    <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim"></span> PENDING REVIEW
                                </span>
    </td>
    <td className="px-6 py-3 text-right text-on-surface-variant tabular-nums">Oct 22, 16:20</td>
    </tr>
    </tbody>
    </table>
    </div>
    </div>
    </div>
    </main>
  );
}
