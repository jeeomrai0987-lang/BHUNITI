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
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden lg:block">
            <p className="text-label-md text-on-surface font-bold">
              Admin Officer
            </p>
            <p className="text-[10px] text-on-surface-variant uppercase">
              District Administration
            </p>
          </div>
          <img
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover border-2 border-surface-container-highest"
            src="https://lh3.googleusercontent.com/aida/AEtjO1U6o5SJhtUFoWr8mBSiJBZYY5leWMCGrZrwT62qXe5N3Y0lfh8UB0EIzmWZs1C8PUElDoqRNhERxjGGRhmksVn_bK9K4_f4-JQ21z1-FDIoR6jj6mihto4O6_cQIQo0QLJQNaKVimW10mFwZ_qUmU-XLWGcINPJ-7xvNSP48QMM35F3GyyzJF4hjPmxZnDqqWB4mAIhSIWQXUuHVRosdXnn-EeIE4CI499W7wwm-u8167g92sBlY7EwsQ"
          />
        </div>
      </div>
    </header>
  );
}
