import { NavLink } from "react-router-dom";
import { CITIZEN_ROUTES } from "../routes";

const navLinkClass = ({ isActive }) =>
  isActive
    ? "flex items-center px-6 py-3 transition-all gap-3 bg-surface-container/10 text-black border-l-4 border-inverse-primary"
    : "text-body-md font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-16";

export default function CitizenNavbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            alt="BHUNEXIS - minimalist logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_KfiqkQN4LB4a_Ey73C_HLSkkLLt6nj5i0__eqvDjlAUqCh3F3Ef1WLm_PU0arJ-8AhHYPRg40o6s8W-DlAKH786mQRT1bbJcWK0Y0tXVOihv6O1QWbVtl-XP1MMouogAlkKHmVt7N53yDgoxya4GznBVlHP3B3SQmb48q4WUEg99NpjG_FXQfpJDaJyVKEOYp28k5vE2tRpa3mjddM5q2EklVCPa-bl1wK-wU4JhM-3qQjwgIrk"
          />
          <span className="font-headline-md text-headline-md text-primary tracking-tight hidden sm:block">
            BHUNEXIS
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-8 h-full">
          <NavLink to={CITIZEN_ROUTES.portal} end className={navLinkClass}>
            Citizen Portal
          </NavLink>
          <NavLink to={CITIZEN_ROUTES.searchRecords} className={navLinkClass}>
            Search Records
          </NavLink>
          <NavLink to={CITIZEN_ROUTES.myApplications} className={navLinkClass}>
            My Applications
          </NavLink>
          <NavLink to={CITIZEN_ROUTES.landServices} className={navLinkClass}>
            Land Services
          </NavLink>
          <a
            className="text-body-md font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-16"
            href="#"
          >
            Help &amp; Support
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
            <div className="hidden md:block text-right">
              <p className="text-label-md font-label-md text-on-surface">
                Citizen User
              </p>
              <p className="text-[10px] text-on-surface-variant uppercase">
                ID: 29481-C
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">
                person
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
