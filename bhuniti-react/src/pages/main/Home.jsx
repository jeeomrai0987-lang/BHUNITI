import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MAIN_ROUTES, CITIZEN_ROUTES, REVENUE_ROUTES } from "../../routes";
import Virtual360Viewer from "../../components/Virtual360Viewer";

export default function Home() {
  const navigate = useNavigate();
  const [showParcelModal, setShowParcelModal] = useState(false);
  const [is360Open, setIs360Open] = useState(false);

  const parcelP1024 = {
    id: "p-1024",
    ulpin: "09-0824-0014-1024",
    khasra_number: "412/1",
    survey_number: "145/2",
    khata_number: "89",
    owner_name: "Rahul Sharma",
    co_owners: ["Sunita Sharma (50%)"],
    land_type: "Agricultural (Zamin)",
    area_ha: 2.00,
    area_sqm: 20000.0,
    valuation_inr: 4800000.0,
    verification_status: "Requires Verification",
    is_disputed: true,
    dispute_reason: "Registered RoR Area: 2.00 ha vs GIS Computed Polygon: 2.18 ha (+0.18 ha discrepancy)",
    encumbrance_status: "Pending Field Verification",
    state: "Uttar Pradesh",
    district: "Ghaziabad",
    tehsil: "Modinagar",
    village: "Sikandrabad",
    centroid_lat: 28.8350,
    centroid_lng: 77.5825
  };

  return (
    <main className="w-full pt-20">
      <div className="flex flex-col w-full font-body-md text-on-surface">
        {/* Hero Section */}
        <section className="relative w-full min-h-[90vh] flex items-center justify-center -mt-20 pt-20 overflow-hidden bg-surface">
          <div
            className="absolute inset-0 z-0"
            data-alt="A detailed realistic cadastral map showing land parcels, boundaries, and survey lines."
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000")',
              backgroundSize: "cover",
              backgroundPosition: "center center",
              filter: "contrast(1.2) saturate(1.3) brightness(0.85)"
            }}
          />
          <div
            className="absolute inset-0 backdrop-blur-[2px] z-0 bg-primary/20"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000")',
              backgroundSize: "cover",
              backgroundPosition: "center center",
              filter: "contrast(1.2) saturate(1.3) brightness(0.85)"
            }}
          />

          <div className="relative z-10 max-w-[1440px] mx-auto px-margin-desktop w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Main Hero Card — Pure Solid White Background (No Glassy View) */}
            <div className="lg:col-span-7 flex flex-col gap-6 bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-border-subtle">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-highest rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-status-success" />
                <span className="font-label-caps text-on-surface uppercase tracking-wider text-[10px]">
                  National Infrastructure Initiative
                </span>
              </div>
              <h1 className="font-display text-display lg:text-[64px] lg:leading-[72px] text-on-surface font-bold tracking-tight">
                Building a Trusted Digital Foundation for <span className="text-secondary">Land Governance</span>
              </h1>
              <p className="font-body-lg text-on-surface-variant max-w-2xl">
                BHUNITI integrates land records, GIS, registration, mutation, and historical data into one intelligent, parcel-centric governance platform.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => navigate(MAIN_ROUTES.login)}
                  className="px-8 py-3 bg-secondary text-on-primary font-label-caps rounded-lg hover:bg-secondary-container transition-colors shadow-md cursor-pointer"
                >
                  Access BHUNITI
                </button>
                <button
                  type="button"
                  onClick={() => navigate(MAIN_ROUTES.howItWorks)}
                  className="px-8 py-3 bg-surface-white border border-border-subtle text-on-surface font-label-caps rounded-lg hover:bg-surface-container transition-colors shadow-sm cursor-pointer"
                >
                  Explore How It Works
                </button>
              </div>
              <div className="mt-4 flex items-center gap-4 text-on-surface-variant font-label-caps text-[11px] uppercase tracking-wider">
                <span>Integrated</span>
                <span className="w-1 h-1 rounded-full bg-border-subtle" />
                <span>GIS-enabled</span>
                <span className="w-1 h-1 rounded-full bg-border-subtle" />
                <span>AI-assisted</span>
                <span className="w-1 h-1 rounded-full bg-border-subtle" />
                <span>Auditable</span>
              </div>
            </div>

            {/* Right Card: Parcel P-1024 Preview */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative z-10 bg-surface-white border border-border-subtle rounded-xl shadow-2xl overflow-hidden flex flex-col w-full max-w-sm">
                <div className="p-4 border-b border-border-subtle bg-surface-container-lowest flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-[24px]">my_location</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-md text-on-surface leading-tight">Parcel P-1024</span>
                      <span className="font-label-caps text-on-surface-variant text-[10px]">Active Selection</span>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-4 bg-surface-white">
                  <div className="px-3 py-2 bg-status-error/10 border border-status-error/20 rounded-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-status-error text-[16px]">warning</span>
                    <span className="font-label-caps text-status-error text-[11px]">Potential Area Discrepancy</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-b border-border-subtle pb-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-label-caps text-on-surface-variant text-[10px]">ULPIN</span>
                      <span className="font-tabular-nums text-on-surface text-sm">09-XXXX-XXXX-1024</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-label-caps text-on-surface-variant text-[10px]">Survey Number</span>
                      <span className="font-tabular-nums text-on-surface text-sm">145/2</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-label-caps text-on-surface-variant text-[10px]">Record Area</span>
                      <span className="font-tabular-nums text-on-surface text-sm">2.00 ha</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-label-caps text-on-surface-variant text-[10px]">GIS Computed Area</span>
                      <span className="font-tabular-nums text-status-error font-medium text-sm">2.18 ha</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <div className="flex flex-col gap-1">
                      <span className="font-label-caps text-on-surface-variant text-[10px]">Status</span>
                      <span className="font-body-sm text-status-warning font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-warning" /> Requires Verification
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowParcelModal(true)}
                      className="text-secondary font-label-caps hover:underline text-[11px] flex items-center gap-1 cursor-pointer font-bold"
                    >
                      View Details <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Data Fragmentation (Showcase Infographic) */}
        <section className="w-full py-24 bg-surface-container-lowest border-y border-border-subtle relative overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-margin-desktop text-center">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">
              Land Data Is Fragmented. Governance Shouldn't Be.
            </h2>
            <p className="font-body-lg text-on-surface-variant max-w-3xl mx-auto mb-16">
              Land information often exists across multiple disconnected systems. When textual records, spatial data, and legal registrations don't align, differences become systemic problems.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <div className="flex flex-col gap-6 items-center md:items-end">
                <div className="flex items-center gap-4 bg-surface px-4 py-3 border border-border-subtle rounded-lg shadow-sm w-64 justify-start transition-all duration-300 hover:shadow-md hover:border-primary/40 hover:scale-[1.02]">
                  <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <span className="font-label-caps text-on-surface">Land Records (RoR)</span>
                </div>
                <div className="flex items-center gap-4 bg-surface px-4 py-3 border border-border-subtle rounded-lg shadow-sm w-64 justify-start transition-all duration-300 hover:shadow-md hover:border-primary/40 hover:scale-[1.02]">
                  <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">map</span>
                  </div>
                  <span className="font-label-caps text-on-surface">GIS Spatial Data</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center relative">
                <div className="h-24 w-px bg-border-subtle md:hidden mb-4" />
                <div className="w-16 h-16 rounded-full border border-border-subtle flex items-center justify-center bg-surface z-10 shadow-sm transition-transform duration-300 hover:scale-110">
                  <span className="material-symbols-outlined text-primary text-[24px]">sync_problem</span>
                </div>
                <div className="absolute w-full h-px bg-border-subtle top-1/2 -z-10 hidden md:block" style={{ width: "200px", left: "-100px" }} />
                <div className="h-24 w-px bg-border-subtle md:hidden mt-4" />
              </div>

              <div className="flex flex-col gap-6 items-center md:items-start">
                <div className="flex items-center gap-4 bg-surface px-4 py-3 border border-border-subtle rounded-lg shadow-sm w-64 justify-start flex-row-reverse md:flex-row transition-all duration-300 hover:shadow-md hover:border-primary/40 hover:scale-[1.02]">
                  <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">gavel</span>
                  </div>
                  <span className="font-label-caps text-on-surface">Registration</span>
                </div>
                <div className="flex items-center gap-4 bg-surface px-4 py-3 border border-border-subtle rounded-lg shadow-sm w-64 justify-start flex-row-reverse md:flex-row transition-all duration-300 hover:shadow-md hover:border-primary/40 hover:scale-[1.02]">
                  <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">history</span>
                  </div>
                  <span className="font-label-caps text-on-surface">Historical Data</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: One Parcel One View Diagram (Showcase Infographic) */}
        <section className="w-full py-24 bg-primary text-on-primary relative overflow-hidden">
          <div
            className="absolute inset-0 z-0 opacity-10 mix-blend-overlay"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000")',
              backgroundSize: "cover",
              backgroundPosition: "center center",
              filter: "contrast(1.2) saturate(1.3) brightness(0.85)"
            }}
          />
          <div className="max-w-[1440px] mx-auto px-margin-desktop relative z-10 text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg mb-6">One Parcel. One Connected View.</h2>
            <p className="font-body-lg text-on-primary/80 max-w-3xl mx-auto">
              BHUNITI creates a unified intelligence layer around the land parcel, connecting all attributes, history, and spatial realities into a single source of truth.
            </p>
          </div>

          <div className="max-w-[1000px] mx-auto relative z-10 py-12 flex items-center justify-center">
            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
              {/* Central Entity Node (Hover Showcase) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-surface-white text-primary flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)] z-20 border-4 border-surface-container transition-all duration-300 hover:scale-110 hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] cursor-default">
                <span className="font-label-caps text-[10px] text-on-surface-variant">Central Entity</span>
                <span className="font-headline-md text-on-surface font-bold">P-1024</span>
              </div>

              <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 500 500">
                <circle cx="250" cy="250" fill="none" r="150" stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" strokeWidth="1" />
                <line stroke="rgba(255,255,255,0.4)" strokeWidth="2" x1="250" x2="250" y1="250" y2="50" />
                <line stroke="rgba(255,255,255,0.4)" strokeWidth="2" x1="250" x2="440" y1="250" y2="188" />
                <line stroke="rgba(255,255,255,0.4)" strokeWidth="2" x1="250" x2="367" y1="250" y2="411" />
                <line stroke="rgba(255,255,255,0.4)" strokeWidth="2" x1="250" x2="132" y1="250" y2="411" />
                <line stroke="rgba(255,255,255,0.4)" strokeWidth="2" x1="250" x2="59" y1="250" y2="188" />
              </svg>

              {/* Orbiting Showcase Nodes (Hover Only) */}
              <div className="absolute top-[20px] left-1/2 -translate-x-1/2 bg-surface/10 backdrop-blur-md border border-on-primary/20 px-4 py-2 rounded-lg text-center z-20 transition-all duration-300 hover:bg-surface/30 hover:scale-110 hover:border-white/40 cursor-default shadow-sm">
                <span className="material-symbols-outlined text-on-primary mb-1 text-[20px]">person</span>
                <div className="font-label-caps">Owner Data</div>
              </div>
              <div className="absolute top-[160px] right-[10px] bg-surface/10 backdrop-blur-md border border-on-primary/20 px-4 py-2 rounded-lg text-center z-20 transition-all duration-300 hover:bg-surface/30 hover:scale-110 hover:border-white/40 cursor-default shadow-sm">
                <span className="material-symbols-outlined text-on-primary mb-1 text-[20px]">share_location</span>
                <div className="font-label-caps">GIS Boundary</div>
              </div>
              <div className="absolute bottom-[60px] right-[60px] bg-surface/10 backdrop-blur-md border border-on-primary/20 px-4 py-2 rounded-lg text-center z-20 transition-all duration-300 hover:bg-surface/30 hover:scale-110 hover:border-white/40 cursor-default shadow-sm">
                <span className="material-symbols-outlined text-on-primary mb-1 text-[20px]">edit_document</span>
                <div className="font-label-caps">Mutation</div>
              </div>
              <div className="absolute bottom-[60px] left-[60px] bg-surface/10 backdrop-blur-md border border-on-primary/20 px-4 py-2 rounded-lg text-center z-20 transition-all duration-300 hover:bg-surface/30 hover:scale-110 hover:border-white/40 cursor-default shadow-sm">
                <span className="material-symbols-outlined text-on-primary mb-1 text-[20px]">timeline</span>
                <div className="font-label-caps">History</div>
              </div>
              <div className="absolute top-[160px] left-[10px] bg-surface/10 backdrop-blur-md border border-on-primary/20 px-4 py-2 rounded-lg text-center z-20 transition-all duration-300 hover:bg-surface/30 hover:scale-110 hover:border-white/40 cursor-default shadow-sm">
                <span className="material-symbols-outlined text-on-primary mb-1 text-[20px]">memory</span>
                <div className="font-label-caps">AI Analysis</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Interactive Parcel P-1024 Details Modal */}
      {showParcelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-border-subtle relative text-on-surface animate-scaleUp">
            <div className="flex items-start justify-between pb-4 border-b border-border-subtle">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-status-warning/10 text-status-warning rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Requires Verification
                  </span>
                  <span className="text-xs text-on-surface-variant">Khasra 412/1 • Khata 89</span>
                </div>
                <h3 className="font-display text-xl font-bold text-on-surface">
                  Parcel P-1024 (09-XXXX-XXXX-1024)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowParcelModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-status-error/10 border border-status-error/20 rounded-xl text-status-error">
                <p className="font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  Area Discrepancy Detected
                </p>
                <p className="text-[11px] mt-0.5 leading-relaxed text-on-surface-variant">
                  Textual RoR specifies 2.00 ha, but GIS satellite vector computes 2.18 ha (+0.18 ha variance). Field survey assigned under Case DC-2026-8941.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-surface-container-low rounded-xl border border-border-subtle">
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Owner</span>
                  <span className="font-bold text-on-surface">{parcelP1024.owner_name}</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl border border-border-subtle">
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Location</span>
                  <span className="font-bold text-on-surface">{parcelP1024.village}, {parcelP1024.tehsil}</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl border border-border-subtle">
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Record Area</span>
                  <span className="font-bold text-on-surface">{parcelP1024.area_ha} ha (7.90 Bigha)</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl border border-border-subtle">
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Valuation</span>
                  <span className="font-bold text-secondary">₹48.0 Lakh</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border-subtle flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowParcelModal(false);
                  setIs360Open(true);
                }}
                className="flex-1 py-3 px-4 bg-secondary text-on-primary font-bold text-xs rounded-xl shadow hover:bg-secondary-container transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">360</span>
                Launch 360° Ground Inspection
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowParcelModal(false);
                  navigate(REVENUE_ROUTES.gisExplorer);
                }}
                className="py-3 px-4 bg-surface-white border border-border-subtle text-on-surface font-bold text-xs rounded-xl hover:bg-surface-container transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                View on GIS Map →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 360 Panorama Modal */}
      {is360Open && (
        <Virtual360Viewer parcel={parcelP1024} onClose={() => setIs360Open(false)} />
      )}
    </main>
  );
}
