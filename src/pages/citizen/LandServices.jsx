export default function LandServices() {
  return (
    <main className="w-full pt-16 bg-surface min-h-screen"><div className="flex flex-col w-full relative">

    <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-fixed/20 rounded-full blur-[100px] animate-pulse"></div>
    <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-secondary-fixed/30 rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
    </div>
    <div className="relative z-10 w-full max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop py-8 lg:py-12 flex flex-col lg:flex-row gap-8 items-start">

    <div className="w-full lg:flex-1 flex flex-col gap-8">

    <div className="flex flex-col gap-2 mb-2">
    <div className="inline-flex items-center gap-2 bg-surface-container-high w-max px-3 py-1 rounded-full shadow-sm">
    <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
    <span className="font-label-md text-on-surface uppercase tracking-wider text-[10px]">Step 1 of 5</span>
    </div>
    <h1 className="font-display text-display text-on-surface">Initiate Mutation Service</h1>
    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">Select the type of mutation request you wish to file. This will determine the required documentation and review process.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">

    <div className="group relative flex flex-col justify-between bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full border border-transparent hover:border-primary-fixed min-h-[240px]">
    <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-110 group-hover:bg-primary/10"></div>
    <div className="relative z-10 flex flex-col gap-4">
    <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
    <span className="material-symbols-outlined text-[28px]" style={{fontVariationSettings: '\'FILL\' 1'}}>handshake</span>
    </div>
    <div>
    <h2 className="font-headline-md text-headline-md text-on-surface mb-1 group-hover:text-primary transition-colors">Sale/Transfer</h2>
    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">When you have bought or sold land. Requires registered sale deed.</p>
    </div>
    </div>
    <div className="relative z-10 mt-6 pt-4 flex items-center justify-between border-t border-outline-variant/30 group-hover:border-primary/20 transition-colors">
    <button className="inline-flex items-center gap-2 font-label-md text-primary group-hover:translate-x-1 transition-transform">
                    START APPLICATION <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
    </button>
    <span className="font-label-md text-on-surface-variant bg-surface-container px-2 py-0.5 rounded text-[10px]">Common</span>
    </div>
    </div>

    <div className="group relative flex flex-col justify-between bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer h-full border border-transparent hover:border-tertiary-fixed min-h-[240px]">
    <div className="absolute right-0 bottom-0 w-40 h-40 bg-tertiary-fixed/10 rounded-tl-full transition-transform group-hover:scale-110"></div>
    <div className="relative z-10 flex flex-col gap-4">
    <div className="w-12 h-12 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-sm">
    <span className="material-symbols-outlined text-[28px]" style={{fontVariationSettings: '\'FILL\' 1'}}>family_history</span>
    </div>
    <div>
    <h2 className="font-headline-md text-headline-md text-on-surface mb-1 group-hover:text-tertiary-container transition-colors">Inheritance</h2>
    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">For updating records after a succession. Death certificate required.</p>
    </div>
    </div>
    <div className="relative z-10 mt-6 pt-4 flex items-center justify-between border-t border-outline-variant/30">
    <button className="inline-flex items-center gap-2 font-label-md text-on-surface group-hover:translate-x-1 transition-transform">
                    START APPLICATION <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
    </button>
    </div>
    </div>

    <div className="group relative flex flex-col justify-between bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer h-full border border-transparent hover:border-secondary-fixed min-h-[240px]">
    <div className="absolute left-0 bottom-0 w-24 h-48 bg-secondary-fixed/20 blur-xl transition-opacity opacity-0 group-hover:opacity-100"></div>
    <div className="relative z-10 flex flex-col gap-4">
    <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm">
    <span className="material-symbols-outlined text-[28px]" style={{fontVariationSettings: '\'FILL\' 1'}}>pie_chart</span>
    </div>
    <div>
    <h2 className="font-headline-md text-headline-md text-on-surface mb-1 group-hover:text-secondary-container transition-colors">Gift/Partition</h2>
    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">For voluntary transfers or family divisions. Registered deed needed.</p>
    </div>
    </div>
    <div className="relative z-10 mt-6 pt-4 flex items-center justify-between border-t border-outline-variant/30">
    <button className="inline-flex items-center gap-2 font-label-md text-on-surface group-hover:translate-x-1 transition-transform">
                    START APPLICATION <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
    </button>
    </div>
    </div>

    <div className="group relative flex flex-col justify-between bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer h-full border border-transparent hover:border-error-container min-h-[240px]">

    <div className="absolute left-0 top-0 bottom-0 w-1 bg-error-container opacity-50 group-hover:opacity-100 transition-opacity"></div>
    <div className="relative z-10 flex flex-col gap-4">
    <div className="w-12 h-12 rounded-xl bg-error-container text-on-error-container flex items-center justify-center shadow-sm">
    <span className="material-symbols-outlined text-[28px]" style={{fontVariationSettings: '\'FILL\' 1'}}>edit_document</span>
    </div>
    <div>
    <h2 className="font-headline-md text-headline-md text-on-surface mb-1 group-hover:text-on-error-container transition-colors">Correction Request</h2>
    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">To report a discrepancy in your current record (e.g. name spelling, area).</p>
    </div>
    </div>
    <div className="relative z-10 mt-6 pt-4 flex items-center justify-between border-t border-outline-variant/30">
    <button className="inline-flex items-center gap-2 font-label-md text-on-surface group-hover:translate-x-1 transition-transform">
                    START APPLICATION <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
    </button>
    <span className="font-label-md text-on-surface-variant bg-surface-container px-2 py-0.5 rounded text-[10px]">No Fee</span>
    </div>
    </div>
    </div>
    </div>

    <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-6">

    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm shrink-0 border-2 border-surface">
    <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYyDe9L7VIthGwv9aUlBOx5YtLdXhsMD-6PlT1SYuA_2eKAkmL3mSEnh9s0N7bbyTnaNQWdSCzUMGROZ-EanSeGLiskqXS9snog3P-9OHq5Q_M5krv2PTV64CQnpbMNkERXeg0XdnF9sXst3w9wMJLT3pt1X4GU5potd_zk4tQsnGMAEHxR0QEiyW7GutfA8bHvYmSlrPtvwpb60MTc6bMmqGwu_F2LSanBuFaYpAkNnPo4LWrq_4" />
    </div>
    <div className="flex flex-col">
    <h3 className="font-headline-md text-body-lg font-semibold text-on-surface">Priya Sharma</h3>
    <p className="font-body-sm text-body-sm text-on-surface-variant">Citizen ID: 29481-C</p>
    <div className="mt-1 flex items-center gap-1 text-[10px] text-primary font-medium bg-primary-fixed/30 px-2 py-0.5 rounded w-max">
    <span className="material-symbols-outlined text-[12px]">verified</span> KYC Verified
                </div>
    </div>
    </div>

    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm sticky top-24">
    <div className="flex items-center gap-3 mb-6">
    <span className="material-symbols-outlined text-primary">folder_open</span>
    <h3 className="font-headline-md text-[18px] text-on-surface">Required Documents</h3>
    </div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Prepare scanned copies (PDF/JPG) before starting your application. Max size 5MB per file.</p>
    <div className="space-y-4">

    <details className="group border-b border-outline-variant/30 pb-3" open="">
    <summary className="flex justify-between items-center font-label-md text-on-surface cursor-pointer list-none hover:text-primary transition-colors">
                  Sale / Transfer
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
    </summary>
    <div className="mt-3 text-body-sm text-on-surface-variant">
    <ul className="list-disc pl-5 space-y-1">
    <li>Registered Sale Deed</li>
    <li>Latest Tax Receipt</li>
    <li>Identity Proof (Aadhaar/PAN)</li>
    <li>Passport Size Photograph</li>
    </ul>
    </div>
    </details>

    <details className="group border-b border-outline-variant/30 pb-3">
    <summary className="flex justify-between items-center font-label-md text-on-surface cursor-pointer list-none hover:text-primary transition-colors">
                  Inheritance
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
    </summary>
    <div className="mt-3 text-body-sm text-on-surface-variant">
    <ul className="list-disc pl-5 space-y-1">
    <li>Death Certificate of original owner</li>
    <li>Legal Heir Certificate</li>
    <li>Affidavit from heirs</li>
    </ul>
    </div>
    </details>

    <details className="group pb-1">
    <summary className="flex justify-between items-center font-label-md text-on-surface cursor-pointer list-none hover:text-primary transition-colors">
                  Correction
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
    </summary>
    <div className="mt-3 text-body-sm text-on-surface-variant">
    <ul className="list-disc pl-5 space-y-1">
    <li>Old Records showing correct data</li>
    <li>Court Order (if applicable)</li>
    <li>Application detailing discrepancy</li>
    </ul>
    </div>
    </details>
    </div>
    <div className="mt-6 p-4 bg-surface-container rounded-xl flex items-start gap-3">
    <span className="material-symbols-outlined text-on-surface-variant text-[20px] mt-0.5">info</span>
    <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">Need help gathering documents? Visit our <a className="text-primary underline hover:text-on-surface transition-colors" href="#">Help Center</a> or call the toll-free number.</p>
    </div>
    </div>
    </div>
    </div>
    </div></main>
  );
}
