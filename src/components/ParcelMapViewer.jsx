import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import Virtual360Viewer from "./Virtual360Viewer";

// UP Bhunaksha Thematic Colors
const BHUNAKSHA_PALETTE = {
  "Agricultural (Zamin)": { fill: "#22C55E", stroke: "#15803D", label: "Private Agricultural" },
  "Agricultural (Fasli)": { fill: "#10B981", stroke: "#047857", label: "Cropland (Fasli)" },
  "Commercial / Warehouse": { fill: "#8B5CF6", stroke: "#6D28D9", label: "Commercial / Industrial" },
  "Residential / Abadi": { fill: "#3B82F6", stroke: "#1D4ED8", label: "Residential Abadi" },
  "Pasture / Charnot (Public)": { fill: "#F97316", stroke: "#C2410C", label: "Gram Sabha (Govt)" },
  "Water Body / Canal Nala": { fill: "#06B6D4", stroke: "#0E7490", label: "Waterbody / Canal" },
  "Horticulture / Bagh (Mango Orchard)": { fill: "#84CC16", stroke: "#4D7C0F", label: "Orchard / Bagh" },
  "Disputed": { fill: "#EF4444", stroke: "#B91C1C", label: "Disputed / Overlap" },
  "Under Review": { fill: "#F59E0B", stroke: "#B45309", label: "Under Mutation" }
};

// UP Bhunaksha Khasra Badge Marker
const createBhunakshaKhasraIcon = (khasraNo, isSelected, landType, isDisputed) => {
  const theme = isDisputed
    ? BHUNAKSHA_PALETTE["Disputed"]
    : BHUNAKSHA_PALETTE[landType] || BHUNAKSHA_PALETTE["Agricultural (Zamin)"];

  return L.divIcon({
    className: "custom-bhunaksha-badge",
    html: `
      <div style="
        background: ${isSelected ? "#1E293B" : "rgba(255, 255, 255, 0.95)"};
        color: ${isSelected ? "#F8FAFC" : "#0F172A"};
        padding: 3px 7px;
        border-radius: 8px;
        font-family: 'Inter', -apple-system, sans-serif;
        font-weight: 800;
        font-size: 11px;
        letter-spacing: -0.02em;
        box-shadow: 0 4px 14px rgba(0,0,0,0.3);
        border: 2px solid ${isSelected ? "#38BDF8" : theme.stroke};
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
        transform: ${isSelected ? "scale(1.25)" : "scale(1.0)"};
        transition: transform 0.2s ease, background 0.2s ease;
      ">
        <span style="
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: ${theme.fill};
          display: inline-block;
        "></span>
        <span>ख. ${khasraNo}</span>
      </div>
    `,
    iconSize: [60, 24],
    iconAnchor: [30, 12]
  });
};

// Smooth Camera Controller — Centers smoothly only when user explicitly selects a new parcel
function MapCameraHandler({ targetParcel }) {
  const map = useMap();
  const lastTargetId = useRef(null);

  useEffect(() => {
    if (targetParcel && targetParcel.ulpin && targetParcel.ulpin !== lastTargetId.current) {
      lastTargetId.current = targetParcel.ulpin;
      if (targetParcel.centroid_lat && targetParcel.centroid_lng) {
        const currentZoom = map.getZoom();
        const targetZoom = Math.max(currentZoom, 15);
        map.flyTo([targetParcel.centroid_lat, targetParcel.centroid_lng], targetZoom, {
          duration: 0.8,
          easeLinearity: 0.25
        });
      }
    }
  }, [targetParcel, map]);

  return null;
}

