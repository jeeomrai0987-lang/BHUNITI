import { useState, useEffect } from "react";
import ParcelMapViewer from "../../components/ParcelMapViewer";
import { api } from "../../services/api";
import { GHAZIABAD_ADMINISTRATIVE_DATA } from "../../data/administrativeDivisions";

export default function DistrictGis() {
  const [selectedTehsil, setSelectedTehsil] = useState("Modinagar");
  const [selectedVillage, setSelectedVillage] = useState("Sikandrabad");
  const [parcels, setParcels] = useState([]);
  const [selectedParcelId, setSelectedParcelId] = useState("09-0824-0014-1024");

  const tehsils = Object.keys(GHAZIABAD_ADMINISTRATIVE_DATA);
  const villages = GHAZIABAD_ADMINISTRATIVE_DATA[selectedTehsil]?.villages || [];

  function handleTehsilChange(tehsilName) {
    setSelectedTehsil(tehsilName);
    const firstVillage = GHAZIABAD_ADMINISTRATIVE_DATA[tehsilName]?.villages[0]?.name || "";
    setSelectedVillage(firstVillage);
  }

  useEffect(() => {
    async function loadGis() {
      try {
        const data = await api.parcels.getGisAll("Ghaziabad", selectedTehsil === "All Tehsils" ? null : selectedTehsil);
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
      }
    }
    loadGis();
  }, [selectedTehsil]);

  return (
    <main className="pt-16 min-h-screen bg-surface flex flex-col">
      <div className="flex flex-col w-full h-[calc(100vh-4rem)] p-4 md:p-6 gap-4 bg-surface relative">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-primary text-on-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                District Command Map
              </span>
              <span className="text-xs text-on-surface-variant font-medium">Ghaziabad GIS Spatial Division</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-on-surface">Cadastral &amp; Parcel Intelligence Center</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-surface px-3 py-2 rounded-xl border border-outline-variant/40 shadow-sm">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">Tehsil:</span>
              <select
                value={selectedTehsil}
                onChange={(e) => handleTehsilChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-on-surface outline-none cursor-pointer"
              >
                {tehsils.map((t) => (
                  <option key={t} value={t}>{t} ({GHAZIABAD_ADMINISTRATIVE_DATA[t].nameHindi})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-surface px-3 py-2 rounded-xl border border-outline-variant/40 shadow-sm">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">Village:</span>
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="bg-transparent text-xs font-bold text-on-surface outline-none cursor-pointer max-w-[130px] truncate"
              >
                {villages.map((v) => (
                  <option key={v.name} value={v.name}>{v.name} ({v.nameHindi})</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className="flex-1 w-full relative rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30">
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
