import { auth, facebookProvider, googleProvider } from "@/helpers/firebase";
import { showToast } from "@/helpers/showToast";
import {
  signInWithPopup,
  linkWithCredential,
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
      const email = error.customData?.email;
      const pendingCred =
        GoogleAuthProvider.credentialFromError(error) ??
        FacebookAuthProvider.credentialFromError(error);

      if (!email || !pendingCred) {
        showToast("error", "Unable to retrieve account information. Please try again.");
        throw error;
      }

      try {
        const providerId = pendingCred.providerId;
        let existingProvider: AuthProvider;
        let existingProviderName: string;
        let newProviderName: string;

        if (providerId === "facebook.com") {
          existingProvider = googleProvider;
          existingProviderName = "Google";
          newProviderName = "Facebook";
        } else if (providerId === "google.com") {
          existingProvider = facebookProvider;
          existingProviderName = "Facebook";
          newProviderName = "Google";
        } else {
          showToast("error", "Unsupported authentication provider");
          throw error;
        }

        showToast(
          "info",
          `This email is already registered with ${existingProviderName}. Linking your ${newProviderName} account...`
        );

        console.log(`🔐 Signing in with ${existingProviderName}...`);
        const existingUserResult = await signInWithPopup(auth, existingProvider);

        console.log(`🔗 Linking ${newProviderName} account...`);
        const linkedUser = await linkWithCredential(existingUserResult.user, pendingCred);

        showToast(
          "success",
          `Success! Both ${existingProviderName} and ${newProviderName} are now linked to your account.`
        );
        
        return linkedUser.user;
      } catch (linkError: any) {
        console.error("❌ Account linking error:", linkError.code);

        if (linkError.code === "auth/popup-closed-by-user") {
          showToast("error", "Sign-in was cancelled. Please try again to link your accounts.");
        } else if (linkError.code === "auth/popup-blocked") {
          showToast("error", "Popup was blocked by your browser. Please allow popups for this site.");
        } else if (linkError.code === "auth/credential-already-in-use") {
          showToast("info", "This account is already linked to another user.");
        } else if (linkError.code === "auth/provider-already-linked") {
          showToast("success", "Your accounts are already linked!");
          if (auth.currentUser) return auth.currentUser;
        } else {
          showToast("error", "Failed to link accounts. Please try signing in with your original provider.");
        }
        
        throw linkError;
      }
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