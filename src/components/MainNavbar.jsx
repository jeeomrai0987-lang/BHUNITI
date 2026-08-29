import { NavLink } from "react-router-dom";
import { MAIN_ROUTES } from "../routes";

const navLinkClass = ({ isActive }) =>
  isActive
    ? "transition-colors text-primary font-semibold"
    : "font-body-md text-on-surface-variant hover:text-primary transition-colors";

export default function MainNavbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface-white/90 backdrop-blur-md border-b border-border-subtle">
      <div className="h-20 max-w-[1440px] mx-auto px-margin-desktop flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            alt="BHUNITI logo"
            className="h-10 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XSnvCAUNfbYhxXOfX_HEbcR5MI9eHRI79zFrcVZmV2MbcDPygj29eJK0Pg7ivJO_HaX1FnAl4hO_JwgPAYDRkQyA8plpJOLsV9ytivNKhdNl8btOvSBPP5dJjgO0b7KnE8wBLrrOP7Med-IdiuZt5-uBy72pcUNjifKhesqPjRS7QFSfmYJFltgTeGywZsRsLRaYHveY5S63LZM4a6pLzt6b38f0jujjV08bEBQefbqXlUvAM6zvyxag"
          />
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-primary tracking-tight">
              BHUNITI
            </span>
            <span className="font-label-caps text-[10px] uppercase text-on-surface-variant leading-none">
              Connecting Land, Data &amp; Governance
            </span>
          </div>
        </div>

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
            className="px-6 py-2 bg-primary text-on-primary font-label-caps rounded-lg hover:bg-on-surface-variant transition-all"
          >
            Login
          </NavLink>
          <div className="ml-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
