export default function OfficerPerformance() {
  return (
    <main className="pt-16 min-h-screen bg-surface"><div className="flex flex-col w-full h-full relative overflow-hidden bg-background">
    <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-gradient-radial from-primary/5 via-primary-fixed/5 to-transparent blur-[120px] rounded-full pointer-events-none mix-blend-multiply"></div>
    <div className="absolute top-[40%] -left-[15%] w-[40%] h-[40%] bg-gradient-radial from-tertiary-fixed/5 via-tertiary-fixed-dim/5 to-transparent blur-[100px] rounded-full pointer-events-none mix-blend-multiply"></div>
    <div className="px-8 py-10 w-full max-w-7xl mx-auto relative z-10 flex-1 flex flex-col">
    <div className="flex items-end justify-between mb-8">
    <div>
    <div className="flex items-center gap-3 mb-2">
    <div className="w-1 h-6 bg-primary rounded-full"></div>
    <p className="font-label-md text-label-md tracking-[0.15em] text-on-surface-variant uppercase">Performance Analytics</p>
    </div>
    <h1 className="font-display text-display text-on-surface">Revenue Officer Oversight</h1>
    </div>
    <div className="flex gap-4">
    <button className="h-10 px-6 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-2 hover:bg-surface-container-high transition-colors shadow-sm">
    <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filter Region
            </button>
    <button className="h-10 px-6 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-md">
    <span className="material-symbols-outlined text-[18px]">download</span>
              Export Report
            </button>
    </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col relative overflow-hidden group">
    <div className="absolute top-0 left-0 w-1 h-full bg-primary group-hover:w-2 transition-all duration-300"></div>
    <div className="flex justify-between items-start mb-4 pl-2">
    <p className="font-label-md text-label-md text-on-surface-variant">Active Officers</p>
    <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
    <span className="material-symbols-outlined text-[18px]">badge</span>
    </div>
    </div>
    <div className="pl-2">
    <p className="font-display text-[32px] leading-tight font-bold text-on-surface">42</p>
    <div className="flex items-center gap-2 mt-2">
    <span className="flex items-center text-[11px] font-bold text-[#166534] bg-[#dcfce7] px-2 py-0.5 rounded-full">
    <span className="material-symbols-outlined text-[12px] mr-1">trending_up</span>+3
                </span>
    <span className="font-body-sm text-body-sm text-on-surface-variant">vs last month</span>
    </div>
    </div>
    </div>
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col relative overflow-hidden group">
    <div className="absolute top-0 left-0 w-1 h-full bg-tertiary-container group-hover:w-2 transition-all duration-300"></div>
    <div className="flex justify-between items-start mb-4 pl-2">
    <p className="font-label-md text-label-md text-on-surface-variant">Avg. Resolution Time</p>
    <div className="w-8 h-8 rounded-full bg-tertiary-container/10 flex items-center justify-center text-tertiary-container">
    <span className="material-symbols-outlined text-[18px]">schedule</span>
    </div>
    </div>
    <div className="pl-2">
    <p className="font-display text-[32px] leading-tight font-bold text-on-surface">14.2<span className="text-[18px] text-on-surface-variant font-medium ml-1">days</span></p>
    <div className="flex items-center gap-2 mt-2">
    <span className="flex items-center text-[11px] font-bold text-[#166534] bg-[#dcfce7] px-2 py-0.5 rounded-full">
    <span className="material-symbols-outlined text-[12px] mr-1">trending_down</span>-1.5 days
                </span>
    <span className="font-body-sm text-body-sm text-on-surface-variant">district target: 15</span>
    </div>
    </div>
    </div>
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col relative overflow-hidden group">
    <div className="absolute top-0 left-0 w-1 h-full bg-error group-hover:w-2 transition-all duration-300"></div>
    <div className="flex justify-between items-start mb-4 pl-2">
    <p className="font-label-md text-label-md text-on-surface-variant">Cases Flagged</p>
    <div className="w-8 h-8 rounded-full bg-error-container/30 flex items-center justify-center text-error">
    <span className="material-symbols-outlined text-[18px]">warning</span>
    </div>
    </div>
    <div className="pl-2">
    <p className="font-display text-[32px] leading-tight font-bold text-on-surface">128</p>
    <div className="flex items-center gap-2 mt-2">
    <span className="flex items-center text-[11px] font-bold text-error bg-error-container px-2 py-0.5 rounded-full">
    <span className="material-symbols-outlined text-[12px] mr-1">trending_up</span>+12%
                </span>
    <span className="font-body-sm text-body-sm text-on-surface-variant">requiring escalation</span>
    </div>
    </div>
    </div>
    </div>
    <div className="flex-1 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col min-h-0">
    <div className="px-6 py-4 flex items-center justify-between border-b border-surface-variant bg-surface-container-lowest rounded-t-xl z-10 sticky top-0">
    <div className="flex gap-6">
    <button className="font-label-md text-label-md text-primary border-b-2 border-primary pb-1">All Officers (42)</button>
    <button className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors pb-1">Needs Attention (8)</button>
    <button className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors pb-1">Top Performers (5)</button>
    </div>
    <div className="relative">
    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
    <input className="pl-10 pr-4 py-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface w-64 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant transition-shadow" placeholder="Search ID or Name..." type="text" />
    </div>
    </div>
    <div className="overflow-auto flex-1">
    <table className="w-full text-left border-collapse">
    <thead className="bg-surface-container-low sticky top-0 z-10">
    <tr>
    <th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider w-16">Status</th>
    <th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Officer ID / Name</th>
    <th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tehsil Jurisdiction</th>
    <th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Assigned Cases</th>
    <th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Resolution Rate</th>
    <th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
    </tr>
    </thead>
    <tbody className="font-body-md text-body-md">
    <tr className="hover:bg-surface-container/50 transition-colors group">
    <td className="py-4 px-6 border-b border-surface-variant align-middle">
    <div className="w-3 h-3 rounded-full bg-[#166534] shadow-[0_0_8px_rgba(22,101,52,0.4)] m-auto" title="On Track"></div>
    </td>
    <td className="py-4 px-6 border-b border-surface-variant">
    <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden relative">
    <img alt="Avatar" className="w-full h-full object-cover mix-blend-luminosity opacity-80" data-alt="A professional headshot of a middle-aged male Indian government revenue officer in formal attire. Corporate lighting, neutral grey background, high resolution." src="/src/assets/logo.jpeg" />
    </div>
    <div>
    <p className="font-bold text-on-surface">RO-018</p>
    <p className="text-[12px] text-on-surface-variant">Amit Sharma</p>
    </div>
    </div>
    </td>
    <td className="py-4 px-6 border-b border-surface-variant">
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary-container/50 text-on-secondary-container text-xs font-semibold">
    <span className="material-symbols-outlined text-[14px]">map</span>Loni
                    </span>
    </td>
    <td className="py-4 px-6 border-b border-surface-variant text-right font-tabular-nums text-tabular-nums text-on-surface font-medium">
                    450
                  </td>
    <td className="py-4 px-6 border-b border-surface-variant">
    <div className="flex items-center gap-3">
    <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
    <div className="h-full bg-[#166534] rounded-full" style={{width: '88%'}}></div>
    </div>
    <span className="font-tabular-nums text-tabular-nums font-bold text-on-surface w-10 text-right">88%</span>
    </div>
    </td>
    <td className="py-4 px-6 border-b border-surface-variant text-right">
    <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-container/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
    </button>
    </td>
    </tr>
    <tr className="hover:bg-error-container/10 transition-colors group bg-error-container/5">
    <td className="py-4 px-6 border-b border-surface-variant align-middle">
    <div className="w-3 h-3 rounded-full bg-error shadow-[0_0_8px_rgba(186,26,26,0.4)] m-auto animate-pulse" title="Needs Attention"></div>
    </td>
    <td className="py-4 px-6 border-b border-surface-variant">
    <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden relative">
    <img alt="Avatar" className="w-full h-full object-cover mix-blend-luminosity opacity-80" data-alt="A professional headshot of a younger female Indian government revenue officer in business casual attire. Studio lighting, warm neutral background, high resolution." src="/src/assets/logo.jpeg" />
    </div>
    <div>
    <p className="font-bold text-error">RO-024</p>
    <p className="text-[12px] text-on-surface-variant">Priya Patel</p>
    </div>
    </div>
    </td>
    <td className="py-4 px-6 border-b border-surface-variant">
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary-container/50 text-on-secondary-container text-xs font-semibold">
    <span className="material-symbols-outlined text-[14px]">map</span>Ghaziabad Sadar
                    </span>
    </td>
    <td className="py-4 px-6 border-b border-surface-variant text-right font-tabular-nums text-tabular-nums text-on-surface font-medium">
                    612
                  </td>
    <td className="py-4 px-6 border-b border-surface-variant">
    <div className="flex items-center gap-3">
    <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
    <div className="h-full bg-error rounded-full" style={{width: '42%'}}></div>
    </div>
    <span className="font-tabular-nums text-tabular-nums font-bold text-error w-10 text-right">42%</span>
    </div>
    <p className="text-[10px] text-error mt-1 font-medium tracking-wide uppercase">High Backlog Alert</p>
    </td>
    <td className="py-4 px-6 border-b border-surface-variant text-right">
    <button className="p-2 text-error hover:bg-error-container/30 rounded-full transition-colors">
    <span className="material-symbols-outlined text-[20px]">assignment_late</span>
    </button>
    </td>
    </tr>
    <tr className="hover:bg-surface-container/50 transition-colors group">
    <td className="py-4 px-6 border-b border-surface-variant align-middle">
    <div className="w-3 h-3 rounded-full bg-[#166534] shadow-[0_0_8px_rgba(22,101,52,0.4)] m-auto" title="On Track"></div>
    </td>
    <td className="py-4 px-6 border-b border-surface-variant">
    <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-sm shadow-sm">
                        RK
                      </div>
    <div>
    <p className="font-bold text-on-surface">RO-007</p>
    <p className="text-[12px] text-on-surface-variant">Rajesh Kumar</p>
    </div>
    </div>
    </td>
    <td className="py-4 px-6 border-b border-surface-variant">
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary-container/50 text-on-secondary-container text-xs font-semibold">
    <span className="material-symbols-outlined text-[14px]">map</span>Modinagar
                    </span>
    </td>
    <td className="py-4 px-6 border-b border-surface-variant text-right font-tabular-nums text-tabular-nums text-on-surface font-medium">
                    280
                  </td>
    <td className="py-4 px-6 border-b border-surface-variant">
    <div className="flex items-center gap-3">
    <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
    <div className="h-full bg-[#166534] rounded-full" style={{width: '95%'}}></div>
    </div>
    <span className="font-tabular-nums text-tabular-nums font-bold text-on-surface w-10 text-right">95%</span>
    </div>
    </td>
    <td className="py-4 px-6 border-b border-surface-variant text-right">
    <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-container/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
    </button>
    </td>
    </tr>
    <tr className="hover:bg-surface-container/50 transition-colors group">
    <td className="py-4 px-6 border-b border-surface-variant align-middle">
    <div className="w-3 h-3 rounded-full bg-[#ca8a04] shadow-[0_0_8px_rgba(202,138,4,0.4)] m-auto" title="Warning"></div>
    </td>
    <td className="py-4 px-6 border-b border-surface-variant">
    <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-sm shadow-sm">
                        SN
                      </div>
    <div>
    <p className="font-bold text-on-surface">RO-031</p>
    <p className="text-[12px] text-on-surface-variant">Sanjay Nath</p>
    </div>
    </div>
    </td>
    <td className="py-4 px-6 border-b border-surface-variant">
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary-container/50 text-on-secondary-container text-xs font-semibold">
    <span className="material-symbols-outlined text-[14px]">map</span>Loni
                    </span>
    </td>
    <td className="py-4 px-6 border-b border-surface-variant text-right font-tabular-nums text-tabular-nums text-on-surface font-medium">
                    510
                  </td>
    <td className="py-4 px-6 border-b border-surface-variant">
    <div className="flex items-center gap-3">
    <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
    <div className="h-full bg-[#ca8a04] rounded-full" style={{width: '68%'}}></div>
    </div>
    <span className="font-tabular-nums text-tabular-nums font-bold text-on-surface w-10 text-right">68%</span>
    </div>
    </td>
    <td className="py-4 px-6 border-b border-surface-variant text-right">
    <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-container/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
    </button>
    </td>
    </tr>
    </tbody>
    </table>
    </div>
    <div className="px-6 py-3 border-t border-surface-variant flex items-center justify-between bg-surface-container-lowest rounded-b-xl">
    <p className="font-body-sm text-body-sm text-on-surface-variant">Showing 1 to 4 of 42 Officers</p>
    <div className="flex gap-1">
    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant disabled:opacity-50" disabled="">
    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
    </button>
    <button className="w-8 h-8 flex items-center justify-center rounded bg-primary-container text-on-primary-container font-medium text-sm">1</button>
    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface font-medium text-sm transition-colors">2</button>
    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface font-medium text-sm transition-colors">3</button>
    <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">...</span>
    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant transition-colors">
    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
    </button>
    </div>
    </div>
    </div>
    </div>
    </div>
    </main>
  );
}
