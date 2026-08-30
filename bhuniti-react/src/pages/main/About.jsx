export default function About() {
  return (
    <main className="w-full pt-20">
      <div className="flex flex-col w-full">
        {/* Hero Section */}
        <section className="w-full relative px-margin-mobile md:px-margin-desktop py-24 bg-surface-white">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 relative z-10">
            <div className="lg:col-span-12 flex flex-col items-center text-center mb-16">
              <div className="px-4 py-1 bg-primary/5 rounded-full inline-flex items-center justify-center mb-8">
                <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase font-bold">
                  Institution Profile
                </span>
              </div>
              <h1 className="font-display text-display text-on-surface mb-6 max-w-4xl mx-auto leading-tight font-bold">
                To build a trusted digital foundation for transparent and efficient land administration.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                BHUNITI represents a paradigm shift in spatial governance, unifying fragmented legal, geographic, and administrative records into a singular, irrefutable institutional reality.
              </p>
            </div>

            {/* Banner Image */}
            <div className="lg:col-span-12 w-full h-[614px] min-h-[400px] mb-24 rounded-3xl overflow-hidden relative shadow-lg border border-border-subtle group">
              <div
                className="w-full h-full bg-cover bg-center absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage:
                    "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-k25vXHNHetwYNwwybT0Zk-uQLrkZ42yk88JdIWhLCf4hXEP1kPnSh8Y&s=10')",
                  backgroundPosition: "center center",
                }}
              />
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-surface-white via-surface-white/40 to-transparent z-10" />
            </div>
          </div>
        </section>

        {/* Challenge & Dual Synthesis Section */}
        <section className="w-full px-margin-mobile md:px-margin-desktop py-24 bg-surface-container-lowest">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Left Sticky Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-8 sticky top-32 h-fit">
              <div className="w-16 h-1 bg-primary mb-2" />
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                The Infrastructure Challenge
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Historically, national land intelligence has been constrained by isolated institutional silos, leading to discrepancies in property delineation and legal ownership.
              </p>
              <div className="w-full bg-surface-container rounded-2xl p-6 mt-4 shadow-sm border border-border-subtle">
                <div className="flex items-center gap-4 mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">account_balance</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Governance Objective
                  </h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Establish an unassailable digital ledger linking spatial coordinates with legal entitlement, accelerating administrative processing by 60%.
                </p>
              </div>
            </div>

            {/* Right: The 2 Container Boxes in Hover Mode */}
            <div className="lg:col-span-8 flex flex-col gap-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Container 1: 01. Fragmented Reality (Hover Mode) */}
                <div className="bg-surface-white rounded-3xl p-8 md:p-10 border border-border-subtle shadow-sm hover:shadow-2xl hover:scale-[1.02] hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group cursor-pointer">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary mb-4 flex items-center gap-3 font-bold transition-colors">
                      <span className="text-primary font-tabular-nums text-headline-md">01.</span>
                      Fragmented Reality
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-8">
                      Legacy systems operate in isolation. Textual records reside in separate jurisdictions from spatial surveys, creating administrative friction, legal ambiguity, and vulnerability to disputes. This fragmentation inherently limits the speed of infrastructure development and economic mobilization.
                    </p>
                  </div>

                  <div className="h-48 w-full rounded-2xl bg-surface-container flex items-center justify-center p-6 relative overflow-hidden shadow-inner group-hover:scale-[1.02] transition-transform duration-300 border border-border-subtle/50">
                    <svg className="w-full h-full text-outline-variant/40" fill="none" stroke="currentColor" viewBox="0 0 400 200">
                      <path d="M50 100 Q 150 50, 250 100 T 350 150" strokeDasharray="4 4" strokeWidth="2" />
                      <circle cx="50" cy="100" fill="currentColor" r="4" />
                      <circle cx="250" cy="100" fill="currentColor" r="4" />
                      <circle cx="350" cy="150" fill="currentColor" r="4" />
                      <path className="text-error/40" d="M50 150 L 150 150 L 150 50" strokeWidth="1.5" />
                      <path className="text-error/40" d="M250 50 L 350 50 L 350 150" strokeWidth="1.5" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-surface-container/60 via-transparent to-surface-container/60 pointer-events-none" />
                  </div>
                </div>

                {/* Container 2: 02. Unified Synthesis (Hover Mode) */}
                <div className="bg-surface-white rounded-3xl p-8 md:p-10 border border-border-subtle shadow-sm hover:shadow-2xl hover:scale-[1.02] hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group cursor-pointer">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary mb-4 flex items-center gap-3 font-bold transition-colors">
                      <span className="text-primary font-tabular-nums text-headline-md">02.</span>
                      Unified Synthesis
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-8">
                      BHUNITI serves as the operational connective tissue. By mathematically aligning geospatial geometries with authenticated administrative metadata, the platform produces a single, verifiable institutional truth, dramatically reducing risk profiles for all stakeholders.
                    </p>
                  </div>

                  <div className="h-48 w-full rounded-2xl bg-primary/5 flex items-center justify-center p-6 relative overflow-hidden shadow-sm group-hover:scale-[1.02] transition-transform duration-300 border border-primary/20">
                    <svg className="w-full h-full text-primary" fill="none" stroke="currentColor" viewBox="0 0 400 200">
                      <path d="M50 100 L 350 100" strokeWidth="2.5" />
                      <circle className="text-secondary" cx="50" cy="100" fill="currentColor" r="6" />
                      <circle className="text-primary" cx="200" cy="100" fill="currentColor" r="8" />
                      <circle className="text-secondary" cx="350" cy="100" fill="currentColor" r="6" />
                      <path className="text-primary/40" d="M200 50 L 200 150" strokeWidth="2" />
                      <path className="text-primary/20" d="M150 100 L 250 100" strokeWidth="4" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="w-full h-[1px] bg-border-subtle my-4" />

              {/* Technological Foundation Grid */}
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4">
                  <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase font-bold">
                    Technological Foundation
                  </span>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                    Precision Architecture
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-surface-white rounded-2xl p-8 flex flex-col shadow-md relative overflow-hidden group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-border-subtle">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                      <span className="material-symbols-outlined text-[120px] text-primary">satellite_alt</span>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-4xl mb-6 relative z-10">layers</span>
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-3 relative z-10 font-bold">
                      Spatial Intelligence
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant relative z-10 leading-relaxed">
                      High-fidelity geometric processing engine aligning disparate coordinate systems into a unified national grid with sub-meter accuracy.
                    </p>
                  </div>

                  <div className="bg-surface-white rounded-2xl p-8 flex flex-col shadow-md relative overflow-hidden group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-border-subtle">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                      <span className="material-symbols-outlined text-[120px] text-primary">analytics</span>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-4xl mb-6 relative z-10">memory</span>
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-3 relative z-10 font-bold">
                      Algorithmic Verification
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant relative z-10 leading-relaxed">
                      Automated structural analysis of legal documentation, detecting topological anomalies and administrative discrepancies prior to human review.
                    </p>
                  </div>

                  <div className="bg-surface-white rounded-2xl p-8 flex flex-col shadow-md relative overflow-hidden group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-border-subtle">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                      <span className="material-symbols-outlined text-[120px] text-primary">cloud_done</span>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-4xl mb-6 relative z-10">dns</span>
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-3 relative z-10 font-bold">
                      Resilient Infrastructure
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant relative z-10 leading-relaxed">
                      Distributed, government-grade data repositories ensuring continuous availability, cryptographic integrity, and compliance with data localization mandates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Institutional Contact Section */}
        <section className="w-full px-margin-mobile md:px-margin-desktop py-24 bg-surface">
          <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-16">
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Institutional Contact
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                For administrative inquiries, integration requests, or governance documentation, please direct communications through official channels.
              </p>
              <div className="flex flex-col gap-6 mt-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 font-bold">
                      Headquarters
                    </span>
                    <span className="font-body-md text-body-md text-on-surface">
                      National Land Governance Center, New Delhi, India
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-primary text-xl">mail</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 font-bold">
                      Official Communications
                    </span>
                    <span className="font-body-md text-body-md text-on-surface">
                      governance@bhuniti.gov.in
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-2/3 bg-surface-white border border-border-subtle rounded-3xl p-8 md:p-12 shadow-sm">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-6 font-bold">
                Administrative Request Routing
              </h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface uppercase font-bold" htmlFor="dept">
                    Department / Ministry
                  </label>
                  <input
                    className="bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-3 text-body-md focus:outline-none focus:border-primary transition-colors text-on-surface"
                    id="dept"
                    placeholder="e.g. Department of Revenue"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface uppercase font-bold" htmlFor="designation">
                    Officer Designation
                  </label>
                  <input
                    className="bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-3 text-body-md focus:outline-none focus:border-primary transition-colors text-on-surface"
                    id="designation"
                    placeholder="e.g. District Collector"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-label-caps text-label-caps text-on-surface uppercase font-bold" htmlFor="subject">
                    Subject of Inquiry
                  </label>
                  <input
                    className="bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-3 text-body-md focus:outline-none focus:border-primary transition-colors text-on-surface"
                    id="subject"
                    placeholder="e.g. Spatial Data Federation Integration"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-label-caps text-label-caps text-on-surface uppercase font-bold" htmlFor="message">
                    Official Statement / Request
                  </label>
                  <textarea
                    className="bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-3 text-body-md focus:outline-none focus:border-primary transition-colors text-on-surface resize-none"
                    id="message"
                    placeholder="Outline your jurisdictional integration requirements..."
                    rows={4}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="button"
                    className="px-8 py-4 bg-primary text-on-primary font-label-caps text-label-caps uppercase rounded-xl hover:bg-surface-tint transition-all shadow-md font-bold cursor-pointer"
                  >
                    Submit Administrative Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
