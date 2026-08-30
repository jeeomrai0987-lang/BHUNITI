export default function FieldSurvey() {
  return (
    <main className="pt-16 pl-sidebar-width min-h-screen bg-background"><div className="p-margin-desktop"><div className="flex flex-col w-full h-full space-y-6">
    <div className="flex justify-between items-end mb-4">
    <div>
    <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Field Survey Management</h1>
    <p className="font-body-md text-body-md text-on-surface-variant">Overview of on-ground verification and surveying activities.</p>
    </div>
    <div className="flex gap-3">
    <button className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded shadow-sm hover:shadow-md transition-shadow flex items-center gap-2">
    <span className="material-symbols-outlined text-lg">add</span>
                    New Request
                </button>
    </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-6">
    <div className="bg-surface-container rounded-xl p-4 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2 relative z-10">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Active Requests</span>
    <span className="material-symbols-outlined text-primary text-xl opacity-80">assignment</span>
    </div>
    <div className="font-display text-display text-on-surface relative z-10">18</div>
    <div className="mt-2 text-sm text-secondary flex items-center gap-1 font-body-sm relative z-10">
    <span className="material-symbols-outlined text-sm text-error">arrow_upward</span>
    <span className="text-error font-medium">+2</span> since yesterday
                </div>
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-fixed opacity-20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
    </div>
    <div className="bg-surface-container rounded-xl p-4 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2 relative z-10">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">In Progress</span>
    <span className="material-symbols-outlined text-secondary text-xl opacity-80">engineering</span>
    </div>
    <div className="font-display text-display text-on-surface relative z-10">5</div>
    <div className="mt-2 text-sm text-secondary flex items-center gap-1 font-body-sm relative z-10">
    <span className="w-2 h-2 rounded-full bg-primary-fixed"></span> Active field teams
                </div>
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary-fixed opacity-20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
    </div>
    <div className="bg-surface-container rounded-xl p-4 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2 relative z-10">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Awaiting Verification</span>
    <span className="material-symbols-outlined text-tertiary-fixed-dim text-xl opacity-80">pending_actions</span>
    </div>
    <div className="font-display text-display text-on-surface relative z-10">12</div>
    <div className="mt-2 text-sm text-secondary flex items-center gap-1 font-body-sm relative z-10">
                    Requires RO approval
                </div>
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-tertiary-fixed opacity-20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
    </div>
    <div className="bg-surface-container rounded-xl p-4 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2 relative z-10">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Equipment Readiness</span>
    <span className="material-symbols-outlined text-primary text-xl opacity-80">sensors</span>
    </div>
    <div className="font-display text-display text-on-surface relative z-10">92%</div>
    <div className="mt-2 w-full bg-surface-variant rounded-full h-1.5 relative z-10">
    <div className="bg-primary h-1.5 rounded-full" style={{width: '92%'}}></div>
    </div>
    <div className="mt-1 text-sm text-secondary text-right font-body-sm relative z-10">Calibrated & Ready</div>
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-fixed opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
    </div>
    </div>

    <div className="flex flex-col xl:flex-row gap-gutter h-[calc(100vh-280px)]">

    <div className="flex-1 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col overflow-hidden">
    <div className="px-4 py-3 bg-surface-container-low flex justify-between items-center">
    <h2 className="font-headline-md text-headline-md text-on-surface">Survey Request Queue</h2>
    <div className="flex gap-2">
    <button className="p-1.5 rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant">
    <span className="material-symbols-outlined text-sm">filter_list</span>
    </button>
    <button className="p-1.5 rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant">
    <span className="material-symbols-outlined text-sm">sort</span>
    </button>
    </div>
    </div>
    <div className="overflow-auto flex-1">
    <table className="w-full text-left font-body-sm">
    <thead className="bg-surface-container sticky top-0 z-10">
    <tr>
    <th className="px-4 py-2 font-label-md text-label-md text-on-surface-variant uppercase">Request ID</th>
    <th className="px-4 py-2 font-label-md text-label-md text-on-surface-variant uppercase">Parcel ID</th>
    <th className="px-4 py-2 font-label-md text-label-md text-on-surface-variant uppercase">Type</th>
    <th className="px-4 py-2 font-label-md text-label-md text-on-surface-variant uppercase">Priority</th>
    <th className="px-4 py-2 font-label-md text-label-md text-on-surface-variant uppercase">Surveyor</th>
    <th className="px-4 py-2 font-label-md text-label-md text-on-surface-variant uppercase">Status</th>
    <th className="px-4 py-2"></th>
    </tr>
    </thead>
    <tbody className="divide-y divide-surface-variant">

    <tr className="bg-primary-fixed/20 hover:bg-primary-fixed/30 cursor-pointer transition-colors">
    <td className="px-4 py-3 font-tabular-nums text-on-surface">SR-2023-089</td>
    <td className="px-4 py-3 font-tabular-nums font-semibold text-primary">P-1024</td>
    <td className="px-4 py-3 text-on-surface-variant">Boundary Dispute</td>
    <td className="px-4 py-3">
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-md text-[10px] uppercase">
    <span className="w-1.5 h-1.5 rounded-full bg-error"></span> High
                                    </span>
    </td>
    <td className="px-4 py-3 text-on-surface">R. Sharma (T-Alpha)</td>
    <td className="px-4 py-3">
    <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-[10px] uppercase">Review Pending</span>
    </td>
    <td className="px-4 py-3 text-right">
    <button className="text-primary hover:text-primary-container"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
    </td>
    </tr>

    <tr className="hover:bg-surface-container-low cursor-pointer transition-colors">
    <td className="px-4 py-3 font-tabular-nums text-on-surface-variant">SR-2023-091</td>
    <td className="px-4 py-3 font-tabular-nums font-medium text-on-surface">P-2155</td>
    <td className="px-4 py-3 text-on-surface-variant">Subdivision</td>
    <td className="px-4 py-3">
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant font-label-md text-[10px] uppercase">
                                         Medium
                                    </span>
    </td>
    <td className="px-4 py-3 text-on-surface">M. Patel (T-Beta)</td>
    <td className="px-4 py-3">
    <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-secondary-fixed text-on-secondary-fixed font-label-md text-[10px] uppercase">In Progress</span>
    </td>
    <td className="px-4 py-3 text-right">
    <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
    </td>
    </tr>
    <tr className="hover:bg-surface-container-low cursor-pointer transition-colors bg-surface-bright">
    <td className="px-4 py-3 font-tabular-nums text-on-surface-variant">SR-2023-095</td>
    <td className="px-4 py-3 font-tabular-nums font-medium text-on-surface">P-3012</td>
    <td className="px-4 py-3 text-on-surface-variant">Encroachment</td>
    <td className="px-4 py-3">
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-md text-[10px] uppercase">
    <span className="w-1.5 h-1.5 rounded-full bg-error"></span> High
                                    </span>
    </td>
    <td className="px-4 py-3 text-on-surface">K. Singh (T-Gamma)</td>
    <td className="px-4 py-3">
    <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-surface-variant text-on-surface-variant font-label-md text-[10px] uppercase">Assigned</span>
    </td>
    <td className="px-4 py-3 text-right">
    <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
    </td>
    </tr>
    <tr className="hover:bg-surface-container-low cursor-pointer transition-colors">
    <td className="px-4 py-3 font-tabular-nums text-on-surface-variant">SR-2023-098</td>
    <td className="px-4 py-3 font-tabular-nums font-medium text-on-surface">P-0881</td>
    <td className="px-4 py-3 text-on-surface-variant">Routine Audit</td>
    <td className="px-4 py-3">
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-md text-[10px] uppercase">
                                         Low
                                    </span>
    </td>
    <td className="px-4 py-3 text-on-surface">Unassigned</td>
    <td className="px-4 py-3">
    <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-surface-container-high text-on-surface-variant font-label-md text-[10px] uppercase">Pending</span>
    </td>
    <td className="px-4 py-3 text-right">
    <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
    </td>
    </tr>
    </tbody>
    </table>
    </div>
    </div>

    <div className="w-full xl:w-[420px] bg-surface-container-lowest rounded-xl shadow-md flex flex-col overflow-hidden relative">
    <div className="p-4 bg-primary text-on-primary flex justify-between items-center z-10 relative">
    <div>
    <div className="font-label-md text-label-md text-primary-fixed opacity-80 uppercase tracking-widest mb-1">Active Context</div>
    <h3 className="font-headline-md text-headline-md">Parcel P-1024</h3>
    </div>
    <span className="bg-error text-on-error px-2 py-1 rounded font-label-md text-[10px] uppercase animate-pulse">Dispute</span>
    </div>
    <div className="flex-1 overflow-y-auto bg-surface-bright relative z-0">

    <div className="h-48 relative w-full mb-4">
    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600')" }}></div>
    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
    <div className="absolute bottom-2 left-2 right-2 bg-surface/90 backdrop-blur-sm p-2 rounded shadow-sm border border-outline-variant flex justify-between text-[11px] font-tabular-nums text-on-surface">
    <span>Lat: 28.6139° N</span>
    <span>Lng: 77.2090° E</span>
    </div>
    </div>
    <div className="px-4 space-y-5 pb-6">

    <div className="bg-surface-container p-3 rounded-lg border border-outline-variant">
    <h4 className="font-label-md text-label-md text-on-surface-variant uppercase mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">compare_arrows</span> Variance Analysis</h4>
    <div className="grid grid-cols-2 gap-4">
    <div>
    <div className="text-[10px] uppercase text-on-surface-variant mb-1 font-label-md">GIS Record</div>
    <div className="font-tabular-nums text-lg text-on-surface bg-surface p-2 rounded text-center border border-outline-variant/50">2.45 Ha</div>
    </div>
    <div>
    <div className="text-[10px] uppercase text-primary mb-1 font-label-md">Field Measure</div>
    <div className="font-tabular-nums text-lg text-primary bg-primary-fixed p-2 rounded text-center font-semibold">2.33 Ha</div>
    </div>
    </div>
    <div className="mt-3 flex items-center justify-between bg-error-container/30 px-3 py-2 rounded text-on-error-container font-label-md text-[11px]">
    <span>Delta</span>
    <span className="text-error">-0.12 Ha (Beyond Tolerance)</span>
    </div>
    </div>

    <div>
    <h4 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">document_scanner</span> Field Notes (OCR)</h4>
    <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant text-sm font-body-sm text-on-surface-variant italic relative">
    <span className="material-symbols-outlined absolute top-2 right-2 text-surface-tint opacity-20 text-3xl">format_quote</span>
                                "Neighboring fence line observed approx 4 meters within recorded P-1024 boundary on eastern edge. Concrete pillars suggest recent placement. Requesting historical alignment overlay."
                                <div className="mt-2 text-[10px] not-italic font-tabular-nums text-primary">Uploaded by R. Sharma • 14:32 Today</div>
    </div>
    </div>
    </div>
    </div>

    <div className="p-4 bg-surface-container-lowest border-t border-outline-variant flex flex-col gap-2 z-10">
    <button className="w-full bg-primary text-on-primary font-label-md py-2.5 rounded shadow-sm hover:shadow-md transition-all">Reconcile Observations</button>
    <button className="w-full bg-surface text-primary border border-outline-variant font-label-md py-2.5 rounded hover:bg-surface-variant transition-all">Generate Survey Report</button>
    </div>
    </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
    <h4 className="font-label-md text-label-md text-on-surface-variant uppercase mb-3 border-b border-outline-variant/30 pb-2">Active Field Teams</h4>
    <div className="space-y-3">
    <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-label-md">RS</div>
    <div>
    <div className="font-label-md text-sm text-on-surface">R. Sharma (Team Alpha)</div>
    <div className="text-[11px] text-on-surface-variant">P-1024 • Boundary Dispute</div>
    </div>
    </div>
    <span className="flex items-center gap-1 text-[11px] font-label-md text-primary bg-primary-fixed/50 px-2 py-1 rounded-full"><span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span> Active</span>
    </div>
    <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-md">MP</div>
    <div>
    <div className="font-label-md text-sm text-on-surface">M. Patel (Team Beta)</div>
    <div className="text-[11px] text-on-surface-variant">In Transit to P-2155</div>
    </div>
    </div>
    <span className="flex items-center gap-1 text-[11px] font-label-md text-on-surface-variant bg-surface-variant px-2 py-1 rounded-full"><span className="w-1.5 h-1.5 bg-outline rounded-full"></span> Moving</span>
    </div>
    </div>
    </div>
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
    <h4 className="font-label-md text-label-md text-on-surface-variant uppercase mb-3 border-b border-outline-variant/30 pb-2">Equipment Telemetry</h4>
    <div className="space-y-3">
    <div className="flex flex-col gap-1">
    <div className="flex justify-between items-center text-sm">
    <span className="font-label-md text-on-surface">DJI Matrice 300 RTK (Drone-1)</span>
    <span className="font-tabular-nums text-xs text-primary">84% Battery</span>
    </div>
    <div className="w-full bg-surface-variant rounded-full h-1">
    <div className="bg-primary h-1 rounded-full" style={{width: '84%'}}></div>
    </div>
    <div className="text-[10px] text-on-surface-variant">Assigned to: Team Alpha • Calibrated</div>
    </div>
    <div className="flex flex-col gap-1 mt-2">
    <div className="flex justify-between items-center text-sm">
    <span className="font-label-md text-on-surface">Leica TS16 (Total Station-3)</span>
    <span className="font-tabular-nums text-xs text-error">12% Battery</span>
    </div>
    <div className="w-full bg-surface-variant rounded-full h-1">
    <div className="bg-error h-1 rounded-full" style={{width: '12%'}}></div>
    </div>
    <div className="text-[10px] text-on-surface-variant">Assigned to: Team Beta • Recalibration Due: 2 days</div>
    </div>
    </div>
    </div>
    </div>
    </div></div></main>
  );
}
