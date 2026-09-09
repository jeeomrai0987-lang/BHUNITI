import { NavLink } from "react-router-dom";
import { CITIZEN_ROUTES } from "../routes";
import logoImg from "../assets/logo.jpeg";
import PortalSwitcherDropdown from "./PortalSwitcherDropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "../i18n";

const navLinkClass = ({ isActive }) =>
  isActive
    ? "flex items-center px-6 py-3 transition-all gap-3 bg-surface-container/10 text-black border-l-4 border-inverse-primary"
    : "text-body-md font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-16";

export default function CitizenNavbar() {
  const { t } = useI18n();

  const links = [
    { to: CITIZEN_ROUTES.portal, end: true, key: "portal" },
    { to: CITIZEN_ROUTES.searchRecords, key: "searchRecords" },
    { to: CITIZEN_ROUTES.myApplications, key: "myApplications" },
    { to: CITIZEN_ROUTES.landServices, key: "landServices" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop flex items-center justify-between">
        <PortalSwitcherDropdown align="left">
          <div className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img
              alt={t("common.app.name")}
              className="h-9 w-auto object-contain rounded-lg shadow-sm"
              src={logoImg}
            />
            <span className="font-headline-md text-headline-md text-primary tracking-tight hidden sm:block">
              {t("common.app.name")}
            </span>
            <span className="material-symbols-outlined text-primary/60 text-base">
              arrow_drop_down
            </span>
          </div>
        </PortalSwitcherDropdown>

        <nav
          className="hidden lg:flex items-center gap-8 h-full"
          aria-label={t("common.a11y.portalNavigation")}
        >
          {links.map((link) => (
            <NavLink key={link.key} to={link.to} end={link.end} className={navLinkClass}>
              {t(`components.citizenNav.${link.key}`)}
            </NavLink>
          ))}
          <a
            className="text-body-md font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-16"
            href="#"
          >
            {t("components.citizenNav.helpSupport")}
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button
            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
            aria-label={t("common.a11y.notifications")}
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <PortalSwitcherDropdown align="right">
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant hover:opacity-90 transition-opacity">
              <div className="hidden md:block text-right">
                <p className="text-label-md font-label-md text-on-surface font-semibold">
                  {t("components.user.citizen")}
                </p>
                <p className="text-[10px] text-on-surface-variant uppercase">
                  {t("components.topbar.citizenId", { id: "29481-C" })}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-on-primary text-[18px]">
                  person
                </span>
              </div>
            </div>
          </PortalSwitcherDropdown>
        </div>
      </div>
    </header>
  );
}
