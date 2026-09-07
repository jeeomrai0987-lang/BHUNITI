/*
 * The citizen record search: one parcel at a time, shown either on the
 * Bhu-Naksha map or as its record of rights.
 *
 * Defects fixed while translating this file:
 *
 *  1. Every string was hard-coded English.
 *  2. A search that matched nothing invented a whole land record for the term
 *     the citizen typed -- owner, area, valuation and a clean encumbrance. On a
 *     registry that is not a fallback, it is fabricated title. A miss now shows
 *     the empty state.
 *  3. The `error` state was declared, rendered, and never set; an unreachable
 *     registry failed silently. There is an offline notice now, and the caught
 *     error goes through logFallback instead of console.log.
 *  4. Two buttons called `alert()`.
 *  5. The search input had a placeholder and no label, and the tehsil and
 *     village dropdowns had a caption that was not a <label>, so none of the
 *     three had an accessible name.
 *  6. `encumbrance_status: "Mortgaged (SBI Agri-Infra)"` folded the lender into
 *     the status value, which no status vocabulary can translate. The lender is
 *     its own field now.
 *  7. `verification_status: "Protected Public Asset"` on the Gram Sabha plot was
 *     a value from the encumbrance vocabulary in a verification field, so it
 *     could never be translated. It is "Verified (Govt)".
 *  8. The dispute reason was an English sentence in the fixture. The case id is
 *     kept and the sentence is composed, translated, where it is displayed.
 *  9. Area was printed as `{area_ha} ha` and the valuation with a hard-coded
 *     rupee sign and `toLocaleString("en-IN")`, both of which ignore the locale.
 * 10. The administrative data has shipped `nameHindi` for every tehsil and
 *     village since the first commit and nothing read it.
 */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import ParcelMapViewer from "../../components/ParcelMapViewer";
import Virtual360Viewer from "../../components/Virtual360Viewer";
import InterpolatedText from "../../components/InterpolatedText";
import { GHAZIABAD_ADMINISTRATIVE_DATA } from "../../data/administrativeDivisions";
import { logFallback } from "../../utils/log";
import { useI18n } from "../../i18n";

/* The khatauni prints the customary figure beside the metric one. */
const BIGHA_PER_HECTARE = 3.95;
const TOAST_MS = 4200;

/*
 * The encumbrance card used to be green whatever it said, so a mortgage and a
 * court stay both read as good news. Only these statuses leave the title free
 * to transact; everything else is shown as a caution.
 */
const UNENCUMBERED = new Set([
  "Clean",
  "Clean (Nishkank)",
  "Protected State Land",
  "Protected Public Asset",
  "Protected Water Reserve",
  "Inalienable Gram Sabha Land",
]);

/*
 * Five contiguous Sikandrabad plots, used when the registry service is
 * unreachable. Status values are the exact English strings the API sends, so
 * they resolve through the domain vocabularies; owner names are personal names
 * and are never translated.
 */
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
    area_ha: 2.0,
    area_sqm: 20000.0,
    valuation_inr: 4800000.0,
    verification_status: "Verified",
    is_disputed: false,
    encumbrance_status: "Clean (Nishkank)",
    centroid_lat: 28.835,
    centroid_lng: 77.5825,
    polygon_coords: [
      [28.834, 77.581],
      [28.834, 77.584],
      [28.836, 77.584],
      [28.836, 77.581],
    ],
    image_url:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
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
    centroid_lat: 28.835,
    centroid_lng: 77.5852,
    polygon_coords: [
      [28.834, 77.584],
      [28.834, 77.5865],
      [28.836, 77.5865],
      [28.836, 77.584],
    ],
    image_url:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800",
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
    // The sentence used to live here in English. The viewer composes it.
    dispute_case_id: "M-2026-018",
    claimed_area_ha: 12.5,
    encumbrance_status: "Under Mutation Review",
    centroid_lat: 28.8327,
    centroid_lng: 77.5837,
    polygon_coords: [
      [28.8315, 77.581],
      [28.8315, 77.5865],
      [28.834, 77.5865],
      [28.834, 77.581],
    ],
    image_url:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
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
    area_ha: 3.2,
    area_sqm: 32000.0,
    valuation_inr: 12800000.0,
    verification_status: "Verified",
    is_disputed: false,
    encumbrance_status: "Mortgaged",
    encumbrance_lender: "SBI Agri-Infra",
    centroid_lat: 28.835,
    centroid_lng: 77.588,
    polygon_coords: [
      [28.834, 77.5865],
      [28.834, 77.5895],
      [28.836, 77.5895],
      [28.836, 77.5865],
    ],
    image_url:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
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
    area_ha: 4.8,
    area_sqm: 48000.0,
    valuation_inr: 0.0,
    verification_status: "Verified (Govt)",
    is_disputed: false,
    encumbrance_status: "Inalienable Gram Sabha Land",
    centroid_lat: 28.835,
    centroid_lng: 77.5912,
    polygon_coords: [
      [28.834, 77.5895],
      [28.834, 77.593],
      [28.836, 77.593],
      [28.836, 77.5895],
    ],
    image_url:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
  },
];

