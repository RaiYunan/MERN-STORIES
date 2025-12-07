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
import Facebook from "@/assets/images/facebook.png";
import Google from "@/assets/images/google.jpg";
import SignInContent from "./SignInContent";
import SignUpEmailContent from "./SignUpEmailContent";
import SignInEmailContent from "./SignInEmailContent";

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
                <Button
                  variant="outline"
                  className="w-full rounded-full h-11 sm:h-12 text-base font-normal border-black border"
                >
                  <img
                    src={Google}
                    alt="google logo"
                    className="mr-2 h-5 w-5"
                  />
                  Sign up with Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full rounded-full h-11 sm:h-12 text-base font-normal border border-black"
                >
                  <img
                    src={Facebook}
                    alt="facebook logo"
                    className="mr-2 h-4 w-4"
                  />
                  Sign up with Facebook
                </Button>

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
            />
          )}

          {/*SignIn with email dilaog */}
          {mode === "signin-email" && (
            <SignInEmailContent onSwitchToSignIn={() => setMode("signin")} />
          )}
        
      </DialogContent>
    </Dialog>
  );
}
