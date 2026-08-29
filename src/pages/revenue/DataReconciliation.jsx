export default function DataReconciliation() {
  return (
    <main className="relative pt-16 min-h-screen bg-background"><div className="px-8 py-4 flex items-center gap-2 text-label-md text-on-surface-variant"><a className="hover:text-primary" href="#">System</a><span className="material-symbols-outlined text-[14px]">chevron_right</span><span className="text-on-surface font-semibold">Dashboard</span></div><div className="flex flex-col w-full h-full text-on-surface">
    <div className="grid grid-cols-12 gap-gutter px-8 py-4 w-full flex-1">

    <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">

    <div className="flex flex-col gap-2 relative bg-surface-container rounded-xl p-8 shadow-sm overflow-hidden">
    <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>
    <div className="absolute right-32 bottom-0 w-48 h-48 bg-secondary-fixed/20 rounded-full blur-2xl mix-blend-multiply pointer-events-none"></div>
    <div className="flex items-center gap-3 z-10">
    <span className="material-symbols-outlined text-primary bg-primary-fixed p-2 rounded-lg shadow-sm">rebase_edit</span>
    <h1 className="font-headline-lg text-on-surface m-0 tracking-tight">Parcel Data Reconciliation</h1>
    </div>
    <p className="font-body-lg text-on-surface-variant z-10">Compare information from Land Records, GIS, Registration, and Survey for <span className="font-tabular-nums font-bold text-on-surface bg-surface px-2 py-0.5 rounded shadow-sm">ULPIN: P-1024</span>.</p>
    <div className="flex gap-4 mt-4 z-10">
    <button className="bg-primary text-on-primary hover:bg-primary/90 transition-colors px-4 py-2 rounded-lg font-label-md flex items-center gap-2 shadow-md">
    <span className="material-symbols-outlined text-[18px]">architecture</span>
                    Request Field Survey
                </button>
    <button className="bg-surface text-on-surface hover:bg-surface-container-highest transition-colors px-4 py-2 rounded-lg font-label-md flex items-center gap-2 shadow-sm border border-outline-variant/30">
    <span className="material-symbols-outlined text-[18px]">gavel</span>
                    Create Case
                </button>
    <button className="bg-surface text-on-surface hover:bg-surface-container-highest transition-colors px-4 py-2 rounded-lg font-label-md flex items-center gap-2 shadow-sm border border-outline-variant/30">
    <span className="material-symbols-outlined text-[18px]">description</span>
                    View Evidence
                </button>
    </div>
    </div>

    <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col">
    <div className="px-6 py-4 bg-surface-container flex items-center justify-between border-b border-outline-variant/20">
    <h2 className="font-headline-md text-on-surface m-0 flex items-center gap-2">
    <span className="material-symbols-outlined text-[20px] text-primary">table_chart</span>
                Multi-Source Comparison
              </h2>
    <div className="flex items-center gap-2 font-label-md text-on-surface-variant bg-surface px-3 py-1.5 rounded-full shadow-sm">
    <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                 1 Mismatch Detected
              </div>
    </div>
    <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse min-w-[800px]">
    <thead>
    <tr className="bg-surface-container-low font-label-md text-on-surface-variant border-b border-outline-variant/30 uppercase tracking-wider">
    <th className="py-3 px-6 whitespace-nowrap sticky left-0 bg-surface-container-low z-10 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">Attribute</th>
    <th className="py-3 px-6 whitespace-nowrap">Land Record (RoR)</th>
    <th className="py-3 px-6 whitespace-nowrap">GIS</th>
    <th className="py-3 px-6 whitespace-nowrap">Registration</th>
    <th className="py-3 px-6 whitespace-nowrap">Survey</th>
    <th className="py-3 px-6 whitespace-nowrap text-right">Status</th>
    </tr>
    </thead>
    <tbody className="font-tabular-nums text-body-md text-on-surface">

    <tr className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors group">
    <td className="py-4 px-6 sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-lowest/50 z-10 font-label-md text-on-surface shadow-[2px_0_4px_rgba(0,0,0,0.02)]">Primary Owner</td>
    <td className="py-4 px-6">Rajesh Kumar</td>
    <td className="py-4 px-6 text-on-surface-variant italic">N/A</td>
    <td className="py-4 px-6">Rajesh Kumar</td>
    <td className="py-4 px-6 text-on-surface-variant italic">N/A</td>
    <td className="py-4 px-6 text-right">
    <span className="inline-flex items-center gap-1.5 bg-secondary-container/50 text-on-secondary-container px-2.5 py-1 rounded-full font-label-md">
    <span className="material-symbols-outlined text-[14px]">check_circle</span> Match
                      </span>
    </td>
    </tr>

    <tr className="border-b border-error/20 bg-error-container/10 hover:bg-error-container/20 transition-colors group relative">
    <td className="py-4 px-6 sticky left-0 bg-error-container/10 group-hover:bg-error-container/20 z-10 font-label-md text-on-error-container shadow-[2px_0_4px_rgba(0,0,0,0.02)] flex items-center gap-2">
    <span className="material-symbols-outlined text-[16px] text-error">warning</span>
                        Total Area
                    </td>
    <td className="py-4 px-6 font-bold">2.00 ha</td>
    <td className="py-4 px-6 font-bold text-error">2.18 ha</td>
    <td className="py-4 px-6">2.00 ha</td>
    <td className="py-4 px-6 font-bold text-error">2.17 ha</td>
    <td className="py-4 px-6 text-right">
    <span className="inline-flex items-center gap-1.5 bg-error/10 text-error px-2.5 py-1 rounded-full font-label-md shadow-sm ring-1 ring-error/20">
    <span className="material-symbols-outlined text-[14px]">error</span> Mismatch
                      </span>
    </td>
    </tr>

    <tr className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors group">
    <td className="py-4 px-6 sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-lowest/50 z-10 font-label-md text-on-surface shadow-[2px_0_4px_rgba(0,0,0,0.02)]">Survey No.</td>
    <td className="py-4 px-6">45/2B</td>
    <td className="py-4 px-6">45/2B</td>
    <td className="py-4 px-6">45/2B</td>
    <td className="py-4 px-6">45/2B</td>
    <td className="py-4 px-6 text-right">
    <span className="inline-flex items-center gap-1.5 bg-secondary-container/50 text-on-secondary-container px-2.5 py-1 rounded-full font-label-md">
    <span className="material-symbols-outlined text-[14px]">check_circle</span> Match
                      </span>
    </td>
    </tr>

    <tr className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors group">
    <td className="py-4 px-6 sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-lowest/50 z-10 font-label-md text-on-surface shadow-[2px_0_4px_rgba(0,0,0,0.02)]">Land Use</td>
    <td className="py-4 px-6">Agricultural</td>
    <td className="py-4 px-6">Agricultural</td>
    <td className="py-4 px-6">Agricultural</td>
    <td className="py-4 px-6">Agricultural</td>
    <td className="py-4 px-6 text-right">
    <span className="inline-flex items-center gap-1.5 bg-secondary-container/50 text-on-secondary-container px-2.5 py-1 rounded-full font-label-md">
    <span className="material-symbols-outlined text-[14px]">check_circle</span> Match
                      </span>
    </td>
    </tr>

    <tr className="hover:bg-surface-container-lowest/50 transition-colors group">
    <td className="py-4 px-6 sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-lowest/50 z-10 font-label-md text-on-surface shadow-[2px_0_4px_rgba(0,0,0,0.02)]">Boundary Coordinates</td>
    <td className="py-4 px-6 text-on-surface-variant italic">Refer Text</td>
    <td className="py-4 px-6">Valid Geometry</td>
    <td className="py-4 px-6 text-on-surface-variant italic">N/A</td>
    <td className="py-4 px-6">Valid Geometry</td>
    <td className="py-4 px-6 text-right">
    <span className="inline-flex items-center gap-1.5 bg-secondary-container/50 text-on-secondary-container px-2.5 py-1 rounded-full font-label-md">
    <span className="material-symbols-outlined text-[14px]">info</span> Verified
                      </span>
    </td>
    </tr>
    </tbody></table>
    </div>
    </div>

    <div className="h-64 rounded-xl shadow-md overflow-hidden relative group">
    <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" data-alt="Overhead aerial satellite view of agricultural land parcels with clear boundary lines drawn in neon cyan and magenta, representing a GIS interface. High contrast, technical aesthetic, conveying precision mapping." data-location="Agricultural Fields, Gujarat, India" style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuAtDAxCMgJ_2YrQqhDcf-eFmJ-dWEZZr0NelhHmjpiJC2kNE5Wu9gJbbOZEuz3UC9ie1C3TKsLfeS1Ee0n1JaBSRpj2ArNWs4T8yZAK3GQeZIljfGf82bbrgM1x9UUsP_Nj5v7sBspA8vuScL1V_bVuu1sGqkzKY0RMrYnbq_UqbhA9EBwJjNn93fwVyoLdeDL4V0QjsK5-GMa5209d6BQhN_k8qYwFP_801SJ06Sz0nxQxuKwdN3k\')'}}></div>

    <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-md rounded-lg shadow-lg p-1.5 flex flex-col gap-1 border border-outline-variant/30">
    <button className="w-8 h-8 flex items-center justify-center rounded bg-surface text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"><span className="material-symbols-outlined text-[18px]">add</span></button>
    <button className="w-8 h-8 flex items-center justify-center rounded bg-surface text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"><span className="material-symbols-outlined text-[18px]">remove</span></button>
    <div className="h-[1px] w-full bg-outline-variant/30 my-1"></div>
    <button className="w-8 h-8 flex items-center justify-center rounded bg-surface text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"><span className="material-symbols-outlined text-[18px]">layers</span></button>
    </div>
    <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-md rounded-lg shadow-lg px-3 py-2 flex items-center gap-3 border border-outline-variant/30">
    <div className="flex items-center gap-1.5 text-label-md"><span className="w-3 h-[2px] bg-cyan-500"></span> GIS Boundary</div>
    <div className="flex items-center gap-1.5 text-label-md"><span className="w-3 h-[2px] bg-error"></span> RoR Boundary</div>
    </div>
    </div>
    </div>

    <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">

    <div className="bg-surface-container-highest rounded-xl shadow-md p-6 flex flex-col relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
    <div className="flex items-center gap-2 mb-4">
    <span className="material-symbols-outlined text-primary animate-pulse">smart_toy</span>
    <h3 className="font-headline-md text-on-surface m-0">AI-Assisted Analysis</h3>
    </div>
    <div className="bg-surface rounded-lg p-4 shadow-sm border border-outline-variant/20 mb-4 relative z-10">
    <p className="font-body-md text-on-surface leading-relaxed m-0">
                Discrepancy flagged: GIS calculated area (<span className="font-bold text-error">2.18 ha</span>) exceeds the Land Record (RoR) stated area (<span className="font-bold">2.00 ha</span>) by <span className="font-tabular-nums text-error">9%</span>.
              </p>
    </div>
    <div className="space-y-4 relative z-10">
    <div className="flex gap-3">
    <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">history</span>
    <div>
    <h4 className="font-label-md text-on-surface mb-1 uppercase tracking-wider">Historical Context</h4>
    <p className="font-body-sm text-on-surface-variant m-0">Historical physical survey from 1998 recorded the parcel area as 2.17 ha, closely aligning with current GIS spatial data.</p>
    </div>
    </div>
    <div className="flex gap-3">
    <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">policy</span>
    <div>
    <h4 className="font-label-md text-on-surface mb-1 uppercase tracking-wider">Regulatory Rule</h4>
    <p className="font-body-sm text-on-surface-variant m-0">Area discrepancies &gt;5% mandate a mandatory physical re-survey before ownership transfer or mutation can proceed.</p>
    </div>
    </div>
    </div>
    <div className="mt-6 pt-4 border-t border-outline-variant/20 flex flex-col gap-2 z-10">
    <span className="font-label-md text-on-surface-variant uppercase tracking-widest text-[10px]">Confidence Score</span>
    <div className="w-full bg-surface-container-low rounded-full h-2 overflow-hidden shadow-inner">
    <div className="bg-primary h-full rounded-full w-[94%]" style={{transition: 'width 1s ease-in-out'}}></div>
    </div>
    <div className="flex justify-between font-tabular-nums text-label-md text-on-surface-variant">
    <span>0%</span>
    <span className="text-primary font-bold">94%</span>
    </div>
    </div>
    </div>

    <div className="bg-surface rounded-xl shadow-sm p-6 border border-outline-variant/20">
    <h3 className="font-headline-md text-on-surface mb-4 flex items-center gap-2">
    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">info</span>
                Parcel Metadata
             </h3>
    <dl className="grid grid-cols-1 gap-y-3 font-body-sm">
    <div className="flex justify-between py-1 border-b border-outline-variant/10">
    <dt className="text-on-surface-variant">Last Synced</dt>
    <dd className="font-tabular-nums text-on-surface font-medium">Oct 12, 2023 14:32</dd>
    </div>
    <div className="flex justify-between py-1 border-b border-outline-variant/10">
    <dt className="text-on-surface-variant">Sub-District</dt>
    <dd className="text-on-surface font-medium">North Block A</dd>
    </div>
    <div className="flex justify-between py-1 border-b border-outline-variant/10">
    <dt className="text-on-surface-variant">Village Code</dt>
    <dd className="font-tabular-nums text-on-surface font-medium">V-90821</dd>
    </div>
    <div className="flex justify-between py-1 border-b border-outline-variant/10">
    <dt className="text-on-surface-variant">Data Source</dt>
    <dd className="text-on-surface font-medium flex items-center gap-1">
    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                        NIC LandGrid API
                    </dd>
    </div>
    </dl>
    </div>
    </div>
    </div>
    </div></main>
  );
}
