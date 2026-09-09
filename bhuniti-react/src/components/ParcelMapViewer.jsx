/*
 * The UP Bhu-Naksha cadastral map, rendered by admin/DistrictGis,
 * citizen/SearchRecords, revenue/GisExplorer and revenue/Overview.
 *
 * Six things were wrong here beyond the copy:
 *
 *   1. every label was hard-coded Devanagari with a parenthesised English
 *      gloss, so the English build showed Hindi chrome. It now reads
 *      viewers.parcelMap.* out of the catalog, including the khasra prefix
 *      baked into the Leaflet divIcon HTML;
 *   2. the fixture list lived inside the component, so it was a new array on
 *      every render and `activeParcels` was a new dependency each time. With a
 *      `selectedParcelId` set, the selection effect then wrote a brand-new
 *      object into state on every render -- an unbounded re-render loop. It is
 *      module scope now and the derived list is memoised;
 *   3. `parcels.length >= 10 ? parcels : FIXTURE` threw away a caller's real
 *      parcels whenever fewer than ten arrived. DistrictGis and GisExplorer
 *      both pass whatever the API returned, so a five-parcel search silently
 *      showed the demo village instead. The test is now `length > 0`;
 *   4. `<div key={...}>` wrapped each Polygon/Marker pair. MapContainer's
 *      children are Leaflet layers, so that injected a stray DOM div into the
 *      map container on every parcel. Fragment now;
 *   5. area, bigha, biswa and valuation were formatted by hand with
 *      `.toFixed()` and a literal unit, bypassing the locale formatters, and
 *      the valuation fell back to an invented "48.0 लाख" when the record had no
 *      figure. Missing figures render as an em dash;
 *   6. the encumbrance card always printed emerald text with a `verified` tick,
 *      whatever the value -- a mortgaged or disputed plot looked clear. The
 *      tone is derived from the value now, and `land_type` /
 *      `encumbrance_status` go through label() instead of printing raw.
 *
 * Smaller ones: `title=` was standing in for an accessible name on the close
 * and collapse buttons, the mobile grab handle was a `<div onClick>`, the layer
 * buttons had no `type` and no pressed state, and the khatauni download called
 * `alert()`. The palette also carried nine English `label` strings that nothing
 * ever read.
 *
 * BHUNAKSHA_PALETTE is keyed on the exact English `land_type` values the API
 * sends -- those keys are data, not copy, and must not be translated.
 */

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import Virtual360Viewer from "./Virtual360Viewer";
import { useI18n } from "../i18n";

/** 1 hectare = 3.95 bigha = 79 biswa in the Uttar Pradesh revenue record. */
const BIGHA_PER_HECTARE = 3.95;
const BISWA_PER_HECTARE = 79;
const RUPEES_PER_LAKH = 100000;
const TOAST_MS = 4200;

/*
 * Thematic fill for each land-use class, keyed on the English land_type the
 * record carries. "Disputed" and "Under Review" are not land types; they are
 * overrides applied ahead of the type when the parcel is flagged.
 */
const BHUNAKSHA_PALETTE = {
  "Agricultural (Zamin)": { fill: "#22C55E", stroke: "#15803D" },
  "Agricultural (Fasli)": { fill: "#10B981", stroke: "#047857" },
  "Commercial / Warehouse": { fill: "#8B5CF6", stroke: "#6D28D9" },
  "Residential / Abadi": { fill: "#3B82F6", stroke: "#1D4ED8" },
  "Pasture / Charnot (Public)": { fill: "#F97316", stroke: "#C2410C" },
  "Water Body / Canal Nala": { fill: "#06B6D4", stroke: "#0E7490" },
  "Horticulture / Bagh (Mango Orchard)": { fill: "#84CC16", stroke: "#4D7C0F" },
  Disputed: { fill: "#EF4444", stroke: "#B91C1C" },
  "Under Review": { fill: "#F59E0B", stroke: "#B45309" },
};

