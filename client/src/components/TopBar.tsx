import Logo from "../assets/images/logo-white.png";
import { Button } from "./ui/button";

const TopBar = () => {
  return (
    <div className="max-w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-5 border-b border-black flex justify-between items-center">
      <div>
        <img src={Logo} width="160px" className="sm:w-[200px]" />
      </div>

      {/* Desktop Navigation - hidden on mobile */}
      <div className=" flex gap-6 justify-center items-center">
        <div className="hidden md:flex">Our Story</div>
        <div className="hidden md:flex">Write</div>
        <div className="hidden md:flex">Sign In</div>
      
        <Button className="rounded-xl text-sm sm:text-sm">Get Started</Button>
      </div>
    </div>
  );
};

export default TopBar;