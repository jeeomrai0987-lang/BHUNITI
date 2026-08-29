import { Outlet } from "react-router-dom";
import CitizenNavbar from "../components/CitizenNavbar";
import CitizenFooter from "../components/CitizenFooter";

export default function CitizenLayout() {
  return (
    <div className="theme-dashboard bg-background font-body-md text-on-surface">
      <CitizenNavbar />
      <Outlet />
      <CitizenFooter />
    </div>
  );
}
