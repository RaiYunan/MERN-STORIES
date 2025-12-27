import { Button } from "./ui/button";
import { Mail } from "lucide-react";
import Facebook from "@/assets/images/facebook.png";
import Google from "@/assets/images/google.jpg";
import { signInWithPopup } from "firebase/auth";
import { auth, facebookProvider, googleProvider } from "@/helpers/firebase";
import axios from "axios";
import { showToast } from "@/helpers/showToast";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { authSuccess } from "@/features/auth/authSlice";

type SignInContentProps = {
  onSwitchToSignUp: () => void;
  onSwitchToSignInEmail: () => void;
};

const SignInContent = ({
  onSwitchToSignUp,
  onSwitchToSignInEmail,
}: SignInContentProps) => {
  const dispatch = useAppDispatch();

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const bodyData = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      };

      const url = `${import.meta.env.VITE_URL}/auth/google-login`;
      const response = await axios.post(url, bodyData, {
        withCredentials: true,
      });
      const data = response.data;
      console.log(data.data);
      showToast("success", data.message || "User logged in");
      dispatch(authSuccess(data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleFacebookLogin = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      console.log("result", result);
      console.log("user", user);
      const token = await user.getIdToken();
      console.log(token);

    const url=`${import.meta.env.VITE_URL}/auth/facebook-login`;
    const response=await axios.post(url,{
      token:token
    },{
      withCredentials:true
    })

    const data=response.data;
    console.log(data);
    showToast("success",data.message);
    dispatch(authSuccess(data.data))
    } catch (error) {
      console.log(error);
      showToast("error","Somwthing went wrong.")
    }
  };
  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-serif text-center">
        Welcome back.
      </h2>

      <div className="flex flex-col gap-2.5 mt-6">
        <Button
          variant="outline"
          className="w-full rounded-full h-11 sm:h-12 text-base font-normal border border-black"
          onClick={handleGoogleLogin}
        >
          <img src={Google} alt="google logo" className="mr-2 h-5 w-5" />
          Sign in with Google
        </Button>

        <Button
          variant="outline"
          className="w-full rounded-full h-11 sm:h-12 text-base font-normal border border-black"
          onClick={handleFacebookLogin}
        >
          <img src={Facebook} alt="facebook logo" className="mr-2 h-4 w-4" />
          Sign in with Facebook
        </Button>

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
