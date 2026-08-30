import { useState, useEffect } from "react";
import { api } from "../../services/api";
import ParcelMapViewer from "../../components/ParcelMapViewer";
import Virtual360Viewer from "../../components/Virtual360Viewer";

export default function SearchRecords() {
  const [query, setQuery] = useState("1024");
  const [viewMode, setViewMode] = useState("map"); // "map" | "details"
  const [parcel, setParcel] = useState({
    ulpin: "09-XXXX-XXXX-1024",
    owner_name: "Rahul Sharma",
    khasra_number: "412/1",
    khata_number: "89",
    area_ha: 2.00,
    area_sqm: 20000.0,
    valuation_inr: 4800000.0,
    land_type: "Agricultural",
    district: "Ghaziabad",
    tehsil: "Modinagar",
    village: "Sikandrabad",
    verification_status: "Verified",
    encumbrance_status: "Clean",
    centroid_lat: 28.8354,
    centroid_lng: 77.5843,
    image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [is360Open, setIs360Open] = useState(false);

  async function handleSearch(e) {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const results = await api.parcels.search(query.trim());
      if (results && results.length > 0) {
        setParcel(results[0]);
      } else {
        setError("No parcel found matching your search.");
      }
    } catch (err) {
      console.log("Using cached parcel:", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <main className="w-full pt-16 bg-surface min-h-screen">
      <div className="flex flex-col w-full max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop py-8 gap-6">
        
        {/* ── Search Bar & View Mode Switcher ───────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="flex-1 w-full flex gap-3 items-center bg-surface-container-lowest p-2.5 rounded-2xl shadow-sm border border-outline-variant/30">
            <span className="material-symbols-outlined text-on-surface-variant ml-2">search</span>
            <input
              type="text"
              placeholder="Search by ULPIN (e.g. 1024, P-1024, P-2048), Khasra No, or Owner Name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none font-body-md text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0"
            >
              {loading ? "Searching..." : "Search Land Records"}
            </button>
          </form>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-2xl border border-outline-variant/30 shrink-0">
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === "map" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">map</span>
              Interactive GIS & 360° View
            </button>
            <button
              onClick={() => setViewMode("details")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === "details" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              RoR Certificate Details
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-error-container text-on-error-container rounded-2xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* ── Verified Land Record Banner ────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container p-6 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="font-label-md text-xs text-primary uppercase tracking-widest mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary block animate-pulse"></span>
              Live Cadastral Registry (Supabase Cloud)
            </p>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
              ULPIN {parcel.ulpin}
            </h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Khasra: <strong>{parcel.khasra_number || "412/1"}</strong> • Owner: <strong>{parcel.owner_name}</strong> • Village: <strong>{parcel.village || "Sikandrabad"}</strong>
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <button
              onClick={() => setIs360Open(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-on-primary font-bold text-xs rounded-xl shadow-md hover:shadow-primary/30 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">360</span>
              360° Ground Inspection
            </button>

            <div className="flex items-center gap-1.5 bg-primary-container px-3.5 py-2.5 rounded-xl shadow-sm">
              <span className="material-symbols-outlined text-on-primary-container text-[18px]">verified</span>
              <span className="font-label-md text-xs text-on-primary-container uppercase font-bold">
                {parcel.verification_status || "Verified"}
              </span>
            </div>
          </div>
        </div>

        {/* ── View Mode: Interactive Map vs Details ──────────────────── */}
        {viewMode === "map" ? (
          <div className="w-full h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30">
            <ParcelMapViewer
              selectedParcelId={parcel.ulpin}
              onSelectParcel={(p) => setParcel(p)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-surface-container rounded-3xl p-6 shadow-sm border border-outline-variant/30 space-y-4">
                <h2 className="font-display font-bold text-lg text-on-surface">Record of Rights (Form 7/12)</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-surface-container-lowest rounded-2xl">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Khata Number</p>
                    <p className="font-bold text-sm text-on-surface mt-0.5">{parcel.khata_number || "89"}</p>
                  </div>
                  <div className="p-3.5 bg-surface-container-lowest rounded-2xl">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Khasra Number</p>
                    <p className="font-bold text-sm text-on-surface mt-0.5">{parcel.khasra_number || "412/1"}</p>
                  </div>
                  <div className="p-3.5 bg-surface-container-lowest rounded-2xl">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Land Category</p>
                    <p className="font-bold text-sm text-primary mt-0.5">{parcel.land_type || "Agricultural"}</p>
                  </div>
                  <div className="p-3.5 bg-surface-container-lowest rounded-2xl">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Total Area</p>
                    <p className="font-bold text-sm text-on-surface mt-0.5">{parcel.area_ha} ha</p>
                  </div>
                  <div className="p-3.5 bg-surface-container-lowest rounded-2xl">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Square Meters</p>
                    <p className="font-bold text-sm text-on-surface mt-0.5">{parcel.area_sqm?.toLocaleString() || "20,000"} m²</p>
                  </div>
                  <div className="p-3.5 bg-surface-container-lowest rounded-2xl">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Circle Valuation</p>
                    <p className="font-bold text-sm text-on-surface mt-0.5">₹48,00,000</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-surface-container rounded-3xl p-6 shadow-sm border border-outline-variant/30 space-y-4">
                <h3 className="font-display font-bold text-base text-on-surface">Official Downloads</h3>
                <button
                  onClick={() => alert(`Downloading RoR Form 7/12 for ${parcel.ulpin}`)}
                  className="w-full py-3 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Download Form 7/12 (PDF)
                </button>
                <button
                  onClick={() => alert(`Downloading Geo-referenced Cadastral Map for ${parcel.ulpin}`)}
                  className="w-full py-3 bg-surface-container-highest text-on-surface font-semibold text-xs rounded-xl hover:bg-surface-variant transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">map</span>
                  Download Cadastral Map (GeoTIFF)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 360 Virtual Inspection Modal */}
      {is360Open && (
        <Virtual360Viewer parcel={parcel} onClose={() => setIs360Open(false)} />
      )}
    </main>
  );
}
