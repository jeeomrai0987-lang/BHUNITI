import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CITIZEN_ROUTES } from "../../routes";

export default function CitizenPortal() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e) {
    if (e) e.preventDefault();
    const clean = searchQuery.trim() || "1024";
    navigate(`${CITIZEN_ROUTES.searchRecords}?q=${encodeURIComponent(clean)}`);
  }

  return (
    <main className="w-full pt-16 bg-surface min-h-screen">
      <div className="flex flex-col w-full relative">
        <section className="w-full relative px-margin-mobile lg:px-margin-desktop py-16 lg:py-24 bg-surface-container-lowest">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
            <span className="text-label-md text-primary tracking-[0.1em] uppercase mb-4 bg-primary/10 px-3 py-1 rounded-full">
              Citizen Portal
            </span>
            <h1 className="font-display text-[40px] md:text-[56px] leading-[1.1] tracking-tight text-on-surface mb-6 max-w-3xl">
              Secure, transparent <br />
              <span className="text-on-surface-variant">land information.</span>
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-2xl mb-10">
              Access your property records, initiate mutations, and track applications with the unified government land governance platform.
            </p>

            <form
              onSubmit={handleSearch}
              className="w-full max-w-2xl bg-surface-container-lowest shadow-xl shadow-on-surface/5 rounded-2xl p-2 flex items-center group relative overflow-hidden transition-all duration-300 focus-within:shadow-2xl focus-within:shadow-primary/10 border border-border-subtle"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="pl-4 pr-2 text-on-surface-variant relative z-10">
                <span className="material-symbols-outlined text-[24px]">search</span>
              </div>
              <input
                className="w-full bg-transparent border-none outline-none font-body-lg text-on-surface placeholder:text-on-surface-variant/50 py-4 px-2 relative z-10"
                placeholder="Search by ULPIN, Khasra No., or Owner Name..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary text-on-primary font-label-md px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors relative z-10 shrink-0 cursor-pointer font-bold"
              >
                Search Records
              </button>
            </form>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop w-full grid grid-cols-1 lg:grid-cols-12 gap-gutter py-8 relative z-20">
          <div className="lg:col-span-8 flex flex-col gap-gutter">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <button
                type="button"
                onClick={() => navigate(`${CITIZEN_ROUTES.searchRecords}?q=1024&tab=details`)}
                className="bg-surface-container-lowest shadow-sm rounded-xl p-6 text-left hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[160px] group relative overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[24px]">description</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-on-surface font-bold">Download Title</h3>
                  <p className="font-body-sm text-on-surface-variant mt-1">Get verified copies (RoR)</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate(CITIZEN_ROUTES.landServices)}
                className="bg-surface-container-lowest shadow-sm rounded-xl p-6 text-left hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[160px] group relative overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 via-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                  <span className="material-symbols-outlined text-[24px]">edit_document</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-on-surface font-bold">Initiate Mutation</h3>
                  <p className="font-body-sm text-on-surface-variant mt-1">Start property transfer</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate(`${CITIZEN_ROUTES.searchRecords}?q=1024&tab=map`)}
                className="bg-surface-container-lowest shadow-sm rounded-xl p-6 text-left hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[160px] group relative overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-tertiary-fixed-dim/0 via-tertiary-fixed-dim/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-12 h-12 bg-tertiary-fixed text-on-tertiary-fixed rounded-lg flex items-center justify-center group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                  <span className="material-symbols-outlined text-[24px]">map</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-on-surface font-bold">View Maps</h3>
                  <p className="font-body-sm text-on-surface-variant mt-1">Access spatial GIS data</p>
                </div>
              </button>
            </div>

            <div className="bg-surface-container-lowest shadow-sm rounded-2xl p-6 lg:p-8 flex flex-col h-full relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-surface-container-high rounded-full blur-3xl opacity-50" />
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                  <h2 className="font-headline-lg text-on-surface font-bold">Recent Search Result</h2>
                  <p className="font-body-md text-on-surface-variant">Last accessed today, 09:42 AM</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`${CITIZEN_ROUTES.searchRecords}?q=1024`)}
                  className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors flex items-center gap-2 font-label-md font-bold cursor-pointer"
                >
                  VIEW FULL RECORD
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6 bg-surface-container p-4 rounded-xl relative z-10">
                <div className="w-full md:w-[240px] h-[160px] rounded-lg overflow-hidden shadow-inner flex-shrink-0 relative group">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600')",
                    }}
                  />
                  <div className="absolute inset-0 bg-surface/20 group-hover:bg-surface/0 transition-colors" />
                  <div className="absolute bottom-2 right-2 bg-surface/90 backdrop-blur text-on-surface font-tabular-nums text-[10px] px-2 py-1 rounded shadow font-bold">
                    GIS LAYER: ACTIVE
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-primary-container text-on-primary-container font-label-md px-2 py-0.5 rounded text-[10px] font-bold">
                        VERIFIED
                      </span>
                      <span className="font-tabular-nums text-on-surface-variant text-sm tracking-wider font-semibold">
                        ULPIN: 09-0824-0014-1024
                      </span>
                    </div>
                    <h3 className="font-headline-md text-on-surface mb-4 font-bold">Parcel P-1024, Khasra 412/1</h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                      <div>
                        <p className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider mb-1 font-bold">
                          Registered Owner
                        </p>
                        <p className="font-body-md text-on-surface flex items-center gap-2 font-medium">
                          Rahul Sharma
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider mb-1 font-bold">
                          Total Area
                        </p>
                        <p className="font-tabular-nums text-on-surface font-semibold">2.00 ha (7.90 Bigha)</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider mb-1 font-bold">
                          Land Type
                        </p>
                        <p className="font-body-md text-on-surface">Agricultural (Zamin)</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider mb-1 font-bold">
                          Encumbrances
                        </p>
                        <p className="font-body-md text-status-success font-semibold">Clean (Nishkank)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-gutter">
            <div className="bg-surface-container-lowest shadow-sm rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-secondary-container rounded-full blur-3xl opacity-30" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="font-headline-md text-on-surface flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined text-primary text-[20px]">folder_open</span>
                  My Applications
                </h2>
                <button
                  type="button"
                  onClick={() => navigate(CITIZEN_ROUTES.myApplications)}
                  className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>

              <div className="flex flex-col gap-4 relative z-10">
                <div
                  onClick={() => navigate(CITIZEN_ROUTES.myApplications)}
                  className="p-4 rounded-xl bg-surface hover:bg-surface-container transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/30"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-tabular-nums text-[12px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded font-mono">
                      MUT-2026-8941
                    </span>
                    <span className="flex items-center gap-1.5 text-label-md text-secondary bg-secondary/10 px-2 py-1 rounded-full text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      In Review
                    </span>
                  </div>
                  <h4 className="font-headline-md text-on-surface text-[16px] mb-1 group-hover:text-primary transition-colors font-bold">
                    Title Transfer Request
                  </h4>
                  <p className="font-body-sm text-on-surface-variant mb-3">Submitted for Parcel P-1024</p>
                  <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-primary rounded-full relative" />
                  </div>
                </div>

                <div
                  onClick={() => navigate(CITIZEN_ROUTES.myApplications)}
                  className="p-4 rounded-xl bg-surface hover:bg-surface-container transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/30"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-tabular-nums text-[12px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded font-mono">
                      MUT-2025-3310
                    </span>
                    <span className="flex items-center gap-1.5 text-label-md text-status-success bg-status-success/10 px-2 py-1 rounded-full text-xs font-bold">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Completed
                    </span>
                  </div>
                  <h4 className="font-headline-md text-on-surface text-[16px] mb-1 group-hover:text-primary transition-colors font-bold">
                    Boundary Delineation
                  </h4>
                  <p className="font-body-sm text-on-surface-variant">Closed &amp; Stamped in RoR</p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(CITIZEN_ROUTES.myApplications)}
                  className="w-full py-3 mt-2 font-label-md text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors flex items-center justify-center gap-2 font-bold cursor-pointer"
                >
                  View All Applications
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="bg-surface-container-lowest shadow-sm rounded-2xl p-6 mt-auto overflow-hidden relative group">
              <div className="absolute right-0 top-0 w-32 h-32 bg-primary text-on-primary rounded-bl-[100px] flex items-start justify-end p-4 transition-transform duration-500 group-hover:scale-110 origin-top-right">
                <span className="material-symbols-outlined text-[40px] opacity-20">help</span>
              </div>
              <div className="relative z-10 w-3/4">
                <h3 className="font-headline-md text-on-surface mb-2 font-bold">Need Help?</h3>
                <p className="font-body-sm text-on-surface-variant mb-6 leading-relaxed">
                  Access our comprehensive citizen guide for step-by-step instructions on land services.
                </p>
                <button
                  type="button"
                  onClick={() => navigate(CITIZEN_ROUTES.helpSupport)}
                  className="text-primary font-label-md flex items-center gap-2 hover:underline underline-offset-4 decoration-primary/50 font-bold cursor-pointer"
                >
                  VISIT HELP CENTER
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
