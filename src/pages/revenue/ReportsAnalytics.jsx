export default function ReportsAnalytics() {
  return (
    <main className="relative pt-16 min-h-screen bg-background"><div className="px-8 py-4 flex items-center gap-2 text-label-md text-on-surface-variant"><a className="hover:text-primary" href="#">System</a><span className="material-symbols-outlined text-[14px]">chevron_right</span><span className="text-on-surface font-semibold">Dashboard</span></div><div className="flex flex-col w-full p-8 gap-8">

    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
    <div className="flex flex-col gap-1">
    <h1 className="font-headline-lg text-on-surface">Reports & Analytics</h1>
    <p className="font-body-md text-on-surface-variant">System-wide performance, reconciliation metrics, and discrepancy analysis.</p>
    </div>
    <div className="flex flex-wrap items-center bg-surface-container-lowest shadow-sm rounded-full p-2 gap-2">
    <button className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface">
    <span className="font-label-md">District: All</span>
    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
    </button>
    <button className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface">
    <span className="font-label-md">Tehsil: All</span>
    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
    </button>
    <button className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface">
    <span className="font-label-md">Village: All</span>
    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
    </button>
    <div className="w-px h-6 bg-surface-container-highest mx-2"></div>
    <button className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2 rounded-full shadow-sm hover:opacity-90 transition-opacity">
    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
    <span className="font-label-md">Last 30 Days</span>
    </button>
    </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

    <div className="bg-surface-container-lowest shadow-sm rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group">
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-error-container rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
    <div className="flex justify-between items-start relative z-10">
    <span className="font-label-md text-on-surface-variant uppercase tracking-wider">Open Discrepancies</span>
    <span className="material-symbols-outlined text-error">warning</span>
    </div>
    <div className="flex items-baseline gap-3 relative z-10">
    <h2 className="font-display text-on-surface">1,248</h2>
    <span className="font-label-md text-error bg-error-container px-2 py-0.5 rounded-full">+12%</span>
    </div>
    </div>

    <div className="bg-surface-container-lowest shadow-sm rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group">
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-surface-container-high rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
    <div className="flex justify-between items-start relative z-10">
    <span className="font-label-md text-on-surface-variant uppercase tracking-wider">Resolved Cases (YTD)</span>
    <span className="material-symbols-outlined text-primary">check_circle</span>
    </div>
    <div className="flex items-baseline gap-3 relative z-10">
    <h2 className="font-display text-on-surface">8,432</h2>
    <span className="font-label-md text-primary bg-surface-container-highest px-2 py-0.5 rounded-full">+4.2%</span>
    </div>
    </div>

    <div className="bg-surface-container-lowest shadow-sm rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group">
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-tertiary-fixed rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
    <div className="flex justify-between items-start relative z-10">
    <span className="font-label-md text-on-surface-variant uppercase tracking-wider">Avg Processing Time</span>
    <span className="material-symbols-outlined text-on-tertiary-fixed-variant">schedule</span>
    </div>
    <div className="flex items-baseline gap-3 relative z-10">
    <h2 className="font-display text-on-surface">14<span className="font-headline-md text-on-surface-variant ml-1">Days</span></h2>
    <span className="font-label-md text-on-tertiary-fixed-variant bg-tertiary-fixed px-2 py-0.5 rounded-full">-2 Days</span>
    </div>
    </div>

    <div className="bg-surface-container-lowest shadow-sm rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group">
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary-container rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
    <div className="flex justify-between items-start relative z-10">
    <span className="font-label-md text-on-surface-variant uppercase tracking-wider">Source Accuracy Index</span>
    <span className="material-symbols-outlined text-secondary">verified_user</span>
    </div>
    <div className="flex items-baseline gap-3 relative z-10">
    <h2 className="font-display text-on-surface">94.2%</h2>
    <span className="font-label-md text-secondary bg-secondary-container px-2 py-0.5 rounded-full">+0.8%</span>
    </div>
    </div>
    </div>

    <div className="grid grid-cols-12 gap-6">

    <div className="col-span-12 xl:col-span-8 bg-surface-container-lowest shadow-sm rounded-2xl p-8 flex flex-col">
    <div className="flex justify-between items-start mb-8">
    <div>
    <h3 className="font-headline-md text-on-surface">Discrepancies by Category</h3>
    <p className="font-body-sm text-on-surface-variant mt-1">Volume of reported issues classified by root cause.</p>
    </div>
    <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_vert</button>
    </div>
    <div className="relative w-full h-72 mt-auto">
    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 240">

    <line className="text-surface-container-highest" stroke="currentColor" strokeWidth="1" x1="0" x2="800" y1="200" y2="200"></line>
    <line className="text-surface-container-highest" stroke="currentColor" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="150" y2="150"></line>
    <line className="text-surface-container-highest" stroke="currentColor" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="100" y2="100"></line>
    <line className="text-surface-container-highest" stroke="currentColor" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="50" y2="50"></line>

    <text className="fill-on-surface-variant font-tabular-nums text-[12px]" textAnchor="end" x="-10" y="205">0</text>
    <text className="fill-on-surface-variant font-tabular-nums text-[12px]" textAnchor="end" x="-10" y="155">200</text>
    <text className="fill-on-surface-variant font-tabular-nums text-[12px]" textAnchor="end" x="-10" y="105">400</text>
    <text className="fill-on-surface-variant font-tabular-nums text-[12px]" textAnchor="end" x="-10" y="55">600</text>

    <g className="chart-bar group cursor-pointer">
    <rect className="fill-primary transition-all duration-300 group-hover:opacity-80" height="120" rx="4" width="60" x="50" y="80"></rect>
    <text className="fill-on-surface font-label-md opacity-0 group-hover:opacity-100 transition-opacity" textAnchor="middle" x="80" y="70">480</text>
    </g>
    <g className="chart-bar group cursor-pointer">
    <rect className="fill-tertiary-fixed-dim transition-all duration-300 group-hover:opacity-80" height="160" rx="4" width="60" x="170" y="40"></rect>
    <text className="fill-on-surface font-label-md opacity-0 group-hover:opacity-100 transition-opacity" textAnchor="middle" x="200" y="30">640</text>
    </g>
    <g className="chart-bar group cursor-pointer">
    <rect className="fill-secondary-fixed transition-all duration-300 group-hover:opacity-80" height="90" rx="4" width="60" x="290" y="110"></rect>
    <text className="fill-on-surface font-label-md opacity-0 group-hover:opacity-100 transition-opacity" textAnchor="middle" x="320" y="100">360</text>
    </g>
    <g className="chart-bar group cursor-pointer">
    <rect className="fill-error-container transition-all duration-300 group-hover:opacity-80" height="60" rx="4" width="60" x="410" y="140"></rect>
    <text className="fill-on-surface font-label-md opacity-0 group-hover:opacity-100 transition-opacity" textAnchor="middle" x="440" y="130">240</text>
    </g>
    <g className="chart-bar group cursor-pointer">
    <rect className="fill-surface-tint transition-all duration-300 group-hover:opacity-80" height="140" rx="4" width="60" x="530" y="60"></rect>
    <text className="fill-on-surface font-label-md opacity-0 group-hover:opacity-100 transition-opacity" textAnchor="middle" x="560" y="50">560</text>
    </g>
    <g className="chart-bar group cursor-pointer">
    <rect className="fill-outline transition-all duration-300 group-hover:opacity-80" height="40" rx="4" width="60" x="650" y="160"></rect>
    <text className="fill-on-surface font-label-md opacity-0 group-hover:opacity-100 transition-opacity" textAnchor="middle" x="680" y="150">160</text>
    </g>

    <text className="fill-on-surface-variant font-label-md text-[12px]" textAnchor="middle" x="80" y="230">Area Mismatch</text>
    <text className="fill-on-surface-variant font-label-md text-[12px]" textAnchor="middle" x="200" y="230">Title Dispute</text>
    <text className="fill-on-surface-variant font-label-md text-[12px]" textAnchor="middle" x="320" y="230">Boundary</text>
    <text className="fill-on-surface-variant font-label-md text-[12px]" textAnchor="middle" x="440" y="230">Missing Doc</text>
    <text className="fill-on-surface-variant font-label-md text-[12px]" textAnchor="middle" x="560" y="230">Class. Error</text>
    <text className="fill-on-surface-variant font-label-md text-[12px]" textAnchor="middle" x="680" y="230">Other</text>
    </svg>
    </div>
    </div>

    <div className="col-span-12 xl:col-span-4 bg-primary-container shadow-md rounded-2xl p-8 text-on-primary-container relative overflow-hidden flex flex-col justify-between">

    <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-fixed rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
    <div className="relative z-10">
    <h3 className="font-headline-md text-white">Source Reliability</h3>
    <p className="font-body-sm text-primary-fixed mt-1">Trust scores across integration endpoints.</p>
    </div>
    <div className="relative z-10 flex flex-col gap-6 mt-8">

    <div className="flex flex-col gap-2">
    <div className="flex justify-between items-end">
    <span className="font-label-md text-white">Legacy Land Records</span>
    <span className="font-tabular-nums text-primary-fixed">78%</span>
    </div>
    <div className="w-full h-2 bg-inverse-surface rounded-full overflow-hidden">
    <div className="h-full bg-tertiary-fixed w-[78%] rounded-full shadow-[0_0_10px_rgba(252,222,181,0.5)]"></div>
    </div>
    </div>

    <div className="flex flex-col gap-2">
    <div className="flex justify-between items-end">
    <span className="font-label-md text-white">Drone Survey (2023)</span>
    <span className="font-tabular-nums text-primary-fixed">96%</span>
    </div>
    <div className="w-full h-2 bg-inverse-surface rounded-full overflow-hidden">
    <div className="h-full bg-primary-fixed w-[96%] rounded-full shadow-[0_0_10px_rgba(218,226,253,0.5)]"></div>
    </div>
    </div>

    <div className="flex flex-col gap-2">
    <div className="flex justify-between items-end">
    <span className="font-label-md text-white">Satellite Imagery</span>
    <span className="font-tabular-nums text-primary-fixed">89%</span>
    </div>
    <div className="w-full h-2 bg-inverse-surface rounded-full overflow-hidden">
    <div className="h-full bg-secondary-fixed w-[89%] rounded-full shadow-[0_0_10px_rgba(213,227,253,0.5)]"></div>
    </div>
    </div>

    <div className="flex flex-col gap-2">
    <div className="flex justify-between items-end">
    <span className="font-label-md text-white">Citizen Portal Submissions</span>
    <span className="font-tabular-nums text-primary-fixed">64%</span>
    </div>
    <div className="w-full h-2 bg-inverse-surface rounded-full overflow-hidden">
    <div className="h-full bg-error-container w-[64%] rounded-full"></div>
    </div>
    </div>
    </div>
    <div className="relative z-10 mt-8 pt-6 bg-inverse-surface/30 px-4 py-3 rounded-lg flex items-start gap-3 backdrop-blur-sm">
    <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">lightbulb</span>
    <p className="font-body-sm text-primary-fixed leading-tight">Legacy records in Tehsil 4 require manual reconciliation due to shifting datum coordinates.</p>
    </div>
    </div>

    <div className="col-span-12 xl:col-span-7 bg-surface-container-lowest shadow-sm rounded-2xl overflow-hidden relative h-[500px]">
    <div className="absolute inset-0 w-full h-full bg-cover bg-center" data-alt="High-contrast, minimalist satellite map view of a district in India, showing parcel boundaries and topographic features. The map uses a muted slate and indigo color palette for enterprise GIS aesthetics, with subtle glow effects on specific regions indicating data density." data-location="Bhopal District, Madhya Pradesh, India" style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuDd7ECT5C7iPGx_hbW4Kr9YLUDiImdP-QbkrE4twW-tC0_kGjhQn2y3Tx_2oXbi4tfKHOWc3d27ohSPY0p3UBGtx4tYO5cC6XJTT0BjTbziX3fLZ7vv9JLg-x7xxkWLr8PFiyWI_911P1Qw0DxYGLjm4lDYvr2v5Ts-uLrPO5qkQlwB20-QtW-6mx3PhRu-CtOLgWEjyT-tIiz1Mbs_c8wmHO13_ANMIi_GwsMbqNynJxnzGgrIQnQ\')'}}></div>

    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/20 to-surface-container-lowest/10"></div>

    <div className="absolute top-6 left-6 bg-surface-container-lowest/90 backdrop-blur-xl shadow-lg rounded-xl p-4 min-w-[280px]">
    <h3 className="font-headline-md text-on-surface">Cases by Village</h3>
    <p className="font-body-sm text-on-surface-variant">Geospatial Discrepancy Hotspots</p>
    <div className="mt-4 flex gap-4">
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-error"></div>
    <span className="font-label-md text-on-surface">High Volume</span>
    </div>
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-tertiary-fixed-dim"></div>
    <span className="font-label-md text-on-surface">Monitoring</span>
    </div>
    </div>
    </div>

    <div className="absolute bottom-6 left-6 right-6 bg-surface-container-lowest/95 backdrop-blur-xl shadow-xl rounded-xl overflow-hidden flex flex-col max-h-[200px]">
    <div className="px-6 py-3 bg-surface-container-low flex justify-between items-center shadow-[0_1px_0_rgba(0,0,0,0.05)]">
    <span className="font-label-md text-on-surface uppercase tracking-wider">Top Affected Villages</span>
    <button className="text-primary font-label-md hover:underline">View Full Table</button>
    </div>
    <div className="overflow-y-auto w-full p-2">

    <div className="flex items-center px-4 py-3 hover:bg-surface-container rounded-lg transition-colors cursor-pointer group">
    <div className="flex-1 font-body-md text-on-surface font-medium">Govindpura</div>
    <div className="w-32 font-tabular-nums text-on-surface-variant">142 Cases</div>
    <div className="w-24 text-right">
    <span className="inline-block bg-error-container text-on-error-container font-label-md px-2 py-1 rounded-md">Critical</span>
    </div>
    </div>
    <div className="flex items-center px-4 py-3 hover:bg-surface-container rounded-lg transition-colors cursor-pointer group">
    <div className="flex-1 font-body-md text-on-surface font-medium">Bairagarh</div>
    <div className="w-32 font-tabular-nums text-on-surface-variant">89 Cases</div>
    <div className="w-24 text-right">
    <span className="inline-block bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-md px-2 py-1 rounded-md">Elevated</span>
    </div>
    </div>
    <div className="flex items-center px-4 py-3 hover:bg-surface-container rounded-lg transition-colors cursor-pointer group">
    <div className="flex-1 font-body-md text-on-surface font-medium">Kolar</div>
    <div className="w-32 font-tabular-nums text-on-surface-variant">45 Cases</div>
    <div className="w-24 text-right">
    <span className="inline-block bg-surface-container-highest text-on-surface font-label-md px-2 py-1 rounded-md">Normal</span>
    </div>
    </div>
    </div>
    </div>
    </div>

    <div className="col-span-12 xl:col-span-5 bg-surface-container-lowest shadow-sm rounded-2xl p-8 flex flex-col">
    <div className="flex justify-between items-start mb-6">
    <div>
    <h3 className="font-headline-md text-on-surface">Mutation Processing Time</h3>
    <p className="font-body-sm text-on-surface-variant mt-1">Average days to resolve land mutations over time.</p>
    </div>
    </div>
    <div className="relative w-full h-64 mt-auto">
    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 240">
    <defs>
    <lineargradient id="lineAreaGrad" x1="0" x2="0" y1="0" y2="1">
    <stop className="text-primary" offset="0%" stopColor="currentColor" stopOpacity="0.15"></stop>
    <stop className="text-primary" offset="100%" stopColor="currentColor" stopOpacity="0"></stop>
    </lineargradient>
    </defs>

    <line className="text-surface-container-highest" stroke="currentColor" strokeWidth="1" x1="0" x2="500" y1="200" y2="200"></line>
    <line className="text-surface-container-highest" stroke="currentColor" strokeDasharray="4" strokeWidth="1" x1="0" x2="500" y1="120" y2="120"></line>
    <line className="text-surface-container-highest" stroke="currentColor" strokeDasharray="4" strokeWidth="1" x1="0" x2="500" y1="40" y2="40"></line>

    <text className="fill-on-surface-variant font-tabular-nums text-[12px]" textAnchor="end" x="-10" y="205">0d</text>
    <text className="fill-on-surface-variant font-tabular-nums text-[12px]" textAnchor="end" x="-10" y="125">15d</text>
    <text className="fill-on-surface-variant font-tabular-nums text-[12px]" textAnchor="end" x="-10" y="45">30d</text>

    <path className="transition-all duration-1000 ease-out" d="M 0 160 C 50 150, 100 80, 150 100 C 200 120, 250 180, 300 140 C 350 100, 400 90, 450 60 L 500 50 L 500 200 L 0 200 Z" fill="url(#lineAreaGrad)"></path>

    <path className="text-primary" d="M 0 160 C 50 150, 100 80, 150 100 C 200 120, 250 180, 300 140 C 350 100, 400 90, 450 60 L 500 50" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3"></path>

    <g className="group cursor-pointer">
    <circle className="fill-surface-container-lowest stroke-primary transition-all duration-300 group-hover:r-7" cx="150" cy="100" r="5" strokeWidth="2"></circle>
    <text className="fill-on-surface font-label-md opacity-0 group-hover:opacity-100 transition-opacity" textAnchor="middle" x="150" y="80">18d</text>
    </g>
    <g className="group cursor-pointer">
    <circle className="fill-surface-container-lowest stroke-primary transition-all duration-300 group-hover:r-7" cx="300" cy="140" r="5" strokeWidth="2"></circle>
    <text className="fill-on-surface font-label-md opacity-0 group-hover:opacity-100 transition-opacity" textAnchor="middle" x="300" y="120">12d</text>
    </g>
    <g className="group cursor-pointer">
    <circle className="fill-surface-container-lowest stroke-primary transition-all duration-300 group-hover:r-7" cx="450" cy="60" r="5" strokeWidth="2"></circle>
    <text className="fill-on-surface font-label-md opacity-0 group-hover:opacity-100 transition-opacity" textAnchor="middle" x="450" y="40">22d</text>
    </g>

    <text className="fill-on-surface-variant font-label-md text-[12px]" textAnchor="middle" x="50" y="225">Jan</text>
    <text className="fill-on-surface-variant font-label-md text-[12px]" textAnchor="middle" x="150" y="225">Feb</text>
    <text className="fill-on-surface-variant font-label-md text-[12px]" textAnchor="middle" x="250" y="225">Mar</text>
    <text className="fill-on-surface-variant font-label-md text-[12px]" textAnchor="middle" x="350" y="225">Apr</text>
    <text className="fill-on-surface-variant font-label-md text-[12px]" textAnchor="middle" x="450" y="225">May</text>
    </svg>
    </div>
    </div>
    </div>
    </div></main>
  );
}