/** The eight swatches the legend prints, in reading order. */
const LEGEND = [
  { key: "agriculture", fill: "#22C55E", border: "border-emerald-700" },
  { key: "government", fill: "#F97316", border: "border-orange-700" },
  { key: "commercial", fill: "#8B5CF6", border: "border-purple-700" },
  { key: "residential", fill: "#3B82F6", border: "border-blue-700" },
  { key: "orchard", fill: "#84CC16", border: "border-lime-700" },
  { key: "water", fill: "#06B6D4", border: "border-cyan-700" },
  { key: "mutation", fill: "#F59E0B", border: "border-amber-700" },
  { key: "dispute", fill: "#EF4444", border: "border-rose-700" },
];

/*
 * How each encumbrance value reads on the card. Keyed on the English value
 * because that is what the record stores; the visible text comes from
 * label("encumbrance_status", ...).
 */
const ENCUMBRANCE_TONE = {
  Clean: { text: "text-emerald-400", icon: "verified" },
  "Clean (Nishkank)": { text: "text-emerald-400", icon: "verified" },
  "Protected State Land": { text: "text-sky-400", icon: "account_balance" },
  "Protected Public Asset": { text: "text-sky-400", icon: "account_balance" },
  "Inalienable Gram Sabha Land": { text: "text-sky-400", icon: "account_balance" },
  "Protected Water Reserve": { text: "text-sky-400", icon: "water_drop" },
  "Under Mutation": { text: "text-amber-400", icon: "hourglass_top" },
  "Under Mutation Review": { text: "text-amber-400", icon: "hourglass_top" },
  "Title Transfer Pending": { text: "text-amber-400", icon: "pending_actions" },
  Leased: { text: "text-amber-400", icon: "assignment" },
  Mortgaged: { text: "text-rose-400", icon: "account_balance_wallet" },
  "Boundary Notice Issued": { text: "text-rose-400", icon: "gavel" },
  "Court Stay": { text: "text-rose-400", icon: "gavel" },
};
const UNKNOWN_ENCUMBRANCE = { text: "text-slate-300", icon: "help" };
const toneFor = (value) => ENCUMBRANCE_TONE[value] || UNKNOWN_ENCUMBRANCE;

/*
 * Place names for a real record arrive already localised from the API's
 * ref_translations table. The demo village is the exception, so its four fixed
 * names are mapped onto the catalog instead of being spelt out in Devanagari in
 * the markup, which is what the original did.
 */
const DEMO_PLACES = {
  "Uttar Pradesh": "common.place.state",
  Ghaziabad: "common.place.district",
  Modinagar: "common.place.tehsil",
  Sikandrabad: "common.place.village",
};

/*
 * The badge pinned to each plot centroid is Leaflet divIcon HTML, i.e. a raw
 * string outside React's tree, so the khasra label has to be translated by the
 * caller and escaped here rather than trusted.
 */
const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const createBhunakshaKhasraIcon = ({ text, ariaLabel, isSelected, landType, isDisputed }) => {
  const theme = isDisputed
    ? BHUNAKSHA_PALETTE.Disputed
    : BHUNAKSHA_PALETTE[landType] || BHUNAKSHA_PALETTE["Agricultural (Zamin)"];

  return L.divIcon({
    className: "custom-bhunaksha-badge",
    html: `
      <div role="img" aria-label="${escapeHtml(ariaLabel)}" style="
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
        <span>${escapeHtml(text)}</span>
      </div>
    `,
    iconSize: [60, 24],
    iconAnchor: [30, 12],
  });
};

/** Base map choices. Both are remote raster services and stay as URLs. */
const TILE_LAYERS = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri World Imagery",
  },
  bhunaksha: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; UP Bhunaksha Cadastral Overlay &copy; CARTO",
  },
};

