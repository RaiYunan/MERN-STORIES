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
    return result.user;
  } catch (error: any) {
    showToast(
      "error",
      "Error while connecting with facebook. Use another sign-in method"
    );
    if (error.code !== "auth/account-exists-with-different-credential") {
      throw error;
    }

    const email = error.customData?.email;
    const pendingCred =
      GoogleAuthProvider.credentialFromError(error) ??
      FacebookAuthProvider.credentialFromError(error);

    if (!email || !pendingCred) {
      throw error;
    }

    const providerId = pendingCred.providerId;

    let existingProvider: AuthProvider;

    if (providerId === "facebook.com") {
      existingProvider = googleProvider;
    } else if (providerId === "google.com") {
      existingProvider = facebookProvider;
    } else {
      throw new Error("Unsupported provider");
    }

    const existingUserResult = await signInWithPopup(auth, existingProvider);

    const linkedUser = await linkWithCredential(
      existingUserResult.user,
      pendingCred
    );

    return linkedUser.user;
  }
};
