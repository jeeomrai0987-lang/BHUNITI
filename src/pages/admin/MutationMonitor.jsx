export default function MutationMonitor() {
  return (
    <main className="pt-16 min-h-screen bg-surface"><div className="flex flex-col w-full px-8 pb-12 gap-8">
    <div className="flex items-end justify-between pt-8">
    <div className="flex flex-col gap-2">
    <h1 className="font-display text-display text-on-surface">Mutation Funnel Analytics</h1>
    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">District-wide pipeline tracking for land transfer and ownership mutation requests. Metrics are real-time across all active Tehsils.</p>
    </div>
    <div className="flex items-center gap-4">
    <button className="bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors px-4 py-2 rounded-lg font-label-md text-label-md flex items-center gap-2">
    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            Last 30 Days
            <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
    </button>
    <button className="bg-primary text-on-primary hover:bg-primary/90 transition-colors px-4 py-2 rounded-lg font-label-md text-label-md flex items-center gap-2 shadow-md">
    <span className="material-symbols-outlined text-[20px]">download</span>
            Export Report
          </button>
    </div>
    </div>
    <div className="grid grid-cols-12 gap-6">
    <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
    <div className="bg-surface-container-lowest shadow-sm rounded-xl p-6 relative overflow-hidden">
    <div className="absolute -right-24 -top-24 w-64 h-64 bg-primary-fixed-dim/20 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>
    <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-tertiary-fixed-dim/20 rounded-full blur-2xl mix-blend-multiply pointer-events-none"></div>
    <div className="flex items-center justify-between mb-8 relative z-10">
    <h2 className="font-headline-md text-headline-md text-on-surface">Pipeline Conversion</h2>
    <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md">LIVE SYNC</span>
    </div>
    <div className="relative z-10 flex flex-col gap-4">
    <div className="flex items-center gap-6 group">
    <div className="w-32 font-label-md text-label-md text-on-surface-variant uppercase text-right">Submitted</div>
    <div className="flex-1 flex items-center">
    <div className="h-12 bg-surface-variant rounded-r-full transition-all duration-700 ease-out flex items-center px-4" style={{width: '100%'}}>
    <span className="font-tabular-nums text-headline-md text-on-surface-variant font-bold ml-auto">12,450</span>
    </div>
    </div>
    <div className="w-16 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end">
    <span className="font-label-md text-label-md text-on-surface-variant">100%</span>
    </div>
    </div>
    <div className="flex items-center gap-6 group">
    <div className="w-32 font-label-md text-label-md text-on-surface-variant uppercase text-right">Verified (L1)</div>
    <div className="flex-1 flex items-center">
    <div className="h-12 bg-primary-fixed-dim rounded-r-full transition-all duration-700 ease-out delay-100 flex items-center px-4" style={{width: '78%'}}>
    <span className="font-tabular-nums text-headline-md text-on-primary-fixed-variant font-bold ml-auto">9,711</span>
    </div>
    </div>
    <div className="w-16 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end">
    <span className="font-label-md text-label-md text-primary">78%</span>
    </div>
    </div>
    <div className="flex items-center gap-6 group">
    <div className="w-32 font-label-md text-label-md text-on-surface-variant uppercase text-right">Notice Period</div>
    <div className="flex-1 flex items-center">
    <div className="h-12 bg-primary-fixed rounded-r-full transition-all duration-700 ease-out delay-200 flex items-center px-4" style={{width: '62%'}}>
    <span className="font-tabular-nums text-headline-md text-on-primary-fixed font-bold ml-auto">7,719</span>
    </div>
    </div>
    <div className="w-16 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end">
    <span className="font-label-md text-label-md text-primary">62%</span>
    </div>
    </div>
    <div className="flex items-center gap-6 group">
    <div className="w-32 font-label-md text-label-md text-on-surface-variant uppercase text-right">Approved</div>
    <div className="flex-1 flex items-center">
    <div className="h-12 bg-tertiary-fixed rounded-r-full transition-all duration-700 ease-out delay-300 flex items-center px-4" style={{width: '55%'}}>
    <span className="font-tabular-nums text-headline-md text-on-tertiary-fixed font-bold ml-auto">6,847</span>
    </div>
    </div>
    <div className="w-16 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end">
    <span className="font-label-md text-label-md text-tertiary-container">55%</span>
    </div>
    </div>
    <div className="flex items-center gap-6 group mt-2 pt-4 border-t border-outline-variant/30">
    <div className="w-32 font-label-md text-label-md text-error uppercase text-right">Rejected</div>
    <div className="flex-1 flex items-center">
    <div className="h-8 bg-error-container rounded-r-full transition-all duration-700 ease-out delay-400 flex items-center px-4" style={{width: '12%'}}>
    <span className="font-tabular-nums text-body-md text-on-error-container font-bold ml-auto">1,494</span>
    </div>
    </div>
    <div className="w-16 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end">
    <span className="font-label-md text-label-md text-error">12%</span>
    </div>
    </div>
    </div>
    </div>
    <div className="grid grid-cols-2 gap-6">
    <div className="bg-surface-container-lowest shadow-sm rounded-xl p-6 flex flex-col justify-between">
    <div>
    <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">Avg Processing Time</h3>
    <div className="flex items-baseline gap-2">
    <span className="font-display text-display text-on-surface">4.2</span>
    <span className="font-body-lg text-body-lg text-on-surface-variant">Days</span>
    </div>
    </div>
    <div className="mt-6 flex items-center gap-2 text-primary">
    <span className="material-symbols-outlined text-[20px]">trending_down</span>
    <span className="font-label-md text-label-md">-12% from last month</span>
    </div>
    </div>
    <div className="bg-error-container text-on-error-container shadow-sm rounded-xl p-6 flex flex-col justify-between">
    <div>
    <h3 className="font-label-md text-label-md uppercase tracking-wider mb-2 opacity-80">Oldest Pending Application</h3>
    <div className="flex items-baseline gap-2">
    <span className="font-display text-display">17</span>
    <span className="font-body-lg text-body-lg opacity-80">Days</span>
    </div>
    </div>
    <div className="mt-6 flex items-center justify-between">
    <span className="font-label-md text-label-md uppercase">ID: MUT-2023-891A</span>
    <button className="bg-on-error-container text-error-container hover:bg-on-error-container/90 px-3 py-1.5 rounded font-label-md text-label-md transition-colors">
                     Escalate
                   </button>
    </div>
    </div>
    </div>
    </div>
    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
    <div className="bg-surface-container shadow-sm rounded-xl p-6 h-full flex flex-col">
    <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Mutation Types</h2>
    <div className="relative flex-1 flex flex-col items-center justify-center mb-8 min-h-[200px]">
    <svg className="w-48 h-48 -rotate-90 transform drop-shadow-md" viewBox="0 0 100 100">
    <circle className="stroke-surface-variant" cx="50" cy="50" fill="transparent" r="40" strokeWidth="20"></circle>
    <circle className="stroke-primary" cx="50" cy="50" fill="transparent" r="40" strokeDasharray="251.2" strokeDashoffset="100.48" strokeWidth="20"></circle>
    <circle className="origin-center rotate-[216deg]" cx="50" cy="50" fill="transparent" r="40" strokeDasharray="251.2" strokeDashoffset="200.96" strokeWidth="20"></circle>
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
    <span className="font-display text-headline-lg text-on-surface">12.4k</span>
    <span className="font-label-md text-label-md text-on-surface-variant uppercase">Total</span>
    </div>
    </div>
    <div className="flex flex-col gap-4 mt-auto">
    <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
    <div className="flex items-center gap-3">
    <div className="w-3 h-3 rounded-full bg-primary"></div>
    <span className="font-body-md text-body-md text-on-surface font-semibold">Sale Deed</span>
    </div>
    <div className="flex items-center gap-4">
    <span className="font-tabular-nums text-body-md text-on-surface-variant">7,470</span>
    <span className="font-label-md text-label-md text-primary w-8 text-right">60%</span>
    </div>
    </div>
    <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
    <div className="flex items-center gap-3">
    <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
    <span className="font-body-md text-body-md text-on-surface font-semibold">Inheritance</span>
    </div>
    <div className="flex items-center gap-4">
    <span className="font-tabular-nums text-body-md text-on-surface-variant">3,112</span>
    <span className="font-label-md text-label-md text-on-surface-variant w-8 text-right">25%</span>
    </div>
    </div>
    <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
    <div className="flex items-center gap-3">
    <div className="w-3 h-3 rounded-full bg-tertiary-fixed"></div>
    <span className="font-body-md text-body-md text-on-surface font-semibold">Correction</span>
    </div>
    <div className="flex items-center gap-4">
    <span className="font-tabular-nums text-body-md text-on-surface-variant">1,868</span>
    <span className="font-label-md text-label-md text-on-tertiary-fixed-variant w-8 text-right">15%</span>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </main>
  );
}