/*
 * Centres the camera only when the user picks a different parcel, so panning by
 * hand is not fought by the effect.
 */
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
          easeLinearity: 0.25,
        });
      }
    }
  }, [targetParcel, map]);

  return null;
}

/*
 * Ten contiguous Sikandrabad (Modinagar) plots, used when the caller has no
 * parcels of its own. Status and land-type values are the exact English strings
 * the API sends so that label() resolves them; the two dispute notes are keyed
 * rather than written out because they are prose, and the mutation case number
 * is a field of its own rather than being buried inside the status.
 */
const FALLBACK_PARCELS = [
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
    // The mismatch that M-2026-018 is about, as figures rather than a sentence.
    disputeKey: "areaMismatch",
    claimed_area_ha: 12.5,
    case_number: "M-2026-018",
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
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800",
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
    area_ha: 3.4,
    area_sqm: 34000.0,
    valuation_inr: 18500000.0,
    verification_status: "Disputed",
    is_disputed: true,
    disputeKey: "roadOverlap",
    overlap_m: 1.2,
    encumbrance_status: "Boundary Notice Issued",
    centroid_lat: 28.8372,
    centroid_lng: 77.5825,
    polygon_coords: [
      [28.836, 77.581],
      [28.836, 77.584],
      [28.8385, 77.584],
      [28.8385, 77.581],
    ],
    image_url:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
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
    area_ha: 5.8,
    area_sqm: 58000.0,
    valuation_inr: 31000000.0,
    verification_status: "Verified (Govt)",
    is_disputed: false,
    encumbrance_status: "Protected State Land",
    centroid_lat: 28.8375,
    centroid_lng: 77.586,
    polygon_coords: [
      [28.836, 77.584],
      [28.836, 77.588],
      [28.839, 77.588],
      [28.839, 77.584],
    ],
    image_url:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800",
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
      [28.8385, 77.581],
      [28.8385, 77.584],
      [28.8405, 77.584],
      [28.8405, 77.581],
    ],
    image_url:
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800",
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
    area_ha: 1.2,
    area_sqm: 12000.0,
    valuation_inr: 6000000.0,
    verification_status: "Verified (Govt)",
    is_disputed: false,
    encumbrance_status: "Protected Water Reserve",
    centroid_lat: 28.8337,
    centroid_lng: 77.5872,
    polygon_coords: [
      [28.8315, 77.5865],
      [28.8315, 77.588],
      [28.836, 77.588],
      [28.836, 77.5865],
    ],
    image_url:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
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
    area_ha: 4.1,
    area_sqm: 41000.0,
    valuation_inr: 9840000.0,
    verification_status: "Verified",
    is_disputed: false,
    encumbrance_status: "Clean (Nishkank)",
    centroid_lat: 28.8402,
    centroid_lng: 77.586,
    polygon_coords: [
      [28.839, 77.584],
      [28.839, 77.588],
      [28.8415, 77.588],
      [28.8415, 77.584],
    ],
    image_url:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800",
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
      [28.8405, 77.581],
      [28.8405, 77.584],
      [28.8425, 77.584],
      [28.8425, 77.581],
    ],
    image_url:
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800",
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
    // The status is the catalog value; the case it refers to is its own field,
    // so label() can resolve the status in either language.
    encumbrance_status: "Title Transfer Pending",
    encumbrance_case: "MUT-2023-8941",
    centroid_lat: 28.8425,
    centroid_lng: 77.586,
    polygon_coords: [
      [28.8415, 77.584],
      [28.8415, 77.588],
      [28.8435, 77.588],
      [28.8435, 77.584],
    ],
    image_url:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
  },
];

