import { Outlet } from "react-router-dom";
import AppSideBar from "../components/AppSideBar";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = () => {
  const isUserLoggedIn = true; // replace with Redux later

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full" >
        <TopBar />

        <div className="flex flex-1 relative">
          {isUserLoggedIn && <AppSideBar />}
          
          <div className="flex-1 flex flex-col">
            <main className="flex-1 px-6 py-4">
              <Outlet />
            </main>
            
            
            {!isUserLoggedIn && (
              <div className="mt-auto">
                <Footer />
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;