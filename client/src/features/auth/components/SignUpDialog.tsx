import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import SignInContent from "./SignInContent";
import SignUpEmailContent from "../../../components/SignUpEmailContent";
import SignInEmailContent from "../../../components/SignInEmailContent";
import GoogleLogin from "./GoogleLogin";
import FacebookLogin from "./FacebookLogin";

type SignUpDialogProps = {
  children: ReactNode;
  initialMode?: "signup" | "signin";
};

type Mode = "signup" | "signin" | "signup-email" | "signin-email";
export function SignUpDialog({
  children,
  initialMode = "signup",
}: SignUpDialogProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [open, setOpen] = useState(false);

  const handleAuthSuccess=()=>{
    setOpen(false);
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setMode(initialMode);
        }
        setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="
    max-w-[90vw] max-h-[85vh] overflow-hidden flex flex-col
    sm:max-w-[50vw] sm:max-h-[95vh] rounded-lg py-10 px-6 sm:px-30
  "
      >
       
          {/* //SignUp Dialog */}
          {mode === "signup" && (
            <>
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-2xl sm:text-3xl text-center font-serif">
                  Join Whisper.
                </DialogTitle>
                <DialogDescription className="text-center text-sm sm:text-base">
                  Sign up to start reading and writing.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-2.5">
                <GoogleLogin isSignIn={false}/>
                <FacebookLogin isSignIn={false}/>

                <Button
                  variant="outline"
                  className="w-full rounded-full h-11 sm:h-12 text-base font-normal border border-black"
                  onClick={() => setMode("signup-email")}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Sign up with email
                </Button>
              </div>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-green-600 hover:text-green-700 font-medium underline"
                  onClick={() => setMode("signin")}
                >
                  Sign in
                </button>
              </p>
            </>
          )}

          {/* SignIn Dialog */}
          {mode === "signin" && (
            <SignInContent
              onSwitchToSignUp={() => setMode("signup")}
              onSwitchToSignInEmail={() => setMode("signin-email")}
            />
          )}

          {/*SignUp with email dialog */}
          {mode === "signup-email" && (
            <SignUpEmailContent
              onSwitchToSignUp={() => setMode("signup")}
              onSwitchToSignIn={() => setMode("signin")}
              onSwitchToSignInEmail={()=>setMode("signin-email")}
            />
          )}

          {/*SignIn with email dilaog */}
          {mode === "signin-email" && (
            <SignInEmailContent onSwitchToSignIn={() => setMode("signin")} closeDialog={handleAuthSuccess} />
          )}
        
      </DialogContent>
    </Dialog>
  );
}
