import { Link } from "react-router-dom";
import Logo from "../assets/images/logo-white.png";
import { Button } from "./ui/button";
import { SignUpDialog } from "./SignUpDialog";

const TopBar = () => {
  return (
    <div className="max-w-full px-4 sm:px-6 lg:px-16 py-4 border-b border-black flex justify-between items-center">
      <div >
        <Link to="/"> 
        <img src={Logo} width="160px" className="sm:w-[200px] cursor-pointer" />
        </Link>
      </div>

      <div className=" flex gap-6 justify-center items-center text-sm">
        <div className="hidden md:flex cursor-pointer text-sm">Our Story</div>
        <div className="hidden md:flex cursor-pointer text-sm">Write</div>
        <div className="hidden md:flex cursor-pointer text-sm">Sign In</div>

        <SignUpDialog>
          <Button className="rounded-2xl text-sm sm:text-sm">Get Started</Button>
        </SignUpDialog>
      </div>
    </div>
  );
};

export default TopBar;
