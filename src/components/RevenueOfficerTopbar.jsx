export default function RevenueOfficerTopbar() {
  return (
    <header className="fixed top-0 left-sidebar-width right-0 h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center px-8 justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center bg-surface-container-low rounded-lg px-3 py-1.5 border border-outline-variant/30">
          <span className="material-symbols-outlined text-on-surface-variant mr-2">
            search
          </span>
          <input
            className="bg-transparent border-none focus:ring-0 text-body-sm w-full outline-none text-on-surface"
            placeholder="Search ULPIN / Survey No..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6 ml-6">
        <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center">
          <span className="material-symbols-outlined">help</span>
        </button>
        <button className="relative text-on-surface-variant hover:text-primary transition-colors flex items-center">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/30">
          <div className="text-right">
            <div className="text-body-sm font-bold text-on-surface">
              K. Sharma
            </div>
            <div className="text-label-md text-on-surface-variant">
              Revenue Officer
            </div>
          </div>
          <img
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd1s1Wu1tRFYDpD5AgM14jvOS6poBI6ti3L7SVZwOKrydYFChC--WxZKgkpMF6am3jPtdABaNZmkaJVMuY5ul-FEzN5Qw9rg_uhrfI3I0IUpuFd1ALoj4XnmwAoAAnJJ_VPIT2VxfwJzyV0qtuV8V2I1YXAb3hsL-_XhpnPIlKdII-KsfwGDODs7G5b50Y-O5o2uwlDQC7NrZPwanNKSmyODaGcyYjJkbWbS7vBDjByVkRoAHlS9I"
          />
        </div>
      </div>
    </header>
  );
}
