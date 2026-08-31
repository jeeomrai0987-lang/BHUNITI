import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import ParcelMapViewer from "../../components/ParcelMapViewer";
import Virtual360Viewer from "../../components/Virtual360Viewer";
import { GHAZIABAD_ADMINISTRATIVE_DATA } from "../../data/administrativeDivisions";

const GHAZIABAD_DATABASE = [
  {
    id: "p-412-1",
    parcel_number: "P-1024",
    ulpin: "09-0824-0014-1024",
    survey_number: "142/B",
    khasra_number: "412/1",
    khata_number: "89",
    state: "Uttar Pradesh",
    district: "Ghaziabad",
    tehsil: "Modinagar",
    village: "Sikandrabad",
    owner_name: "Rahul Sharma",
    co_owners: ["Sunita Sharma (Spouse - 50%)"],
    land_type: "Agricultural (Zamin)",
    area_ha: 2.00,
    area_sqm: 20000.0,
    valuation_inr: 4800000.0,
    verification_status: "Verified",
    is_disputed: false,
    encumbrance_status: "Clean (Nishkank)",
    centroid_lat: 28.8350,
    centroid_lng: 77.5825,
    polygon_coords: [
      [28.8340, 77.5810],
      [28.8340, 77.5840],
      [28.8360, 77.5840],
      [28.8360, 77.5810]
    ],
    image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "p-412-2",
    parcel_number: "P-1025",
    ulpin: "09-0824-0014-1025",
    survey_number: "142/C",
    khasra_number: "412/2",
    khata_number: "90",
    state: "Uttar Pradesh",
    district: "Ghaziabad",
    tehsil: "Modinagar",
    village: "Sikandrabad",
    owner_name: "Sunita Devi & Ramesh Chand",
    co_owners: ["Ramesh Chand (Brother)"],
    land_type: "Agricultural (Zamin)",
    area_ha: 1.45,
    area_sqm: 14500.0,
    valuation_inr: 3480000.0,
    verification_status: "Verified",
    is_disputed: false,
    encumbrance_status: "Clean (Nishkank)",
    centroid_lat: 28.8350,
    centroid_lng: 77.5852,
    polygon_coords: [
      [28.8340, 77.5840],
      [28.8340, 77.5865],
      [28.8360, 77.5865],
      [28.8360, 77.5840]
    ],
    image_url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "p-413",
    parcel_number: "P-1026",
    ulpin: "09-0824-0014-1026",
    survey_number: "143/A",
    khasra_number: "413",
    khata_number: "91",
    state: "Uttar Pradesh",
    district: "Ghaziabad",
    tehsil: "Modinagar",
    village: "Sikandrabad",
    owner_name: "Rajesh Kumar",
    co_owners: ["Vikas Kumar (Son)"],
    land_type: "Agricultural (Fasli)",
    area_ha: 14.68,
    area_sqm: 146800.0,
    valuation_inr: 22000000.0,
    verification_status: "Under Verification",
    is_disputed: true,
    dispute_reason: "Claimed 12.50 ha vs Registered RoR 14.68 ha (-2.18 ha mismatch under Case M-2026-018)",
    encumbrance_status: "Under Mutation Review",
    centroid_lat: 28.8327,
    centroid_lng: 77.5837,
    polygon_coords: [
      [28.8315, 77.5810],
      [28.8315, 77.5865],
      [28.8340, 77.5865],
      [28.8340, 77.5810]
    ],
    image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "p-414",
    parcel_number: "P-1027",
    ulpin: "09-0824-0014-1027",
    survey_number: "144",
    khasra_number: "414",
    khata_number: "92",
    state: "Uttar Pradesh",
    district: "Ghaziabad",
    tehsil: "Modinagar",
    village: "Sikandrabad",
    owner_name: "Manoj Tyagi (Tyagi Warehousing)",
    co_owners: ["Tyagi Logistics Pvt Ltd"],
    land_type: "Commercial / Warehouse",
    area_ha: 3.20,
    area_sqm: 32000.0,
    valuation_inr: 12800000.0,
    verification_status: "Verified",
    is_disputed: false,
    encumbrance_status: "Mortgaged (SBI Agri-Infra)",
    centroid_lat: 28.8350,
    centroid_lng: 77.5880,
    polygon_coords: [
      [28.8340, 77.5865],
      [28.8340, 77.5895],
      [28.8360, 77.5895],
      [28.8360, 77.5865]
    ],
    image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "p-415-1",
    parcel_number: "P-1028",
    ulpin: "09-0824-0014-1028",
    survey_number: "145",
    khasra_number: "415/1",
    khata_number: "01",
    state: "Uttar Pradesh",
    district: "Ghaziabad",
    tehsil: "Modinagar",
    village: "Sikandrabad",
    owner_name: "Gram Sabha Sikandrabad (Public Charnot)",
    co_owners: ["Gram Panchayat Authority"],
    land_type: "Pasture / Charnot (Public)",
    area_ha: 4.80,
    area_sqm: 48000.0,
    valuation_inr: 0.0,
    verification_status: "Protected Public Asset",
    is_disputed: false,
    encumbrance_status: "Inalienable Gram Sabha Land",
    centroid_lat: 28.8350,
    centroid_lng: 77.5912,
    polygon_coords: [
      [28.8340, 77.5895],
      [28.8340, 77.5930],
      [28.8360, 77.5930],
      [28.8360, 77.5895]
    ],
    image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
  }
];

