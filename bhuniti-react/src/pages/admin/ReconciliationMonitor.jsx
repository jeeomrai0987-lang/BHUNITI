export default function ReconciliationMonitor() {
  return (
    <main className="pt-16 min-h-screen bg-surface"><div className="flex flex-col w-full h-full relative overflow-hidden bg-background">

    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-error-container/20 via-transparent to-transparent opacity-50 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-primary-container/10 via-transparent to-transparent opacity-40 blur-3xl rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none"></div>
    <div className="px-8 py-8 flex flex-col gap-8 z-10 w-full max-w-[1600px] mx-auto">

    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
    <div className="flex flex-col gap-2">
    <div className="flex items-center gap-3">
    <div className="w-1.5 h-6 bg-error rounded-full shadow-[0_0_12px_rgba(186,26,26,0.6)]"></div>
    <h1 className="font-display text-display text-on-surface">Reconciliation Monitor</h1>
    </div>
    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl pl-4">
                        Real-time monitoring of cross-system data fidelity. Current focus on elevated discrepancy rates detected between legacy land registries and satellite GIS vectors.
                    </p>
    </div>
    <div className="flex items-center gap-4 bg-surface-container rounded-xl p-2 shadow-sm">
    <div className="flex flex-col px-4 py-2 border-r border-outline-variant/30">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Sync Status</span>
    <div className="flex items-center gap-2 mt-1">
    <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
    </span>
    <span className="font-tabular-nums text-tabular-nums font-semibold text-error">Warning</span>
    </div>
    </div>
    <div className="flex flex-col px-4 py-2">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Last Run</span>
    <span className="font-tabular-nums text-tabular-nums text-on-surface mt-1">Today, 08:42 AM</span>
    </div>
    <button className="bg-primary text-on-primary hover:bg-primary/90 rounded-lg px-4 py-3 flex items-center justify-center transition-colors shadow-md ml-2 group">
    <span className="material-symbols-outlined mr-2 group-hover:-rotate-180 transition-transform duration-500">sync</span>
    <span className="font-label-md text-label-md">Force Sync</span>
    </button>
    </div>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

    <div className="xl:col-span-8 flex flex-col gap-8">

    <div className="relative bg-inverse-surface text-inverse-on-surface rounded-[24px] p-8 shadow-xl overflow-hidden group">

    <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
    <div className="absolute right-0 bottom-0 w-64 h-64 bg-error/20 blur-3xl rounded-full translate-x-1/4 translate-y-1/4 group-hover:bg-error/30 transition-colors duration-700"></div>
    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
    <div className="flex flex-col w-full md:w-1/2">
    <div className="inline-flex items-center gap-2 bg-error-container text-on-error-container rounded-full px-4 py-1.5 w-max mb-6">
    <span className="material-symbols-outlined text-[18px]">warning</span>
    <span className="font-label-md text-label-md font-bold uppercase tracking-widest">Critical Discrepancy</span>
    </div>
    <h2 className="font-headline-lg text-headline-lg text-inverse-on-surface mb-2">Land Records vs. GIS Vector</h2>
    <p className="font-body-md text-body-md text-inverse-primary opacity-90 mb-8">
                                    Spatial footprint in District GIS does not match registered boundary definitions in Bhulekh registry. Variance exceeds acceptable 2% threshold.
                                </p>
    <div className="grid grid-cols-2 gap-6 mb-4">
    <div className="flex flex-col">
    <span className="font-label-md text-label-md text-inverse-on-surface/70 uppercase">Affected Parcels</span>
    <span className="font-display text-display text-inverse-on-surface">14,289</span>
    </div>
    <div className="flex flex-col border-l border-inverse-primary/30 pl-6">
    <span className="font-label-md text-label-md text-inverse-on-surface/70 uppercase">Mismatch Rate</span>
    <div className="flex items-baseline gap-2">
    <span className="font-display text-display text-error-container">6.2%</span>
    <span className="material-symbols-outlined text-error-container text-[24px]">trending_up</span>
    </div>
    </div>
    </div>
    </div>

    <div className="w-full md:w-1/2 flex justify-center items-center relative h-48">

    <svg className="w-48 h-48 transform -rotate-90 filter drop-shadow-lg" viewBox="0 0 200 200">

    <circle className="text-inverse-primary/20" cx="100" cy="100" fill="none" r="80" stroke="currentColor" strokeWidth="24"></circle>

    <circle className="text-inverse-primary transition-all duration-1000 ease-out" cx="100" cy="100" fill="none" id="donut-match" r="80" stroke="currentColor" strokeDasharray="502" strokeDashoffset="31" strokeLinecap="round" strokeWidth="24"></circle>

    <circle className="text-error-container transition-all duration-1000 ease-out delay-500" cx="100" cy="100" fill="none" id="donut-error" r="80" stroke="currentColor" strokeDasharray="502" strokeDashoffset="471" strokeLinecap="round" strokeWidth="24" style={{transformOrigin: 'center', transform: 'rotate(337deg)'}}></circle>
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
    <span className="font-display text-display text-inverse-on-surface">93.8%</span>
    <span className="font-label-md text-label-md text-inverse-on-surface/70 uppercase">Match</span>
    </div>
    </div>
    </div>
    </div>

    <div className="bg-surface-container-lowest rounded-[20px] shadow-sm flex flex-col relative overflow-hidden">
    <div className="p-6 border-b border-surface-container flex justify-between items-center bg-surface-container-low/50">
    <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
    <span className="material-symbols-outlined">compare_arrows</span>
    </div>
    <h3 className="font-headline-md text-headline-md text-on-surface">System Pair Reconciliation Matrix</h3>
    </div>
    <button className="text-on-surface-variant hover:text-primary transition-colors">
    <span className="material-symbols-outlined">filter_list</span>
    </button>
    </div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

    <div className="bg-surface p-5 rounded-2xl flex flex-col gap-4 group hover:bg-surface-container transition-colors duration-300">
    <div className="flex justify-between items-center">
    <div className="flex items-center gap-2">
    <span className="font-label-md text-label-md font-bold text-on-surface bg-surface-container-high px-2 py-1 rounded">REGISTRY</span>
    <span className="material-symbols-outlined text-on-surface-variant text-[16px]">sync_alt</span>
    <span className="font-label-md text-label-md font-bold text-on-surface bg-surface-container-high px-2 py-1 rounded">SURVEY</span>
    </div>
    <div className="flex items-center gap-1 bg-surface-container-lowest px-2 py-1 rounded shadow-sm">
    <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
    <span className="font-tabular-nums text-tabular-nums text-[12px] font-semibold">99.1%</span>
    </div>
    </div>
    <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
    <div className="bg-[#10b981] h-2 rounded-full" style={{width: '99.1%'}}></div>
    </div>
    <div className="flex justify-between text-on-surface-variant">
    <span className="font-body-sm text-body-sm">2,104 Mismatches</span>
    <span className="font-body-sm text-body-sm text-on-surface flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer">
                                        View Audit <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
    </span>
    </div>
    </div>

    <div className="bg-surface p-5 rounded-2xl flex flex-col gap-4 group hover:bg-surface-container transition-colors duration-300">
    <div className="flex justify-between items-center">
    <div className="flex items-center gap-2">
    <span className="font-label-md text-label-md font-bold text-on-surface bg-surface-container-high px-2 py-1 rounded">SURVEY</span>
    <span className="material-symbols-outlined text-on-surface-variant text-[16px]">sync_alt</span>
    <span className="font-label-md text-label-md font-bold text-on-surface bg-surface-container-high px-2 py-1 rounded">CENSUS</span>
    </div>
    <div className="flex items-center gap-1 bg-surface-container-lowest px-2 py-1 rounded shadow-sm">
    <div className="w-2 h-2 rounded-full bg-tertiary"></div>
    <span className="font-tabular-nums text-tabular-nums text-[12px] font-semibold text-tertiary">97.4%</span>
    </div>
    </div>
    <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
    <div className="bg-tertiary h-2 rounded-full" style={{width: '97.4%'}}></div>
    </div>
    <div className="flex justify-between text-on-surface-variant">
    <span className="font-body-sm text-body-sm">8,450 Mismatches</span>
    <span className="font-body-sm text-body-sm text-on-surface flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer">
                                        View Audit <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
    </span>
    </div>
    </div>

    <div className="bg-error-container/20 p-5 rounded-2xl flex flex-col gap-4 border border-error/20 relative overflow-hidden group hover:bg-error-container/30 transition-colors duration-300 md:col-span-2">
    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-error/5 to-transparent"></div>
    <div className="flex justify-between items-center relative z-10">
    <div className="flex items-center gap-2">
    <span className="font-label-md text-label-md font-bold text-on-error-container bg-error-container px-3 py-1.5 rounded">LAND RECORDS</span>
    <span className="material-symbols-outlined text-error text-[20px]">sync_problem</span>
    <span className="font-label-md text-label-md font-bold text-on-error-container bg-error-container px-3 py-1.5 rounded">GIS DB</span>
    </div>
    <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-md border border-error/20">
    <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
    </span>
    <span className="font-tabular-nums text-tabular-nums text-[14px] font-bold text-error">93.8%</span>
    </div>
    </div>
    <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden relative z-10">
    <div className="bg-error h-3 rounded-full relative" style={{width: '93.8%'}}>
    <div className="absolute inset-0 bg-white/20" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)'}}></div>
    </div>
    </div>
    <div className="flex justify-between text-on-surface-variant relative z-10">
    <span className="font-body-sm text-body-sm font-semibold text-on-error-container flex items-center gap-1">
    <span className="material-symbols-outlined text-[16px]">error</span> 14,289 Mismatches (Requires Intervention)
                                    </span>
    <span className="font-body-sm text-body-sm text-error font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer">
                                        Resolve Discrepancies <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
    </span>
    </div>
    </div>
    </div>
    </div>
    </div>

    <div className="xl:col-span-4 flex flex-col gap-8">

    <div className="bg-surface-container-lowest rounded-[20px] shadow-sm flex flex-col overflow-hidden h-[300px] relative group">
    <div className="absolute top-4 left-4 z-20 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-outline-variant flex items-center gap-2">
    <span className="material-symbols-outlined text-primary text-[18px]">satellite_alt</span>
    <span className="font-label-md text-label-md text-on-surface">HOTSPOT: TEHSIL LONI</span>
    </div>

    <div className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600')" }}></div>
    <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
    <button className="w-10 h-10 bg-surface text-on-surface rounded-full shadow-lg flex items-center justify-center hover:bg-surface-container transition-colors">
    <span className="material-symbols-outlined">add</span>
    </button>
    <button className="w-10 h-10 bg-surface text-on-surface rounded-full shadow-lg flex items-center justify-center hover:bg-surface-container transition-colors">
    <span className="material-symbols-outlined">remove</span>
    </button>
    </div>
    </div>

    <div className="bg-surface-container-lowest rounded-[20px] shadow-sm flex flex-col flex-1 overflow-hidden">
    <div className="p-5 border-b border-surface-container flex justify-between items-center bg-primary-container text-on-primary-container">
    <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-[20px]">smart_toy</span>
    <h3 className="font-headline-md text-headline-md text-on-primary-container text-[16px]">AI Flagged Anomalies</h3>
    </div>
    <span className="bg-on-primary-container/20 text-on-primary-container px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">Live</span>
    </div>
    <div className="flex-1 overflow-y-auto max-h-[500px]">
    <ul className="flex flex-col">

    <li className="p-5 border-b border-surface-container hover:bg-surface-container-low transition-colors group cursor-pointer relative overflow-hidden">
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-error opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="flex justify-between items-start mb-2">
    <div className="flex items-center gap-2">
    <span className="font-tabular-nums text-tabular-nums text-on-surface font-bold">ULPIN: 09-087-0034-11</span>
    </div>
    <span className="font-tabular-nums text-tabular-nums text-[11px] text-on-surface-variant">2m ago</span>
    </div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 leading-relaxed">
                                        Area discrepancy. Registry states 1.4 HA. GIS polygon measures 1.9 HA. Possible encroachment or subdivision mapping failure.
                                    </p>
    <div className="flex items-center justify-between">
    <div className="flex gap-2">
    <span className="bg-error-container text-on-error-container text-[10px] px-2 py-1 rounded font-bold uppercase">High Risk</span>
    <span className="bg-surface-container text-on-surface text-[10px] px-2 py-1 rounded font-bold uppercase">Boundary</span>
    </div>
    <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
    </button>
    </div>
    </li>

    <li className="p-5 border-b border-surface-container hover:bg-surface-container-low transition-colors group cursor-pointer relative overflow-hidden">
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="flex justify-between items-start mb-2">
    <div className="flex items-center gap-2">
    <span className="font-tabular-nums text-tabular-nums text-on-surface font-bold">ULPIN: 09-087-0192-44</span>
    </div>
    <span className="font-tabular-nums text-tabular-nums text-[11px] text-on-surface-variant">14m ago</span>
    </div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 leading-relaxed">
                                        Ownership null value in GIS attributes. Registry indicates joint ownership (3 parties).
                                    </p>
    <div className="flex items-center justify-between">
    <div className="flex gap-2">
    <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] px-2 py-1 rounded font-bold uppercase">Medium Risk</span>
    <span className="bg-surface-container text-on-surface text-[10px] px-2 py-1 rounded font-bold uppercase">Attribute</span>
    </div>
    <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
    </button>
    </div>
    </li>

    <li className="p-5 border-b border-surface-container hover:bg-surface-container-low transition-colors group cursor-pointer relative overflow-hidden bg-surface-variant/30">
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="flex justify-between items-start mb-2">
    <div className="flex items-center gap-2">
    <span className="font-tabular-nums text-tabular-nums text-on-surface font-bold">ULPIN: MULTIPLE (32)</span>
    </div>
    <span className="font-tabular-nums text-tabular-nums text-[11px] text-on-surface-variant">1h ago</span>
    </div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 leading-relaxed">
                                        Cluster geometry shift detected in Village Modinagar. Polygons translated ~4m East compared to historical survey baselines.
                                    </p>
    <div className="flex items-center justify-between">
    <div className="flex gap-2">
    <span className="bg-error-container text-on-error-container text-[10px] px-2 py-1 rounded font-bold uppercase">Systemic</span>
    <span className="bg-surface-container text-on-surface text-[10px] px-2 py-1 rounded font-bold uppercase">Spatial</span>
    </div>
    <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
    </button>
    </div>
    </li>

    <li className="p-5 hover:bg-surface-container-low transition-colors group cursor-pointer relative overflow-hidden">
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="flex justify-between items-start mb-2">
    <div className="flex items-center gap-2">
    <span className="font-tabular-nums text-tabular-nums text-on-surface font-bold">ULPIN: 09-087-0551-02</span>
    </div>
    <span className="font-tabular-nums text-tabular-nums text-[11px] text-on-surface-variant">2h ago</span>
    </div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 leading-relaxed">
                                        Land use category mismatch. Registry: Agricultural. GIS: Built-up/Commercial. Field verification recommended.
                                    </p>
    <div className="flex items-center justify-between">
    <div className="flex gap-2">
    <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] px-2 py-1 rounded font-bold uppercase">Medium Risk</span>
    <span className="bg-surface-container text-on-surface text-[10px] px-2 py-1 rounded font-bold uppercase">Classification</span>
    </div>
    <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
    </button>
    </div>
    </li>
    </ul>
    </div>
    <div className="p-3 bg-surface-container text-center border-t border-outline-variant/20">
    <button className="text-label-md font-label-md text-primary hover:underline">View Full AI Audit Log</button>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </main>
  );
}
