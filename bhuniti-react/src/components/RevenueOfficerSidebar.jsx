import { NavLink } from "react-router-dom";
import { REVENUE_ROUTES } from "../routes";
import logo from "../assets/logo.jpeg";
import PortalSwitcherDropdown from "./PortalSwitcherDropdown";
import { useI18n } from "../i18n";

const activeClasses =
  "flex items-center px-6 py-3 transition-all gap-3 bg-surface-container/10 text-white border-l-4 border-inverse-primary";
const inactiveClasses =
  "flex items-center px-6 py-3 text-on-primary-fixed-variant hover:text-white transition-all gap-3";
const linkClass = ({ isActive }) => (isActive ? activeClasses : inactiveClasses);

// `key` indexes components.revenueNav in the catalogs.
const NAV_ITEMS = [
  { to: REVENUE_ROUTES.overview, end: true, icon: "dashboard", key: "overview" },
  { to: REVENUE_ROUTES.gisExplorer, icon: "map", key: "gisExplorer" },
  { to: REVENUE_ROUTES.dataReconciliation, icon: "rebase_edit", key: "dataReconciliation" },
  { to: REVENUE_ROUTES.mutationManagement, icon: "swap_horiz", key: "mutationManagement" },
  { to: REVENUE_ROUTES.discrepancyCases, icon: "warning", key: "discrepancyCases" },
  { to: REVENUE_ROUTES.historicalTimeline, icon: "history", key: "historicalTimeline" },
  { to: REVENUE_ROUTES.documentsEvidence, icon: "description", key: "documentsEvidence" },
  { to: REVENUE_ROUTES.fieldSurvey, icon: "architecture", key: "surveys" },
  { to: REVENUE_ROUTES.reportsAnalytics, icon: "analytics", key: "reportsAnalytics" },
  { to: REVENUE_ROUTES.auditTrail, icon: "receipt_long", key: "auditTrail" },
];

export default function RevenueOfficerSidebar() {
  const { t } = useI18n();

  return (
    <aside className="fixed left-0 top-0 h-full w-sidebar-width bg-primary-container text-on-primary-fixed z-50 flex flex-col">
      <div className="p-6 border-b border-on-primary-fixed-variant/20">
        <PortalSwitcherDropdown align="left">
          <div className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img
              alt={t("common.app.name")}
              className="h-8 w-auto object-contain rounded"
              src={logo}
            />
            <span className="font-headline-md text-white tracking-tight">
              {t("common.app.name")}
            </span>
            <span className="material-symbols-outlined text-white/60 text-sm">
              arrow_drop_down
            </span>
          </div>
        </PortalSwitcherDropdown>
      </div>

      <nav
        className="flex-1 py-4 overflow-y-auto"
        aria-label={t("common.a11y.portalNavigation")}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            <span className="material-symbols-outlined text-sm">{item.icon}</span>
            <span className="font-label-md">{t(`components.revenueNav.${item.key}`)}</span>
          </NavLink>
        ))}
        <a className={inactiveClasses} href="#">
          <span className="material-symbols-outlined text-sm">settings</span>
          <span className="font-label-md">{t("components.revenueNav.administration")}</span>
        </a>
      </nav>
    </aside>
  );
}
