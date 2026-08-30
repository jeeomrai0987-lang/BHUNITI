export default function TehsilAnalytics() {
  return (
    <main className="pt-16 min-h-screen bg-surface"><div className="flex flex-col w-full p-8 gap-8 animate-fade-in">

    <div className="flex flex-col gap-2">
    <h1 className="font-display text-display text-on-surface">Tehsil Analytics</h1>
    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                Comparative performance metrics and land record synchronization status across Ghaziabad district jurisdictions.
            </p>
    </div>

    <div className="bg-error-container text-on-error-container p-6 rounded-2xl flex items-start gap-4 shadow-md relative overflow-hidden group">
    <div className="absolute -right-12 -top-12 w-48 h-48 bg-error/10 rounded-full mix-blend-multiply blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
    <span className="material-symbols-outlined text-error text-[32px] mt-1 relative z-10">warning</span>
    <div className="flex flex-col gap-2 relative z-10 flex-1">
    <h2 className="font-headline-md text-headline-md font-bold text-on-error-container">Attention Required: Loni Tehsil</h2>
    <p className="font-body-md text-body-md opacity-90">
                    Discrepancy rates in Loni have exceeded acceptable thresholds (12.4% vs district avg 4.2%). Primary root cause identified as legacy non-spatial records failing automated ULPIN matching.
                </p>
    <div className="mt-2 flex gap-3">
    <button className="bg-error text-on-error px-4 py-2 rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-error/90 transition-colors shadow-sm">View Root Cause Analysis</button>
    <button className="px-4 py-2 rounded-lg font-label-md text-label-md uppercase tracking-wider text-error hover:bg-error/10 transition-colors">Dismiss Alert</button>
    </div>
    </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

    <div className="bg-surface-container p-6 rounded-2xl shadow-sm flex flex-col gap-3 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors"></div>
    <div className="flex items-center justify-between">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">District Avg Verification</span>
    <span className="material-symbols-outlined text-primary">verified</span>
    </div>
    <div className="flex items-baseline gap-2">
    <span className="font-display text-display text-on-surface">87.2%</span>
    <span className="font-label-md text-label-md text-secondary">+2.1% MTD</span>
    </div>
    <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden mt-2">
    <div className="bg-primary h-full w-[87.2%] rounded-full"></div>
    </div>
    </div>

    <div className="bg-surface-container p-6 rounded-2xl shadow-sm flex flex-col gap-3 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-tertiary/5 rounded-full blur-xl group-hover:bg-tertiary/10 transition-colors"></div>
    <div className="flex items-center justify-between">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Total Backlog</span>
    <span className="material-symbols-outlined text-tertiary-fixed-dim">history</span>
    </div>
    <div className="flex items-baseline gap-2">
    <span className="font-display text-display text-on-surface">14,208</span>
    <span className="font-label-md text-label-md text-error">-4.5% vs Prev Qtr</span>
    </div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Pending mutations across 5 tehsils</p>
    </div>

    <div className="bg-surface-container p-6 rounded-2xl shadow-sm flex flex-col gap-3 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary/5 rounded-full blur-xl group-hover:bg-secondary/10 transition-colors"></div>
    <div className="flex items-center justify-between">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Avg Resolution Time</span>
    <span className="material-symbols-outlined text-secondary">timer</span>
    </div>
    <div className="flex items-baseline gap-2">
    <span className="font-display text-display text-on-surface">18<span className="text-headline-md font-headline-md opacity-50 ml-1">Days</span></span>
    </div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Target SLA: 14 Days</p>
    </div>

    <div className="bg-surface-container p-6 rounded-2xl shadow-sm flex flex-col gap-3 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
    <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600')" }}></div>
    <div className="flex items-center justify-between relative z-10">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Map Sync Rate</span>
    <span className="material-symbols-outlined text-primary">sync</span>
    </div>
    <div className="flex items-baseline gap-2 relative z-10">
    <span className="font-display text-display text-on-surface">94.8%</span>
    </div>
    <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden mt-2 relative z-10">
    <div className="bg-primary h-full w-[94.8%] rounded-full"></div>
    </div>
    </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

    <div className="bg-surface-container-low p-6 rounded-3xl shadow-sm lg:col-span-2 flex flex-col gap-6">
    <div className="flex items-center justify-between">
    <h3 className="font-headline-md text-headline-md text-on-surface">Verification Status by Tehsil</h3>
    <button className="text-on-surface-variant hover:text-primary transition-colors">
    <span className="material-symbols-outlined">more_horiz</span>
    </button>
    </div>
    <div className="flex-1 flex items-end justify-around h-64 gap-2 relative">

    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
    <div className="w-full h-[1px] bg-outline"></div>
    <div className="w-full h-[1px] bg-outline"></div>
    <div className="w-full h-[1px] bg-outline"></div>
    <div className="w-full h-[1px] bg-outline"></div>
    <div className="w-full h-[1px] bg-outline"></div>
    </div>

    <div className="flex flex-col items-center gap-2 group relative z-10 h-full justify-end w-16">
    <span className="font-label-md text-label-md text-on-surface absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity">92%</span>
    <div className="w-12 bg-primary/20 rounded-t-lg group-hover:bg-primary/30 transition-colors h-[92%] relative overflow-hidden">
    <div className="absolute bottom-0 w-full bg-primary h-[85%] rounded-t-sm group-hover:opacity-90"></div>
    </div>
    <span className="font-label-md text-label-md text-on-surface-variant rotate-[-45deg] origin-top-left mt-4 whitespace-nowrap">Ghaziabad</span>
    </div>
    <div className="flex flex-col items-center gap-2 group relative z-10 h-full justify-end w-16">
    <span className="font-label-md text-label-md text-error absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity">71%</span>
    <div className="w-12 bg-error/20 rounded-t-lg group-hover:bg-error/30 transition-colors h-[71%] relative overflow-hidden">
    <div className="absolute bottom-0 w-full bg-error h-[65%] rounded-t-sm group-hover:opacity-90"></div>
    </div>
    <span className="font-label-md text-label-md text-on-surface-variant rotate-[-45deg] origin-top-left mt-4 whitespace-nowrap text-error font-bold">Loni</span>
    </div>
    <div className="flex flex-col items-center gap-2 group relative z-10 h-full justify-end w-16">
    <span className="font-label-md text-label-md text-on-surface absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity">88%</span>
    <div className="w-12 bg-primary/20 rounded-t-lg group-hover:bg-primary/30 transition-colors h-[88%] relative overflow-hidden">
    <div className="absolute bottom-0 w-full bg-primary h-[82%] rounded-t-sm group-hover:opacity-90"></div>
    </div>
    <span className="font-label-md text-label-md text-on-surface-variant rotate-[-45deg] origin-top-left mt-4 whitespace-nowrap">Modinagar</span>
    </div>
    <div className="flex flex-col items-center gap-2 group relative z-10 h-full justify-end w-16">
    <span className="font-label-md text-label-md text-on-surface absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity">85%</span>
    <div className="w-12 bg-primary/20 rounded-t-lg group-hover:bg-primary/30 transition-colors h-[85%] relative overflow-hidden">
    <div className="absolute bottom-0 w-full bg-primary h-[79%] rounded-t-sm group-hover:opacity-90"></div>
    </div>
    <span className="font-label-md text-label-md text-on-surface-variant rotate-[-45deg] origin-top-left mt-4 whitespace-nowrap">Muradnagar</span>
    </div>
    <div className="flex flex-col items-center gap-2 group relative z-10 h-full justify-end w-16">
    <span className="font-label-md text-label-md text-on-surface absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity">95%</span>
    <div className="w-12 bg-primary/20 rounded-t-lg group-hover:bg-primary/30 transition-colors h-[95%] relative overflow-hidden">
    <div className="absolute bottom-0 w-full bg-primary h-[91%] rounded-t-sm group-hover:opacity-90"></div>
    </div>
    <span className="font-label-md text-label-md text-on-surface-variant rotate-[-45deg] origin-top-left mt-4 whitespace-nowrap">Dasna</span>
    </div>
    </div>
    <div className="flex items-center justify-center gap-6 mt-8">
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 bg-primary rounded-sm"></div>
    <span className="font-label-md text-label-md text-on-surface-variant">Verified Records</span>
    </div>
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 bg-primary/20 rounded-sm"></div>
    <span className="font-label-md text-label-md text-on-surface-variant">Total Scanned</span>
    </div>
    </div>
    </div>

    <div className="bg-surface-container-low p-6 rounded-3xl shadow-sm flex flex-col gap-6 relative overflow-hidden">
    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-tertiary-fixed/10 rounded-full blur-3xl"></div>
    <h3 className="font-headline-md text-headline-md text-on-surface">Backlog Distribution</h3>
    <div className="flex-1 flex flex-col items-center justify-center relative">

    <svg className="w-48 h-48 drop-shadow-md" viewBox="0 0 100 100">

    <circle className="transform -rotate-90 origin-center transition-all duration-1000 hover:stroke-width-20 cursor-pointer" cx="50" cy="50" fill="transparent" r="40" stroke="var(--tw-colors-primary)" strokeDasharray="251.2" strokeDashoffset="188.4" strokeWidth="16"></circle>

    <circle className="transform rotate-[-18deg] origin-center transition-all duration-1000 hover:stroke-width-20 cursor-pointer" cx="50" cy="50" fill="transparent" r="40" stroke="var(--tw-colors-secondary)" strokeDasharray="251.2" strokeDashoffset="200" strokeWidth="16"></circle>

    <circle className="transform rotate-[35deg] origin-center transition-all duration-1000 hover:stroke-width-20 cursor-pointer" cx="50" cy="50" fill="transparent" r="40" stroke="var(--tw-colors-tertiary-fixed-dim)" strokeDasharray="251.2" strokeDashoffset="210" strokeWidth="16"></circle>

    <circle className="transform rotate-[90deg] origin-center transition-all duration-1000 hover:stroke-[20px] cursor-pointer drop-shadow-xl" cx="50" cy="50" fill="transparent" r="40" stroke="var(--tw-colors-error)" strokeDasharray="251.2" strokeDashoffset="150" strokeWidth="16"></circle>

    <text className="text-on-surface" fill="currentColor" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="middle" x="50" y="45">Loni</text>
    <text className="text-error" fill="currentColor" fontFamily="Inter" fontSize="14" fontWeight="700" textAnchor="middle" x="50" y="58">42%</text>
    </svg>
    </div>
    <div className="grid grid-cols-2 gap-3 mt-4">
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 bg-error rounded-sm"></div>
    <span className="font-body-sm text-body-sm text-on-surface-variant">Loni (42%)</span>
    </div>
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 bg-primary rounded-sm"></div>
    <span className="font-body-sm text-body-sm text-on-surface-variant">Ghaziabad (25%)</span>
    </div>
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 bg-secondary rounded-sm"></div>
    <span className="font-body-sm text-body-sm text-on-surface-variant">Modinagar (20%)</span>
    </div>
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 bg-tertiary-fixed-dim rounded-sm"></div>
    <span className="font-body-sm text-body-sm text-on-surface-variant">Others (13%)</span>
    </div>
    </div>
    </div>
    </div>

    <div className="bg-surface-container-lowest rounded-3xl shadow-md overflow-hidden flex flex-col border border-outline-variant/30 mt-4">
    <div className="p-6 border-b border-outline-variant/50 bg-surface-container-low flex items-center justify-between">
    <div className="flex items-center gap-4">
    <h3 className="font-headline-md text-headline-md text-on-surface">Tehsil Performance Breakdown</h3>
    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label-md text-label-md">Last 30 Days</span>
    </div>
    <div className="flex gap-2">
    <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"><span className="material-symbols-outlined">download</span></button>
    <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"><span className="material-symbols-outlined">filter_list</span></button>
    </div>
    </div>
    <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
    <thead>
    <tr className="bg-surface-container-low/50">
    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold sticky left-0 bg-surface-container-low z-20 shadow-[1px_0_0_rgba(0,0,0,0.05)]">Tehsil</th>
    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Verification %</th>
    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Total Backlog</th>
    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Avg Res Time</th>
    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Discrepancy Rate</th>
    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Status</th>
    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold text-right">Action</th>
    </tr>
    </thead>
    <tbody className="divide-y divide-outline-variant/20 font-tabular-nums text-tabular-nums">

    <tr className="hover:bg-surface-container-low/30 transition-colors group">
    <td className="p-4 font-body-md text-body-md font-medium text-on-surface sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low/30 z-10 transition-colors shadow-[1px_0_0_rgba(0,0,0,0.05)]">Ghaziabad</td>
    <td className="p-4">
    <div className="flex items-center gap-2">
    <span className="text-on-surface">92.4%</span>
    <span className="material-symbols-outlined text-[16px] text-green-600">trending_up</span>
    </div>
    </td>
    <td className="p-4 text-on-surface">3,542</td>
    <td className="p-4 text-on-surface">12 Days</td>
    <td className="p-4 text-on-surface">3.1%</td>
    <td className="p-4">
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 border border-green-200">
    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    Optimal
                                </span>
    </td>
    <td className="p-4 text-right">
    <button className="text-primary font-label-md text-label-md uppercase tracking-wider hover:underline flex items-center justify-end w-full">Drill Down <span className="material-symbols-outlined text-[18px] ml-1">chevron_right</span></button>
    </td>
    </tr>

    <tr className="bg-error/5 hover:bg-error/10 transition-colors group">
    <td className="p-4 font-body-md text-body-md font-bold text-error sticky left-0 bg-[#fff5f5] group-hover:bg-[#ffebeb] z-10 transition-colors shadow-[1px_0_0_rgba(0,0,0,0.05)]">Loni</td>
    <td className="p-4">
    <div className="flex items-center gap-2">
    <span className="text-error font-bold">71.2%</span>
    <span className="material-symbols-outlined text-[16px] text-error">trending_down</span>
    </div>
    </td>
    <td className="p-4 text-error font-bold">5,967</td>
    <td className="p-4 text-error">28 Days</td>
    <td className="p-4 text-error font-bold">12.4%</td>
    <td className="p-4">
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-error text-on-error shadow-sm">
    <span className="material-symbols-outlined text-[14px]">warning</span>
                                    Needs Attention
                                </span>
    </td>
    <td className="p-4 text-right">
    <button className="text-error font-label-md text-label-md uppercase tracking-wider hover:underline flex items-center justify-end w-full font-bold">Drill Down <span className="material-symbols-outlined text-[18px] ml-1">chevron_right</span></button>
    </td>
    </tr>

    <tr className="hover:bg-surface-container-low/30 transition-colors group">
    <td className="p-4 font-body-md text-body-md font-medium text-on-surface sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low/30 z-10 transition-colors shadow-[1px_0_0_rgba(0,0,0,0.05)]">Modinagar</td>
    <td className="p-4">
    <div className="flex items-center gap-2">
    <span className="text-on-surface">88.1%</span>
    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">horizontal_rule</span>
    </div>
    </td>
    <td className="p-4 text-on-surface">2,841</td>
    <td className="p-4 text-on-surface">16 Days</td>
    <td className="p-4 text-on-surface">4.5%</td>
    <td className="p-4">
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface border border-outline-variant/50">
    <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span>
                                    Stable
                                </span>
    </td>
    <td className="p-4 text-right">
    <button className="text-primary font-label-md text-label-md uppercase tracking-wider hover:underline flex items-center justify-end w-full">Drill Down <span className="material-symbols-outlined text-[18px] ml-1">chevron_right</span></button>
    </td>
    </tr>

    <tr className="hover:bg-surface-container-low/30 transition-colors group">
    <td className="p-4 font-body-md text-body-md font-medium text-on-surface sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low/30 z-10 transition-colors shadow-[1px_0_0_rgba(0,0,0,0.05)]">Muradnagar</td>
    <td className="p-4">
    <div className="flex items-center gap-2">
    <span className="text-on-surface">85.6%</span>
    <span className="material-symbols-outlined text-[16px] text-green-600">trending_up</span>
    </div>
    </td>
    <td className="p-4 text-on-surface">1,120</td>
    <td className="p-4 text-on-surface">14 Days</td>
    <td className="p-4 text-on-surface">3.8%</td>
    <td className="p-4">
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface border border-outline-variant/50">
    <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span>
                                    Stable
                                </span>
    </td>
    <td className="p-4 text-right">
    <button className="text-primary font-label-md text-label-md uppercase tracking-wider hover:underline flex items-center justify-end w-full">Drill Down <span className="material-symbols-outlined text-[18px] ml-1">chevron_right</span></button>
    </td>
    </tr>

    <tr className="hover:bg-surface-container-low/30 transition-colors group">
    <td className="p-4 font-body-md text-body-md font-medium text-on-surface sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low/30 z-10 transition-colors shadow-[1px_0_0_rgba(0,0,0,0.05)]">Dasna</td>
    <td className="p-4">
    <div className="flex items-center gap-2">
    <span className="text-on-surface">95.2%</span>
    <span className="material-symbols-outlined text-[16px] text-green-600">trending_up</span>
    </div>
    </td>
    <td className="p-4 text-on-surface">738</td>
    <td className="p-4 text-on-surface">9 Days</td>
    <td className="p-4 text-on-surface">1.2%</td>
    <td className="p-4">
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 border border-green-200">
    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    Optimal
                                </span>
    </td>
    <td className="p-4 text-right">
    <button className="text-primary font-label-md text-label-md uppercase tracking-wider hover:underline flex items-center justify-end w-full">Drill Down <span className="material-symbols-outlined text-[18px] ml-1">chevron_right</span></button>
    </td>
    </tr>
    </tbody>
    </table>
    </div>
    </div>
    </div>
    </main>
  );
}
