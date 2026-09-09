/*
 * The revenue officer's GIS explorer: spatial search, a parcel roster and the
 * Leaflet map that opens the 360° inspection.
 *
 * Eight defects were fixed while translating it:
 *
 *  1. Every string was hard-coded English, and two labels hard-coded Hindi as
 *     well ("Tehsil (तहसील)", "Village (गाँव)"), so neither language read
 *     cleanly in either build.
 *  2. `tehsils.map((t) => ...)` shadowed the translator; the callbacks are
 *     named after what they hold now.
 *  3. The six roster rows were <div onClick>: not focusable, not operable from
 *     a keyboard, and announced as plain text. They are buttons with
 *     aria-pressed now.
 *  4. Both <select>s had a <label> with no htmlFor and no id to point at, so
 *     the dropdowns announced themselves as unlabelled.
 *  5. The search field's only name was its placeholder.
 *  6. console.log swallowed both failures; they go through logFallback, and the
 *     header chip now says when the map is showing bundled sample data instead
 *     of claiming "PostGIS cloud active" regardless.
 *  7. Two roster statuses ("Disputed Overlap", "State Land", "Water Reserve")
 *     were not members of any registry vocabulary, so label() could not
 *     translate them; they carry real encumbrance and verification values now.
 *  8. The breadcrumb ancestor was <a href="#">, which reloaded the page; it is
 *     a router link to the revenue overview.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ParcelMapViewer from "../../components/ParcelMapViewer";
import { api } from "../../services/api";
import { GHAZIABAD_ADMINISTRATIVE_DATA } from "../../data/administrativeDivisions";
import { REVENUE_ROUTES } from "../../routes";
import { useI18n } from "../../i18n";
import { logFallback } from "../../utils/log";

/*
 * The demo roster. `status` is the English value the registry stores and
 * `domain` says which vocabulary it belongs to, so label() can translate it.
 * Owner names stay as written: they are names, not vocabulary.
 */
const ROSTER = [
  {
    ulpin: "09-0824-0014-1024",
    khasra: "412/1",
    owner: "Rahul Sharma",
    status: "Verified",
    domain: "verification_status",
    tone: "text-emerald-600 bg-emerald-50",
  },
  {
    ulpin: "09-0824-0014-1025",
    khasra: "412/2",
    owner: "Sunita Devi",
    status: "Verified",
    domain: "verification_status",
    tone: "text-emerald-600 bg-emerald-50",
  },
  {
    ulpin: "09-0824-0014-1026",
    khasra: "413",
    owner: "Rajesh Kumar",
    status: "Under Mutation",
    domain: "encumbrance_status",
    tone: "text-amber-600 bg-amber-50",
  },
  {
    ulpin: "09-0824-0014-1027",
    khasra: "414",
    owner: "Manoj Tyagi (Tyagi Warehousing)",
    status: "Disputed",
    domain: "verification_status",
    tone: "text-rose-600 bg-rose-50",
  },
  {
    ulpin: "09-0824-0014-1028",
    khasra: "415/1",
    owner: "Gram Sabha Sikandrabad",
    status: "Protected State Land",
    domain: "encumbrance_status",
    tone: "text-orange-600 bg-orange-50",
  },
  {
    ulpin: "09-0824-0014-1030",
    khasra: "416",
    owner: "UP Irrigation Canal",
    status: "Protected Water Reserve",
    domain: "encumbrance_status",
    tone: "text-cyan-600 bg-cyan-50",
  },
];

