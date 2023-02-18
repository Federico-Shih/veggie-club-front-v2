import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";

export default function useAuth() {
  const auth = getAuth();

  const refreshToken = async () => {
    return auth.currentUser?.getIdToken();
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
