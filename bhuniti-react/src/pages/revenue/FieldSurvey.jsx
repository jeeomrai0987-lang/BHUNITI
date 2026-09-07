import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { useI18n } from "../../i18n";

// Leaflet camera controller to pan when parcel selection changes
function MapRecenter({ center, zoom = 16 }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, { duration: 0.8 });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom DGPS vertex marker. Decorative: the corner dots carry no text of their
// own, so there is nothing here to translate.
const createVertexIcon = (color = "#38BDF8") =>
  L.divIcon({
    className: "dgps-vertex-marker",
    html: `
      <div style="
        width: 12px;
        height: 12px;
        background: ${color};
        border: 2px solid #FFFFFF;
        border-radius: 50%;
        box-shadow: 0 0 8px rgba(0,0,0,0.5);
      "></div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

/*
 * The survey queue fixture.
 *
 * `type`, `status`, `badge` and `verdict` are catalog keys rather than English
 * text, and the two areas are numbers, so the variance panel can format them
 * for the active locale instead of printing a pre-baked "2.45 Ha". The delta is
 * derived from the two areas and therefore cannot contradict them.
 */
const SURVEY_REQUESTS = [
  {
    id: "SR-2023-089",
    parcelId: "P-1024",
    khasra: "412/1",
    type: "boundaryDispute",
    severity: "High",
    priorityBadge: "bg-error-container text-on-error-container",
    priorityDot: "bg-error",
    surveyor: { name: "R. Sharma", team: "alpha" },
    status: "reviewPending",
    statusBadge: "bg-tertiary-fixed text-on-tertiary-fixed",
    badge: "dispute",
    badgeColor: "bg-error text-on-error",
    gisArea: 2.45,
    fieldMeasure: 2.33,
    verdict: "beyondTolerance",
    uploaded: { name: "R. Sharma", time: "14:32", day: "today" },
    lat: 28.835,
    lng: 77.5825,
    polygonCoords: [
      [28.834, 77.581],
      [28.834, 77.584],
      [28.836, 77.584],
      [28.836, 77.581],
    ],
    disputedCoords: [
      [28.834, 77.5835],
      [28.834, 77.584],
      [28.836, 77.584],
      [28.836, 77.5835],
    ],
  },
  {
    id: "SR-2023-091",
    parcelId: "P-2155",
    khasra: "412/2",
    type: "subdivision",
    severity: "Medium",
    priorityBadge: "bg-surface-variant text-on-surface-variant",
    surveyor: { name: "M. Patel", team: "beta" },
    status: "inProgress",
    statusBadge: "bg-secondary-fixed text-on-secondary-fixed",
    badge: "inProgress",
    badgeColor: "bg-secondary-fixed text-on-secondary-fixed",
    gisArea: 1.45,
    fieldMeasure: 1.44,
    verdict: "withinTolerance",
    uploaded: { name: "M. Patel", time: "11:15", day: "today" },
    lat: 28.835,
    lng: 77.5852,
    polygonCoords: [
      [28.834, 77.584],
      [28.834, 77.5865],
      [28.836, 77.5865],
      [28.836, 77.584],
    ],
    disputedCoords: null,
  },
  {
    id: "SR-2023-095",
    parcelId: "P-3012",
    khasra: "413",
    type: "encroachment",
    severity: "High",
    priorityBadge: "bg-error-container text-on-error-container",
    priorityDot: "bg-error",
    surveyor: { name: "K. Singh", team: "gamma" },
    status: "assigned",
    statusBadge: "bg-surface-variant text-on-surface-variant",
    badge: "encroachment",
    badgeColor: "bg-error text-on-error",
    gisArea: 14.68,
    fieldMeasure: 12.5,
    verdict: "majorDiscrepancy",
    uploaded: { name: "K. Singh", day: "yesterday" },
    lat: 28.8327,
    lng: 77.5837,
    polygonCoords: [
      [28.8315, 77.581],
      [28.8315, 77.5865],
      [28.834, 77.5865],
      [28.834, 77.581],
    ],
    disputedCoords: [
      [28.8315, 77.581],
      [28.8315, 77.5822],
      [28.834, 77.5822],
      [28.834, 77.581],
    ],
  },
  {
    id: "SR-2023-098",
    parcelId: "P-0881",
    khasra: "414",
    type: "routineAudit",
    severity: "Low",
    priorityBadge: "bg-surface-container text-on-surface-variant",
    surveyor: null, // unassigned
    status: "pending",
    statusBadge: "bg-surface-container-high text-on-surface-variant",
    badge: "pending",
    badgeColor: "bg-surface-container-high text-on-surface-variant",
    gisArea: 3.4,
    fieldMeasure: 3.4,
    verdict: "exactMatch",
    uploaded: { system: true, daysAgo: 2 },
    lat: 28.835,
    lng: 77.588,
    polygonCoords: [
      [28.834, 77.5865],
      [28.834, 77.5895],
      [28.836, 77.5895],
      [28.836, 77.5865],
    ],
    disputedCoords: null,
  },
];

/* One verdict decides how the delta is coloured, so the two cannot drift. */
const VERDICT_COLOR = {
  beyondTolerance: "text-error",
  withinTolerance: "text-status-success",
  majorDiscrepancy: "text-error",
  exactMatch: "text-primary",
};

/*
 * The four cards across the top. `hint` names the shape of the line under the
 * figure -- a signed delta, a dot and caption, plain caption, or a progress bar.
 */
const STATS = [
  { key: "activeRequests", value: 18, icon: "assignment", iconClass: "text-primary",
    glow: "bg-primary-fixed opacity-20", hint: "delta", delta: 2 },
  { key: "inProgress", value: 5, icon: "engineering", iconClass: "text-secondary",
    glow: "bg-secondary-fixed opacity-20", hint: "dot", hintKey: "activeTeams" },
  { key: "awaiting", value: 12, icon: "pending_actions", iconClass: "text-tertiary-fixed-dim",
    glow: "bg-tertiary-fixed opacity-20", hint: "plain", hintKey: "awaitingHint" },
  { key: "equipment", value: 92, percent: true, icon: "sensors", iconClass: "text-primary",
    glow: "bg-primary-fixed opacity-10", hint: "bar", hintKey: "equipmentHint" },
];

const FIELD_TEAMS = [
  {
    team: "alpha",
    name: "R. Sharma",
    initials: "RS",
    avatar: "bg-primary-fixed text-primary shadow-sm",
    parcel: "P-1024",
    type: "boundaryDispute",
    state: "active",
    pill: "text-primary bg-primary-fixed/50",
    dot: "bg-primary animate-pulse",
  },
  {
    team: "beta",
    name: "M. Patel",
    initials: "MP",
    avatar: "bg-surface-variant text-on-surface-variant",
    parcel: "P-2155",
    inTransit: true,
    state: "moving",
    pill: "text-on-surface-variant bg-surface-variant",
    dot: "bg-outline",
  },
];

/* Equipment model names are trademarks and stay in Latin in both languages;
   only the role in brackets and the meta line are translated. */
const TELEMETRY = [
  {
    key: "drone",
    model: "DJI Matrice 300 RTK",
    battery: 84,
    valueClass: "text-primary",
    barClass: "bg-primary",
    meta: "droneMeta",
    team: "alpha",
  },
  {
    key: "totalStation",
    model: "Leica TS16",
    battery: 12,
    valueClass: "text-error",
    barClass: "bg-error",
    meta: "stationMeta",
    team: "beta",
    recalibrationDays: 2,
  },
];

const SURVEY_TYPES = [
  "boundaryDispute",
  "subdivision",
  "encroachment",
  "routineAudit",
  "mutationGroundCheck",
];

const TWO_DECIMALS = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
const SIGNED_TWO = { ...TWO_DECIMALS, signDisplay: "exceptZero" };
const TOAST_MS = 3500;

export default function FieldSurvey() {
  const { t, label, formatNumber } = useI18n();

  const [selectedRequest, setSelectedRequest] = useState(SURVEY_REQUESTS[0]);
  const [mapLayer, setMapLayer] = useState("satellite"); // "satellite" | "cadastral"
  const [toastMessage, setToastMessage] = useState("");
  const [newRequestModal, setNewRequestModal] = useState(false);
  const [newParcelId, setNewParcelId] = useState("");
  const [newSurveyType, setNewSurveyType] = useState(SURVEY_TYPES[0]);

  // The toast used to be dismissed by a bare setTimeout, which still fires
  // after the page unmounts and then sets state on a dead component.
  const toastTimer = useRef(null);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const p = (key, vars) => t(`pages.fieldSurvey.${key}`, vars);
  const area = (value) => `${formatNumber(value, TWO_DECIMALS)} ${t("common.units.hectare")}`;
  const percent = (value) => `${formatNumber(value)}${t("common.units.percent")}`;
  const surveyType = (key) => p(`surveyTypes.${key}`);
  const teamName = (key) => p(`teams.${key}`);

  const showToast = (message) => {
    clearTimeout(toastTimer.current);
    setToastMessage(message);
    toastTimer.current = setTimeout(() => setToastMessage(""), TOAST_MS);
  };

  const surveyorName = (surveyor) =>
    surveyor
      ? p("surveyor", { name: surveyor.name, team: p(`teamCodes.${surveyor.team}`) })
      : p("queue.unassigned");

  /* "14:32 Today", "Yesterday" or "2 days ago", depending on the fixture. */
  const uploadedWhen = (entry) => {
    if (entry.daysAgo != null) return t("common.time.daysAgo", { count: entry.daysAgo });
    const day = t(`common.time.${entry.day}`);
    return entry.time ? `${entry.time} ${day}` : day;
  };

  const uploadedLine = (entry) =>
    entry.system
      ? p("notes.systemScheduled", { when: uploadedWhen(entry) })
      : p("notes.uploadedBy", { name: entry.name, when: uploadedWhen(entry) });

  const handleCreateRequest = (event) => {
    event.preventDefault();
    const parcel = newParcelId.trim();
    if (!parcel) return;
    showToast(p("actions.createdToast", { parcel, type: surveyType(newSurveyType) }));
    setNewRequestModal(false);
    setNewParcelId("");
  };

  const request = selectedRequest;
  const delta = request.fieldMeasure - request.gisArea;

  /* The line under a stat figure. Four shapes, one per `hint`. */
  function statHint(stat) {
    switch (stat.hint) {
      case "delta":
        return (
          <div className="mt-2 text-sm text-secondary flex items-center gap-1 font-body-sm relative z-10">
            <span className="material-symbols-outlined text-sm text-error" aria-hidden="true">
              arrow_upward
            </span>
            {p("stats.sinceYesterday", {
              delta: formatNumber(stat.delta, { signDisplay: "always" }),
            })}
          </div>
        );
      case "dot":
        return (
          <div className="mt-2 text-sm text-secondary flex items-center gap-1 font-body-sm relative z-10">
            <span className="w-2 h-2 rounded-full bg-primary-fixed" aria-hidden="true"></span>
            {p(`stats.${stat.hintKey}`)}
          </div>
        );
      case "bar":
        return (
          <>
            <div className="mt-2 w-full bg-surface-variant rounded-full h-1.5 relative z-10">
              <div
                className="bg-primary h-1.5 rounded-full"
                style={{ width: `${stat.value}%` }}
              ></div>
            </div>
            <div className="mt-1 text-sm text-secondary text-right font-body-sm relative z-10">
              {p(`stats.${stat.hintKey}`)}
            </div>
          </>
        );
      default:
        return (
          <div className="mt-2 text-sm text-secondary flex items-center gap-1 font-body-sm relative z-10">
            {p(`stats.${stat.hintKey}`)}
          </div>
        );
    }
  }

  return (
    <main className="relative pt-16 min-h-screen bg-background">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-primary-container text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border border-primary/30 text-body-sm"
        >
          <span className="material-symbols-outlined text-primary text-[20px]" aria-hidden="true">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav
        aria-label={t("common.a11y.breadcrumb")}
        className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-label-md text-on-surface-variant"
      >
        <a className="hover:text-primary transition-colors" href="#">
          {p("breadcrumb.system")}
        </a>
        <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
          chevron_right
        </span>
        <span className="text-on-surface font-semibold">{p("breadcrumb.dashboard")}</span>
        <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
          chevron_right
        </span>
        <span className="text-on-surface font-semibold">{p("title")}</span>
      </nav>

      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1700px] mx-auto w-full space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">{p("title")}</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">{p("intro")}</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setNewRequestModal(true)}
              className="bg-primary hover:bg-on-surface text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">
                add
              </span>
              {p("newRequest")}
            </button>
          </div>
        </div>

        {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.key}
              className="bg-surface-container rounded-xl p-4 sm:p-5 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2 relative z-10">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  {p(`stats.${stat.key}`)}
                </span>
                <span
                  className={`material-symbols-outlined text-xl opacity-80 ${stat.iconClass}`}
                  aria-hidden="true"
                >
                  {stat.icon}
                </span>
              </div>
              <div className="font-display text-display text-on-surface relative z-10">
                {stat.percent ? percent(stat.value) : formatNumber(stat.value)}
              </div>
              {statHint(stat)}
              <div
                className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 ${stat.glow}`}
              ></div>
            </div>
          ))}
        </div>

        {/* Main Work Area: Queue + Active Context Map Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* CONTAINER 1: Survey Request Queue */}
          <section className="xl:col-span-7 2xl:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col overflow-hidden border border-outline-variant/20">
            <div className="px-5 py-4 bg-surface-container-low flex justify-between items-center border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-primary text-[20px]"
                  aria-hidden="true"
                >
                  format_list_bulleted
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  {p("queue.heading")}
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => showToast(p("queue.filterToast"))}
                  className="p-2 rounded-lg hover:bg-surface-variant transition-colors text-on-surface-variant"
                  title={p("queue.filter")}
                  aria-label={p("queue.filter")}
                >
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">
                    filter_list
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast(p("queue.sortToast"))}
                  className="p-2 rounded-lg hover:bg-surface-variant transition-colors text-on-surface-variant"
                  title={p("queue.sort")}
                  aria-label={p("queue.sort")}
                >
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">
                    sort
                  </span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left font-body-sm min-w-[620px]">
                <caption className="sr-only">{p("queue.heading")}</caption>
                <thead className="bg-surface-container sticky top-0 z-10 border-b border-outline-variant/30">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-label-md text-label-md text-on-surface-variant uppercase">
                      {p("queue.requestId")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-label-md text-label-md text-on-surface-variant uppercase">
                      {t("common.fields.parcelId")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-label-md text-label-md text-on-surface-variant uppercase">
                      {p("queue.type")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-label-md text-label-md text-on-surface-variant uppercase">
                      {t("common.fields.severity")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-label-md text-label-md text-on-surface-variant uppercase">
                      {t("common.fields.assignedTo")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-label-md text-label-md text-on-surface-variant uppercase">
                      {t("common.fields.status")}
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      <span className="sr-only">{t("common.fields.actions")}</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-surface-variant/40">
                  {SURVEY_REQUESTS.map((item) => {
                    const isSelected = request.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedRequest(item)}
                        aria-current={isSelected ? "true" : undefined}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-primary-fixed/30 border-l-4 border-l-primary"
                            : "hover:bg-surface-container-low border-l-4 border-l-transparent"
                        }`}
                      >
                        <td className="px-4 py-3.5 font-tabular-nums text-on-surface font-medium">
                          {item.id}
                        </td>
                        <td className="px-4 py-3.5 font-tabular-nums font-bold text-primary">
                          {item.parcelId}
                        </td>
                        <td className="px-4 py-3.5 text-on-surface-variant">
                          {surveyType(item.type)}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-md text-[10px] uppercase font-semibold ${item.priorityBadge}`}
                          >
                            {item.priorityDot && (
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${item.priorityDot}`}
                                aria-hidden="true"
                              ></span>
                            )}
                            {label("severity", item.severity)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-on-surface">
                          {surveyorName(item.surveyor)}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-sm font-label-md text-[10px] uppercase font-semibold ${item.statusBadge}`}
                          >
                            {p(`statuses.${item.status}`)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right text-on-surface-variant">
                          {/* The row is clickable, but only this button is reachable
                              from the keyboard, so selection is not mouse-only. */}
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(item)}
                            aria-label={p("queue.openRequest", { id: item.id })}
                            className="p-1 rounded hover:bg-surface-variant transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm" aria-hidden="true">
                              chevron_right
                            </span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* CONTAINER 2: Active Context & Exact GIS Parcel Map */}
          <section className="xl:col-span-5 2xl:col-span-4 bg-surface-container-lowest rounded-xl shadow-md flex flex-col overflow-hidden relative border border-outline-variant/30">
            {/* Header */}
            <div className="p-4 bg-primary text-on-primary flex justify-between items-center z-10 relative">
              <div>
                <div className="font-label-md text-label-md text-primary-fixed opacity-80 uppercase tracking-widest mb-1">
                  {p("context.eyebrow")}
                </div>
                <h3 className="font-headline-md text-headline-md font-bold">
                  {p("context.parcel", { id: request.parcelId })}
                </h3>
              </div>
              <span
                className={`${request.badgeColor} px-2.5 py-1 rounded font-label-md text-[10px] uppercase font-bold shadow-sm animate-pulse`}
              >
                {p(`badges.${request.badge}`)}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto bg-surface-bright relative z-0">
              {/* EXACT PARCEL MAP VIEW (Leaflet GIS Satellite Map) */}
              <div
                className="h-64 sm:h-72 relative w-full border-b border-outline-variant/30 z-0 overflow-hidden"
                role="region"
                aria-label={p("context.mapCaption", { id: request.parcelId })}
              >
                <MapContainer
                  key={`${request.parcelId}-${mapLayer}`}
                  center={[request.lat, request.lng]}
                  zoom={16}
                  scrollWheelZoom={false}
                  attributionControl={false}
                  className="w-full h-full"
                >
                  <MapRecenter center={[request.lat, request.lng]} zoom={16} />

                  {mapLayer === "satellite" ? (
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      maxZoom={19}
                    />
                  ) : (
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      maxZoom={19}
                    />
                  )}

                  {/* Exact recorded GIS cadastral boundary. */}
                  <Polygon
                    positions={request.polygonCoords}
                    pathOptions={{
                      color: "#38BDF8",
                      weight: 3,
                      fillColor: "#0284C7",
                      fillOpacity: 0.35,
                    }}
                  >
                    <Tooltip permanent direction="center">
                      <div className="text-center font-sans font-semibold text-[11px] leading-tight">
                        <strong>{p("context.parcel", { id: request.parcelId })}</strong>
                        <br />
                        <span className="text-[10px] opacity-80">
                          {p("context.khasra", { value: request.khasra })}
                        </span>
                      </div>
                    </Tooltip>
                  </Polygon>

                  {/* Disputed fence overlap, only on the two contested parcels. */}
                  {request.disputedCoords && (
                    <Polygon
                      positions={request.disputedCoords}
                      pathOptions={{
                        color: "#EF4444",
                        dashArray: "4, 4",
                        weight: 2.5,
                        fillColor: "#EF4444",
                        fillOpacity: 0.5,
                      }}
                    >
                      <Tooltip direction="top">
                        <span className="text-[10px] font-bold text-error">
                          {p("context.disputedOverlap")}
                        </span>
                      </Tooltip>
                    </Polygon>
                  )}

                  {/* Corner DGPS vertex markers. */}
                  {request.polygonCoords.map((coord) => (
                    <Marker
                      key={`${coord[0]},${coord[1]}`}
                      position={coord}
                      icon={createVertexIcon()}
                    />
                  ))}
                </MapContainer>

                {/* Map controls: satellite / vector layer toggle. */}
                <div
                  className="absolute top-2 right-2 z-[400] flex gap-1 bg-surface/90 backdrop-blur-md p-1 rounded-lg shadow-md border border-outline-variant/40"
                  role="group"
                  aria-label={p("context.baseLayer")}
                >
                  {["satellite", "cadastral"].map((layer) => (
                    <button
                      key={layer}
                      type="button"
                      onClick={() => setMapLayer(layer)}
                      aria-pressed={mapLayer === layer}
                      className={`px-2.5 py-1 text-[11px] rounded font-label-md font-medium transition-colors ${
                        mapLayer === layer
                          ? "bg-primary text-on-primary shadow-sm"
                          : "text-on-surface hover:bg-surface-container"
                      }`}
                    >
                      {p(`context.layers.${layer}`)}
                    </button>
                  ))}
                </div>

                {/* Live GPS coordinate strip. */}
                <div className="absolute bottom-2 left-2 right-2 z-[400] bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-outline-variant flex justify-between items-center text-[11px] font-tabular-nums text-on-surface">
                  <span className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full bg-status-success animate-pulse"
                      aria-hidden="true"
                    ></span>
                    {p("context.latitude", { value: request.lat.toFixed(4) })}
                  </span>
                  <span>{p("context.longitude", { value: request.lng.toFixed(4) })}</span>
                  <span className="text-on-surface-variant font-medium">
                    {p("context.khasraShort", { value: request.khasra })}
                  </span>
                </div>
              </div>

              {/* Context detail cards below the map. */}
              <div className="p-4 sm:p-5 space-y-5 pb-6">
                {/* Variance analysis. */}
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant">
                  <h4 className="font-label-md text-label-md text-on-surface-variant uppercase mb-3 flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-[16px] text-primary"
                      aria-hidden="true"
                    >
                      compare_arrows
                    </span>{" "}
                    {p("variance.heading")}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <div className="text-[10px] uppercase text-on-surface-variant mb-1 font-label-md">
                        {p("variance.gisRecord")}
                      </div>
                      <div className="font-tabular-nums text-lg text-on-surface bg-surface p-2 rounded text-center border border-outline-variant/50 font-bold">
                        {area(request.gisArea)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-primary mb-1 font-label-md">
                        {p("variance.fieldMeasure")}
                      </div>
                      <div className="font-tabular-nums text-lg text-primary bg-primary-fixed p-2 rounded text-center font-bold">
                        {area(request.fieldMeasure)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between bg-error-container/30 px-3 py-2 rounded text-on-error-container font-label-md text-[11px]">
                    <span className="font-medium">{p("variance.delta")}</span>
                    <span className={`font-bold ${VERDICT_COLOR[request.verdict]}`}>
                      {p("variance.value", {
                        area: `${formatNumber(delta, SIGNED_TWO)} ${t("common.units.hectare")}`,
                        verdict: p(`variance.verdict.${request.verdict}`),
                      })}
                    </span>
                  </div>
                </div>

                {/* Field notes, transcribed from the surveyor's paper form. */}
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2 flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-[16px] text-primary"
                      aria-hidden="true"
                    >
                      document_scanner
                    </span>{" "}
                    {p("notes.heading")}
                  </h4>
                  <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant text-sm font-body-sm text-on-surface-variant italic relative leading-relaxed">
                    <span
                      className="material-symbols-outlined absolute top-2 right-2 text-surface-tint opacity-20 text-3xl"
                      aria-hidden="true"
                    >
                      format_quote
                    </span>
                    <blockquote>
                      {p("notes.quoted", { text: p(`notes.body.${request.id}`) })}
                    </blockquote>
                    <div className="mt-2 text-[10px] not-italic font-tabular-nums text-primary font-medium">
                      {uploadedLine(request.uploaded)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom actions. */}
            <div className="p-4 bg-surface-container-lowest border-t border-outline-variant flex flex-col gap-2.5 z-10">
              <button
                type="button"
                onClick={() =>
                  showToast(p("actions.reconcileToast", { parcel: request.parcelId }))
                }
                className="w-full bg-primary hover:bg-on-surface text-on-primary font-label-md py-3 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  done_all
                </span>
                {p("actions.reconcile")}
              </button>
              <button
                type="button"
                onClick={() => showToast(p("actions.reportToast", { parcel: request.parcelId }))}
                className="w-full bg-surface text-primary border border-outline-variant font-label-md py-2.5 rounded-lg hover:bg-surface-variant transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  picture_as_pdf
                </span>
                {p("actions.report")}
              </button>
            </div>
          </section>
        </div>

        {/* Bottom section: active field teams and equipment telemetry. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20">
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase mb-4 border-b border-outline-variant/30 pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]" aria-hidden="true">
                groups
              </span>
              {p("fieldTeams.heading")}
            </h4>
            <div className="space-y-4">
              {FIELD_TEAMS.map((crew) => (
                <div key={crew.team} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full ${crew.avatar} flex items-center justify-center font-label-md font-bold`}
                      aria-hidden="true"
                    >
                      {crew.initials}
                    </div>
                    <div>
                      <div className="font-label-md text-sm text-on-surface font-semibold">
                        {p("surveyor", { name: crew.name, team: teamName(crew.team) })}
                      </div>
                      <div className="text-[11px] text-on-surface-variant">
                        {crew.inTransit
                          ? p("fieldTeams.inTransit", { parcel: crew.parcel })
                          : p("fieldTeams.onParcel", {
                              parcel: crew.parcel,
                              type: surveyType(crew.type),
                            })}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`flex items-center gap-1.5 text-[11px] font-label-md ${crew.pill} px-2.5 py-1 rounded-full font-medium`}
                  >
                    <span
                      className={`w-1.5 h-1.5 ${crew.dot} rounded-full`}
                      aria-hidden="true"
                    ></span>{" "}
                    {p(`fieldTeams.${crew.state}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20">
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase mb-4 border-b border-outline-variant/30 pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]" aria-hidden="true">
                sensors
              </span>
              {p("telemetry.heading")}
            </h4>
            <div className="space-y-4">
              {TELEMETRY.map((device) => (
                <div key={device.key} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="font-label-md text-on-surface">
                      {`${device.model} (${p(`telemetry.devices.${device.key}`)})`}
                    </span>
                    <span
                      className={`font-tabular-nums text-xs ${device.valueClass} font-bold`}
                    >
                      {p("telemetry.battery", { value: percent(device.battery) })}
                    </span>
                  </div>
                  {/* The bar mirrors the figure above it, so it is decorative. */}
                  <div
                    className="w-full bg-surface-variant rounded-full h-1.5 overflow-hidden"
                    aria-hidden="true"
                  >
                    <div
                      className={`${device.barClass} h-1.5 rounded-full transition-all`}
                      style={{ width: `${device.battery}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-on-surface-variant">
                    {/* Only the total station carries a recalibration date, so the
                        day count is supplied only when the fixture has one. */}
                    {p(`telemetry.${device.meta}`, {
                      team: teamName(device.team),
                      ...(device.recalibrationDays != null && {
                        days: t("common.time.inDays", { count: device.recalibrationDays }),
                      }),
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New survey request modal. */}
      {newRequestModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label={p("modal.heading")}
        >
          <div className="bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 w-full max-w-md p-6 space-y-4 animate-scale-in">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                {p("modal.heading")}
              </h3>
              <button
                type="button"
                onClick={() => setNewRequestModal(false)}
                aria-label={t("common.a11y.closeDialog")}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  close
                </span>
              </button>
            </div>
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label
                  htmlFor="survey-parcel-id"
                  className="block text-label-md text-on-surface-variant uppercase mb-1"
                >
                  {p("modal.parcelLabel")}
                </label>
                <input
                  id="survey-parcel-id"
                  type="text"
                  required
                  placeholder={p("modal.parcelPlaceholder")}
                  value={newParcelId}
                  onChange={(event) => setNewParcelId(event.target.value)}
                  className="w-full bg-surface-container px-3.5 py-2.5 rounded-lg border border-outline-variant text-body-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="survey-type"
                  className="block text-label-md text-on-surface-variant uppercase mb-1"
                >
                  {p("modal.typeLabel")}
                </label>
                <select
                  id="survey-type"
                  value={newSurveyType}
                  onChange={(event) => setNewSurveyType(event.target.value)}
                  className="w-full bg-surface-container px-3.5 py-2.5 rounded-lg border border-outline-variant text-body-sm text-on-surface focus:outline-none focus:border-primary"
                >
                  {/* The option value stays the catalog key so the toast can look
                      the label up again in whichever locale is active. */}
                  {SURVEY_TYPES.map((key) => (
                    <option key={key} value={key}>
                      {surveyType(key)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewRequestModal(false)}
                  className="px-4 py-2 text-label-md text-on-surface-variant hover:bg-surface-container rounded-lg"
                >
                  {t("common.actions.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary font-label-md rounded-lg shadow-sm hover:bg-on-surface"
                >
                  {p("modal.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
