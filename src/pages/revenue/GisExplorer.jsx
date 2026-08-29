import { useState } from "react";

export default function GisExplorer() {
  // Replaces the original inline onclick that toggled the
  // `translate-x-full` class directly on #parcel-drawer.
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <main className="relative pt-16 min-h-screen bg-background"><div className="px-8 py-4 flex items-center gap-2 text-label-md text-on-surface-variant"><a className="hover:text-primary" href="#">System</a><span className="material-symbols-outlined text-[14px]">chevron_right</span><span className="text-on-surface font-semibold">Dashboard</span></div><div className="flex flex-col w-full h-[calc(100vh-64px)] overflow-hidden">



            <div className="flex flex-row w-full h-full relative">

    <div className="w-80 flex-shrink-0 bg-surface border-r border-outline-variant/30 flex flex-col h-full z-10 shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
    <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low">
    <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Parcel Explorer</h2>
    <p className="font-body-sm text-body-sm text-on-surface-variant">Search and analyze cadastral records</p>
    </div>
    <div className="p-4 flex-1 overflow-y-auto space-y-5">
    <div className="space-y-1.5">
    <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Universal Land PIN (ULPIN)</label>
    <div className="relative">
    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">tag</span>
    <input className="w-full pl-9 pr-3 py-2 bg-surface-container rounded border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-sm text-body-sm text-on-surface transition-all placeholder:text-on-surface-variant/50" placeholder="e.g. 09-XXXX-XXXX" type="text" />
    </div>
    </div>
    <div className="space-y-1.5">
    <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Survey / Khasra No.</label>
    <div className="relative">
    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">map</span>
    <input className="w-full pl-9 pr-3 py-2 bg-surface-container rounded border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-sm text-body-sm text-on-surface transition-all placeholder:text-on-surface-variant/50" placeholder="e.g. 145/2" type="text" />
    </div>
    </div>
    <div className="space-y-1.5">
    <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Owner Name</label>
    <div className="relative">
    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">person</span>
    <input className="w-full pl-9 pr-3 py-2 bg-surface-container rounded border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-sm text-body-sm text-on-surface transition-all placeholder:text-on-surface-variant/50" placeholder="Search by name" type="text" />
    </div>
    </div>
    <div className="grid grid-cols-2 gap-3 pt-2">
    <div className="space-y-1.5">
    <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Village</label>
    <select className="w-full px-3 py-2 bg-surface-container rounded border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-sm text-body-sm text-on-surface appearance-none">
    <option>Select</option>
    <option selected="">Rampur</option>
    <option>Sitapur</option>
    </select>
    </div>
    <div className="space-y-1.5">
    <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tehsil</label>
    <select className="w-full px-3 py-2 bg-surface-container rounded border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-sm text-body-sm text-on-surface appearance-none">
    <option>Select</option>
    <option selected="">Sadar</option>
    <option>Karchhana</option>
    </select>
    </div>
    </div>
    <div className="pt-4 border-t border-outline-variant/30">
    <button className="w-full py-2.5 bg-primary text-on-primary rounded font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
    <span className="material-symbols-outlined text-[18px]">search</span>
                            Search Parcels
                        </button>
    <button className="w-full py-2.5 mt-2 bg-transparent text-primary border border-primary rounded font-label-md text-label-md hover:bg-primary/5 transition-colors">
                            Clear Filters
                        </button>
    </div>
    </div>

    <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/30">
    <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2">Map Legend</h3>
    <div className="space-y-2">
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-sm border border-outline bg-surface"></div>
    <span className="font-body-sm text-body-sm text-on-surface">Standard Parcel</span>
    </div>
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-sm border border-error bg-error/20"></div>
    <span className="font-body-sm text-body-sm text-on-surface">Disputed Boundary</span>
    </div>
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-sm border border-tertiary bg-tertiary/20"></div>
    <span className="font-body-sm text-body-sm text-on-surface">Selected (P-1024)</span>
    </div>
    </div>
    </div>
    </div>

    <div className="flex-1 relative bg-surface-dim overflow-hidden">

    <div className="absolute inset-0 w-full h-full bg-cover bg-center" data-alt="Aerial view of agricultural land plots with visible boundaries, overlayed with a digital grid and semi-transparent cadastral lines in blue and orange. Enterprise GIS interface style, high tech, clear distinct plots." data-location="Rampur Cadastral Map" style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuCzUc5BCN_8wnPZfvfxbrOskfdQT_LazLujnIjzUZdVe1N53OoK8bjWBduzEPrppQrlD8q-oUR0-SCOw-NyQU_gqBDeAUHXkiT6I-H7lzfqaDB-kaKR0E7VYVku4nbx-uUvIodOnHPBN8VF2e3x-DzEp_XBQV-oJzBwCLtoTy-icUqoY1xU7gomKWweraX26N-To3fxRFvK_5-qadeizQCgYrFAPeJ-Wwc1penmy30fUqg9QZXnwCo\')'}}>

    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 800">
    <defs>
    <pattern height="40" id="grid" patternunits="userSpaceOnUse" width="40">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"></path>
    </pattern>
    </defs>
    <rect fill="url(#grid)" height="100%" width="100% "></rect>

    <g stroke="rgba(0,0,0,0.6)" strokeWidth="1.5">

    <path d="M100,100 L250,90 L270,200 L120,220 Z" fill="rgba(248, 249, 255, 0.4)"></path>
    <text className="font-tabular-nums text-[10px]" fill="#0b1c30" textAnchor="middle" x="180" y="160">P-1021</text>
    <path d="M250,90 L400,80 L380,180 L270,200 Z" fill="rgba(248, 249, 255, 0.4)"></path>
    <text className="font-tabular-nums text-[10px]" fill="#0b1c30" textAnchor="middle" x="320" y="140">P-1022</text>
    <path d="M400,80 L550,110 L520,240 L380,180 Z" fill="rgba(248, 249, 255, 0.4)"></path>
    <text className="font-tabular-nums text-[10px]" fill="#0b1c30" textAnchor="middle" x="460" y="160">P-1023</text>

    <path d="M120,220 L270,200 L250,350 L100,340 Z" fill="rgba(186, 26, 26, 0.15)" stroke="#ba1a1a" strokeDasharray="4" strokeWidth="2"></path>
    <text className="font-tabular-nums text-[10px]" fill="#ba1a1a" textAnchor="middle" x="180" y="280">P-1025</text>
    <circle cx="210" cy="275" fill="#ba1a1a" r="8"></circle>
    <text className="font-tabular-nums text-[10px]" fill="#ffffff" textAnchor="middle" x="210" y="279">!</text>

    <path className="cursor-pointer hover:fill-black/30 transition-all cursor-pointer" d="M270,200 L380,180 L420,320 L250,350 Z" fill="rgba(0, 0, 0, 0.25)" stroke="#000000" strokeWidth="3" onClick={() => setDrawerOpen(true)}></path>
    <text className="font-tabular-nums text-[14px] font-bold" fill="#000000" textAnchor="middle" x="330" y="270">P-1024</text>

    <path d="M380,180 L520,240 L490,400 L420,320 Z" fill="rgba(248, 249, 255, 0.4)"></path>
    <text className="font-tabular-nums text-[10px]" fill="#0b1c30" textAnchor="middle" x="450" y="280">P-1026</text>
    </g>
    </svg>
    </div>

    <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
    <div className="bg-surface/90 backdrop-blur-md rounded shadow-sm border border-outline-variant/30 flex flex-col overflow-hidden">
    <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors border-b border-outline-variant/30">
    <span className="material-symbols-outlined text-[20px]">add</span>
    </button>
    <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">
    <span className="material-symbols-outlined text-[20px]">remove</span>
    </button>
    </div>
    <div className="bg-surface/90 backdrop-blur-md rounded shadow-sm border border-outline-variant/30 flex flex-col overflow-hidden mt-2">
    <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors border-b border-outline-variant/30" title="Toggle Layers">
    <span className="material-symbols-outlined text-[20px]">layers</span>
    </button>
    <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors" title="Measure Area">
    <span className="material-symbols-outlined text-[20px]">square_foot</span>
    </button>
    </div>
    </div>

    <div className="absolute bottom-4 left-4 bg-surface/80 backdrop-blur-sm px-3 py-1.5 rounded border border-outline-variant/30 shadow-sm z-20">
    <span className="font-tabular-nums text-[11px] text-on-surface-variant">25.32°N, 81.56°E | Scale 1:2000</span>
    </div>
    </div>

    <div className={`w-96 flex-shrink-0 bg-surface border-l border-outline-variant/30 flex flex-col h-full z-30 shadow-[-4px_0_12px_rgba(0,0,0,0.04)] transform transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>

    <div className="p-5 border-b border-outline-variant/30 bg-surface-bright flex items-start justify-between relative overflow-hidden">
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container rounded-full opacity-5 blur-xl"></div>
    <div>
    <div className="flex items-center gap-2 mb-1">
    <span className="px-2 py-0.5 rounded-sm bg-tertiary/10 text-tertiary font-label-md text-[10px] uppercase tracking-widest border border-tertiary/20">Selected</span>
    <span className="font-tabular-nums font-bold text-body-sm text-on-surface-variant">P-1024</span>
    </div>
    <h2 className="font-headline-md text-headline-md text-on-surface">Parcel Intelligence</h2>
    <p className="font-tabular-nums text-body-sm text-on-surface-variant mt-1">ULPIN: <span className="text-on-surface font-medium">09-XXXX-XXXX-1024</span></p>
    </div>
    <button
      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors"
      onClick={() => setDrawerOpen(false)}
    >
    <span className="material-symbols-outlined text-[20px]">close</span>
    </button>
    </div>
    <div className="flex-1 overflow-y-auto">

    <div className="grid grid-cols-2 gap-px bg-outline-variant/20 border-b border-outline-variant/30">
    <div className="bg-surface p-4">
    <span className="block font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Survey No.</span>
    <span className="font-tabular-nums text-body-md font-medium text-on-surface">145/2</span>
    </div>
    <div className="bg-surface p-4">
    <span className="block font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Total Area</span>
    <span className="font-tabular-nums text-body-md font-medium text-on-surface">2.00 ha</span>
    </div>
    <div className="bg-surface p-4">
    <span className="block font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Village</span>
    <span className="font-body-md font-medium text-on-surface">Example</span>
    </div>
    <div className="bg-surface p-4">
    <span className="block font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Land Type</span>
    <span className="font-body-md font-medium text-on-surface">Agricultural</span>
    </div>
    </div>

    <div className="p-5 space-y-4">
    <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/30 pb-2">Reconciliation Status</h3>
    <ul className="space-y-3">

    <li className="flex items-start gap-3 bg-surface-container-lowest p-3 rounded border border-outline-variant/30">
    <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-fixed flex items-center justify-center flex-shrink-0 mt-0.5">
    <span className="material-symbols-outlined text-[14px]">check</span>
    </div>
    <div>
    <span className="block font-label-md text-label-md text-on-surface">Ownership Sync</span>
    <span className="block font-body-sm text-[12px] text-on-surface-variant mt-0.5">Title deed matches local registry database.</span>
    </div>
    </li>

    <li className="flex items-start gap-3 bg-error/5 p-3 rounded border border-error/20 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
    <div className="w-6 h-6 rounded-full bg-error text-on-error flex items-center justify-center flex-shrink-0 mt-0.5">
    <span className="material-symbols-outlined text-[14px]">warning</span>
    </div>
    <div>
    <span className="block font-label-md text-label-md text-error">Area Mismatch</span>
    <span className="block font-body-sm text-[12px] text-on-surface-variant mt-0.5">GIS computed area (2.05 ha) exceeds documented area (2.00 ha) beyond tolerance.</span>
    </div>
    </li>

    <li className="flex items-start gap-3 bg-error/5 p-3 rounded border border-error/20 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
    <div className="w-6 h-6 rounded-full bg-error text-on-error flex items-center justify-center flex-shrink-0 mt-0.5">
    <span className="material-symbols-outlined text-[14px]">warning</span>
    </div>
    <div>
    <span className="block font-label-md text-label-md text-error">Boundary Overlap</span>
    <span className="block font-body-sm text-[12px] text-on-surface-variant mt-0.5">Southern edge intersects with adjacent parcel P-1025 by 0.5m.</span>
    </div>
    </li>

    <li className="flex items-start gap-3 bg-error/5 p-3 rounded border border-error/20 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
    <div className="w-6 h-6 rounded-full bg-error text-on-error flex items-center justify-center flex-shrink-0 mt-0.5">
    <span className="material-symbols-outlined text-[14px]">history</span>
    </div>
    <div>
    <span className="block font-label-md text-label-md text-error">Pending Mutation</span>
    <span className="block font-body-sm text-[12px] text-on-surface-variant mt-0.5">Unresolved mutation request #M-2023-45 from Oct 12, 2023.</span>
    </div>
    </li>
    </ul>
    </div>
    </div>

    <div className="p-4 border-t border-outline-variant/30 bg-surface-bright space-y-2">
    <button className="w-full py-2.5 bg-primary text-on-primary rounded font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
    <span className="material-symbols-outlined text-[18px]">rebase_edit</span>
                        View Reconciliation
                    </button>
    <div className="grid grid-cols-2 gap-2">
    <button className="py-2 px-3 bg-surface text-primary border border-primary/30 rounded font-label-md text-label-md flex items-center justify-center gap-1.5 hover:bg-primary/5 transition-colors">
    <span className="material-symbols-outlined text-[16px]">history</span>
                            History
                        </button>
    <button className="py-2 px-3 bg-error/10 text-error border border-error/20 rounded font-label-md text-label-md flex items-center justify-center gap-1.5 hover:bg-error/20 transition-colors">
    <span className="material-symbols-outlined text-[16px]">gavel</span>
                            Open Case
                        </button>
    </div>
    </div>
    </div>
    </div>
    </div>
    </main>
  );
}
