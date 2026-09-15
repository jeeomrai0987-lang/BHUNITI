import { NavLink } from "react-router-dom";
import { ADMIN_ROUTES } from "../routes";
import logoImg from "../assets/logo.jpeg";
import PortalSwitcherDropdown from "./PortalSwitcherDropdown";
import { useI18n } from "../i18n";

const activeClasses =
  "flex items-center px-6 py-3 transition-colors bg-surface-container-highest/10 text-on-primary border-l-4 border-inverse-primary";
const inactiveClasses =
  "flex items-center px-6 py-3 text-body-md hover:bg-on-primary-fixed-variant/10 transition-colors";
const linkClass = ({ isActive }) => (isActive ? activeClasses : inactiveClasses);

// The original Stitch sidebar also included Discrepancy Cases, Field Surveys,
// Reports and Alerts entries that only ever linked to "#" (no page was ever
// built for them). They're kept here as plain, non-navigating items so the
// sidebar still looks/feels identical - only the six items that have a real
// page (per the brief) are wired up as routes. `to: null` marks the dead ones.
const NAV_ITEMS = [
  { key: "overview", icon: "dashboard", to: ADMIN_ROUTES.overview, end: true },
  { key: "districtGis", icon: "map", to: ADMIN_ROUTES.districtGis },
  { key: "tehsilAnalytics", icon: "analytics", to: ADMIN_ROUTES.tehsilAnalytics },
  { key: "reconciliationMonitor", icon: "sync_alt", to: ADMIN_ROUTES.reconciliationMonitor },
  { key: "mutationMonitor", icon: "history_edu", to: ADMIN_ROUTES.mutationMonitor },
  { key: "discrepancyCases", icon: "warning", to: null },
  { key: "fieldSurveys", icon: "explore", to: null },
  { key: "officerPerformance", icon: "trending_up", to: ADMIN_ROUTES.officerPerformance },
  { key: "addOfficer", icon: "person_add", to: ADMIN_ROUTES.addOfficer },
  { key: "reports", icon: "description", to: null },
  { key: "alerts", icon: "notifications_active", to: null },
  { key: "auditTrail", icon: "receipt_long", to: null },
];

export default function AdminSidebar() {
  const { t } = useI18n();

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-primary-container text-on-primary-container z-50 flex flex-col shadow-xl">
      <div className="p-6 border-b border-on-primary-fixed-variant/20">
        <PortalSwitcherDropdown align="left">
          <div className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img
              alt={t("common.app.name")}
              className="h-8 w-auto object-contain rounded-lg"
              src={logoImg}
            />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-on-primary-container/60">
                {t("components.footer.seal")}
              </span>
              <span className="text-headline-md font-bold text-on-primary flex items-center gap-1">
                {t("common.app.name")}
                <span className="material-symbols-outlined text-white/60 text-sm">
                  arrow_drop_down
                </span>
              </span>
            </div>
          </div>
        </PortalSwitcherDropdown>
      </div>

      <nav
        className="flex-1 py-4 overflow-y-auto"
        aria-label={t("common.a11y.portalNavigation")}
      >
        {NAV_ITEMS.map((item) =>
          item.to ? (
            <NavLink key={item.key} to={item.to} end={item.end} className={linkClass}>
              <span className="material-symbols-outlined mr-4">{item.icon}</span>
              {t(`components.adminNav.${item.key}`)}
            </NavLink>
          ) : (
            <a key={item.key} className={inactiveClasses} href="#">
              <span className="material-symbols-outlined mr-4">{item.icon}</span>
              {t(`components.adminNav.${item.key}`)}
            </a>
          )
        )}
      </nav>
    </aside>
  );
}
