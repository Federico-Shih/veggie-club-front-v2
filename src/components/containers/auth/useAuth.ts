import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";

export default function useAuth() {
  const auth = getAuth();

  const refreshToken = async () => {
    const userToken = await auth.currentUser?.getIdToken();
    sessionStorage.setItem("token", userToken || "");
    return userToken;
  };

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await refreshToken();
    return userCredential.user.uid;
  };

  const signOut = async () => {
    await auth.signOut();
  };

  return { signIn, signOut, refreshToken };
}
