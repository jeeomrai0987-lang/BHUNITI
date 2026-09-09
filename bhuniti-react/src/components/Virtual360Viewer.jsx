/*
 * The 360-degree ground-inspection modal, opened from a parcel on the Bhu-Naksha
 * map, from the citizen search result and from the home page demo.
 *
 * Defects fixed while translating this file:
 *
 *  1. Every string was hard-coded English, so the Hindi build showed an English
 *     overlay on top of a Hindi record. All of it now comes from
 *     viewers.virtual360 in the catalogs.
 *  2. The four viewport tools carried `title=` only. A title is a tooltip, not
 *     an accessible name, so the zoom, auto-rotate and reset buttons announced
 *     themselves as their icon ligature ("add", "sync"). They now carry
 *     aria-label, and the auto-rotate label says what the next press does.
 *  3. Neither close button (the header one, the popup one) had any accessible
 *     name at all.
 *  4. The hotspot pins were `<div onClick>`: not focusable, not operable from
 *     the keyboard, and invisible to assistive technology. They are buttons now.
 *  5. The panorama is a remote photograph with no alternative text; it is a
 *     `role="img"` with a description of the imagery source.
 *  6. The modal had no dialog semantics and no Escape key, so it trapped
 *     keyboard users behind a page they could not dismiss.
 *  7. Every material-symbols glyph was read aloud as its ligature name; the
 *     decorative ones are aria-hidden.
 *  8. Panning was mouse and touch only. Arrow keys now nudge the view.
 *  9. Missing parcel data was papered over with an invented ULPIN
 *     ("09-XXXX-XXXX-1024") and an invented owner ("Rahul Sharma"). Absent
 *     values print an em dash instead of fiction.
 * 10. `hotspots` held already-rendered translated text in state, so the open
 *     popup kept its old language after a locale switch. State holds the id and
 *     the text is derived.
 */
import { useEffect, useState } from "react";
import InterpolatedText from "./InterpolatedText";
import { useI18n } from "../i18n";

/*
 * Panorama imagery, keyed by view mode. Remote photographs standing in for the
 * survey drive's own frames; the third is the ground shot under a hue rotation,
 * which is what the cadastral overlay looks like in the demo.
 */
const PANORAMAS = {
  ground:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2400",
  drone:
    "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2400",
  thermal:
    "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=2400",
};

/*
 * The mode ids are the PANORAMAS keys and are never translated. `thermal` keeps
 * its fixture name but is labelled as the cadastral overlay on screen.
 */
const MODES = [
  {
    id: "ground",
    icon: "person_pin_circle",
    labelKey: "modes.ground",
    altKey: "panorama.ground",
  },
  { id: "drone", icon: "flight", labelKey: "modes.drone", altKey: "panorama.drone" },
  {
    id: "thermal",
    icon: "layers",
    labelKey: "modes.cadastral",
    altKey: "panorama.cadastral",
  },
];

/* Pin glyph per hotspot type. Ligature names, not text. */
const HOTSPOT_ICON = {
  warning: "warning",
  pillar: "flag",
  access: "navigation",
  info: "navigation",
};

const HOTSPOT_TONE = {
  warning: "bg-error text-on-error ring-4 ring-error/30",
  pillar: "bg-primary text-on-primary ring-4 ring-primary/30",
  access: "bg-secondary text-on-secondary ring-4 ring-secondary/30",
  info: "bg-secondary text-on-secondary ring-4 ring-secondary/30",
};

/* Printed wherever the record has nothing to show. */
const EM_DASH = "—";

/*
 * The three shipped call sites always pass a parcel; this keeps the compass
 * readout sane if a future caller opens the viewer without one. It is the
 * village centroid, not a parcel's.
 */
const DEMO_CENTROID = { lat: 28.8354, lng: 77.5843 };

const MIN_PITCH = -40;
const MAX_PITCH = 40;
const KEY_STEP_DEG = 5;
const AUTO_ROTATE_STEP_DEG = 0.15;
const AUTO_ROTATE_MS = 30;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 1.8;
const ZOOM_STEP = 0.15;

