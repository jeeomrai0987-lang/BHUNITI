import AnimatedCounter from "../../components/AnimatedCounter";

export default function Features() {
  return (
    <main className="w-full pt-20"><div className="flex flex-col w-full">

    <section className="w-full relative overflow-hidden bg-surface-container-lowest shadow-sm">
    <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
    <path className="text-primary" d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor"></path>
    <path className="text-secondary" d="M0 50 C 30 100 70 100 100 50 Z" fill="currentColor"></path>
    </svg>
    </div>
    <div className="max-w-container-max mx-auto px-margin-desktop py-24 relative z-10 flex flex-col lg:flex-row items-end justify-between gap-8">
    <div className="max-w-3xl">
    <span className="font-label-caps text-label-caps text-secondary block mb-4 uppercase tracking-widest">Platform Capabilities</span>
    <h1 className="font-display text-display text-on-surface mb-6">Architecting the Future of Land Administration.</h1>
    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              An integrated suite of enterprise-grade modules engineered for high-stakes governance. 
              BHUNITI seamlessly bridges the gap between spatial data and legal documentation through transparent, AI-driven workflows.
            </p>
    </div>
    <div className="flex gap-12 bg-surface p-8 rounded-xl shadow-md">
    <div className="flex flex-col">
    <AnimatedCounter target={99.9} className="font-display text-display text-primary" />
    <span className="font-label-caps text-label-caps text-on-surface-variant">Uptime SLA</span>
    </div>
    <div className="flex flex-col">
    <AnimatedCounter target={6} className="font-display text-display text-secondary" />
    <span className="font-label-caps text-label-caps text-on-surface-variant">Core Modules</span>
    </div>
    </div>
    </div>
    </section>

    <section className="w-full max-w-container-max mx-auto px-margin-desktop py-24">
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">

    <article className="bg-surface-container-lowest rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-500 overflow-hidden flex flex-col group">
    <div className="h-72 w-full relative bg-surface-container" data-location="New Delhi, India" style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuDxHIw3mekBP3pnQYDa8n0ffFRw1baDuOYNmnNPhSoRNSy41tvxhULk6iOeZvKElOHV1vsdZ2HtKx6b_zuU3yeTe2GCdEIKVJIXQ9WZiUHiWsJgcovNrNfdSDgDtx4i1nj6iQ9IZjv336D8yPH3uotrbRDGFPDBZCmNVqVhq8SRQtvoo6uoJ7W5GkZhcKPC-KGlsCZAToxp8ZrgzMOaoEHLOueyiQZ7LjOCAIBnSw3zS08FZ0q8yic\')'}}>
    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent mix-blend-multiply pointer-events-none"></div>
    <div className="absolute bottom-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm">
    <span className="font-label-caps text-label-caps text-on-surface flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                  Live Spatial Sync
                </span>
    </div>
    </div>
    <div className="p-8 flex flex-col flex-grow">
    <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
    <span className="material-symbols-outlined text-[20px]">explore</span>
    </div>
    <h2 className="font-headline-lg text-headline-lg text-on-surface">GIS Intelligence</h2>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant mb-8 flex-grow">
                Dynamic, multi-layered spatial mapping using high-resolution cadastral overlays. Seamlessly integrated with national coordinate systems for pinpoint accuracy in parcel identification and boundary resolution.
              </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
    <div className="bg-surface p-5 rounded-xl shadow-sm">
    <h4 className="font-label-caps text-label-caps text-primary mb-2">For Officials</h4>
    <p className="font-body-sm text-body-sm text-on-surface-variant">Resolve boundary disputes instantly with automated overlay clash detection.</p>
    </div>
    <div className="bg-surface p-5 rounded-xl shadow-sm">
    <h4 className="font-label-caps text-label-caps text-secondary mb-2">For Citizens</h4>
    <p className="font-body-sm text-body-sm text-on-surface-variant">View verifiable, exact property perimeters from any authorized device.</p>
    </div>
    </div>
    </div>
    </article>

    <article className="bg-surface-container-lowest rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-500 overflow-hidden flex flex-col group">
    <div className="h-72 w-full relative bg-primary-container p-8 flex items-end justify-center">

    <svg className="w-full h-48 drop-shadow-md" preserveAspectRatio="none" viewBox="0 0 400 150">
    <path className="text-secondary/20" d="M0,150 L0,80 C50,90 100,20 150,60 C200,100 250,10 300,50 C350,90 400,30 400,30 L400,150 Z" fill="currentColor"></path>
    <path className="text-secondary" d="M0,80 C50,90 100,20 150,60 C200,100 250,10 300,50 C350,90 400,30 400,30" fill="none" stroke="currentColor" strokeWidth="3"></path>
    <circle className="text-surface-white" cx="150" cy="60" fill="currentColor" r="4"></circle>
    <circle className="text-surface-white" cx="300" cy="50" fill="currentColor" r="4"></circle>
    </svg>
    <div className="absolute top-4 right-4 bg-surface-white/10 backdrop-blur-md px-3 py-1 rounded shadow-sm">
    <span className="font-tabular-nums text-tabular-nums text-on-primary">Model Acc: 98.4%</span>
    </div>
    </div>
    <div className="p-8 flex flex-col flex-grow">
    <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
    <span className="material-symbols-outlined text-[20px]">memory</span>
    </div>
    <h2 className="font-headline-lg text-headline-lg text-on-surface">AI-Assisted Analysis</h2>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant mb-8 flex-grow">
                Leverage machine learning to detect anomalies in land valuations, predict urbanization trends, and automate the validation of complex legacy land records against modern spatial realities.
              </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
    <div className="bg-surface p-5 rounded-xl shadow-sm">
    <h4 className="font-label-caps text-label-caps text-primary mb-2">For Officials</h4>
    <p className="font-body-sm text-body-sm text-on-surface-variant">Automated risk-flagging for potentially fraudulent transaction patterns.</p>
    </div>
    <div className="bg-surface p-5 rounded-xl shadow-sm">
    <h4 className="font-label-caps text-label-caps text-secondary mb-2">For Citizens</h4>
    <p className="font-body-sm text-body-sm text-on-surface-variant">Fair, algorithmic assessment of property values based on vast historical data.</p>
    </div>
    </div>
    </div>
    </article>

    <article className="bg-surface-container-lowest rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-500 overflow-hidden flex flex-col group">
    <div className="h-72 w-full relative bg-surface p-8 flex items-center justify-center">

    <div className="flex items-center gap-2 w-full max-w-md">
    <div className="flex-1 bg-surface-container-lowest p-3 rounded-lg shadow-sm text-center">
    <span className="font-label-caps text-label-caps text-on-surface">Deed</span>
    </div>
    <span className="material-symbols-outlined text-outline">arrow_forward</span>
    <div className="flex-1 bg-secondary p-3 rounded-lg shadow-sm text-center transform scale-110">
    <span className="font-label-caps text-label-caps text-on-primary">Verify</span>
    </div>
    <span className="material-symbols-outlined text-outline">arrow_forward</span>
    <div className="flex-1 bg-surface-container-lowest p-3 rounded-lg shadow-sm text-center">
    <span className="font-label-caps text-label-caps text-on-surface">Mutate</span>
    </div>
    </div>
    </div>
    <div className="p-8 flex flex-col flex-grow">
    <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
    <span className="material-symbols-outlined text-[20px]">account_tree</span>
    </div>
    <h2 className="font-headline-lg text-headline-lg text-on-surface">Mutation Management</h2>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant mb-8 flex-grow">
                A frictionless, end-to-end digital pipeline for property ownership transfer. Eliminate bureaucratic bottlenecks with smart workflows that route approvals to appropriate jurisdictional nodes instantly.
              </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
    <div className="bg-surface p-5 rounded-xl shadow-sm">
    <h4 className="font-label-caps text-label-caps text-primary mb-2">For Officials</h4>
    <p className="font-body-sm text-body-sm text-on-surface-variant">Streamlined queues with automated prerequisite checks reducing manual review time.</p>
    </div>
    <div className="bg-surface p-5 rounded-xl shadow-sm">
    <h4 className="font-label-caps text-label-caps text-secondary mb-2">For Citizens</h4>
    <p className="font-body-sm text-body-sm text-on-surface-variant">Track mutation status in real-time without physical visits to government offices.</p>
    </div>
    </div>
    </div>
    </article>

    <article className="bg-surface-container-lowest rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-500 overflow-hidden flex flex-col group">
    <div className="h-72 w-full relative bg-cover bg-center" data-alt="Close up of a modern tablet displaying glowing OCR scanning boxes over a faded, historical legal document. High contrast, professional corporate lighting, enterprise technology aesthetic. Deep navy blues and stark whites." style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuBfeKkFgLRn7xd3FLLr2mgqxwPuryeiQ0qCoJNfBIY_YO_-dVmITcMc2eRn5JiAasaZEwXdm_1jYBOeSdNe9gTR2WJmxBUJrRRPM0SIisWET_2tApB3yRwq3Ls8H7F7jupVJDqZgb8AmkBC7qNJndiNuYmGyULsDBbXsbIxRY0V5qjNd7QDyJ2p5tmRf2MAeT2uji8-jAhlJRkZT-mf_-MPIpjONAueAP0vISWL2nLX12QpdlxcETg\')'}}>
    <div className="absolute inset-0 bg-primary/40 mix-blend-overlay"></div>
    </div>
    <div className="p-8 flex flex-col flex-grow">
    <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
    <span className="material-symbols-outlined text-[20px]">document_scanner</span>
    </div>
    <h2 className="font-headline-lg text-headline-lg text-on-surface">Document Intelligence</h2>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant mb-8 flex-grow">
                Advanced OCR and Natural Language Processing algorithms that parse handwritten, historical, and multi-lingual land records, converting unstructured legacy data into queryable digital assets.
              </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
    <div className="bg-surface p-5 rounded-xl shadow-sm">
    <h4 className="font-label-caps text-label-caps text-primary mb-2">For Officials</h4>
    <p className="font-body-sm text-body-sm text-on-surface-variant">Instantly search decades of archival texts for precedent and lineage.</p>
    </div>
    <div className="bg-surface p-5 rounded-xl shadow-sm">
    <h4 className="font-label-caps text-label-caps text-secondary mb-2">For Citizens</h4>
    <p className="font-body-sm text-body-sm text-on-surface-variant">Access perfectly digitized, legally binding copies of ancestral deeds.</p>
    </div>
    </div>
    </div>
    </article>

    <article className="bg-surface-container-lowest rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-500 overflow-hidden flex flex-col group">
    <div className="h-72 w-full relative bg-surface-container" data-location="Mumbai, India" style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuBJHpUU5pIVhOqduWGps2TqQVukskzPDyF0fQWhRDcYinUFFY4wM6MZdjDlY59kJWeXJeA-afNdJtzXauE_lFeL9NDB8Ug6hq24SX_jcTGqEn7MgozLFRiKG-iVjngyOS3qNzAfT3mMJU-JKt4y1d8uAdX1C_it6G-A4vL-rfqa3JsvfrxSxwXWjFy42hpp25KI2lcWVF7gUrkdbY67i-KIaqa0lEUvmdSfVZdgcpVQjDjsBJKRXo4\')'}}>
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-ping absolute"></div>
    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg relative z-10 text-on-primary">
    <span className="material-symbols-outlined text-[24px]">satellite_alt</span>
    </div>
    </div>
    </div>
    <div className="p-8 flex flex-col flex-grow">
    <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
    <span className="material-symbols-outlined text-[20px]">engineering</span>
    </div>
    <h2 className="font-headline-lg text-headline-lg text-on-surface">Field Survey Management</h2>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant mb-8 flex-grow">
                Coordinate ground-truth verification seamlessly. Dispatch teams, track surveyor telemetry, and ingest drone-captured photogrammetry directly into the core GIS database in real-time.
              </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
    <div className="bg-surface p-5 rounded-xl shadow-sm">
    <h4 className="font-label-caps text-label-caps text-primary mb-2">For Officials</h4>
    <p className="font-body-sm text-body-sm text-on-surface-variant">Live oversight of active field operations and immediate data ingestion.</p>
    </div>
    <div className="bg-surface p-5 rounded-xl shadow-sm">
    <h4 className="font-label-caps text-label-caps text-secondary mb-2">For Citizens</h4>
    <p className="font-body-sm text-body-sm text-on-surface-variant">Faster resolution of physical boundary disputes with high-tech surveying.</p>
    </div>
    </div>
    </div>
    </article>

    <article className="bg-surface-container-lowest rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-500 overflow-hidden flex flex-col group">
    <div className="h-72 w-full relative bg-surface p-6 overflow-hidden flex flex-col gap-2">

    <div className="bg-surface-container-lowest p-3 rounded shadow-sm w-[90%] transform translate-x-4 opacity-50">
    <span className="font-tabular-nums text-tabular-nums text-outline text-[10px]">2026-03-12 09:14:22 UTC</span>
    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">User auth success via Biometric Gateway</p>
    </div>
    <div className="bg-surface-container-lowest p-3 rounded shadow-sm w-full z-10 relative">
    <span className="font-tabular-nums text-tabular-nums text-secondary text-[10px] font-bold">2026-03-12 09:15:01 UTC</span>
    <p className="font-body-sm text-body-sm text-on-surface truncate">Spatial boundary modified. Node ID: #99482A</p>
    </div>
    <div className="bg-surface-container-lowest p-3 rounded shadow-sm w-[85%] transform translate-x-8 opacity-50">
    <span className="font-tabular-nums text-tabular-nums text-outline text-[10px]">2026-03-12 09:15:05 UTC</span>
    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Hash committed to immutable ledger.</p>
    </div>
    </div>
    <div className="p-8 flex flex-col flex-grow">
    <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
    <span className="material-symbols-outlined text-[20px]">history</span>
    </div>
    <h2 className="font-headline-lg text-headline-lg text-on-surface">Cryptographic Audit Trail</h2>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant mb-8 flex-grow">
                Uncompromising transparency. Every view, edit, and mutation is cryptographically signed and stored in an append-only ledger, ensuring absolute historical integrity and irrefutable accountability.
              </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
    <div className="bg-surface p-5 rounded-xl shadow-sm">
    <h4 className="font-label-caps text-label-caps text-primary mb-2">For Officials</h4>
    <p className="font-body-sm text-body-sm text-on-surface-variant">Guaranteed operational integrity and protection against internal data tampering.</p>
    </div>
    <div className="bg-surface p-5 rounded-xl shadow-sm">
    <h4 className="font-label-caps text-label-caps text-secondary mb-2">For Citizens</h4>
    <p className="font-body-sm text-body-sm text-on-surface-variant">Absolute confidence that property records cannot be maliciously altered.</p>
    </div>
    </div>
    </div>
    </article>
    </div>
    </section>

    <section className="w-full bg-primary text-on-primary py-24 relative overflow-hidden shadow-xl z-10">
    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 70% 30%, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
    <div className="max-w-3xl mx-auto px-margin-desktop text-center relative z-10">
    <h2 className="font-display text-display mb-6">Experience Institutional Intelligence</h2>
    <p className="font-body-lg text-body-lg text-inverse-primary mb-10 max-w-xl mx-auto">
            Join the municipalities already leveraging BHUNITI to transform their land governance infrastructure.
          </p>
    <div className="flex flex-wrap items-center justify-center gap-4">
    <button className="px-8 py-4 bg-surface-container-lowest text-primary font-label-caps rounded-lg hover:bg-surface transition-all shadow-md">
              Request Technical Demo
            </button>
    <button className="px-8 py-4 bg-transparent text-on-primary font-label-caps rounded-lg hover:bg-surface-white/10 transition-all shadow-sm shadow-on-primary/10">
              View Documentation
            </button>
    </div>
    </div>
    </section>

    </div></main>
  );
}