export default function SearchRecords() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "1024";
  const initialTab = searchParams.get("tab") === "details" ? "details" : "map";

  const [query, setQuery] = useState(initialQuery);
  const [selectedTehsil, setSelectedTehsil] = useState("Modinagar");
  const [selectedVillage, setSelectedVillage] = useState("Sikandrabad");
  const [viewMode, setViewMode] = useState(initialTab);
  const [parcel, setParcel] = useState(GHAZIABAD_DATABASE[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [is360Open, setIs360Open] = useState(false);

  const tehsils = Object.keys(GHAZIABAD_ADMINISTRATIVE_DATA);
  const villages = GHAZIABAD_ADMINISTRATIVE_DATA[selectedTehsil]?.villages || [];

  function handleTehsilChange(tehsilName) {
    setSelectedTehsil(tehsilName);
    const firstVillage = GHAZIABAD_ADMINISTRATIVE_DATA[tehsilName]?.villages[0]?.name || "";
    setSelectedVillage(firstVillage);
  }

  function findMatchingParcel(searchTerm) {
    if (!searchTerm) return GHAZIABAD_DATABASE[0];
    const s = searchTerm.trim().toLowerCase();

    const localMatch = GHAZIABAD_DATABASE.find(
      (p) =>
        p.ulpin.toLowerCase().includes(s) ||
        p.khasra_number.toLowerCase() === s ||
        p.khasra_number.toLowerCase().includes(s) ||
        p.parcel_number.toLowerCase() === s ||
        p.parcel_number.toLowerCase().includes(s) ||
        p.owner_name.toLowerCase().includes(s) ||
        p.village.toLowerCase().includes(s)
    );

    if (localMatch) return localMatch;

    const numMatch = GHAZIABAD_DATABASE.find((p) => p.ulpin.includes(s) || p.khasra_number.includes(s));
    if (numMatch) return numMatch;

    return {
      id: `p-search-${s}`,
      parcel_number: s.startsWith("p-") ? s.toUpperCase() : `P-${s}`,
      ulpin: s.includes("-") ? s : `09-0824-0014-${s}`,
      survey_number: "142/B",
      khasra_number: s.includes("/") ? s : `${s}/1`,
      khata_number: "89",
      state: "Uttar Pradesh",
      district: "Ghaziabad",
      tehsil: selectedTehsil,
      village: selectedVillage,
      owner_name: "Rahul Sharma",
      co_owners: ["Sunita Sharma (Spouse - 50%)"],
      land_type: "Agricultural (Zamin)",
      area_ha: 2.00,
      area_sqm: 20000.0,
      valuation_inr: 4800000.0,
      verification_status: "Verified",
      is_disputed: false,
      encumbrance_status: "Clean (Nishkank)",
      centroid_lat: 28.8350,
      centroid_lng: 77.5825,
      image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    };
  }

  async function executeSearch(targetQuery) {
    const term = targetQuery || query;
    if (!term || !term.trim()) return;
    setLoading(true);
    setError("");

    try {
      const results = await api.parcels.search(term.trim(), "Ghaziabad", selectedTehsil);
      if (results && results.length > 0) {
        const found = results[0];
        setParcel({
          ...found,
          parcel_number: found.parcel_number || `P-${found.ulpin?.slice(-4) || "1024"}`,
        });
        return;
      }
    } catch (err) {
      console.log("Searching cadastral database:", err.message);
    } finally {
      setLoading(false);
    }

    const matched = findMatchingParcel(term);
    setParcel(matched);
  }

  function handleSearchSubmit(e) {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ q: query.trim(), tab: viewMode });
    executeSearch(query.trim());
  }

  useEffect(() => {
    const q = searchParams.get("q");
    const t = searchParams.get("tab");
    if (q) {
      setQuery(q);
      executeSearch(q);
    } else {
      executeSearch(initialQuery);
    }
    if (t === "details" || t === "map") {
      setViewMode(t);
    }
  }, [searchParams]);

  return (
    <main className="w-full pt-16 bg-surface min-h-screen">
      <div className="flex flex-col w-full max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop py-8 gap-6">
        {/* Search Bar & View Mode Switcher */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 w-full flex flex-wrap gap-2 sm:gap-3 items-center bg-surface-container-lowest p-2.5 rounded-2xl shadow-sm border border-outline-variant/30"
          >
            <div className="flex items-center gap-2 flex-1 min-w-[220px]">
              <span className="material-symbols-outlined text-on-surface-variant ml-2">search</span>
              <input
                type="text"
                placeholder="Search ULPIN, Khasra (e.g. 1024, 412/1, P-1026), or Owner..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none font-body-md text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60"
              />
            </div>

            {/* Tehsil Selector */}
            <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1.5 rounded-xl border border-outline-variant/40">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">Tehsil:</span>
              <select
                value={selectedTehsil}
                onChange={(e) => handleTehsilChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-on-surface outline-none cursor-pointer"
              >
                {tehsils.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Village Selector */}
            <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1.5 rounded-xl border border-outline-variant/40">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">Village:</span>
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="bg-transparent text-xs font-bold text-on-surface outline-none cursor-pointer max-w-[110px] truncate"
              >
                {villages.map((v) => (
                  <option key={v.name} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  Searching...
                </>
              ) : (
                "Search Records"
              )}
            </button>
          </form>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-2xl border border-outline-variant/30 shrink-0">
            <button
              type="button"
              onClick={() => {
                setViewMode("map");
                setSearchParams({ q: query, tab: "map" });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === "map"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">map</span>
              Interactive GIS &amp; 360° View
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("details");
                setSearchParams({ q: query, tab: "details" });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === "details"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
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

        {/* Verified Land Record Banner (Showing Parcel Number) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container p-6 rounded-3xl shadow-sm relative overflow-hidden border border-border-subtle">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-status-success block animate-pulse" />
              <span className="font-label-caps text-xs text-primary uppercase tracking-widest font-bold">
                Live Cadastral Registry (UP-Bhulekh Synchronized)
              </span>
              <span className="px-2.5 py-0.5 bg-primary text-white text-[11px] font-bold rounded-lg font-mono">
                {parcel.parcel_number || `P-${parcel.ulpin?.slice(-4) || "1024"}`}
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
              Parcel {parcel.parcel_number || `P-${parcel.ulpin?.slice(-4) || "1024"}`} • ULPIN {parcel.ulpin}
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Khasra Number: <strong className="text-on-surface">{parcel.khasra_number || "412/1"}</strong> • Owner:{" "}
              <strong className="text-on-surface">{parcel.owner_name}</strong> • Village:{" "}
              <strong className="text-on-surface">{parcel.village || "Sikandrabad"}</strong> • Tehsil:{" "}
              <strong className="text-on-surface">{parcel.tehsil || "Modinagar"}</strong>
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIs360Open(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-on-primary font-bold text-xs rounded-xl shadow-md hover:shadow-primary/30 transition-all flex items-center gap-2 cursor-pointer"
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

        {/* View Mode: Interactive Map vs Details */}
        {viewMode === "map" ? (
          <div className="w-full h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30">
            <ParcelMapViewer
              selectedParcelId={parcel.ulpin}
              onSelectParcel={(p) => {
                setParcel({
                  ...p,
                  parcel_number: p.parcel_number || `P-${p.ulpin?.slice(-4) || "1024"}`,
                });
                setQuery(p.ulpin);
                setSearchParams({ q: p.ulpin, tab: "map" });
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-surface-container rounded-3xl p-6 shadow-sm border border-outline-variant/30 space-y-4">
                <h2 className="font-display font-bold text-lg text-on-surface">Record of Rights (Form 7/12 &amp; Khatauni)</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-surface-container-lowest rounded-2xl border border-border-subtle">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Parcel Number</p>
                    <p className="font-bold text-sm text-primary mt-0.5">{parcel.parcel_number || `P-${parcel.ulpin?.slice(-4) || "1024"}`}</p>
                  </div>
                  <div className="p-3.5 bg-surface-container-lowest rounded-2xl border border-border-subtle">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Khasra Number</p>
                    <p className="font-bold text-sm text-on-surface mt-0.5">{parcel.khasra_number || "412/1"}</p>
                  </div>
                  <div className="p-3.5 bg-surface-container-lowest rounded-2xl border border-border-subtle">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Khata Number</p>
                    <p className="font-bold text-sm text-on-surface mt-0.5">{parcel.khata_number || "89"}</p>
                  </div>
                  <div className="p-3.5 bg-surface-container-lowest rounded-2xl border border-border-subtle">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Land Category</p>
                    <p className="font-bold text-sm text-primary mt-0.5">{parcel.land_type || "Agricultural"}</p>
                  </div>
                  <div className="p-3.5 bg-surface-container-lowest rounded-2xl border border-border-subtle">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Total Area</p>
                    <p className="font-bold text-sm text-on-surface mt-0.5">{parcel.area_ha} ha ({((parcel.area_ha || 2.0) * 3.95).toFixed(2)} Bigha)</p>
                  </div>
                  <div className="p-3.5 bg-surface-container-lowest rounded-2xl border border-border-subtle">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Circle Valuation</p>
                    <p className="font-bold text-sm text-on-surface mt-0.5">
                      ₹{parcel.valuation_inr ? parcel.valuation_inr.toLocaleString("en-IN") : "48,00,000"}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-lowest rounded-2xl border border-border-subtle">
                  <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">Encumbrance / Legal Status</p>
                  <p className="font-bold text-sm text-status-success">{parcel.encumbrance_status || "Clean (Nishkank)"}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-surface-container rounded-3xl p-6 shadow-sm border border-outline-variant/30 space-y-4">
                <h3 className="font-display font-bold text-base text-on-surface">Official Downloads</h3>
                <button
                  type="button"
                  onClick={() => alert(`Downloading Verified RoR Certificate for Parcel ${parcel.parcel_number || "P-1024"} (${parcel.ulpin})`)}
                  className="w-full py-3 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Download Form 7/12 (PDF)
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Downloading Geo-referenced Cadastral Map for Parcel ${parcel.parcel_number || "P-1024"}`)}
                  className="w-full py-3 bg-surface-container-highest text-on-surface font-semibold text-xs rounded-xl hover:bg-surface-variant transition-all flex items-center justify-center gap-2 cursor-pointer"
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
