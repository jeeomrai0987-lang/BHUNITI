export default function Governance() {
  return (
    <main className="w-full pt-20"><div className="flex flex-col w-full bg-background min-h-full">

    <section className="w-full max-w-[1440px] mx-auto px-margin-desktop py-16 lg:py-24">
    <div className="max-w-4xl">
    <h1 className="font-display text-display text-primary mb-6">Institutional Intelligence:<br />The BHUNITI Governance Model</h1>
    <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">
            A structured, multi-tier governance framework designed for precision, accountability, and transparency in land administration. 
            Built upon a rigorous Role-Based Access Control (RBAC) foundation to align with national digital infrastructure goals.
          </p>
    </div>
    </section>

    <section className="w-full max-w-[1440px] mx-auto px-margin-desktop mb-24">
    <div className="flex items-center gap-4 mb-8">
    <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase">01 / operational tiers</span>
    <div className="h-[1px] flex-grow bg-border-subtle"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

    <div className="bg-surface-white rounded-xl shadow-sm border border-border-subtle p-6 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
    <span className="material-symbols-outlined text-[64px] text-primary">person</span>
    </div>
    <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center mb-6 relative z-10">
    <span className="font-tabular-nums text-tabular-nums text-on-primary-fixed">1</span>
    </div>
    <h3 className="font-headline-md text-headline-md text-primary mb-3 relative z-10">Citizen</h3>
    <p className="font-body-md text-body-md text-on-surface-variant flex-grow relative z-10">
              Public access layer focusing on transparency and service delivery. Citizens can view non-sensitive land records, initiate service requests, and track application status.
            </p>
    <div className="mt-6 pt-4 border-t border-border-subtle relative z-10">
    <span className="font-label-caps text-label-caps text-secondary uppercase block mb-2">Capabilities</span>
    <ul className="space-y-1">
    <li className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-status-success">check_circle</span> View Records</li>
    <li className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-status-success">check_circle</span> Submit Requests</li>
    </ul>
    </div>
    </div>

    <div className="bg-surface-white rounded-xl shadow-sm border border-border-subtle p-6 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
    <span className="material-symbols-outlined text-[64px] text-secondary">edit_document</span>
    </div>
    <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center mb-6 relative z-10">
    <span className="font-tabular-nums text-tabular-nums text-on-secondary-fixed">2</span>
    </div>
    <h3 className="font-headline-md text-headline-md text-primary mb-3 relative z-10">Revenue Officer</h3>
    <p className="font-body-md text-body-md text-on-surface-variant flex-grow relative z-10">
              Front-line operators responsible for data collection, initial verification, and localized GIS mapping. They process citizen requests and update ground-level intelligence.
            </p>
    <div className="mt-6 pt-4 border-t border-border-subtle relative z-10">
    <span className="font-label-caps text-label-caps text-secondary uppercase block mb-2">Capabilities</span>
    <ul className="space-y-1">
    <li className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-status-success">check_circle</span> Data Entry & Edit</li>
    <li className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-status-success">check_circle</span> Field Verification</li>
    </ul>
    </div>
    </div>

    <div className="bg-surface-white rounded-xl shadow-sm border border-border-subtle p-6 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
    <span className="material-symbols-outlined text-[64px] text-tertiary">gavel</span>
    </div>
    <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center mb-6 relative z-10">
    <span className="font-tabular-nums text-tabular-nums text-on-tertiary-fixed">3</span>
    </div>
    <h3 className="font-headline-md text-headline-md text-primary mb-3 relative z-10">District Officer</h3>
    <p className="font-body-md text-body-md text-on-surface-variant flex-grow relative z-10">
              Supervisory layer providing oversight, dispute resolution, and approval for significant structural changes to regional land records. Ensures protocol compliance.
            </p>
    <div className="mt-6 pt-4 border-t border-border-subtle relative z-10">
    <span className="font-label-caps text-label-caps text-secondary uppercase block mb-2">Capabilities</span>
    <ul className="space-y-1">
    <li className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-status-success">check_circle</span> Approve Changes</li>
    <li className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-status-success">check_circle</span> Dispute Override</li>
    </ul>
    </div>
    </div>

    <div className="bg-primary rounded-xl shadow-md p-6 flex flex-col h-full relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
    <span className="material-symbols-outlined text-[64px] text-on-primary">admin_panel_settings</span>
    </div>
    <div className="w-10 h-10 rounded-full bg-surface-white/20 flex items-center justify-center mb-6 relative z-10 backdrop-blur-sm">
    <span className="font-tabular-nums text-tabular-nums text-on-primary">4</span>
    </div>
    <h3 className="font-headline-md text-headline-md text-on-primary mb-3 relative z-10">Administration</h3>
    <p className="font-body-md text-body-md text-on-primary/80 flex-grow relative z-10">
              State/National level oversight. Focuses on macro-analytics, policy implementation, system-wide audits, and configuring the global parameters of the RBAC system.
            </p>
    <div className="mt-6 pt-4 border-t border-on-primary/20 relative z-10">
    <span className="font-label-caps text-label-caps text-inverse-primary uppercase block mb-2">Capabilities</span>
    <ul className="space-y-1">
    <li className="font-body-sm text-body-sm text-on-primary/90 flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-status-success">check_circle</span> System Configuration</li>
    <li className="font-body-sm text-body-sm text-on-primary/90 flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-status-success">check_circle</span> Global Analytics</li>
    </ul>
    </div>
    </div>
    </div>
    </section>

    <section className="w-full bg-surface-white py-24 border-y border-border-subtle">
    <div className="max-w-[1440px] mx-auto px-margin-desktop">
    <div className="flex flex-col lg:flex-row gap-16">

    <div className="lg:w-1/3 flex flex-col justify-center">
    <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase mb-4">02 / Architecture of trust</span>
    <h2 className="font-headline-lg text-headline-lg text-primary mb-6">Role-Based Access Control (RBAC)</h2>
    <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                Accountability is hardcoded into BHUNITI. Every action—from viewing a public registry to altering geospatial coordinates—is logged, timestamped, and restricted by a cryptographic RBAC matrix.
              </p>
    <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                The Decision Tree ensures that lower-tier modifications cannot enter the definitive ledger without explicit, traceable approval from higher oversight tiers, creating a self-auditing ecosystem resistant to unauthorized manipulation.
              </p>
    <a className="inline-flex items-center gap-2 text-secondary font-label-caps text-label-caps hover:text-on-surface-variant transition-colors group w-max" href="#">
                Review Technical Specs
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
    </a>
    </div>

    <div className="lg:w-2/3 bg-surface-container-lowest border border-border-subtle rounded-xl p-8 shadow-sm relative overflow-hidden">

    <svg className="w-full h-[400px]" fill="none" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
    <pattern height="40" id="grid" patternunits="userSpaceOnUse" width="40">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5"></path>
    </pattern>
    <lineargradient gradientunits="userSpaceOnUse" id="flow" x1="0" x2="800" y1="0" y2="0">
    <stop offset="0%" stopColor="#0058be" stopOpacity="0.2"></stop>
    <stop offset="50%" stopColor="#0058be" stopOpacity="0.8"></stop>
    <stop offset="100%" stopColor="#0b1c30"></stop>
    </lineargradient>
    </defs>
    <rect fill="url(#grid)" height="400" width="800"></rect>

    <path className="animate-[dash_20s_linear_infinite]" d="M 150 200 C 300 200, 300 100, 450 100" fill="none" stroke="url(#flow)" strokeDasharray="6 6" strokeWidth="3"></path>
    <path className="animate-[dash_20s_linear_infinite]" d="M 150 200 C 300 200, 300 300, 450 300" fill="none" stroke="url(#flow)" strokeDasharray="6 6" strokeWidth="3"></path>
    <path d="M 450 100 C 550 100, 550 200, 650 200" fill="none" stroke="url(#flow)" strokeWidth="4"></path>
    <path d="M 450 300 C 550 300, 550 200, 650 200" fill="none" stroke="url(#flow)" strokeWidth="4"></path>
    <path d="M 650 200 L 750 200" fill="none" stroke="#0b1c30" strokeWidth="5"></path>


    <circle cx="150" cy="200" fill="#ffffff" r="24" stroke="#e2e8f0" strokeWidth="2"></circle>
    <circle cx="150" cy="200" fill="#0058be" r="12"></circle>
    <text fill="#45464d" fontFamily="Inter" fontSize="12" fontWeight="600" textAnchor="middle" x="150" y="245">Initiate</text>

    <rect fill="#ffffff" height="40" rx="4" stroke="#e2e8f0" strokeWidth="2" width="80" x="410" y="80"></rect>
    <text fill="#0058be" fontFamily="Inter" fontSize="12" fontWeight="600" textAnchor="middle" x="450" y="104">Verify GIS</text>
    <rect fill="#ffffff" height="40" rx="4" stroke="#e2e8f0" strokeWidth="2" width="80" x="410" y="280"></rect>
    <text fill="#0058be" fontFamily="Inter" fontSize="12" fontWeight="600" textAnchor="middle" x="450" y="304">Legal Chk</text>

    <polygon fill="#ffffff" points="650,170 680,200 650,230 620,200" stroke="#0b1c30" strokeWidth="2"></polygon>
    <circle cx="650" cy="200" fill="#0b1c30" r="8"></circle>
    <text fill="#191c1d" fontFamily="Inter" fontSize="12" fontWeight="600" textAnchor="middle" x="650" y="250">Approve</text>

    <rect fill="#000000" height="40" rx="4" width="60" x="730" y="180"></rect>
    <text fill="#ffffff" fontFamily="Inter" fontSize="12" fontWeight="600" textAnchor="middle" x="760" y="204">Commit</text>
    </svg>

    </div>
    </div>
    </div>
    </section>

    <section className="w-full max-w-[1440px] mx-auto px-margin-desktop py-24">
    <div className="flex items-center gap-4 mb-12">
    <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase">03 / Strategic alignment</span>
    <div className="h-[1px] flex-grow bg-border-subtle"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

    <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-md border border-border-subtle">
    <div className="bg-cover bg-center w-full h-full" data-alt="A modern, high-tech government data center or command room in India. Cinematic lighting, glowing screens displaying maps and charts. The aesthetic is clean, professional, and sophisticated, using deep blues, bright whites, and subtle silver metallic tones to convey trust and digital modernization. Wide angle shot, highly detailed." style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuCWwKYku1tsvmJj3e_9n_MwUW10A7SIUBeWHKN1aRj-DLDpiYTn0Zn7Q261SBAcRfCcUEhX5WTUG6sNSdylkUvrAYWg4WM7XoALslYKu3qPrfKwmKlSWN0VHSspH56qLLwPBBukwyyuSG3PM6cqcF44Ic4IPRQcw4z0bWCQJIOKZnZnBr-mnMzx9sWzMpwyJn5AU0fsku93i7V5lAvkhmLLn0N6OJUdNl7qrRi13vzW57PHxS7FhzA\')'}}></div>
    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent mix-blend-multiply"></div>
    <div className="absolute bottom-0 left-0 p-8 w-full">
    <div className="inline-flex items-center gap-2 bg-surface-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-surface-white/30">
    <span className="material-symbols-outlined text-[16px] text-surface-white">flag</span>
    <span className="font-label-caps text-label-caps text-surface-white uppercase tracking-wider">Digital India Initiative</span>
    </div>
    <h3 className="font-headline-lg text-headline-lg text-surface-white mb-2">Modernizing National Infrastructure</h3>
    </div>
    </div>

    <div className="flex flex-col gap-8">
    <div>
    <h3 className="font-headline-md text-headline-md text-primary mb-3 flex items-center gap-3">
    <span className="material-symbols-outlined text-secondary">domain_verification</span>
                 DILRMP Compliance
              </h3>
    <p className="font-body-md text-body-md text-on-surface-variant">
                BHUNITI is engineered to directly support the Digital India Land Records Modernization Programme (DILRMP). By digitizing spatial and textual data into a unified, secure ledger, we eliminate silos and reduce litigation inherent in legacy paper-based systems.
              </p>
    </div>
    <div className="w-full h-[1px] bg-border-subtle"></div>
    <div>
    <h3 className="font-headline-md text-headline-md text-primary mb-3 flex items-center gap-3">
    <span className="material-symbols-outlined text-secondary">security</span>
                 Data Sovereignty
              </h3>
    <p className="font-body-md text-body-md text-on-surface-variant">
                All geospatial data and citizen records are maintained within domestically hosted, government-approved cloud infrastructure, ensuring strict adherence to national data localization and sovereignty mandates.
              </p>
    </div>
    <div className="w-full h-[1px] bg-border-subtle"></div>
    <div>
    <h3 className="font-headline-md text-headline-md text-primary mb-3 flex items-center gap-3">
    <span className="material-symbols-outlined text-secondary">handshake</span>
                 Transparent Governance
              </h3>
    <p className="font-body-md text-body-md text-on-surface-variant">
                By exposing an immutable audit trail of all land transactions and mapping alterations, BHUNITI fosters an environment of zero-trust verification, bridging the trust gap between administrative bodies and the citizenry.
              </p>
    </div>
    </div>
    </div>
    </section>
    </div></main>
  );
}
