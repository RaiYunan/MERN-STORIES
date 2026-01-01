import { auth } from "@/helpers/firebase";
import { showToast } from "@/helpers/showToast";
import {
  signInWithPopup,
  type AuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

export const oauthLogin = async (provider: AuthProvider) => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("✅ Sign-in successful:", result);
    return result.user;
  } catch (error: any) {
    console.error("OAuth Error:", error.code);

    // Handle account exists with different credential
    if (error.code === "auth/account-exists-with-different-credential") {
      const pendingCred =
        GoogleAuthProvider.credentialFromError(error) ??
        FacebookAuthProvider.credentialFromError(error);

        console.log("pendingCred: ",pendingCred)
      if (pendingCred) {
        const providerId = pendingCred.providerId;
        let originalProvider: string;

        if (providerId === "facebook.com") {
          originalProvider = "Facebook";
        } else if (providerId === "google.com") {
          originalProvider = "Google";
        } else {
          originalProvider = "another provider";
        }

        showToast(
          "error",
          `This email is already registered with ${originalProvider}. Please sign in with ${originalProvider} instead.`
        );
      } else {
        showToast(
          "error",
          "This email is already registered with another provider. Please use your original sign-in method."
        );
      }
      
      throw error;
    }

    // Handle other common errors
    if (error.code === "auth/popup-closed-by-user") {
      showToast("error", "Sign-in was cancelled");
    } else if (error.code === "auth/popup-blocked") {
      showToast("error", "Popup blocked. Please allow popups for this site and try again.");
    } else if (error.code === "auth/cancelled-popup-request") {
      console.log("ℹ️ Popup cancelled by opening another");
    } else if (error.code === "auth/network-request-failed") {
      showToast("error", "Network error. Please check your connection and try again.");
    } else {
      showToast("error", "Authentication failed. Please try again.");
    }

    throw error;
  }
};