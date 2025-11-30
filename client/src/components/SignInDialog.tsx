import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ReactNode } from "react";
import { Button } from "./ui/button";
import { Mail } from "lucide-react";
import Facebook from "@/assets/images/facebook.png"
import Google from "@/assets/images/google.jpg"


type SignInDialogProps = {
  children: ReactNode;
};

const SignInDialog = ({ children }: SignInDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md py-10">
        <DialogHeader>
          <DialogTitle className="text-3xl font-serif text-center">
            Welcome back.
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          <Button
            variant="outline"
            className="w-full rounded-full h-12 text-base font-normal"
          >
           <img src={Google} alt="facebook logo" className="mr-2 h-5 w-5"/>
            Sign in with Google
          </Button>

          <Button
            variant="outline"
            className="w-full rounded-full h-12 text-base font-normal"
          >
             <img src={Facebook} alt="facebook logo" className="mr-2 h-4 w-4"/>
            Sign in with Facebook
          </Button>

          <Button
            variant="outline"
            className="w-full rounded-full h-12 text-base font-normal"
          >
            <Mail className="mr-3 h-5 w-5" />
            Sign in with email
          </Button>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <button className="text-green-600 hover:text-green-700 font-medium underline">
              Create one
            </button>
          </p>
        
        </div>

     
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;