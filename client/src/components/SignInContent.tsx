import { Button } from "./ui/button";
import { Mail } from "lucide-react";
import Facebook from "@/assets/images/facebook.png";
import Google from "@/assets/images/google.jpg";

type SignInContentProps = {
  onSwitchToSignUp: () => void;
};

const SignInContent = ({ onSwitchToSignUp }: SignInContentProps) => {
  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-serif text-center">
        Welcome back.
      </h2>

      <div className="flex flex-col gap-2.5 mt-6">
        <Button
          variant="outline"
          className="w-full rounded-full h-11 sm:h-12 text-base font-normal"
        >
          <img src={Google} alt="google logo" className="mr-2 h-5 w-5" />
          Sign in with Google
        </Button>

        <Button
          variant="outline"
          className="w-full rounded-full h-11 sm:h-12 text-base font-normal"
        >
          <img src={Facebook} alt="facebook logo" className="mr-2 h-4 w-4" />
          Sign in with Facebook
        </Button>

        <Button
          variant="outline"
          className="w-full rounded-full h-11 sm:h-12 text-base font-normal"
        >
          <Mail className="mr-3 h-5 w-5" />
          Sign in with email
        </Button>
      </div>

      <div className="mt-5 space-y-3">
        <p className="text-center text-sm text-muted-foreground">
          No account?{" "}
          <button
            type="button"
            className="text-green-600 hover:text-green-700 font-medium underline"
            onClick={() => {
              onSwitchToSignUp();
            }}
          >
            Create one
          </button>
        </p>
      </div>
    </>
  );
};

export default SignInContent;
