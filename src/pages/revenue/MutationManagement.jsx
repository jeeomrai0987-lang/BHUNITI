export default function MutationManagement() {
  return (
    <main className="relative pt-16 min-h-screen bg-background"><div className="px-8 py-4 flex items-center gap-2 text-label-md text-on-surface-variant"><a className="hover:text-primary" href="#">System</a><span className="material-symbols-outlined text-[14px]">chevron_right</span><span className="text-on-surface font-semibold">Dashboard</span></div><div className="flex flex-col w-full relative">

    <div className="px-8 pt-8 pb-6 bg-surface grid grid-cols-4 gap-6">
    <div className="bg-surface-container rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-pointer">
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-fixed/30 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
    <div className="flex justify-between items-start">
    <span className="font-body-sm text-on-surface-variant uppercase tracking-wider">Pending</span>
    <span className="material-symbols-outlined text-primary">pending_actions</span>
    </div>
    <div className="font-display text-on-surface mt-2">142</div>
    <div className="font-label-md text-on-surface-variant flex items-center gap-1">
    <span className="material-symbols-outlined text-[14px] text-error">arrow_upward</span>
                    12% vs last week
                </div>
    </div>
    <div className="bg-surface-container rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-pointer">
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-fixed/30 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
    <div className="flex justify-between items-start">
    <span className="font-body-sm text-on-surface-variant uppercase tracking-wider">Under Verification</span>
    <span className="material-symbols-outlined text-secondary">verified_user</span>
    </div>
    <div className="font-display text-on-surface mt-2">87</div>
    <div className="font-label-md text-on-surface-variant flex items-center gap-1">
    <span className="material-symbols-outlined text-[14px] text-primary">arrow_downward</span>
                    5% vs last week
                </div>
    </div>
    <div className="bg-surface-container rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-pointer">
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary-fixed/30 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
    <div className="flex justify-between items-start">
    <span className="font-body-sm text-on-surface-variant uppercase tracking-wider">Awaiting Docs</span>
    <span className="material-symbols-outlined text-on-tertiary-fixed-variant">folder_open</span>
    </div>
    <div className="font-display text-on-surface mt-2">34</div>
    <div className="font-label-md text-on-surface-variant flex items-center gap-1">
    <span className="material-symbols-outlined text-[14px] text-primary">horizontal_rule</span>
                    No change
                </div>
    </div>
    <div className="bg-primary rounded-2xl p-6 shadow-lg flex flex-col gap-2 relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-pointer">
    <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
    <div className="flex justify-between items-start">
    <span className="font-body-sm text-on-primary/80 uppercase tracking-wider">Approved (Today)</span>
    <span className="material-symbols-outlined text-on-primary">task_alt</span>
    </div>
    <div className="font-display text-on-primary mt-2">28</div>
    <div className="font-label-md text-on-primary/80 flex items-center gap-1">
    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                    On track for daily goal
                </div>
    </div>
    </div>

    <div className="px-8 pb-12 flex gap-8">

    <div className="flex-1 flex flex-col gap-8">

    <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm relative overflow-hidden">
    <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
    <div className="flex justify-between items-start">
    <div>
    <div className="flex items-center gap-3 mb-2">
    <span className="bg-primary-container text-on-primary-container font-label-md px-3 py-1 rounded-full">Sale Mutation</span>
    <span className="bg-error-container text-on-error-container font-label-md px-3 py-1 rounded-full flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">warning</span> Discrepancy Detected</span>
    </div>
    <h1 className="font-display text-on-surface mb-1">M-2026-018</h1>
    <p className="font-body-lg text-on-surface-variant">Linked to Parcel ID: <a className="text-primary hover:underline font-semibold" href="#">P-1024</a></p>
    </div>
    <div className="flex gap-3">
    <button className="bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors px-6 py-2.5 rounded-full font-label-md shadow-sm flex items-center gap-2">
    <span className="material-symbols-outlined text-[18px]">block</span> Reject
                            </button>
    <button className="bg-surface text-on-surface hover:bg-surface-variant transition-colors px-6 py-2.5 rounded-full font-label-md shadow-sm flex items-center gap-2">
    <span className="material-symbols-outlined text-[18px]">contact_support</span> Request Clarification
                            </button>
    <button className="bg-primary text-on-primary hover:bg-primary/90 transition-colors px-6 py-2.5 rounded-full font-label-md shadow-md flex items-center gap-2">
    <span className="material-symbols-outlined text-[18px]">check_circle</span> Approve
                            </button>
    </div>
    </div>

    <div className="mt-8 grid grid-cols-4 gap-6">
    <div>
    <p className="font-label-md text-on-surface-variant mb-1">Applicant</p>
    <p className="font-body-md text-on-surface font-semibold">Rajesh Kumar</p>
    </div>
    <div>
    <p className="font-label-md text-on-surface-variant mb-1">Submission Date</p>
    <p className="font-body-md text-on-surface font-semibold">Oct 12, 2023</p>
    </div>
    <div>
    <p className="font-label-md text-on-surface-variant mb-1">Claimed Area</p>
    <p className="font-body-md text-on-surface font-semibold">12.50 ha</p>
    </div>
    <div>
    <p className="font-label-md text-on-surface-variant mb-1">Record Area</p>
    <p className="font-body-md text-on-surface font-semibold">14.68 ha</p>
    </div>
    </div>
    </div>

    <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
    <h2 className="font-headline-md text-on-surface mb-8">Workflow Status</h2>
    <div className="relative pl-4">

    <div className="absolute left-[27px] top-4 bottom-8 w-0.5 bg-outline-variant/50"></div>

    <div className="flex gap-6 mb-8 relative z-10">
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm shrink-0">
    <span className="material-symbols-outlined text-on-primary text-[16px]">check</span>
    </div>
    <div>
    <h3 className="font-headline-sm text-on-surface">Application Submitted</h3>
    <p className="font-body-sm text-on-surface-variant mt-1">Oct 12, 2023 at 10:45 AM • Initiated by CSC Center #402</p>
    </div>
    </div>

    <div className="flex gap-6 mb-8 relative z-10">
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm shrink-0">
    <span className="material-symbols-outlined text-on-primary text-[16px]">check</span>
    </div>
    <div>
    <h3 className="font-headline-sm text-on-surface">Document Verification</h3>
    <p className="font-body-sm text-on-surface-variant mt-1">Oct 14, 2023 at 2:15 PM • Verified by Clerical Staff</p>
    <div className="mt-3 flex gap-3">
    <span className="bg-surface-container inline-flex items-center gap-2 px-3 py-1 rounded-lg font-label-md text-on-surface text-[11px]"><span className="material-symbols-outlined text-[14px] text-primary">description</span> Sale_Deed_v1.pdf</span>
    <span className="bg-surface-container inline-flex items-center gap-2 px-3 py-1 rounded-lg font-label-md text-on-surface text-[11px]"><span className="material-symbols-outlined text-[14px] text-primary">description</span> ID_Proof.jpg</span>
    </div>
    </div>
    </div>

    <div className="flex gap-6 mb-8 relative z-10">
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm shrink-0">
    <span className="material-symbols-outlined text-on-primary text-[16px]">check</span>
    </div>
    <div>
    <h3 className="font-headline-sm text-on-surface">Record Reconciliation</h3>
    <p className="font-body-sm text-on-surface-variant mt-1">Oct 15, 2023 at 9:30 AM • Automated Check Passed</p>
    </div>
    </div>

    <div className="flex gap-6 mb-8 relative z-10">
    <div className="w-8 h-8 rounded-full bg-error flex items-center justify-center shadow-sm shrink-0 ring-4 ring-error/20">
    <span className="material-symbols-outlined text-on-error text-[16px] animate-pulse">priority_high</span>
    </div>
    <div className="bg-error-container/30 p-5 rounded-2xl w-full -mt-2">
    <h3 className="font-headline-sm text-on-error-container">GIS Spatial Verification</h3>
    <p className="font-body-sm text-on-surface-variant mt-1">Oct 16, 2023 at 11:00 AM • Automated Spatial Analysis</p>
    <div className="mt-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm border-l-4 border-error">
    <div className="flex items-start gap-4">
    <span className="material-symbols-outlined text-error mt-0.5">warning</span>
    <div>
    <p className="font-label-md text-error mb-1">Critical Discrepancy Detected</p>
    <p className="font-body-sm text-on-surface">The submitted mutation area (12.50 ha) conflicts with the GIS calculated parcel area (14.68 ha). Difference of <strong>2.18 ha</strong> exceeds the 5% tolerance threshold.</p>
    <button className="mt-3 text-primary font-label-md hover:underline flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">map</span> View Overlay Map</button>
    </div>
    </div>
    </div>
    </div>
    </div>

    <div className="flex gap-6 mb-8 relative z-10">
    <div className="w-8 h-8 rounded-full bg-surface-container-highest border-2 border-primary flex items-center justify-center shrink-0">
    <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
    </div>
    <div>
    <h3 className="font-headline-sm text-on-surface">Revenue Officer Review</h3>
    <p className="font-body-sm text-on-surface-variant mt-1">Pending your action</p>
    </div>
    </div>

    <div className="flex gap-6 relative z-10">
    <div className="w-8 h-8 rounded-full bg-surface-container border-2 border-outline-variant flex items-center justify-center shrink-0">
    </div>
    <div className="opacity-50">
    <h3 className="font-headline-sm text-on-surface">Final Decision & Record Update</h3>
    <p className="font-body-sm text-on-surface-variant mt-1">Awaiting review completion</p>
    </div>
    </div>
    </div>
    </div>
    </div>

    <div className="w-96 flex flex-col gap-8 shrink-0">

    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex flex-col h-80">
    <div className="flex justify-between items-center mb-4">
    <h3 className="font-headline-md text-on-surface">Spatial Context</h3>
    <button className="material-symbols-outlined text-on-surface-variant hover:text-primary">fullscreen</button>
    </div>
    <div className="flex-1 rounded-2xl overflow-hidden relative shadow-inner">
    <div className="w-full h-full bg-cover bg-center" data-alt="Satellite map view of agricultural land parcels with overlaid geometric boundaries. Red highlighting on one specific parcel indicating a discrepancy. High contrast, professional GIS interface style." data-location="Nagpur, Maharashtra, India" style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuCulc3JxJxWRU5Cu0ifo1B4F7In3kboEVhC52Je9QZE98XBrTU0VaWmp9rFJB_ospfRmyqfM10cxmd3Wy5pHHW_hgZoyDEgqN7CfkKYbd8m1QIYc2TAQPnpGvd0cP4JBzbyGifZm9q4DlhHzzOm8yaeLHOGz7-ulRjVwuyhN679gvxh6RicoMPbo_wj7a80peKUZthEFXy1MYAiQsD7H_RnAxqUo6dA1FQC4WeQ8rkgoQSBRu_EkyM\')'}}></div>
    <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-sm p-2 rounded-lg shadow-md border border-outline-variant/20 flex flex-col gap-1">
    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-error rounded-sm opacity-50"></div> <span className="font-label-md text-on-surface text-[10px]">Claimed Area</span></div>
    <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-primary rounded-sm"></div> <span className="font-label-md text-on-surface text-[10px]">Record Boundary</span></div>
    </div>
    </div>
    </div>

    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
    <h3 className="font-headline-md text-on-surface mb-6">Parties Involved</h3>
    <div className="flex flex-col gap-6">

    <div>
    <div className="font-label-md text-on-surface-variant mb-3 uppercase tracking-wider text-[11px]">Transferor (Seller)</div>
    <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-xl">
    <img className="w-10 h-10 rounded-full object-cover shadow-sm" data-alt="Professional headshot of an older Indian male farmer in traditional attire." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPfxFEyy2V0QHKBOVgcBMhloTFGSTIdLH2tI1OGRLE6RgAVkm7NzrzGgbWI8ni-9Ib9W-jpvBR0OMv-fr9VSa0Oml5NraiMxR_UW-plpvoOjLm6WTnUKaIT_mj1UPB_NkTPt4OfuM3CsouuISGDQG2VCw_C4Opi05YzWYGJZ83AqZvPusswxUpMEeayoy33w5HjjfxL3hbHFDSHLXe4FtbUUWMeiV7df697XAzg2wVq6a_pSs2YB8" />
    <div>
    <div className="font-body-md text-on-surface font-semibold">Anand Patil</div>
    <div className="font-body-sm text-on-surface-variant">UID: **** 4592</div>
    </div>
    </div>
    </div>

    <div>
    <div className="font-label-md text-on-surface-variant mb-3 uppercase tracking-wider text-[11px]">Transferee (Buyer)</div>
    <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-xl border border-primary/20">
    <img className="w-10 h-10 rounded-full object-cover shadow-sm" data-alt="Professional headshot of a middle-aged Indian male in smart casual business attire." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzofeToPlbyYcm88s-fQBJBdH8OoMOs1tAnrtf2JjtytgFMvWZFExu5LxRn4Wx5lKUYX2mvplNZe_38pyq5A-0GyizLsRQa8TNg7TZBjfsRQyUDOFiUCJ4ESN6J7NGT2bCxj0s6yYPKWoXLZ3LxPz40d2efwHbd_h16ptKyWHqbkQoQFKWQ6s5C9rVam-A71NQjz7MnoFPvt0G5IWkQZrDlznNKd40vt0ndAhJ8YwcQjneJAzj8Yw" />
    <div>
    <div className="font-body-md text-on-surface font-semibold">Rajesh Kumar</div>
    <div className="font-body-sm text-on-surface-variant">UID: **** 8810</div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div></main>
  );
}
