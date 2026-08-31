import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

export default function AdminLayout() {
  return (
    <div className="theme-dashboard bg-background font-body-md text-on-surface">
      <AdminSidebar />
      <div className="pl-[280px]">
        <AdminTopbar />
        <Outlet />
      </div>
    </div>
  );
}
