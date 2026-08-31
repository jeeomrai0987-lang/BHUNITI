import { Link, NavLink } from "react-router-dom";
import { MAIN_ROUTES } from "../routes";
import logoImg from "../assets/logo.jpeg";
import PortalSwitcherDropdown from "./PortalSwitcherDropdown";

const navLinkClass = ({ isActive }) =>
  isActive
    ? "text-primary border-b-2 border-primary pb-1 font-body-md text-body-md flex items-center h-16"
    : "text-body-md font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-16";

export default function MainNavbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-border-subtle shadow-sm">
      <div className="h-16 max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop flex items-center justify-between">
        <PortalSwitcherDropdown align="left">
          <div className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img
              alt="BHUNITI"
              className="h-9 w-auto object-contain rounded-lg shadow-sm"
              src={logoImg}
            />
            <span className="font-headline-md text-headline-md text-primary tracking-tight">
              BHUNITI
            </span>
            <span className="material-symbols-outlined text-primary/60 text-base">
              arrow_drop_down
            </span>
          </div>
        </PortalSwitcherDropdown>

        <nav className="hidden xl:flex items-center gap-8">
          <NavLink to={MAIN_ROUTES.home} end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to={MAIN_ROUTES.platform} className={navLinkClass}>
            Platform
          </NavLink>
          <NavLink to={MAIN_ROUTES.howItWorks} className={navLinkClass}>
            How It Works
          </NavLink>
          <NavLink to={MAIN_ROUTES.features} className={navLinkClass}>
            Features
          </NavLink>
          <NavLink to={MAIN_ROUTES.governance} className={navLinkClass}>
            Governance
          </NavLink>
          <NavLink to={MAIN_ROUTES.about} className={navLinkClass}>
            About
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <NavLink
            to={MAIN_ROUTES.login}
            className="px-6 py-2 bg-primary text-on-primary font-label-caps rounded-lg hover:bg-on-surface-variant transition-all shadow-sm"
          >
            Login
          </NavLink>
          <PortalSwitcherDropdown align="right">
            <div className="w-8 h-8 rounded-full bg-primary hover:bg-on-surface-variant flex items-center justify-center transition-colors shadow-sm">
              <span className="material-symbols-outlined text-on-primary text-[18px]">
                person
              </span>
            </div>
          </PortalSwitcherDropdown>
        </div>
      </div>
    </header>
  );
}

