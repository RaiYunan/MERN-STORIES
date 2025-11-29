import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {  Mail } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import Facebook from "@/assets/images/facebook.png"
import Google from "@/assets/images/google.jpg"


type SignUpDialogProps={
    children:ReactNode,
}

export function SignUpDialog({ children }: SignUpDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-md rounded-2xl px-10 py-8">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl text-center font-semibold">
            Join Whisper.
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign up to start reading and writing.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-3">
          {/* Google */}
          <Button
            variant="outline"
            className="w-full justify-center rounded-full h-11 text-base"
          >
            <img src={Google} alt="google logo" className="mr-2 h-6 w-6" />
            Sign up with Google
          </Button>

          {/* Facebook */}
          <Button
            variant="outline"
            className="w-full justify-center rounded-full h-11 text-base"
          >
            <img src={Facebook} alt="facebook logo" className="mr-2 h-5 w-5"/>
            Sign up with Facebook
          </Button>

          {/* Email */}
          <Button
            variant="outline"
            className="w-full justify-center rounded-full h-11 text-base"
          >
            <Mail className="mr-2 h-5 w-5" />
            Sign up with email
          </Button>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button className="underline">Sign in</button>
        </p>
      </DialogContent>
    </Dialog>
  );
}