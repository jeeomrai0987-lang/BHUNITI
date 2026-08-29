export default function MyApplications() {
  return (
    <main className="w-full pt-16 bg-surface min-h-screen"><div className="flex flex-col w-full relative">

    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/5 via-transparent to-transparent blur-3xl rounded-full pointer-events-none transform translate-x-1/4 -translate-y-1/4 z-0"></div>

    <div className="w-full px-margin-mobile lg:px-margin-desktop py-8 md:py-12 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-surface-container-low shadow-sm">
    <div className="flex flex-col max-w-2xl">
    <div className="flex items-center gap-3 mb-2">
    <span className="px-2 py-1 bg-primary text-on-primary rounded font-label-md uppercase tracking-wider text-[10px]">Title Transfer</span>
    <span className="text-body-sm font-tabular-nums text-on-surface-variant flex items-center gap-1">
    <span className="material-symbols-outlined text-[16px]">calendar_today</span> Oct 24, 2023
                  </span>
    </div>
    <h1 className="text-display font-display text-on-surface mb-2">Application Details</h1>
    <p className="text-headline-md font-tabular-nums text-on-surface-variant">ID: MUT-2023-8941</p>
    </div>
    <div className="flex items-center gap-4 bg-surface rounded-xl p-4 shadow-sm w-full md:w-auto">
    <img alt="Citizen Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYyDe9L7VIthGwv9aUlBOx5YtLdXhsMD-6PlT1SYuA_2eKAkmL3mSEnh9s0N7bbyTnaNQWdSCzUMGROZ-EanSeGLiskqXS9snog3P-9OHq5Q_M5krv2PTV64CQnpbMNkERXeg0XdnF9sXst3w9wMJLT3pt1X4GU5potd_zk4tQsnGMAEHxR0QEiyW7GutfA8bHvYmSlrPtvwpb60MTc6bMmqGwu_F2LSanBuFaYpAkNnPo4LWrq_4" />
    <div>
    <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-0.5">Applicant</p>
    <p className="text-body-lg font-body-lg text-on-surface font-semibold">Priya Sharma</p>
    </div>
    </div>
    </div>
    <div className="w-full max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop py-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter">

    <div className="col-span-1 lg:col-span-8 flex flex-col gap-gutter">

    <div className="bg-error-container text-on-error-container rounded-xl p-6 shadow-sm flex items-start gap-4">
    <span className="material-symbols-outlined text-[28px] text-error flex-shrink-0" style={{fontVariationSettings: '\'FILL\' 1'}}>warning</span>
    <div>
    <h3 className="text-headline-md font-headline-md mb-2">Action Required</h3>
    <p className="text-body-lg font-body-lg">A field survey has been scheduled for <strong>Nov 15th</strong>. Please ensure access to the parcel.</p>
    <button className="mt-4 px-4 py-2 bg-error text-on-error rounded-lg font-label-md uppercase tracking-wide hover:opacity-90 transition-opacity shadow-sm">Confirm Availability</button>
    </div>
    </div>

    <div className="bg-surface-container rounded-xl p-8 shadow-md">
    <h2 className="text-headline-lg font-headline-lg text-on-surface mb-8 border-b border-outline-variant/30 pb-4">Application Progress</h2>
    <div className="relative pl-6 lg:pl-0">

    <div className="absolute left-10 top-2 bottom-2 w-0.5 bg-outline-variant lg:hidden"></div>
    <div className="flex flex-col lg:flex-row justify-between relative z-10 gap-8 lg:gap-4">

    <div className="flex lg:flex-col items-start lg:items-center gap-4 lg:w-1/5 relative">
    <div className="hidden lg:block absolute top-5 left-1/2 w-full h-0.5 bg-primary z-0"></div>
    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-md z-10">
    <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: '\'FILL\' 1'}}>check</span>
    </div>
    <div className="lg:text-center mt-1 lg:mt-0">
    <p className="text-label-md font-label-md text-primary uppercase tracking-wider mb-1">Submitted</p>
    <p className="text-body-sm font-tabular-nums text-on-surface-variant">Oct 24</p>
    </div>
    </div>

    <div className="flex lg:flex-col items-start lg:items-center gap-4 lg:w-1/5 relative">
    <div className="hidden lg:block absolute top-5 left-1/2 w-full h-0.5 bg-primary z-0"></div>
    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-md z-10">
    <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: '\'FILL\' 1'}}>check</span>
    </div>
    <div className="lg:text-center mt-1 lg:mt-0">
    <p className="text-label-md font-label-md text-primary uppercase tracking-wider mb-1">Verified</p>
    <p className="text-body-sm font-tabular-nums text-on-surface-variant">Oct 28</p>
    </div>
    </div>

    <div className="flex lg:flex-col items-start lg:items-center gap-4 lg:w-1/5 relative">
    <div className="hidden lg:block absolute top-5 left-1/2 w-full h-0.5 bg-outline-variant border-dashed border-t-2 z-0"></div>
    <div className="w-10 h-10 rounded-full bg-surface shadow-md flex items-center justify-center flex-shrink-0 border-2 border-primary z-10 relative">
    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
    </div>
    <div className="lg:text-center mt-1 lg:mt-0 bg-primary/5 lg:bg-transparent p-3 lg:p-0 rounded-lg lg:rounded-none -ml-3 lg:ml-0 w-full lg:w-auto">
    <p className="text-label-md font-label-md text-primary uppercase tracking-wider mb-1">Field Survey</p>
    <p className="text-body-sm text-on-surface-variant font-medium">In Progress</p>
    </div>
    </div>

    <div className="flex lg:flex-col items-start lg:items-center gap-4 lg:w-1/5 relative opacity-50">
    <div className="hidden lg:block absolute top-5 left-1/2 w-full h-0.5 bg-outline-variant border-dashed border-t-2 z-0"></div>
    <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center flex-shrink-0 shadow-sm z-10">
    <span className="material-symbols-outlined text-[20px]">person_search</span>
    </div>
    <div className="lg:text-center mt-1 lg:mt-0">
    <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-1">RO Review</p>
    <p className="text-body-sm text-on-surface-variant">Pending</p>
    </div>
    </div>

    <div className="flex lg:flex-col items-start lg:items-center gap-4 lg:w-1/5 opacity-50">
    <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center flex-shrink-0 shadow-sm z-10">
    <span className="material-symbols-outlined text-[20px]">gavel</span>
    </div>
    <div className="lg:text-center mt-1 lg:mt-0">
    <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-1">Decision</p>
    <p className="text-body-sm text-on-surface-variant">Pending</p>
    </div>
    </div>
    </div>
    </div>
    </div>

    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start">
    <div className="flex-1">
    <h3 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
    <span className="material-symbols-outlined text-primary">info</span> Current Phase Details
                      </h3>
    <p className="text-body-lg text-on-surface-variant leading-relaxed">
                          Your application is currently at the <strong>Field Survey</strong> stage. An authorized surveyor will visit the parcel to verify boundary coordinates against the submitted documents. Please ensure physical access to all boundary markers.
                      </p>
    </div>
    <div className="w-full md:w-64 bg-surface rounded-lg p-4 shadow-inner">
    <div className="text-label-md text-on-surface-variant uppercase tracking-wider mb-2">Surveyor Assigned</div>
    <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center font-headline-md">
                              RK
                          </div>
    <div>
    <p className="text-body-md font-medium text-on-surface">Rajiv Kumar</p>
    <p className="text-body-sm text-on-surface-variant font-tabular-nums">ID: SRV-8492</p>
    </div>
    </div>
    </div>
    </div>
    </div>

    <div className="col-span-1 lg:col-span-4 flex flex-col gap-gutter">

    <div className="bg-surface-container-highest rounded-xl p-2 shadow-sm">
    <div className="w-full h-48 bg-cover bg-center rounded-lg shadow-inner relative overflow-hidden" data-alt="Overhead satellite view of a rural agricultural land parcel in India, showing distinct field boundaries and a small dirt road. Topographical GIS overlay style with subtle cyan and magenta boundary lines. High contrast, technical aesthetic." data-location="Land Parcel, Rural India" style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuD1Jc0-jZmQTykZ9-HyE7tGSIT-UeoZO8QquGyE0GBs1dQ2ilAB49ibBlbzun-iQfJ40s2qHIfVsrJ8GL32fWFwLp_a1krTehRgs4FtEeDuEPwqE7QNLgkRpTRfMYVfpyQYzkaq_C_HlYCWVQK75z6AtMqAqqDcimtosCa6wPwFvQ3k46lsuERfZNx00tzt0pUF8jfxbNWTN1kX4nP-itEHWKSFiZDE9gE9kkWWrMb1s4mLpTogLRM\')'}}>
    <div className="absolute bottom-2 right-2 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-tabular-nums text-on-surface shadow-sm border border-outline-variant/30 flex items-center gap-1">
    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Target Parcel
                      </div>
    </div>
    <div className="p-4">
    <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Parcel Locator</p>
    <p className="text-body-md text-on-surface font-tabular-nums">Survey No: 452/B, Ward 7</p>
    </div>
    </div>

    <div className="bg-surface-container rounded-xl p-6 shadow-sm">
    <h3 className="text-headline-md font-headline-md text-on-surface mb-4">Submitted Documents</h3>
    <ul className="flex flex-col gap-3">
    <li className="bg-surface-container-lowest rounded-lg p-3 flex items-center justify-between shadow-sm group hover:shadow-md transition-shadow cursor-pointer">
    <div className="flex items-center gap-3 min-w-0">
    <span className="material-symbols-outlined text-primary text-[24px]">description</span>
    <div className="truncate">
    <p className="text-body-md text-on-surface font-medium truncate">Sale_Deed_Signed.pdf</p>
    <p className="text-body-sm text-on-surface-variant">2.4 MB • Verified</p>
    </div>
    </div>
    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">download</span>
    </li>
    <li className="bg-surface-container-lowest rounded-lg p-3 flex items-center justify-between shadow-sm group hover:shadow-md transition-shadow cursor-pointer">
    <div className="flex items-center gap-3 min-w-0">
    <span className="material-symbols-outlined text-primary text-[24px]">badge</span>
    <div className="truncate">
    <p className="text-body-md text-on-surface font-medium truncate">Aadhar_Identity_Proof.jpg</p>
    <p className="text-body-sm text-on-surface-variant">850 KB • Verified</p>
    </div>
    </div>
    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">download</span>
    </li>
    </ul>
    <button className="w-full mt-4 py-2 border border-outline text-on-surface rounded-lg font-label-md uppercase tracking-wider hover:bg-surface-variant transition-colors shadow-sm">
                      View All Files
                  </button>
    </div>
    </div>
    </div>
    </div></main>
  );
}