export default function GisExplorer() {
  const { t, label, locale } = useI18n();
  const g = (key, vars) => t(`pages.gisExplorer.${key}`, vars);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTehsil, setSelectedTehsil] = useState("Modinagar");
  const [selectedVillage, setSelectedVillage] = useState("Sikandrabad");
  const [parcels, setParcels] = useState([]);
  const [selectedParcelId, setSelectedParcelId] = useState("09-0824-0014-1024");
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tehsils = Object.keys(GHAZIABAD_ADMINISTRATIVE_DATA);
  const villages = GHAZIABAD_ADMINISTRATIVE_DATA[selectedTehsil]?.villages || [];

  /*
   * The administrative fixtures have carried a Hindi name for every tehsil and
   * village since the first commit; until now nothing read them. The reading
   * language leads, the other spelling stays in brackets because officers
   * cross-check against paper records printed either way.
   */
  function placeOption(name, nameHindi) {
    if (!nameHindi) return name;
    return locale === "hi" ? `${nameHindi} (${name})` : `${name} (${nameHindi})`;
  }

  /** Just the name in the reading language, for use inside a sentence. */
  function placeName(name, nameHindi) {
    return locale === "hi" && nameHindi ? nameHindi : name;
  }

  const villageName = placeName(
    selectedVillage,
    villages.find((village) => village.name === selectedVillage)?.nameHindi
  );

  function handleTehsilChange(tehsilName) {
    setSelectedTehsil(tehsilName);
    const firstVillage =
      GHAZIABAD_ADMINISTRATIVE_DATA[tehsilName]?.villages[0]?.name || "";
    setSelectedVillage(firstVillage);
  }

  useEffect(() => {
    async function loadGisParcels() {
      try {
        setLoading(true);
        const data = await api.parcels.getGisAll(null, selectedTehsil);
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
        // The map falls back to the bundled polygons; say so in the header.
        setOffline(true);
        logFallback("GIS parcels", error);
      } finally {
        setLoading(false);
      }
    }
    loadGisParcels();
  }, [selectedTehsil]);

  async function handleSearch(event) {
    event?.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      const results = await api.parcels.search(searchQuery.trim());
      if (results && results.length > 0) {
        const first = results[0];
        setSelectedParcelId(first.ulpin || first.id);
        setSidebarOpen(false);
        return;
      }
    } catch (error) {
      setOffline(true);
      logFallback("parcel search", error);
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
          <Link className="hover:text-primary" to={REVENUE_ROUTES.overview}>
            {g("header.portal")}
          </Link>
          <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
            chevron_right
          </span>
          <span className="text-on-surface font-bold">{g("header.title")}</span>
        </div>

        {/* Mobile Search Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-expanded={sidebarOpen}
            className="lg:hidden px-3 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
              {sidebarOpen ? "close" : "search"}
            </span>
            {sidebarOpen ? g("header.closeSearch") : g("header.openSearch")}
          </button>

          {/* The chip told everyone the cloud was live even when it was not. */}
          <span
            className={`hidden sm:flex items-center gap-1.5 font-semibold px-2.5 py-1 rounded-full text-[11px] ${
              offline
                ? "text-status-warning bg-status-warning/10"
                : "text-secondary bg-secondary/10"
            }`}
          >
            <span
              aria-hidden="true"
              className={`w-2 h-2 rounded-full ${
                offline ? "bg-status-warning" : "bg-secondary animate-pulse"
              }`}
            />
            {offline ? t("common.state.offlineShort") : g("header.postgis")}
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
                <h2 className="font-display font-bold text-base sm:text-lg text-on-surface">
                  {g("search.heading")}
                </h2>
                <p className="text-body-sm text-[11px] sm:text-xs text-on-surface-variant">
                  {g("search.hint")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label={g("search.close")}
                className="lg:hidden w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                  close
                </span>
              </button>
            </div>

            <form onSubmit={handleSearch} className="space-y-3">
              <div className="space-y-1">
                <label
                  className="block text-[10px] font-label-md text-on-surface-variant uppercase tracking-wider font-bold"
                  htmlFor="gis-query"
                >
                  {g("search.label")}
                </label>
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]"
                  >
                    tag
                  </span>
                  <input
                    id="gis-query"
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={g("search.placeholder")}
                    className="w-full pl-8 pr-3 py-2 bg-surface rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs text-on-surface font-medium"
                  />
                </div>
              </div>

              {/* Tehsil and village selectors */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label
                    className="block text-[9px] font-label-md text-on-surface-variant uppercase tracking-wider font-bold"
                    htmlFor="gis-tehsil"
                  >
                    {t("common.fields.tehsil")}
                  </label>
                  <select
                    id="gis-tehsil"
                    value={selectedTehsil}
                    onChange={(event) => handleTehsilChange(event.target.value)}
                    className="w-full px-2 py-1.5 bg-surface rounded-xl border border-outline-variant/50 text-xs text-on-surface font-semibold outline-none cursor-pointer"
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
                <div className="space-y-1">
                  <label
                    className="block text-[9px] font-label-md text-on-surface-variant uppercase tracking-wider font-bold"
                    htmlFor="gis-village"
                  >
                    {t("common.fields.village")}
                  </label>
                  <select
                    id="gis-village"
                    value={selectedVillage}
                    onChange={(event) => setSelectedVillage(event.target.value)}
                    className="w-full px-2 py-1.5 bg-surface rounded-xl border border-outline-variant/50 text-xs text-on-surface font-semibold outline-none cursor-pointer truncate"
                  >
                    {villages.map((village) => (
                      <option key={village.name} value={village.name}>
                        {placeOption(village.name, village.nameHindi)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md hover:bg-primary/90 disabled:opacity-60 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                  search
                </span>
                {loading ? t("common.state.searching") : g("search.submit")}
              </button>
            </form>

            {/* Quick Parcel Roster */}
            <div className="pt-2 border-t border-outline-variant/20">
              <p className="text-[10px] font-label-md uppercase tracking-wider text-on-surface-variant mb-2 font-bold">
                {g("roster.heading", { village: villageName })}
              </p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {ROSTER.map((item) => {
                  const khasra = g("roster.khasra", { number: item.khasra });
                  const selected = selectedParcelId === item.ulpin;
                  return (
                    <button
                      key={item.ulpin}
                      type="button"
                      aria-pressed={selected}
                      aria-label={g("roster.select", { khasra, owner: item.owner })}
                      onClick={() => {
                        setSelectedParcelId(item.ulpin);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        selected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-outline-variant/30 hover:bg-surface-container-high"
                      }`}
                    >
                      <span className="block">
                        <span className="block font-bold text-[11px] text-on-surface">
                          {khasra} • {item.ulpin.slice(-4)}
                        </span>
                        <span className="block text-[10px] text-on-surface-variant truncate max-w-[130px]">
                          {item.owner}
                        </span>
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${item.tone}`}
                      >
                        {label(item.domain, item.status)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="mt-3 p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-[11px] text-primary flex items-center gap-1.5 font-semibold">
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              360
            </span>
            {g("hint")}
          </p>
        </div>

        {/* Center & Right: Responsive Leaflet Map */}
        <div className="flex-1 min-h-[500px] h-[calc(100vh-140px)] relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30">
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
