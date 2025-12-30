import { Button } from "./ui/button";
import { Mail } from "lucide-react";
import GoogleLogin from "@/components/GoogleLogin";
import FacebookLogin from "@/components/FacebookLogin";

type SignInContentProps = {
  onSwitchToSignUp: () => void;
  onSwitchToSignInEmail: () => void;
};

const SignInContent = ({
  onSwitchToSignUp,
  onSwitchToSignInEmail,
}: SignInContentProps) => {
  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-serif text-center">
        Welcome back.
      </h2>

      <div className="flex flex-col gap-2.5 mt-6">
        <GoogleLogin isSignIn={true} />

        <FacebookLogin isSignIn={true} />

        <Button
          variant="outline"
          className="w-full rounded-full h-11 sm:h-12 text-base font-normal border border-black"
          onClick={() => onSwitchToSignInEmail()}
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
