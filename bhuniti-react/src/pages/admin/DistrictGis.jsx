/*
 * The district command map: two jurisdiction filters over the whole-district
 * parcel layer.
 *
 * Six defects were fixed while translating it:
 *
 *  1. Every string was hard-coded English.
 *  2. `tehsils.map((t) => ...)` shadowed the translator, and both `(p) =>`
 *     callbacks shadowed the page helper.
 *  3. Both <select>s were named by a neighbouring <span>, which is not a label
 *     at all, so each dropdown announced only its current value.
 *  4. The Hindi name of every tehsil and village had been sitting unused in the
 *     fixtures since the first commit; the option text reads in whichever
 *     language is active now.
 *  5. console.log swallowed the fetch failure. It goes through logFallback, and
 *     the map says when it is showing bundled sample data.
 *  6. "All Tehsils" was compared against a value the dropdown can never hold --
 *     the list comes from the fixture keys -- so the district-wide branch was
 *     dead. The filter is passed straight through now.
 */

import { useState, useEffect } from "react";
import ParcelMapViewer from "../../components/ParcelMapViewer";
import { api } from "../../services/api";
import { GHAZIABAD_ADMINISTRATIVE_DATA } from "../../data/administrativeDivisions";
import { useI18n } from "../../i18n";
import { logFallback } from "../../utils/log";

export default function DistrictGis() {
  const { t, locale } = useI18n();
  const d = (key, vars) => t(`pages.districtGis.${key}`, vars);

  const [selectedTehsil, setSelectedTehsil] = useState("Modinagar");
  const [selectedVillage, setSelectedVillage] = useState("Sikandrabad");
  const [parcels, setParcels] = useState([]);
  const [selectedParcelId, setSelectedParcelId] = useState("09-0824-0014-1024");
  const [offline, setOffline] = useState(false);

  const tehsils = Object.keys(GHAZIABAD_ADMINISTRATIVE_DATA);
  const villages = GHAZIABAD_ADMINISTRATIVE_DATA[selectedTehsil]?.villages || [];

  /*
   * The reading language leads; the other spelling stays in brackets because
   * the district office cross-checks against paper printed either way.
   */
  function placeOption(name, nameHindi) {
    if (!nameHindi) return name;
    return locale === "hi" ? `${nameHindi} (${name})` : `${name} (${nameHindi})`;
  }

  function handleTehsilChange(tehsilName) {
    setSelectedTehsil(tehsilName);
    const firstVillage =
      GHAZIABAD_ADMINISTRATIVE_DATA[tehsilName]?.villages[0]?.name || "";
    setSelectedVillage(firstVillage);
  }

  useEffect(() => {
    async function loadGis() {
      try {
        const data = await api.parcels.getGisAll("Ghaziabad", selectedTehsil);
        if (data && data.length > 0) {
          const formatted = data.map((record) => ({
            ...record,
            polygon_coords: record.boundary_geojson
              ? JSON.parse(record.boundary_geojson).coordinates[0].map((point) => [
                  point[1],
                  point[0],
                ])
              : [
                  [record.centroid_lat - 0.0015, record.centroid_lng - 0.0015],
                  [record.centroid_lat - 0.0015, record.centroid_lng + 0.0015],
                  [record.centroid_lat + 0.0015, record.centroid_lng + 0.0015],
                  [record.centroid_lat + 0.0015, record.centroid_lng - 0.0015],
                ],
          }));
          setParcels(formatted);
          setOffline(false);
        }
      } catch (error) {
        setOffline(true);
        logFallback("district GIS parcels", error);
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
                {d("badge")}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                {d("division")}
              </span>
              {offline && (
                <span className="text-[10px] font-bold text-status-warning bg-status-warning/10 px-2 py-0.5 rounded-full">
                  {t("common.state.offlineShort")}
                </span>
              )}
            </div>
            <h1 className="font-display text-2xl font-bold text-on-surface">
              {d("title")}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-surface px-3 py-2 rounded-xl border border-outline-variant/40 shadow-sm">
              <label
                className="text-[10px] font-bold text-on-surface-variant uppercase"
                htmlFor="district-tehsil"
              >
                {d("tehsil")}
              </label>
              <select
                id="district-tehsil"
                value={selectedTehsil}
                onChange={(event) => handleTehsilChange(event.target.value)}
                className="bg-transparent text-xs font-bold text-on-surface outline-none cursor-pointer"
              >
                {tehsils.map((tehsilName) => (
                  <option key={tehsilName} value={tehsilName}>
                    {placeOption(
                      tehsilName,
                      GHAZIABAD_ADMINISTRATIVE_DATA[tehsilName].nameHindi
                    )}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-surface px-3 py-2 rounded-xl border border-outline-variant/40 shadow-sm">
              <label
                className="text-[10px] font-bold text-on-surface-variant uppercase"
                htmlFor="district-village"
              >
                {d("village")}
              </label>
              <select
                id="district-village"
                value={selectedVillage}
                onChange={(event) => setSelectedVillage(event.target.value)}
                className="bg-transparent text-xs font-bold text-on-surface outline-none cursor-pointer max-w-[130px] truncate"
              >
                {villages.map((village) => (
                  <option key={village.name} value={village.name}>
                    {placeOption(village.name, village.nameHindi)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className="flex-1 w-full relative rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30">
          <ParcelMapViewer
            parcels={parcels}
            selectedParcelId={selectedParcelId}
            onSelectParcel={(parcel) =>
              setSelectedParcelId(parcel ? parcel.ulpin || parcel.id : null)
            }
          />
        </div>
      </div>
    </main>
  );
}
