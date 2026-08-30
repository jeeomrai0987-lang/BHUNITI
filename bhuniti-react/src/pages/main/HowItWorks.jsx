export default function HowItWorks() {
  return (
    <main className="w-full pt-20"><div className="flex flex-col w-full">
    <div className="px-margin-desktop py-16 max-w-container-max mx-auto w-full">
    <div className="mb-16">
    <span className="font-label-caps text-on-surface-variant uppercase tracking-wider mb-4 block">Process Architecture</span>
    <h1 className="font-display text-display text-primary mb-6 max-w-3xl">The Core Engine: From Raw Data to Institutional Trust</h1>
    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">BHUNITI transforms fragmented spatial and legal records into a unified, actionable source of truth. Explore the seven-step data lifecycle powering our governance infrastructure.</p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

    <div className="lg:col-span-4 flex flex-col gap-8">
    <div className="bg-primary-container p-8 rounded-xl shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
    <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/10 to-transparent pointer-events-none"></div>
    <div className="relative z-10">
    <div className="flex items-center gap-3 mb-6">
    <span className="material-symbols-outlined text-on-primary-container text-[24px]">account_tree</span>
    <h3 className="font-headline-md text-headline-md text-on-primary-container">Core Engine</h3>
    </div>
    <h4 className="font-headline-lg text-headline-lg text-on-primary mb-4">Data Reconciliation</h4>
    <p className="font-body-md text-body-md text-on-primary-container mb-6">The heart of BHUNITI. We cross-reference municipal cadastre shapes against state legal registries using proprietary fuzzy-matching and spatial overlay algorithms. Discrepancies are flagged, quantified, and routed for resolution.</p>
    <div className="bg-surface-white/10 rounded-lg p-4 backdrop-blur-sm border border-surface-white/20">
    <span className="font-label-caps text-on-primary-container block mb-2">Live Accuracy Rate</span>
    <div className="flex items-baseline gap-2">
    <span className="font-display text-display text-on-primary">99.4%</span>
    <span className="font-body-sm text-status-success flex items-center"><span className="material-symbols-outlined text-[14px]">arrow_upward</span> 0.2%</span>
    </div>
    </div>
    </div>
    </div>

    <div className="bg-surface p-6 rounded-xl shadow-md border border-border-subtle">
    <span className="font-label-caps text-on-surface-variant mb-4 block">Live Tracker: Parcel P-1024</span>
    <div className="relative w-full h-48 rounded-lg mb-4 overflow-hidden shadow-inner group">
    <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" data-location="Connaught Place, New Delhi" style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuDERYAeGpzaClqmm1XHHFZdIi1DrnoCDhUx5IZtzJHvw5Kosp3tA6VISrBEsoJHa7nZ_-jH5Bz324IfhoHDLzfIUvRolLSNlSeWJbRlmLWHIyuu1Jjbke4pCFlo2UnDqnJF5-2GG_HP9yJCvdw1AdD6M2V7KZ7oGsXrg3suOeg1MPiQtpX3R0QvF-OaDetsa_J0WrBOxKHBP0OIdDXqMyEOq4yyW66o4kjeW42qqI1ah0ypUTCDGK4\')'}}></div>
    <div className="absolute inset-0 bg-primary-container/20 flex items-center justify-center pointer-events-none">
    <div className="w-16 h-16 border-2 border-status-warning rounded-sm bg-status-warning/20 animate-pulse"></div>
    </div>
    </div>
    <div className="space-y-3">
    <div className="flex justify-between items-center text-body-sm">
    <span className="text-on-surface font-semibold">Status:</span>
    <span className="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full text-[10px] font-label-caps">Step 5: AI Insights</span>
    </div>
    <div className="w-full bg-surface-variant rounded-full h-1.5">
    <div className="bg-secondary h-1.5 rounded-full" style={{width: '71%'}}></div>
    </div>
    <p className="font-body-sm text-on-surface-variant">Flagged for minor boundary overlap (0.02 acres). Pending historical registry check.</p>
    </div>
    </div>
    </div>

    <div className="lg:col-span-8 bg-surface-white p-8 rounded-xl shadow-md border border-border-subtle">
    <h2 className="font-headline-md text-headline-md text-primary mb-8">The 7-Step Institutional Workflow</h2>
    <div className="relative">

    <div className="absolute left-[27px] top-[24px] bottom-[24px] w-0.5 bg-surface-variant rounded-full"></div>
    <div className="space-y-12">

    <div className="relative flex gap-6 group">
    <div className="flex-none relative z-10">
    <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center border-2 border-surface-white group-hover:bg-secondary-fixed transition-colors shadow-sm">
    <span className="font-tabular-nums font-semibold text-primary">01</span>
    </div>
    </div>
    <div className="pt-2">
    <div className="flex items-center gap-3 mb-2">
    <span className="material-symbols-outlined text-on-surface-variant">upload_file</span>
    <h3 className="font-headline-md text-headline-md text-primary">Data Ingestion</h3>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">Secure ingestion of fragmented data sources including legacy physical deeds, municipal CAD files, and satellite imagery via encrypted API pipelines.</p>
    </div>
    </div>

    <div className="relative flex gap-6 group">
    <div className="flex-none relative z-10">
    <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center border-2 border-surface-white group-hover:bg-secondary-fixed transition-colors shadow-sm">
    <span className="font-tabular-nums font-semibold text-primary">02</span>
    </div>
    </div>
    <div className="pt-2">
    <div className="flex items-center gap-3 mb-2">
    <span className="material-symbols-outlined text-on-surface-variant">my_location</span>
    <h3 className="font-headline-md text-headline-md text-primary">Parcel Identification</h3>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">Spatial geometry extraction assigns unique immutable identifiers (UUIDs) to individual land parcels, creating a standardized grid reference system.</p>
    </div>
    </div>

    <div className="relative flex gap-6 group">
    <div className="flex-none relative z-10">
    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center border-4 border-primary-fixed shadow-md">
    <span className="font-tabular-nums font-semibold text-on-primary">03</span>
    </div>
    </div>
    <div className="pt-2">
    <div className="flex items-center gap-3 mb-2">
    <span className="material-symbols-outlined text-secondary">join_inner</span>
    <h3 className="font-headline-md text-headline-md text-primary">Reconciliation Engine</h3>
    <span className="px-2 py-0.5 bg-error-container text-on-error-container text-[10px] font-label-caps rounded-sm uppercase tracking-wider">Crucial Phase</span>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mb-4">The core mechanism. Automated cross-referencing between spatial boundaries and legal ownership records to surface discrepancies, overlaps, or missing metadata.</p>
    <div className="w-full max-w-md h-2 bg-surface-variant rounded-full overflow-hidden">
    <div className="h-full bg-primary w-[40%] animate-[progress_2s_ease-in-out_infinite]"></div>
    </div>
    </div>
    </div>

    <div className="relative flex gap-6 group">
    <div className="flex-none relative z-10">
    <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center border-2 border-surface-white group-hover:bg-secondary-fixed transition-colors shadow-sm">
    <span className="font-tabular-nums font-semibold text-primary">04</span>
    </div>
    </div>
    <div className="pt-2">
    <div className="flex items-center gap-3 mb-2">
    <span className="material-symbols-outlined text-on-surface-variant">history</span>
    <h3 className="font-headline-md text-headline-md text-primary">Historical Analysis</h3>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">Deep-dive into archived mutation records to trace the lineage of ownership and establish an unbroken chain of title for contested parcels.</p>
    </div>
    </div>

    <div className="relative flex gap-6 group">
    <div className="flex-none relative z-10">
    <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center border-2 border-surface-white group-hover:bg-secondary-fixed transition-colors shadow-sm">
    <span className="font-tabular-nums font-semibold text-primary">05</span>
    </div>
    </div>
    <div className="pt-2">
    <div className="flex items-center gap-3 mb-2">
    <span className="material-symbols-outlined text-on-surface-variant">psychology</span>
    <h3 className="font-headline-md text-headline-md text-primary">AI Insights</h3>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">Predictive models flag potential encroachment risks and identify patterns of irregular transactions, prioritizing high-risk parcels for review.</p>
    </div>
    </div>

    <div className="relative flex gap-6 group">
    <div className="flex-none relative z-10">
    <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center border-2 border-surface-white group-hover:bg-secondary-fixed transition-colors shadow-sm">
    <span className="font-tabular-nums font-semibold text-primary">06</span>
    </div>
    </div>
    <div className="pt-2">
    <div className="flex items-center gap-3 mb-2">
    <span className="material-symbols-outlined text-on-surface-variant">verified_user</span>
    <h3 className="font-headline-md text-headline-md text-primary">Human Verification</h3>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">Certified municipal officers review flagged anomalies via the BHUNITI dashboard, utilizing high-res spatial overlays to make final adjudications.</p>
    </div>
    </div>

    <div className="relative flex gap-6 group">
    <div className="flex-none relative z-10">
    <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center border-2 border-surface-white group-hover:bg-secondary-fixed transition-colors shadow-sm">
    <span className="font-tabular-nums font-semibold text-primary">07</span>
    </div>
    </div>
    <div className="pt-2">
    <div className="flex items-center gap-3 mb-2">
    <span className="material-symbols-outlined text-on-surface-variant">account_balance</span>
    <h3 className="font-headline-md text-headline-md text-primary">Governance Integration</h3>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">The validated, undisputed record is pushed to the central institutional ledger, unlocking secure public access and enabling smart infrastructural planning.</p>
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
