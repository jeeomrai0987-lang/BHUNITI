import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MAIN_ROUTES, CITIZEN_ROUTES, REVENUE_ROUTES, ADMIN_ROUTES } from "../routes";
import { useI18n } from "../i18n";

export default function PortalSwitcherDropdown({ children, align = "left" }) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close dropdown on outside click or Esc
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Close dropdown when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // `key` indexes components.portalSwitcher in the catalogs; `badge` indexes
  // components.portalSwitcher.badge.
  const PORTALS = [
    {
      key: "citizen",
      path: `${MAIN_ROUTES.login}?role=citizen`,
      icon: "person",
      badge: "authRequired",
      badgeColor: "bg-primary-fixed text-primary",
      active: location.pathname.startsWith(CITIZEN_ROUTES.portal),
    },
    {
      key: "revenue",
      path: `${MAIN_ROUTES.login}?role=revenue_officer`,
      icon: "account_balance",
      badge: "authRequired",
      badgeColor: "bg-secondary-fixed text-on-secondary-fixed",
      active: location.pathname.startsWith(REVENUE_ROUTES.overview),
    },
    {
      key: "admin",
      path: `${MAIN_ROUTES.login}?role=district_officer`,
      icon: "admin_panel_settings",
      badge: "authRequired",
      badgeColor: "bg-tertiary-fixed text-on-tertiary-fixed",
      active: location.pathname.startsWith(ADMIN_ROUTES.overview),
    },
    {
      key: "publicSite",
      path: MAIN_ROUTES.home,
      icon: "home",
      badge: "public",
      badgeColor: "bg-surface-container-high text-on-surface",
      active:
        location.pathname === MAIN_ROUTES.home ||
        location.pathname === MAIN_ROUTES.platform ||
        location.pathname === MAIN_ROUTES.features ||
        location.pathname === MAIN_ROUTES.about,
    },
    {
      key: "login",
      path: MAIN_ROUTES.login,
      icon: "login",
      badge: "authScreen",
      badgeColor: "bg-primary text-on-primary",
      active: location.pathname === MAIN_ROUTES.login,
    },
  ];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Clickable Trigger Wrapper */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="cursor-pointer select-none"
        title={t("components.portalSwitcher.trigger")}
        aria-label={t("common.portals.switchPortal")}
        aria-expanded={isOpen}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 w-80 sm:w-96 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-2xl z-[999] overflow-hidden ${
            align === "right" ? "right-0" : "left-0"
          }`}
          style={{ transformOrigin: align === "right" ? "top right" : "top left" }}
        >
          {/* Header */}
          <div className="p-4 bg-primary text-on-primary flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-primary-fixed">
                swap_horiz
              </span>
              <div>
                <h4 className="font-headline-md text-sm font-bold text-white">
                  {t("components.portalSwitcher.heading")}
                </h4>
                <p className="text-[11px] text-primary-fixed/80">
                  {t("components.portalSwitcher.subheading")}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label={t("common.a11y.closeDialog")}
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          {/* Portals List */}
          <div className="p-2 space-y-1 max-h-[380px] overflow-y-auto bg-surface">
            {PORTALS.map((portal) => (
              <Link
                key={portal.key}
                to={portal.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                  portal.active
                    ? "bg-primary-fixed/30 border border-primary/30"
                    : "hover:bg-surface-container-low border border-transparent"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    portal.active
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {portal.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-label-md text-body-sm font-semibold text-on-surface truncate">
                      {t(`components.portalSwitcher.${portal.key}.name`)}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-label-md font-semibold flex-shrink-0 ${portal.badgeColor}`}
                    >
                      {t(`components.portalSwitcher.badge.${portal.badge}`)}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant line-clamp-1">
                    {t(`components.portalSwitcher.${portal.key}.desc`)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Login Action Footer */}
          <div className="p-3 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between">
            <span className="text-[11px] text-on-surface-variant font-medium">
              {t("components.portalSwitcher.footerNote")}
            </span>
            <Link
              to={MAIN_ROUTES.login}
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>{t("components.portalSwitcher.goToLogin")}</span>
              <span className="material-symbols-outlined text-[14px]">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
