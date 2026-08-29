export default function HistoricalTimeline() {
  return (
    <main className="relative pt-16 min-h-screen bg-background"><div className="px-8 py-4 flex items-center gap-2 text-label-md text-on-surface-variant"><a className="hover:text-primary" href="#">System</a><span className="material-symbols-outlined text-[14px]">chevron_right</span><span className="text-on-surface font-semibold">Dashboard</span></div><div className="flex flex-col w-full relative">

    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl opacity-50 mix-blend-multiply"></div>
    </div>
    <div className="px-8 py-10 z-10 w-full max-w-7xl mx-auto flex flex-col gap-12">

    <section className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-end w-full">
    <div className="flex flex-col gap-4 max-w-2xl">
    <div className="flex items-center gap-3">
    <span className="inline-flex items-center justify-center bg-tertiary text-on-tertiary rounded-full px-3 py-1 font-label-md text-label-md shadow-sm">
                ULPIN: P-1024
              </span>
    <span className="inline-flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
    <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                Anomaly Detected
              </span>
    </div>
    <h1 className="font-display text-display text-on-surface">Parcel History & Audit Trail</h1>
    <p className="font-body-lg text-body-lg text-on-surface-variant">Comprehensive chronological record of cadastral events, ownership transfers, and geometric modifications for Parcel P-1024.</p>
    </div>

    <div className="bg-surface-container rounded-2xl p-6 shadow-sm flex flex-col gap-3 min-w-[300px] relative overflow-hidden group">
    <div className="flex justify-between items-start">
    <div className="flex flex-col">
    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Registered Area</span>
    <span className="font-headline-lg text-headline-lg text-on-surface flex items-baseline gap-2">
                  2.18 <span className="font-body-sm text-body-sm text-on-surface-variant">ha</span>
    </span>
    </div>
    <span className="material-symbols-outlined text-error">trending_up</span>
    </div>

    <div className="h-16 w-full mt-2 relative">
    <svg className="w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none" viewBox="0 0 200 60">
    <defs>
    <lineargradient id="areaGradient" x1="0%" x2="0%" y1="0%" y2="100%">
    <stop offset="0%" stopColor="var(--tw-colors-error)" stopOpacity="0.2"></stop>
    <stop offset="100%" stopColor="var(--tw-colors-error)" stopOpacity="0"></stop>
    </lineargradient>
    </defs>

    <path className="opacity-30" d="M0,50 L120,50" fill="none" stroke="var(--tw-colors-primary)" strokeWidth="2"></path>
    <path className="opacity-10" d="M0,50 L120,50 L120,60 L0,60 Z" fill="url(#areaGradient)"></path>

    <path className="drop-shadow-sm" d="M120,50 L125,50 L135,10 L200,10" fill="none" stroke="var(--tw-colors-error)" strokeWidth="2.5"></path>
    <path d="M120,50 L125,50 L135,10 L200,10 L200,60 L120,60 Z" fill="url(#areaGradient)"></path>

    <circle cx="0" cy="50" fill="var(--tw-colors-primary)" r="3"></circle>
    <circle cx="120" cy="50" fill="var(--tw-colors-primary)" r="3"></circle>
    <circle className="animate-pulse" cx="135" cy="10" fill="var(--tw-colors-error)" r="4"></circle>
    <circle cx="200" cy="10" fill="var(--tw-colors-error)" r="3"></circle>

    <text className="font-tabular-nums text-label-md" fill="var(--tw-colors-on-surface-variant)" fontSize="10" x="0" y="65">2021</text>
    <text className="font-tabular-nums text-label-md" fill="var(--tw-colors-on-surface-variant)" fontSize="10" x="110" y="65">2023</text>
    <text className="font-tabular-nums text-label-md font-bold" fill="var(--tw-colors-error)" fontSize="10" x="180" y="65">2025</text>
    </svg>
    </div>
    <div className="bg-error-container text-on-error-container font-label-md text-label-md px-3 py-2 rounded-lg mt-2 flex items-start gap-2 shadow-sm">
    <span className="material-symbols-outlined text-[16px] mt-0.5">warning</span>
    <p>First detected inconsistency: <strong>August 2025</strong> (+0.18 ha variance)</p>
    </div>
    </div>
    </section>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

    <aside className="xl:col-span-3 flex flex-col relative">
    <div className="sticky top-24">
    <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
    <span className="material-symbols-outlined">history</span> Chronology
              </h2>
    <div className="relative pl-6 flex flex-col gap-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary before:via-outline-variant before:to-error before:rounded-full">

    <button
      className="group flex flex-col gap-1 text-left relative focus:outline-none w-full"
      onClick={() => document.getElementById("card-2021")?.scrollIntoView({ behavior: "smooth", block: "center" })}
    >
    <span className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-surface border-2 border-primary group-hover:scale-125 transition-transform duration-300 shadow-sm z-10"></span>
    <span className="font-tabular-nums text-body-sm text-on-surface-variant">March 12, 2021</span>
    <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Initial Record Creation</span>
    </button>

    <button
      className="group flex flex-col gap-1 text-left relative focus:outline-none w-full"
      onClick={() => document.getElementById("card-2023")?.scrollIntoView({ behavior: "smooth", block: "center" })}
    >
    <span className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-surface border-2 border-outline group-hover:border-primary group-hover:scale-125 transition-all duration-300 shadow-sm z-10"></span>
    <span className="font-tabular-nums text-body-sm text-on-surface-variant">November 04, 2023</span>
    <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Deed Registration (Transfer)</span>
    </button>

    <button
      className="group flex flex-col gap-1 text-left relative focus:outline-none w-full"
      onClick={() => document.getElementById("card-2025")?.scrollIntoView({ behavior: "smooth", block: "center" })}
    >
    <span className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-error border-2 border-error group-hover:scale-125 transition-transform duration-300 shadow-sm z-10 animate-pulse"></span>
    <span className="font-tabular-nums text-body-sm text-error font-semibold">August 22, 2025</span>
    <span className="font-label-md text-label-md text-on-surface group-hover:text-error transition-colors">Boundary Update (GIS Anomaly)</span>
    </button>
    </div>
    </div>
    </aside>

    <div className="xl:col-span-9 flex flex-col gap-12">

    <article className="bg-surface-container rounded-2xl shadow-sm overflow-hidden flex flex-col lg:flex-row transition-all duration-500 hover:shadow-md group" id="card-2021">
    <div className="lg:w-1/3 min-h-[200px] relative">
    <div className="w-full h-full bg-cover bg-center absolute inset-0" data-location="Cadastral Map, Initial Survey 2021, P-1024" style={{backgroundImage: 'url(\'https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg\')'}}></div>
    <div className="absolute inset-0 bg-surface-container/20 group-hover:bg-transparent transition-colors duration-500 backdrop-blur-[2px] group-hover:backdrop-blur-none"></div>
    <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm">
    <span className="font-label-md text-label-md text-on-surface">Base Survey</span>
    </div>
    </div>
    <div className="p-8 lg:w-2/3 flex flex-col gap-6 justify-center bg-surface-container relative">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
    <header>
    <div className="flex items-center gap-2 mb-2">
    <span className="material-symbols-outlined text-primary text-[20px]">library_add</span>
    <time className="font-tabular-nums text-body-sm text-on-surface-variant">March 12, 2021</time>
    </div>
    <h3 className="font-headline-md text-headline-md text-on-surface">Initial Record Creation</h3>
    </header>
    <div className="grid grid-cols-2 gap-4">
    <div className="flex flex-col bg-surface p-4 rounded-xl shadow-sm">
    <span className="font-label-md text-label-md text-on-surface-variant mb-1">Recorded Area</span>
    <span className="font-tabular-nums text-body-lg text-on-surface font-semibold">2.00 ha</span>
    </div>
    <div className="flex flex-col bg-surface p-4 rounded-xl shadow-sm">
    <span className="font-label-md text-label-md text-on-surface-variant mb-1">Authority</span>
    <span className="font-body-md text-body-md text-on-surface">Sub-Divisional Magistrate</span>
    </div>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant">Digitization of legacy paper records (Ref: Vol 42, Folio 18). Boundary geometry manually digitized from 1:4000 scale village maps. No spatial overlaps detected during initial commit.</p>
    </div>
    </article>

    <article className="bg-surface-container rounded-2xl shadow-sm overflow-hidden flex flex-col lg:flex-row transition-all duration-500 hover:shadow-md group" id="card-2023">
    <div className="lg:w-1/3 min-h-[200px] relative order-first lg:order-last">
    <div className="w-full h-full bg-cover bg-center absolute inset-0 mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-500" data-alt="Close up of an official government property registration document with stamps and signatures, dramatic lighting, high contrast, archival feel." style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuAFrjq0XpoWkBywIhWrNRf8AQAEiPx_RM4bh0G2AEoLai_uSgRQSwK7KIX7lv6vlxKQ29eoXBbm8xTipLsLdLVO0zEXGYE1BMU1GqNnY6K-LGbFD1jtst7IxQM0wsYgN2dgknl2-ymWdjopMdHUn1C1K_GSO5D98x9nhGBnyiMeFkyZ5eYErYyZECQxu33XNl5Zy9DjtMeliArfMysv8tJdWnomV_fqhAYPheoPotvw-g5IhKK8Tg4\')'}}></div>
    </div>
    <div className="p-8 lg:w-2/3 flex flex-col gap-6 justify-center bg-surface-container relative">
    <div className="absolute top-0 left-0 w-32 h-32 bg-outline-variant/10 rounded-br-full pointer-events-none"></div>
    <header>
    <div className="flex items-center gap-2 mb-2">
    <span className="material-symbols-outlined text-outline text-[20px]">description</span>
    <time className="font-tabular-nums text-body-sm text-on-surface-variant">November 04, 2023</time>
    </div>
    <h3 className="font-headline-md text-headline-md text-on-surface">Deed Registration (Transfer)</h3>
    </header>
    <div className="grid grid-cols-2 gap-4">
    <div className="flex flex-col bg-surface p-4 rounded-xl shadow-sm">
    <span className="font-label-md text-label-md text-on-surface-variant mb-1">Grantor</span>
    <span className="font-body-md text-body-md text-on-surface font-medium truncate">R.K. Holdings Ltd.</span>
    </div>
    <div className="flex flex-col bg-surface p-4 rounded-xl shadow-sm">
    <span className="font-label-md text-label-md text-on-surface-variant mb-1">Grantee</span>
    <span className="font-body-md text-body-md text-on-surface font-medium truncate">V. Deshmukh</span>
    </div>
    </div>
    <div className="flex items-center gap-3 bg-surface-container-high px-4 py-3 rounded-lg">
    <span className="material-symbols-outlined text-on-surface-variant">task_alt</span>
    <span className="font-body-sm text-body-sm text-on-surface">Mutation #M-45092 processed. Area confirmed unchanged at <strong>2.00 ha</strong>.</span>
    </div>
    </div>
    </article>

    <article className="bg-error-container rounded-2xl shadow-md overflow-hidden flex flex-col relative transition-transform duration-300 hover:-translate-y-1" id="card-2025">

    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
    <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
    <pattern height="40" id="diagonal-stripes" patterntransform="rotate(45)" width="40">
    <rect fill="currentColor" height="40" width="20"></rect>
    </pattern>
    </defs>
    <rect fill="url(#diagonal-stripes)" height="100%" width="100%"></rect>
    </svg>
    </div>
    <div className="p-8 flex flex-col gap-6 relative z-10">
    <header className="flex justify-between items-start">
    <div>
    <div className="flex items-center gap-2 mb-2">
    <span className="material-symbols-outlined text-error text-[20px]">crisis_alert</span>
    <time className="font-tabular-nums text-body-sm text-on-error-container font-semibold">August 22, 2025</time>
    </div>
    <h3 className="font-headline-md text-headline-md text-on-error-container">Boundary Update (GIS Anomaly)</h3>
    </div>
    <span className="bg-error text-on-error px-3 py-1 rounded-full font-label-md text-label-md shadow-sm uppercase tracking-wide">Action Required</span>
    </header>
    <div className="flex flex-col md:flex-row gap-6">
    <div className="flex-1 flex flex-col gap-4">
    <p className="font-body-md text-body-md text-on-error-container">An automated spatial sync from drone survey D-2025-Q3 introduced new vertex coordinates for the northern boundary, resulting in an unexplained area expansion.</p>
    <div className="bg-surface rounded-xl p-5 shadow-inner">
    <div className="flex items-center justify-between mb-4 pb-4 border-b border-outline-variant/20">
    <div className="flex flex-col">
    <span className="font-label-md text-label-md text-on-surface-variant">Previous Area</span>
    <span className="font-tabular-nums text-body-lg text-on-surface">2.00 ha</span>
    </div>
    <span className="material-symbols-outlined text-outline-variant">arrow_forward</span>
    <div className="flex flex-col text-right">
    <span className="font-label-md text-label-md text-error">New Area</span>
    <span className="font-tabular-nums text-body-lg text-error font-bold">2.18 ha</span>
    </div>
    </div>
    <div className="flex items-start gap-2">
    <span className="material-symbols-outlined text-[16px] text-error mt-0.5">report_problem</span>
    <span className="font-body-sm text-body-sm text-on-surface-variant">Geospatial overlap detected with adjacent parcel <strong>P-1025</strong> (Public Works Dept). Potential encroachment or digitization error.</span>
    </div>
    </div>
    <div className="flex gap-3 mt-2">
    <button className="bg-error text-on-error px-5 py-2.5 rounded-lg font-label-md text-label-md shadow-sm hover:shadow-md transition-shadow flex items-center gap-2">
    <span className="material-symbols-outlined text-[18px]">gavel</span> Initiate Dispute
                      </button>
    <button className="bg-surface text-on-surface px-5 py-2.5 rounded-lg font-label-md text-label-md shadow-sm hover:bg-surface-bright transition-colors flex items-center gap-2 border border-outline-variant/30">
    <span className="material-symbols-outlined text-[18px]">map</span> View Overlay
                      </button>
    </div>
    </div>

    <div className="w-full md:w-64 h-64 bg-surface rounded-xl shadow-inner relative overflow-hidden flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
    <svg className="w-full h-full relative z-10 drop-shadow-md" viewBox="0 0 100 100">

    <polygon fill="var(--tw-colors-surface-container)" points="20,80 80,80 70,30 30,30" stroke="var(--tw-colors-outline)" strokeDasharray="4 2" strokeWidth="1.5"></polygon>

    <polygon fill="var(--tw-colors-error)" fillOpacity="0.15" points="20,80 80,80 85,20 25,15" stroke="var(--tw-colors-error)" strokeWidth="2"></polygon>

    <polygon className="animate-pulse" fill="var(--tw-colors-error)" fillOpacity="0.4" points="70,30 80,80 85,20"></polygon>
    <polygon className="animate-pulse" fill="var(--tw-colors-error)" fillOpacity="0.4" points="30,30 20,80 25,15"></polygon>
    <text className="font-label-md" fill="var(--tw-colors-on-surface)" fontSize="8" textAnchor="middle" x="50" y="55">P-1024</text>
    </svg>
    <div className="absolute bottom-2 right-2 bg-surface/80 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
    <span className="font-tabular-nums text-[10px] font-bold text-error">+9% Area Expansion</span>
    </div>
    </div>
    </div>
    </div>
    </article>
    </div>
    </div>
    </div>
    </div></main>
  );
}