export default function Virtual360Viewer({ parcel, onClose }) {
  const { t, formatNumber } = useI18n();
  const v = (key, vars) => t(`viewers.virtual360.${key}`, vars);

  const [viewMode, setViewMode] = useState("ground");
  const [yaw, setYaw] = useState(0); // horizontal angle, 0-360
  const [pitch, setPitch] = useState(0); // vertical angle, MIN_PITCH..MAX_PITCH
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeHotspotId, setActiveHotspotId] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const activeMode = MODES.find((mode) => mode.id === viewMode) || MODES[0];

  /*
   * The boundary pin's note: a reason the API supplied wins, then a translated
   * sentence naming the case, then the plain "verified" line.
   */
  const boundaryNote = () => {
    if (parcel?.dispute_reason) return parcel.dispute_reason;
    if (!parcel?.is_disputed) return v("hotspots.boundary.verifiedInfo");
    const caseId = parcel.dispute_case_id || parcel.case_number;
    return caseId
      ? v("hotspots.boundary.disputedInfo", { case: caseId })
      : v("hotspots.boundary.disputedInfoNoCase");
  };

  /*
   * Survey waypoints and boundary pins. Derived on every render rather than
   * held in state so that a locale switch re-renders them in the new language.
   */
  const hotspots = [
    {
      id: "boundary-north",
      yaw: 35,
      pitch: -5,
      type: "pillar",
      name: v("hotspots.pillar.name"),
      info: v("hotspots.pillar.info"),
    },
    {
      id: "dispute-marker",
      yaw: 160,
      pitch: -8,
      type: parcel?.is_disputed ? "warning" : "info",
      name: parcel?.is_disputed
        ? v("hotspots.boundary.disputedName")
        : v("hotspots.boundary.verifiedName"),
      info: boundaryNote(),
    },
    {
      id: "road-access",
      yaw: 280,
      pitch: -12,
      type: "access",
      name: v("hotspots.access.name"),
      info: v("hotspots.access.info"),
    },
  ];

  const activeHotspot = hotspots.find((spot) => spot.id === activeHotspotId) || null;

  // ── Pointer, touch and keyboard panning ──────────────────────────────────

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setAutoRotate(false);
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;
    setYaw((prev) => (prev - deltaX * 0.3 + 360) % 360);
    setPitch((prev) => Math.max(MIN_PITCH, Math.min(MAX_PITCH, prev + deltaY * 0.2)));
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (event) => {
    if (event.touches.length !== 1) return;
    setIsDragging(true);
    setAutoRotate(false);
    setDragStart({ x: event.touches[0].clientX, y: event.touches[0].clientY });
  };

  const handleTouchMove = (event) => {
    if (!isDragging || event.touches.length !== 1) return;
    const deltaX = event.touches[0].clientX - dragStart.x;
    const deltaY = event.touches[0].clientY - dragStart.y;
    setYaw((prev) => (prev - deltaX * 0.4 + 360) % 360);
    setPitch((prev) => Math.max(MIN_PITCH, Math.min(MAX_PITCH, prev + deltaY * 0.3)));
    setDragStart({ x: event.touches[0].clientX, y: event.touches[0].clientY });
  };

  const handleTouchEnd = () => setIsDragging(false);

  /* Arrow keys pan the view, which was previously impossible without a mouse. */
  const handleViewportKeyDown = (event) => {
    if (event.key === "ArrowLeft") setYaw((prev) => (prev - KEY_STEP_DEG + 360) % 360);
    else if (event.key === "ArrowRight") setYaw((prev) => (prev + KEY_STEP_DEG) % 360);
    else if (event.key === "ArrowUp")
      setPitch((prev) => Math.max(MIN_PITCH, prev - KEY_STEP_DEG));
    else if (event.key === "ArrowDown")
      setPitch((prev) => Math.min(MAX_PITCH, prev + KEY_STEP_DEG));
    else return;
    event.preventDefault();
    setAutoRotate(false);
  };

  const resetView = () => {
    setYaw(0);
    setPitch(0);
    setZoom(1);
  };

  useEffect(() => {
    if (!autoRotate) return undefined;
    const interval = setInterval(() => {
      setYaw((prev) => (prev + AUTO_ROTATE_STEP_DEG) % 360);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(interval);
  }, [autoRotate]);

  /* Escape closes the open note first, then the modal itself. */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (activeHotspotId) setActiveHotspotId(null);
      else if (onClose) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeHotspotId, onClose]);

  // ── Readouts ─────────────────────────────────────────────────────────────

  const compassPoint = (degrees) => {
    if (degrees > 315 || degrees <= 45) return v("hud.compass.north");
    if (degrees <= 135) return v("hud.compass.east");
    if (degrees <= 225) return v("hud.compass.south");
    return v("hud.compass.west");
  };

  const coordinate = (value) =>
    formatNumber(value, { minimumFractionDigits: 4, maximumFractionDigits: 4 });

  const centroidLat = parcel?.centroid_lat ?? DEMO_CENTROID.lat;
  const centroidLng = parcel?.centroid_lng ?? DEMO_CENTROID.lng;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={v("dialogLabel")}
      className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-2 sm:p-4 md:p-6 select-none animate-fadeIn"
    >
      {/* Header: identity of the parcel, imagery switch, close */}
      <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-3 bg-surface-container/90 backdrop-blur-md px-4 sm:px-6 py-3 rounded-2xl border border-outline-variant/30 text-on-surface mb-2 sm:mb-3 shadow-xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            aria-hidden="true"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md shrink-0"
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[24px]">360</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-sm sm:text-base text-on-surface truncate">
                {v("title")}
              </h2>
              <span className="hidden sm:inline-block bg-primary/10 text-primary text-[10px] font-label-md px-2 py-0.5 rounded-full uppercase font-semibold">
                {v("liveBadge")}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-on-surface-variant truncate">
              <InterpolatedText
                template={v("identity")}
                values={{
                  ulpin: {
                    text: parcel?.ulpin || EM_DASH,
                    className: "text-primary font-semibold",
                  },
                  owner: parcel?.owner_name || EM_DASH,
                }}
              />
            </p>
          </div>
        </div>

        {/* Imagery source switch */}
        <div
          role="group"
          aria-label={v("modes.sectionLabel")}
          className="flex items-center gap-1 sm:gap-2 bg-surface-container-highest/80 p-1 rounded-xl border border-outline-variant/20"
        >
          {MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setViewMode(mode.id)}
              aria-pressed={viewMode === mode.id}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-label-md transition-all flex items-center gap-1 ${
                viewMode === mode.id
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                {mode.icon}
              </span>
              {v(mode.labelKey)}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={v("close")}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface-container-high hover:bg-error hover:text-white transition-colors flex items-center justify-center text-on-surface shrink-0"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
            close
          </span>
        </button>
      </div>

      {/*
       * Panorama viewport. Focusable so that the arrow-key handler above is
       * reachable; the group label tells a screen-reader user how to drive it.
       */}
      <div
        role="group"
        tabIndex={0}
        aria-label={v("hint")}
        className="w-full max-w-6xl flex-1 bg-surface-container-lowest rounded-2xl sm:rounded-3xl overflow-hidden relative cursor-grab active:cursor-grabbing shadow-2xl border border-outline-variant/30 flex items-center justify-center touch-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onKeyDown={handleViewportKeyDown}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/*
         * Cylindrical projection of a remote photograph. It carries the imagery
         * description because nothing else on screen says what is being looked
         * at, and the offsets are data so they stay inline.
         */}
        <div
          role="img"
          aria-label={v(activeMode.altKey)}
          className="absolute inset-0 bg-cover bg-center transition-all duration-75"
          style={{
            backgroundImage: `url(${PANORAMAS[viewMode]})`,
            backgroundPosition: `${(yaw / 360) * 100}% ${50 + pitch * 0.8}%`,
            transform: `scale(${zoom})`,
            filter: viewMode === "thermal" ? "hue-rotate(180deg) contrast(120%)" : "none",
          }}
        />

        {/* Hotspots, placed at their angle relative to the current heading */}
        {hotspots.map((spot) => {
          let angleDiff = (spot.yaw - yaw + 360) % 360;
          if (angleDiff > 180) angleDiff -= 360;
          if (Math.abs(angleDiff) >= 70) return null;

          const leftPercent = 50 + (angleDiff / 70) * 45;
          const topPercent = 50 - (spot.pitch - pitch) * 1.5;

          return (
            <button
              key={spot.id}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setActiveHotspotId(spot.id);
              }}
              onMouseDown={(event) => event.stopPropagation()}
              aria-label={v("hotspots.openInfo", { name: spot.name })}
              aria-expanded={activeHotspotId === spot.id}
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
            >
              <div
                aria-hidden="true"
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 animate-bounce ${
                  HOTSPOT_TONE[spot.type] || HOTSPOT_TONE.info
                }`}
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                  {HOTSPOT_ICON[spot.type] || HOTSPOT_ICON.info}
                </span>
              </div>
              <span
                aria-hidden="true"
                className="hidden sm:block absolute top-12 left-1/2 -translate-x-1/2 bg-surface/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-xl text-on-surface text-[11px] font-semibold whitespace-nowrap border border-outline-variant/30 pointer-events-none opacity-90 group-hover:opacity-100"
              >
                {spot.name}
              </span>
            </button>
          );
        })}

        {/* The survey note for the pin that was tapped */}
        {activeHotspot && (
          <div className="absolute bottom-16 sm:bottom-20 left-4 sm:left-6 right-4 sm:right-auto z-40 bg-surface/95 backdrop-blur-xl border border-outline-variant/30 p-4 sm:p-5 rounded-2xl shadow-2xl max-w-sm animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs sm:text-sm text-on-surface flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-primary text-[18px]"
                >
                  verified
                </span>
                {activeHotspot.name}
              </span>
              <button
                type="button"
                onClick={() => setActiveHotspotId(null)}
                aria-label={v("hotspots.closeInfo")}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {activeHotspot.info}
            </p>
          </div>
        )}

        {/* Compass and centroid readout */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 bg-surface/85 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border border-outline-variant/20 text-on-surface flex items-center gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-primary flex items-center justify-center text-primary font-bold text-[10px] sm:text-xs transition-transform duration-75"
              style={{ transform: `rotate(${-yaw}deg)` }}
            >
              {v("hud.compass.north")}
            </div>
            <div>
              <p className="text-[9px] font-label-md uppercase tracking-wider text-on-surface-variant">
                {v("hud.heading")}
              </p>
              <p className="text-[11px] sm:text-xs font-bold font-tabular-nums">
                {v("hud.headingValue", {
                  degrees: formatNumber(Math.round(yaw)),
                  direction: compassPoint(yaw),
                })}
              </p>
            </div>
          </div>
          <div aria-hidden="true" className="hidden sm:block h-6 w-px bg-outline-variant/30" />
          <div className="hidden sm:block">
            <p className="text-[9px] font-label-md uppercase tracking-wider text-on-surface-variant">
              {v("hud.centroid")}
            </p>
            <p className="text-xs font-bold font-tabular-nums">
              {v("hud.centroidValue", {
                lat: coordinate(centroidLat),
                northSouth: v("hud.compass.north"),
                lng: coordinate(centroidLng),
                eastWest: v("hud.compass.east"),
              })}
            </p>
          </div>
        </div>

        {/* Viewport tools */}
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6 z-30 flex flex-col gap-1.5 bg-surface/85 backdrop-blur-md p-1.5 rounded-xl sm:rounded-2xl border border-outline-variant/20 shadow-lg">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))}
            aria-label={v("controls.zoomIn")}
            className="w-8 h-8 rounded-lg sm:rounded-xl hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              add
            </span>
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))}
            aria-label={v("controls.zoomOut")}
            className="w-8 h-8 rounded-lg sm:rounded-xl hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              remove
            </span>
          </button>
          <div aria-hidden="true" className="w-full h-px bg-outline-variant/20 my-0.5" />
          <button
            type="button"
            onClick={() => setAutoRotate((running) => !running)}
            aria-pressed={autoRotate}
            aria-label={
              autoRotate ? v("controls.autoRotateStop") : v("controls.autoRotateStart")
            }
            className={`w-8 h-8 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors ${
              autoRotate
                ? "bg-primary text-on-primary"
                : "hover:bg-surface-container-high text-on-surface"
            }`}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              sync
            </span>
          </button>
          <button
            type="button"
            onClick={resetView}
            aria-label={v("controls.reset")}
            className="w-8 h-8 rounded-lg sm:rounded-xl hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              restart_alt
            </span>
          </button>
        </div>

        {/* How to drive it. Also the viewport's own accessible name. */}
        <p className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 bg-surface/85 backdrop-blur-md px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-outline-variant/20 text-on-surface text-[10px] sm:text-xs font-medium flex items-center gap-1.5 shadow-lg whitespace-nowrap">
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-[16px] text-primary animate-pulse"
          >
            drag_pan
          </span>
          {v("hint")}
        </p>
      </div>
    </div>
  );
}
