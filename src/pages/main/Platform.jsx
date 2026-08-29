export default function Platform() {
  return (
    <main className="w-full pt-20"><div className="flex flex-col w-full relative overflow-hidden bg-background">

    <div className="absolute inset-0 z-0 pointer-events-none opacity-5" data-alt="Faint, geometric wireframe of a cadastral land registry map. Abstract grid lines and subtle topographic contours in a technical, blueprint style, rendered in stark black and white for architectural contrast." style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuCByIT1G09mPNbNWEfQCA9xEXvj0I7afU-7zGFxODc1wurPIjNCwDrtMKzI23hyDH0e2lOJMB_feev1Tca3vvqsTDwZNGc7YefMX2I57YMeQ3ifYLUSDQARicl8SDkURRNW180q9qM6EFOKCb6zTRoQty1sXXXcbGzyl5B5sFQb2aZHjTB0fF7FOjAzWDsRzOgM5sAInJYc0D38COBXfuFVyjGIl-nkAPQn3djua32D1HfXDubc_VA\')'}}></div>

    <section className="relative z-10 w-full max-w-[1440px] mx-auto px-margin-desktop pt-24 pb-32">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
    <div className="lg:col-span-7 flex flex-col gap-6">
    <div className="flex items-center gap-3 mb-2">
    <span className="w-8 h-px bg-primary"></span>
    <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase">System Architecture</span>
    </div>
    <h1 className="font-display text-display text-on-surface">
              Institutional Intelligence for National Land Administration.
            </h1>
    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4 leading-relaxed">
              The BHUNITI platform unifies fragmented land administration into a cohesive, interoperable ecosystem. By integrating high-precision GIS with immutable ledger technology, we establish a single source of truth for property rights, spatial planning, and civic administration.
            </p>
    <div className="flex gap-4 mt-8">
    <button className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-caps text-label-caps uppercase hover:bg-surface-tint transition-all shadow-md">
                View Technical Specs
              </button>
    <button className="bg-surface-white border border-border-subtle text-on-surface px-8 py-4 rounded-xl font-label-caps text-label-caps uppercase hover:bg-surface-container transition-all">
                Access Developer Portal
              </button>
    </div>
    </div>

    <div className="lg:col-span-5 relative h-[500px] flex items-center justify-center">

    <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-secondary-fixed/30 to-primary-fixed/30 rounded-full blur-3xl opacity-50"></div>
    <div className="relative w-full max-w-[400px] aspect-square rounded-2xl bg-surface-white border border-border-subtle shadow-xl overflow-hidden flex flex-col p-6">
    <div className="flex justify-between items-center mb-6 border-b border-border-subtle pb-4">
    <span className="font-label-caps text-label-caps text-on-surface">Live Ecosystem Flow</span>
    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span> <span className="font-tabular-nums text-tabular-nums text-on-surface-variant text-[10px]">SYNC_ACTIVE</span></span>
    </div>

    <div className="flex-1 relative">
    <svg className="w-full h-full" viewBox="0 0 200 200">

    <line className="text-border-subtle" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" x1="100" x2="160" y1="40" y2="100"></line>
    <line className="text-border-subtle" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" x1="160" x2="100" y1="100" y2="160"></line>
    <line className="text-border-subtle" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" x1="100" x2="40" y1="160" y2="100"></line>
    <line className="text-border-subtle" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" x1="40" x2="100" y1="100" y2="40"></line>

    <line className="text-border-subtle" stroke="currentColor" strokeWidth="1" x1="100" x2="100" y1="100" y2="40"></line>
    <line className="text-border-subtle" stroke="currentColor" strokeWidth="1" x1="100" x2="160" y1="100" y2="100"></line>
    <line className="text-border-subtle" stroke="currentColor" strokeWidth="1" x1="100" x2="100" y1="100" y2="160"></line>
    <line className="text-border-subtle" stroke="currentColor" strokeWidth="1" x1="100" x2="40" y1="100" y2="100"></line>


    <circle className="fill-surface-white stroke-secondary" cx="100" cy="40" r="14" strokeWidth="2"></circle>
    <text className="fill-secondary font-semibold" fontFamily="Inter" fontSize="8" textAnchor="middle" x="100" y="44">GIS</text>

    <circle className="fill-surface-white stroke-primary" cx="160" cy="100" r="14" strokeWidth="2"></circle>
    <text className="fill-primary font-semibold" fontFamily="Inter" fontSize="8" textAnchor="middle" x="160" y="104">AI</text>

    <circle className="fill-surface-white stroke-primary" cx="100" cy="160" r="14" strokeWidth="2"></circle>
    <text className="fill-primary font-semibold" fontFamily="Inter" fontSize="6" textAnchor="middle" x="100" y="164">LEDGER</text>

    <circle className="fill-surface-white stroke-primary" cx="40" cy="100" r="14" strokeWidth="2"></circle>
    <text className="fill-primary font-semibold" fontFamily="Inter" fontSize="8" textAnchor="middle" x="40" y="104">REG</text>

    <circle className="fill-primary" cx="100" cy="100" r="22"></circle>
    <text className="fill-surface-white font-bold tracking-widest" fontFamily="Inter" fontSize="8" textAnchor="middle" x="100" y="103">CORE</text>
    </svg>

    <div className="absolute w-1.5 h-1.5 bg-secondary rounded-full top-[38px] left-[100px] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
    <div className="absolute w-1.5 h-1.5 bg-primary rounded-full top-[100px] left-[160px] animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-500"></div>
    </div>
    </div>
    </div>
    </div>
    </section>

    <section className="relative z-10 w-full bg-surface-container-low border-y border-border-subtle py-24">
    <div className="max-w-[1440px] mx-auto px-margin-desktop">
    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
    <div className="max-w-xl">
    <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase mb-4 block">Infrastructure Overview</span>
    <h2 className="font-headline-lg text-headline-lg text-on-surface">Integrated Modules for Comprehensive Governance</h2>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Each module operates independently while maintaining strict synchronicity with the central platform ledger.
            </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">

    <div className="md:col-span-8 bg-surface-white border border-border-subtle rounded-2xl p-8 relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-surface-variant/30 to-transparent"></div>
    <div className="relative z-10 flex flex-col h-full justify-between w-2/3">
    <div>
    <div className="w-12 h-12 bg-secondary-fixed text-on-secondary-fixed rounded-lg flex items-center justify-center mb-6">
    <span className="material-symbols-outlined text-[24px]">map</span>
    </div>
    <h3 className="font-headline-md text-headline-md text-on-surface mb-3">High-Precision GIS</h3>
    <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Sub-meter accuracy spatial data mapping overlapping cadastral boundaries, infrastructure networks, and environmental constraints in real-time.
                  </p>
    </div>
    <div className="flex items-center gap-2">
    <span className="font-label-caps text-label-caps text-secondary uppercase">View Module</span>
    <span className="material-symbols-outlined text-[16px] text-secondary group-hover:translate-x-1 transition-transform">arrow_forward</span>
    </div>
    </div>

    <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 group-hover:opacity-40 transition-opacity" data-alt="Close up of a digital mapping interface showing precise geometric land parcels with neon blue outlines against a dark, minimalist technical grid background." style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuBm1RselE71Yybl0OZu61aNSvJuUVRZuOjPJaXZxbDs_c3Xr5P-Ppehwq9Ejj_r5eOeuLjVaRz_GyRLjHTPCn_eoC42PwpWvdPsk2VKgqHTYxIVWFcJD0bafWt8DQIV81_9z7qtA5ARw3JrlOojOwM9DwmS6LjnOQncyp15pTr1uKAl02ui7YePcBYSCkbmlN644RlalHJ64yGFx4CHAyrRmTB4K_qIlvGpoFgFtvh8thZ2xHXYCl4\')'}}></div>
    </div>

    <div className="md:col-span-4 bg-surface-white border border-border-subtle rounded-2xl p-8 flex flex-col justify-between hover:shadow-md transition-shadow group">
    <div>
    <div className="w-12 h-12 bg-surface-container-highest text-on-surface rounded-lg flex items-center justify-center mb-6">
    <span className="material-symbols-outlined text-[24px]">history_edu</span>
    </div>
    <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Digital Registry</h3>
    <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Digitized property records linked directly to spatial identifiers, eliminating ambiguity in ownership.
                </p>
    </div>
    <div className="flex items-center gap-2">
    <span className="font-label-caps text-label-caps text-primary uppercase">View Module</span>
    <span className="material-symbols-outlined text-[16px] text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
    </div>
    </div>

    <div className="md:col-span-4 bg-primary text-on-primary border border-primary rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-md">
    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[bg-pan_4s_linear_infinite]"></div>
    <div className="relative z-10">
    <div className="w-12 h-12 bg-on-primary/10 rounded-lg flex items-center justify-center mb-6 backdrop-blur-sm">
    <span className="material-symbols-outlined text-[24px] text-on-primary">psychology</span>
    </div>
    <h3 className="font-headline-md text-headline-md text-on-primary mb-3">AI Dispute Resolution</h3>
    <p className="font-body-sm text-body-sm text-on-primary/80">
                  Machine learning models analyze historical land records to flag anomalies and predict potential boundary disputes before registration.
                </p>
    </div>
    </div>

    <div className="md:col-span-8 bg-surface-white border border-border-subtle rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center justify-between hover:shadow-md transition-shadow group">
    <div className="flex-1">
    <div className="w-12 h-12 bg-surface-container-highest text-on-surface rounded-lg flex items-center justify-center mb-6">
    <span className="material-symbols-outlined text-[24px]">verified_user</span>
    </div>
    <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Immutable Audit Trail</h3>
    <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                  Every transaction, modification, and query is logged on a distributed ledger, ensuring cryptographic proof of provenance and absolute data integrity.
                </p>
    </div>

    <div className="w-48 h-32 bg-surface-container rounded-lg border border-border-subtle relative overflow-hidden p-3 flex flex-col gap-2">
    <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
    <span className="material-symbols-outlined text-[14px] text-on-surface-variant">lock</span>
    <span className="font-tabular-nums text-[10px] text-on-surface-variant">BLOCK HASH</span>
    </div>
    <div className="font-tabular-nums text-[10px] text-on-surface-variant font-mono truncate">0x7F8B9C...2D4E</div>
    <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden mt-1"><div className="w-3/4 h-full bg-status-success"></div></div>
    <div className="font-tabular-nums text-[10px] text-on-surface-variant font-mono truncate">0x3A2F1D...9B8C</div>
    <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden mt-1"><div className="w-full h-full bg-status-success"></div></div>
    </div>
    </div>
    </div>
    </div>
    </section>

    <section className="relative z-10 w-full py-32 bg-surface-white overflow-hidden">
    <div className="max-w-[1440px] mx-auto px-margin-desktop relative">

    <div className="absolute left-8 top-0 bottom-0 w-px bg-border-subtle opacity-50 hidden lg:block"></div>
    <div className="absolute left-1/4 top-0 bottom-0 w-px bg-border-subtle opacity-50 hidden lg:block"></div>
    <div className="absolute left-2/4 top-0 bottom-0 w-px bg-border-subtle opacity-50 hidden lg:block"></div>
    <div className="absolute left-3/4 top-0 bottom-0 w-px bg-border-subtle opacity-50 hidden lg:block"></div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">

    <div className="flex flex-col gap-8">
    <span className="font-tabular-nums text-tabular-nums text-on-surface-variant tracking-widest border-b border-border-subtle pb-2 w-12">01</span>
    <h3 className="font-display text-[32px] leading-tight text-on-surface">Seamless Interoperability with State Systems</h3>
    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Designed for the Indian administrative context, BHUNITI provides standardized RESTful APIs and spatial data services (WMS/WFS) conforming to OGC standards. This allows immediate integration with existing state revenue department portals, municipal databases, and central infrastructural planning tools without disrupting legacy workflows.
              </p>

    <div className="bg-surface-container rounded-xl p-6 border border-border-subtle mt-4">
    <div className="flex items-center justify-between mb-4">
    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">API Endpoint</span>
    <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold rounded">GET</span>
    </div>
    <code className="font-tabular-nums text-body-sm text-on-surface block truncate">
                  https://api.bhuniti.gov.in/v1/cadastral/parcel/{'{'}id{'}'}
                </code>
    <div className="w-full h-px bg-border-subtle my-4"></div>
    <div className="flex gap-4">
    <span className="font-label-caps text-[10px] text-on-surface-variant"><span className="text-status-success">●</span> 99.9% UPTIME</span>
    <span className="font-label-caps text-[10px] text-on-surface-variant">JSON / GeoJSON</span>
    </div>
    </div>
    </div>

    <div className="flex flex-col gap-8 lg:mt-32">
    <span className="font-tabular-nums text-tabular-nums text-on-surface-variant tracking-widest border-b border-border-subtle pb-2 w-12">02</span>
    <h3 className="font-display text-[32px] leading-tight text-on-surface">Elastic Scalability for a Subcontinent</h3>
    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Built on a containerized microservices architecture deployed across geographically redundant government cloud nodes. The platform scales dynamically to handle millions of simultaneous queries during peak administrative periods, ensuring low-latency access to heavy vector and raster spatial datasets regardless of user location.
              </p>
    <div className="grid grid-cols-2 gap-4 mt-4">
    <div className="border border-border-subtle p-6 rounded-xl bg-surface">
    <div className="font-display text-[28px] text-primary mb-1">~50ms</div>
    <div className="font-label-caps text-[10px] text-on-surface-variant uppercase">Avg Query Latency</div>
    </div>
    <div className="border border-border-subtle p-6 rounded-xl bg-surface">
    <div className="font-display text-[28px] text-primary mb-1">1.2B+</div>
    <div className="font-label-caps text-[10px] text-on-surface-variant uppercase">Parcels Indexable</div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </section>

    <section className="w-full bg-primary py-16 text-on-primary">
    <div className="max-w-[1440px] mx-auto px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-8">
    <div>
    <h2 className="font-headline-lg text-headline-lg mb-2">Ready to explore the platform?</h2>
    <p className="font-body-md text-on-primary/80">Access technical documentation or request sandbox access.</p>
    </div>
    <div className="flex gap-4">
    <button className="bg-surface-white text-primary px-8 py-3 rounded-lg font-label-caps text-label-caps uppercase hover:bg-surface-container transition-all shadow-sm">
              Documentation
            </button>
    </div>
    </div>
    </section>
    </div></main>
  );
}
