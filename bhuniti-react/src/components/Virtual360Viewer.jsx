import { useState, useRef, useEffect } from "react";

export default function Virtual360Viewer({ parcel, onClose }) {
  const [viewMode, setViewMode] = useState("ground"); // "ground" | "drone" | "thermal"
  const [yaw, setYaw] = useState(0); // Horizontal angle 0 - 360
  const [pitch, setPitch] = useState(0); // Vertical angle -45 to 45
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);

  // Panorama Imagery assets based on parcel and view mode
  const panoramas = {
    ground: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2400",
    drone: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2400",
    thermal: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=2400"
  };

  // Hotspots representing survey waypoints and boundary pins
  const hotspots = [
    {
      id: "boundary-north",
      name: "North Boundary Marker (Pillar N-1)",
      yaw: 35,
      pitch: -5,
      type: "pillar",
      info: "DGPS Benchmark Pillar. Elevation: 218.4m AMSL. Coordinate: 28.8368° N, 77.5832° E"
    },
    {
      id: "dispute-marker",
      name: parcel?.is_disputed ? "Disputed Overlap Zone" : "Sub-division Boundary",
      yaw: 160,
      pitch: -8,
      type: parcel?.is_disputed ? "warning" : "info",
      info: parcel?.dispute_reason || "Verified boundary aligned with Cadastral map 1984"
    },
    {
      id: "road-access",
      name: "Road Frontage (18m Wide)",
      yaw: 280,
      pitch: -12,
      type: "access",
      info: "State Highway 57 connecting corridor. Clear RoW verified."
    }
  ];

  // Mouse Drag / Pan Interaction
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setAutoRotate(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setYaw((prev) => (prev - deltaX * 0.3 + 360) % 360);
    setPitch((prev) => Math.max(-40, Math.min(40, prev + deltaY * 0.2)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Screen Drag Interaction (Mobile & Tablets)
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setAutoRotate(false);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;
    setYaw((prev) => (prev - deltaX * 0.4 + 360) % 360);
    setPitch((prev) => Math.max(-40, Math.min(40, prev + deltaY * 0.3)));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Auto rotation effect
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setYaw((prev) => (prev + 0.15) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate]);

  return (
    <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-2 sm:p-4 md:p-6 select-none animate-fadeIn">
      {/* Responsive Top Header Bar */}
      <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-3 bg-surface-container/90 backdrop-blur-md px-4 sm:px-6 py-3 rounded-2xl border border-outline-variant/30 text-on-surface mb-2 sm:mb-3 shadow-xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md shrink-0">
            <span className="material-symbols-outlined text-[20px] sm:text-[24px]">360</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm sm:text-base text-on-surface truncate">360° Ground Inspection</span>
              <span className="hidden sm:inline-block bg-primary/10 text-primary text-[10px] font-label-md px-2 py-0.5 rounded-full uppercase font-semibold">
                Live Ground Truth
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-on-surface-variant truncate">
              ULPIN: <strong className="text-primary">{parcel?.ulpin || "09-XXXX-XXXX-1024"}</strong> • {parcel?.owner_name || "Rahul Sharma"}
            </p>
          </div>
        </div>

        {/* View Mode Switcher (Responsive) */}
        <div className="flex items-center gap-1 sm:gap-2 bg-surface-container-highest/80 p-1 rounded-xl border border-outline-variant/20">
          <button
            onClick={() => setViewMode("ground")}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-label-md transition-all flex items-center gap-1 ${
              viewMode === "ground" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person_pin_circle</span> Ground
          </button>
          <button
            onClick={() => setViewMode("drone")}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-label-md transition-all flex items-center gap-1 ${
              viewMode === "drone" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">flight</span> Drone
          </button>
          <button
            onClick={() => setViewMode("thermal")}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-label-md transition-all flex items-center gap-1 ${
              viewMode === "thermal" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">layers</span> Cadastral
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface-container-high hover:bg-error hover:text-white transition-colors flex items-center justify-center text-on-surface shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* 360 Panorama Viewport Container with Touch & Mouse Events */}
      <div
        className="w-full max-w-6xl flex-1 bg-surface-container-lowest rounded-2xl sm:rounded-3xl overflow-hidden relative cursor-grab active:cursor-grabbing shadow-2xl border border-outline-variant/30 flex items-center justify-center touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Dynamic Cylindrical Panorama Background Projection */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-75"
          style={{
            backgroundImage: `url(${panoramas[viewMode]})`,
            backgroundPosition: `${(yaw / 360) * 100}% ${50 + pitch * 0.8}%`,
            transform: `scale(${zoom})`,
            filter: viewMode === "thermal" ? "hue-rotate(180deg) contrast(120%)" : "none"
          }}
        />

        {/* Dynamic Hotspots rendered at relative angles */}
        {hotspots.map((h) => {
          let angleDiff = (h.yaw - yaw + 360) % 360;
          if (angleDiff > 180) angleDiff -= 360;
          const isVisible = Math.abs(angleDiff) < 70;
          const leftPercent = 50 + (angleDiff / 70) * 45;
          const topPercent = 50 - (h.pitch - pitch) * 1.5;

          if (!isVisible) return null;

          return (
            <div
              key={h.id}
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(h);
              }}
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 animate-bounce ${
                  h.type === "warning"
                    ? "bg-error text-on-error ring-4 ring-error/30"
                    : h.type === "pillar"
                    ? "bg-primary text-on-primary ring-4 ring-primary/30"
                    : "bg-secondary text-on-secondary ring-4 ring-secondary/30"
                }`}
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                  {h.type === "warning" ? "warning" : h.type === "pillar" ? "flag" : "navigation"}
                </span>
              </div>
              <div className="hidden sm:block absolute top-12 left-1/2 -translate-x-1/2 bg-surface/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-xl text-on-surface text-[11px] font-semibold whitespace-nowrap border border-outline-variant/30 pointer-events-none opacity-90 group-hover:opacity-100">
                {h.name}
              </div>
            </div>
          );
        })}

        {/* Hotspot Info Popup Card */}
        {activeHotspot && (
          <div className="absolute bottom-16 sm:bottom-20 left-4 sm:left-6 right-4 sm:right-auto z-40 bg-surface/95 backdrop-blur-xl border border-outline-variant/30 p-4 sm:p-5 rounded-2xl shadow-2xl max-w-sm animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs sm:text-sm text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                {activeHotspot.name}
              </span>
              <button onClick={() => setActiveHotspot(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">{activeHotspot.info}</p>
          </div>
        )}

        {/* Virtual Horizon / Compass HUD Overlay */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 bg-surface/85 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border border-outline-variant/20 text-on-surface flex items-center gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-primary flex items-center justify-center text-primary font-bold text-[10px] sm:text-xs transition-transform duration-75"
              style={{ transform: `rotate(${-yaw}deg)` }}
            >
              N
            </div>
            <div>
              <p className="text-[9px] font-label-md uppercase tracking-wider text-on-surface-variant">Heading</p>
              <p className="text-[11px] sm:text-xs font-bold font-tabular-nums">{Math.round(yaw)}° {yaw > 315 || yaw <= 45 ? "N" : yaw <= 135 ? "E" : yaw <= 225 ? "S" : "W"}</p>
            </div>
          </div>
          <div className="hidden sm:block h-6 w-px bg-outline-variant/30" />
          <div className="hidden sm:block">
            <p className="text-[9px] font-label-md uppercase tracking-wider text-on-surface-variant">Centroid</p>
            <p className="text-xs font-bold font-tabular-nums">{parcel?.centroid_lat || 28.8354}° N, {parcel?.centroid_lng || 77.5843}° E</p>
          </div>
        </div>

        {/* Viewport Control Tools (Right Side) */}
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6 z-30 flex flex-col gap-1.5 bg-surface/85 backdrop-blur-md p-1.5 rounded-xl sm:rounded-2xl border border-outline-variant/20 shadow-lg">
          <button
            onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
            className="w-8 h-8 rounded-lg sm:rounded-xl hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.8, z - 0.15))}
            className="w-8 h-8 rounded-lg sm:rounded-xl hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <div className="w-full h-px bg-outline-variant/20 my-0.5" />
          <button
            onClick={() => setAutoRotate((r) => !r)}
            className={`w-8 h-8 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors ${
              autoRotate ? "bg-primary text-on-primary" : "hover:bg-surface-container-high text-on-surface"
            }`}
            title="Toggle 360° Auto-Rotation"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
          </button>
          <button
            onClick={() => {
              setYaw(0);
              setPitch(0);
              setZoom(1);
            }}
            className="w-8 h-8 rounded-lg sm:rounded-xl hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors"
            title="Reset View"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          </button>
        </div>

        {/* Instruction Footer Banner */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 bg-surface/85 backdrop-blur-md px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-outline-variant/20 text-on-surface text-[10px] sm:text-xs font-medium flex items-center gap-1.5 shadow-lg whitespace-nowrap">
          <span className="material-symbols-outlined text-[16px] text-primary animate-pulse">drag_pan</span>
          Drag or swipe to look 360° • Tap pins for ground metrics
        </div>
      </div>
    </div>
  );
}
