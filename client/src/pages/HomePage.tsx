import { Button } from "../components/ui/button";
import HomeImage from "../assets/images/HomeImage.png";
import { SignUpDialog } from "../components/SignUpDialog";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { RootState } from "@/app/store";

const HomePage = () => {
  const user=useAppSelector((state:RootState)=>state.auth.user);
  const isAuthenticated=useAppSelector((state:RootState)=>state.auth.isAuthenticated);
  return (
    
    <>
    {(user && isAuthenticated)?<div>Content</div>:<div className="flex flex-col lg:flex-row min-h-[80vh] items-center justify-center">
      {/* Text Content */}
      <div className="w-full lg:w-[65%] px-6 sm:px-8 lg:px-16">
        <h1 className="text-6xl sm:text-4xl lg:text-7xl font-bold leading-tight sm:leading-tight lg:leading-tight font-serif">
          Echoes of Experience
        </h1>
        <p className="text-lg sm:text-lg lg:text-xl mt-8 sm:mt-10 lg:mt-14 text-gray-600 leading-relaxed max-w-2xl">
          A sanctuary for writers and readers alike. Pen your thoughts, 
          explore perspectives, and find meaning in every word.
        </p>
        <SignUpDialog>
          <Button className="rounded-2xl mt-8 sm:mt-10 lg:mt-14 text-lg px-6 py-6 bg-green-600 hover:bg-green-700">
          Begin Your Journey
        </Button>
        </SignUpDialog>
      </div>

      {/* Image - Hidden on mobile, 35% on desktop */}
      <div className="hidden lg:flex w-[35%] items-center justify-center"> 
        <img 
          src={HomeImage} 
          alt="Desktop illustration" 
          className="w-full h-auto max-h-[500px] object-contain"
        />
      </div>
    </div>}
    </>
    
  );
};

export default HomePage;