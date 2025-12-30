import { Outlet } from "react-router-dom";
import AppSideBar from "../components/AppSideBar";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";

const Layout = () => {
  const isUserLoggedIn = false;
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />

      <div className="flex flex-1">
        {isUserLoggedIn && <AppSideBar />}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
