import { Button } from "./ui/button";
import Facebook from "@/assets/images/facebook.png";
import { facebookProvider } from "@/helpers/firebase";
import axios from "axios";
import { showToast } from "@/helpers/showToast";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { authSuccess } from "@/features/auth/authSlice";
import { oauthLogin } from "@/hooks/useOAuthLogin";

type FacebookLoginProps = {
  isSignIn: boolean;
};

const FacebookLogin = ({ isSignIn }: FacebookLoginProps) => {
  const dispatch = useAppDispatch();

  const handleFacebookLogin = async (): Promise<void> => {
    try {
      const user = await oauthLogin(facebookProvider);
      console.log("Facebook user:", user.email);
      
      const token = await user.getIdToken();

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/auth/oauth-login`,
        { token },
        { withCredentials: true }
      );

      const data = response.data;
      showToast("success", data.message || "Logged in successfully!");
      dispatch(authSuccess(data.data));
    } catch (error: any) {
      console.error("Facebook login error:", error);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full rounded-full h-11 sm:h-12 text-base font-normal border border-black"
      onClick={handleFacebookLogin}
    >
      <img src={Facebook} alt="facebook logo" className="mr-2 h-4 w-4" />
      {isSignIn ? "Sign in with Facebook" : "Sign up with Facebook"}
    </Button>
  );
};

export default FacebookLogin;