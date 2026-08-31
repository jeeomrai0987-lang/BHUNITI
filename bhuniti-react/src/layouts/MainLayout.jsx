import { Outlet } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";
import MainFooter from "../components/MainFooter";

export default function MainLayout() {
  return (
    // theme-main scopes every Tailwind color/font-size variable to the
    // marketing-site palette extracted from the original Stitch config
    <div className="theme-main bg-background font-body-md text-on-surface">
      <MainNavbar />
      <Outlet />
      <MainFooter />
    </div>
  );
}