/** The parcel number the registry gave, or one derived from the ULPIN tail. */
const withParcelNumber = (record) => ({
  ...record,
  parcel_number: record.parcel_number || `P-${record.ulpin?.slice(-4) || ""}`,
});

export default function SearchRecords() {
  const { t, label, locale, formatArea, formatCurrency } = useI18n();
  const p = (key, vars) => t(`pages.searchRecords.${key}`, vars);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "1024";
  const initialTab = searchParams.get("tab") === "details" ? "details" : "map";

  const [query, setQuery] = useState(initialQuery);
  const [selectedTehsil, setSelectedTehsil] = useState("Modinagar");
  const [selectedVillage, setSelectedVillage] = useState("Sikandrabad");
  const [viewMode, setViewMode] = useState(initialTab);
  const [parcel, setParcel] = useState(GHAZIABAD_DATABASE[0]);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  const [is360Open, setIs360Open] = useState(false);
  const [toast, setToast] = useState(null);

  const tehsils = Object.keys(GHAZIABAD_ADMINISTRATIVE_DATA);
  const villages = GHAZIABAD_ADMINISTRATIVE_DATA[selectedTehsil]?.villages || [];

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  /*
   * The administrative fixture carries a Devanagari name for every tehsil and
   * village. Records that come from the API bring their own localised names
   * through ref_translations, so this only covers the bundled hierarchy.
   */
  const localTehsil = (name) => {
    const entry = GHAZIABAD_ADMINISTRATIVE_DATA[name];
    return locale === "hi" && entry?.nameHindi ? entry.nameHindi : name;
  };

  const localVillage = (name) => {
    if (locale !== "hi") return name;
    for (const tehsil of Object.values(GHAZIABAD_ADMINISTRATIVE_DATA)) {
      const match = tehsil.villages.find((village) => village.name === name);
      if (match?.nameHindi) return match.nameHindi;
    }
    return name;
  };

  function handleTehsilChange(tehsilName) {
    setSelectedTehsil(tehsilName);
    setSelectedVillage(
      GHAZIABAD_ADMINISTRATIVE_DATA[tehsilName]?.villages[0]?.name || ""
    );
  }

  /** The bundled plot that matches, or null. Never a fabricated record. */
  function findMatchingParcel(searchTerm) {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return GHAZIABAD_DATABASE[0];

    return (
      GHAZIABAD_DATABASE.find(
        (record) =>
          record.ulpin.toLowerCase().includes(term) ||
          record.khasra_number.toLowerCase().includes(term) ||
          record.parcel_number.toLowerCase().includes(term) ||
          record.owner_name.toLowerCase().includes(term) ||
          record.village.toLowerCase().includes(term)
      ) || null
    );
  }

  async function executeSearch(targetQuery) {
    const term = (targetQuery || query).trim();
    if (!term) return;
    setLoading(true);

    try {
      const results = await api.parcels.search(term, "Ghaziabad", selectedTehsil);
      setOffline(false);
      // An empty array is the registry saying it holds no such parcel, which is
      // a result in its own right rather than a reason to fall back.
      setParcel(results && results.length > 0 ? withParcelNumber(results[0]) : null);
      return;
    } catch (error) {
      logFallback("parcel search", error);
      setOffline(true);
    } finally {
      setLoading(false);
    }

    setParcel(findMatchingParcel(term));
  }

  function handleSearchSubmit(event) {
    if (event) event.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ q: query.trim(), tab: viewMode });
    executeSearch(query.trim());
  }

  function switchView(nextView) {
    setViewMode(nextView);
    setSearchParams({ q: query, tab: nextView });
  }

  useEffect(() => {
    const nextQuery = searchParams.get("q");
    const nextTab = searchParams.get("tab");
    if (nextQuery) {
      setQuery(nextQuery);
      executeSearch(nextQuery);
    } else {
      executeSearch(initialQuery);
    }
    if (nextTab === "details" || nextTab === "map") setViewMode(nextTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const parcelNumber = parcel
    ? parcel.parcel_number || `P-${parcel.ulpin?.slice(-4) || ""}`
    : "";

  /** Metric area with the customary bigha figure after it. */
  const areaText = (hectares) =>
    p("record.areaWithBigha", {
      metric: formatArea(hectares),
      customary: formatArea(hectares * BIGHA_PER_HECTARE, "common.units.bigha"),
    });

  return (
    <main className="w-full pt-16 bg-surface min-h-screen">
      <div className="flex flex-col w-full max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop py-8 gap-6">
        {/* Query, jurisdiction, and the map/certificate switch */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 w-full flex flex-wrap gap-2 sm:gap-3 items-center bg-surface-container-lowest p-2.5 rounded-2xl shadow-sm border border-outline-variant/30"
          >
            <div className="flex items-center gap-2 flex-1 min-w-[220px]">
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-on-surface-variant ml-2"
              >
                search
              </span>
              <label htmlFor="record-query" className="sr-only">
                {p("search.label")}
              </label>
              <input
                id="record-query"
                type="text"
                placeholder={p("search.placeholder")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent border-none outline-none font-body-md text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60"
              />
            </div>

            <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1.5 rounded-xl border border-outline-variant/40">
              <label
                htmlFor="record-tehsil"
                className="text-[10px] font-bold text-on-surface-variant uppercase"
              >
                {p("search.tehsil")}
              </label>
              <select
                id="record-tehsil"
                value={selectedTehsil}
                onChange={(event) => handleTehsilChange(event.target.value)}
                className="bg-transparent text-xs font-bold text-on-surface outline-none cursor-pointer"
              >
                {tehsils.map((name) => (
                  <option key={name} value={name}>
                    {localTehsil(name)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1.5 rounded-xl border border-outline-variant/40">
              <label
                htmlFor="record-village"
                className="text-[10px] font-bold text-on-surface-variant uppercase"
              >
                {p("search.village")}
              </label>
              <select
                id="record-village"
                value={selectedVillage}
                onChange={(event) => setSelectedVillage(event.target.value)}
                className="bg-transparent text-xs font-bold text-on-surface outline-none cursor-pointer max-w-[110px] truncate"
              >
                {villages.map((village) => (
                  <option key={village.name} value={village.name}>
                    {localVillage(village.name)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-60"
            >
              {loading && (
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-[16px] animate-spin"
                >
                  progress_activity
                </span>
              )}
              {loading ? t("common.state.searching") : p("search.submit")}
            </button>
          </form>

          <div
            role="group"
            aria-label={p("view.label")}
            className="flex items-center gap-1 bg-surface-container p-1 rounded-2xl border border-outline-variant/30 shrink-0"
          >
            <button
              type="button"
              onClick={() => switchView("map")}
              aria-pressed={viewMode === "map"}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === "map"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                map
              </span>
              {p("view.map")}
            </button>
            <button
              type="button"
              onClick={() => switchView("details")}
              aria-pressed={viewMode === "details"}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === "details"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                description
              </span>
              {p("view.details")}
            </button>
          </div>
        </div>

        {offline && (
          <p className="flex items-center gap-2 p-4 bg-surface-container-high text-on-surface-variant rounded-2xl text-xs font-semibold">
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              cloud_off
            </span>
            {t("common.state.offline")}
          </p>
        )}

        {!parcel && !loading && (
          <div className="flex flex-col items-center gap-2 bg-surface-container p-10 rounded-3xl border border-outline-variant/30 text-center">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-[40px] text-on-surface-variant"
            >
              search_off
            </span>
            <h1 className="font-display text-lg font-bold text-on-surface">
              {t("common.state.noResults")}
            </h1>
            <p className="text-xs text-on-surface-variant">
              {t("common.state.noResultsHint")}
            </p>
          </div>
        )}

        {parcel && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container p-6 rounded-3xl shadow-sm relative overflow-hidden border border-border-subtle">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  aria-hidden="true"
                  className="w-2 h-2 rounded-full bg-status-success block animate-pulse"
                />
                <span className="font-label-caps text-xs text-primary uppercase tracking-widest font-bold">
                  {p("banner.registry")}
                </span>
                <span className="px-2.5 py-0.5 bg-primary text-white text-[11px] font-bold rounded-lg font-mono">
                  {parcelNumber}
                </span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
                {p("banner.heading", { parcel: parcelNumber, ulpin: parcel.ulpin })}
              </h1>
              <p className="text-xs text-on-surface-variant mt-1">
                <InterpolatedText
                  template={p("banner.summary")}
                  values={{
                    khasra: {
                      text: parcel.khasra_number,
                      className: "text-on-surface font-bold",
                    },
                    owner: { text: parcel.owner_name, className: "text-on-surface font-bold" },
                    village: {
                      text: localVillage(parcel.village),
                      className: "text-on-surface font-bold",
                    },
                    tehsil: {
                      text: localTehsil(parcel.tehsil),
                      className: "text-on-surface font-bold",
                    },
                  }}
                />
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIs360Open(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-on-primary font-bold text-xs rounded-xl shadow-md hover:shadow-primary/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                  360
                </span>
                {p("banner.open360")}
              </button>

              <p className="flex items-center gap-1.5 bg-primary-container px-3.5 py-2.5 rounded-xl shadow-sm">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-on-primary-container text-[18px]"
                >
                  verified
                </span>
                <span className="font-label-md text-xs text-on-primary-container uppercase font-bold">
                  {label("verification_status", parcel.verification_status)}
                </span>
              </p>
            </div>
          </div>
        )}

        {parcel && viewMode === "map" && (
          <div className="w-full h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30">
            <ParcelMapViewer
              selectedParcelId={parcel.ulpin}
              onSelectParcel={(selected) => {
                setParcel(withParcelNumber(selected));
                setQuery(selected.ulpin);
                setSearchParams({ q: selected.ulpin, tab: "map" });
              }}
            />
          </div>
        )}

        {parcel && viewMode === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-surface-container rounded-3xl p-6 shadow-sm border border-outline-variant/30 space-y-4">
                <h2 className="font-display font-bold text-lg text-on-surface">
                  {p("record.heading")}
                </h2>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { key: "parcelNumber", value: parcelNumber, tone: "text-primary" },
                    { key: "khasraNumber", value: parcel.khasra_number },
                    { key: "khataNumber", value: parcel.khata_number },
                    {
                      key: "landCategory",
                      value: label("land_type", parcel.land_type),
                      tone: "text-primary",
                    },
                    { key: "totalArea", value: areaText(parcel.area_ha) },
                    { key: "valuation", value: formatCurrency(parcel.valuation_inr) },
                  ].map((field) => (
                    <div
                      key={field.key}
                      className="p-3.5 bg-surface-container-lowest rounded-2xl border border-border-subtle"
                    >
                      <dt className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                        {p(`record.${field.key}`)}
                      </dt>
                      <dd
                        className={`font-bold text-sm mt-0.5 ${
                          field.tone || "text-on-surface"
                        }`}
                      >
                        {field.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="p-4 bg-surface-container-lowest rounded-2xl border border-border-subtle">
                  <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">
                    {p("record.encumbrance")}
                  </p>
                  <p
                    className={`font-bold text-sm ${
                      UNENCUMBERED.has(parcel.encumbrance_status)
                        ? "text-status-success"
                        : "text-status-warning"
                    }`}
                  >
                    {label("encumbrance_status", parcel.encumbrance_status)}
                  </p>
                  {parcel.encumbrance_lender && (
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {p("record.encumbranceLender", { name: parcel.encumbrance_lender })}
                    </p>
                  )}
                  {parcel.encumbrance_case && (
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {p("record.encumbranceCase", { number: parcel.encumbrance_case })}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-surface-container rounded-3xl p-6 shadow-sm border border-outline-variant/30 space-y-4">
                <h3 className="font-display font-bold text-base text-on-surface">
                  {p("downloads.heading")}
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setToast({
                      text: p("downloads.rorQueued", {
                        parcel: parcelNumber,
                        ulpin: parcel.ulpin,
                      }),
                      at: Date.now(),
                    })
                  }
                  className="w-full py-3 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                    download
                  </span>
                  {p("downloads.ror")}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setToast({
                      text: p("downloads.mapQueued", { parcel: parcelNumber }),
                      at: Date.now(),
                    })
                  }
                  className="w-full py-3 bg-surface-container-highest text-on-surface font-semibold text-xs rounded-xl hover:bg-surface-variant transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                    map
                  </span>
                  {p("downloads.map")}
                </button>
                {toast && (
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {toast.text}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {is360Open && parcel && (
        <Virtual360Viewer parcel={parcel} onClose={() => setIs360Open(false)} />
      )}

      <div role="status" aria-live="polite" className="sr-only">
        {toast?.text || ""}
      </div>
    </main>
  );
}
