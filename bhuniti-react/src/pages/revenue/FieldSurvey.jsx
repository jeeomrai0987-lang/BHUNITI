import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";

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

// Custom DGPS Vertex Marker Icon
const createVertexIcon = (label, color = "#38BDF8") =>
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

const SURVEY_REQUESTS = [
  {
    id: "SR-2023-089",
    parcelId: "P-1024",
    khasra: "412/1",
    village: "Sikandrabad",
    tehsil: "Modinagar",
    type: "Boundary Dispute",
    priority: "High",
    priorityBadge: "bg-error-container text-on-error-container",
    priorityDot: "bg-error",
    surveyor: "R. Sharma (T-Alpha)",
    status: "Review Pending",
    statusBadge: "bg-tertiary-fixed text-on-tertiary-fixed",
    badgeLabel: "Dispute",
    badgeColor: "bg-error text-on-error",
    gisArea: "2.45 Ha",
    fieldMeasure: "2.33 Ha",
    delta: "-0.12 Ha (Beyond Tolerance)",
    deltaColor: "text-error",
    notes:
      "Neighboring fence line observed approx 4 meters within recorded P-1024 boundary on eastern edge. Concrete pillars suggest recent placement. Requesting historical alignment overlay.",
    uploadedBy: "Uploaded by R. Sharma • 14:32 Today",
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
    village: "Sikandrabad",
    tehsil: "Modinagar",
    type: "Subdivision",
    priority: "Medium",
    priorityBadge: "bg-surface-variant text-on-surface-variant",
    surveyor: "M. Patel (T-Beta)",
    status: "In Progress",
    statusBadge: "bg-secondary-fixed text-on-secondary-fixed",
    badgeLabel: "In Progress",
    badgeColor: "bg-secondary-fixed text-on-secondary-fixed",
    gisArea: "1.45 Ha",
    fieldMeasure: "1.44 Ha",
    delta: "-0.01 Ha (Within Tolerance)",
    deltaColor: "text-status-success",
    notes:
      "Partition line demarcated with DGPS rover markers. Northern sub-parcel (0.72 Ha) and Southern sub-parcel (0.72 Ha) verified against mutation deed.",
    uploadedBy: "Uploaded by M. Patel • 11:15 Today",
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
    village: "Sikandrabad",
    tehsil: "Modinagar",
    type: "Encroachment",
    priority: "High",
    priorityBadge: "bg-error-container text-on-error-container",
    priorityDot: "bg-error",
    surveyor: "K. Singh (T-Gamma)",
    status: "Assigned",
    statusBadge: "bg-surface-variant text-on-surface-variant",
    badgeLabel: "Encroachment",
    badgeColor: "bg-error text-on-error",
    gisArea: "14.68 Ha",
    fieldMeasure: "12.50 Ha",
    delta: "-2.18 Ha (Major Discrepancy)",
    deltaColor: "text-error",
    notes:
      "Western boundary overlap with Gram Sabha public road. Survey team dispatched with CORS RTK receiver for millimeter-grade baseline fix.",
    uploadedBy: "Uploaded by K. Singh • Yesterday",
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
    village: "Sikandrabad",
    tehsil: "Modinagar",
    type: "Routine Audit",
    priority: "Low",
    priorityBadge: "bg-surface-container text-on-surface-variant",
    surveyor: "Unassigned",
    status: "Pending",
    statusBadge: "bg-surface-container-high text-on-surface-variant",
    badgeLabel: "Pending",
    badgeColor: "bg-surface-container-high text-on-surface-variant",
    gisArea: "3.40 Ha",
    fieldMeasure: "3.40 Ha",
    delta: "0.00 Ha (Exact Match)",
    deltaColor: "text-primary",
    notes:
      "Scheduled triennial cadastral verification. Benchmark stone #BM-44 in good condition. All corners clear.",
    uploadedBy: "System Scheduled • 2 days ago",
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

export default function FieldSurvey() {
  const [selectedRequest, setSelectedRequest] = useState(SURVEY_REQUESTS[0]);
  const [mapLayer, setMapLayer] = useState("satellite"); // "satellite" | "cadastral"
  const [toastMessage, setToastMessage] = useState("");
  const [newRequestModal, setNewRequestModal] = useState(false);
  const [newParcelId, setNewParcelId] = useState("");
  const [newSurveyType, setNewSurveyType] = useState("Boundary Dispute");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!newParcelId.trim()) return;
    showToast(`Survey request created for ${newParcelId.trim()} (${newSurveyType})`);
    setNewRequestModal(false);
    setNewParcelId("");
  };

  return (
    <main className="relative pt-16 min-h-screen bg-background">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border border-primary/30 text-body-sm">
          <span className="material-symbols-outlined text-primary text-[20px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-label-md text-on-surface-variant">
        <a className="hover:text-primary transition-colors" href="#">
          System
        </a>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Dashboard</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Field Survey Management</span>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1700px] mx-auto w-full space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
              Field Survey Management
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Overview of on-ground verification, DGPS rover telemetry, and cadastral survey activities.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setNewRequestModal(true)}
              className="bg-primary hover:bg-on-surface text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              New Request
            </button>
          </div>
        </div>

        {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-surface-container rounded-xl p-4 sm:p-5 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2 relative z-10">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Active Requests
              </span>
              <span className="material-symbols-outlined text-primary text-xl opacity-80">
                assignment
              </span>
            </div>
            <div className="font-display text-display text-on-surface relative z-10">
              18
            </div>
            <div className="mt-2 text-sm text-secondary flex items-center gap-1 font-body-sm relative z-10">
              <span className="material-symbols-outlined text-sm text-error">
                arrow_upward
              </span>
              <span className="text-error font-medium">+2</span> since yesterday
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-fixed opacity-20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          </div>

          <div className="bg-surface-container rounded-xl p-4 sm:p-5 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2 relative z-10">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                In Progress
              </span>
              <span className="material-symbols-outlined text-secondary text-xl opacity-80">
                engineering
              </span>
            </div>
            <div className="font-display text-display text-on-surface relative z-10">
              5
            </div>
            <div className="mt-2 text-sm text-secondary flex items-center gap-1 font-body-sm relative z-10">
              <span className="w-2 h-2 rounded-full bg-primary-fixed"></span> Active field teams
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary-fixed opacity-20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          </div>

          <div className="bg-surface-container rounded-xl p-4 sm:p-5 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2 relative z-10">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Awaiting Verification
              </span>
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-xl opacity-80">
                pending_actions
              </span>
            </div>
            <div className="font-display text-display text-on-surface relative z-10">
              12
            </div>
            <div className="mt-2 text-sm text-secondary flex items-center gap-1 font-body-sm relative z-10">
              Requires RO approval
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-tertiary-fixed opacity-20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          </div>

          <div className="bg-surface-container rounded-xl p-4 sm:p-5 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2 relative z-10">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Equipment Readiness
              </span>
              <span className="material-symbols-outlined text-primary text-xl opacity-80">
                sensors
              </span>
            </div>
            <div className="font-display text-display text-on-surface relative z-10">
              92%
            </div>
            <div className="mt-2 w-full bg-surface-variant rounded-full h-1.5 relative z-10">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: "92%" }}></div>
            </div>
            <div className="mt-1 text-sm text-secondary text-right font-body-sm relative z-10">
              Calibrated & Ready
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-fixed opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          </div>
        </div>

        {/* Main Work Area: Queue + Active Context Map Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* CONTAINER 1: Survey Request Queue */}
          <section className="xl:col-span-7 2xl:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col overflow-hidden border border-outline-variant/20">
            <div className="px-5 py-4 bg-surface-container-low flex justify-between items-center border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  format_list_bulleted
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Survey Request Queue
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => showToast("Filter options toggled")}
                  className="p-2 rounded-lg hover:bg-surface-variant transition-colors text-on-surface-variant"
                  title="Filter Records"
                >
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                </button>
                <button
                  onClick={() => showToast("Queue sorted by priority")}
                  className="p-2 rounded-lg hover:bg-surface-variant transition-colors text-on-surface-variant"
                  title="Sort Records"
                >
                  <span className="material-symbols-outlined text-sm">sort</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left font-body-sm min-w-[620px]">
                <thead className="bg-surface-container sticky top-0 z-10 border-b border-outline-variant/30">
                  <tr>
                    <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant uppercase">
                      Request ID
                    </th>
                    <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant uppercase">
                      Parcel ID
                    </th>
                    <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant uppercase">
                      Priority
                    </th>
                    <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant uppercase">
                      Surveyor
                    </th>
                    <th className="px-4 py-3 font-label-md text-label-md text-on-surface-variant uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant/40">
                  {SURVEY_REQUESTS.map((item) => {
                    const isSelected = selectedRequest.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedRequest(item)}
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
                          {item.type}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-md text-[10px] uppercase font-semibold ${item.priorityBadge}`}
                          >
                            {item.priorityDot && (
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${item.priorityDot}`}
                              ></span>
                            )}
                            {item.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-on-surface">
                          {item.surveyor}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-sm font-label-md text-[10px] uppercase font-semibold ${item.statusBadge}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right text-on-surface-variant">
                          <span className="material-symbols-outlined text-sm">
                            chevron_right
                          </span>
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
                  Active Context
                </div>
                <h3 className="font-headline-md text-headline-md font-bold">
                  Parcel {selectedRequest.parcelId}
                </h3>
              </div>
              <span
                className={`${selectedRequest.badgeColor} px-2.5 py-1 rounded font-label-md text-[10px] uppercase font-bold shadow-sm animate-pulse`}
              >
                {selectedRequest.badgeLabel}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto bg-surface-bright relative z-0">
              
              {/* EXACT PARCEL MAP VIEW (Leaflet GIS Satellite Map) */}
              <div className="h-64 sm:h-72 relative w-full border-b border-outline-variant/30 z-0 overflow-hidden">
                <MapContainer
                  key={`${selectedRequest.parcelId}-${mapLayer}`}
                  center={[selectedRequest.lat, selectedRequest.lng]}
                  zoom={16}
                  scrollWheelZoom={false}
                  attributionControl={false}
                  className="w-full h-full"
                >
                  <MapRecenter
                    center={[selectedRequest.lat, selectedRequest.lng]}
                    zoom={16}
                  />

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

                  {/* Exact Recorded GIS Cadastral Boundary */}
                  <Polygon
                    positions={selectedRequest.polygonCoords}
                    pathOptions={{
                      color: "#38BDF8",
                      weight: 3,
                      fillColor: "#0284C7",
                      fillOpacity: 0.35,
                    }}
                  >
                    <Tooltip permanent direction="center">
                      <div className="text-center font-sans font-semibold text-[11px] leading-tight">
                        <strong>Parcel {selectedRequest.parcelId}</strong>
                        <br />
                        <span className="text-[10px] opacity-80">
                          Khasra {selectedRequest.khasra}
                        </span>
                      </div>
                    </Tooltip>
                  </Polygon>

                  {/* Disputed Fence Overlap (if applicable) */}
                  {selectedRequest.disputedCoords && (
                    <Polygon
                      positions={selectedRequest.disputedCoords}
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
                          Disputed Boundary Overlap
                        </span>
                      </Tooltip>
                    </Polygon>
                  )}

                  {/* Corner DGPS Vertex Markers */}
                  {selectedRequest.polygonCoords.map((coord, idx) => (
                    <Marker
                      key={idx}
                      position={coord}
                      icon={createVertexIcon(`P${idx + 1}`)}
                    />
                  ))}
                </MapContainer>

                {/* Map Controls: Satellite / Vector Layer Toggle */}
                <div className="absolute top-2 right-2 z-[400] flex gap-1 bg-surface/90 backdrop-blur-md p-1 rounded-lg shadow-md border border-outline-variant/40">
                  <button
                    onClick={() => setMapLayer("satellite")}
                    className={`px-2.5 py-1 text-[11px] rounded font-label-md font-medium transition-colors ${
                      mapLayer === "satellite"
                        ? "bg-primary text-on-primary shadow-sm"
                        : "text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    Satellite
                  </button>
                  <button
                    onClick={() => setMapLayer("cadastral")}
                    className={`px-2.5 py-1 text-[11px] rounded font-label-md font-medium transition-colors ${
                      mapLayer === "cadastral"
                        ? "bg-primary text-on-primary shadow-sm"
                        : "text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    Cadastral
                  </button>
                </div>

                {/* Live GPS Coordinates Overlay */}
                <div className="absolute bottom-2 left-2 right-2 z-[400] bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-outline-variant flex justify-between items-center text-[11px] font-tabular-nums text-on-surface">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                    Lat: {selectedRequest.lat.toFixed(4)}° N
                  </span>
                  <span>Lng: {selectedRequest.lng.toFixed(4)}° E</span>
                  <span className="text-on-surface-variant font-medium">
                    Kh. {selectedRequest.khasra}
                  </span>
                </div>
              </div>

              {/* Context Details Below Map */}
              <div className="p-4 sm:p-5 space-y-5 pb-6">
                
                {/* Variance Analysis Card */}
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant">
                  <h4 className="font-label-md text-label-md text-on-surface-variant uppercase mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      compare_arrows
                    </span>{" "}
                    Variance Analysis
                  </h4>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <div className="text-[10px] uppercase text-on-surface-variant mb-1 font-label-md">
                        GIS Record
                      </div>
                      <div className="font-tabular-nums text-lg text-on-surface bg-surface p-2 rounded text-center border border-outline-variant/50 font-bold">
                        {selectedRequest.gisArea}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-primary mb-1 font-label-md">
                        Field Measure
                      </div>
                      <div className="font-tabular-nums text-lg text-primary bg-primary-fixed p-2 rounded text-center font-bold">
                        {selectedRequest.fieldMeasure}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between bg-error-container/30 px-3 py-2 rounded text-on-error-container font-label-md text-[11px]">
                    <span className="font-medium">Delta</span>
                    <span className={`font-bold ${selectedRequest.deltaColor}`}>
                      {selectedRequest.delta}
                    </span>
                  </div>
                </div>

                {/* Field Notes (OCR) Card */}
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      document_scanner
                    </span>{" "}
                    Field Notes (OCR)
                  </h4>
                  <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant text-sm font-body-sm text-on-surface-variant italic relative leading-relaxed">
                    <span className="material-symbols-outlined absolute top-2 right-2 text-surface-tint opacity-20 text-3xl">
                      format_quote
                    </span>
                    "{selectedRequest.notes}"
                    <div className="mt-2 text-[10px] not-italic font-tabular-nums text-primary font-medium">
                      {selectedRequest.uploadedBy}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-surface-container-lowest border-t border-outline-variant flex flex-col gap-2.5 z-10">
              <button
                onClick={() =>
                  showToast(
                    `Reconciled field observations for Parcel ${selectedRequest.parcelId}`
                  )
                }
                className="w-full bg-primary hover:bg-on-surface text-on-primary font-label-md py-3 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  done_all
                </span>
                Reconcile Observations
              </button>
              <button
                onClick={() =>
                  showToast(
                    `Survey Report generated for ${selectedRequest.parcelId} (PDF)`
                  )
                }
                className="w-full bg-surface text-primary border border-outline-variant font-label-md py-2.5 rounded-lg hover:bg-surface-variant transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  picture_as_pdf
                </span>
                Generate Survey Report
              </button>
            </div>
          </section>
        </div>

        {/* Bottom Section: Active Field Teams & Equipment Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20">
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase mb-4 border-b border-outline-variant/30 pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">
                groups
              </span>
              Active Field Teams
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-label-md font-bold shadow-sm">
                    RS
                  </div>
                  <div>
                    <div className="font-label-md text-sm text-on-surface font-semibold">
                      R. Sharma (Team Alpha)
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      P-1024 • Boundary Dispute
                    </div>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-label-md text-primary bg-primary-fixed/50 px-2.5 py-1 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>{" "}
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-md font-bold">
                    MP
                  </div>
                  <div>
                    <div className="font-label-md text-sm text-on-surface font-semibold">
                      M. Patel (Team Beta)
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      In Transit to P-2155
                    </div>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-label-md text-on-surface-variant bg-surface-variant px-2.5 py-1 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 bg-outline rounded-full"></span>{" "}
                  Moving
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20">
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase mb-4 border-b border-outline-variant/30 pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">
                sensors
              </span>
              Equipment Telemetry
            </h4>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="font-label-md text-on-surface">
                    DJI Matrice 300 RTK (Drone-1)
                  </span>
                  <span className="font-tabular-nums text-xs text-primary font-bold">
                    84% Battery
                  </span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: "84%" }}
                  ></div>
                </div>
                <div className="text-[10px] text-on-surface-variant">
                  Assigned to: Team Alpha • RTK Fix: Millimeter Grade • Calibrated
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="font-label-md text-on-surface">
                    Leica TS16 (Total Station-3)
                  </span>
                  <span className="font-tabular-nums text-xs text-error font-bold">
                    12% Battery
                  </span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-error h-1.5 rounded-full transition-all"
                    style={{ width: "12%" }}
                  ></div>
                </div>
                <div className="text-[10px] text-on-surface-variant">
                  Assigned to: Team Beta • Recalibration Due: 2 days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Survey Request Modal */}
      {newRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 w-full max-w-md p-6 space-y-4 animate-scale-in">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Create Survey Request
              </h3>
              <button
                onClick={() => setNewRequestModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-label-md text-on-surface-variant uppercase mb-1">
                  Parcel ID / ULPIN
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. P-4492"
                  value={newParcelId}
                  onChange={(e) => setNewParcelId(e.target.value)}
                  className="w-full bg-surface-container px-3.5 py-2.5 rounded-lg border border-outline-variant text-body-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-label-md text-on-surface-variant uppercase mb-1">
                  Survey Type
                </label>
                <select
                  value={newSurveyType}
                  onChange={(e) => setNewSurveyType(e.target.value)}
                  className="w-full bg-surface-container px-3.5 py-2.5 rounded-lg border border-outline-variant text-body-sm text-on-surface focus:outline-none focus:border-primary"
                >
                  <option>Boundary Dispute</option>
                  <option>Subdivision</option>
                  <option>Encroachment</option>
                  <option>Routine Audit</option>
                  <option>Mutation Ground Check</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewRequestModal(false)}
                  className="px-4 py-2 text-label-md text-on-surface-variant hover:bg-surface-container rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary font-label-md rounded-lg shadow-sm hover:bg-on-surface"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

