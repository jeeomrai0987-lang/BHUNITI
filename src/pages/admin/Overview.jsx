export default function AdminOverview() {
  return (
    <main className="pt-16 min-h-screen bg-surface"><div className="flex flex-col w-full p-4 md:p-8 space-y-8 bg-surface text-on-surface">
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full relative z-10">
    <div className="flex flex-col max-w-3xl space-y-2">
    <div className="flex items-center gap-2 mb-2">
    <span className="inline-flex items-center justify-center bg-primary text-on-primary rounded-full px-3 py-1 font-label-md tracking-wider uppercase shadow-md">
                Ghaziabad
             </span>
    <span className="text-on-surface-variant font-label-md tracking-wide uppercase">Command Center</span>
    </div>
    <h1 className="font-display text-4xl md:text-5xl text-on-surface leading-tight relative inline-block">
            District Land Governance Command Center
            <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
    </h1>
    <p className="font-body-lg text-on-surface-variant pt-4">District-wide monitoring, data quality and land administration overview</p>
    </div>
    <div className="flex items-center gap-3">
    <button className="bg-surface-container text-on-surface px-4 py-2 rounded-lg shadow-sm hover:bg-surface-container-high transition-colors flex items-center gap-2 font-label-md">
    <span className="material-symbols-outlined text-[20px]">file_download</span> Export Report
            </button>
    <button className="bg-primary text-on-primary px-5 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-transform hover:-translate-y-0.5 flex items-center gap-2 font-label-md">
    <span className="material-symbols-outlined text-[20px]">sync</span> Force Sync
            </button>
    </div>
    </header>

    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">

    <div className="bg-surface-container rounded-xl p-5 shadow-sm relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
    <span className="material-symbols-outlined text-[64px]">landscape</span>
    </div>
    <p className="font-label-md text-on-surface-variant uppercase mb-2 relative z-10">Total Parcels</p>
    <div className="flex items-baseline gap-2 relative z-10">
    <span className="font-display text-3xl text-on-surface">1,24,580</span>
    </div>
    <div className="mt-4 relative z-10 h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
    <div className="h-full bg-primary w-full rounded-full"></div>
    </div>
    </div>

    <div className="bg-surface-container rounded-xl p-5 shadow-sm relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-secondary">
    <span className="material-symbols-outlined text-[64px]">verified</span>
    </div>
    <p className="font-label-md text-on-surface-variant uppercase mb-2 relative z-10">Verified Parcels</p>
    <div className="flex items-baseline gap-2 relative z-10">
    <span className="font-display text-3xl text-on-surface">1,16,820</span>
    <span className="font-body-sm text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">93.8%</span>
    </div>
    <div className="mt-4 relative z-10 h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
    <div className="h-full bg-secondary w-[93.8%] rounded-full"></div>
    </div>
    </div>

    <div className="bg-error-container text-on-error-container rounded-xl p-5 shadow-sm relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
    <span className="material-symbols-outlined text-[64px]">error_outline</span>
    </div>
    <p className="font-label-md text-on-error-container/80 uppercase mb-2 relative z-10">Open Discrepancies</p>
    <div className="flex flex-col gap-1 relative z-10">
    <div className="flex items-baseline gap-2">
    <span className="font-display text-3xl">1,842</span>
    </div>
    <div className="flex items-center gap-1 text-error text-sm font-label-md">
    <span className="material-symbols-outlined text-[16px] text-error" style={{fontVariationSettings: '\'FILL\' 1'}}>priority_high</span>
    <span>126 High Priority</span>
    </div>
    </div>
    </div>

    <div className="bg-tertiary-container text-on-tertiary-container rounded-xl p-5 shadow-sm relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
    <span className="material-symbols-outlined text-[64px]">history_edu</span>
    </div>
    <p className="font-label-md text-on-tertiary-container/80 uppercase mb-2 relative z-10">Pending Mutations</p>
    <div className="flex items-baseline gap-2 relative z-10">
    <span className="font-display text-3xl">2,416</span>
    </div>
    <div className="mt-4 flex gap-2 relative z-10">
    <span className="text-xs font-label-md bg-on-tertiary-container/10 px-2 py-1 rounded">284 FIELD SURVEYS</span>
    </div>
    </div>
    </section>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full mt-4 items-start">

    <div className="xl:col-span-8 flex flex-col space-y-8">

    <section className="bg-surface-container rounded-2xl shadow-md overflow-hidden flex flex-col h-[600px] relative">
    <div className="p-4 bg-surface/90 backdrop-blur-md z-20 flex justify-between items-center relative shadow-sm">
    <div className="flex items-center gap-3">
    <span className="material-symbols-outlined text-primary bg-primary-container p-2 rounded-lg">map</span>
    <div>
    <h3 className="font-headline-md text-on-surface leading-tight">Discrepancy Hotspots</h3>
    <p className="font-body-sm text-on-surface-variant">Real-time geospatial reconciliation data</p>
    </div>
    </div>
    <div className="flex gap-2 bg-surface-container-low p-1 rounded-lg">
    <button className="px-3 py-1.5 rounded-md bg-surface shadow-sm text-on-surface font-label-md text-xs">Heatmap</button>
    <button className="px-3 py-1.5 rounded-md text-on-surface-variant hover:bg-surface/50 font-label-md text-xs transition-colors">Parcels</button>
    <button className="px-3 py-1.5 rounded-md text-on-surface-variant hover:bg-surface/50 font-label-md text-xs transition-colors">Satellite</button>
    </div>
    </div>
    <div className="flex-1 w-full relative">

    <div className="absolute inset-0 bg-cover bg-center w-full h-full" data-location="Ghaziabad District, Uttar Pradesh" style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuDsOhYV_T2NerqCsLT25TBJK9XcvfgJKozpSLLKRW8i7Pt5M4yRD1PvC86jRWgAtGRcDzIKzGr3UmcskZRjAcijUkI1bq-Y1Wvo1R53_TweF2QURG80YXbHIvHxiNeZEQSB2NWlszoAPOkO8nFC0FrOW7Zk5_9x-REwq-oNJ8gyIgm0kaYInN40FVV-1F1kG8QYz0LdcnIqZv9XMXiKqL09SSmIw0CKOjfJMv49agVHPvrvSuelYk8\')'}}></div>

    <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
    <button className="w-10 h-10 bg-surface/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-on-surface hover:text-primary hover:-translate-y-0.5 transition-all">
    <span className="material-symbols-outlined">add</span>
    </button>
    <button className="w-10 h-10 bg-surface/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-on-surface hover:text-primary hover:-translate-y-0.5 transition-all">
    <span className="material-symbols-outlined">remove</span>
    </button>
    <button className="w-10 h-10 bg-surface/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-on-surface mt-2 hover:text-primary hover:-translate-y-0.5 transition-all">
    <span className="material-symbols-outlined">my_location</span>
    </button>
    </div>

    <div className="absolute bottom-6 left-6 bg-surface/90 backdrop-blur-md p-4 rounded-xl shadow-lg z-20 min-w-[200px]">
    <h4 className="font-label-md uppercase text-on-surface-variant mb-3">Hotspot Density</h4>
    <div className="space-y-2">
    <div className="flex items-center gap-3">
    <div className="w-4 h-4 rounded-full bg-error"></div>
    <span className="font-body-sm text-on-surface">Critical (&gt;500)</span>
    </div>
    <div className="flex items-center gap-3">
    <div className="w-4 h-4 rounded-full bg-tertiary"></div>
    <span className="font-body-sm text-on-surface">Amber (100-500)</span>
    </div>
    <div className="flex items-center gap-3">
    <div className="w-4 h-4 rounded-full bg-secondary"></div>
    <span className="font-body-sm text-on-surface">Low (&lt;100)</span>
    </div>
    </div>
    </div>
    </div>
    </section>

    <section className="bg-surface-container rounded-2xl shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
    <h3 className="font-headline-md text-on-surface flex items-center gap-2">
    <span className="material-symbols-outlined text-secondary">table_view</span>
                    Tehsil-wise Performance
                </h3>
    <button className="text-primary hover:bg-primary-container px-3 py-1.5 rounded-lg transition-colors font-label-md">View All</button>
    </div>
    <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
    <thead>
    <tr className="border-b-2 border-surface-variant font-label-md text-on-surface-variant">
    <th className="pb-3 pl-2 font-semibold">Tehsil</th>
    <th className="pb-3 font-semibold">Verification %</th>
    <th className="pb-3 font-semibold text-right">Discrepancies</th>
    <th className="pb-3 font-semibold pl-4">Data Quality</th>
    <th className="pb-3 font-semibold text-center">Action</th>
    </tr>
    </thead>
    <tbody className="font-tabular-nums text-on-surface">
    <tr className="border-b border-surface-variant hover:bg-surface-container-high transition-colors group">
    <td className="py-4 pl-2 font-body-md font-medium flex items-center gap-2">
                                Ghaziabad <span className="material-symbols-outlined text-[14px] text-secondary opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
    </td>
    <td className="py-4">
    <div className="flex items-center gap-2">
    <span>96.2%</span>
    <div className="w-16 h-1.5 bg-surface-variant rounded-full"><div className="h-full bg-secondary rounded-full w-[96.2%]"></div></div>
    </div>
    </td>
    <td className="py-4 text-right">312</td>
    <td className="py-4 pl-4"><span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-xs font-label-md"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Optimal</span></td>
    <td className="py-4 text-center"><button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button></td>
    </tr>
    <tr className="border-b border-surface-variant hover:bg-surface-container-high transition-colors group">
    <td className="py-4 pl-2 font-body-md font-medium flex items-center gap-2">
                                Loni <span className="material-symbols-outlined text-[14px] text-secondary opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
    </td>
    <td className="py-4">
    <div className="flex items-center gap-2">
    <span>88.4%</span>
    <div className="w-16 h-1.5 bg-surface-variant rounded-full"><div className="h-full bg-error rounded-full w-[88.4%]"></div></div>
    </div>
    </td>
    <td className="py-4 text-right font-semibold text-error">845</td>
    <td className="py-4 pl-4"><span className="inline-flex items-center gap-1 bg-error-container text-on-error-container px-2.5 py-1 rounded-full text-xs font-label-md"><span className="w-1.5 h-1.5 rounded-full bg-error"></span> Attention</span></td>
    <td className="py-4 text-center"><button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button></td>
    </tr>
    <tr className="border-b border-surface-variant hover:bg-surface-container-high transition-colors group">
    <td className="py-4 pl-2 font-body-md font-medium flex items-center gap-2">
                                Modinagar <span className="material-symbols-outlined text-[14px] text-secondary opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
    </td>
    <td className="py-4">
    <div className="flex items-center gap-2">
    <span>94.1%</span>
    <div className="w-16 h-1.5 bg-surface-variant rounded-full"><div className="h-full bg-secondary rounded-full w-[94.1%]"></div></div>
    </div>
    </td>
    <td className="py-4 text-right">412</td>
    <td className="py-4 pl-4"><span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-xs font-label-md"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Optimal</span></td>
    <td className="py-4 text-center"><button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button></td>
    </tr>
    <tr className="border-b border-surface-variant hover:bg-surface-container-high transition-colors group">
    <td className="py-4 pl-2 font-body-md font-medium flex items-center gap-2">
                                Muradnagar <span className="material-symbols-outlined text-[14px] text-secondary opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
    </td>
    <td className="py-4">
    <div className="flex items-center gap-2">
    <span>95.8%</span>
    <div className="w-16 h-1.5 bg-surface-variant rounded-full"><div className="h-full bg-secondary rounded-full w-[95.8%]"></div></div>
    </div>
    </td>
    <td className="py-4 text-right">158</td>
    <td className="py-4 pl-4"><span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-xs font-label-md"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Optimal</span></td>
    <td className="py-4 text-center"><button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button></td>
    </tr>
    <tr className="hover:bg-surface-container-high transition-colors group">
    <td className="py-4 pl-2 font-body-md font-medium flex items-center gap-2">
                                Dasna <span className="material-symbols-outlined text-[14px] text-secondary opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
    </td>
    <td className="py-4">
    <div className="flex items-center gap-2">
    <span>91.2%</span>
    <div className="w-16 h-1.5 bg-surface-variant rounded-full"><div className="h-full bg-tertiary rounded-full w-[91.2%]"></div></div>
    </div>
    </td>
    <td className="py-4 text-right font-semibold text-tertiary">115</td>
    <td className="py-4 pl-4"><span className="inline-flex items-center gap-1 bg-tertiary-container text-on-tertiary-container px-2.5 py-1 rounded-full text-xs font-label-md"><span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Review</span></td>
    <td className="py-4 text-center"><button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button></td>
    </tr>
    </tbody>
    </table>
    </div>
    </section>
    </div>

    <div className="xl:col-span-4 flex flex-col space-y-8">

    <section className="bg-primary-container text-on-primary-container rounded-2xl shadow-md p-6 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-6 opacity-10">
    <span className="material-symbols-outlined text-[120px]">smart_toy</span>
    </div>
    <div className="flex items-center gap-3 mb-6 relative z-10">
    <div className="bg-primary text-on-primary p-2 rounded-full">
    <span className="material-symbols-outlined">lightbulb</span>
    </div>
    <h3 className="font-headline-md">AI-Assisted Insights</h3>
    </div>
    <div className="space-y-4 relative z-10">
    <div className="bg-surface/10 backdrop-blur-sm p-4 rounded-xl border-l-4 border-error">
    <div className="flex justify-between items-start mb-2">
    <span className="font-label-md uppercase tracking-wider text-error-container">Quality Alert</span>
    <span className="material-symbols-outlined text-error-container text-sm">trending_down</span>
    </div>
    <p className="font-body-sm leading-relaxed text-on-primary-container/90">Loni tehsil shows a <strong className="text-on-primary">4.8% decline</strong> in spatial data quality over 7 days. High cluster of mismatched boundaries detected in sector 4.</p>
    </div>
    <div className="bg-surface/10 backdrop-blur-sm p-4 rounded-xl border-l-4 border-tertiary-fixed">
    <div className="flex justify-between items-start mb-2">
    <span className="font-label-md uppercase tracking-wider text-tertiary-fixed">Workflow Bottleneck</span>
    <span className="material-symbols-outlined text-tertiary-fixed text-sm">hourglass_bottom</span>
    </div>
    <p className="font-body-sm leading-relaxed text-on-primary-container/90">Dasna mutation backlog increased by 15%. Average resolution time now exceeds SLA by 3 days.</p>
    </div>
    </div>
    </section>

    <section className="bg-surface-container rounded-2xl shadow-sm p-6 flex-1 flex flex-col">
    <div className="flex justify-between items-center mb-6">
    <h3 className="font-headline-md text-on-surface flex items-center gap-2">
    <span className="material-symbols-outlined text-error">notification_important</span>
                        Alert Center
                    </h3>
    <span className="bg-error text-on-error font-label-md px-2 py-0.5 rounded-full text-xs">34 Escalated</span>
    </div>
    <div className="flex-1 overflow-y-auto space-y-4 pr-2">

    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer group">
    <div className="mt-1 bg-error/10 p-1.5 rounded-full text-error">
    <span className="material-symbols-outlined text-[16px] block" style={{fontVariationSettings: '\'FILL\' 1'}}>warning</span>
    </div>
    <div className="flex-1 min-w-0">
    <div className="flex justify-between items-baseline mb-1">
    <h4 className="font-label-md text-on-surface truncate pr-2">Boundary Dispute Escalation</h4>
    <span className="text-[10px] text-on-surface-variant font-tabular-nums whitespace-nowrap">2m ago</span>
    </div>
    <p className="font-body-sm text-on-surface-variant line-clamp-2">Case #LD-8992 in Loni requires immediate sub-divisional magistrate review.</p>
    </div>
    </div>

    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer group">
    <div className="mt-1 bg-tertiary/10 p-1.5 rounded-full text-tertiary">
    <span className="material-symbols-outlined text-[16px] block">sync_problem</span>
    </div>
    <div className="flex-1 min-w-0">
    <div className="flex justify-between items-baseline mb-1">
    <h4 className="font-label-md text-on-surface truncate pr-2">Registry Sync Failure</h4>
    <span className="text-[10px] text-on-surface-variant font-tabular-nums whitespace-nowrap">15m ago</span>
    </div>
    <p className="font-body-sm text-on-surface-variant line-clamp-2">Failed to synchronize 12 mutation records from Sub-Registrar Office, Modinagar.</p>
    </div>
    </div>

    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer group">
    <div className="mt-1 bg-primary/10 p-1.5 rounded-full text-primary">
    <span className="material-symbols-outlined text-[16px] block">person_add</span>
    </div>
    <div className="flex-1 min-w-0">
    <div className="flex justify-between items-baseline mb-1">
    <h4 className="font-label-md text-on-surface truncate pr-2">Field Surveyor Reassigned</h4>
    <span className="text-[10px] text-on-surface-variant font-tabular-nums whitespace-nowrap">1h ago</span>
    </div>
    <p className="font-body-sm text-on-surface-variant line-clamp-2">Surveyor ID: S-402 reassigned to High Priority Zone in Dasna tehsil.</p>
    </div>
    </div>

    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer group">
    <div className="mt-1 bg-error/10 p-1.5 rounded-full text-error">
    <span className="material-symbols-outlined text-[16px] block" style={{fontVariationSettings: '\'FILL\' 1'}}>warning</span>
    </div>
    <div className="flex-1 min-w-0">
    <div className="flex justify-between items-baseline mb-1">
    <h4 className="font-label-md text-on-surface truncate pr-2">Court Order Pending Execution</h4>
    <span className="text-[10px] text-on-surface-variant font-tabular-nums whitespace-nowrap">3h ago</span>
    </div>
    <p className="font-body-sm text-on-surface-variant line-clamp-2">High court stay order on ULPIN 09283746 requires manual block in system.</p>
    </div>
    </div>
    </div>
    <button className="w-full mt-4 py-2 border border-outline-variant rounded-lg text-on-surface-variant font-label-md hover:bg-surface-container-high transition-colors">
                    View All Alerts
                </button>
    </section>
    </div>
    </div>
    </div></main>
  );
}