export default function ParcelMapViewer({
  parcels = [],
  selectedParcelId = null,
  onSelectParcel = () => {},
  showControls = true,
}) {
  const { t, label, formatArea, formatNumber, formatCurrency } = useI18n();
  const v = (key, vars) => t(`viewers.parcelMap.${key}`, vars);

  const [baseMap, setBaseMap] = useState("satellite");
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [is360Open, setIs360Open] = useState(false);
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(true);
  const [toast, setToast] = useState(null);
  const hasInitialized = useRef(false);

  // A caller with any parcels of its own wins; the fixture is only for the
  // pages that render the demo village.
  const activeParcels = useMemo(
    () => (parcels.length > 0 ? parcels : FALLBACK_PARCELS),
    [parcels]
  );

  useEffect(() => {
    if (selectedParcelId) {
      const found = activeParcels.find(
        (p) =>
          p.id === selectedParcelId ||
          p.ulpin === selectedParcelId ||
          p.khasra_number === selectedParcelId
      );
      if (found) {
        setSelectedParcel(found);
        setIsDrawerExpanded(true);
      }
    } else if (!hasInitialized.current && activeParcels.length > 0) {
      // Open the first parcel on first mount only.
      hasInitialized.current = true;
      setSelectedParcel(activeParcels[0]);
    }
  }, [selectedParcelId, activeParcels]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleParcelClick = (parcel) => {
    setSelectedParcel(parcel);
    setIsDrawerExpanded(true);
    onSelectParcel(parcel);
  };

  // Clears the internal selection and the parent's.
  const handleCloseDrawer = (event) => {
    if (event) event.stopPropagation();
    setSelectedParcel(null);
    onSelectParcel(null);
  };

  /** A jurisdiction name, localised through the catalog where it is a demo one. */
  const placeName = (value, fallbackKey) => {
    if (!value) return t(fallbackKey);
    const key = DEMO_PLACES[value];
    return key ? t(key) : value;
  };

  /** "7.9 bigha (158 biswa)", or an em dash when the record has no area. */
  const customaryArea = (hectares) => {
    if (hectares === null || hectares === undefined || hectares === "") {
      return formatNumber(null);
    }
    return v("drawer.areaBighaBiswa", {
      bigha: formatArea(hectares * BIGHA_PER_HECTARE, "common.units.bigha"),
      biswa: formatArea(Math.round(hectares * BISWA_PER_HECTARE), "common.units.biswa"),
    });
  };

  /** The circle-rate figure in lakh, or an em dash. Nothing is invented. */
  const valuationInLakh = (rupees) => {
    if (rupees === null || rupees === undefined || rupees === "") {
      return formatNumber(null);
    }
    return v("drawer.valuationLakh", {
      value: formatCurrency(rupees / RUPEES_PER_LAKH, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    });
  };

  /*
   * A record from the API brings its own note; the two flagged fixtures carry
   * figures and a key so the sentence can be written in either language.
   */
  const disputeNote = (parcel) => {
    if (!parcel) return null;
    if (parcel.dispute_reason) return parcel.dispute_reason;
    if (parcel.disputeKey === "areaMismatch") {
      return v("fixture.areaMismatch", {
        claimed: formatArea(parcel.claimed_area_ha),
        recorded: formatArea(parcel.area_ha),
        difference: formatArea(Math.abs(parcel.area_ha - parcel.claimed_area_ha)),
        case: parcel.case_number,
      });
    }
    if (parcel.disputeKey === "roadOverlap") {
      return v("fixture.roadOverlap", {
        distance: formatArea(parcel.overlap_m, "common.units.metre"),
      });
    }
    return null;
  };

  const handleDownloadRor = () => {
    setToast({
      text: v("actions.downloadQueued", {
        khasra: selectedParcel.khasra_number,
        district: placeName(selectedParcel.district, "common.place.district"),
      }),
      at: Date.now(),
    });
  };

  return (
    <div className="w-full h-full min-h-[500px] flex flex-col relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30 bg-[#0F172A]">
      {showControls && (
        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-[400] flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl border border-slate-700/60 shadow-2xl text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* The Bhu-Naksha wordmark glyph, read out by the heading beside it. */}
            <div
              aria-hidden="true"
              className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md shrink-0"
            >
              भू
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xs sm:text-sm text-white truncate">
                  {v("header.title")}
                </h2>
                <span className="hidden md:inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.2 rounded-full font-bold">
                  {v("header.villageChip", {
                    village: t("common.place.village"),
                    tehsil: t("common.place.tehsil"),
                  })}
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 truncate">
                {v("header.subtitle", { count: activeParcels.length })}
              </p>
            </div>
          </div>

          <div
            role="group"
            aria-label={v("layers.sectionLabel")}
            className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50"
          >
            {[
              { id: "satellite", icon: "🛰️" },
              { id: "bhunaksha", icon: "🗺️" },
            ].map((layer) => (
              <button
                key={layer.id}
                type="button"
                onClick={() => setBaseMap(layer.id)}
                aria-pressed={baseMap === layer.id}
                className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-all ${
                  baseMap === layer.id
                    ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <span aria-hidden="true">{layer.icon}</span> {v(`layers.${layer.id}`)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main map viewport */}
      <div className="w-full flex-1 relative min-h-[480px]">
        <MapContainer
          center={[28.8365, 77.5845]}
          zoom={16}
          scrollWheelZoom
          style={{ width: "100%", height: "100%", minHeight: "480px", background: "#0F172A" }}
          attributionControl={false}
        >
          <TileLayer url={TILE_LAYERS[baseMap].url} attribution={TILE_LAYERS[baseMap].attribution} />

          <MapCameraHandler targetParcel={selectedParcel} />

          {activeParcels.map((p) => {
            const isSelected = selectedParcel?.id === p.id || selectedParcel?.ulpin === p.ulpin;
            const isDisputed = p.is_disputed || p.verification_status === "Disputed";
            const isUnderReview =
              p.verification_status?.includes("Mutation") ||
              p.verification_status === "Under Verification";

            const theme = isDisputed
              ? BHUNAKSHA_PALETTE.Disputed
              : isUnderReview
              ? BHUNAKSHA_PALETTE["Under Review"]
              : BHUNAKSHA_PALETTE[p.land_type] || BHUNAKSHA_PALETTE["Agricultural (Zamin)"];

            const coords =
              p.polygon_coords ||
              (p.boundary_geojson
                ? JSON.parse(p.boundary_geojson).coordinates[0].map((c) => [c[1], c[0]])
                : [
                    [p.centroid_lat - 0.001, p.centroid_lng - 0.001],
                    [p.centroid_lat - 0.001, p.centroid_lng + 0.001],
                    [p.centroid_lat + 0.001, p.centroid_lng + 0.001],
                    [p.centroid_lat + 0.001, p.centroid_lng - 0.001],
                  ]);

            return (
              <Fragment key={p.id || p.ulpin}>
                <Polygon
                  positions={coords}
                  pathOptions={{
                    color: isSelected ? "#38BDF8" : theme.stroke,
                    weight: isSelected ? 4 : 2.5,
                    dashArray: isDisputed ? "4, 4" : undefined,
                    fillColor: theme.fill,
                    fillOpacity: isSelected ? 0.65 : 0.42,
                  }}
                  eventHandlers={{ click: () => handleParcelClick(p) }}
                >
                  <Tooltip direction="top" opacity={0.95} offset={[0, -10]} sticky>
                    <div className="px-2 py-1 font-sans text-xs font-semibold text-slate-900">
                      {v("tooltip", {
                        khasra: p.khasra_number,
                        owner: p.owner_name,
                        area: formatArea(p.area_ha),
                      })}
                    </div>
                  </Tooltip>
                </Polygon>

                {p.centroid_lat && p.centroid_lng && (
                  <Marker
                    position={[p.centroid_lat, p.centroid_lng]}
                    icon={createBhunakshaKhasraIcon({
                      text: v("badge.khasraShort", { number: p.khasra_number }),
                      ariaLabel: v("badge.label", { number: p.khasra_number }),
                      isSelected,
                      landType: p.land_type,
                      isDisputed,
                    })}
                    eventHandlers={{ click: () => handleParcelClick(p) }}
                  />
                )}
              </Fragment>
            );
          })}
        </MapContainer>

        {/* Legend (bottom left, desktop only) */}
        <div className="hidden sm:block absolute bottom-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md px-3.5 py-3 rounded-2xl border border-slate-700/60 shadow-2xl text-xs space-y-1.5 pointer-events-auto text-slate-200">
          <p className="font-bold text-white text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span aria-hidden="true" className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {v("legend.heading")}
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
            {LEGEND.map((entry) => (
              <li key={entry.key} className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={`w-3 h-3 rounded-sm border ${entry.border}`}
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-[10px]">{v(`legend.items.${entry.key}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Selected parcel: the khatauni drawer */}
        {selectedParcel && (
          <aside
            aria-label={v("drawer.label")}
            className={`
              z-[400] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 shadow-2xl text-slate-200 transition-all duration-300 flex flex-col justify-between
              md:absolute md:top-20 md:right-4 md:bottom-4 md:w-96 md:rounded-3xl md:p-5 md:overflow-y-auto
              absolute inset-x-2 bottom-2 rounded-2xl p-4 max-h-[80vh] overflow-y-auto
            `}
          >
            <div>
              {/* Mobile grab handle: a real control, not a div with onClick. */}
              <button
                type="button"
                onClick={() => setIsDrawerExpanded(!isDrawerExpanded)}
                aria-expanded={isDrawerExpanded}
                aria-label={
                  isDrawerExpanded ? v("drawer.handleCollapse") : v("drawer.handleExpand")
                }
                className="md:hidden block w-12 h-1.5 bg-slate-700 hover:bg-slate-500 rounded-full mx-auto mb-2"
              />

              <div className="flex items-start justify-between pb-3 border-b border-slate-700/60 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      {v("drawer.khasraChip", { number: selectedParcel.khasra_number })}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {v("drawer.khataChip", { number: selectedParcel.khata_number })}
                    </span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white truncate">
                    {selectedParcel.ulpin}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsDrawerExpanded(!isDrawerExpanded)}
                    aria-expanded={isDrawerExpanded}
                    aria-label={
                      isDrawerExpanded ? v("drawer.handleCollapse") : v("drawer.handleExpand")
                    }
                    className="md:hidden w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                      {isDrawerExpanded ? "expand_more" : "expand_less"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseDrawer}
                    aria-label={v("drawer.close")}
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors shadow-sm"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                      close
                    </span>
                  </button>
                </div>
              </div>

              {selectedParcel.is_disputed && (
                <div className="mb-3 p-3 bg-rose-950/80 text-rose-200 rounded-2xl text-xs flex items-start gap-2 border border-rose-600/50">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-rose-400 text-[18px] shrink-0"
                  >
                    report_problem
                  </span>
                  <div>
                    <p className="font-bold text-rose-300">{v("drawer.discrepancy")}</p>
                    <p className="text-[11px] leading-relaxed">{disputeNote(selectedParcel)}</p>
                  </div>
                </div>
              )}

              {/* The record of rights, as a description list */}
              {isDrawerExpanded && (
                <dl className="space-y-2.5 text-xs text-slate-300 animate-fadeIn">
                  <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700/50">
                    <dt className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">
                      {v("drawer.owner")}
                    </dt>
                    <dd className="font-bold text-sm text-white flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-emerald-400 text-[18px]"
                      >
                        badge
                      </span>
                      {selectedParcel.owner_name}
                    </dd>
                    {selectedParcel.co_owners?.length > 0 && (
                      <dd className="text-[11px] text-slate-400 mt-1 pl-6">
                        {v("drawer.coOwners", { names: selectedParcel.co_owners.join(", ") })}
                      </dd>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700/50">
                      <dt className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                        {v("drawer.areaMetric")}
                      </dt>
                      <dd className="font-bold text-white text-xs">
                        {formatArea(selectedParcel.area_ha, "common.units.hectareLong")}
                      </dd>
                    </div>
                    <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700/50">
                      <dt className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                        {v("drawer.areaCustomary")}
                      </dt>
                      <dd className="font-bold text-emerald-400 text-xs">
                        {customaryArea(selectedParcel.area_ha)}
                      </dd>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700/50">
                      <dt className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                        {v("drawer.valuation")}
                      </dt>
                      <dd className="font-bold text-white text-xs">
                        {valuationInLakh(selectedParcel.valuation_inr)}
                      </dd>
                    </div>
                    <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700/50">
                      <dt className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                        {v("drawer.landUse")}
                      </dt>
                      <dd className="font-bold text-sky-400 text-xs truncate">
                        {label("land_type", selectedParcel.land_type, selectedParcel.land_type_label)}
                      </dd>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700/50">
                    <dt className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                      {v("drawer.location")}
                    </dt>
                    <dd className="font-bold text-white text-[11px] mt-0.5">
                      {v("drawer.locationValue", {
                        village: placeName(selectedParcel.village, "common.place.village"),
                        tehsil: placeName(selectedParcel.tehsil, "common.place.tehsil"),
                        district: placeName(selectedParcel.district, "common.place.district"),
                        state: placeName(selectedParcel.state, "common.place.state"),
                      })}
                    </dd>
                  </div>

                  {/*
                    Colour and icon follow the value: a mortgaged or noticed
                    plot no longer renders as an emerald tick.
                  */}
                  <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700/50 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <dt className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                        {v("drawer.encumbrance")}
                      </dt>
                      <dd
                        className={`font-bold text-xs ${toneFor(selectedParcel.encumbrance_status).text}`}
                      >
                        {label(
                          "encumbrance_status",
                          selectedParcel.encumbrance_status,
                          selectedParcel.encumbrance_status_label
                        )}
                      </dd>
                      {selectedParcel.encumbrance_case && (
                        <dd className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {v("drawer.caseNumber", { number: selectedParcel.encumbrance_case })}
                        </dd>
                      )}
                    </div>
                    <span
                      aria-hidden="true"
                      className={`material-symbols-outlined text-[20px] shrink-0 ${toneFor(selectedParcel.encumbrance_status).text}`}
                    >
                      {toneFor(selectedParcel.encumbrance_status).icon}
                    </span>
                  </div>
                </dl>
              )}
            </div>

            {/* 360° inspection and the khatauni download */}
            <div className="pt-3 border-t border-slate-700/60 flex flex-col gap-2 mt-3">
              <button
                type="button"
                onClick={() => setIs360Open(true)}
                aria-label={v("actions.open360Named", { khasra: selectedParcel.khasra_number })}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-0.5"
              >
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-[18px] group-hover:rotate-180 transition-transform duration-500"
                >
                  360
                </span>
                {v("actions.open360")}
              </button>

              <button
                type="button"
                onClick={handleDownloadRor}
                aria-label={v("actions.downloadRorNamed", { khasra: selectedParcel.khasra_number })}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                  download
                </span>
                {v("actions.downloadRor")}
              </button>
            </div>
          </aside>
        )}
      </div>

      {is360Open && selectedParcel && (
        <Virtual360Viewer parcel={selectedParcel} onClose={() => setIs360Open(false)} />
      )}

      {/*
        Permanently mounted so the announcement is picked up: the download has
        no document service behind it in the demo and reports what it would do.
      */}
      <div
        role="status"
        aria-live="polite"
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[500] w-[min(28rem,90%)] pointer-events-none"
      >
        {toast && (
          <p className="rounded-2xl bg-slate-950/95 border border-slate-700 px-4 py-2.5 text-[11px] font-medium text-slate-100 shadow-2xl text-center">
            {toast.text}
          </p>
        )}
      </div>
    </div>
  );
}
