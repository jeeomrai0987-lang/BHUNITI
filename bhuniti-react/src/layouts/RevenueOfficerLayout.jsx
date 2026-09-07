import { Outlet } from "react-router-dom";
import RevenueOfficerSidebar from "../components/RevenueOfficerSidebar";
import RevenueOfficerTopbar from "../components/RevenueOfficerTopbar";

export default function RevenueOfficerLayout() {
  return (
    <div className="theme-dashboard bg-background font-body-md text-on-surface">
      <RevenueOfficerSidebar />
      <div className="pl-sidebar-width">
        <RevenueOfficerTopbar />
        <Outlet />
      </div>
    </div>
  );
}
