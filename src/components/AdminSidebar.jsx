import { NavLink } from "react-router-dom";
import { ADMIN_ROUTES } from "../routes";

const activeClasses =
  "flex items-center px-6 py-3 transition-colors bg-surface-container-highest/10 text-on-primary border-l-4 border-inverse-primary";
const inactiveClasses =
  "flex items-center px-6 py-3 text-body-md hover:bg-on-primary-fixed-variant/10 transition-colors";
const linkClass = ({ isActive }) => (isActive ? activeClasses : inactiveClasses);

// The original Stitch sidebar also included Discrepancy Cases, Field Surveys,
// Reports and Alerts entries that only ever linked to "#" (no page was ever
// built for them). They're kept here as plain, non-navigating items so the
// sidebar still looks/feels identical - only the six items that have a real
// page (per the brief) are wired up as routes.
export default function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-primary-container text-on-primary-container z-50 flex flex-col shadow-xl">
      <div className="p-6 flex items-center gap-3 border-b border-on-primary-fixed-variant/20">
        <img
          alt="BHUNEXIS"
          className="h-8 w-auto object-contain"
          src="https://lh3.googleusercontent.com/aida/AEtjO1XSnvCAUNfbYhxXOfX_HEbcR5MI9eHRI79zFrcVZmV2MbcDPygj29eJK0Pg7ivJO_HaX1FnAl4hO_JwgPAYDRkQyA8plpJOLsV9ytivNKhdNl8btOvSBPP5dJjgO0b7KnE8wBLrrOP7Med-IdiuZt5-uBy72pcUNjifKhesqPjRS7QFSfmYJFltgTeGywZsRsLRaYHveY5S63LZM4a6pLzt6b38f0jujjV08bEBQefbqXlUvAM6zvyxag"
        />
        <div className="flex flex-col">
          <span className="text-label-md uppercase tracking-widest text-on-primary-container/60">
            Government of India
          </span>
          <span className="text-headline-md font-bold text-on-primary">
            BHUNEXIS
          </span>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <NavLink to={ADMIN_ROUTES.overview} end className={linkClass}>
          <span className="material-symbols-outlined mr-4">dashboard</span>
          Overview
        </NavLink>
        <NavLink to={ADMIN_ROUTES.districtGis} className={linkClass}>
          <span className="material-symbols-outlined mr-4">map</span>
          District GIS
        </NavLink>
        <NavLink to={ADMIN_ROUTES.tehsilAnalytics} className={linkClass}>
          <span className="material-symbols-outlined mr-4">analytics</span>
          Tehsil Analytics
        </NavLink>
        <NavLink to={ADMIN_ROUTES.reconciliationMonitor} className={linkClass}>
          <span className="material-symbols-outlined mr-4">sync_alt</span>
          Reconciliation Monitor
        </NavLink>
        <NavLink to={ADMIN_ROUTES.mutationMonitor} className={linkClass}>
          <span className="material-symbols-outlined mr-4">history_edu</span>
          Mutation Monitor
        </NavLink>
        <a className={inactiveClasses} href="#">
          <span className="material-symbols-outlined mr-4">warning</span>
          Discrepancy Cases
        </a>
        <a className={inactiveClasses} href="#">
          <span className="material-symbols-outlined mr-4">explore</span>
          Field Surveys
        </a>
        <NavLink to={ADMIN_ROUTES.officerPerformance} className={linkClass}>
          <span className="material-symbols-outlined mr-4">trending_up</span>
          Officer Performance
        </NavLink>
        <a className={inactiveClasses} href="#">
          <span className="material-symbols-outlined mr-4">description</span>
          Reports
        </a>
        <a className={inactiveClasses} href="#">
          <span className="material-symbols-outlined mr-4">
            notifications_active
          </span>
          Alerts
        </a>
        <a className={inactiveClasses} href="#">
          <span className="material-symbols-outlined mr-4">receipt_long</span>
          Audit Trail
        </a>
      </nav>
    </aside>
  );
}
