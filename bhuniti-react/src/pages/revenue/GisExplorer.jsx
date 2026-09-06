import { useState, useEffect } from "react";
import ParcelMapViewer from "../../components/ParcelMapViewer";
import { api } from "../../services/api";
import { GHAZIABAD_ADMINISTRATIVE_DATA } from "../../data/administrativeDivisions";

export default function GisExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTehsil, setSelectedTehsil] = useState("Modinagar");
  const [selectedVillage, setSelectedVillage] = useState("Sikandrabad");
  const [parcels, setParcels] = useState([]);
  const [selectedParcelId, setSelectedParcelId] = useState("09-0824-0014-1024");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tehsils = Object.keys(GHAZIABAD_ADMINISTRATIVE_DATA);
  const villages = GHAZIABAD_ADMINISTRATIVE_DATA[selectedTehsil]?.villages || [];

  function handleTehsilChange(tehsilName) {
    setSelectedTehsil(tehsilName);
    const firstVillage = GHAZIABAD_ADMINISTRATIVE_DATA[tehsilName]?.villages[0]?.name || "";
    setSelectedVillage(firstVillage);
  }

  useEffect(() => {
    async function loadGisParcels() {
      try {
        setLoading(true);
        const data = await api.parcels.getGisAll(null, selectedTehsil);
        if (data && data.length > 0) {
          const formatted = data.map((p) => ({
            ...p,
            polygon_coords: p.boundary_geojson
              ? JSON.parse(p.boundary_geojson).coordinates[0].map((c) => [c[1], c[0]])
              : [
                  [p.centroid_lat - 0.0015, p.centroid_lng - 0.0015],
                  [p.centroid_lat - 0.0015, p.centroid_lng + 0.0015],
                  [p.centroid_lat + 0.0015, p.centroid_lng + 0.0015],
                  [p.centroid_lat + 0.0015, p.centroid_lng - 0.0015]
                ]
          }));
          setParcels(formatted);
        }
      } catch (err) {
        console.log("Using default GIS parcels:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadGisParcels();
  }, [selectedTehsil]);

  async function handleSearch(e) {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      const results = await api.parcels.search(searchQuery.trim());
      if (results && results.length > 0) {
        const p = results[0];
        setSelectedParcelId(p.ulpin || p.id);
        setSidebarOpen(false);
        return;
      }
    } catch (err) {
      console.log("Search error:", err.message);
    } finally {
      setLoading(false);
    }
    setSelectedParcelId(searchQuery.trim());
    setSidebarOpen(false);
  }

  return (
    <main className="relative pt-16 min-h-screen bg-background flex flex-col">
      {/* Top Header Bar */}
      <div className="px-4 sm:px-8 py-3 flex items-center justify-between bg-surface border-b border-outline-variant/20 text-xs">
        <div className="flex items-center gap-2 text-on-surface-variant font-label-md">
          <a className="hover:text-primary" href="#">Revenue Officer</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-bold">GIS Explorer &amp; 360° Inspection</span>
        </div>

        {/* Mobile Search Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden px-3 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">{sidebarOpen ? "close" : "search"}</span>
            {sidebarOpen ? "Close Search" : "Search & Roster"}
          </button>
          <span className="hidden sm:flex items-center gap-1.5 text-secondary font-semibold bg-secondary/10 px-2.5 py-1 rounded-full text-[11px]">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" /> PostGIS Cloud Active
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row w-full p-2 sm:p-4 md:p-6 gap-4 sm:gap-6 overflow-hidden relative">
        {/* Left Side Search & Filter Sidebar */}
        <div
          className={`
            w-full lg:w-80 flex-shrink-0 bg-surface-container rounded-2xl sm:rounded-3xl border border-outline-variant/30 p-4 sm:p-5 flex flex-col justify-between shadow-xl
            ${sidebarOpen ? "fixed inset-x-3 top-28 bottom-3 z-[500] max-h-[85vh] overflow-y-auto block" : "hidden lg:flex"}
          `}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-base sm:text-lg text-on-surface">Spatial Land Search</h2>
                <p className="text-body-sm text-[11px] sm:text-xs text-on-surface-variant">Query cadastral parcels by ULPIN / Khasra</p>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSearch} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-label-md text-on-surface-variant uppercase tracking-wider font-bold">
                  Universal Land PIN (ULPIN) / Khasra
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">
                    tag
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. 1024, 412/1, P-1026"
                    className="w-full pl-8 pr-3 py-2 bg-surface rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs text-on-surface font-medium"
                  />
                </div>
              </div>

              {/* Complete Tehsil and Village Selectors */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-[9px] font-label-md text-on-surface-variant uppercase tracking-wider font-bold">
                    Tehsil (तहसील)
                  </label>
                  <select
                    value={selectedTehsil}
                    onChange={(e) => handleTehsilChange(e.target.value)}
                    className="w-full px-2 py-1.5 bg-surface rounded-xl border border-outline-variant/50 text-xs text-on-surface font-semibold outline-none cursor-pointer"
                  >
                    {tehsils.map((t) => (
                      <option key={t} value={t}>{t} ({GHAZIABAD_ADMINISTRATIVE_DATA[t].nameHindi})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-label-md text-on-surface-variant uppercase tracking-wider font-bold">
                    Village (गाँव)
                  </label>
                  <select
                    value={selectedVillage}
                    onChange={(e) => setSelectedVillage(e.target.value)}
                    className="w-full px-2 py-1.5 bg-surface rounded-xl border border-outline-variant/50 text-xs text-on-surface font-semibold outline-none cursor-pointer truncate"
                  >
                    {villages.map((v) => (
                      <option key={v.name} value={v.name}>{v.name} ({v.nameHindi})</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">search</span>
                {loading ? "Searching..." : "Locate on GIS Map"}
              </button>
            </form>

            {/* Quick Parcel Roster */}
            <div className="pt-2 border-t border-outline-variant/20">
              <p className="text-[10px] font-label-md uppercase tracking-wider text-on-surface-variant mb-2 font-bold">
                Quick Cadastral Roster ({selectedVillage})
              </p>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {[
                  { ulpin: "09-0824-0014-1024", khasra: "ख. 412/1", owner: "Rahul Sharma", status: "Verified", color: "text-emerald-600 bg-emerald-50" },
                  { ulpin: "09-0824-0014-1025", khasra: "ख. 412/2", owner: "Sunita Devi", status: "Verified", color: "text-emerald-600 bg-emerald-50" },
                  { ulpin: "09-0824-0014-1026", khasra: "ख. 413", owner: "Rajesh Kumar", status: "Under Mutation", color: "text-amber-600 bg-amber-50" },
                  { ulpin: "09-0824-0014-1027", khasra: "ख. 414", owner: "Manoj Tyagi (Warehouse)", status: "Disputed Overlap", color: "text-rose-600 bg-rose-50" },
                  { ulpin: "09-0824-0014-1028", khasra: "ख. 415/1", owner: "Gram Sabha (Public)", status: "State Land", color: "text-orange-600 bg-orange-50" },
                  { ulpin: "09-0824-0014-1029", khasra: "ख. 415/2", owner: "Dr. Arvind Mishra", status: "Verified", color: "text-blue-600 bg-blue-50" },
                  { ulpin: "09-0824-0014-1030", khasra: "ख. 416", owner: "UP Irrigation Canal", status: "Water Reserve", color: "text-cyan-600 bg-cyan-50" },
                  { ulpin: "09-0824-0014-1031", khasra: "ख. 417", owner: "Amit Choudhary", status: "Verified", color: "text-emerald-600 bg-emerald-50" },
                  { ulpin: "09-0824-0014-1032", khasra: "ख. 418", owner: "Balram Singh (Orchard)", status: "Verified", color: "text-lime-600 bg-lime-50" },
                  { ulpin: "09-0824-0014-1033", khasra: "ख. 419", owner: "Priya Sharma", status: "Under Mutation", color: "text-amber-600 bg-amber-50" },
                  { ulpin: "09-0824-0014-1034", khasra: "ख. 420", owner: "Harish Chand Tyagi", status: "Verified", color: "text-emerald-600 bg-emerald-50" },
                  { ulpin: "09-0824-0014-1035", khasra: "ख. 421/1", owner: "Geeta Rani & Suresh", status: "Verified", color: "text-emerald-600 bg-emerald-50" },
                  { ulpin: "09-0824-0014-1037", khasra: "ख. 422", owner: "Dharamvir Singh", status: "Verified", color: "text-emerald-600 bg-emerald-50" },
                  { ulpin: "09-0824-0014-1039", khasra: "ख. 424", owner: "Mandi Samiti (Mkt)", status: "State Commercial", color: "text-purple-600 bg-purple-50" },
                  { ulpin: "09-0824-0014-1050", khasra: "ख. 434", owner: "Rakesh Sharma", status: "Disputed", color: "text-rose-600 bg-rose-50" }
                ].map((item) => (
                  <div
                    key={item.ulpin}
                    onClick={() => {
                      setSelectedParcelId(item.ulpin);
                      setSidebarOpen(false);
                    }}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedParcelId === item.ulpin
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-outline-variant/30 hover:bg-surface-container-high"
                    }`}
                  >
                    <div>
                      <p className="font-bold text-[11px] text-on-surface">{item.khasra} • {item.ulpin.slice(-4)}</p>
                      <p className="text-[10px] text-on-surface-variant truncate max-w-[130px]">{item.owner}</p>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-[11px] text-primary flex items-center gap-1.5 font-semibold">
            <span className="material-symbols-outlined text-[18px]">360</span>
            <span>Tap any parcel polygon to view 360° Ground Inspection</span>
          </div>
        </div>

        {/* Center & Right: Responsive Leaflet Map */}
        <div className="flex-1 min-h-[500px] h-[calc(100vh-140px)] relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30">
          <ParcelMapViewer
            parcels={parcels}
            selectedParcelId={selectedParcelId}
            onSelectParcel={(p) => setSelectedParcelId(p ? (p.ulpin || p.id) : null)}
          />
        </div>
      </div>
    </main>
  );
}
