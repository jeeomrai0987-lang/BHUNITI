export default function AuditTrail() {
  return (
    <main className="w-full pt-16 bg-surface min-h-screen"><div className="flex flex-col w-full h-full pb-16">
    <div className="px-margin-mobile lg:px-margin-desktop py-8 max-w-7xl mx-auto w-full flex-grow">
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
    <div>
    <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">System Audit Trail</h1>
    <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">View a comprehensive, immutable log of all administrative actions, data changes, and system-detected discrepancies. Events are digitally signed and chronologically ordered.</p>
    </div>
    <div className="flex gap-3">
    <button className="bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md text-label-md px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
    <span className="material-symbols-outlined text-[18px]">download</span> Export Log
            </button>
    <button className="bg-primary hover:bg-primary/90 text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
    <span className="material-symbols-outlined text-[18px]">verified_user</span> Verify Chain
            </button>
    </div>
    </header>
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border-none mb-6">
    <div className="p-4 border-b border-outline-variant/30 flex flex-col lg:flex-row gap-4 items-center justify-between">
    <div className="relative w-full lg:w-96">
    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
    <input className="w-full bg-surface-container pl-10 pr-4 py-2 rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Search by ULPIN, Case ID, or Actor..." type="text" />
    </div>
    <div className="flex flex-wrap gap-3 w-full lg:w-auto">
    <div className="relative">
    <select className="appearance-none bg-surface-container pl-4 pr-10 py-2 rounded-lg font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer">
    <option>All Date Ranges</option>
    <option>Last 24 Hours</option>
    <option>Last 7 Days</option>
    <option>Last 30 Days</option>
    </select>
    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
    </div>
    <div className="relative">
    <select className="appearance-none bg-surface-container pl-4 pr-10 py-2 rounded-lg font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer">
    <option>All Actors</option>
    <option>Revenue Officers</option>
    <option>Citizens</option>
    <option>System (Automated)</option>
    </select>
    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
    </div>
    <div className="relative">
    <select className="appearance-none bg-surface-container pl-4 pr-10 py-2 rounded-lg font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer">
    <option>All Categories</option>
    <option>Administrative</option>
    <option>Geospatial</option>
    <option>Document</option>
    <option>System</option>
    </select>
    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
    </div>
    </div>
    </div>
    <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
    <thead>
    <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
    <th className="py-3 px-4 font-semibold whitespace-nowrap">Timestamp</th>
    <th className="py-3 px-4 font-semibold">Actor</th>
    <th className="py-3 px-4 font-semibold">Action & Target</th>
    <th className="py-3 px-4 font-semibold">Change Detail</th>
    <th className="py-3 px-4 font-semibold text-right">Verification</th>
    </tr>
    </thead>
    <tbody className="font-body-sm text-body-sm align-top">
    <tr className="border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors group">
    <td className="py-4 px-4 whitespace-nowrap">
    <div className="font-tabular-nums text-on-surface">24 Oct 2023</div>
    <div className="font-tabular-nums text-on-surface-variant text-[11px] mt-1">10:45:22 AM UTC+5.5</div>
    </td>
    <td className="py-4 px-4">
    <div className="font-medium text-on-surface">K. Sharma</div>
    <div className="text-on-surface-variant text-[11px] mt-1">Revenue Officer</div>
    <div className="font-tabular-nums text-on-surface-variant text-[10px] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">IP: 192.168.1.45</div>
    </td>
    <td className="py-4 px-4">
    <div className="flex items-center gap-2 mb-1">
    <span className="w-2 h-2 rounded-full bg-secondary"></span>
    <span className="font-medium text-on-surface">Mutation Approved</span>
    </div>
    <div className="font-tabular-nums text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded text-[11px] inline-block">M-2026-018</div>
    </td>
    <td className="py-4 px-4 max-w-xs">
    <div className="text-on-surface truncate" title="Status updated from Pending to Approved">Status updated from <span className="line-through text-on-surface-variant">Pending</span> to <span className="font-medium text-primary">Approved</span></div>
    </td>
    <td className="py-4 px-4 text-right">
    <div className="inline-flex items-center gap-1 bg-surface-container px-2 py-1 rounded text-[10px] font-label-md text-on-surface-variant">
    <span className="material-symbols-outlined text-[14px]">vpn_key</span> Signed
                    </div>
    </td>
    </tr>
    <tr className="border-b border-outline-variant/20 bg-error-container/10 hover:bg-error-container/20 transition-colors group relative">
    <td className="py-4 px-4 whitespace-nowrap border-l-2 border-error">
    <div className="font-tabular-nums text-on-surface">24 Oct 2023</div>
    <div className="font-tabular-nums text-on-surface-variant text-[11px] mt-1">09:12:04 AM UTC+5.5</div>
    </td>
    <td className="py-4 px-4">
    <div className="font-medium text-on-surface flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-error">smart_toy</span> NAKSHA GIS</div>
    <div className="text-on-surface-variant text-[11px] mt-1">System (Automated)</div>
    <div className="font-tabular-nums text-on-surface-variant text-[10px] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">Node: GIS-SYNC-04</div>
    </td>
    <td className="py-4 px-4">
    <div className="flex items-center gap-2 mb-1">
    <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
    <span className="font-medium text-on-error-container">Discrepancy Detected</span>
    </div>
    <div className="font-tabular-nums text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded text-[11px] inline-block">Parcel P-1024</div>
    </td>
    <td className="py-4 px-4 max-w-md">
    <div className="text-on-surface mb-2 font-medium">Area mismatch flagged during automated GIS-Record reconciliation.</div>
    <div className="grid grid-cols-2 gap-2 text-[11px] bg-surface-container-lowest p-2 rounded border border-outline-variant/20">
    <div>
    <span className="text-on-surface-variant block mb-0.5">Previous Value (Textual)</span>
    <span className="font-tabular-nums text-on-surface font-medium">2.00 ha</span>
    </div>
    <div>
    <span className="text-on-surface-variant block mb-0.5">New Value (GIS Derived)</span>
    <span className="font-tabular-nums text-error font-medium">2.18 ha</span>
    </div>
    </div>
    </td>
    <td className="py-4 px-4 text-right">
    <div className="inline-flex items-center gap-1 bg-surface-container px-2 py-1 rounded text-[10px] font-label-md text-on-surface-variant">
    <span className="material-symbols-outlined text-[14px]">link</span> Chain Verified
                    </div>
    </td>
    </tr>
    <tr className="border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors group">
    <td className="py-4 px-4 whitespace-nowrap">
    <div className="font-tabular-nums text-on-surface">23 Oct 2023</div>
    <div className="font-tabular-nums text-on-surface-variant text-[11px] mt-1">16:30:00 PM UTC+5.5</div>
    </td>
    <td className="py-4 px-4">
    <div className="font-medium text-on-surface">A. Patel</div>
    <div className="text-on-surface-variant text-[11px] mt-1">Document Verifier</div>
    <div className="font-tabular-nums text-on-surface-variant text-[10px] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">IP: 10.0.4.22</div>
    </td>
    <td className="py-4 px-4">
    <div className="flex items-center gap-2 mb-1">
    <span className="w-2 h-2 rounded-full bg-primary-fixed-dim"></span>
    <span className="font-medium text-on-surface">Document Attached</span>
    </div>
    <div className="font-tabular-nums text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded text-[11px] inline-block">Deed D-7729</div>
    </td>
    <td className="py-4 px-4 max-w-xs">
    <div className="text-on-surface truncate">Sale Deed scanned and appended to property record.</div>
    </td>
    <td className="py-4 px-4 text-right">
    <div className="inline-flex items-center gap-1 bg-surface-container px-2 py-1 rounded text-[10px] font-label-md text-on-surface-variant">
    <span className="material-symbols-outlined text-[14px]">vpn_key</span> Signed
                    </div>
    </td>
    </tr>
    <tr className="border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors group">
    <td className="py-4 px-4 whitespace-nowrap">
    <div className="font-tabular-nums text-on-surface">23 Oct 2023</div>
    <div className="font-tabular-nums text-on-surface-variant text-[11px] mt-1">14:05:11 PM UTC+5.5</div>
    </td>
    <td className="py-4 px-4">
    <div className="font-medium text-on-surface">System</div>
    <div className="text-on-surface-variant text-[11px] mt-1">Automated Task</div>
    <div className="font-tabular-nums text-on-surface-variant text-[10px] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">Node: DB-MAINT-01</div>
    </td>
    <td className="py-4 px-4">
    <div className="flex items-center gap-2 mb-1">
    <span className="w-2 h-2 rounded-full bg-outline-variant"></span>
    <span className="font-medium text-on-surface">Backup Completed</span>
    </div>
    <div className="font-tabular-nums text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded text-[11px] inline-block">SYS-BKP-Daily</div>
    </td>
    <td className="py-4 px-4 max-w-xs">
    <div className="text-on-surface truncate">Daily snapshot created successfully. Size: 4.2TB.</div>
    </td>
    <td className="py-4 px-4 text-right">
    <div className="inline-flex items-center gap-1 bg-surface-container px-2 py-1 rounded text-[10px] font-label-md text-on-surface-variant">
    <span className="material-symbols-outlined text-[14px]">link</span> Chain Verified
                    </div>
    </td>
    </tr>
    </tbody>
    </table>
    </div>
    <div className="p-4 border-t border-outline-variant/30 flex items-center justify-between">
    <span className="font-body-sm text-body-sm text-on-surface-variant">Showing 1-4 of 1,248 entries</span>
    <div className="flex gap-1">
    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant disabled:opacity-50" disabled=""><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
    <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-label-md text-label-md">1</button>
    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant font-label-md text-label-md">2</button>
    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant font-label-md text-label-md">3</button>
    <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">...</span>
    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
    </div>
    </div>
    </div>
    </div>
    </div></main>
  );
}
