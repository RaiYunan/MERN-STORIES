import { Link } from "react-router-dom";
import Logo from "../assets/images/logo-white.png";
import { Button } from "./ui/button";
import { SignUpDialog } from "./SignUpDialog";
import { useAppSelector } from "@/hooks/useSelector";
import type { RootState } from "@/app/store";
import { Menu } from "lucide-react";
import SearchBox from "./SearchBox";
import { SquarePen } from "lucide-react";
import userImage from "@/assets/images/default.jpg";

const TopBar = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  console.log("User status:", user);
  console.log("is User authenticated?:", isAuthenticated);
  return (
    <div className="max-w-full px-6 py-4 border-b border-black flex justify-between items-center">
      <div className="flex items-center gap-2">
        {user && isAuthenticated && <Menu className="cursor-pointer w-6 h-6" />}
        <Link to="/">
          <img
            src={Logo}
            width="160px"
            className="sm:w-[180px] cursor-pointer pt-1"
          />
        </Link>
        {user && isAuthenticated && <SearchBox />}
      </div>

      {user && isAuthenticated ? (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
            <SquarePen className="w-5 h-5" /> Write
          </div>
          <div>
            <img
              src={userImage}
              alt="User avatar"
              className="w-11 h-11 rounded-full object-cover cursor-pointer"
            />
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
