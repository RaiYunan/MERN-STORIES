import { Link } from "react-router-dom";
import Logo from "../assets/images/logo-white.png";
import { Button } from "./ui/button";
import { SignUpDialog } from "../features/auth/components/SignUpDialog";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { RootState } from "@/app/store";
import { HelpCircle, LogOut, Menu, Settings, User } from "lucide-react";
import SearchBox from "./SearchBox";
import { SquarePen } from "lucide-react";
import userImage from "@/assets/images/default.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { showToast } from "@/helpers/showToast";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { logout } from "@/features/auth/authSlice";
import { persistor } from "@/app/store";
import { useSidebar } from "@/components/ui/sidebar";

const TopBar = () => {
  const { toggleSidebar } = useSidebar();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  console.log("User status:", user);
  console.log("is User authenticated?:", isAuthenticated);

  async function handleLogOut() {
    const url = `${import.meta.env.VITE_URL}/auth/logout`;
    try {
      const response = await axios.post(
        url,
        {},
        {
          withCredentials: true,
        }
      );

      console.log("Logout successful", response);
      showToast("success", "Signed out. See you next time!");
      dispatch(logout());
      await persistor.purge();
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Something went wrong. Try again.";

      showToast("error", msg);
    }
  }

  return (
    <div className="max-w-full px-6 py-4 border-b border-b-gray-400 flex justify-between items-center z-50 bg-white relative">
      <div className="flex items-center gap-2">
        {isAuthenticated && (
          <button
            onClick={toggleSidebar}
            className="cursor-pointer w-6 h-6 flex items-center justify-center"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <Link to="/">
          <img
            src={Logo}
            width="180px"
            className="sm:w-[190px] cursor-pointer pt-1 ml-3"
            alt="Logo"
          />
        </Link>
        {isAuthenticated && <SearchBox />}
      </div>

      {isAuthenticated ? (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
            <SquarePen className="w-5 h-5" /> Write
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative inline-block group">
                  <button
                    className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="User account menu"
                  >
                    {user ? (
                      <img
                        src={user.avatar || userImage}
                        alt="User avatar"
                        className="w-11 h-11 rounded-full object-cover hover:border-blue-500 transition-colors"
                      />
                    ) : (
                      <img
                        src={userImage}
                        alt="Default avatar"
                        className="w-11 h-11 rounded-full object-cover"
                      />
                    )}
                  </button>

                  <div
                    role="tooltip"
                    className="
      absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2
      px-3 py-2
      bg-gray-900 text-white text-sm font-medium
      rounded-lg shadow-lg
      whitespace-nowrap
      opacity-0 translate-y-1
      transition-all duration-200 ease-out
      group-hover:opacity-100 group-hover:translate-y-0
      pointer-events-none
      before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2
      before:border-4 before:border-transparent before:border-b-gray-900
    "
                  >
                    Account
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-64 rounded-lg shadow-md border border-gray-200 bg-white"
              >
                <div className="px-2 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative cursor-pointer">
                      <img
                        src={user?.avatar || userImage}
                        alt="User avatar"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email || ""}
                      </p>
                      <Link
                        to="/profile"
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block"
                      >
                        View profile
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <DropdownMenuItem
                    asChild
                    className="px-3 py-2.5 hover:bg-gray-50"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 w-full"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">Settings</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50">
                    <HelpCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">Help & Support</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer text-red-600 hover:bg-red-50"
                    onSelect={() => handleLogOut()}
                  >
                    <LogOut className="w-4 h-4" />
                    <div className="flex-1">
                      <p className="font-medium text-red-600">Sign out</p>
                      <p className="text-xs text-gray-500">
                        {user?.email || ""}
                      </p>
                    </div>
                  </DropdownMenuItem>
                </div>
                <div className="px-3 py-2 border-t border-gray-100 mt-1">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>v2.4.1</span>
                    <a href="#" className="hover:text-gray-700 hover:underline">
                      Privacy · Terms
                    </a>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        <div className=" flex gap-6 justify-center items-center text-sm">
          <div className="hidden md:flex cursor-pointer text-sm">Our Story</div>
          <div className="hidden md:flex cursor-pointer text-sm">Write</div>
          <SignUpDialog initialMode="signin">
            <div className="hidden md:flex cursor-pointer text-sm">Sign In</div>
          </SignUpDialog>

          <SignUpDialog>
            <Button className="rounded-2xl text-sm sm:text-sm">
              Get Started
            </Button>
          </SignUpDialog>
        </div>
      )}
    </div>
  );
};

export default TopBar;
