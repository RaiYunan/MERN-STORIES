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

type SignUpDialogProps = {
  children: ReactNode,
  initialMode?: "signup" | "signin";
};

export function SignUpDialog({ children, initialMode = "signup" }: SignUpDialogProps) {
   const [mode, setMode] = useState<"signup" | "signin">(initialMode);
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

      <DialogContent className="sm:max-w-[40vw] max-w-[90vw] py-18 px-6">
        {mode === "signup" ? (
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
                className="w-full rounded-full h-11 sm:h-12 text-base font-normal"
              >
                <img src={Google} alt="google logo" className="mr-2 h-5 w-5" />
                Sign up with Google
              </Button>

              <Button
                variant="outline"
                className="w-full rounded-full h-11 sm:h-12 text-base font-normal"
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
                className="w-full rounded-full h-11 sm:h-12 text-base font-normal"
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
        ) : (
          <SignInContent onSwitchToSignUp={() => setMode("signup")} />
        )}
      </DialogContent>
    </Dialog>
  );
}
