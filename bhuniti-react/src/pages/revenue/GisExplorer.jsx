import { useState, useEffect } from "react";
import ParcelMapViewer from "../../components/ParcelMapViewer";
import { api } from "../../services/api";

export default function GisExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("Sikandrabad");
  const [selectedTehsil, setSelectedTehsil] = useState("Modinagar");
  const [parcels, setParcels] = useState([]);
  const [selectedParcelId, setSelectedParcelId] = useState("p-1024-default");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle

  useEffect(() => {
    async function loadGisParcels() {
      try {
        setLoading(true);
        const data = await api.parcels.getAllGis();
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
  }, []);

  async function handleSearch(e) {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      const results = await api.parcels.search(searchQuery);
      if (results && results.length > 0) {
        const p = results[0];
        setSelectedParcelId(p.id || p.ulpin);
        setSidebarOpen(false); // Close sidebar on mobile after search
      }
    } catch (err) {
      console.log("Search error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative pt-16 min-h-screen bg-background flex flex-col">
      {/* Top Header Bar */}
      <div className="px-4 sm:px-8 py-3 flex items-center justify-between bg-surface border-b border-outline-variant/20 text-xs">
        <div className="flex items-center gap-2 text-on-surface-variant font-label-md">
          <a className="hover:text-primary" href="#">Revenue Officer</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-bold">GIS Explorer & 360° Inspection</span>
        </div>

        {/* Mobile Search Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden px-3 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
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
        {/* Left Side Search & Filter Sidebar (Responsive Drawer on Mobile) */}
        <div
          className={`
            w-full lg:w-80 flex-shrink-0 bg-surface-container rounded-2xl sm:rounded-3xl border border-outline-variant/30 p-4 sm:p-5 flex flex-col justify-between shadow-xl
            /* Mobile drawer slide-in */
            ${sidebarOpen ? "fixed inset-x-3 top-28 bottom-3 z-[500] max-h-[85vh] overflow-y-auto block" : "hidden lg:flex"}
          `}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-base sm:text-lg text-on-surface">Spatial Land Search</h2>
                <p className="text-body-sm text-[11px] sm:text-xs text-on-surface-variant">Query cadastral parcels by ULPIN</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSearch} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-label-md text-on-surface-variant uppercase tracking-wider">Universal Land PIN (ULPIN)</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">tag</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. 09-XXXX-XXXX-1024 or P-1024"
                    className="w-full pl-8 pr-3 py-2 bg-surface rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs text-on-surface"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-[9px] font-label-md text-on-surface-variant uppercase tracking-wider">Tehsil</label>
                  <select
                    value={selectedTehsil}
                    onChange={(e) => setSelectedTehsil(e.target.value)}
                    className="w-full px-2 py-1.5 bg-surface rounded-xl border border-outline-variant/50 text-xs text-on-surface"
                  >
                    <option value="Modinagar">Modinagar</option>
                    <option value="Loni">Loni</option>
                    <option value="Ghaziabad Sadar">Ghaziabad Sadar</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-label-md text-on-surface-variant uppercase tracking-wider">Village</label>
                  <select
                    value={selectedVillage}
                    onChange={(e) => setSelectedVillage(e.target.value)}
                    className="w-full px-2 py-1.5 bg-surface rounded-xl border border-outline-variant/50 text-xs text-on-surface"
                  >
                    <option value="Sikandrabad">Sikandrabad</option>
                    <option value="Behta">Behta</option>
                    <option value="Dharampur">Dharampur</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">search</span>
                {loading ? "Searching..." : "Locate on GIS Map"}
              </button>
            </form>

            {/* Quick Parcel List */}
            <div className="pt-2 border-t border-outline-variant/20">
              <p className="text-[10px] font-label-md uppercase tracking-wider text-on-surface-variant mb-2">Quick Parcel Roster</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {[
                  { ulpin: "09-XXXX-XXXX-1024", owner: "Rahul Sharma", status: "Verified", color: "text-emerald-600 bg-emerald-50" },
                  { ulpin: "P-1024", owner: "Rajesh Kumar", status: "Under Review", color: "text-amber-600 bg-amber-50" },
                  { ulpin: "P-2048", owner: "Manoj Tyagi", status: "Disputed", color: "text-rose-600 bg-rose-50" }
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
                      <p className="font-bold text-[11px] text-on-surface">{item.ulpin}</p>
                      <p className="text-[10px] text-on-surface-variant truncate">{item.owner}</p>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-[11px] text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">360</span>
            <span>Tap any parcel polygon to view 360° Ground View</span>
          </div>
        </div>

        {/* Center & Right: Responsive Leaflet Map with Stable Selection */}
        <div className="flex-1 min-h-[500px] h-[calc(100vh-140px)] relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30">
          <ParcelMapViewer
            parcels={parcels}
            selectedParcelId={selectedParcelId}
            onSelectParcel={(p) => setSelectedParcelId(p ? (p.id || p.ulpin) : null)}
          />
        </div>
      </div>
    </main>
  );
}
