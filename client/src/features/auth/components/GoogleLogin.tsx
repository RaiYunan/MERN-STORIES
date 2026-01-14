import { Button } from "./ui/button";
import Google from "@/assets/images/google.jpg";
import { googleProvider } from "@/helpers/firebase";
import axios from "axios";
import { showToast } from "@/helpers/showToast";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { authSuccess } from "@/features/auth/authSlice";
import { oauthLogin } from "@/hooks/useOAuthLogin";

type GoogleLoginProps = {
  isSignIn: boolean;
};

const GoogleLogin = ({ isSignIn }: GoogleLoginProps) => {
  const dispatch = useAppDispatch();

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      const user = await oauthLogin(googleProvider);
      console.log("Google user:", user.email);

      const token = await user.getIdToken();

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/auth/oauth-login`,
        { token },
        { withCredentials: true }
      );

      const data = response.data;
      showToast("success", "Signed in with Google!");
      dispatch(authSuccess(data.data));
    } catch (error: any) {
      console.error("Google login error:", error);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full rounded-full h-11 sm:h-12 text-base font-normal border border-black"
      onClick={handleGoogleLogin}
    >
      <img src={Google} alt="google logo" className="mr-2 h-5 w-5" />
      {isSignIn ? "Sign in with Google" : "Sign up with Google"}
    </Button>
  );
};

export default GoogleLogin;
