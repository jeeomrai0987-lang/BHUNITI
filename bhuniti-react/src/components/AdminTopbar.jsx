import PortalSwitcherDropdown from "./PortalSwitcherDropdown";
import logoImg from "../assets/logo.jpeg";

export default function AdminTopbar() {
  return (
    <header className="fixed top-0 left-[280px] right-0 h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant z-40 flex items-center justify-between px-8">
      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center bg-surface-container text-on-surface px-3 py-1.5 rounded-lg border border-outline-variant">
          <span className="material-symbols-outlined mr-2 text-primary">
            location_on
          </span>
          <span className="font-label-md">DISTRICT: GHAZIABAD</span>
          <span className="material-symbols-outlined ml-2 text-on-surface-variant cursor-pointer">
            arrow_drop_down
          </span>
        </div>
        <div className="flex items-center bg-surface-container-low border border-outline-variant rounded-full px-4 py-1.5 w-full max-w-md">
          <span className="material-symbols-outlined text-on-surface-variant mr-2">
            search
          </span>
          <input
            className="bg-transparent border-none outline-none text-body-sm w-full placeholder-on-surface-variant"
            placeholder="Search ULPIN / Survey No..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 pl-6 border-l border-outline-variant">
        <button className="relative p-2 hover:bg-surface-container rounded-full text-on-surface-variant">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <PortalSwitcherDropdown align="right">
          <div className="flex items-center gap-3 pl-2 hover:opacity-90 transition-opacity">
            <div className="text-right hidden lg:block">
              <p className="text-label-md text-on-surface font-bold">
                Admin Officer
              </p>
              <p className="text-[10px] text-on-surface-variant uppercase">
                District Administration • Switch
              </p>
            </div>
            <img
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border-2 border-primary/20 shadow-sm"
              src={logoImg}
            />
          </div>
        </PortalSwitcherDropdown>
      </div>
    </header>
  );
}