export default function ParcelMapViewer({
  parcels = [],
  selectedParcelId = null,
  onSelectParcel = () => {},
  showControls = true
}) {
  const [baseMap, setBaseMap] = useState("satellite"); // "satellite" | "bhunaksha"
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [is360Open, setIs360Open] = useState(false);
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(true);
  const hasInitialized = useRef(false);

  // 10 Full Contiguous Ghaziabad (Sikandrabad / Modinagar) Cadastral Parcels
  const GHAZIABAD_10_MOCK_PARCELS = [
    {
      id: "p-412-1",
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
      image_url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "p-414",
      ulpin: "09-0824-0014-1027",
      survey_number: "144/1",
      khasra_number: "414",
      khata_number: "92",
      state: "Uttar Pradesh",
      district: "Ghaziabad",
      tehsil: "Modinagar",
      village: "Sikandrabad",
      owner_name: "Manoj Tyagi",
      co_owners: [],
      land_type: "Commercial / Warehouse",
      area_ha: 3.40,
      area_sqm: 34000.0,
      valuation_inr: 18500000.0,
      verification_status: "Disputed",
      is_disputed: true,
      dispute_reason: "Northern boundary overlap of 1.2m with public road reservation buffer",
      encumbrance_status: "Boundary Notice Issued",
      centroid_lat: 28.8372,
      centroid_lng: 77.5825,
      polygon_coords: [
        [28.8360, 77.5810],
        [28.8360, 77.5840],
        [28.8385, 77.5840],
        [28.8385, 77.5810]
      ],
      image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "p-415-1",
      ulpin: "09-0824-0014-1028",
      survey_number: "145/GS",
      khasra_number: "415/1",
      khata_number: "1",
      state: "Uttar Pradesh",
      district: "Ghaziabad",
      tehsil: "Modinagar",
      village: "Sikandrabad",
      owner_name: "Gram Sabha (Government Land)",
      co_owners: ["Revenue Department, UP"],
      land_type: "Pasture / Charnot (Public)",
      area_ha: 5.80,
      area_sqm: 58000.0,
      valuation_inr: 31000000.0,
      verification_status: "Verified (Govt)",
      is_disputed: false,
      encumbrance_status: "Protected State Land",
      centroid_lat: 28.8375,
      centroid_lng: 77.5860,
      polygon_coords: [
        [28.8360, 77.5840],
        [28.8360, 77.5880],
        [28.8390, 77.5880],
        [28.8390, 77.5840]
      ],
      image_url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "p-415-2",
      ulpin: "09-0824-0014-1029",
      survey_number: "146/AB",
      khasra_number: "415/2",
      khata_number: "104",
      state: "Uttar Pradesh",
      district: "Ghaziabad",
      tehsil: "Modinagar",
      village: "Sikandrabad",
      owner_name: "Dr. Arvind Mishra",
      co_owners: ["Pooja Mishra (Co-owner)"],
      land_type: "Residential / Abadi",
      area_ha: 0.85,
      area_sqm: 8500.0,
      valuation_inr: 12750000.0,
      verification_status: "Verified",
      is_disputed: false,
      encumbrance_status: "Clean (Nishkank)",
      centroid_lat: 28.8395,
      centroid_lng: 77.5825,
      polygon_coords: [
        [28.8385, 77.5810],
        [28.8385, 77.5840],
        [28.8405, 77.5840],
        [28.8405, 77.5810]
      ],
      image_url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "p-416",
      ulpin: "09-0824-0014-1030",
      survey_number: "147/W",
      khasra_number: "416",
      khata_number: "2",
      state: "Uttar Pradesh",
      district: "Ghaziabad",
      tehsil: "Modinagar",
      village: "Sikandrabad",
      owner_name: "Irrigation Canal & Water Reserve",
      co_owners: ["UP Irrigation Department"],
      land_type: "Water Body / Canal Nala",
      area_ha: 1.20,
      area_sqm: 12000.0,
      valuation_inr: 6000000.0,
      verification_status: "Verified (Govt)",
      is_disputed: false,
      encumbrance_status: "Protected Water Reserve",
      centroid_lat: 28.8337,
      centroid_lng: 77.5872,
      polygon_coords: [
        [28.8315, 77.5865],
        [28.8315, 77.5880],
        [28.8360, 77.5880],
        [28.8360, 77.5865]
      ],
      image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "p-417",
      ulpin: "09-0824-0014-1031",
      survey_number: "148/1",
      khasra_number: "417",
      khata_number: "118",
      state: "Uttar Pradesh",
      district: "Ghaziabad",
      tehsil: "Modinagar",
      village: "Sikandrabad",
      owner_name: "Amit Choudhary & Brothers",
      co_owners: ["Deepak Choudhary (33%)", "Rohit Choudhary (33%)"],
      land_type: "Agricultural (Fasli)",
      area_ha: 4.10,
      area_sqm: 41000.0,
      valuation_inr: 9840000.0,
      verification_status: "Verified",
      is_disputed: false,
      encumbrance_status: "Clean (Nishkank)",
      centroid_lat: 28.8402,
      centroid_lng: 77.5860,
      polygon_coords: [
        [28.8390, 77.5840],
        [28.8390, 77.5880],
        [28.8415, 77.5880],
        [28.8415, 77.5840]
      ],
      image_url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "p-418",
      ulpin: "09-0824-0014-1032",
      survey_number: "149/B",
      khasra_number: "418",
      khata_number: "125",
      state: "Uttar Pradesh",
      district: "Ghaziabad",
      tehsil: "Modinagar",
      village: "Sikandrabad",
      owner_name: "Balram Singh",
      co_owners: [],
      land_type: "Horticulture / Bagh (Mango Orchard)",
      area_ha: 2.75,
      area_sqm: 27500.0,
      valuation_inr: 7425000.0,
      verification_status: "Verified",
      is_disputed: false,
      encumbrance_status: "Clean (Nishkank)",
      centroid_lat: 28.8415,
      centroid_lng: 77.5825,
      polygon_coords: [
        [28.8405, 77.5810],
        [28.8405, 77.5840],
        [28.8425, 77.5840],
        [28.8425, 77.5810]
      ],
      image_url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "p-419",
      ulpin: "09-0824-0014-1033",
      survey_number: "150/1",
      khasra_number: "419",
      khata_number: "132",
      state: "Uttar Pradesh",
      district: "Ghaziabad",
      tehsil: "Modinagar",
      village: "Sikandrabad",
      owner_name: "Priya Sharma (Transferee)",
      co_owners: [],
      land_type: "Agricultural (Zamin)",
      area_ha: 1.95,
      area_sqm: 19500.0,
      valuation_inr: 4680000.0,
      verification_status: "Action Required (Mutation)",
      is_disputed: false,
      encumbrance_status: "Title Transfer Pending (MUT-2023-8941)",
      centroid_lat: 28.8425,
      centroid_lng: 77.5860,
      polygon_coords: [
        [28.8415, 77.5840],
        [28.8415, 77.5880],
        [28.8435, 77.5880],
        [28.8435, 77.5840]
      ],
      image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const activeParcels = parcels.length >= 10 ? parcels : GHAZIABAD_10_MOCK_PARCELS;

  // Handle selectedParcelId from parent prop cleanly
  useEffect(() => {
    if (selectedParcelId) {
      const found = activeParcels.find(
        (p) => p.id === selectedParcelId || p.ulpin === selectedParcelId || p.khasra_number === selectedParcelId
      );
      if (found) {
        setSelectedParcel(found);
        setIsDrawerExpanded(true);
      }
    } else if (!hasInitialized.current && activeParcels.length > 0) {
      // Open initial parcel on first mount only
      hasInitialized.current = true;
      setSelectedParcel(activeParcels[0]);
    }
  }, [selectedParcelId, activeParcels]);

  const handleParcelClick = (p) => {
    setSelectedParcel(p);
    setIsDrawerExpanded(true);
    onSelectParcel(p);
  };

  // Close drawer handler: Clears both internal state and parent selection
  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation();
    setSelectedParcel(null);
    onSelectParcel(null);
  };

  // Base Map Layer URLs
  const tileLayers = {
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri World Imagery"
    },
    bhunaksha: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: "&copy; UP Bhunaksha Cadastral Overlay &copy; CARTO"
    }
  };

  return (
    <div className="w-full h-full min-h-[500px] flex flex-col relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30 bg-[#0F172A]">
      {/* Top Bhunaksha Header Bar */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-[400] flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl border border-slate-700/60 shadow-2xl text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md shrink-0">
              भू
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xs sm:text-sm text-white truncate">
                  UP Bhunaksha (भू-नक्शा) • Ghaziabad Cadastral Sheet
                </h2>
                <span className="hidden md:inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.2 rounded-full font-bold">
                  Village: Sikandrabad (Modinagar)
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 truncate">
                Showing 10 Active Contiguous Khasra Plots • Tap any plot to view Khatauni details
              </p>
            </div>
          </div>

          {/* Layer Controls */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
            <button
              onClick={() => setBaseMap("satellite")}
              className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-all ${
                baseMap === "satellite" ? "bg-emerald-500 text-slate-950 shadow-md font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              🛰️ Satellite + Cadastral
            </button>
            <button
              onClick={() => setBaseMap("bhunaksha")}
              className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-all ${
                baseMap === "bhunaksha" ? "bg-emerald-500 text-slate-950 shadow-md font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              🗺️ UP Bhunaksha Shajra
            </button>
          </div>
        </div>
      )}

      {/* Main Map Viewport */}
      <div className="w-full flex-1 relative min-h-[480px]">
        <MapContainer
          center={[28.8365, 77.5845]}
          zoom={16}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%", minHeight: "480px", background: "#0F172A" }}
          attributionControl={false}
        >
          <TileLayer url={tileLayers[baseMap].url} attribution={tileLayers[baseMap].attribution} />

          {/* Smooth Camera Locking on Parcel Click */}
          <MapCameraHandler targetParcel={selectedParcel} />

          {/* Render All 10 Contiguous UP Bhunaksha Parcels */}
          {activeParcels.map((p) => {
            const isSelected = selectedParcel?.id === p.id || selectedParcel?.ulpin === p.ulpin;
            const isDisputed = p.is_disputed || p.verification_status === "Disputed";
            const isUnderReview = p.verification_status?.includes("Mutation") || p.verification_status === "Under Verification";

            const theme = isDisputed
              ? BHUNAKSHA_PALETTE["Disputed"]
              : isUnderReview
              ? BHUNAKSHA_PALETTE["Under Review"]
              : BHUNAKSHA_PALETTE[p.land_type] || BHUNAKSHA_PALETTE["Agricultural (Zamin)"];

            const coords = p.polygon_coords || (p.boundary_geojson ? JSON.parse(p.boundary_geojson).coordinates[0].map(c => [c[1], c[0]]) : [
              [p.centroid_lat - 0.001, p.centroid_lng - 0.001],
              [p.centroid_lat - 0.001, p.centroid_lng + 0.001],
              [p.centroid_lat + 0.001, p.centroid_lng + 0.001],
              [p.centroid_lat + 0.001, p.centroid_lng - 0.001]
            ]);

            return (
              <div key={p.id || p.ulpin}>
                {/* Cadastral Polygon with Hover Tooltip */}
                <Polygon
                  positions={coords}
                  pathOptions={{
                    color: isSelected ? "#38BDF8" : theme.stroke,
                    weight: isSelected ? 4 : 2.5,
                    dashArray: isDisputed ? "4, 4" : undefined,
                    fillColor: theme.fill,
                    fillOpacity: isSelected ? 0.65 : 0.42
                  }}
                  eventHandlers={{
                    click: () => handleParcelClick(p)
                  }}
                >
                  <Tooltip direction="top" opacity={0.95} offset={[0, -10]} sticky>
                    <div className="px-2 py-1 font-sans text-xs font-semibold text-slate-900">
                      खसरा सं. {p.khasra_number} • {p.owner_name} ({p.area_ha} ha)
                    </div>
                  </Tooltip>
                </Polygon>

                {/* Centered Khasra Number Badge */}
                {p.centroid_lat && p.centroid_lng && (
                  <Marker
                    position={[p.centroid_lat, p.centroid_lng]}
                    icon={createBhunakshaKhasraIcon(p.khasra_number, isSelected, p.land_type, isDisputed)}
                    eventHandlers={{
                      click: () => handleParcelClick(p)
                    }}
                  />
                )}
              </div>
            );
          })}
        </MapContainer>

        {/* UP Bhunaksha Legend (Bottom Left) */}
        <div className="hidden sm:block absolute bottom-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md px-3.5 py-3 rounded-2xl border border-slate-700/60 shadow-2xl text-xs space-y-1.5 pointer-events-auto text-slate-200">
          <p className="font-bold text-white text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> भू-नक्शा संकेत सूची (Legend)
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#22C55E] border border-emerald-700" />
              <span className="text-[10px]">कृषि भूमि (Agri)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#F97316] border border-orange-700" />
              <span className="text-[10px]">ग्राम सभा / सरकारी</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#8B5CF6] border border-purple-700" />
              <span className="text-[10px]">व्यावसायिक (Commercial)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#3B82F6] border border-blue-700" />
              <span className="text-[10px]">आबादी (Residential)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#84CC16] border border-lime-700" />
              <span className="text-[10px]">बाग / फलोद्यान</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#06B6D4] border border-cyan-700" />
              <span className="text-[10px]">नहर / जल स्रोत</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#F59E0B] border border-amber-700" />
              <span className="text-[10px]">दाखिल खारिज (Mutation)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#EF4444] border border-rose-700" />
              <span className="text-[10px]">सीमा विवाद (Dispute)</span>
            </div>
          </div>
        </div>

        {/* Selected Parcel Land Record Drawer (Right Side) */}
        {selectedParcel && (
          <aside
            aria-label="Land record details"
            className={`
              z-[400] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 shadow-2xl text-slate-200 transition-all duration-300 flex flex-col justify-between
              md:absolute md:top-20 md:right-4 md:bottom-4 md:w-96 md:rounded-3xl md:p-5 md:overflow-y-auto
              absolute inset-x-2 bottom-2 rounded-2xl p-4 max-h-[80vh] overflow-y-auto
            `}
          >
            <div>
              {/* Mobile grab handle */}
              <div className="md:hidden w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-2 cursor-pointer" onClick={() => setIsDrawerExpanded(!isDrawerExpanded)} />

              {/* Header with Working Close Button */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-700/60 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      खसरा सं. {selectedParcel.khasra_number}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">खाता: {selectedParcel.khata_number}</span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white truncate">{selectedParcel.ulpin}</h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsDrawerExpanded(!isDrawerExpanded)}
                    className="md:hidden w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
                    title={isDrawerExpanded ? "Collapse" : "Expand"}
                  >
                    <span className="material-symbols-outlined text-[18px]">{isDrawerExpanded ? "expand_more" : "expand_less"}</span>
                  </button>
                  {/* Close / Cut (X) Button */}
                  <button
                    type="button"
                    onClick={handleCloseDrawer}
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors cursor-pointer shadow-sm"
                    title="Close Details"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>

              {/* Discrepancy Alert */}
              {selectedParcel.is_disputed && (
                <div className="mb-3 p-3 bg-rose-950/80 text-rose-200 rounded-2xl text-xs flex items-start gap-2 border border-rose-600/50">
                  <span className="material-symbols-outlined text-rose-400 text-[18px] shrink-0">report_problem</span>
                  <div>
                    <p className="font-bold text-rose-300">भू-नक्शा विसंगति (Discrepancy)</p>
                    <p className="text-[11px] leading-relaxed">{selectedParcel.dispute_reason}</p>
                  </div>
                </div>
              )}

              {/* Complete UP Khatauni (RoR) Record Table */}
              {isDrawerExpanded && (
                <div className="space-y-2.5 text-xs text-slate-300 animate-fadeIn">
                  <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">पंजीकृत खातेदार (Owner)</p>
                    <p className="font-bold text-sm text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-[18px]">badge</span>
                      {selectedParcel.owner_name}
                    </p>
                    {selectedParcel.co_owners && selectedParcel.co_owners.length > 0 && (
                      <p className="text-[11px] text-slate-400 mt-1 pl-6">
                        सह-खातेदार: {selectedParcel.co_owners.join(", ")}
                      </p>
                    )}
                  </div>

                  {/* Land Metrics: Hectare + Bigha + Biswa */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700/50">
                      <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">क्षेत्रफल (Hectares)</p>
                      <p className="font-bold text-white text-xs">{selectedParcel.area_ha} हेक्टेयर</p>
                    </div>
                    <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700/50">
                      <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">बीघा / बिस्वा (UP Unit)</p>
                      <p className="font-bold text-emerald-400 text-xs">{(selectedParcel.area_ha * 3.95).toFixed(2)} बीघा ({(selectedParcel.area_ha * 79).toFixed(0)} बिस्वा)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700/50">
                      <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">सर्कल रेट मूल्यांकन</p>
                      <p className="font-bold text-white text-xs">₹{selectedParcel.valuation_inr ? (selectedParcel.valuation_inr / 100000).toFixed(1) + " लाख" : "48.0 लाख"}</p>
                    </div>
                    <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700/50">
                      <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">भूमि उपयोग श्रेणी</p>
                      <p className="font-bold text-sky-400 text-xs truncate">{selectedParcel.land_type}</p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700/50">
                    <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">स्थान एवं राजस्व क्षेत्र</p>
                    <p className="font-bold text-white text-[11px] mt-0.5">
                      ग्राम: {selectedParcel.village || "सिकंदराबाद"}, तहसील: {selectedParcel.tehsil || "मोदीनगर"}, जिला: {selectedParcel.district || "गाजियाबाद"}, उत्तर प्रदेश
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700/50 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">भार / बंधक स्थिति (Encumbrance)</p>
                      <p className="font-bold text-emerald-400 text-xs">{selectedParcel.encumbrance_status}</p>
                    </div>
                    <span className="material-symbols-outlined text-emerald-400 text-[20px]">verified</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: 360 View + RoR Khatauni */}
            <div className="pt-3 border-t border-slate-700/60 flex flex-col gap-2 mt-3">
              <button
                type="button"
                onClick={() => setIs360Open(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:rotate-180 transition-transform duration-500">360</span>
                360° भू-निरीक्षण (Ground & Drone 360° View)
              </button>

              <button
                type="button"
                onClick={() => {
                  alert(`डाउनलोड: डिजिटल खतौनी (RoR Form 7/12) खसरा संख्या ${selectedParcel.khasra_number}, गाजियाबाद`);
                }}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                डाउनलोड डिजिटल खतौनी (PDF)
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* 360 Panorama Modal */}
      {is360Open && selectedParcel && (
        <Virtual360Viewer parcel={selectedParcel} onClose={() => setIs360Open(false)} />
      )}
    </div>
  );
}
